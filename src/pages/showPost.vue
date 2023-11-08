<template>
    <div class="text-center">
        <div>Sucessfull login</div>
        <v-btn class="mt-2 pointer m-auto ml-2" color="blue" @click="logout">
            logout
        </v-btn>
    </div>
</template>
<script setup>
import { useAuth } from '../store/authUser.js';

const store = useAuth();
const { logout } = store;

</script>