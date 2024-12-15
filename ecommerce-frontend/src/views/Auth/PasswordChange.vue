<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Change Password</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="form.current_password"
                label="Current Password"
                type="password"
                required
              />

              <v-text-field
                v-model="form.password"
                label="New Password"
                type="password"
                required
              />

              <v-text-field
                v-model="form.password_confirmation"
                label="Confirm New Password"
                type="password"
                :rules="[v => v === form.password || 'Passwords do not match']"
                required
              />

              <v-btn type="submit" color="primary" block>
                Change Password
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
import { userService } from '@/utils/user.ts'

const form = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

async function handleSubmit() {
  try {
    await userService.updatePassword(form.value)
    form.value = {
      current_password: '',
      password: '',
      password_confirmation: ''
    }
    // 显示成功消息
  } catch (error) {
    console.error('Failed to change password:', error)
    // 显示错误消息
  }
}
</script>
