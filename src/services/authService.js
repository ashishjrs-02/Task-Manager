import api from './api';

const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export default { signup, login, getMe };