import type { Category } from '@/types/category'
import type { ApiResponse } from '@/types/response.ts'
import api from './api.ts'

export const categoryService = {
  // 获取所有分类
  async getCategories() {
    const response = await api.get<ApiResponse<Category[]>>('/categories')
    return response.data
  },

  // 获取根分类
  async getRootCategories() {
    const response = await api.get<ApiResponse<Category[]>>('/categories', {
      params: { root_only: true }
    })
    return response.data
  },

  // 创建分类（管理员）
  async createCategory(data: Omit<Category, 'id'>) {
    const response = await api.post<ApiResponse<Category>>('/admin/categories', data)
    return response.data
  },

  // 更新分类（管理员）
  async updateCategory(id: number, data: Partial<Category>) {
    const response = await api.put<ApiResponse<Category>>(`/admin/categories/${id}`, data)
    return response.data
  },

  // 删除分类（管理员）
  async deleteCategory(id: number) {
    await api.delete(`/admin/categories/${id}`)
  }
}
