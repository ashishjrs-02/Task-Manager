import { useState } from 'react';
import useTasks from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';

const DashboardPage = () => {
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);

  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks(filters);

  const handleCreate = async (data) => {
    await createTask(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const handleStatusChange = async (id, data) => {
    await updateTask(id, data);
  };

  // Stats
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const doneTasks = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage and track your tasks
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 
            py-2.5 rounded-xl font-medium text-sm transition 
            flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            New Task
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border 
            border-gray-200 text-center">
            <p className="text-3xl font-bold text-gray-800">{totalTasks}</p>
            <p className="text-sm text-gray-500 mt-1">Total</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border 
            border-gray-200 text-center">
            <p className="text-3xl font-bold text-gray-500">{todoTasks}</p>
            <p className="text-sm text-gray-500 mt-1">Todo</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border 
            border-gray-200 text-center">
            <p className="text-3xl font-bold text-blue-500">
              {inProgressTasks}
            </p>
            <p className="text-sm text-gray-500 mt-1">In Progress</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border 
            border-gray-200 text-center">
            <p className="text-3xl font-bold text-green-500">{doneTasks}</p>
            <p className="text-sm text-gray-500 mt-1">Done</p>
          </div>
        </div>

        {/* Filters */}
        <TaskFilters filters={filters} onFilterChange={setFilters} />

        {/* Task List */}
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-500 text-lg">No tasks found</p>
            <p className="text-gray-400 text-sm mt-1">
              Click "New Task" to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;