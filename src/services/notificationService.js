import api from './api';

const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

const markAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

const markAllAsRead = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};

export default { getNotifications, markAsRead, markAllAsRead };