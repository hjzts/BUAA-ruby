import type { Favorite } from '@/types/favorite'
import type { ApiResponse } from '@/types/response.ts'
import api from './api.ts'

export const favoriteService = {
  // 获取收藏列表
  async getFavorites() {
    const response = await api.get<ApiResponse<Favorite[]>>('/favorites')
    return response.data
  },

  // 添加收藏
  async addFavorite(productId: number) {
    const response = await api.post<ApiResponse<Favorite>>('/favorites', {
      product_id: productId
    })
    return response.data
  },

  // 取消收藏
  async removeFavorite(id: number) {
    await api.delete(`/favorites/${id}`)
  },

  // 检查是否已收藏
  async checkFavorite(productId: number) {
    const response = await api.get<{ is_favorited: boolean }>(`/favorites/check/${productId}`)
    console.log("checkFavorite: ", response.data.is_favorited)
    return response.data.is_favorited
  }
}
