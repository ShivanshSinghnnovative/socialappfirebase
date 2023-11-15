<template>
  <v-container fluid class="bg-gray-900 min-h-screen h-full">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="mt-12" elevation="12">
          <v-card-title class="text-center">
            <h1 class="text-h3 font-weight-bold mb-4 text-blue ">Update User Details</h1>
          </v-card-title>
          <v-card-text v-if="userDetails">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field :rules="[requiredField, nameRules].flat()" v-model="userDetails.firstName"
                  label="First Name" outlined></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :rules="[requiredField, nameRules].flat()" v-model="userDetails.lastName" label="Last Name"
                  outlined></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="userDetails.mobileNumber" :rules="[requiredField, phoneRules].flat()" type="number"
                  label="Mobile Number" outlined>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn class="mt-2 pointer ml-10" color="blue" type="submit" dark @click="handleUpdateDetails">
                  <div>
                    Update</div>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else>
            <div class="m-auto text-center">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>
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
import { ref } from "vue";
import { storeToRefs } from 'pinia';
import { requiredField, nameRules, phoneRules } from "../composables/validationRules"
import { useAuthUserStore } from '../store/auth-user-store.js';
import { useRouter } from "vue-router";
import sucessfullSignUp from '../components/sucessfullModal.vue'
const { updateUserDetails } = useAuthUserStore();
const store = useAuthUserStore();
const { userDetails } = storeToRefs(store);
const router = useRouter();
const sucessModal = ref(false);

const handleUpdateDetails = async () => {
  if (userDetails.value) {
    const updatedDetails = {
      firstName: userDetails.value.firstName,
      lastName: userDetails.value.lastName,
      mobileNumber: userDetails.value.mobileNumber,
    };
    await updateUserDetails(userDetails.value.uid, updatedDetails);
    sucessModal.value = true;
  }
};
const handleCloseModal = () => {
  sucessModal.value = false
  router.push('/posts');
};

</script>