<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <!-- 头部个人信息概览 -->
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar size="150" rounded="0">
                <v-img
                  v-if="previewAvatar || userData?.avatar_url"
                  :src="previewAvatar || userData?.avatar_url"
                  alt="avatar"
                />
                <v-icon v-else size="100" color="grey-lighten-1">
                  mdi-account-circle
                </v-icon>
              </v-avatar>
            </template>

            <v-card-title class="text-h5 mb-1">
              {{ userData?.username || 'Loading...' }}
            </v-card-title>
            <v-card-subtitle>{{ userData?.email }}</v-card-subtitle>
          </v-card-item>

          <!-- 设置选项卡 -->
          <v-tabs v-model="activeTab" grow>
            <v-tab value="profile">Profile</v-tab>
            <v-tab value="password">Password</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="activeTab">
              <!-- 个人信息设置 -->
              <v-window-item value="profile">
                <v-form @submit.prevent="updateProfile" ref="profileForm">
                  <v-row>
                    <v-col cols="12">
                      <v-file-input
                        v-model="profileData.avatar"
                        accept="image/*"
                        label="Avatar"
                        prepend-icon="mdi-camera"
                        @change="previewImage"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileData.username"
                        label="Username"
                        :rules="[v => !!v || 'Username is required']"
                        required
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileData.phone"
                        label="Phone Number"
                        :rules="[
                          v => !v || /^\d{10,11}$/.test(v) || 'Invalid phone number'
                        ]"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="profileData.address"
                        label="Address"
                        rows="3"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="profileData.bio"
                        label="Bio"
                        rows="3"
                      />
                    </v-col>
                  </v-row>

                  <v-alert
                    v-if="profileMessage"
                    :type="profileMessage.type"
                    :text="profileMessage.text"
                    class="mb-4"
                  />

                  <v-btn
                    type="submit"
                    color="primary"
                    block
                    :loading="loading"
                  >
                    Update Profile
                  </v-btn>
                </v-form>
              </v-window-item>

              <!-- 密码修改设置 -->
              <v-window-item value="password">
                <v-form @submit.prevent="updatePassword" ref="passwordForm">
                  <v-text-field
                    v-model="passwordData.current_password"
                    label="Current Password"
                    type="password"
                    required
                    :rules="[v => !!v || 'Current password is required']"
                  />

                  <v-text-field
                    v-model="passwordData.password"
                    label="New Password"
                    type="password"
                    required
                    :rules="passwordRules"
                  />

                  <v-text-field
                    v-model="passwordData.password_confirmation"
                    label="Confirm New Password"
                    type="password"
                    required
                    :rules="[
                      v => !!v || 'Password confirmation is required',
                      v => v === passwordData.password || 'Passwords do not match'
                    ]"
                  />

                  <v-alert
                    v-if="passwordMessage"
                    :type="passwordMessage.type"
                    :text="passwordMessage.text"
                    class="mb-4"
                  />

                  <v-btn
                    type="submit"
                    color="primary"
                    block
                    :loading="loading"
                  >
                    Update Password
                  </v-btn>
                </v-form>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userService } from '@/utils/user'

interface UserData {
  username: string
  email: string
  avatar_url?: string
  phone?: string
  address?: string
  bio?: string
}

interface Message {
  type: 'success' | 'error'
  text: string
}

// 状态变量
const activeTab = ref('profile')
const loading = ref(false)
const userData = ref<UserData | null>(null)
const previewAvatar = ref<string | null>(null)
const profileMessage = ref<Message | null>(null)
const passwordMessage = ref<Message | null>(null)

// 表单引用
const profileForm = ref<any>(null)
const passwordForm = ref<any>(null)

// 表单数据
const profileData = ref({
  username: '',
  phone_number: '',
  address: '',
  avatar: null as File | null
})

const passwordData = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

// 表单验证规则
const passwordRules = [
  (v: string) => !!v || 'New password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
  (v: string) => /[A-Z]/.test(v) || 'Must contain at least one uppercase letter',
  (v: string) => /[a-z]/.test(v) || 'Must contain at least one lowercase letter',
  (v: string) => /[0-9]/.test(v) || 'Must contain at least one number'
]

// 方法
const fetchUserProfile = async () => {
  try {
    const response = await userService.getProfile()
    userData.value = response.data
    profileData.value = {
      username: response.data.username || '',
      phone_number: response.data.phone_number || '',
      address: response.data.address || '',
      avatar: null
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }
}

const previewImage = (file: File) => {
  if (file) {
    previewAvatar.value = URL.createObjectURL(file)
  } else {
    previewAvatar.value = null
  }
}

const updateProfile = async () => {
  if (!profileForm.value.validate()) return

  loading.value = true
  profileMessage.value = null

  try {
    const formData = new FormData()
    Object.entries(profileData.value).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formData.append(key, value)
      }
    })

    await userService.updateProfile(formData)
    profileMessage.value = {
      type: 'success',
      text: 'Profile updated successfully'
    }
    await fetchUserProfile()
  } catch (error: any) {
    profileMessage.value = {
      type: 'error',
      text: error.response?.data?.message || 'Failed to update profile'
    }
  } finally {
    loading.value = false
  }
}

const updatePassword = async () => {
  if (!passwordForm.value.validate()) return

  loading.value = true
  passwordMessage.value = null

  try {
    await userService.updatePassword(passwordData.value)
    passwordMessage.value = {
      type: 'success',
      text: 'Password updated successfully'
    }
    passwordData.value = {
      current_password: '',
      password: '',
      password_confirmation: ''
    }
  } catch (error: any) {
    passwordMessage.value = {
      type: 'error',
      text: error.response?.data?.message || 'Failed to update password'
    }
  } finally {
    loading.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
.v-card-item {
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}
</style>
