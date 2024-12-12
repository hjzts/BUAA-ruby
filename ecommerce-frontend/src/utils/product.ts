import api from './api'

export interface Product {
  id: number
  product_name: string
  description: string
  price: number
  stock_quantity: number
  sales_count: number
  status: 'active' | 'inactive' | 'deleted'
  image_url?: string
  in_stock: boolean
}

interface ProductFilters {
  available?: boolean
  min_price?: number
  max_price?: number
  search?: string
  page?: number
  per_page?: number
}

export const productService = {
  async getProducts(filters: ProductFilters = {}) {
    const response = await api.get<{
      products: Product[]
      meta: {
        total_pages: number
        current_page: number
        total_count: number
      }
    }>('/api/v1/products', { params: filters })
    return response.data
  },

  async getProduct(id: number) {
    const response = await api.get<Product>(`/api/v1/products/${id}`)
    return response.data
  },

  async createProduct(formData: FormData) {
    const response = await api.post<Product>('/api/v1/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async updateProduct(id: number, formData: FormData) {
    const response = await api.put<Product>(`/api/v1/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async deleteProduct(id: number) {
    await api.delete(`/api/v1/products/${id}`)
  },

  async manageStock(id: number, operation: 'increase' | 'decrease', amount: number) {
    const response = await api.post<Product>(`/api/v1/products/${id}/manage_stock`, {
      operation,
      amount
    })
    return response.data
  }
}
