const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('./sendEmail');
const { dueSoonTemplate } = require('./emailTemplates');

const checkDueSoonTasks = async (io) => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const dueSoonTasks = await Task.find({
      status: { $ne: 'done' },
      dueDate: { $gte: now, $lte: oneHourFromNow },
    });

    for (const task of dueSoonTasks) {
      const alreadyNotified = await Notification.findOne({
        task: task._id,
        type: 'due-soon',
      });

      if (alreadyNotified) continue;

      const notification = await Notification.create({
        user: task.owner,
        task: task._id,
        message: `Task "${task.title}" is due within an hour`,
        type: 'due-soon',
      });

      // Real-time socket notification
      io.to(task.owner.toString()).emit('notification:new', notification);

      // Send real email
      const user = await User.findById(task.owner);
      if (user) {
        await sendEmail({
          to: user.email,
          subject: '⏰ Task Due Soon - TaskFlow',
          html: dueSoonTemplate(task.title, task.dueDate),
        });
      }
    }
  } catch (error) {
    console.error('Scheduler error:', error.message);
  }
};

const startDueSoonScheduler = (io) => {
  setInterval(() => checkDueSoonTasks(io), 5 * 60 * 1000);
  console.log('Due-soon scheduler started (runs every 5 minutes)');
};

module.exports = { startDueSoonScheduler };