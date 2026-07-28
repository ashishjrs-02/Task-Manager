import { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';
import { useSocket } from '../context/SocketContext';

const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocket();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasks(filters);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Real-time updates via Socket.io
  useEffect(() => {
    if (!socket) return;

    socket.on('task:created', (newTask) => {
      setTasks((prev) => [newTask, ...prev]);
    });

    socket.on('task:updated', (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    });

    socket.on('task:deleted', ({ _id }) => {
      setTasks((prev) => prev.filter((t) => t._id !== _id));
    });

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
    };
  }, [socket]);

  const createTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
    } catch (err) {
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      await taskService.updateTask(id, taskData);
    } catch (err) {
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
    } catch (err) {
      throw err;
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    try {
      await taskService.toggleSubtask(taskId, subtaskId);
    } catch (err) {
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleSubtask,
  };
};

export default useTasks;