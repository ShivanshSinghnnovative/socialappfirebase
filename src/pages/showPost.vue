<template>
    <div class="text-center">
        <div>Sucessfull login</div>
        <v-btn class="mt-2 pointer m-auto ml-2" color="blue" @click="logout">
            logout
        </v-btn>
    </div>
</template>
<script setup>
import { useAuthUserStore } from '../store/auth-user-store.js';

const store = useAuthUserStore();
const { logout } = store;

</script>