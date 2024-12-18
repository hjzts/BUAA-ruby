import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL as string,
  // baseURL: 'http://localhost:3000' as string,
  baseURL: 'http://22373058.project.rubyapp.act.buaa.edu.cn:9000', // 开发环境
  withCredentials: true
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `${token}`
  }
  // console.log("config: ",config)
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()

    // 如果是401错误，说明token可能失效
    if (error.response?.status === 401) {
      authStore.setToken(null)
      await router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default api
