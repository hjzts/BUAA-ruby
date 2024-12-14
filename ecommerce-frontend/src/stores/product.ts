import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productService, type Product } from '@/utils/product'
import { categoryService, type Category } from '@/utils/category'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const filters = ref({
    category_id: null as number | null,
    available: true,
    min_price: 0,
    max_price: 1000,
    search: '',
    per_page: 12
  })

  // Actions
  async function fetchProducts() {
    loading.value = true
    try {
      const response = await productService.getProducts({
        ...filters.value,
        page: currentPage.value
      })

      totalPages.value = response.meta.total_pages
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      categories.value = await categoryService.getCategories()
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  // 更新筛选条件
  function updateFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
    currentPage.value = 1
    fetchProducts()
  }

  return {
    products,
    categories,
    loading,
    totalPages,
    currentPage,
    filters,
    fetchProducts,
    fetchCategories,
    updateFilters
  }
})
