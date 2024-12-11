<!-- src/views/RegisterView.vue -->
<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card>
                    <v-card-title class="text-center text-h5 pt-4">
                        Create Account
                    </v-card-title>

                    <v-card-text>
                        <v-form @submit.prevent="handleSubmit" ref="form">
                            <!-- Username field -->
                            <v-text-field v-model="form.username" label="Username" :rules="[rules.required, rules.username]"
                                placeholder="Enter your username" prepend-inner-icon="mdi-account" variant="outlined"
                                :loading="loading" :disabled="loading" />

                            <!-- Email field -->
                            <v-text-field v-model="form.email" label="Email" type="email"
                                :rules="[rules.required, rules.email]" placeholder="Enter your email"
                                prepend-inner-icon="mdi-email" variant="outlined" :loading="loading" :disabled="loading" />

                            <!-- Password field -->
                            <v-text-field v-model="form.password" label="Password"
                                :type="showPassword ? 'text' : 'password'" :rules="[rules.required, rules.password]"
                                placeholder="Enter your password" prepend-inner-icon="mdi-lock"
                                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="showPassword = !showPassword" variant="outlined" :loading="loading"
                                :disabled="loading" />

                            <!-- Password confirmation field -->
                            <v-text-field v-model="form.password_confirmation" label="Confirm Password"
                                :type="showPassword ? 'text' : 'password'" :rules="[rules.required, rules.passwordMatch]"
                                placeholder="Confirm your password" prepend-inner-icon="mdi-lock-check"
                                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="showPassword = !showPassword" variant="outlined" :loading="loading"
                                :disabled="loading" />

                            <!-- Error alert -->
                            <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable
                                @click:close="error = ''">
                                {{ error }}
                            </v-alert>

                            <!-- Submit button -->
                            <v-btn type="submit" color="primary" block size="large" :loading="loading" :disabled="loading">
                                Register
                            </v-btn>

                            <!-- Login link -->
                            <v-row class="mt-4">
                                <v-col class="text-center">
                                    Already have an account?
                                    <router-link to="/login" class="text-decoration-none">
                                        Login here
                                    </router-link>
                                </v-col>
                            </v-row>
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
import type { RegisterForm } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()
const form = ref<RegisterForm>({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const formRef = ref()

// Validation rules
const rules = {
    required: (v: string) => !!v || 'This field is required',
    email: (v: string) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(v) || 'Invalid email format'
    },
    username: (v: string) => {
        if (v.length < 3) return 'Username must be at least 3 characters'
        if (v.length > 20) return 'Username must be less than 20 characters'
        return true
    },
    password: (v: string) => {
        if (v.length < 8) return 'Password must be at least 8 characters'
        if (!/\d/.test(v)) return 'Password must contain at least one number'
        if (!/[a-z]/.test(v)) return 'Password must contain at least one lowercase letter'
        if (!/[A-Z]/.test(v)) return 'Password must contain at least one uppercase letter'
        return true
    },
    passwordMatch: (v: string) => {
        return v === form.value.password || 'Passwords do not match'
    }
}

async function handleSubmit() {
    error.value = ''

    // Form validation
    const { valid } = await formRef.value.validate()
    if (!valid) return

    loading.value = true

    try {
        await authStore.register(form.value)
        router.push('/dashboard')
    } catch (err: any) {
        error.value = err.response?.data?.status?.message || 'Registration failed. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>
  
<style scoped>
.v-card {
    border-radius: 8px;
}

.v-card-title {
    margin-bottom: 16px;
}
</style>