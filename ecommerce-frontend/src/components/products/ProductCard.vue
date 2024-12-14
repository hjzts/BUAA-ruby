<!-- src/components/products/ProductCard.vue -->
<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      :elevation="isHovering ? 8 : 2"
      :class="{ 'on-hover': isHovering }"
    >
      <!-- 产品图片 -->
      <v-img
        :src="product.image_url"
        height="200"
        cover
        class="align-end"
        @click="navigateToDetail"
      >
        <!-- 收藏按钮 -->
        <v-btn
          icon="mdi-heart"
          :color="product.is_favorited ? 'red' : undefined"
          variant="tonal"
          class="ma-2"
          @click.stop="$emit('toggle-favorite', product)"
        />

        <!-- 缺货标签 -->
        <v-chip
          v-if="!product.in_stock"
          color="error"
          class="ma-2"
        >
          Out of Stock
        </v-chip>
      </v-img>

      <v-card-title class="text-subtitle-1">
        {{ product.product_name }}
      </v-card-title>

      <!-- 产品信息 -->
      <v-card-text>
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-h6">${{ product.price }}</span>
          <span class="text-caption">
            {{ product.stock_quantity }} in stock
          </span>
        </div>

        <!-- 可选配置预览 -->
        <div class="mb-2" v-if="product.sizes?.length">
          <v-chip-group>
            <v-chip
              v-for="size in product.sizes.slice(0, 3)"
              :key="size.id"
              density="comfortable"
              size="small"
            >
              {{ size.size_name }}
            </v-chip>
            <v-chip
              v-if="product.sizes.length > 3"
              density="comfortable"
              size="small"
            >
              +{{ product.sizes.length - 3 }}
            </v-chip>
          </v-chip-group>
        </div>

        <div class="mb-2" v-if="product.colors?.length">
          <div class="d-flex gap-1">
            <v-avatar
              v-for="color in product.colors.slice(0, 4)"
              :key="color.id"
              :color="color.rgb"
              size="20"
            />
            <span
              v-if="product.colors.length > 4"
              class="text-caption"
            >
              +{{ product.colors.length - 4 }}
            </span>
          </div>
        </div>

        <div class="text-truncate">
          {{ product.description }}
        </div>
      </v-card-text>

      <v-divider />

      <!-- 操作按钮 -->
      <v-card-actions>
        <v-btn
          block
          color="primary"
          :disabled="!product.in_stock"
          @click="$emit('add-to-cart', product)"
        >
          {{ product.in_stock ? 'Add to Cart' : 'Out of Stock' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Product } from '@/utils/product.ts'

const router = useRouter()

defineProps<{
  product: Product
}>()

defineEmits<{
  'add-to-cart': [product: Product]
  'toggle-favorite': [product: Product]
}>()

const navigateToDetail = () => {
  router.push(`/products/${props.product.id}`)
}
</script>

<style scoped>
.on-hover {
  transform: translateY(-4px);
  transition: transform 0.3s ease;
}

.gap-1 {
  gap: 4px;
}
</style>
