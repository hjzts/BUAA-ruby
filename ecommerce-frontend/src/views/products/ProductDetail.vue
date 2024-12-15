<template>
  <v-container v-if="product">
    <v-row>
      <!-- 产品图片区域 -->
      <v-col cols="12" md="6">
        <v-card class="px-4 py-6">
          <v-img
            :src="product.image_url || '/placeholder.png'"
            height="400"
            cover
            class="bg-grey-lighten-2 rounded"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"/>
              </v-row>
            </template>
          </v-img>
        </v-card>
      </v-col>

      <!-- 产品信息区域 -->
      <v-col cols="12" md="6">
        <v-card class="pa-6">
          <!-- 基本信息 -->
          <h1 class="text-h4 mb-2">{{ product.product_name }}</h1>
          <p class="text-subtitle-1 mb-4 text-grey-darken-1">{{ product.description }}</p>

          <!-- 价格信息 -->
          <div class="d-flex align-center mb-6">
            <span class="text-h4 font-weight-bold text-primary">
              ${{ calculateTotalPrice }}
            </span>
            <span v-if="hasAdjustments" class="text-body-1 ml-2 text-decoration-line-through">
              ${{ product.price }}
            </span>
          </div>

          <!-- 库存状态 -->
          <v-alert
            :type="product.stock_quantity > 0 ? 'success' : 'warning'"
            :text="product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'"
            class="mb-4"
            density="compact"
            variant="tonal"
          />

          <!-- 颜色选择 -->
          <div v-if="product.product_colors?.length" class="mb-6">
            <h3 class="text-h6 mb-3">Color</h3>
            <div class="d-flex flex-wrap gap-2">
              <v-tooltip
                v-for="color in product.product_colors"
                :key="color.id"
                :text="color.color.description"
                location="top"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :style="{ backgroundColor: color.color.rgb }"
                    :variant="selectedColor?.id === color.id ? 'elevated' : 'outlined'"
                    class="color-btn"
                    width="40"
                    height="40"
                    @click="selectColor(color)"
                  >
                    <v-icon
                      v-if="selectedColor?.id === color.id"
                      color="white"
                      size="small"
                    >
                      mdi-check
                    </v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </div>

          <!-- 尺寸选择 -->
          <div v-if="product.product_sizes?.length" class="mb-6">
            <h3 class="text-h6 mb-3">Size</h3>
            <div class="d-flex flex-wrap gap-2">
              <v-btn
                v-for="size in product.product_sizes"
                :key="size.id"
                :variant="selectedSize?.id === size.id ? 'elevated' : 'outlined'"
                :disabled="size.stock_quantity === 0"
                @click="selectSize(size)"
              >
                {{ size.size.size_name }}
                <template v-if="size.price_adjustment">
                  <small class="ml-1">
                    (+${{ size.price_adjustment }})
                  </small>
                </template>
              </v-btn>
            </div>
          </div>

          <!-- 设计选择 -->
          <div v-if="product.product_designs?.length" class="mb-6">
            <h3 class="text-h6 mb-3">Design</h3>
            <v-select
              v-model="selectedDesign"
              :items="product.product_designs"
              item-title="design.design_number"
              item-value="id"
              label="Select Design"
              variant="outlined"
              density="comfortable"
            >
              <template v-slot:item="{ item }">
                <span>{{ item.design.design_number }}</span>
                <span v-if="item.price_adjustment" class="text-grey">
                  (+${{ item.price_adjustment }})
                </span>
              </template>
            </v-select>
          </div>

          <!-- 数量选择 -->
          <div class="mb-6">
            <h3 class="text-h6 mb-3">Quantity</h3>
            <div class="d-flex align-center">
              <v-btn
                icon="mdi-minus"
                variant="outlined"
                :disabled="quantity <= 1"
                @click="quantity--"
              />
              <span class="mx-4 text-h6">{{ quantity }}</span>
              <v-btn
                icon="mdi-plus"
                variant="outlined"
                :disabled="quantity >= maxQuantity"
                @click="quantity++"
              />
              <span class="ml-4 text-caption text-grey">
                {{ maxQuantity }} available
              </span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <v-card-actions class="pa-0">
            <v-btn
              color="primary"
              size="large"
              block
              :loading="addingToCart.value"
              :disabled="!canAddToCart"
              class="mb-2"
              @click="addToCart"
            >
              Add to Cart
            </v-btn>
          </v-card-actions>

          <v-card-actions class="ps-0">
            <v-btn
              :color="isFavorited ? 'error' : undefined"
              :variant="isFavorited ? 'flat' : 'outlined'"
              size="large"
              block
              :loading="toggleFavorite.value"
              @click="toggleFavorite"
            >
              <v-icon :icon="isFavorited ? 'mdi-heart' : 'mdi-heart-outline'" class="mr-2"/>
              {{ isFavorited ? 'Remove from Favorites' : 'Add to Favorites' }}
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- 产品详情 -->
        <v-card class="mt-4 pa-6">
          <v-tabs v-model="activeTab">
            <v-tab value="details">Details</v-tab>
            <v-tab value="shipping">Shipping</v-tab>
            <v-tab value="returns">Returns</v-tab>
          </v-tabs>

          <v-window v-model="activeTab" class="mt-4">
            <v-window-item value="details">
              <div class="text-body-1">
                {{ product.description }}
              </div>
            </v-window-item>

            <v-window-item value="shipping">
              <div class="text-body-1">
                <h4 class="text-h6 mb-2">Shipping Information</h4>
                <ul class="pl-4">
                  <li>Free shipping on orders over $50</li>
                  <li>Standard delivery: 3-5 business days</li>
                  <li>Express delivery: 1-2 business days</li>
                </ul>
              </div>
            </v-window-item>

            <v-window-item value="returns">
              <div class="text-body-1">
                <h4 class="text-h6 mb-2">Return Policy</h4>
                <p>30-day return policy for unworn items in original packaging.</p>
              </div>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <!-- 添加到购物车提示 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>

  <!-- 加载状态 -->
  <div v-else class="d-flex justify-center align-center" style="height: 400px">
    <v-progress-circular indeterminate color="primary"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Product, ProductColor, ProductSize, ProductDesign } from '@/types/product'
import { productService } from '@/services/product'
import { cartService } from '@/services/cart'
import { favoriteService } from '@/services/favorite'

const route = useRoute()
const product = ref<Product | null>(null)
const quantity = ref(1)
const selectedColor = ref<ProductColor | null>(null)
const selectedSize = ref<ProductSize | null>(null)
const selectedDesign = ref<ProductDesign | null>(null)
const isFavorited = ref(false)
const addingToCart = ref(false)
const togglingFavorite = ref(false)
const activeTab = ref('details')

const snackbar = ref({
  show: false,
  color: 'success',
  text: ''
})

// 计算总价
const calculateTotalPrice = computed(() => {
  let price = eval(product.value?.price) || 0 as number

  if (selectedColor.value?.price_adjustment) {
    price += eval(selectedColor.value.price_adjustment)
  }
  if (selectedSize.value?.price_adjustment) {
    price += eval(selectedSize.value.price_adjustment)
  }
  if (selectedDesign.value?.price_adjustment) {
    price += eval(selectedDesign.value.price_adjustment)
  }
  console.log("selectedColor: ", selectedColor.value, " type: ", typeof selectedColor.value?.price_adjustment)
  console.log("selectedSize: ", selectedSize.value, " type: ", typeof selectedSize.value)
  console.log("selectedDesign: ", selectedDesign.value, " type: ", typeof selectedDesign.value)
  console.log("price: ", price, " type: ", typeof price)
  console.log("price_after: ", price, " type: ", typeof price)
  return (price * quantity.value).toFixed(2)
})

// 是否有价格调整
const hasAdjustments = computed(() => {
  return !!(selectedColor.value?.price_adjustment ||
    selectedSize.value?.price_adjustment ||
    selectedDesign.value?.price_adjustment)
})

// 最大可购买数量
const maxQuantity = computed(() => {
  if (selectedSize.value) {
    return selectedSize.value.stock_quantity
  }
  return product.value?.stock_quantity || 0
})

// 是否可以添加到购物车
const canAddToCart = computed(() => {
  return product.value?.in_stock &&
    quantity.value <= maxQuantity.value &&
    quantity.value > 0
})

// 选择颜色
const selectColor = (color: ProductColor) => {
  selectedColor.value = color
}

// 选择尺寸
const selectSize = (size: ProductSize) => {
  selectedSize.value = size
  // 重置数量
  quantity.value = 1
}

// 添加到购物车
const addToCart = async () => {
  if (!product.value) return

  addingToCart.value = true
  try {
    await cartService.addToCart(product.value.id, quantity.value)
    snackbar.value = {
      show: true,
      color: 'success',
      text: 'Product added to cart successfully!'
    }
  } catch (error) {
    console.error('Failed to add to cart:', error)
    snackbar.value = {
      show: true,
      color: 'error',
      text: 'Failed to add product to cart'
    }
  } finally {
    addingToCart.value = false
  }
}

// 切换收藏状态
const toggleFavorite = async () => {
  if (!product.value) return

  togglingFavorite.value = true
  try {
    if (isFavorited.value) {
      await favoriteService.removeFavorite(product.value.id)
    } else {
      await favoriteService.addFavorite(product.value.id)
    }
    isFavorited.value = !isFavorited.value
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
  } finally {
    togglingFavorite.value = false
  }
}

// 获取产品详情
const fetchProduct = async () => {
  try {
    const productId = parseInt(route.params.id as string)
    const response = await productService.getProduct(productId)
    product.value = response.attributes
    console.log("product: ", product.value)
    // 检查是否已收藏
    isFavorited.value = await favoriteService.checkFavorite(productId)
  } catch (error) {
    console.error('Failed to fetch product:', error)
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>

.gap-2 {
  gap: 8px;
}

:deep(.v-btn--disabled) {
  opacity: 0.5;
}

.color-btn {
  border-radius: 50%; /* 使按钮变成圆形 */
  transition: all 0.3s ease-in-out; /* 添加平滑的过渡效果 */
}
.color-btn:hover {
  transform: scale(1.1); /* 悬停时放大按钮 */
  filter: brightness(1.1); /* 增强亮度 */
}
.color-btn.selected {
  border: 2px solid white; /* 选中时加边框 */
}
</style>
