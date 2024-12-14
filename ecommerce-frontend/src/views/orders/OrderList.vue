<!-- src/views/orders/OrderList.vue -->
<template>
  <v-container>
    <!-- 页面标题和过滤器 -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h4">My Orders</h1>
      </v-col>
      <v-col cols="12" md="6" class="d-flex align-center justify-end">
        <v-select
          v-model="filters.status"
          :items="orderStatuses"
          label="Status"
          hide-details
          class="mr-4"
          style="max-width: 200px"
        />
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          @click="fetchOrders"
        >
          Refresh
        </v-btn>
      </v-col>
    </v-row>

    <!-- 订单列表 -->
    <template v-if="!loading">
      <template v-if="orders.length">
        <v-card
          v-for="order in orders"
          :key="order.id"
          class="mb-4"
          :class="{ 'cancelled': order.status === 'cancelled' }"
        >
          <!-- 订单头部 -->
          <v-card-item>
            <template v-slot:prepend>
              <div class="order-status">
                <v-chip
                  :color="getStatusColor(order.status)"
                  :text="getStatusText(order.status)"
                  size="small"
                />
              </div>
            </template>
            <v-card-title>
              Order #{{ order.id }}
              <span class="text-subtitle-2 ml-4">
                {{ formatDate(order.created_at) }}
              </span>
            </v-card-title>
            <v-card-subtitle>
              {{ order.items.length }} items · Total: ${{ order.total_amount }}
            </v-card-subtitle>
          </v-card-item>

          <v-divider />

          <!-- 订单内容 -->
          <v-card-text>
            <!-- 商品列表 -->
            <div class="order-items mb-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="order-item d-flex align-center py-2"
              >
                <div class="flex-grow-1">
                  <div class="text-subtitle-1">{{ item.product_name }}</div>
                  <div class="text-caption">
                    Quantity: {{ item.quantity }} ·
                    Unit Price: ${{ item.unit_price }} ·
                    Total: ${{ item.total_price }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 收货信息 -->
            <div class="shipping-info">
              <div class="d-flex align-center mb-2">
                <v-icon size="small" class="mr-2">mdi-account</v-icon>
                <span>{{ order.recipient_name }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <v-icon size="small" class="mr-2">mdi-phone</v-icon>
                <span>{{ order.phone_number }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
                <span>
                  {{ order.shipping_address }} {{ order.postal_code }}
                </span>
              </div>
            </div>
          </v-card-text>

          <!-- 订单状态时间线 -->
          <v-card-text>
            <v-timeline density="compact" align="start">
              <v-timeline-item
                v-if="order.created_at"
                dot-color="grey"
                size="small"
              >
                <div class="text-caption">
                  Order Created: {{ formatDate(order.created_at) }}
                </div>
              </v-timeline-item>
              <v-timeline-item
                v-if="order.paid_at"
                dot-color="success"
                size="small"
              >
                <div class="text-caption">
                  Paid: {{ formatDate(order.paid_at) }}
                </div>
              </v-timeline-item>
              <v-timeline-item
                v-if="order.shipped_at"
                dot-color="info"
                size="small"
              >
                <div class="text-caption">
                  Shipped: {{ formatDate(order.shipped_at) }}
                </div>
              </v-timeline-item>
              <v-timeline-item
                v-if="order.delivered_at"
                dot-color="success"
                size="small"
              >
                <div class="text-caption">
                  Delivered: {{ formatDate(order.delivered_at) }}
                </div>
              </v-timeline-item>
              <v-timeline-item
                v-if="order.cancelled_at"
                dot-color="error"
                size="small"
              >
                <div class="text-caption">
                  Cancelled: {{ formatDate(order.cancelled_at) }}
                </div>
                <div class="text-caption text-error">
                  Reason: {{ order.cancellation_reason }}
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>

          <v-divider />

          <!-- 订单操作 -->
          <v-card-actions>
            <v-spacer />
            <template v-if="order.status === 'pending'">
              <v-btn
                color="primary"
                variant="text"
                @click="payOrder(order)"
              >
                Pay Now
              </v-btn>
              <v-btn
                color="error"
                variant="text"
                @click="showCancelDialog(order)"
              >
                Cancel
              </v-btn>
            </template>
            <v-btn
              variant="text"
              @click="viewOrderDetails(order)"
            >
              View Details
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- 分页 -->
        <div class="text-center" v-if="totalPages > 1">
          <v-pagination
            v-model="page"
            :length="totalPages"
            @update:model-value="fetchOrders"
          />
        </div>
      </template>

      <!-- 空状态 -->
      <v-alert
        v-else
        type="info"
        text="No orders found."
        class="mt-4"
      />
    </template>

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
            :loading="cancelling"
            @click="confirmCancel"
          >
            Cancel Order
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { orderService, type Order } from '@/utils/order'

const router = useRouter()
const loading = ref(false)
const orders = ref<Order[]>([])
const page = ref(1)
const totalPages = ref(1)
const cancelDialog = ref(false)
const cancelling = ref(false)
const selectedOrder = ref<Order | null>(null)
const cancelReason = ref('')

const filters = ref({
  status: '',
  per_page: 10
})

const orderStatuses = [
  { title: 'All Orders', value: '' },
  { title: 'Pending', value: 'pending' },
  { title: 'Paid', value: 'paid' },
  { title: 'Shipped', value: 'shipped' },
  { title: 'Delivered', value: 'delivered' },
  { title: 'Cancelled', value: 'cancelled' }
]

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

const formatDate = (date: string) => {
  return format(new Date(date), 'PPpp')
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await orderService.getOrders({
      ...filters.value,
      page: page.value
    })
    orders.value = response
    // 假设这里能获取到总页数
    totalPages.value = 10
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    loading.value = false
  }
}

const payOrder = async (order: Order) => {
  try {
    await orderService.payOrder(order.id)
    fetchOrders()
  } catch (error) {
    console.error('Failed to pay order:', error)
  }
}

const showCancelDialog = (order: Order) => {
  selectedOrder.value = order
  cancelDialog.value = true
}

const confirmCancel = async () => {
  if (!selectedOrder.value || !cancelReason.value) return

  cancelling.value = true
  try {
    await orderService.cancelOrder(selectedOrder.value.id, cancelReason.value)
    cancelDialog.value = false
    cancelReason.value = ''
    fetchOrders()
  } catch (error) {
    console.error('Failed to cancel order:', error)
  } finally {
    cancelling.value = false
  }
}

const viewOrderDetails = (order: Order) => {
  router.push(`/orders/${order.id}`)
}

watch(() => filters.value.status, () => {
  page.value = 1
  fetchOrders()
})

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.cancelled {
  opacity: 0.7;
}

.order-item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.shipping-info {
  background-color: rgb(var(--v-theme-surface-variant));
  padding: 16px;
  border-radius: 4px;
}
</style>
