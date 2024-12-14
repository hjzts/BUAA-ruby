import type { Product } from '@/types/product.ts'

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: number
  user_id: number
  recipient_name: string
  shipping_address: string
  phone_number: string
  postal_code: string
  status: OrderStatus
  total_amount: number
  paid_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
  product: Product
}

export interface CreateOrderData {
  recipient_name: string
  shipping_address: string
  phone_number: string
  postal_code: string
}
