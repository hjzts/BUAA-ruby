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
  categories: Array<{
    id: number
    name: string
  }>
  sizes: Array<{
    id: number
    size_name: string
    stock_quantity: number
    price_adjustment: number
  }>
  colors: Array<{
    id: number
    rgb: string
    description: string
    price_adjustment: number
  }>
  designs: Array<{
    id: number
    design_number: string
    price_adjustment: number
  }>
}

interface ProductFilters {
  category_id?: number
  available?: boolean
  min_price?: number
  max_price?: number
  search?: string
  page?: number
  per_page?: number
}
export const productService = {
  // 获取产品列表
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

  // 获取产品详情
  async getProduct(id: number) {
    const response = await api.get<Product>(`/api/v1/products/${id}`)
    return response.data
  },

  // 管理员创建产品
  async createProduct(formData: FormData) {
    const response = await api.post<Product>('/api/v1/admin/products', formData)
    return response.data
  },

  // 管理员更新产品
  async updateProduct(id: number, formData: FormData) {
    const response = await api.put<Product>(`/api/v1/admin/products/${id}`, formData)
    return response.data
  },

  // 管理员删除产品
  async deleteProduct(id: number) {
    await api.delete(`/api/v1/admin/products/${id}`)
  }
}
