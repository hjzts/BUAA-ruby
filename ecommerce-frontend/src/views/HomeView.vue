<template>
  <v-container>
    <!-- 欢迎区域 -->
    <v-row class="mt-8">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 mb-4">Welcome to Our Ecommerce</h1>
        <p class="text-subtitle-1">Find what you need, buy what you love</p>
      </v-col>
    </v-row>

    <!-- 快速访问卡片 -->
    <v-row class="mt-8">
      <!-- 未登录状态显示的卡片 -->
      <template v-if="!authStore.isAuthenticated">
        <v-col cols="12" md="6">
          <v-card to="/login" class="mx-auto" max-width="400">
            <v-card-item>
              <v-card-title>Login</v-card-title>
              <v-card-subtitle>
                Already have an account? Sign in here
              </v-card-subtitle>
            </v-card-item>
            <v-card-text>
              <v-icon size="large" color="primary">mdi-login</v-icon>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card to="/register" class="mx-auto" max-width="400">
            <v-card-item>
              <v-card-title>Register</v-card-title>
              <v-card-subtitle>
                New here? Create an account
              </v-card-subtitle>
            </v-card-item>
            <v-card-text>
              <v-icon size="large" color="primary">mdi-account-plus</v-icon>
            </v-card-text>
          </v-card>
        </v-col>
      </template>

      <!-- 登录状态显示的卡片 -->
      <template v-else>
        <v-col cols="12" md="4">
          <v-card to="/profile/edit" class="mx-auto" max-width="400">
            <v-card-item>
              <v-card-title>Profile Settings</v-card-title>
              <v-card-subtitle>
                Update your personal information
              </v-card-subtitle>
            </v-card-item>
            <v-card-text>
              <v-icon size="large" color="primary">mdi-account-edit</v-icon>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card to="/password/change" class="mx-auto" max-width="400">
            <v-card-item>
              <v-card-title>Change Password</v-card-title>
              <v-card-subtitle>
                Update your security settings
              </v-card-subtitle>
            </v-card-item>
            <v-card-text>
              <v-icon size="large" color="primary">mdi-lock-reset</v-icon>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card to="/dashboard" class="mx-auto" max-width="400">
            <v-card-item>
              <v-card-title>Dashboard</v-card-title>
              <v-card-subtitle>
                View your dashboard
              </v-card-subtitle>
            </v-card-item>
            <v-card-text>
              <v-icon size="large" color="primary">mdi-view-dashboard</v-icon>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
