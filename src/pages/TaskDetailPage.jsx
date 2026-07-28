import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskService from '../services/taskService';
import TaskForm from '../components/TaskForm';
import ShareTask from '../components/ShareTask';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import {
  formatDate,
  isOverdue,
  isDueSoon,
  getPriorityColor,
  getStatusColor,
} from '../utils/helpers';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState('');

  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTaskById(id);
      setTask(data);
    } catch (err) {
      setError('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      const updated = await taskService.updateTask(id, data);
      setTask(updated);
      setShowEditForm(false);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await taskService.deleteTask(id);
      navigate('/dashboard');
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const updated = await taskService.toggleSubtask(id, subtaskId);
      setTask(updated);
    } catch (err) {
      setError('Failed to update subtask');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Loader />
    </div>
  );

  if (error || !task) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="text-center py-20 text-red-500">{error}</div>
    </div>
  );

  const isOwner = task.owner?._id === user?._id ||
    task.owner === user?._id;
  const overdue = isOverdue(task.dueDate, task.status);
  const dueSoon = isDueSoon(task.dueDate, task.status);
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks?.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700
          text-sm mb-6 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* Top row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            <span className={`text-sm font-medium px-3 py-1 rounded-full
              whitespace-nowrap ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>

          {/* Owner + Collaborators info */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1
              rounded-full font-medium">
              Owner: {task.owner?.name || 'You'}
            </span>
            {task.sharedWith?.length > 0 && (
              <span className="text-xs bg-purple-50 text-purple-700 px-3
                py-1 rounded-full font-medium">
                {task.sharedWith.length} Collaborator
                {task.sharedWith.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Priority:</span>
              <span className={`text-sm font-semibold uppercase
                ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Due:</span>
              <span className={`text-sm font-medium
                ${overdue ? 'text-red-500' :
                dueSoon ? 'text-yellow-600' : 'text-gray-700'}`}>
                {overdue && '⚠ '}
                {dueSoon && !overdue && '⏰ '}
                {formatDate(task.dueDate)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Created:</span>
              <span className="text-sm text-gray-700">
                {formatDate(task.createdAt)}
              </span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Description
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          {/* Subtasks */}
          {totalSubtasks > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Subtasks ({completedSubtasks}/{totalSubtasks})
              </h2>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                  }}
                />
              </div>
              <ul className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <li
                    key={subtask._id}
                    onClick={() => handleToggleSubtask(subtask._id)}
                    className="flex items-center gap-3 p-3 rounded-lg
                    bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex
                      items-center justify-center flex-shrink-0 transition
                      ${subtask.completed
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'}`}>
                      {subtask.completed && (
                        <svg className="w-3 h-3 text-white" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${subtask.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-700'}`}>
                      {subtask.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowEditForm(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white
              py-2.5 rounded-xl font-medium text-sm transition"
            >
              Edit Task
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white
              py-2.5 rounded-xl font-medium text-sm transition"
            >
              Share Task
            </button>
            {isOwner && (
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600
                py-2.5 rounded-xl font-medium text-sm transition"
              >
                Delete Task
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditForm && (
        <TaskForm
          initialData={{
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate
              ? new Date(task.dueDate).toISOString().split('T')[0]
              : '',
            subtasks: task.subtasks,
          }}
          onSubmit={handleUpdate}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareTask
          taskId={task._id}
          sharedWith={task.sharedWith}
          isOwner={isOwner}
          onClose={() => {
            setShowShareModal(false);
            fetchTask(); // refresh to show updated collaborators
          }}
        />
      )}
    </div>
  );
};

export default TaskDetailPage;