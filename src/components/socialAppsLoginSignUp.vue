<template>
    <div>
        <v-btn icon class="mr-2" @click="createAccountwithFacebook">
            <v-icon color="blue">mdi-facebook</v-icon>
          </v-btn>
          <v-btn icon class="mr-2" @click="createAccountwithGoogle">
            <v-icon color="red">mdi-google</v-icon>
          </v-btn>
          <v-btn icon @click="createAccountwithTwitter">
            <v-icon color="lightblue">mdi-twitter</v-icon>
          </v-btn>
    </div>
</template>

<script setup>

import { signUpApi } from '../composables/loginSignup.js';
const { createAccountwithGoogle, createAccountwithFacebook, createAccountwithTwitter } = signUpApi();

</script>
