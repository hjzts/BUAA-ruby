<template>
  <v-app-bar color="primary" image="/background.jpg">
    <template v-slot:image>
      <v-img
        gradient="to top right, rgba(19,84,122,.6), rgba(128,208,199,.6)"
      ></v-img>
    </template>

    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>
      <v-container>
        <v-row justify="space-between" align="center">
          <v-col cols="auto" >
            <v-btn
              to="/"
              color="deep-orange-accent-2"
              prepend-icon="mdi-home"
              text="true"
              class="text-decoration-none text-white"
            >
              Hugo的贸易所
            </v-btn>
          </v-col>

          <v-col cols="auto" >
            <v-btn
              to="/favorites"
              color="deep-orange-accent-2"
              prepend-icon="mdi-heart"
              text="true"
              class="text-decoration-none text-white"
            >
              我的收藏
            </v-btn>
          </v-col>

            <v-col cols="auto" >
              <v-btn
                to="/orders"
                color="deep-orange-accent-2"
                prepend-icon="mdi-cart"
                text="true"
                class="text-decoration-none text-white"
              >
                我的订单
              </v-btn>
          </v-col>
        </v-row>
      </v-container>
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
                  <v-img :src="authStore.user?.avatar_url || '/avatar.jpg'" />
<!--              <v-img v-if="authStore.user?.avatar_url" :src="authStore.user.avatar_url || '/avatar.jpg'" />-->
<!--              <v-icon v-else color="primary">mdi-account</v-icon>-->
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
    await router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
