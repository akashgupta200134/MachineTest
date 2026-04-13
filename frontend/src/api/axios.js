import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', 
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.message || err.message || 'Network error';
    return Promise.reject(new Error(msg));
  }
);

api.interceptors.request.use(req => {
  console.log("REQUEST URL:", req.baseURL + req.url);
  return req;
});

export default api;