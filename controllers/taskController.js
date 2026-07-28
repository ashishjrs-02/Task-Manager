const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { completedTemplate } = require('../utils/emailTemplates');

const emitToUser = (req, userId, event, payload) => {
  const io = req.app.get('io');
  if (io) io.to(userId.toString()).emit(event, payload);
};

// Emit to owner + all collaborators
const emitToAll = (req, task, event, payload) => {
  emitToUser(req, task.owner, event, payload);
  task.sharedWith.forEach((userId) => {
    emitToUser(req, userId, event, payload);
  });
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, subtasks } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      subtasks,
      owner: req.user._id,
    });

    emitToUser(req, req.user._id, 'task:created', task);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all tasks for logged in user (owned + shared)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy } = req.query;

    // Get tasks owned by user OR shared with user
    const filter = {
      $or: [
        { owner: req.user._id },
        { sharedWith: req.user._id },
      ],
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    let query = Task.find(filter).populate('owner', 'name email')
      .populate('sharedWith', 'name email');

    if (sortBy === 'dueDate') query = query.sort({ dueDate: 1 });
    else query = query.sort({ createdAt: -1 });

    const tasks = await query;
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  const task = await req.task.populate('owner', 'name email');
  res.json(task);
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = req.task;
    const wasCompleted = task.status === 'done';

    // Collaborators cannot change ownership or sharing
    const { sharedWith, owner, ...safeUpdates } = req.body;
    Object.assign(task, safeUpdates);
    await task.save();

    // Emit to all collaborators + owner
    emitToAll(req, task, 'task:updated', task);

    if (!wasCompleted && task.status === 'done') {
      const notification = await Notification.create({
        user: task.owner,
        task: task._id,
        message: `Task "${task.title}" marked as completed! 🎉`,
        type: 'completed',
      });

      emitToUser(req, task.owner, 'notification:new', notification);

      const user = await User.findById(task.owner);
      await sendEmail({
        to: user.email,
        subject: '🎉 Task Completed - TaskFlow',
        html: completedTemplate(task.title, user.name),
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a task (owner only)
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    if (!req.isOwner) {
      return res.status(403).json({ message: 'Only the owner can delete this task' });
    }

    emitToAll(req, req.task, 'task:deleted', { _id: req.task._id });
    await req.task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle subtask completion
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
// @access  Private
const toggleSubtask = async (req, res) => {
  try {
    const task = req.task;
    const subtask = task.subtasks.id(req.params.subtaskId);

    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    subtask.completed = !subtask.completed;
    await task.save();

    emitToAll(req, task, 'task:updated', task);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Share task with another user by email
// @route   POST /api/tasks/:id/share
// @access  Private (owner only)
const shareTask = async (req, res) => {
  try {
    const { email } = req.body;

    if (!req.isOwner) {
      return res.status(403).json({ message: 'Only the owner can share this task' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user to share with
    const userToShare = await User.findOne({ email });
    if (!userToShare) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    // Cannot share with yourself
    if (userToShare._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot share a task with yourself' });
    }

    const task = req.task;

    // Already shared
    if (task.sharedWith.map((id) => id.toString())
      .includes(userToShare._id.toString())) {
      return res.status(400).json({ message: 'Task already shared with this user' });
    }

    task.sharedWith.push(userToShare._id);
    await task.save();

    // Notify the shared user
    const notification = await Notification.create({
      user: userToShare._id,
      task: task._id,
      message: `${req.user.name} shared a task with you: "${task.title}"`,
      type: 'general',
    });

    emitToUser(req, userToShare._id, 'notification:new', notification);
    emitToUser(req, userToShare._id, 'task:created', task);

    res.json({ message: `Task shared with ${userToShare.name} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove a collaborator from task
// @route   DELETE /api/tasks/:id/share/:userId
// @access  Private (owner only)
const removeCollaborator = async (req, res) => {
  try {
    if (!req.isOwner) {
      return res.status(403).json({ message: 'Only the owner can remove collaborators' });
    }

    const task = req.task;
    task.sharedWith = task.sharedWith
      .filter((id) => id.toString() !== req.params.userId);
    await task.save();

    emitToUser(req, req.params.userId, 'task:deleted', { _id: task._id });
    res.json({ message: 'Collaborator removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleSubtask,
  shareTask,
  removeCollaborator,
};