<template>
  <div class="centered-text">
  </div>
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
    } catch (error: never) {
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
