import axios from 'axios'
import type { ApiResponse } from '@/types/response'

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  baseURL: import.meta.env.PROD
    ? '/api/v1'  // 生产环境
    : 'http://localhost:3000/api/v1', // 开发环境
  timeout: 100000,
  withCredentials: true
})

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // console.log("config: ", config)
  return config
})

// 响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 处理未授权情况
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
