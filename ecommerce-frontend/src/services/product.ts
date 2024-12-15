import api from './api'
import type { Product, ProductFilters, CreateProductData } from '@/types/product'
import type { PaginatedResponse } from '@/types/common'
import type { ApiResponse } from '@/types/response.ts'

export const productService = {
  // 获取产品列表
  async getProducts(filters: ProductFilters = {}) {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: {
        filters,
        include: 'product_sizes.size,product_colors.color,product_designs.design,categories'
      }
    })
    return response.data
  },

  // 获取单个产品详情
  async getProduct(id: number) {
    // const response = await api.get<ApiResponse<Product>>(`/products/${id}`)
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`, {
      params: {
        include: 'product_sizes.size,product_colors.color,product_designs.design,categories'
      }
    })
    return response.data
  },

  // 创建产品（管理员）
  async createProduct(data: CreateProductData) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'variants') {
        formData.append(key, JSON.stringify(value))
      } else if (Array.isArray(value)) {
        value.forEach(v => formData.append(`${key}[]`, v))
      } else {
        formData.append(key, value)
      }
    })

    const response = await api.post<ApiResponse<Product>>('/admin/products', formData)
    return response.data
  },

  // 更新产品（管理员）
  // async updateProduct(id: number, data: Partial<CreateProductData>) {
  //   const formData = new FormData()
  //   Object.entries(data).forEach(([key, value]) => {
  //     if (value !== undefined) {
  //       if (key === 'variants') {
  //         formData.append(key, JSON.stringify(value))
  //       } else if (Array.isArray(value)) {
  //         value.forEach(v => formData.append(`${key}[]`, v))
  //       } else {
  //         formData.append(key, value)
  //       }
  //     }
  //   })
  //
  //   const response = await api.put<ApiResponse<Product>>(`/admin/products/${id}`, formData)
  //   return response.data
  // },
  async updateProduct(id: number, data: Partial<CreateProductData>) {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'variants') {
          // variants对象需要转换为JSON字符串
          formData.append(key, JSON.stringify(value))
        } else if (Array.isArray(value)) {
          // 数组需要分别append每个元素，并确保转换为字符串
          value.forEach(v => formData.append(`${key}[]`, String(v)))
        } else if (value instanceof File) {
          // 文件类型直接添加
          formData.append(key, value)
        } else {
          // 其他所有值转换为字符串
          formData.append(key, String(value))
        }
      }
    })

    const response = await api.put<ApiResponse<Product>>(`/admin/products/${id}`, formData)
    return response.data
  },

  // 删除产品（管理员）
  async deleteProduct(id: number) {
    await api.delete(`/admin/products/${id}`)
  }
}
