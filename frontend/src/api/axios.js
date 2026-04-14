import axios from 'axios';

const api = axios.create({
  baseURL: "https://machinetestnimap.onrender.com", 
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