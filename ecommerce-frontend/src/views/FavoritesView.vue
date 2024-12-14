<!-- src/views/FavoritesView.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">My Favorites</h1>
      </v-col>
    </v-row>

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
              :class="{ 'on-hover': isHovering }"
            >
              <!-- 产品图片 -->
              <v-img
                :src="favorite.product.image_url"
                height="200"
                cover
                class="bg-grey-lighten-2"
                @click="navigateToProduct(favorite.product.id)"
              >
                <!-- 收藏时间 -->
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

              <!-- 产品信息 -->
              <v-card-title class="text-subtitle-1">
                {{ favorite.product.product_name }}
              </v-card-title>

              <v-card-text>
                <div class="d-flex justify-space-between align-center">
                  <span class="text-h6">${{ favorite.product.price }}</span>
                  <v-chip size="small" color="grey">
                    Added {{ formatDate(favorite.added_at) }}
                  </v-chip>
                </div>
              </v-card-text>

              <v-divider />

              <!-- 操作按钮 -->
              <v-card-actions>
                <v-btn
                  variant="text"
                  color="primary"
                  block
                  @click="navigateToProduct(favorite.product.id)"
                >
                  View Details
                </v-btn>
                <v-btn
                  variant="text"
                  color="error"
                  block
                  @click="confirmRemove(favorite)"
                >
                  Remove
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </template>

      <!-- 空状态 -->
      <v-col v-else cols="12">
        <v-alert
          type="info"
          text="You haven't favorited any products yet."
          class="text-center"
        >
          <template v-slot:append>
            <v-btn
              color="primary"
              variant="text"
              to="/products"
            >
              Browse Products
            </v-btn>
          </template>
        </v-alert>
      </v-col>
    </v-row>

    <!-- 加载状态 -->
    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
      </v-col>
    </v-row>

    <!-- 确认删除对话框 -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>Remove from Favorites?</v-card-title>
        <v-card-text>
          Are you sure you want to remove "{{ selectedFavorite?.product.product_name }}" from your favorites?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="removeFavorite"
            :loading="removing"
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
import { favoriteService, type Favorite } from '@/utils/favorite'
import { format } from 'date-fns'

const router = useRouter()
const loading = ref(false)
const removing = ref(false)
const favorites = ref<Favorite[]>([])
const dialog = ref(false)
const selectedFavorite = ref<Favorite | null>(null)

// 获取收藏列表
const fetchFavorites = async () => {
  loading.value = true
  try {
    favorites.value = await favoriteService.getFavorites()
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
  } finally {
    loading.value = false
  }
}

// 确认删除
const confirmRemove = (favorite: Favorite) => {
  selectedFavorite.value = favorite
  dialog.value = true
}

// 删除收藏
const removeFavorite = async () => {
  if (!selectedFavorite.value) return

  removing.value = true
  try {
    await favoriteService.removeFavorite(selectedFavorite.value.product.id)
    favorites.value = favorites.value.filter(f => f.id !== selectedFavorite.value!.id)
    dialog.value = false
  } catch (error) {
    console.error('Failed to remove favorite:', error)
  } finally {
    removing.value = false
  }
}

// 跳转到产品详情
const navigateToProduct = (id: number) => {
  router.push(`/products/${id}`)
}

// 格式化日期
const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy')
}

// 生命周期钩子
onMounted(() => {
  fetchFavorites()
})
</script>

<style scoped>
.on-hover {
  transform: translateY(-4px);
}

.v-card {
  transition: all 0.3s ease;
}
</style>
