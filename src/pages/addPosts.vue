<template>
    <v-container fluid class="bg-gray-900 min-h-screen h-full">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card class="mt-12" elevation="12">
                    <v-card-title class="text-center">
                        <h1 class="text-h3 font-weight-bold mb-4 text-blue ">ADD POST</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="createPost">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="postDetails.title" :rules="requiredField" label="Title" outlined>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-file-input v-model="postDetails.photo" :rules="requiredField" label="Upload  Photo"
                                        accept="image/*">
                                    </v-file-input>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="postDetails.description" :rules="requiredField"
                                        label="Description" outlined>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" v-if="userListLoaded">
                                    <v-select v-model="postDetails.taggedUsers" :items="userList" item-value="firstName"
                                        item-title="firstName" multiple chips closable-chips label="Select Users" outlined>
                                    </v-select>
                                </v-col>
                                <v-col cols="12">
                                    <v-btn class="mt-2 pointer ml-1" color="blue" type="submit" dark :disabled="hasErrors">
                                        <div v-if="!isLoading">
                                            Add Post</div>
                                        <div v-else>
                                            <v-progress-circular indeterminate></v-progress-circular>
                                        </div>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-col v-if="sucessModal" cols="12">
                        <sucessfullModal :content="'You have successfully Add Post'" @closeModals="handleCloseModal" />
                    </v-col>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
   
<script setup>
import { createPostApi } from '../composables/createPost.js'
import { requiredField } from "../composables/validationRules"
import { ref } from 'vue';
import sucessfullModal from '@/components/sucessfullModal.vue';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
const userListLoaded = ref(false);
const router = useRouter();
const { postDetails, createPost, isLoading, sucessModal, hasErrors } = createPostApi()
import { userStore } from '../store/user-store.js'
const { getUsersList } = userStore();
let userList = [];
const fetchUsersList = async () => {
    userList = await getUsersList();
    postDetails.taggedUsers = [];
    userListLoaded.value = true;
    return userList;
};
onMounted(async () => {
    await fetchUsersList();
});

const handleCloseModal = () => {
    sucessModal.value = false
    router.push('/posts');
};

</script>

