<template>
  <v-container>
    <!-- 页面标题 -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-6">
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            @click="router.back()"
          />
          <h1 class="text-h4 ml-4">Checkout</h1>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="!loading">
      <!-- 订单信息 -->
      <v-col cols="12" md="8">
        <!-- 收货信息表单 -->
        <v-card class="mb-4">
          <v-card-title class="bg-surface-variant">
            Shipping Information
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="isFormValid"
              @submit.prevent="createOrder"
            >
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.recipient_name"
                    label="Recipient Name"
                    :rules="[v => !!v || 'Name is required']"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.phone_number"
                    label="Phone Number"
                    :rules="[
                      v => !!v || 'Phone number is required',
                      v => /^\d{10,11}$/.test(v) || 'Invalid phone number'
                    ]"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.postal_code"
                    label="Postal Code"
                    :rules="[
                      v => !!v || 'Postal code is required',
                      v => /^\d{5,6}$/.test(v) || 'Invalid postal code'
                    ]"
                    required
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="formData.shipping_address"
                    label="Shipping Address"
                    :rules="[v => !!v || 'Address is required']"
                    rows="3"
                    required
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- 商品列表 -->
        <v-card>
          <v-card-title class="bg-surface-variant">
            Order Items
          </v-card-title>
          <v-list>
            <v-list-item
              v-for="item in cartItems"
              :key="item.id"
            >
              <!-- 商品图片 -->
              <template v-slot:prepend>
                <v-img
                  :src="item.product.image_url"
                  width="80"
                  height="80"
                  cover
                  class="rounded"
                />
              </template>

              <!-- 商品信息 -->
              <v-list-item-title class="font-weight-medium">
                {{ item.product.product_name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Quantity: {{ item.quantity }}
              </v-list-item-subtitle>

              <!-- 价格信息 -->
              <template v-slot:append>
                <div class="text-right">
                  <div class="text-caption">
                    ${{ item.product.price }} × {{ item.quantity }}
                  </div>
                  <div class="text-subtitle-1">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </div>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- 结算信息 -->
      <v-col cols="12" md="4">
        <v-card class="sticky-card">
          <v-card-title class="bg-surface-variant">
            Order Summary
          </v-card-title>
          <v-card-text class="pt-4">
            <!-- 商品总数 -->
            <div class="d-flex justify-space-between mb-4">
              <span>Total Items:</span>
              <span>{{ totalQuantity }}</span>
            </div>

            <!-- 小计 -->
            <div class="d-flex justify-space-between mb-4">
              <span>Subtotal:</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>

            <!-- 运费 -->
            <div class="d-flex justify-space-between mb-4">
              <span>Shipping:</span>
              <span>${{ shipping.toFixed(2) }}</span>
            </div>

            <v-divider class="mb-4" />

            <!-- 总计 -->
            <div class="d-flex justify-space-between mb-6">
              <span class="text-h6">Total:</span>
              <span class="text-h6">${{ total.toFixed(2) }}</span>
            </div>

            <!-- 提交订单按钮 -->
            <v-btn
              color="primary"
              size="large"
              block
              :loading="processing"
              :disabled="!isFormValid || !cartItems.length"
              @click="showConfirmDialog"
            >
              Place Order
            </v-btn>
          </v-card-text>
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

    <!-- 确认订单对话框 -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title>Confirm Order</v-card-title>
        <v-card-text>
          <p class="mb-4">Are you sure you want to place this order?</p>
          <div class="d-flex justify-space-between">
            <span class="text-h6">Total Amount:</span>
            <span class="text-h6">${{ total.toFixed(2) }}</span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="confirmDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            :loading="processing"
            @click="createOrder"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CartItem } from '@/types/cart'
import { cartService } from '@/services/cart'
import { orderService } from '@/services/order'

const route = useRoute()
const router = useRouter()
const form = ref()
const loading = ref(false)
const processing = ref(false)
const isFormValid = ref(false)
const cartItems = ref<CartItem[]>([])
const confirmDialog = ref(false)

// 表单数据
const formData = ref({
  recipient_name: '',
  phone_number: '',
  postal_code: '',
  shipping_address: ''
})

// 计算属性
const totalQuantity = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
)

const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
)

const shipping = computed(() => {
  // 这里可以根据实际需求计算运费
  return subtotal.value > 100 ? 0 : 10
})

const total = computed(() => subtotal.value + shipping.value)

// 获取购物车商品
const fetchCartItems = async () => {
  loading.value = true
  try {
    const selectedIds = route.query.items?.toString().split(',').map(Number)
    if (!selectedIds?.length) {
      router.push('/cart')
      return
    }

    const response = await cartService.getCartItems()
    cartItems.value = response.data.filter(item =>
      selectedIds.includes(item.id)
    )

    if (!cartItems.value.length) {
      router.push('/cart')
    }
  } catch (error) {
    console.error('Failed to fetch cart items:', error)
  } finally {
    loading.value = false
  }
}

// 显示确认对话框
const showConfirmDialog = async () => {
  const { valid } = await form.value.validate()
  if (valid) {
    confirmDialog.value = true
  }
}

// 创建订单
const createOrder = async () => {
  processing.value = true
  try {
    // 创建订单
    const response = await orderService.createOrder({
      ...formData.value,
      items: cartItems.value.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))
    })

    // 清除已购买的商品
    await Promise.all(
      cartItems.value.map(item =>
        cartService.removeFromCart(item.id)
      )
    )

    // 跳转到订单详情页
    router.push({
      name: 'order-detail',
      params: { id: response.data.id },
      query: { from: 'checkout' }
    })
  } catch (error) {
    console.error('Failed to create order:', error)
  } finally {
    processing.value = false
    confirmDialog.value = false
  }
}

onMounted(() => {
  fetchCartItems()
})
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 24px;
}
</style>
