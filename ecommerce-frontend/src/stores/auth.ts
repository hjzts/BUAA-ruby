import { defineStore } from 'pinia'
import type { User, LoginForm, RegisterForm, AuthResponse } from '@/types/auth'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: localStorage.getItem('token'),
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin',
    },

    actions: {
        async login(form: LoginForm) {
            try {
                const payload = {
                    "user":form
                }
                const response = await api.post<AuthResponse>('/login', payload)

                const token = response.headers.authorization
                this.token = token
                this.user = response.data.data
                localStorage.setItem('token', token)
                return response.data
            } catch (error) {
                console.error('Login failed:', error)
                throw error
            }
        },

        async register(form: RegisterForm) {
            try {
                const payload = {
                    "user": form
                }
                const response = await api.post<AuthResponse>('/signup', payload)

                const token = response.headers.authorization
                this.token = token
                this.user = response.data.data
                localStorage.setItem('token', token)
                return response.data
            } catch (error) {
                console.error('Registration failed:', error)
                throw error
            }
        },

        async logout() {
            try {
                await api.delete('/logout')
                this.token = null
                this.user = null
                localStorage.removeItem('token')
            } catch (error) {
                console.error('Logout failed:', error)
                throw error
            }
        }
    }
})