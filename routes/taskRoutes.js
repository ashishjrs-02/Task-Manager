const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleSubtask,
  shareTask,
  removeCollaborator,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeTaskOwner } = require('../middleware/authorizeMiddleware');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(authorizeTaskOwner, getTaskById)
  .put(authorizeTaskOwner, updateTask)
  .delete(authorizeTaskOwner, deleteTask);

router.patch('/:id/subtasks/:subtaskId', authorizeTaskOwner, toggleSubtask);
router.post('/:id/share', authorizeTaskOwner, shareTask);
router.delete('/:id/share/:userId', authorizeTaskOwner, removeCollaborator);

module.exports = router;