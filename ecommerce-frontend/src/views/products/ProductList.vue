<template>
  <v-container fluid>
    <!-- 过滤器抽屉 -->
    <v-navigation-drawer
      v-model="drawer"
      location="left"
      temporary
      width="300"
    >

      <v-list>
        <v-list-subheader>Filters</v-list-subheader>

        <!-- 价格范围 -->
        <v-list-item>
          <v-list-item-title>Price Range</v-list-item-title>
          <v-range-slider
            v-model="filters.priceRange"
            :max="1000"
            :step="10"
            class="mt-4"
          >
            <template v-slot:prepend>
              ${{ filters.priceRange[0] }}
            </template>
            <template v-slot:append>
              ${{ filters.priceRange[1] }}
            </template>
          </v-range-slider>
        </v-list-item>

        <!-- 颜色过滤 -->
        <v-list-item>
          <v-list-item-title>Colors</v-list-item-title>
          <div class="d-flex flex-wrap gap-2 mt-2">
            <v-chip
              v-for="color in colors"
              :key="color.id"
              :color="color.rgb"
              :text="color.description"
              :class="{ 'selected': filters.selectedColors.includes(color.id) }"
              @click="toggleColor(color.id)"
            />
          </div>
        </v-list-item>

        <!-- 尺寸过滤 -->
        <v-list-item>
          <v-list-item-title>Sizes</v-list-item-title>
          <div class="d-flex flex-wrap gap-2 mt-2">
            <v-chip
              v-for="size in sizes"
              :key="size.id"
              :class="{ 'selected': filters.selectedSizes.includes(size.id) }"
              @click="toggleSize(size.id)"
            >
              {{ size.size_name }}
            </v-chip>
          </div>
        </v-list-item>

        <!-- 设计过滤 -->
        <v-list-item>
          <v-list-item-title>Designs</v-list-item-title>
          <v-select
            v-model="filters.selectedDesigns"
            :items="designs"
            item-title="design_number"
            item-value="id"
            multiple
            chips
          />
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <!-- 主内容区 -->
    <v-row>
      <!-- 顶部工具栏 -->
      <v-col cols="12">
        <v-app-bar flat>
          <v-app-bar-nav-icon @click="drawer = !drawer"/>
          <v-toolbar-title>Products</v-toolbar-title>
          <v-spacer/>
          <v-text-field
            v-model="filters.search"
            prepend-inner-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            @update:model-value="debounceSearch"
          />
          <v-btn-group class="ml-4">
            <v-btn
              :color="viewMode === 'grid' ? 'primary' : ''"
              icon="mdi-grid"
              @click="viewMode = 'grid'"
            />
            <v-btn
              :color="viewMode === 'list' ? 'primary' : ''"
              icon="mdi-view-list"
              @click="viewMode = 'list'"
            />
          </v-btn-group>
        </v-app-bar>
      </v-col>

      <!-- 产品展示区 -->
      <v-col cols="12">
        <v-row v-if="!loading">
          <template v-if="products.length">
            <v-col
              v-for="product in products"
              :key="product.id"
              :cols="viewMode === 'grid' ? 12 : 6"
              :sm="viewMode === 'grid' ? 6 : 4"
              :md="viewMode === 'grid' ? 4 : 3"
            >
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :elevation="isHovering ? 8 : 2"
                  :class="{ 'on-hover': isHovering }"
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

                  <v-card-subtitle>
                    <div class="d-flex align-center">
                      <span class="text-h6">${{ product.price }}</span>
                      <v-spacer/>
                      <div class="color-dots">
                        <!-- 首先判断product和colors是否存在 -->
                        <template v-if="product?.product_colors?.length">
                          <span
                            v-for="product_color in product.product_colors.slice(0, 3)"
                            :key="product_color?.id"
                            class="color-dot"
                            :style="{
                              backgroundColor: getColorRGB(product_color)
                            }"
                          />
                          <span v-if="product.product_colors.length > 3" class="more-colors">
                            +{{ product.product_colors.length - 3 }}
                          </span>
                        </template>

                        <!-- 当没有颜色时显示默认颜色 -->
                        <span v-else class="color-dot default-color"></span>
                      </div>
                    </div>
                  </v-card-subtitle>

                  <v-card-text>
                    <div class="text-truncate">{{ product.description }}</div>
                    <div class="mt-2">
                      <!-- 有尺码数据时显示实际尺码 -->
                      <template v-if="product?.product_sizes?.length">
                        <v-chip
                          v-for="size in product.product_sizes.slice(0, 3)"
                          :key="size?.id || index"
                          size="small"
                          class="mr-1"
                        >
                          {{ getSizeName(size) }}
                        </v-chip>
                        <!-- 显示更多尺码提示 -->
                        <v-chip
                          v-if="product.product_sizes.length > 3"
                          size="small"
                          class="mr-1"
                          variant="outlined"
                        >
                          +{{ product.product_sizes.length - 3 }}
                        </v-chip>
                      </template>

                      <!-- 没有尺码数据时显示默认提示 -->
                      <v-chip
                        v-else
                        size="small"
                        class="mr-1"
                        color="grey-lighten-1"
                      >
                        No size available
                      </v-chip>
                    </div>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn
                      color="primary"
                      variant="text"
                      block
                      :disabled="!product.in_stock"
                    >
                      View Details
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-hover>
            </v-col>
          </template>

          <v-col v-else cols="12" class="text-center">
            <v-alert type="info" text="No products found"/>
          </v-col>
        </v-row>

        <div v-else class="d-flex justify-center align-center" style="height: 400px">
          <v-progress-circular indeterminate color="primary"/>
        </div>

        <!-- 分页 -->
        <v-row v-if="totalPages > 1" justify="center" class="mt-4">
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
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import debounce from 'lodash/debounce'
import { productService, type Product } from '@/utils/product'
import { colorService, type Color, type ProductColor } from '@/utils/color'
import { sizeService, type Size } from '@/utils/size'
import { designService, type Design } from '@/utils/design'
import type { ProductFilters } from '@/types/product.ts'

const router = useRouter()
const drawer = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const loading = ref(false)
const products = ref<Product[]>([])
const colors = ref<Color[]>([])
const sizes = ref<Size[]>([])
const designs = ref<Design[]>([])
const page = ref(1)
const totalPages = ref(0)

const filters = ref({
  search: '',
  priceRange: [0, 1000],
  selectedColors: [] as number[],
  selectedSizes: [] as number[],
  selectedDesigns: [] as number[]
})

const getApiFilters = computed((): ProductFilters => ({
  search: filters.value.search,
  min_price: filters.value.priceRange[0],
  max_price: filters.value.priceRange[1],
  color_ids: filters.value.selectedColors.length > 0 ? filters.value.selectedColors : undefined,
  size_ids: filters.value.selectedSizes.length > 0 ? filters.value.selectedSizes : undefined,
  design_ids: filters.value.selectedDesigns.length > 0 ? filters.value.selectedDesigns : undefined
}))

// 获取过滤选项
const fetchFilterOptions = async () => {
  try {
    const [colorsData, sizesData, designsData] = await Promise.all([
      colorService.getAllColors(),
      sizeService.getAllSizes(),
      designService.getAllDesigns()
    ])
    colors.value = colorsData
    sizes.value = sizesData
    designs.value = designsData
  } catch (error) {
    console.error('Failed to fetch filter options:', error)
  }
}

// 获取产品列表
const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await productService.getProducts({
      page: page.value,
      ...getApiFilters.value
    })
    console.log('response:', response)
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

// 过滤器方法
const toggleColor = (colorId: number) => {
  const index = filters.value.selectedColors.indexOf(colorId)
  if (index === -1) {
    filters.value.selectedColors.push(colorId)
  } else {
    filters.value.selectedColors.splice(index, 1)
  }
}

const toggleSize = (sizeId: number) => {
  const index = filters.value.selectedSizes.indexOf(sizeId)
  if (index === -1) {
    filters.value.selectedSizes.push(sizeId)
  } else {
    filters.value.selectedSizes.splice(index, 1)
  }
}

const debounceSearch = debounce(() => {
  page.value = 1
  fetchProducts()
}, 300)

const navigateToProduct = (id: number) => {
  router.push(`/products/${id}`)
}

// 监听过滤器变化
watch(
  [
    () => filters.value.priceRange,
    () => filters.value.selectedColors,
    () => filters.value.selectedSizes,
    () => filters.value.selectedDesigns
  ],
  () => {
    page.value = 1
    fetchProducts()
  },
  { deep: true }
)

onMounted(() => {
  fetchProducts()
  fetchFilterOptions()
})

// 处理颜色逻辑的函数
const getColorRGB = (product_color: ProductColor | null): string => {
  // 返回颜色值，如果无效则返回默认颜色
  return product_color?.color?.rgb ?? '#CCCCCC'
}

// 获取尺码名称，提供默认值
const getSizeName = (size: Size | null): string => {
  return size?.size?.size_name ?? 'N/A'
}
</script>

<style scoped>
.color-dots {
  display: flex;
  align-items: center;
  gap: 4px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.default-color {
  background-color: #2ecb62;
}

.more-colors {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}

.v-card {
  transition: all 0.3s ease;
}

.on-hover {
  transform: translateY(-4px);
}

.selected {
  border: 2px solid var(--v-primary-base);
}

.gap-2 {
  gap: 8px;
}

.mt-2 {
  margin-top: 8px;
}

.mr-1 {
  margin-right: 4px;
}
</style>
