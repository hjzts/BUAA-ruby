<!-- src/views/TestAPI.vue -->
<template>
  <v-container>
    <h1 class="text-h4 mb-6">API Testing Page</h1>

    <!-- 响应结果显示 -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            Response
            <v-spacer/>
            <v-btn
              size="small"
              icon="mdi-refresh"
              @click="clearResponse"
            />
          </v-card-title>
          <v-card-text>
            <pre class="response-box">{{ responseData }}</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- 产品测试 -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title>Products API</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-btn
                  block
                  color="primary"
                  @click="getProducts"
                >
                  Get Products List
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="productId"
                  label="Product ID"
                  type="number"
                />
                <v-btn
                  block
                  color="info"
                  @click="getProduct"
                  :disabled="!productId"
                >
                  Get Product Detail
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 购物车测试 -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title>Cart API</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-btn
                  block
                  color="primary"
                  @click="getCart"
                >
                  Get Cart Items
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="cartProductId"
                  label="Product ID"
                  type="number"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="cartQuantity"
                  label="Quantity"
                  type="number"
                />
              </v-col>
              <v-col cols="12">
                <v-btn
                  block
                  color="success"
                  @click="addToCart"
                  :disabled="!cartProductId || !cartQuantity"
                >
                  Add to Cart
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn
                  block
                  color="error"
                  @click="clearCart"
                >
                  Clear Cart
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 订单测试 -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title>Orders API</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-btn
                  block
                  color="primary"
                  @click="getOrders"
                >
                  Get Orders List
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn
                  block
                  color="success"
                  @click="createOrder"
                >
                  Create Order from Cart
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="orderId"
                  label="Order ID"
                  type="number"
                />
                <v-btn-group
                  variant="outlined"
                  class="w-100"
                >
                  <v-btn
                    color="primary"
                    @click="payOrder"
                    :disabled="!orderId"
                  >
                    Pay
                  </v-btn>
                  <v-btn
                    color="warning"
                    @click="confirmDelivery"
                    :disabled="!orderId"
                  >
                    Confirm Delivery
                  </v-btn>
                  <v-btn
                    color="error"
                    @click="cancelOrder"
                    :disabled="!orderId"
                  >
                    Cancel
                  </v-btn>
                </v-btn-group>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 收藏夹测试 -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title>Favorites API</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-btn
                  block
                  color="primary"
                  @click="getFavorites"
                >
                  Get Favorites List
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="favoriteProductId"
                  label="Product ID"
                  type="number"
                />
                <v-btn
                  block
                  color="success"
                  @click="addToFavorites"
                  :disabled="!favoriteProductId"
                >
                  Add to Favorites
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { productService } from '@/services/product'
import { cartService } from '@/services/cart'
import { orderService } from '@/services/order'
import { favoriteService } from '@/services/favorite'

const responseData = ref<any>(null)
const productId = ref('')
const cartProductId = ref('')
const cartQuantity = ref('')
const orderId = ref('')
const favoriteProductId = ref('')

// 显示响应数据
const showResponse = (data: any) => {
  responseData.value = JSON.stringify(data, null, 2)
}

const clearResponse = () => {
  responseData.value = null
}

// 产品相关
const getProducts = async () => {
  try {
    const response = await productService.getProducts({
      page: 1,
      per_page: 10
    })
    showResponse(response)
  } catch (error) {
    showResponse(error)
  }
}

const getProduct = async () => {
  if (!productId.value) return
  try {
    const response = await productService.getProduct(Number(productId.value))
    showResponse(response)
  } catch (error) {
    showResponse(error)
  }
}

// 购物车相关
const getCart = async () => {
  try {
    const response = await cartService.getCartItems()
    showResponse(response)
  } catch (error) {
    showResponse(error)
  }
}

const addToCart = async () => {
  if (!cartProductId.value || !cartQuantity.value) return
  try {
    const response = await cartService.addToCart(
      Number(cartProductId.value),
      Number(cartQuantity.value)
    )
    showResponse(response)
  } catch (error) {
    showResponse(error)
  }
}

const clearCart = async () => {
  try {
    await cartService.clearCart()
    showResponse({ message: 'Cart cleared successfully' })
  } catch (error) {
    showResponse(error)
  }
}

// 订单相关
const getOrders = async () => {
  try {
    const response = await orderService.getOrders()
    showResponse(response)
  } catch (error) {
    showResponse(error)
  }
}

const createOrder = async () => {
  try {
    const response = await orderService.createOrder({
      recipient_name: 'admin',
      shipping_address: 'Test Address',
      phone_number: '1234567890',
      postal_code: '12345'
    })
    showResponse(response)
  } catch (error) {
    showResponse(error)
  }
}

const payOrder = async () => {
  if (!orderId.value) return
  try {
    const response = await orderService.payOrder(Number(orderId.value))
    showResponse(response)
  } catch (error) {
    showResponse(error)
  }
}

const confirmDelivery = async () => {
  if (!orderId.value) return
  try {
    const response = await orderService.confirmDelivery(Number(orderId.value))
    showResponse(response)
  } catch (error) {
    showResponse(error)
  }
}

const cancelOrder = async () => {
  if (!orderId.value) return
  try {
    const response = await orderService.cancelOrder(
      Number(orderId.value),
      'Test cancellation'
    )
    showResponse(response)
  } catch (error) {
    showResponse(error)
  }
}

// 收藏夹相关
const getFavorites = async () => {
  try {
    const response = await favoriteService.getFavorites()
    showResponse(response)
  } catch (error) {
    showResponse(error)
  }
}

const addToFavorites = async () => {
  if (!favoriteProductId.value) return
  try {
    const response = await favoriteService.addFavorite(
      Number(favoriteProductId.value)
    )
    showResponse(response)
  } catch (error) {
    showResponse(error)
  }
}
</script>

<style scoped>
.response-box {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.w-100 {
  width: 100%;
}
</style>
