export interface User {
  id: number
  email: string
  username: string
  role: 'admin' | 'buyer'
  phone_number?: string
  address?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}
