import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('snapzy_token', token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('snapzy_token');
  }
}

export function loadTokenFromStorage() {
  const token = localStorage.getItem('snapzy_token');
  if (token) setAuthToken(token);
  return token;
}

// Auth
export const AuthAPI = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  updateMe: (payload) => api.put('/auth/me', payload).then((r) => r.data),
};

// Posts
export const PostAPI = {
  feed: (params) => api.get('/posts/feed', { params }).then((r) => r.data),
  explore: (params) => api.get('/posts/explore', { params }).then((r) => r.data),
  bookmarks: (params) => api.get('/posts/bookmarks', { params }).then((r) => r.data),
  toggleBookmark: (postId) => api.post(`/posts/${postId}/bookmark`).then((r) => r.data),
  byUser: (userId, params) => api.get(`/posts/user/${userId}`, { params }).then((r) => r.data),
  create: (formData) => api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  like: (postId) => api.post(`/posts/${postId}/like`).then((r) => r.data),
  comment: (postId, text) => api.post(`/posts/${postId}/comment`, { text }).then((r) => r.data),
  update: (postId, caption) => api.put(`/posts/${postId}`, { caption }).then((r) => r.data),
  delete: (postId) => api.delete(`/posts/${postId}`).then((r) => r.data),
};

// Users
export const UserAPI = {
  profile: (username) => api.get(`/users/${username}`).then((r) => r.data),
  follow: (userId) => api.post(`/users/${userId}/follow`).then((r) => r.data),
  unfollow: (userId) => api.post(`/users/${userId}/unfollow`).then((r) => r.data),
  search: (q) => api.get('/users/search', { params: { q } }).then((r) => r.data),
};