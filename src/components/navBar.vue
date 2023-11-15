<template>
  <v-card class="fixed">
    <v-layout v-if="userDetails">
      <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
        <v-list>
          <v-list-item nav>
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
          <div v-for="item in navTitleArr" :key="item.id">
            <v-list-item @click="navigateRoute(item.id, item.href)" :prepend-icon="item.icon" :title="item.title"
              class="mt-2" :class="{
                'bg-blue-950': route.name === item.name,
                'bg-gray-200': route.name !== item.name
              }" value="home" :disabled="route.name === item.name"></v-list-item>
          </div>
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
import { navTitleArr } from '../navBarTitles/config.js'
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const activeButton = ref(null);
const navigateRoute = (id, href) => {
  router.push(href)
  activeButton.value = id
}

const drawer = ref(true);
const rail = ref(true);
const store = useAuthUserStore();
const { userDetails } = storeToRefs(store);
</script>
  