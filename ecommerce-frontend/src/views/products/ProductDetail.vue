<template>
  <v-container v-if="product">
    <v-row>
      <!-- 产品图片 -->
      <v-col cols="12" md="6">
        <v-card>
          <v-img
            :src="product.image_url"
            height="400"
            cover
            class="bg-grey-lighten-2"
          />
        </v-card>
      </v-col>

      <!-- 产品信息 -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-item>
            <v-card-title class="text-h4">{{ product.product_name }}</v-card-title>
            <v-card-subtitle class="text-h5 mt-2">
              ${{ calculatePrice }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <p class="mb-4">{{ product.description }}</p>

            <!-- 颜色选择 -->
            <div class="mb-4">
              <h3 class="text-subtitle-1 mb-2">Colors</h3>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="productColor in product.colors"
                  :key="productColor.color_id"
                  :color="productColor.color.rgb"
                  :variant="selectedColor === productColor ? 'elevated' : 'flat'"
                  @click="selectedColor = productColor"
                >
                  {{ productColor.color.description }}
                </v-chip>
              </div>
            </div>

            <!-- 尺寸选择 -->
            <div class="mb-4">
              <h3 class="text-subtitle-1 mb-2">Size</h3>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="productSize in product.sizes"
                  :key="productSize.size_id"
                  :disabled="productSize.stock_quantity === 0"
                  :variant="selectedSize === productSize ? 'elevated' : 'flat'"
                  @click="selectedSize = productSize"
                >
                  {{ productSize.size_name }}
                  <template v-if="productSize.price_adjustment">
                    (+${{ productSize.price_adjustment }})
                  </template>
                </v-chip>
              </div>
            </div>

            <!-- 设计选择 -->
            <div class="mb-4">
              <h3 class="text-subtitle-1 mb-2">Design</h3>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="productDesign in product.designs"
                  :key="productDesign.design_id"
                  :variant="selectedDesign === productDesign ? 'elevated' : 'flat'"
                  @click="selectedDesign = productDesign"
                >
                  {{ productDesign.design_number }}
                  <template v-if="productDesign.price_adjustment">
                    (+${{ productDesign.price_adjustment }})
                  </template>
                </v-chip>
              </div>
            </div>

            <!-- 库存状态 -->
            <v-alert
              v-if="selectedSize"
              :type="selectedSize.stock_quantity > 0 ? 'success' : 'warning'"
              :text="
                selectedSize.stock_quantity > 0
                  ? `In Stock (${selectedSize.stock_quantity} available)`
                  : 'Out of Stock'
              "
              class="mb-4"
            />

            <!-- 数量选择 -->
            <div class="mb-6">
              <h3 class="text-subtitle-1 mb-2">Quantity</h3>
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
              </div>
            </div>

            <!-- 操作按钮 -->
            <v-card-actions>
              <v-btn
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="!canAddToCart"
                @click="addToCart"
              >
                Add to Cart
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 相关产品推荐 -->
    <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-h5 mb-4">You May Also Like</h2>
        <v-slide-group show-arrows>
          <v-slide-group-item
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
          >
            <v-card
              class="ma-2"
              width="200"
              @click="navigateToProduct(relatedProduct.id)"
            >
              <v-img
                :src="relatedProduct.image_url"
                height="150"
                cover
              />
              <v-card-title class="text-subtitle-1">
                {{ relatedProduct.product_name }}
              </v-card-title>
              <v-card-subtitle>${{ relatedProduct.price }}</v-card-subtitle>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>
  </v-container>

  <div v-else class="d-flex justify-center align-center" style="height: 400px">
    <v-progress-circular indeterminate color="primary"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService, type Product } from '@/utils/product'
import {type Color} from '@/utils/color'
import {type Size} from '@/utils/size'
import {type Design} from '@/utils/design'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const product = ref<Product | null>(null)
const relatedProducts = ref<Product[]>([])
const quantity = ref(1)

// 选中的选项
const selectedColor = ref<Color | null>( null)
const selectedSize = ref<Size | null>(null)
const selectedDesign = ref<Design | null>(null)

// 计算属性
const calculatePrice = computed(() => {
  if (!product.value) return 0

  let price = product.value.price

  if (selectedColor.value?.price_adjustment) {
    price += selectedColor.value.price_adjustment
  }

  if (selectedSize.value?.price_adjustment) {
    price += selectedSize.value.price_adjustment
  }

  if (selectedDesign.value?.price_adjustment) {
    price += selectedDesign.value.price_adjustment
  }

  return (price * quantity.value).toFixed(2)
})

const maxQuantity = computed(() => {
  return selectedSize.value?.stock_quantity || 0
})

const canAddToCart = computed(() => {
  return (
    selectedColor.value &&
    selectedSize.value &&
    selectedDesign.value &&
    quantity.value > 0 &&
    quantity.value <= maxQuantity.value
  )
})

// 方法
const fetchProduct = async () => {
  try {
    const productId = parseInt(route.params.id as string)
    const response = await productService.getProduct(productId)
    product.value = response

    // 设置默认选项
    if (product.value.colors.length) {
      selectedColor.value = product.value.colors[0]
    }
    if (product.value.sizes.length) {
      selectedSize.value = product.value.sizes[0]
    }
    if (product.value.designs.length) {
      selectedDesign.value = product.value.designs[0]
    }
  } catch (error) {
    console.error('Failed to fetch product:', error)
  }
}

const fetchRelatedProducts = async () => {
  try {
    const response = await productService.getProducts({
      // 这里可以添加相关产品的筛选逻辑
      page: 1,
      per_page: 5
    })
    relatedProducts.value = response.products
  } catch (error) {
    console.error('Failed to fetch related products:', error)
  }
}

const addToCart = async () => {
  loading.value = true
  try {
    // TODO: 实现加入购物车逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Failed to add to cart:', error)
  } finally {
    loading.value = false
  }
}

const navigateToProduct = (id: number) => {
  router.push(`/products/${id}`)
}

// 生命周期钩子
onMounted(() => {
  fetchProduct()
  fetchRelatedProducts()
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
.v-slide-group {
  background: transparent;
}
</style>
