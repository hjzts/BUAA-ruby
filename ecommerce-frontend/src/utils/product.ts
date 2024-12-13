import api from './api'
import type { Color, ProductColor } from './color'
import type { Size, ProductSize } from './size'
import type { Design, ProductDesign } from './design'

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
  // 添加与color、size、design相关的属性
  colors: ProductColor[]
  sizes: ProductSize[]
  designs: ProductDesign[]
}

interface ProductFilters {
  available?: boolean
  min_price?: number
  max_price?: number
  search?: string
  page?: number
  per_page?: number
  // 添加颜色、尺寸、设计的筛选条件
  color_ids?: number[]
  size_ids?: number[]
  design_ids?: number[]
}

// JSONAPI 响应格式定义
interface JSONAPIData<T> {
  id: string
  type: string
  attributes: T & {
    colors: ProductColor[]
    sizes: ProductSize[]
    designs: ProductDesign[]
  }
}

interface JSONAPIResponse<T> {
  data: JSONAPIData<T> | Array<JSONAPIData<T>>
  included?: Array<JSONAPIData<Color | Size | Design>>
  meta?: {
    total_pages: number
    current_page: number
    total_count: number
  }
}

// 转换JSONAPI格式数据到普通对象
function normalizeJSONAPIResponse<T>(response: JSONAPIResponse<T>): {
  data: T | T[]
  meta?: JSONAPIResponse<T>['meta']
} {
  if (Array.isArray(response.data)) {
    return {
      data: response.data.map(item => ({
        id: parseInt(item.id),
        ...item.attributes,
        colors: item.attributes.colors || [],
        sizes: item.attributes.sizes || [],
        designs: item.attributes.designs || []
      })) as T[],
      meta: response.meta
    }
  } else {
    return {
      data: {
        id: parseInt(response.data.id),
        ...response.data.attributes,
        colors: response.data.attributes.colors || [],
        sizes: response.data.attributes.sizes || [],
        designs: response.data.attributes.designs || []
      } as T
    }
  }
}

export const productService = {
  async getProducts(filters: ProductFilters = {}) {
    const response = await api.get<JSONAPIResponse<Product>>('/api/v1/products', {
      params: filters
    })
    const normalized = normalizeJSONAPIResponse(response.data)
    return {
      products: normalized.data as Product[],
      meta: normalized.meta
    }
  },

  // ... 其他现有方法保持不变 ...

  // 添加管理产品颜色的方法
  async addProductColor(productId: number, data: {
    color_id: number,
    price_adjustment: number
  }) {
    const response = await api.post<JSONAPIResponse<ProductColor>>(
      `/api/v1/products/${productId}/colors`,
      data
    )
    const normalized = normalizeJSONAPIResponse(response.data)
    return normalized.data as ProductColor
  },

  async updateProductColor(
    productId: number,
    colorId: number,
    data: { price_adjustment: number }
  ) {
    const response = await api.put<JSONAPIResponse<ProductColor>>(
      `/api/v1/products/${productId}/colors/${colorId}`,
      data
    )
    const normalized = normalizeJSONAPIResponse(response.data)
    return normalized.data as ProductColor
  },

  async deleteProductColor(productId: number, colorId: number) {
    await api.delete(`/api/v1/products/${productId}/colors/${colorId}`)
  },

  // 添加管理产品尺寸的方法
  async addProductSize(productId: number, data: {
    size_id: number,
    price_adjustment: number,
    stock_quantity: number
  }) {
    const response = await api.post<JSONAPIResponse<ProductSize>>(
      `/api/v1/products/${productId}/sizes`,
      data
    )
    const normalized = normalizeJSONAPIResponse(response.data)
    return normalized.data as ProductSize
  },

  async updateProductSize(
    productId: number,
    sizeId: number,
    data: {
      price_adjustment?: number,
      stock_quantity?: number
    }
  ) {
    const response = await api.put<JSONAPIResponse<ProductSize>>(
      `/api/v1/products/${productId}/sizes/${sizeId}`,
      data
    )
    const normalized = normalizeJSONAPIResponse(response.data)
    return normalized.data as ProductSize
  },

  async deleteProductSize(productId: number, sizeId: number) {
    await api.delete(`/api/v1/products/${productId}/sizes/${sizeId}`)
  },

  // 添加管理产品设计的方法
  async addProductDesign(productId: number, data: {
    design_id: number,
    price_adjustment: number
  }) {
    const response = await api.post<JSONAPIResponse<ProductDesign>>(
      `/api/v1/products/${productId}/designs`,
      data
    )
    const normalized = normalizeJSONAPIResponse(response.data)
    return normalized.data as ProductDesign
  },

  async updateProductDesign(
    productId: number,
    designId: number,
    data: { price_adjustment: number }
  ) {
    const response = await api.put<JSONAPIResponse<ProductDesign>>(
      `/api/v1/products/${productId}/designs/${designId}`,
      data
    )
    const normalized = normalizeJSONAPIResponse(response.data)
    return normalized.data as ProductDesign
  },

  async deleteProductDesign(productId: number, designId: number) {
    await api.delete(`/api/v1/products/${productId}/designs/${designId}`)
  }
}
