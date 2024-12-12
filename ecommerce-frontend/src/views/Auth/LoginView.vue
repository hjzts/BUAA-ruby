<template>
  <v-container fluid class="d-flex justify-center align-center" style="min-height: 100vh; background: linear-gradient(to bottom right, #e3f2fd, #bbdefb);">
    <v-card class="elevation-12" style="border-radius: 16px; overflow: hidden;">
      <v-card-title class="text-center text-h5 font-weight-bold pt-8">
        Login
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit" ref="form">
          <!-- Email field -->
          <v-text-field v-model="formData.email" label="Email" prepend-inner-icon="mdi-email" variant="outlined" class="mb-3" required />

          <!-- Password field -->
          <v-text-field v-model="formData.password" :type="showPassword ? 'text' : 'password'" label="Password" prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" variant="outlined" class="mb-6" @click:append-inner="showPassword = !showPassword" required />

          <!-- Submit button -->
          <v-btn type="submit" color="primary" size="large" block :loading="loading" :disabled="loading">
            Login
          </v-btn>
        </v-form>

        <!-- Register link -->
        <div class="text-center mt-6">
          Don’t have an account yet?
          <router-link to="/register" class="text-decoration-none">
            Create Account
          </router-link>
        </div>
      </v-card-text>
    </v-card>

    <!-- Snackbar for messages -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginForm } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()
const form = ref<HTMLFormElement | null>(null)
const loading = ref(false)
const showPassword = ref(false)

// Form data
const formData = reactive<LoginForm>({
    email: '',
    password: ''
})

// Snackbar state
const snackbar = reactive({
    show: false,
    color: 'success',
    text: ''
})

// Show snackbar message
const showMessage = (text: string, color: 'success' | 'error' = 'success') => {
    snackbar.text = text
    snackbar.color = color
    snackbar.show = true
}

// Handle form submission
const handleSubmit = async () => {
    loading.value = true
    try {
        await authStore.login(formData)
        showMessage('Login successful!')
        router.push('/home')
    } catch (error: any) {
        showMessage(
            error.response?.data?.status?.message || 'Login failed',
            'error'
        )
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.centered-text {
  display: flex; /* 使用 Flexbox */
  justify-content: left; /* 水平居中 */
  height: 100vh; /* 设置高度为视口高度 */
}

.v-card {
    border-radius: 16px;
}

.v-card-title {
    letter-spacing: 0.5px;
}

.v-btn {
    text-transform: none;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.text-decoration-none {
    text-decoration: none;
    color: #0b0a70;
}
</style>
