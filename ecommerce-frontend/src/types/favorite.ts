import type { Product } from '@/types/product.ts'

export interface Favorite {
  id: number
  user_id: number
  product_id: number
  added_at: string
  product: Product
}
