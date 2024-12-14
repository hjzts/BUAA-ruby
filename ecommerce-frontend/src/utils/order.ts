import api from './api'

export interface OrderItem {
  id: number
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: number
  recipient_name: string
  shipping_address: string
  phone_number: string
  postal_code: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  paid_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  created_at: string
  items: OrderItem[]
}

export interface CreateOrderData {
  order: {
    recipient_name: string
    shipping_address: string
    phone_number: string
    postal_code: string
  }
  items: {
    product_id: number
    quantity: number
  }[]
}

export const orderService = {
  async getOrders(params: {
    status?: string
    page?: number
    per_page?: number
  } = {}) {
    const response = await api.get<{ data: Order[] }>('/api/v1/orders', { params })
    return response.data.data
  },

  async getOrder(id: number) {
    const response = await api.get<{ data: Order }>(`/api/v1/orders/${id}`)
    return response.data.data
  },

  async createOrder(data: CreateOrderData) {
    const response = await api.post<{ data: Order }>('/api/v1/orders', data)
    return response.data.data
  },

  async payOrder(id: number) {
    const response = await api.put<{ data: Order }>(`/api/v1/orders/${id}`, {
      action_type: 'pay'
    })
    return response.data.data
  },

  async cancelOrder(id: number, reason: string) {
    const response = await api.post<{ data: Order }>(`/api/v1/orders/${id}/cancel`, {
      reason
    })
    return response.data.data
  }
}
