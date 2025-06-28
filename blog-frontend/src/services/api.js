import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Posts API
export const getPosts = () => api.get('/api/posts');
export const getPostBySlug = (slug) => api.get(`/api/posts/${slug}`);
export const createPost = (postData) => api.post('/api/posts/create', postData);
export const updatePost = (slug, postData) => api.put(`/api/posts/${slug}`, postData);
export const deletePost = (slug) => api.delete(`/api/posts/${slug}`);

// Health check
export const checkHealth = () => api.get('/api/health');

export default api;
