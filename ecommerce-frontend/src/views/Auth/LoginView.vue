<!-- src/views/LoginView.vue -->
<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card>
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
            </v-col>
        </v-row>
    </v-container>
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