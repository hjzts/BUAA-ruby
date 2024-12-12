<!-- src/views/ProductsGrid.vue -->
<template>
  <v-container>
    <!-- 过滤器部分 -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="mb-4">
          <v-card-title>Filters</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="filters.search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              @update:model-value="debounceSearch"
            />

            <v-divider class="my-4"/>

            <h3 class="text-subtitle-1 mb-2">Price Range</h3>
            <v-range-slider
              v-model="priceRange"
              :min="0"
              :max="1000"
              :step="10"
              hide-details
              class="mt-4"
            >
              <template v-slot:prepend>
                ${{ priceRange[0] }}
              </template>
              <template v-slot:append>
                ${{ priceRange[1] }}
              </template>
            </v-range-slider>

            <v-divider class="my-4"/>

            <v-checkbox
              v-model="filters.available"
              label="In Stock Only"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 产品网格 -->
      <v-col cols="12" md="9">
        <v-row>
          <template v-if="!loading && products.length">
            <v-col
              v-for="product in products"
              :key="product.id"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                :loading="loading"
                class="mx-auto product-card"
                @click="navigateToProduct(product.id)"
              >
                <v-img
                  :src="product.image_url || '/placeholder.png'"
                  height="200"
                  cover
                  class="align-end"
                >
                  <v-chip
                    v-if="!product.in_stock"
                    color="error"
                    class="ma-2"
                  >
                    Out of Stock
                  </v-chip>
                </v-img>

                <v-card-title>{{ product.product_name }}</v-card-title>

                <v-card-text>
                  <div class="text-subtitle-1 mb-1">${{ product.price.toFixed(2) }}</div>
                  <div class="text-body-2">{{ truncateText(product.description, 100) }}</div>
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="primary"
                    variant="text"
                    :disabled="!product.in_stock"
                  >
                    Add to Cart
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </template>

          <v-col v-else-if="loading" cols="12" class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            />
          </v-col>

          <v-col v-else cols="12" class="text-center">
            <v-alert
              type="info"
              text="No products found matching your criteria"
            />
          </v-col>
        </v-row>

        <!-- 分页 -->
        <v-row justify="center" class="mt-4">
          <v-pagination
            v-model="page"
            :length="totalPages"
            @update:model-value="fetchProducts"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { productService, type Product } from '@/utils/product'
import debounce from 'lodash/debounce'

const router = useRouter()
const loading = ref(false)
const products = ref<Product[]>([])
const page = ref(1)
const totalPages = ref(1)
const filters = ref({
  search: '',
  available: false,
  min_price: 0,
  max_price: 1000
})

const priceRange = computed({
  get: () => [filters.value.min_price, filters.value.max_price],
  set: (value) => {
    [filters.value.min_price, filters.value.max_price] = value
  }
})

const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await productService.getProducts({
      page: page.value,
      ...filters.value
    })
    products.value = response.products
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

const truncateText = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const navigateToProduct = (id: number) => {
  router.push(`/products/${id}`)
}

onMounted(() => {
  fetchProducts()
})

watch(
  () => [filters.value.available, priceRange.value],
  () => {
    page.value = 1
    fetchProducts()
  }
)
</script>

<style scoped>
.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-card-text {
  flex-grow: 1;
}
</style>
