import api from './api'

export interface Color {
  id: number
  rgb: string
  description: string
}

export interface ProductColor {
  id: number
  product_id: number
  color_id: number
  price_adjustment: number
  color: {
    rgb: string
    description: string
  }
}

export const colorService = {
  // 获取所有颜色
  async getAllColors() {
    const response = await api.get<Color[]>('/api/v1/colors')
    return response.data
  },

  // 创建新颜色（管理员）
  async createColor(data: Omit<Color, 'id'>) {
    const response = await api.post<Color>('/api/v1/colors', data)
    return response.data
  },

  // 更新颜色（管理员）
  async updateColor(id: number, data: Partial<Color>) {
    const response = await api.put<Color>(`/api/v1/colors/${id}`, data)
    return response.data
  },

  // 删除颜色（管理员）
  async deleteColor(id: number) {
    await api.delete(`/api/v1/colors/${id}`)
  },

  // 获取产品的所有颜色
  async getProductColors(productId: number) {
    const response = await api.get<ProductColor[]>(`/api/v1/products/${productId}/colors`)
    return response.data
  },

  // 为产品添加颜色（管理员）
  async addProductColor(productId: number, data: {
    color_id: number
    price_adjustment: number
  }) {
    const response = await api.post<ProductColor>(
      `/api/v1/products/${productId}/colors`,
      data
    )
    return response.data
  },

  // 更新产品颜色信息（管理员）
  async updateProductColor(
    productId: number,
    productColorId: number,
    data: Partial<ProductColor>
  ) {
    const response = await api.put<ProductColor>(
      `/api/v1/products/${productId}/colors/${productColorId}`,
      data
    )
    return response.data
  },

  // 删除产品颜色关联（管理员）
  async deleteProductColor(productId: number, productColorId: number) {
    await api.delete(`/api/v1/products/${productId}/colors/${productColorId}`)
  }
}
