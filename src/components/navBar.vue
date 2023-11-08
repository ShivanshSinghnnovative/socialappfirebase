<template>
  <v-card class="fixed">
    <v-layout>
      <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
        <v-list>
          <v-list-item v-if="userDetails" nav>
            <v-avatar>
              <v-img :src="userDetails.profilePhotoPath" alt="Profile Picture"></v-img>
            </v-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ userDetails.firstName }} {{ userDetails.lastName }}</v-list-item-title>
              <v-list-item-subtitle>{{ userDetails.email }}</v-list-item-subtitle>
            </v-list-item-content>
            <template v-slot:append>
              <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home-city" title="Home" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
          <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="users"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main style="height: 250px"></v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthUserStore } from '../store/auth-user-store.js';
const drawer = ref(true);
const rail = ref(true);
const store = useAuthUserStore();
const { userDetails } = storeToRefs(store);
</script>
  