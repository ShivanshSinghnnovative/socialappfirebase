<template>
    <span v-for="tagUser in taggedUsersList" :key="tagUser.id" chips class="text-left ml-3 font-light">
        <span class="border border-gray-400 p-2 rounded-md bg-black text-white">
            {{ tagUser }}</span>
    </span>
</template>

<script setup>
import { defineProps } from "vue";
const { taggedUsersList } = defineProps(["taggedUsersList"]);
</script>
