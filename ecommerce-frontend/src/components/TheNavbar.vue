<template>
  <v-app-bar color="primary">
    <v-app-bar-title>
      <router-link to="/" class="text-decoration-none text-white">
        Ecommerce
      </router-link>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- 未登录状态显示登录/注册按钮 -->
    <template v-if="!authStore.isAuthenticated">
      <v-btn
        variant="text"
        to="/login"
        class="text-white"
      >
        Login
      </v-btn>
      <v-btn
        variant="text"
        to="/register"
        class="text-white"
      >
        Register
      </v-btn>
    </template>

    <!-- 登录状态显示用户菜单 -->
    <template v-else>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-avatar color="white" size="35">
              <v-img v-if="authStore.user?.avatar_url" :src="authStore.user.avatar_url" />
              <v-icon v-else color="primary">mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item to="/profile/edit">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-list-item to="/password/change">
            <v-list-item-title>Change Password</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="handleLogout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
