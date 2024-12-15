<template>
  <v-container>
    <!-- 页面标题和工具栏 -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-6">
          <v-icon
            icon="mdi-file-document-outline"
            size="x-large"
            class="me-3"
          />
          <h1 class="text-h4 mb-0">My Orders</h1>
          <v-spacer />
          <v-btn
            prepend-icon="mdi-refresh"
            @click="fetchOrders"
            :loading="loading"
          >
            Refresh
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 过滤器 -->
    <v-row class="mb-4">
      <v-col cols="12" sm="4">
        <v-select
          v-model="filters.status"
          :items="orderStatuses"
          label="Status"
          clearable
          @update:model-value="fetchOrders"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="filters.search"
          label="Search orders"
          prepend-inner-icon="mdi-magnify"
          clearable
          @keyup.enter="fetchOrders"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="filters.dateRange"
          label="Date range"
          type="date"
          clearable
          @update:model-value="fetchOrders"
        />
      </v-col>
    </v-row>

    <!-- 订单列表 -->
    <template v-if="!loading">
      <template v-if="orders.length">
        <v-card
          v-for="order in orders"
          :key="order.id"
          class="mb-4"
          :class="{ 'cancelled': order.attributes.status === 'cancelled' }"
        >
          <!-- 订单头部 -->
          <v-card-item>
            <template v-slot:prepend>
              <v-chip
                :color="getStatusColor(order.attributes.status)"
                label
              >
                {{ getStatusText(order.attributes.status) }}
              </v-chip>
            </template>
            <v-card-title>
              Order #{{ order.attributes.id }}
              <span class="text-caption ml-2">
                {{ formatDate(order.attributes.created_at) }}
              </span>
            </v-card-title>
            <v-card-subtitle>
              Total: ${{ order.attributes.total_amount }} ·
              {{ order.attributes.items.length }} items
            </v-card-subtitle>
          </v-card-item>

          <v-divider />

          <!-- 订单内容 -->
          <v-card-text>
            <!-- 收货信息 -->
            <div class="shipping-info mb-4">
              <div class="d-flex flex-wrap">
                <v-chip
                  class="me-2 mb-2"
                  prepend-icon="mdi-account"
                >
                  {{ order.attributes.recipient_name }}
                </v-chip>
                <v-chip
                  class="me-2 mb-2"
                  prepend-icon="mdi-phone"
                >
                  {{ order.attributes.phone_number }}
                </v-chip>
                <v-chip
                  class="me-2 mb-2"
                  prepend-icon="mdi-map-marker"
                >
                  {{ order.attributes.shipping_address }}
                </v-chip>
                <v-chip
                  class="mb-2"
                  prepend-icon="mdi-postage-stamp"
                >
                  {{ order.attributes.postal_code }}
                </v-chip>
              </div>
            </div>

            <!-- 订单项列表 -->
            <v-expansion-panels>
              <v-expansion-panel
                title="Order Items"
                :text="`${order.attributes.items.length} items`"
              >
                <template v-slot:text>
                  <v-list>
                    <v-list-item
                      v-for="item in order.attributes.items"
                      :key="item.id"
                      :title="item.product_name"
                    >
                      <!-- item 就是 product了 -->
                      <template v-slot:prepend>
                        <v-avatar rounded="0" size="80">
                          <v-img :src="item.image_url || '/placeholder.png'" />
                        </v-avatar>
                      </template>
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
                </template>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- 订单状态时间线 -->
            <v-timeline class="mt-4" density="compact">
              <v-timeline-item
                dot-color="primary"
                size="small"
              >
                <div class="text-caption">
                  Created: {{ formatDate(order.attributes.created_at) }}
                </div>
              </v-timeline-item>
              <v-timeline-item
                v-if="order.attributes.paid_at"
                dot-color="success"
                size="small"
              >
                <div class="text-caption">
                  Paid: {{ formatDate(order.attributes.paid_at) }}
                </div>
              </v-timeline-item>
              <v-timeline-item
                v-if="order.attributes.shipped_at"
                dot-color="info"
                size="small"
              >
                <div class="text-caption">
                  Shipped: {{ formatDate(order.attributes.shipped_at) }}
                </div>
              </v-timeline-item>
              <v-timeline-item
                v-if="order.attributes.delivered_at"
                dot-color="success"
                size="small"
              >
                <div class="text-caption">
                  Delivered: {{ formatDate(order.attributes.delivered_at) }}
                </div>
              </v-timeline-item>
              <v-timeline-item
                v-if="order.attributes.cancelled_at"
                dot-color="error"
                size="small"
              >
                <div class="text-caption">
                  Cancelled: {{ formatDate(order.attributes.cancelled_at) }}
                </div>
                <div class="text-caption text-error">
                  Reason: {{ order.attributes.cancellation_reason }}
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>

          <v-divider />

          <!-- 订单操作 -->
          <v-card-actions>
            <v-spacer />
            <template v-if="order.attributes.status === 'pending'">
              <v-btn
                color="primary"
                variant="text"
                @click="showPayDialog(order)"
              >
                Pay Now
              </v-btn>
              <v-btn
                color="error"
                variant="text"
                @click="showCancelDialog(order)"
              >
                Cancel Order
              </v-btn>
            </template>
            <template v-if="order.attributes.status === 'shipped'">
              <v-btn
                color="success"
                variant="text"
                @click="confirmDelivery(order)"
              >
                Confirm Delivery
              </v-btn>
            </template>
            <v-btn
              variant="text"
              :to="`/orders/${order.id}`"
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
      <v-card
        v-else
        class="text-center pa-12"
      >
        <v-icon
          icon="mdi-package-variant"
          size="100"
          color="grey-lighten-1"
          class="mb-4"
        />
        <h3 class="text-h5 mb-2">No Orders Found</h3>
        <p class="text-body-1 mb-6">
          {{
            filters.status
              ? `No ${filters.status} orders found.`
              : 'Start shopping to create your first order!'
          }}
        </p>
        <v-btn
          color="primary"
          size="large"
          to="/products"
          prepend-icon="mdi-shopping"
        >
          Browse Products
        </v-btn>
      </v-card>
    </template>

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

    <!-- 支付确认对话框 -->
    <v-dialog v-model="payDialog" max-width="400">
      <v-card>
        <v-card-title>Confirm Payment</v-card-title>
        <v-card-text>
          Are you sure you want to pay for Order #{{ selectedOrder?.id }}?
          <div class="text-h6 mt-2">
            Total Amount: ${{ selectedOrder?.total_amount }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="payDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            :loading="processing"
            @click="payOrder"
          >
            Pay Now
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 取消订单对话框 -->
    <v-dialog v-model="cancelDialog" max-width="400">
      <v-card>
        <v-card-title>Cancel Order</v-card-title>
        <v-card-text>
          <p class="mb-4">Are you sure you want to cancel Order #{{ selectedOrder?.id }}?</p>
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
            No
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            :loading="processing"
            @click="cancelOrder"
          >
            Yes, Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import type { Order } from '@/types/order'
import { orderService } from '@/services/order'

const loading = ref(false)
const processing = ref(false)
const orders = ref<Order[]>([])
const page = ref(1)
const totalPages = ref(0)
const selectedOrder = ref<Order | null>(null)
const payDialog = ref(false)
const cancelDialog = ref(false)
const cancelReason = ref('')

const filters = ref({
  status: '',
  search: '',
  dateRange: ''
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

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await orderService.getOrders({
      ...filters.value,
      page: page.value
    })
    orders.value = response.data
    console.log("orders: ", orders.value)
    console.log("get order response: ", response)
    totalPages.value = response.meta.total_pages
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    loading.value = false
  }
}

// 显示支付对话框
const showPayDialog = (order: Order) => {
  selectedOrder.value = order
  payDialog.value = true
}

// 支付订单
const payOrder = async () => {
  if (!selectedOrder.value) return

  processing.value = true
  try {
    await orderService.payOrder(selectedOrder.value.id)
    payDialog.value = false
    await fetchOrders()
  } catch (error) {
    console.error('Failed to pay order:', error)
  } finally {
    processing.value = false
  }
}

// 显示取消对话框
const showCancelDialog = (order: Order) => {
  selectedOrder.value = order
  cancelDialog.value = true
}

// 取消订单
const cancelOrder = async () => {
  if (!selectedOrder.value || !cancelReason.value) return

  processing.value = true
  try {
    await orderService.cancelOrder(selectedOrder.value.id, cancelReason.value)
    cancelDialog.value = false
    cancelReason.value = ''
    await fetchOrders()
  } catch (error) {
    console.error('Failed to cancel order:', error)
  } finally {
    processing.value = false
  }
}
// 确认收货功能
const confirmDelivery = async (order: Order) => {
  processing.value = true
  try {
    await orderService.confirmDelivery(order.id)
    await fetchOrders()
  } catch (error) {
    console.error('Failed to confirm delivery:', error)
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.cancelled {
  opacity: 0.7;
}

.shipping-info {
  background-color: rgb(94, 199, 129);
  padding: 16px;
  border-radius: 4px;
}
</style>
