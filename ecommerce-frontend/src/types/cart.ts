import type { Product } from '@/types/product.ts'

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  added_at: string
  product: Product
  subtotal: number
}

export interface CartItemUpdate {
  id: number
  quantity: number
}
