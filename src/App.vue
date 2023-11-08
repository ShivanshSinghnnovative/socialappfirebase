<template>
  <div v-if="userDetails">
    <navBar />
  </div>

  <router-view />
</template>

<script setup>
import navBar from './components/navBar.vue'
import { useAuthUserStore } from './store/auth-user-store.js';
import { storeToRefs } from 'pinia'

const store = useAuthUserStore();
const { userDetails } = storeToRefs(store)

</script>
