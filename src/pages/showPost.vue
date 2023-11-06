<template>
    <div class="text-center">
        <div>Sucessfull login</div>
        <v-btn class="mt-2 pointer m-auto ml-2" color="blue" @click="logout">
            logout
        </v-btn>
    </div>
</template>
<script setup>
import { signoutUser } from '../store/authUser.js';

const store = signoutUser();
const { logout } = store;

</script>