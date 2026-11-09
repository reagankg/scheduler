<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { authStore } from 'src/stores/authStore'

const auth = authStore()

onMounted(async () => {
  auth.initFromLocal()
})
</script>
