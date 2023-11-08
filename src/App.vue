<template>
  <div v-if="userLoggedIn">
    <navBar />
  </div>

  <router-view />
</template>

<script setup>
import navBar from './components/navBar.vue'
import { useAuth } from './store/authUser.js';
import { storeToRefs } from 'pinia'

const store = useAuth();
const { userLoggedIn } = storeToRefs(store)

</script>
