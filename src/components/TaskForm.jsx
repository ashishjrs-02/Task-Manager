import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const TaskForm = ({ onSubmit, initialData = null, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    },
  });

  const [subtasks, setSubtasks] = useState(initialData?.subtasks || []);
  const [subtaskInput, setSubtaskInput] = useState('');

  const addSubtask = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks([...subtasks, { title: subtaskInput.trim(), completed: false }]);
    setSubtaskInput('');
  };

  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data) => {
    await onSubmit({ ...data, subtasks });
    reset();
    setSubtasks([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center 
      justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg 
        max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          {initialData ? 'Edit Task' : 'Create New Task'}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">Title *</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 
              py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 
              py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task description (optional)"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 w-full border border-gray-300 rounded-lg 
                px-3 py-2 text-sm focus:outline-none focus:ring-2 
                focus:ring-blue-500"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                {...register('priority')}
                className="mt-1 w-full border border-gray-300 rounded-lg 
                px-3 py-2 text-sm focus:outline-none focus:ring-2 
                focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              {...register('dueDate')}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 
              py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subtasks */}
          <div>
            <label className="text-sm font-medium text-gray-700">Subtasks</label>
            <div className="flex gap-2 mt-1">
              <input
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && 
                  (e.preventDefault(), addSubtask())}
                className="flex-1 border border-gray-300 rounded-lg px-3 
                py-2 text-sm focus:outline-none focus:ring-2 
                focus:ring-blue-500"
                placeholder="Add a subtask"
              />
              <button
                type="button"
                onClick={addSubtask}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg 
                text-sm hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
            {subtasks.length > 0 && (
              <ul className="mt-2 space-y-1">
                {subtasks.map((s, i) => (
                  <li key={i} className="flex items-center justify-between 
                    bg-gray-50 px-3 py-2 rounded-lg text-sm">
                    <span>{s.title}</span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(i)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white 
              py-2 rounded-lg font-medium text-sm transition 
              disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : initialData
                ? 'Update Task'
                : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 
              py-2 rounded-lg font-medium text-sm transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;