import api from './api'

export interface Size {
  id: number
  size_name: string
  description: string
}

export interface ProductSize {
  id: number
  product_id: number
  size_id: number
  stock_quantity: number
  price_adjustment: number
  size_name: string
  size_description: string
}

export const sizeService = {
  // 获取所有尺码
  async getAllSizes() {
    const response = await api.get<Size[]>('/api/v1/sizes')
    return response.data
  },

  // 创建新尺码（管理员）
  async createSize(data: Omit<Size, 'id'>) {
    const response = await api.post<Size>('/api/v1/sizes', data)
    return response.data
  },

  // 更新尺码（管理员）
  async updateSize(id: number, data: Partial<Size>) {
    const response = await api.put<Size>(`/api/v1/sizes/${id}`, data)
    return response.data
  },

  // 删除尺码（管理员）
  async deleteSize(id: number) {
    await api.delete(`/api/v1/sizes/${id}`)
  },

  // 获取产品的所有尺码
  async getProductSizes(productId: number) {
    const response = await api.get<ProductSize[]>(`/api/v1/products/${productId}/sizes`)
    return response.data
  },

  // 为产品添加尺码（管理员）
  async addProductSize(productId: number, data: {
    size_id: number
    stock_quantity: number
    price_adjustment: number
  }) {
    const response = await api.post<ProductSize>(
      `/api/v1/products/${productId}/sizes`,
      data
    )
    return response.data
  },

  // 更新产品尺码信息（管理员）
  async updateProductSize(
    productId: number,
    productSizeId: number,
    data: Partial<ProductSize>
  ) {
    const response = await api.put<ProductSize>(
      `/api/v1/products/${productId}/sizes/${productSizeId}`,
      data
    )
    return response.data
  },

  // 删除产品尺码关联（管理员）
  async deleteProductSize(productId: number, productSizeId: number) {
    await api.delete(`/api/v1/products/${productId}/sizes/${productSizeId}`)
  }
}
