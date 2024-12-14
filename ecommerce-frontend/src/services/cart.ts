import type { CartItem, CartItemUpdate } from '@/types/cart'
import type { ApiResponse } from '@/types/response.ts'
import api from './api.ts'

export const cartService = {
  // 获取购物车列表
  async getCartItems() {
    const response = await api.get<ApiResponse<CartItem[]>>('/cart_items')
    return response.data
  },

  // 添加商品到购物车
  async addToCart(productId: number, quantity: number) {
    const response = await api.post<ApiResponse<CartItem>>('/cart_items', {
      cart_item: { product_id: productId, quantity }
    })
    return response.data
  },

  // 更新购物车商品数量
  async updateCartItem(id: number, quantity: number) {
    const response = await api.put<ApiResponse<CartItem>>(`/cart_items/${id}`, {
      cart_item: { quantity }
    })
    return response.data
  },

  // 批量更新购物车
  async batchUpdateCart(updates: CartItemUpdate[]) {
    const response = await api.post<ApiResponse<CartItem[]>>('/cart_items/batch_update', {
      updates
    })
    return response.data
  },

  // 删除购物车商品
  async removeFromCart(id: number) {
    await api.delete(`/cart_items/${id}`)
  },

  // 清空购物车
  async clearCart() {
    await api.delete('/cart_items/clear')
  },

  // 获取购物车商品总数
  async getCartCount() {
    const response = await api.get<{ count: number }>('/cart_items/count')
    return response.data
  }
}
