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


  <!-- 结算对话框 -->
  <v-dialog v-model="checkoutDialog" max-width="800" persistent>
    <v-card>
      <v-card-title class="bg-primary text-white">
        Checkout
      </v-card-title>

      <!-- 结算表单 -->
      <v-card-text class="pt-4">
        <v-row>
          <!-- 左侧：订单项目 -->
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-4">Order Items</h3>
            <v-list>
              <v-list-item
                v-for="item in selectedCartItems"
                :key="item.id"
                density="compact"
              >
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="item.attributes.product.image_url || '/placeholder.png'" cover />
                  </v-avatar>
                </template>
                <v-list-item-title>
                  {{ item.attributes.product.product_name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Qty: {{ item.attributes.quantity }} × ${{ item.attributes.product.price }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <div class="text-primary">
                    ${{ (item.attributes.quantity * item.attributes.product.price).toFixed(2) }}
                  </div>
                </template>
              </v-list-item>

              <v-divider class="my-2"/>

              <!-- 总计 -->
              <v-list-item>
                <v-list-item-title class="text-h6">
                  Total Amount
                </v-list-item-title>
                <template v-slot:append>
                  <div class="text-h6 text-primary">
                    ${{ subtotal.toFixed(2) }}
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-col>

          <!-- 右侧：收货信息表单 -->
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-4">Shipping Information</h3>
            <v-form ref="form" v-model="formValid">
              <v-text-field
                v-model="shippingForm.recipient_name"
                label="Recipient Name"
                :rules="[v => !!v || 'Name is required']"
                variant="outlined"
                density="comfortable"
                class="mb-2"
              />

              <v-text-field
                v-model="shippingForm.phone_number"
                label="Phone Number"
                :rules="[
                  v => !!v || 'Phone number is required',
                  v => /^\d{10,11}$/.test(v) || 'Invalid phone number'
                ]"
                variant="outlined"
                density="comfortable"
                class="mb-2"
              />

              <v-textarea
                v-model="shippingForm.shipping_address"
                label="Shipping Address"
                :rules="[v => !!v || 'Address is required']"
                variant="outlined"
                density="comfortable"
                auto-grow
                rows="3"
                class="mb-2"
              />

              <v-text-field
                v-model="shippingForm.postal_code"
                label="Postal Code"
                :rules="[
                  v => !!v || 'Postal code is required',
                  v => /^\d{5,6}$/.test(v) || 'Invalid postal code'
                ]"
                variant="outlined"
                density="comfortable"
              />
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- 操作按钮 -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="checkoutDialog = false"
          :disabled="processing"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :loading="processing"
          :disabled="!formValid"
          @click="confirmCheckout"
        >
          Place Order
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 结果提示 -->
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="3000"
  >
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { CartItem } from '@/types/cart'
import { cartService } from '@/services/cart'
import { orderService } from '@/services/order'

const router = useRouter()
const loading = ref(false)
const processing = ref(false)
const cartItems = ref<CartItem[]>([])
const selectedItems = ref<number[]>([])
const clearDialog = ref(false)
const checkoutDialog = ref(false)
const formValid = ref(false)
const form = ref<any>(null)
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

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

// 收货信息表单
const shippingForm = ref({
  recipient_name: '',
  phone_number: '',
  shipping_address: '',
  postal_code: ''
})

// 选中的购物车项
const selectedCartItems = computed(() =>
  cartItems.value.filter(item => selectedItems.value.includes(item.id))
)

// 显示检查结果
const showMessage = (text: string, color: string = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  }
}

// 开始结算
const checkout = () => {
  if (!selectedItems.value.length) return
  console.log("selectedItems: ", selectedCartItems.value)
  checkoutDialog.value = true
}

// 确认结算
const confirmCheckout = async () => {
  if (!form.value.validate()) return

  processing.value = true
  try {
    // 创建订单
    console.log("shippingForm: ", shippingForm.value)
    const orderData = {
      order: shippingForm.value,
      items: selectedCartItems.value.map(item => ({
        product_id: item.attributes.product.id,
        quantity: item.attributes.quantity,
      }))
    }
    console.log("orderData: ", orderData)
    const response = await orderService.createOrder(orderData)
    console.log("create order response: ", response)

    // 从购物车中移除已购买的商品
    await Promise.all(
      selectedCartItems.value.map(item =>
        cartService.removeFromCart(item.id)
      )
    )

    // 显示成功消息
    showMessage('Order placed successfully!')

    // 关闭对话框
    checkoutDialog.value = false

    // 重置表单
    shippingForm.value = {
      recipient_name: '',
      phone_number: '',
      shipping_address: '',
      postal_code: ''
    }

    // 更新购物车
    await fetchCartItems()

    // 跳转到订单详情页
    router.push({
      name: 'order-detail',
      params: { id: response.data.id }
    })
  } catch (error) {
    console.error('Failed to create order:', error)
    showMessage('Failed to place order. Please try again.', 'error')
  } finally {
    processing.value = false
  }
}

// 监听结算对话框关闭
watch(checkoutDialog, (newValue) => {
  if (!newValue) {
    // 重置表单
    shippingForm.value = {
      recipient_name: '',
      phone_number: '',
      shipping_address: '',
      postal_code: ''
    }
    if (form.value) {
      form.value.reset()
    }
  }
})

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

.v-dialog {
  transition: transform 0.3s ease;
}

.v-dialog--active {
  transform: scale(1);
}

.v-dialog:not(.v-dialog--active) {
  transform: scale(0.95);
}
</style>
