<template>
    <v-app>
        <v-container fluid class="d-flex flex-column justify-center align-center fill-height">
            <v-card class="elevation-12" color="blue-grey lighten-5" outlined>
                <v-card-title class="text-center text-h4 font-weight-bold py-8 text-primary">
                    Create Your Account
                </v-card-title>

                <v-card-text>
                    <v-form @submit.prevent="handleSubmit" ref="form">
                        <!-- Username field -->
                        <v-text-field v-model="formData.username" :rules="[rules.required, rules.minLength(3)]"
                            label="Username" prepend-inner-icon="mdi-account" variant="outlined" class="mb-4" />

                        <!-- Email field -->
                        <v-text-field v-model="formData.email" :rules="[rules.required, rules.email]"
                            label="Email" prepend-inner-icon="mdi-email" variant="outlined" class="mb-4" />

                        <!-- Password field -->
                        <v-text-field v-model="formData.password" :rules="[rules.required, rules.password]"
                            :type="showPassword ? 'text' : 'password'" label="Password"
                            prepend-inner-icon="mdi-lock"
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" variant="outlined"
                            class="mb-4" @click:append-inner="showPassword = !showPassword" />

                        <!-- Password confirmation field -->
                        <v-text-field v-model="formData.password_confirmation"
                            :rules="[rules.required, rules.passwordMatch]"
                            :type="showPasswordConfirm ? 'text' : 'password'" label="Confirm Password"
                            prepend-inner-icon="mdi-lock-check"
                            :append-inner-icon="showPasswordConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                            variant="outlined" class="mb-6"
                            @click:append-inner="showPasswordConfirm = !showPasswordConfirm" />

                        <!-- Submit button -->
                        <v-btn type="submit" color="primary" size="large" block rounded elevation="2"
                            :loading="loading" :disabled="loading">
                            Register
                        </v-btn>
                    </v-form>

                    <!-- Login link -->
                    <div class="text-center mt-6">
                        <span class="grey--text text--darken-1">Already have an account?</span>
                        <router-link to="/login" class="text-primary font-weight-medium text-decoration-none">
                            Sign in
                        </router-link>
                    </div>
                </v-card-text>
            </v-card>

            <!-- Snackbar for messages -->
            <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" rounded>
                {{ snackbar.text }}
                <template v-slot:actions>
                    <v-btn color="white" variant="text" @click="snackbar.show = false">
                        Close
                    </v-btn>
                </template>
            </v-snackbar>

        </v-container>
    </v-app>
</template>
  
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { RegisterForm } from '@/types/auth';

const router = useRouter();
const authStore = useAuthStore();
const form = ref<HTMLFormElement | null>(null);
const loading = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
// const backgroundImage = ref('../../assets/background.jpg'); 

// Form data
const formData = reactive<RegisterForm>({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
});

// Validation rules
const rules = {
    required: (v: string) => !!v || 'This field is required',
    minLength: (min: number) => (v: string) =>
        !v || v.length >= min || `Min ${min} characters`,
    email: (v: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email',
    password: (v: string) =>
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v) ||
        'Password must be at least 8 characters with letters and numbers',
    passwordMatch: (v: string) =>
        v === formData.password || 'Passwords must match'
};

// Snackbar state
const snackbar = reactive({
    show: false,
    color: 'success',
    text: ''
});

// Show snackbar message
const showMessage = (text: string, color: 'success' | 'error' = 'success') => {
    snackbar.text = text;
    snackbar.color = color;
    snackbar.show = true;
};

// Handle form submission
const handleSubmit = async () => {
    const { valid } = (await form.value?.validate()) || { valid: false };

    if (!valid) {
        showMessage('Please fix the form errors', 'error');
        return;
    }

    loading.value = true;
    try {
        await authStore.register(formData);
        showMessage('Registration successful!');
        router.push('/home');
    } catch (error: any) {
        showMessage(
            error.response?.data?.status?.message || 'Registration failed',
            'error'
        );
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
html,
body,
#app {
    height: 100%; /* 确保根元素和 body 占满视口 */
    margin: 0;
}
.fill-height {
    min-height: 100vh;
    background: linear-gradient(to bottom, #e3f2fd, #f0f4c3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
}

.v-card {
    width: 100%;
    max-width: 400px; /* 确保表单卡片在大屏幕上不会过大 */
    border-radius: 16px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* 添加阴影提升视觉层次 */
}

.v-card-title {
    letter-spacing: 1px;
}

.v-btn {
    text-transform: none;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.text-decoration-none {
    text-decoration: none;
}
</style>