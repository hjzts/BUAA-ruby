<!-- src/views/orders/OrderDetail.vue -->
<template>
  <v-container v-if="order">
    <v-row>
      <!-- 顶部栏 -->
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-item>
            <template v-slot:prepend>
              <v-btn
                variant="text"
                icon="mdi-arrow-left"
                @click="router.back()"
              />
            </template>
            <v-card-title class="text-h5">
              Order #{{ order.id }}
              <v-chip
                :color="getStatusColor(order.status)"
                :text="getStatusText(order.status)"
                class="ml-4"
              />
            </v-card-title>
            <v-card-subtitle>
              Created at {{ formatDate(order.created_at) }}
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>

      <!-- 主要内容 -->
      <v-col cols="12" md="8">
        <!-- 订单商品 -->
        <v-card class="mb-4">
          <v-card-title class="bg-surface-variant">
            Order Items
          </v-card-title>
          <v-list>
            <v-list-item
              v-for="item in order.items"
              :key="item.id"
              :title="item.product_name"
            >
              <template v-slot:subtitle>
                <div class="d-flex justify-space-between align-center mt-1">
                  <span>Quantity: {{ item.quantity }}</span>
                  <span class="text-primary">${{ item.unit_price }} each</span>
                </div>
              </template>
              <template v-slot:append>
                <div class="text-h6">${{ item.total_price }}</div>
              </template>
            </v-list-item>
          </v-list>
          <v-divider />
          <v-card-text class="d-flex justify-space-between">
            <span class="text-h6">Total Amount</span>
            <span class="text-h6">${{ order.total_amount }}</span>
          </v-card-text>
        </v-card>

        <!-- 收货信息 -->
        <v-card class="mb-4">
          <v-card-title class="bg-surface-variant">
            Shipping Information
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-account</v-icon>
                </template>
                <v-list-item-title>{{ order.recipient_name }}</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-phone</v-icon>
                </template>
                <v-list-item-title>{{ order.phone_number }}</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-map-marker</v-icon>
                </template>
                <v-list-item-title>
                  {{ order.shipping_address }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Postal Code: {{ order.postal_code }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 侧边栏 -->
      <v-col cols="12" md="4">
        <!-- 订单操作 -->
        <v-card class="mb-4">
          <v-card-title class="bg-surface-variant">
            Order Actions
          </v-card-title>
          <v-card-text>
            <template v-if="order.status === 'pending'">
              <v-btn
                color="primary"
                block
                class="mb-2"
                :loading="loading"
                @click="payOrder"
              >
                Pay Now
              </v-btn>
              <v-btn
                color="error"
                block
                variant="outlined"
                :loading="loading"
                @click="showCancelDialog"
              >
                Cancel Order
              </v-btn>
            </template>
            <v-btn
              v-else-if="order.status === 'cancelled'"
              color="primary"
              block
              to="/products"
            >
              Continue Shopping
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- 订单状态时间线 -->
        <v-card>
          <v-card-title class="bg-surface-variant">
            Order Timeline
          </v-card-title>
          <v-card-text>
            <v-timeline density="compact" align="start">
              <v-timeline-item
                v-if="order.created_at"
                :dot-color="getTimelineColor('created', order)"
                size="small"
              >
                <div class="text-subtitle-2">Order Created</div>
                <div class="text-caption">{{ formatDate(order.created_at) }}</div>
              </v-timeline-item>

              <v-timeline-item
                :dot-color="getTimelineColor('paid', order)"
                size="small"
              >
                <div class="text-subtitle-2">Payment</div>
                <div v-if="order.paid_at" class="text-caption">
                  {{ formatDate(order.paid_at) }}
                </div>
                <div v-else class="text-caption text-disabled">
                  Waiting for payment
                </div>
              </v-timeline-item>

              <v-timeline-item
                :dot-color="getTimelineColor('shipped', order)"
                size="small"
              >
                <div class="text-subtitle-2">Shipping</div>
                <div v-if="order.shipped_at" class="text-caption">
                  {{ formatDate(order.shipped_at) }}
                </div>
                <div v-else class="text-caption text-disabled">
                  Not shipped yet
                </div>
              </v-timeline-item>

              <v-timeline-item
                :dot-color="getTimelineColor('delivered', order)"
                size="small"
              >
                <div class="text-subtitle-2">Delivery</div>
                <div v-if="order.delivered_at" class="text-caption">
                  {{ formatDate(order.delivered_at) }}
                </div>
                <div v-else class="text-caption text-disabled">
                  Not delivered yet
                </div>
              </v-timeline-item>

              <v-timeline-item
                v-if="order.cancelled_at"
                dot-color="error"
                size="small"
              >
                <div class="text-subtitle-2">Cancelled</div>
                <div class="text-caption">{{ formatDate(order.cancelled_at) }}</div>
                <div class="text-caption text-error">
                  Reason: {{ order.cancellation_reason }}
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 取消订单对话框 -->
    <v-dialog v-model="cancelDialog" max-width="500px">
      <v-card>
        <v-card-title>Cancel Order</v-card-title>
        <v-card-text>
          <p class="mb-4">Are you sure you want to cancel this order?</p>
          <v-textarea
            v-model="cancelReason"
            label="Cancellation Reason"
            rows="3"
            :rules="[v => !!v || 'Reason is required']"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="cancelDialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            :loading="loading"
            @click="cancelOrder"
          >
            Cancel Order
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <!-- 加载状态 -->
  <div
    v-else
    class="d-flex justify-center align-center"
    style="height: 400px"
  >
    <v-progress-circular
      indeterminate
      color="primary"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format } from 'date-fns'
import { orderService, type Order } from '@/utils/order'

const route = useRoute()
const router = useRouter()
const order = ref<Order | null>(null)
const loading = ref(false)
const cancelDialog = ref(false)
const cancelReason = ref('')

const getStatusColor = (status: Order['status']) => {
  const colors = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'error'
  }
  return colors[status]
}

const getStatusText = (status: Order['status']) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getTimelineColor = (stage: string, order: Order) => {
  if (order.cancelled_at) return 'grey'

  switch (stage) {
    case 'created':
      return 'success'
    case 'paid':
      return order.paid_at ? 'success' : 'grey'
    case 'shipped':
      return order.shipped_at ? 'success' : 'grey'
    case 'delivered':
      return order.delivered_at ? 'success' : 'grey'
    default:
      return 'grey'
  }
}

const formatDate = (date: string) => {
  return format(new Date(date), 'PPpp')
}

const fetchOrder = async () => {
  loading.value = true
  try {
    const orderId = parseInt(route.params.id as string)
    order.value = await orderService.getOrder(orderId)
  } catch (error) {
    console.error('Failed to fetch order:', error)
  } finally {
    loading.value = false
  }
}

const payOrder = async () => {
  if (!order.value) return

  loading.value = true
  try {
    await orderService.payOrder(order.value.id)
    await fetchOrder()
  } catch (error) {
    console.error('Failed to pay order:', error)
  } finally {
    loading.value = false
  }
}

const showCancelDialog = () => {
  cancelDialog.value = true
}

const cancelOrder = async () => {
  if (!order.value || !cancelReason.value) return

  loading.value = true
  try {
    await orderService.cancelOrder(order.value.id, cancelReason.value)
    cancelDialog.value = false
    cancelReason.value = ''
    await fetchOrder()
  } catch (error) {
    console.error('Failed to cancel order:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrder()
})
</script>
