import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: import.meta.env.MODE === 'production'
  ? 'http://15.235.211.149:5000'
  : 'http://localhost:5000',
  withCredentials: true             // 🔥 THIS is the real fix
})

export default defineBoot(({ app }) => {

  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  api.interceptors.response.use(
    res => res,
    err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(err);
    }
  );

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})



export { api }
