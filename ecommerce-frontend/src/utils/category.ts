import api from '@/utils/api.ts'

export interface Category {
  id: number
  name: string
  description: string
  icon_url: string
  parent_id: number | null
  children: Category[]
}

export const categoryService = {
  // 获取所有分类
  async getCategories(rootOnly = false) {
    const response = await api.get<Category[]>('/api/v1/categories', {
      params: { root_only: rootOnly }
    })
    return response.data
  }
}
