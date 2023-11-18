<template>
    <div class="   w-5/6 m-auto ">
        <div class="text-right p-4">
            <v-btn class="mt-2 pointer mr-2" color="blue" @click="logout">
                Logout
            </v-btn>
        </div>

        <div v-if="posts && posts.length" class=" flex flex-wrap  justify-center gap-8 ">
            <div v-for="post in posts" :key="post.id"
                class="  border w-2/5 border-gray-800 bg-gray-300 rounded-lg mb-5  overflow-hidden shadow-md">
                <img :src="post.photo" alt="Post Photo" class=" w-full h-2/5 m-auto  object-cover" />
                <div class=" p-4 flex items-center h-1/6">
                    <img :src="post.profilePhotoPath" alt="Profile Photo" class=" w-10 h-10 rounded-full mr-4" />
                    <h2 class=" text-lg font-bold">{{ post.firstName }} {{ post.lastName }}</h2>
                </div>
                <h2 class=" text-left font-bold p-4 text-xl">{{ post.title }}</h2>
                <div v-if="!post.showMore" class="text-left p-4 max-h-40 overflow-hidden">
                    <p v-html="truncateDescription(post.description, 3)"></p>
                    <span v-if="post.description.length > 30">
                        <a @click="toggleShowMore(post.id)" class="text-blue cursor-pointer">Show More</a>
                    </span>
                </div>
                <div v-else class="text-left p-4 max-h-40 overflow-auto">
                    <p v-html="post.description"></p>
                </div>
                <div @click="toggleTagUser(post.id)" class="text-left ml-3 mb-2 cursor-pointer ">
                    <v-icon aria-hidden="false">
                        mdi-account
                    </v-icon>
                </div>
                <div v-if="tagUsers[post.id]">
                    <div v-for="tagUser in post.taggedUsers" :key="tagUser.id" class="text-left ml-3">
                        <h2>{{ tagUser }}</h2>
                    </div>
                </div>
            </div>
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

const toggleShowMore = (postId) => {
    const post = posts.value.find((p) => p.id === postId);
    if (post) {
        post.showMore = !post.showMore;
    }
};

const truncateDescription = (description, lines) => {
    const words = description.split(' ');
    if (words.length <= lines * 10) {
        return description;
    }
    return words.slice(0, lines * 10).join(' ') + '...';
};

</script>