<template>
    <div class="flex relative items-center">
        <img :src="commentDetails.profilePhotoPath" class="w-6 h-6 p-1 rounded-full mr-2 ml-2">
        <h3 class="text-sm font-bold mr-2">{{ commentDetails.firstName }}</h3>
        <p class="text-xs ml-3 text-gray-800 break-all">{{ commentDetails.commentTitle }}</p>
        <div class="flex right-2 text-xs gap-1  absolute   ">
            <v-icon v-if="userDetails && (commentDetails.userId === userDetails.uid)"
                @click="editComment" aria-hidden="false">
                mdi-pencil
            </v-icon>
            <v-icon
                v-if="userDetails && (commentDetails.userId === userDetails.uid || userDetails.uid === updatedBy)"
                @click="openDelete" aria-hidden="false">
                mdi-delete
            </v-icon>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useAuthUserStore } from '../store/auth-user-store.js';
import { defineEmits , defineProps } from 'vue'
const store = useAuthUserStore();
const { userDetails } = storeToRefs(store);
const props = defineProps(['commentDetails' , 'updatedBy']);
const emit = defineEmits();

const editComment = () => {
    emit('editComment');
};
const openDelete = () => {
    emit('opendelete');
}
</script>