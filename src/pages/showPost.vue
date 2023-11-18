<template>
    <div class="   w-5/6 m-auto ">
        <div class="text-right p-4">
            <v-btn class="mt-2 pointer mr-2" color="blue" @click="logout">
                Logout
            </v-btn>
        </div>

        <div v-if="posts && posts.length" class=" flex flex-wrap  justify-center gap-8 ">
            <div v-for="post in posts.slice(0, visiblePostCount)" :key="post.id"
                class="  border w-2/5 border-gray-800 bg-gray-300 h-120 rounded-lg mb-5  overflow-hidden shadow-md">
                <img :src="post.photo" alt="Post Photo" class=" w-full h-80 m-auto  object-cover" />
                <div class=" p-4 flex items-center h-10 mt-1">
                    <img :src="post.profilePhotoPath" alt="Profile Photo" class=" w-8 h-8 rounded-full mr-4" />
                    <h2 class=" text-sm font-bold">{{ post.firstName }} {{ post.lastName }}</h2>
                </div>
                <h2 class=" text-left font-bold p-4 text-xl">{{ post.title }}</h2>
                <div v-if="!post.showMore" class="text-left p-4 h-30 text-xs overflow-hidden">
                    <p v-html="truncateDescription(post.description, 3)"></p>
                    <span v-if="post.description.length > 30">
                        <a @click="toggleShowMore(post.id)" class="text-blue cursor-pointer">Show More</a>
                    </span>
                </div>
                <div v-else class="text-left p-4 max-h-40 text-xs overflow-auto">
                    <p v-html="post.description"></p>
                </div>
                
                <span @click="toggleTagUser(post.id)" class="text-left ml-3 mb-2  cursor-pointer ">
                    <v-icon aria-hidden="false">
                        mdi-account
                    </v-icon>
                </span>
                <div v-if="tagUsers[post.id]" class="mb-3 mt-3">
                    <span v-for="tagUser in post.taggedUsers" :key="tagUser.id" chips class="text-left ml-3  font-light ">
                        <span class="border border-gray-400 p-2 rounded-md bg-black text-white ">{{ tagUser }}</span>
                    </span>
                </div>

                 <span @click="toggleComment[post.id]" class="text-left ml-3 mb-2  cursor-pointer ">
                    <v-icon size="large" color="black-darken-2" icon="mdi-message-text"></v-icon>
                </span>
                <div v-if="comments[post.id]">
                    <input type="text" placeholder="add comments">
                </div>
                <input type="text" placeholder="add comments">

            </div>
        </div>
        <div v-else class="text-center m-auto">
            <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <div class="text-center m-auto mb-4">
            <v-btn v-if="visiblePostCount < totalPosts" @click="loadMorePosts" color="blue">
                Load More
            </v-btn>
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
const comments = ref({});
const toggleTagUser = (postId) => {
    tagUsers.value[postId] = !tagUsers.value[postId];
};
const toggleComment = (postId) => {
    comments.value[postId] = !comments.value[postId];
};
const visiblePostCount = ref(5);
const totalPosts = ref(0);

const loadMorePosts = () => {
    visiblePostCount.value += 5;
};
onMounted(async () => {
    try {
        const allPosts = await getAllPosts();
        posts.value = allPosts;
        totalPosts.value = allPosts.length;
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