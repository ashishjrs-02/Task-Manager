const Task = require('../models/Task');

// Checks user is owner OR a collaborator of the task
const authorizeTaskOwner = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isOwner = task.owner.toString() === req.user._id.toString();
    const isCollaborator = task.sharedWith
      .map((id) => id.toString())
      .includes(req.user._id.toString());

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    req.task = task;
    req.isOwner = isOwner; // useful for restricting delete to owner only
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

module.exports = { authorizeTaskOwner };