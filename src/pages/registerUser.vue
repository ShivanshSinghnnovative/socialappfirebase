<template>
  <v-container fluid class="bg-gray-900 min-h-screen h-full">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="mt-12" elevation="12">
          <v-card-title class="text-center">
            <h1 class="text-h3 font-weight-bold mb-4 text-blue ">Registration Page</h1>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="createAccount">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field :rules="firstNameRules" v-model="signUser.firstName" label="First Name"
                    outlined></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field :rules="lastNameRules" v-model="signUser.lastName" label="Last Name"
                    outlined></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field :rules="phoneRules" v-model="signUser.mobileNumber" label="Mobile Number" outlined>
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field :rules="emailRules" v-model="signUser.email" label="Email" outlined></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-row class="mb-2">
                    <v-col cols="11">
                      <v-text-field :rules="passwordRules" v-model="signUser.password"
                        :type="hidePassword ? 'text' : 'password'" label="Password" outlined required>
                      </v-text-field>
                    </v-col>
                    <v-col cols="1" class=" mt-4">
                      <v-icon @click="togglePassword" :icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'">
                      </v-icon>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-text-field :rules="confirmPasswordRules" v-model="signUser.confirmPassword" label="Confirm Password"
                    outlined type="password">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-file-input :rules="profileRules" label="Upload Profile Photo"
                    @change="handleFileChange"></v-file-input>
                </v-col>
                <v-col cols="12">
                  <v-alert v-if="userExist" type="error" class="mt-2">
                    User already exists. Please choose a different email.
                  </v-alert>
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
              </v-row>
              <v-col v-if="sucessModal" cols="12">
                <sucessfullSignUp />
              </v-col>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script setup>
import { computed, onMounted } from 'vue';

import { signUpApi } from '../composables/loginSignup.js';
import sucessfullSignUp from '../components/sucessfullUserRegisterModal.vue'

const { createAccount, signUser, togglePassword, hidePassword, sucessModal, userExist, isLoading } = signUpApi();

const handleFileChange = (event) => {
  const file = event.target.files[0];
  signUser.profilePhoto = file;
};
const firstNameRules = [
  value => {
    if (!value) return 'You must enter a first name.'
    if (value.length >= 5) return true
    return '5 characters required'
  },
]
const lastNameRules = [
  value => {
    if (!value) return 'You must enter a last name.'
    if (value.length >= 5) return true
    return '5 characters required'
  },
]
const phoneRules = [
  value => {
    if (!value) return 'You must enter a phonenumber.'
    if (value.length == 10) return true
    return '10 characters required'
  },
]
const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const emailRules = [
  value => {
    if (!value) return 'You must enter a email.'
    if (emailRegex.test(signUser.email)) return true
    return 'enter a valid mail'
  },
]
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordRules = [
  value => {
    if (!value) return 'You must enter a password.'
    if (!passwordRegex.test(signUser.password)) return "Password must contain at least one digit, one lowercase letter, and one uppercase letter";
    if (value.length >= 8 && passwordRegex.test(signUser.password)) return true
    return 'minimum 8  characters required'
  },
]
const confirmPasswordRules = [
  value => {
    if (!value) return 'You must enter a password.'
    if (value.length >= 8 && signUser.password == signUser.confirmPassword) return true
    if (signUser.password !== signUser.confirmPassword) return "Confirm password should be the same as password"
    return 'minimum 8  characters required'
  },
]
const profileRules = [
  value => {
    if (value) return true
    if (signUser.profilePhoto == undefined) return 'You must upload profile photo'
  },
]
const hasErrors = computed(() => {
  const errorFields = [
    ...firstNameRules.map(rule => rule(signUser.firstName)),
    ...lastNameRules.map(rule => rule(signUser.lastName)),
    ...phoneRules.map(rule => rule(signUser.mobileNumber)),
    ...emailRules.map(rule => rule(signUser.email)),
    ...passwordRules.map(rule => rule(signUser.password)),
    ...confirmPasswordRules.map(rule => rule(signUser.confirmPassword)),
    ...profileRules.map(rule => rule(signUser.profilePhoto)),
  ];
  return errorFields.some(error => error !== true);
});


</script>
  