import axios from 'axios'
import type { User } from '@/types/user'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(`${baseURL}/login`, {
      user: { email, password }
    })
    // 保存token
    const token = response.headers['authorization']
    if (token) {
      localStorage.setItem('token', token)
    }
    return response.data
  },

  async register(data: {
    email: string
    password: string
    password_confirmation: string
    username: string
  }) {
    const response = await axios.post(`${baseURL}/signup`, {
      user: data
    })
    const token = response.headers['authorization']
    if (token) {
      localStorage.setItem('token', token)
    }
    return response.data
  },

  async logout() {
    const token = localStorage.getItem('token')
    if (token) {
      await axios.delete(`${baseURL}/logout`, {
        headers: { Authorization: token }
      })
      localStorage.removeItem('token')
    }
  }
}
