  <template>
    <v-card class="fixed">
      <v-layout>
        <v-navigation-drawer  expand-on-hover rail>
          <v-list>
            <v-list-item v-if="userDetails">
              <v-avatar>
                <v-img :src="userDetails.profilePhotoPath" alt="Profile Picture"></v-img>
              </v-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ userDetails.firstName }} {{ userDetails.lastName }}</v-list-item-title>
                <v-list-item-subtitle>{{ userDetails.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
  
          <v-divider></v-divider>
  
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
            <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
            <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
          </v-list>
        </v-navigation-drawer>
  
        <v-main style="height: 250px"></v-main>
      </v-layout>
    </v-card>
  </template>
  
  <script setup>
import { storeToRefs } from 'pinia';
import { useAuth } from '../store/authUser.js';

const store = useAuth();
const { userDetails } = storeToRefs(store);
  </script>
  