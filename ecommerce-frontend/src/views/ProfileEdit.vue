<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Edit Profile</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-file-input
                v-model="avatar"
                label="Avatar"
                accept="image/*"
                :show-size="true"
                prepend-icon="mdi-camera"
              />

              <v-text-field
                v-model="form.username"
                label="Username"
                required
              />

              <v-text-field
                v-model="form.phone_number"
                label="Phone"
                :rules="[v => !v || /^\d{10,11}$/.test(v) || 'Invalid phone number']"
              />

              <v-textarea
                v-model="form.address"
                label="Address"
              />

              <v-textarea
                v-model="form.bio"
                label="Bio"
              />

              <v-btn type="submit" color="primary" block>
                Update Profile
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userService } from '@/utils/user'

const avatar = ref<File | null>(null)
const form = ref({
  username: '',
  phone_number: '',
  address: '',
  bio: ''
})

onMounted(async () => {
  try {
    const response = await userService.getProfile()
    const { username, phone_number, address, bio } = response.data
    form.value = { username, phone_number, address, bio }
  } catch (error) {
    console.error('Failed to load profile:', error)
  }
})

async function handleSubmit() {
  try {
    const updateData = {
      ...form.value,
      avatar: avatar.value
    }
    await userService.updateProfile(updateData)
    // 显示成功消息
  } catch (error) {
    console.error('Failed to update profile:', error)
    // 显示错误消息
  }
}
</script>
