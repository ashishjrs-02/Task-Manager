import { useNavigate } from 'react-router-dom';
import {
  formatDate,
  isOverdue,
  isDueSoon,
  getPriorityColor,
  getStatusColor,
} from '../utils/helpers';

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const navigate = useNavigate();
  const overdue = isOverdue(task.dueDate, task.status);
  const dueSoon = isDueSoon(task.dueDate, task.status);

  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks?.length;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md 
        transition cursor-pointer
        ${overdue ? 'border-red-300' : 'border-gray-200'}
        ${dueSoon ? 'border-yellow-300' : ''}
      `}
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-gray-800 text-base leading-snug">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0">
        <span className={`text-xs font-medium px-2 py-1 rounded-full
          whitespace-nowrap ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        {task.sharedWith?.length > 0 && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1
            rounded-full whitespace-nowrap">
            👥 {task.sharedWith.length}
          </span>
        )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Subtasks progress */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Subtasks</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all"
              style={{
                width: `${(completedSubtasks / totalSubtasks) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-3">
        {/* Priority + Due date */}
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold uppercase 
            ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`text-xs 
            ${overdue ? 'text-red-500 font-semibold' : 
            dueSoon ? 'text-yellow-600 font-semibold' : 'text-gray-400'}`}>
            {overdue && '⚠ Overdue · '}
            {dueSoon && !overdue && '⏰ Due Soon · '}
            {formatDate(task.dueDate)}
          </span>
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick status toggle */}
          {task.status !== 'done' && (
            <button
              onClick={() => onStatusChange(task._id, { status: 'done' })}
              className="text-xs bg-green-100 text-green-700 px-2 py-1 
              rounded-lg hover:bg-green-200 transition"
            >
              ✓ Done
            </button>
          )}
          {/* Delete */}
          <button
            onClick={() => onDelete(task._id)}
            className="text-xs bg-red-100 text-red-600 px-2 py-1 
            rounded-lg hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;