<template>
    <v-app>
        <v-container fluid class="d-flex justify-center align-center" style="min-height: 100vh;">
            <div class="container-with-border">
                <v-card class="responsive-card">
                    <v-card-title>Login</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="handleSubmit">
                            <v-text-field v-model="form.email" label="Email" type="email" required />
                            <v-text-field v-model="form.password" label="Password" type="password" required />
                            <v-btn type="submit" color="primary" block>
                                Login
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </div>
        </v-container>
    </v-app>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginForm } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<LoginForm>({
    email: '',
    password: ''
})

async function handleSubmit() {
    try {
        await authStore.login(form.value)
        router.push('/home')
    } catch (error) {
        console.error('Login error:', error)
        // Handle error (show message etc)
    }
}
</script>
  
<style scoped>
.container-with-border {
    border: 2px solid #0b0a70;
    /* 设置外框颜色和宽度 */
    padding: 20px;
    /* 可选：增加内边距 */
    display: flex;
    justify-content: center;
    align-items: center;
}

.responsive-card {
    width: 50vw;
    max-width: 600px;
    min-width: 300px;
}
</style>