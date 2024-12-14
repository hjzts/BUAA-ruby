import type { PaginationParams } from '@/types/common.ts'
import type { Category } from '@/types/category.ts'

// export interface Product {
//   id: number
//   product_name: string
//   description: string
//   price: number
//   stock_quantity: number
//   sales_count: number
//   status: 'active' | 'inactive' | 'deleted'
//   image_url?: string
//   in_stock: boolean
//   created_at: string
//   updated_at: string
//
//   // 关联数据
//   sizes?: ProductSize[]
//   colors?: ProductColor[]
//   designs?: ProductDesign[]
//   categories?: Category[]
// }

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
  created_at: string
  updated_at: string

  // 尺码相关
  sizes: Array<{
    id: number
    size_id: number
    stock_quantity: number
    price_adjustment: number
    size: {
      id: number
      size_name: string
      description: string
    }
  }>

  // 颜色相关
  colors: Array<{
    id: number
    color_id: number
    price_adjustment: number
    color: {
      id: number
      rgb: string
      description: string
    }
  }>

  // 设计相关
  designs: Array<{
    id: number
    design_id: number
    price_adjustment: number
    design: {
      id: number
      design_number: string
      sales: number
    }
  }>

  // 分类信息
  categories: Array<{
    id: number
    name: string
    description: string
    icon_url: string
  }>
}

export interface ProductSize {
  id: number
  product_id: number
  size_id: number
  stock_quantity: number
  price_adjustment: number
  size: Size
}

export interface Size {
  id: number
  size_name: string
  description: string
}

export interface ProductColor {
  id: number
  product_id: number
  color_id: number
  price_adjustment: number
  color: Color
}

export interface Color {
  id: number
  rgb: string
  description: string
}

export interface ProductDesign {
  id: number
  product_id: number
  design_id: number
  price_adjustment: number
  design: Design
}

export interface Design {
  id: number
  design_number: string
  sales: number
}

export interface ProductFilters extends PaginationParams {
  search?: string
  category_id?: number
  min_price?: number
  max_price?: number
  available?: boolean
  status?: string
}

export interface CreateProductData {
  product_name: string
  description: string
  price: number
  stock_quantity: number
  status: string
  image: File
  category_ids: number[]
  variants?: {
    sizes?: {
      id: number
      stock_quantity: number
      price_adjustment: number
    }[]
    colors?: {
      id: number
      price_adjustment: number
    }[]
    designs?: {
      id: number
      price_adjustment: number
    }[]
  }
}
