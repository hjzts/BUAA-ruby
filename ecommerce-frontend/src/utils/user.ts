import api from './api'
import type { User } from '@/types/auth.ts'

interface ProfileUpdateData {
  username?: string
  phone?: string
  address?: string
  bio?: string
  avatar?: File
}

interface PasswordUpdateData {
  current_password: string
  password: string
  password_confirmation: string
}

export const userService = {
  async updateProfile(data: ProfileUpdateData) {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value)
      }
    })

    const response = await api.put<{data: User}>('/api/v1/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async updatePassword(data: PasswordUpdateData) {
    const response = await api.put('/api/v1/password', data)
    return response.data
  },

  async getProfile() {
    const response = await api.get('/api/v1/profile')
    console.log("response: ",response)
    return response.data
  }
}
