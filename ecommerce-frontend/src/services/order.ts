import type { Order, CreateOrderData } from '@/types/order'
import type { PaginatedResponse, PaginationParams } from '@/types/common.ts'
import api from './api.ts'
import type { ApiResponse } from '@/types/response.ts'

export const orderService = {
  // 获取订单列表
  async getOrders(params: { status?: string } & PaginationParams = {}) {
    const response = await api.get<PaginatedResponse<Order>>('/orders', {
      params
    })
    return response.data
  },

  // 获取订单详情
  async getOrder(id: number) {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`)
    return response.data
  },

  // 创建订单
  async createOrder(data: CreateOrderData) {
    const response = await api.post<ApiResponse<Order>>('/orders', data)
    return response.data
  },

  // 支付订单
  async payOrder(id: number) {
    const response = await api.post<ApiResponse<Order>>(`/orders/${id}/pay`)
    return response.data
  },

  // 确认收货
  async confirmDelivery(id: number) {
    const response = await api.post<ApiResponse<Order>>(`/orders/${id}/confirm_delivery`)
    return response.data
  },

  // 取消订单
  async cancelOrder(id: number, reason: string) {
    const response = await api.post<ApiResponse<Order>>(`/orders/${id}/cancel`, {
      reason
    })
    return response.data
  },

  // 获取管理员订单列表
  async getAdminOrders(params: { status?: string } & PaginationParams = {}) {
    const response = await api.get<PaginatedResponse<Order>>('/admin/orders', {
      params
    })
    return response.data
  },

  // 管理员发货
  async shipOrder(id: number) {
    const response = await api.post<ApiResponse<Order>>(`/admin/orders/${id}/ship`)
    return response.data
  }
}
