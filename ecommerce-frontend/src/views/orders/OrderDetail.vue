<!-- src/views/orders/OrderDetail.vue -->
<template>
  <v-container v-if="order">
    <!-- 顶部栏 -->
    <v-row>
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
              Order Details #{{ order.attributes.id }}
              <v-chip
                :color="getStatusColor(order.attributes.status)"
                class="ml-4"
              >
                {{ getStatusText(order.attributes.status) }}
              </v-chip>
            </v-card-title>
            <v-card-subtitle>
              Created at {{ formatDate(order.attributes.created_at) }}
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- 主要内容 -->
    <v-row>
      <!-- 左侧：订单信息 -->
      <v-col cols="12" md="6">
        <!-- 商品列表 -->
        <v-card color="secondary" class="mb-4" hover>
          <v-card-title class="bg-surface-variant" >
            Order Items
          </v-card-title>
          <v-list>
            <v-list-item
              v-for="item in order.attributes.items"
              :key="item.id"
              :title="item.product_name"
              :subtitle="item.description"
            >
              <template v-slot:prepend>
                <v-img
                  :src="item.image_url || '/placeholder.png'"
                  width="100"
                  height="100"
                  cover
                />
              </template>
              <template v-slot:append>
                <div class="text-right">
                  <div class="text-body-2">
                    Quantity: {{ item.quantity }}
                  </div>
                  <div class="text-caption">
                    Unit Price: ${{ item.unit_price }}
                  </div>
                  <div class="text-h6 mt-1">
                    ${{ item.total_price }}
                  </div>
                </div>
              </template>
            </v-list-item>

            <v-divider />

            <!-- 总计 -->
            <v-list-item>
              <template v-slot:append>
                <div class="text-right">
                  <div class="text-h6">
                    Total Amount: ${{ order.attributes.total_amount }}
                  </div>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- 收货信息 -->
        <v-card>
          <v-card-title class="bg-surface-variant" hover>
            Shipping Information
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-account</v-icon>
                </template>
                <v-list-item-title>Recipient</v-list-item-title>
                <v-list-item-subtitle>{{ order.attributes.recipient_name }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-phone</v-icon>
                </template>
                <v-list-item-title>Phone</v-list-item-title>
                <v-list-item-subtitle>{{ order.attributes.phone_number }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-map-marker</v-icon>
                </template>
                <v-list-item-title>Address</v-list-item-title>
                <v-list-item-subtitle>
                  {{ order.attributes.shipping_address }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-postage-stamp</v-icon>
                </template>
                <v-list-item-title>Postal Code</v-list-item-title>
                <v-list-item-subtitle>{{ order.attributes.postal_code }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 右侧：状态和操作 -->
      <v-col cols="12" md="6">
        <!-- 状态卡片 -->
        <v-card class="mb-4">
          <v-card-title class="bg-surface-variant" hover>
            Order Status
          </v-card-title>
          <v-card-text>
            <v-timeline>
              <v-timeline-item
                dot-color="primary"
                size="small"
              >
                <div class="text-subtitle-2">Order Created</div>
                <div class="text-caption">{{ formatDate(order.attributes.created_at) }}</div>
              </v-timeline-item>

              <v-timeline-item
                :dot-color="order.attributes.paid_at ? 'success' : 'grey'"
                size="small"
              >
                <div class="text-subtitle-2">Payment</div>
                <div v-if="order.attributes.paid_at" class="text-caption">
                  {{ formatDate(order.attributes.paid_at) }}
                </div>
                <div v-else class="text-caption text-disabled">
                  Waiting for payment
                </div>
              </v-timeline-item>

              <v-timeline-item
                :dot-color="order.attributes.shipped_at ? 'info' : 'grey'"
                size="small"
              >
                <div class="text-subtitle-2">Shipping</div>
                <div v-if="order.attributes.shipped_at" class="text-caption">
                  {{ formatDate(order.attributes.shipped_at) }}
                </div>
                <div v-else class="text-caption text-disabled">
                  Not shipped yet
                </div>
              </v-timeline-item>

              <v-timeline-item
                :dot-color="order.attributes.delivered_at ? 'success' : 'grey'"
                size="small"
              >
                <div class="text-subtitle-2">Delivery</div>
                <div v-if="order.attributes.delivered_at" class="text-caption">
                  {{ formatDate(order.attributes.delivered_at) }}
                </div>
                <div v-else class="text-caption text-disabled">
                  Not delivered yet
                </div>
              </v-timeline-item>

              <v-timeline-item
                v-if="order.attributes.cancelled_at"
                dot-color="error"
                size="small"
              >
                <div class="text-subtitle-2">Cancelled</div>
                <div class="text-caption">{{ formatDate(order.attributes.cancelled_at) }}</div>
                <div class="text-caption text-error">
                  Reason: {{ order.attributes.cancellation_reason }}
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>

        <!-- 操作卡片 -->
        <v-card elevation="3" rounded="lg" class="mb-4">
          <!-- 卡片标题 -->
          <v-card-title class="bg-surface-variant text-white rounded-t-lg">
            <v-icon class="mr-2">mdi-cog</v-icon>
            Actions
          </v-card-title>

          <!-- 卡片内容 -->
          <v-card-text class="d-flex flex-column align-center py-4">
            <!-- 如果状态为 pending -->
            <template v-if="order.attributes.status === 'pending'">
              <v-btn
                color="primary"
                block
                class="mb-3"
                elevation="2"
                large
                @click="showPayDialog"
              >
                <v-icon left>mdi-cash</v-icon>
                Pay Now
              </v-btn>
              <v-btn
                color="error"
                block
                elevation="1"
                outlined
                large
                @click="showCancelDialog"
              >
                <v-icon left>mdi-cancel</v-icon>
                Cancel Order
              </v-btn>
            </template>

            <!-- 如果状态为 shipped -->
            <template v-else-if="order.attributes.status === 'shipped'">
              <v-btn
                color="success"
                block
                elevation="2"
                large
                @click="confirmDelivery"
              >
                <v-icon left>mdi-truck-check</v-icon>
                Confirm Delivery
              </v-btn>
            </template>

            <!-- 如果状态为 paid -->
            <template v-else-if="order.attributes.status === 'paid'">
              <v-btn
                color="success"
                block
                outlined
                large
                disabled
              >
                <v-icon left>mdi-check-circle</v-icon>
                已支付
              </v-btn>
            </template>

            <!-- 如果状态为 delivered -->
            <template v-else-if="order.attributes.status === 'delivered'">
              <v-btn
                color="success"
                block
                outlined
                large
                disabled
              >
                <v-icon left>mdi-package-variant-closed</v-icon>
                已接收
              </v-btn>
            </template>
          </v-card-text>

          <!-- 卡片底部装饰 -->
          <v-divider></v-divider>
          <v-card-subtitle class="text-center text-caption py-2">
            Manage your order actions here
          </v-card-subtitle>
        </v-card>

      </v-col>
    </v-row>

    <!-- 支付对话框 -->
    <v-dialog v-model="payDialog" max-width="400">
      <v-card>
        <v-card-title>Confirm Payment</v-card-title>
        <v-card-text>
          <p>Total Amount: ${{ order.total_amount }}</p>
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
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 取消订单对话框 -->
    <v-dialog v-model="cancelDialog" max-width="400">
      <v-card>
        <v-card-title>Cancel Order</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="cancelReason"
            label="Cancellation Reason"
            :rules="[v => !!v || 'Reason is required']"
            rows="3"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="cancelDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            :loading="processing"
            @click="cancelOrder"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>

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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format } from 'date-fns'
import type { Order } from '@/types/order'
import { orderService } from '@/services/order'

const route = useRoute()
const router = useRouter()
const order = ref<Order | null>(null)
const loading = ref(false)
const processing = ref(false)
const payDialog = ref(false)
const cancelDialog = ref(false)
const cancelReason = ref('')

// 获取订单详情
const fetchOrder = async () => {
  loading.value = true
  try {
    const orderId = parseInt(route.params.id as string)
    const response = await orderService.getOrder(orderId)
    order.value = response.data
    console.log('Order:', order.value)
    console.log('get order response: ', response)
  } catch (error) {
    console.error('Failed to fetch order:', error)
  } finally {
    loading.value = false
  }
}

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

const showPayDialog = () => {
  payDialog.value = true
}

const payOrder = async () => {
  if (!order.value) return

  processing.value = true
  try {
    await orderService.payOrder(order.value.id)
    payDialog.value = false
    await fetchOrder()
  } catch (error) {
    console.error('Failed to pay order:', error)
  } finally {
    processing.value = false
  }
}

const showCancelDialog = () => {
  cancelDialog.value = true
}

const cancelOrder = async () => {
  if (!order.value || !cancelReason.value) return

  processing.value = true
  try {
    await orderService.cancelOrder(order.value.id, cancelReason.value)
    cancelDialog.value = false
    cancelReason.value = ''
    await fetchOrder()
  } catch (error) {
    console.error('Failed to cancel order:', error)
  } finally {
    processing.value = false
  }
}

const confirmDelivery = async () => {
  if (!order.value) return

  processing.value = true
  try {
    await orderService.confirmDelivery(order.value.id)
    await fetchOrder()
  } catch (error) {
    console.error('Failed to confirm delivery:', error)
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  fetchOrder()
})
</script>

<style scoped>
.bg-surface-variant {
  background-color: #b771cb !important;
}
</style>
