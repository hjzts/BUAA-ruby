<template>
  <div class="centered-text">
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  </div>

</template>

<script setup lang="ts" name="App">
import { RouterView } from 'vue-router'
</script>

<style scoped>
.centered-text {
  display: flex; /* 使容器成为 Flexbox */
  justify-content: center; /* 水平居中 */
  height: 100vh; /* 使容器高度为视口高度 */
  align-items: center;    /* 垂直居中 */
}
</style>
