<!-- src/views/favorites/FavoriteList.vue -->
<template>
  <v-container>
    <!-- 页面标题 -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-6">
          <v-icon
            icon="mdi-heart"
            color="error"
            size="x-large"
            class="me-3"
          />
          <h1 class="text-h4 mb-0">我的收藏</h1>
          <v-spacer />
          <v-btn
            prepend-icon="mdi-refresh"
            @click="fetchFavorites"
            :loading="loading"
          >
            Refresh
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 收藏列表 -->
    <v-row v-if="!loading">
      <template v-if="favorites.length">
        <v-col
          v-for="favorite in favorites"
          :key="favorite.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :elevation="isHovering ? 8 : 2"
              class="h-100 favorite-card"
              :class="{ 'on-hover': isHovering }"
            >
              <!-- 商品图片 -->
              <v-img
                :src="favorite.attributes.product.image_url || '/placeholder.png'"
                :aspect-ratio="1"
                cover
                class="bg-grey-lighten-2"
                @click="goToProduct(favorite.attributes.product.id)"
              >
                <!-- 价格标签 -->
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

                <!-- 收藏时间 -->
                <div class="favorite-time">
                  <v-chip
                    size="small"
                    color="white"
                    variant="flat"
                  >
                    Added {{ formatDate(favorite.attributes.added_at) }}
                  </v-chip>
                </div>
              </v-img>

              <v-card-item>
                <v-card-title class="text-subtitle-1 mb-1">
                  {{ favorite.attributes.product.product_name }}
                </v-card-title>
                <v-card-subtitle>
                  <div class="d-flex align-center">
                    <span class="text-primary text-h6">${{ favorite.attributes.product.price }}</span>
                    <v-spacer />
                    <v-chip
                      :color="favorite.attributes.product.in_stock ? 'success' : 'error'"
                      size="small"
                    >
                      {{ favorite.attributes.product.in_stock ? 'In Stock' : 'Out of Stock' }}
                    </v-chip>
                  </div>
                </v-card-subtitle>
              </v-card-item>

              <v-card-text class="text-truncate">
                {{ favorite.attributes.product.description }}
              </v-card-text>

              <v-divider />

              <!-- 操作按钮 -->
              <v-card-actions>
                <v-btn
                  variant="text"
                  color="primary"
                  prepend-icon="mdi-cart"
                  :disabled="!favorite.attributes.product.in_stock"
                  @click="addToCart(favorite.attributes.product)"
                >
                  Add to Cart
                </v-btn>
                <v-spacer />
                <v-btn
                  variant="text"
                  color="error"
                  icon="mdi-heart-off"
                  @click="showRemoveDialog(favorite)"
                />
              </v-card-actions>

              <!-- 加入购物车反馈 -->
              <v-snackbar
                v-model="favorite.showAddedSnackbar"
                :timeout="2000"
                color="success"
                location="top"
              >
                Added to cart successfully!
              </v-snackbar>
            </v-card>
          </v-hover>
        </v-col>
      </template>

      <!-- 空状态 -->
      <v-col v-else cols="12">
        <v-card class="text-center pa-12">
          <v-icon
            icon="mdi-heart-outline"
            size="100"
            color="grey-lighten-1"
            class="mb-4"
          />
          <h3 class="text-h5 mb-2">Your Favorites List is Empty</h3>
          <p class="text-body-1 mb-6">Start exploring our products and save your favorites!</p>
          <v-btn
            color="primary"
            size="large"
            to="/products"
            prepend-icon="mdi-shopping"
          >
            Browse Products
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

    <!-- 取消收藏确认对话框 -->
    <v-dialog v-model="removeDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          Remove from Favorites?
        </v-card-title>
        <v-card-text>
          Are you sure you want to remove
          <strong>{{ selectedFavorite?.product.product_name }}</strong>
          from your favorites?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="removeDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            :loading="removing"
            @click="removeFavorite"
          >
            Remove
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import type { Favorite } from '@/types/favorite'
import type { Product } from '@/types/product'
import { favoriteService } from '@/services/favorite'
import { cartService } from '@/services/cart'

const router = useRouter()
const loading = ref(false)
const removing = ref(false)
const favorites = ref<(Favorite & { showAddedSnackbar?: boolean })[]>([])
const removeDialog = ref(false)
const selectedFavorite = ref<Favorite | null>(null)

// 获取收藏列表
const fetchFavorites = async () => {
  loading.value = true
  try {
    const response = await favoriteService.getFavorites()
    favorites.value = response.data.map(favorite => ({
      ...favorite,
      showAddedSnackbar: false
    }))
    console.log("favorites: ", favorites.value)
    console.log("favorites length : ", favorites.value.length)
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy')
}

// 跳转到商品详情
const goToProduct = (id: number) => {
  router.push(`/products/${id}`)
}

// 添加到购物车
const addToCart = async (product: Product) => {
  try {
    await cartService.addToCart(product.id, 1)
    const favorite = favorites.value.find(f => f.product.id === product.id)
    if (favorite) {
      favorite.showAddedSnackbar = true
    }
  } catch (error) {
    console.error('Failed to add to cart:', error)
  }
}

// 显示删除确认框
const showRemoveDialog = (favorite: Favorite) => {
  selectedFavorite.value = favorite
  removeDialog.value = true
}

// 移除收藏
const removeFavorite = async () => {
  if (!selectedFavorite.value) return

  removing.value = true
  try {
    await favoriteService.removeFavorite(selectedFavorite.value.id)
    favorites.value = favorites.value.filter(f => f.id !== selectedFavorite.value?.id)
    removeDialog.value = false
  } catch (error) {
    console.error('Failed to remove favorite:', error)
  } finally {
    removing.value = false
  }
}

onMounted(() => {
  fetchFavorites()
})
</script>

<style scoped>
.favorite-card {
  transition: all 0.3s ease;
}

.favorite-card.on-hover {
  transform: translateY(-4px);
}

.favorite-time {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

.v-card-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
