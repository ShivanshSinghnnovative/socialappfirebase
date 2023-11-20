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

                <span @click="toggleComment(post.id)" class="text-left ml-3 mb-2  cursor-pointer ">
                    <v-icon size="large" color="black-darken-2" icon="mdi-message-text"></v-icon>

                </span>

                <div v-if="comments[post.id]" class="p-3">
                    <div class="max-h-20 overflow-auto w-4/5">
                        <div v-for="postComment in allcomments[post.id]" :key="postComment.id"
                            class="mb-3 bg-white  border-black rounded-lg">
                            <div class="flex items-center">
                                <img :src="postComment.profilePhotoPath" class="w-6 h-6 p-1 rounded-full mr-2 ml-2">
                                <h3 class="text-sm font-bold mr-2">{{ postComment.firstName }}</h3>
                                <p class="text-xs ml-3 text-gray-800 break-all">{{ postComment.commentTitle }}</p>
                                <div class="text-right">
                                    <v-icon v-if="userDetails && (postComment.userId === userDetails.uid)"
                                        @click="editComment(post.id, postComment.id, postComment.createdAt)"
                                        aria-hidden="false">
                                        mdi-pencil
                                    </v-icon>
                                    <v-icon
                                        v-if="userDetails && (postComment.userId === userDetails.uid || userDetails.uid === post.updatedBy)"
                                        @click="handeldeleteComment(postComment.id, post.id)" aria-hidden="false">
                                        mdi-delete
                                    </v-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input v-model="comment[post.id]"
                        class="border break-all border-gray-300 text-gray-800 text-sm rounded-lg mt-1  block w-4/5 p-2.5 bg-blue-200 "
                        type="text" placeholder="add comments">
                    <v-btn
                        @click=" (comment[post.id] && editableCommentId[post.id] ? handelupdateComment(comment[post.id], post.id) : postCommentHandle(post.id))"
                        class="w-fit-content mt-2" color="blue">
                        {{ (comment[post.id] && editableCommentId[post.id] ? 'Update comment' : 'Post comment') }}
                    </v-btn>
                </div>

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
import { storeToRefs } from 'pinia';

const authUser = useAuthUserStore();
const { userDetails } = storeToRefs(authUser);
const allcomments = ref({});
const totalPosts = ref(0);
const visiblePostCount = ref(5);
const { logout } = authUser;
const userPosts = postStore()
const comment = ref({})
const { getAllPosts, postComment, getCommentsForPost, updateComment, deleteComment } = userPosts;
const tagUsers = ref({});
const posts = ref([]);
const comments = ref({});
const commentsToEdit = ref({})
const editableCommentId = ref({});

onMounted(async () => {
    try {
        const allPosts = await getAllPosts();
        allPosts.forEach((post) => {
            allcomments.value[post.id] = [];
        });
        posts.value = allPosts;
        totalPosts.value = allPosts.length;

    } catch (error) {
        console.error(error);
    }
});
const toggleTagUser = (postId) => {
    tagUsers.value[postId] = !tagUsers.value[postId];
};

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

const toggleComment = async (postId) => {
    comments.value[postId] = !comments.value[postId];
    comment.value[postId] = '';
    allcomments.value[postId] = await getCommentsForPost(postId);
    editableCommentId.value[postId] = null;
};
const postCommentHandle = async (postId) => {
    if (userDetails && comment.value[postId]) {
        postComment(comment.value[postId], postId)
        comment.value[postId] = null
        allcomments.value[postId] = await getCommentsForPost(postId);
    }
}
const editComment = (postId, commentId, createdAt) => {
    editableCommentId.value[postId] = commentId;
    console.log(editableCommentId.value, postId)
    comment.value[postId] = allcomments.value[postId].find(comment => comment.id === commentId).commentTitle;
    commentsToEdit.value[postId] = createdAt

};

const handelupdateComment = async (updateExistingComment, postId) => {
    const updatedComment = {
        updatedAt: new Date().toISOString(),
        commentTitle: updateExistingComment
    };
    await updateComment(commentsToEdit.value[postId], updatedComment, postId);
    comment.value[postId] = null
    editableCommentId.value[postId] = null;
    allcomments.value[postId] = await getCommentsForPost(postId);

}
const handeldeleteComment = async (postCommentId, postId) => {
    await deleteComment(postCommentId, postId);
    allcomments.value[postId] = await getCommentsForPost(postId);
}

const loadMorePosts = () => {
    visiblePostCount.value += 5;
};
</script>