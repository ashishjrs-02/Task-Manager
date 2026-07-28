import api from './api';

const getTasks = async (filters = {}) => {
  const response = await api.get('/tasks', { params: filters });
  return response.data;
};

const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

const toggleSubtask = async (taskId, subtaskId) => {
  const response = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`);
  return response.data;
};

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleSubtask,
};