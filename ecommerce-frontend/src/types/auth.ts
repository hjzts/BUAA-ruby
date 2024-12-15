import type { User } from '@/types/user.ts'

export interface User {
    id: number
    email: string
    username: string
    role: 'admin' | 'buyer'
}

export interface LoginForm {
    email: string
    password: string
}

export interface RegisterForm extends LoginForm {
    username: string
    password_confirmation: string
}

export interface AuthResponse {
    status: {
        code: number
        message: string
    }
    data: User
}
