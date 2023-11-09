<template>
  <div>
    <v-btn v-for="(socialButton, index) in socialButtons" :key="index" icon class="mr-2"
      @click="handleSubmit(socialButton.action)">
      <v-icon :color="socialButton.color">{{ socialButton.icon }}</v-icon>
    </v-btn>
  </div>
</template>

<script setup>
import { signUpApi } from '../composables/loginSignup.js';
import { socialButtons } from '../navBarTitles/config.js'

const handleSubmit = (action) => {
  signUpApi()[action]()
}
</script>
