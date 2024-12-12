<template>
    <div class="authentication">
        <v-container fluid class="pa-3">
            <v-row class="h-100vh d-flex justify-center align-center">
                <v-col cols="12" class="d-flex align-center">
                    <div class="boxed-auth-wrap">
                        <v-card rounded="xl" elevation="10" class="px-sm-1 px-0  mx-auto index-2" max-width="450">
                            <v-card-item class="pa-sm-8">
                                <div class="d-flex justify-center mb-5">
                                    <Logo />
                                </div>
                                <!-- <div class="text-h6 text-medium-emphasis text-center mb-6">Your Social Campaigns</div> -->
                                <LoginForm />
                                <h6 class="text-subtitle-1  text-grey100 d-flex justify-center align-center mt-3">
                                    New to Hugo 交易所?
                                    <v-btn class="pl-0 text-primary text-body-1 font-weight-medium  opacity-1 pl-2" height="auto"
                                        to="/auth/register" variant="plain">Create an account</v-btn>
                                </h6>
                            </v-card-item>
                        </v-card>
                    </div>
                </v-col>
            </v-row>

        </v-container>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Logo from '@/layouts/full/logo/logo.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
// import type { LoginForm } from '@/types/auth'

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
.v-card {
    border-radius: 16px;
}

.v-card-title {
    letter-spacing: 0.5px;
}

.fill-height {
  height: 100vh;
  padding: 0;
  margin: 0;
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