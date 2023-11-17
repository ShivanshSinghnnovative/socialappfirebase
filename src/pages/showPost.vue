<template>
    <div class="container mx-auto max-w-3xl">
        <div class="header text-right p-4">
            <v-btn class="mt-2 pointer mr-2" color="blue" @click="logout">
                Logout
            </v-btn>
        </div>

        <div v-if="posts && posts.length" class=" flex flex-wrap gap-8 text-center">
            <v-infinite-scroll>
                <div v-for="post in posts" :key="post.id"
                    class=" bg-white border w-4/5 border-gray-300 rounded-lg overflow-hidden shadow-md">
                    <div class=" p-4 flex items-center">
                        <img :src="post.userDetails.profilePhotoPath" alt="Profile Photo"
                            class=" w-10 h-10 rounded-full mr-4" />
                        <h2 class=" text-lg font-bold">{{ post.userDetails.firstName }} {{ post.userDetails.lastName }}</h2>
                    </div>
                    <h2 class=" text-center p-4 text-xl">{{ post.title }}</h2>
                    <img :src="post.photo" alt="Post Photo" class=" w-5/5 m-auto object-cover" />
                    <div @click="toggleTagUser(post.id)" class="text-left ml-3 mb-2 cursor-pointer ">
                        <v-icon aria-hidden="false">
                            mdi-account
                        </v-icon>
                    </div>
                    <div v-if="tagUsers[post.id]">
                        <div v-for="tagUser in post.taggedUserNames" :key="tagUser.id" class="text-left ml-3 mb-2">
                            <h2>{{ tagUser }}</h2>
                        </div>
                    </div>
                </div>
            </v-infinite-scroll>
        </div>
        <div v-else class="text-center m-auto">
            <v-progress-circular indeterminate></v-progress-circular>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useAuthUserStore } from '../store/auth-user-store.js';
import { postStore } from '@/store/post-store';
const authUser = useAuthUserStore();
const { logout } = authUser;
const userPosts = postStore()
const { getAllPosts } = userPosts;
const tagUsers = ref({});
const posts = ref([]);
const toggleTagUser = (postId) => {
    tagUsers.value[postId] = !tagUsers.value[postId];
};
onMounted(async () => {
    try {
        posts.value = await getAllPosts();

    } catch (error) {
        console.error(error);
    }
});


</script>