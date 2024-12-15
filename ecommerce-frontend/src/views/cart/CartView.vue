<template>
  <v-container>
    <!-- 页面标题 -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-6">
          <v-icon
            icon="mdi-cart"
            size="x-large"
            class="me-3"
          />
          <h1 class="text-h4 mb-0">Shopping Cart</h1>
          <v-chip
            class="ml-4"
            color="primary"
            size="large"
          >
            {{ cartItems.length }} {{ cartItems.length === 1 ? 'item' : 'items' }}
          </v-chip>
          <v-spacer />
          <v-btn
            color="error"
            variant="text"
            prepend-icon="mdi-delete"
            :disabled="!cartItems.length"
            @click="showClearDialog"
          >
            Clear Cart
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 主要内容 -->
    <v-row v-if="!loading">
      <template v-if="cartItems.length">
        <!-- 商品列表 -->
        <v-col cols="12" md="8">
          <v-card>
            <v-list>
              <v-list-item
                v-for="item in cartItems"
                :key="item.id"
                :value="item.id"
              >
                <template v-slot:prepend>
                  <v-checkbox
                    v-model="selectedItems"
                    :value="item.id"
                    hide-details
                  />
                </template>

                <!-- 商品图片 -->
                <template>
                  <v-img
                    :src="item.attributes.product.image_url || '/placeholder.png'"
                    width="100"
                    height="100"
                    cover
                    class="ma-2 rounded"
                    @click="router.push(`/products/${item.attributes.product.id}`)"
                    style="cursor: pointer"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey-lighten-5"
                        />
                      </v-row>
                    </template>
                  </v-img>
                </template>

                <!-- 商品信息 -->
                <v-list-item-title class="text-subtitle-1 mb-1">
                  {{ item.attributes.product.product_name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <div class="d-flex flex-column">
                    <span class="text-primary">${{ item.attributes.product.price }}</span>
                    <span v-if="!item.attributes.product.in_stock" class="text-error">
                      Out of Stock
                    </span>
                  </div>
                </v-list-item-subtitle>

                <!-- 数量控制 -->
                <template v-slot:append>
                  <div class="d-flex flex-column align-end">
                    <div class="quantity-control mb-2">
                      <v-btn
                        icon="mdi-minus"
                        size="small"
                        variant="outlined"
                        :disabled="item.attributes.quantity <= 1"
                        @click="updateQuantity(item, -1)"
                      />
                      <span class="mx-3">{{ item.attributes.quantity }}</span>
                      <v-btn
                        icon="mdi-plus"
                        size="small"
                        variant="outlined"
                        :disabled="item.attributes.quantity >= item.attributes.product.stock_quantity"
                        @click="updateQuantity(item, 1)"
                      />
                    </div>
                    <div class="text-h6">${{ (item.attributes.product.price * item.attributes.quantity).toFixed(2) }}</div>
                    <v-btn
                      class="mt-2"
                      density="compact"
                      color="error"
                      variant="text"
                      prepend-icon="mdi-delete"
                      @click="removeItem(item)"
                    >
                      Remove
                    </v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- 结算区域 -->
        <v-col cols="12" md="4">
          <v-card class="sticky-card">
            <v-card-title class="bg-surface-variant">
              Order Summary
            </v-card-title>
            <v-card-text class="pt-4">
              <div class="d-flex justify-space-between mb-4">
                <span>Selected Items:</span>
                <span>{{ selectedItems.length }}</span>
              </div>
              <div class="d-flex justify-space-between mb-4">
                <span>Total Items:</span>
                <span>{{ totalQuantity }}</span>
              </div>
              <div class="d-flex justify-space-between mb-4">
                <span class="text-subtitle-1">Subtotal:</span>
                <span class="text-h6">${{ subtotal.toFixed(2) }}</span>
              </div>
              <v-divider class="mb-4" />
              <v-btn
                color="primary"
                size="large"
                block
                prepend-icon="mdi-cart-check"
                :disabled="!selectedItems.length"
                @click="checkout"
              >
                Checkout ({{ selectedItems.length }} items)
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </template>

      <!-- 空购物车 -->
      <v-col v-else cols="12">
        <v-card class="text-center pa-12">
          <v-icon
            icon="mdi-cart-outline"
            size="100"
            color="grey-lighten-1"
            class="mb-4"
          />
          <h3 class="text-h5 mb-2">Your Cart is Empty</h3>
          <p class="text-body-1 mb-6">Start adding items to your cart!</p>
          <v-btn
            color="primary"
            size="large"
            to="/products"
            prepend-icon="mdi-shopping"
          >
            Continue Shopping
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- 加载状态 -->
    <div
      v-else
      class="d-flex justify-center align-center"
      style="min-height: 400px"
    >
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      />
    </div>

    <!-- 清空购物车确认对话框 -->
    <v-dialog v-model="clearDialog" max-width="400">
      <v-card>
        <v-card-title>Clear Shopping Cart</v-card-title>
        <v-card-text>
          Are you sure you want to remove all items from your cart?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="clearDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            :loading="processing"
            @click="clearCart"
          >
            Clear Cart
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { CartItem } from '@/types/cart'
import { cartService } from '@/services/cart'

const router = useRouter()
const loading = ref(false)
const processing = ref(false)
const cartItems = ref<CartItem[]>([])
const selectedItems = ref<number[]>([])
const clearDialog = ref(false)

// 计算属性
const totalQuantity = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.attributes.quantity, 0)
)

const subtotal = computed(() =>
  cartItems.value
    .filter(item => selectedItems.value.includes(item.id))
    .reduce((sum, item) => sum + (item.attributes.product.price * item.attributes.quantity), 0)
)

// 获取购物车数据
const fetchCartItems = async () => {
  loading.value = true
  try {
    const response = await cartService.getCartItems()
    cartItems.value = response.data
    // 默认全选
    selectedItems.value = cartItems.value.map(item => item.id)
    console.log("cartItems: ", cartItems.value)
    console.log("get cart items response: " , response.data)
  } catch (error) {
    console.error('Failed to fetch cart items:', error)
  } finally {
    loading.value = false
  }
}

// 更新商品数量
const updateQuantity = async (item: CartItem, change: number) => {
  const newQuantity = item.attributes.quantity + change
  if (newQuantity < 1 || newQuantity > item.attributes.product.stock_quantity) return

  try {
    await cartService.updateCartItem(item.id, newQuantity)
    item.attributes.quantity = newQuantity
  } catch (error) {
    console.error('Failed to update quantity:', error)
  }
}

// 删除商品
const removeItem = async (item: CartItem) => {
  try {
    await cartService.removeFromCart(item.id)
    cartItems.value = cartItems.value.filter(i => i.id !== item.id)
    selectedItems.value = selectedItems.value.filter(id => id !== item.id)
  } catch (error) {
    console.error('Failed to remove item:', error)
  }
}

// 显示清空确认框
const showClearDialog = () => {
  clearDialog.value = true
}

// 清空购物车
const clearCart = async () => {
  processing.value = true
  try {
    await cartService.clearCart()
    cartItems.value = []
    selectedItems.value = []
    clearDialog.value = false
  } catch (error) {
    console.error('Failed to clear cart:', error)
  } finally {
    processing.value = false
  }
}

// 结算
const checkout = () => {
  if (!selectedItems.value.length) return

  // 跳转到结算页面，并传递选中的商品ID
  // router.push({
  //   name: 'checkout',
  //   query: {
  //     items: selectedItems.value.join(',')
  //   }
  // })
}

onMounted(() => {
  fetchCartItems()
})
</script>

<style scoped>
.quantity-control {
  display: flex;
  align-items: center;
}

.sticky-card {
  position: sticky;
  top: 24px;
}

/* 数量更新动画 */
.v-btn {
  transition: all 0.3s ease;
}

.v-btn:active:not(:disabled) {
  transform: scale(0.95);
}
</style>
