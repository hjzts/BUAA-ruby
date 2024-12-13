<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">Products Management</h1>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="dialog = true"
          >
            Add Product
          </v-btn>
        </div>

        <!-- 搜索和过滤 -->
        <v-card class="mb-4">
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="filters.search"
                  label="Search products"
                  prepend-inner-icon="mdi-magnify"
                  single-line
                  hide-details
                  @update:model-value="debounceSearch"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="filters.available"
                  :items="[
                    { title: 'All Products', value: null },
                    { title: 'Available', value: true },
                    { title: 'Out of Stock', value: false }
                  ]"
                  label="Availability"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-range-slider
                  v-model="priceRange"
                  :min="0"
                  :max="1000"
                  :step="10"
                  label="Price Range"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 产品表格 -->
        <v-data-table
          :headers="headers"
          :items="products"
          :loading="loading"
          class="elevation-1"
        >
          <template  #[`item.image_url`]="{ item }">
            <v-img
              :src="item.image_url || '/placeholder.png'"
              height="50"
              width="50"
              cover
            />
          </template>

          <template #[`item.price`]="{ item }">
            ${{ item.price }}
          </template>

          <template #[`item.status`]="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              :text="item.status"
              size="small"
            />
          </template>

          <template #[`item.actions`]="{ item }">
            <v-btn
              icon
              variant="text"
              size="small"
              color="primary"
              @click="editProduct(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              icon
              variant="text"
              size="small"
              color="error"
              @click="confirmDelete(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>

            <v-btn
              icon
              variant="text"
              size="small"
              color="info"
              @click="showStockDialog(item)"
            >
              <v-icon>mdi-package-variant</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <!-- 分页 -->
        <div class="text-center pt-4">
          <v-pagination
            v-model="page"
            :length="totalPages"
            @update:model-value="fetchProducts"
          />
        </div>
      </v-col>
    </v-row>

    <!-- 产品表单对话框 -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ editedItem ? 'Edit Product' : 'New Product' }}
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="saveProduct" ref="form">
            <v-text-field
              v-model="formData.product_name"
              label="Product Name"
              required
            />

            <v-textarea
              v-model="formData.description"
              label="Description"
            />

            <v-text-field
              v-model.number="formData.price"
              label="Price"
              type="number"
              prefix="$"
              required
            />

            <v-text-field
              v-model.number="formData.stock_quantity"
              label="Stock Quantity"
              type="number"
              required
            />

            <v-file-input
              v-model="formData.image"
              label="Product Image"
              accept="image/*"
              prepend-icon="mdi-camera"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="saveProduct"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 库存管理对话框 -->
    <v-dialog v-model="stockDialog" max-width="400px">
      <v-card>
        <v-card-title>Manage Stock</v-card-title>

        <v-card-text>
          <v-text-field
            v-model.number="stockAmount"
            label="Amount"
            type="number"
            min="1"
          />

          <v-btn-group variant="outlined">
            <v-btn
              color="success"
              prepend-icon="mdi-plus"
              @click="manageStock('increase')"
            >
              Increase
            </v-btn>
            <v-btn
              color="error"
              prepend-icon="mdi-minus"
              @click="manageStock('decrease')"
            >
              Decrease
            </v-btn>
          </v-btn-group>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { productService, type Product } from '@/utils/product'
import debounce from 'lodash/debounce'

// 状态变量
const loading = ref(false)
const dialog = ref(false)
const stockDialog = ref(false)
const products = ref<Product[]>([])
const editedItem = ref<Product | null>(null)
const stockAmount = ref(1)
const selectedProduct = ref<Product | null>(null)
const page = ref(1)
const totalPages = ref(1)
const filters = ref({
  search: '',
  available: false as boolean,
  min_price: 0 as number,
  max_price: 1000 as number
})

// 计算属性
const priceRange = computed({
  get: () => [filters.value.min_price, filters.value.max_price],
  set: (value) => {
    [filters.value.min_price, filters.value.max_price] = value
  }
})

// 表格列定义
const headers = [
  { title: 'Image', key: 'image_url', sortable: false },
  { title: 'Name', key: 'product_name' },
  { title: 'Price', key: 'price' },
  { title: 'Stock', key: 'stock_quantity' },
  { title: 'Sales', key: 'sales_count' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// 表单数据
const formData = ref({
  product_name: '',
  description: '',
  price: 0,
  stock_quantity: 0,
  image: null as File | null
})

// 方法
const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await productService.getProducts({
      page: page.value,
      ...filters.value
    })
    products.value = response.products.map(item => ({
      id: Number(item.id),
      ...item.attributes
    }))
    totalPages.value = response.meta.total_pages
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

const debounceSearch = debounce(() => {
  page.value = 1
  fetchProducts()
}, 300)

const getStatusColor = (status: string) => {
  const colors = {
    active: 'success',
    inactive: 'warning',
    deleted: 'error'
  }
  return colors[status as keyof typeof colors]
}

const editProduct = (item: Product) => {
  editedItem.value = item
  formData.value = { ...item, image: null }
  dialog.value = true
}

const showStockDialog = (item: Product) => {
  selectedProduct.value = item
  stockDialog.value = true
}

const saveProduct = async () => {
  try {
    const data = new FormData()
    Object.entries(formData.value).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value)
      }
    })

    if (editedItem.value) {
      await productService.updateProduct(editedItem.value.id, data)
    } else {
      await productService.createProduct(data)
    }

    await fetchProducts()
    dialog.value = false
  } catch (error) {
    console.error('Failed to save product:', error)
  }
}

const confirmDelete = async (item: Product) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productService.deleteProduct(item.id)
      await fetchProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }
}

const manageStock = async (operation: 'increase' | 'decrease') => {
  if (!selectedProduct.value || stockAmount.value <= 0) return

  try {
    await productService.manageStock(
      selectedProduct.value.id,
      operation,
      stockAmount.value
    )
    await fetchProducts()
    stockDialog.value = false
  } catch (error) {
    console.error('Failed to manage stock:', error)
  }
}

// 生命周期钩子
onMounted(() => {
  fetchProducts()
})

// 监听器
watch(
  () => [filters.value.available, priceRange.value],
  () => {
    page.value = 1
    fetchProducts()
  }
)
</script>

<style scoped>
.v-data-table {
  background: white;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
