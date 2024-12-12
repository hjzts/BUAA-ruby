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
                                <div class="d-flex align-center text-center mb-6">
                                    <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
                                        <span
                                            class="bg-surface px-5 py-3 position-relative text-subtitle-1 text-grey100">Your
                                            Social Campaigns</span>
                                    </div>
                                </div>
                                <RegisterForm />
                                <h6 class="text-subtitle-1  text-grey100 d-flex justify-center align-center mt-3">
                                    Already have an Account?
                                    <v-btn variant="plain" to="/auth/login"
                                        class="text-primary text-body-1 opacity-1 font-weight-medium pl-2">Sign In</v-btn>
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Logo  from '@/layouts/full/logo/logo.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';
// import type { RegisterForm } from '@/types/auth';

const router = useRouter();
const authStore = useAuthStore();
const form = ref<HTMLFormElement | null>(null);
const loading = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

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
.fill-height {
    min-height: 100vh;
    background: linear-gradient(to bottom, #e3f2fd, #f0f4c3);
    display: flex;
    align-items: center;
    justify-content: center;
}

.v-card {
    border-radius: 16px;
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