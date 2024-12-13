import api from './api'

export interface Design {
  id: number
  design_number: string
  sales: number
}

export interface ProductDesign {
  id: number
  product_id: number
  design_id: number
  price_adjustment: number
  design_number: string
  sales: number
}

export const designService = {
  // 获取所有设计
  async getAllDesigns() {
    const response = await api.get<Design[]>('/api/v1/designs')
    return response.data
  },

  // 创建新设计（管理员）
  async createDesign(data: Omit<Design, 'id' | 'sales'>) {
    const response = await api.post<Design>('/api/v1/designs', data)
    return response.data
  },

  // 更新设计（管理员）
  async updateDesign(id: number, data: Partial<Design>) {
    const response = await api.put<Design>(`/api/v1/designs/${id}`, data)
    return response.data
  },

  // 删除设计（管理员）
  async deleteDesign(id: number) {
    await api.delete(`/api/v1/designs/${id}`)
  },

  // 获取产品的所有设计
  async getProductDesigns(productId: number) {
    const response = await api.get<ProductDesign[]>(`/api/v1/products/${productId}/designs`)
    return response.data
  },

  // 为产品添加设计（管理员）
  async addProductDesign(productId: number, data: {
    design_id: number
    price_adjustment: number
  }) {
    const response = await api.post<ProductDesign>(
      `/api/v1/products/${productId}/designs`,
      data
    )
    return response.data
  },

  // 更新产品设计信息（管理员）
  async updateProductDesign(
    productId: number,
    productDesignId: number,
    data: Partial<ProductDesign>
  ) {
    const response = await api.put<ProductDesign>(
      `/api/v1/products/${productId}/designs/${productDesignId}`,
      data
    )
    return response.data
  },

  // 删除产品设计关联（管理员）
  async deleteProductDesign(productId: number, productDesignId: number) {
    await api.delete(`/api/v1/products/${productId}/designs/${productDesignId}`)
  }
}
