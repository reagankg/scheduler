<template>
  <div>
    <h1>SRF</h1>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { userStore } from '../stores/userStore.js';

const store = userStore();
const userArray = ref([]); 

onMounted(async () => {
  await store.getAllUser();
  if (store.users.length === 0) {
    console.log("No users found.");
  } else {
    userArray.value = store.users;
  }
});
</script>
