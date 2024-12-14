import api from './api'
import type { Product } from './product'

export interface Favorite {
  id: number
  added_at: string
  product: Product
}

export const favoriteService = {
  // 获取收藏列表
  async getFavorites() {
    const response = await api.get<{data: Favorite[]}>('/api/v1/favorites')
    return response.data.data
  },

  // 添加收藏
  async addFavorite(productId: number) {
    const response = await api.post<{data: Favorite}>('/api/v1/favorites', {
      product_id: productId
    })
    return response.data.data
  },

  // 取消收藏
  async removeFavorite(productId: number) {
    await api.delete(`/api/v1/favorites/${productId}`)
  },

  // 检查是否已收藏
  async checkFavorite(productId: number) {
    const response = await api.get<{is_favorited: boolean}>(`/api/v1/favorites/check/${productId}`)
    return response.data.is_favorited
  }
}
