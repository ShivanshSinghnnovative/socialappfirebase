<template>
    <v-container fluid class="bg-gray-900 min-h-screen h-full">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="mt-12" elevation="12">
            <v-card-title class="text-center">
              <h1 class="text-h3 font-weight-bold mb-4 text-blue ">Registration Page</h1>
            </v-card-title>
            <v-card-text>
              <v-form >
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field :rules="[requiredField, nameRules].flat()" v-model="firstName" label="First Name"
                      outlined></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field :rules="[requiredField, nameRules].flat()" v-model="lastName" label="Last Name"
                      outlined></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field :rules="[requiredField, phoneRules].flat()" type="number" v-model="mobileNumber"
                      label="Mobile Number" outlined>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-file-input :rules="[requiredField, profileRules].flat()" label="Upload Profile Photo"
                      accept="image/*" @change="handleFileChange"></v-file-input>
                  </v-col>
                  <v-col cols="12">
                    <v-btn class="mt-2 pointer ml-10" color="blue" type="submit" dark :disabled="hasErrors">
                      <div v-if="!isLoading">
                        User Register</div>
                      <div v-else>
                        <v-progress-circular indeterminate></v-progress-circular>
                      </div>
                    </v-btn>
                  </v-col>
                  <v-col class="m-auto">
                    <div class="text-center text-green-900 m-auto">
                      <div> Are you already a registered user? </div>
                      <router-link to="/" class="mt-2 pointer text-center" style="display: inline-block; color: blue;">
                        Login
                      </router-link>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-col v-if="sucessModal" cols="12">
              <sucessfullSignUp :content="'You have successfully Updated Details'" @closeModals="handleCloseModal" />
            </v-col>
          
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>

    
<script setup>
import { computed } from "vue";
import {  requiredField, nameRules, phoneRules,  profileRules } from "../composables/validationRules"
const handleCloseModal = () => {
  sucessModal.value = false
  router.push('/posts');
};

const hasErrors = computed(() => {
  const errorFields = [
    ...nameRules.map(rule => rule(signUser.firstName)),
    ...nameRules.map(rule => rule(signUser.lastName)),
    ...phoneRules.map(rule => rule(signUser.mobileNumber)),
    ...profileRules.map(rule => rule(signUser.profilePhoto)),
  ];
  return errorFields.some(error => error !== true);
});
</script>
  