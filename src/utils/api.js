import axios from 'axios';
import { getCookie } from './cookie';

// 获取 API 基础 URL
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const basePath = import.meta.env.VITE_PUBLIC_PATH;

// 创建 Axios 实例
const apiClient = axios.create({
  baseURL: basePath === '/dev' ? '/dev' : apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器（可选：添加 CSRF Token）
apiClient.interceptors.request.use((config) => {
  const xsrf_token = getCookie('XSRF-TOKEN')
  // 在这里可以动态注入 CSRF Token，例如从 Cookie 或 LocalStorage 获取
  if(xsrf_token) config.headers['X-XSRF-TOKEN'] = xsrf_token;
  return config;
});

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 根据 HTTP 状态码处理错误
      switch (error.response.status) {
        case 400:
          console.error('Bad Request:', error.response.data);
          break;
        case 401:
          console.error('Unauthorized:', error.response.data);
          break;
        case 403:
          console.error('Forbidden:', error.response.data);
          break;
        case 500:
          console.error('Internal Server Error:', error.response.data);
          break;
        default:
          console.error('Unexpected Error:', error.response.data);
      }
    } else {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;