<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Edit Profile</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">

              <!-- Avatar preview -->
              <v-avatar size="100" class="mb-3">
                <v-img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" />
                <v-icon v-else size="80">mdi-account-circle</v-icon>
              </v-avatar>

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
                :placeholder="form.username"
                clearable
              />

              <v-text-field
                v-model="form.phone_number"
                label="Phone"
                :rules="[v => !v || /^\d{10,11}$/.test(v) || 'Invalid phone number']"
                :placeholder="form.phone_number"
              />

              <v-textarea
                v-model="form.address"
                label="Address"
                :placeholder="form.address"
              />

              <v-textarea
                v-model="form.bio"
                label="Bio"
                :placeholder="form.bio"
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
import { userService } from '@/utils/user.ts'

const avatar = ref<File | null>(null)
const avatarUrl = ref<string | null>(null) // 用于头像预览
const form = ref({
  username: '',
  phone_number: '',
  address: '',
  bio: '这是我的个性签名~這是我的個性簽名~~'
})
const placeholders = ref({
  username: '',
  phone_number: '',
  address: '',
  bio: '这是我的个性签名~這是我的個性簽名'
})

onMounted(async () => {
  try {
    const response = await userService.getProfile()
    const { username, phone_number, address, bio } = response
    form.value = { username, phone_number, address, bio }
    console.log("form: ", form.value)
    placeholders.value = { username, phone_number, address, bio } // 用作占位符
  } catch (error) {
    console.error('Failed to load profile:', error)
  }
})

async function handleSubmit() {
  try {
    const updateData = {
      username: form.value.username,
      phone_number: form.value.phone_number,
      address: form.value.address,
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
