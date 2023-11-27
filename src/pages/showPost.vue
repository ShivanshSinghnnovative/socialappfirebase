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
                    <tagUserList :taggedUsersList="post.taggedUsers"/>
                </div>

                <span @click="toggleComment(post.id)" class="text-left ml-3 mb-2  cursor-pointer ">
                    <v-icon size="large" color="black-darken-2" icon="mdi-message-text"></v-icon>
                </span>

                <div v-if="openComments[post.id]" class="p-3">
                    <div class="max-h-20 overflow-auto w-4/5">
                        <div v-for="commentDetails in allcomments[post.id]" :key="commentDetails.id"
                            class="mb-3 bg-white  border-black rounded-lg">
                          <commentsonPosts :commentDetails="commentDetails" :updatedBy="post.updatedBy"  @editComment="editComment(post.id, commentDetails.id)" @opendelete="openDeleteModal(commentDetails.id, post.id)"/>
                        </div>
                    </div>
                    <input v-model="comment[post.id]"
                        class="border break-all border-gray-300 text-gray-800 text-xs rounded-lg mt-1  block w-4/5 p-1.5 bg-blue-200 "
                        type="text" placeholder="add comments">
                    <v-btn
                        @click=" (comment[post.id] && editableCommentId[post.id] ? handelupdateComment(comment[post.id], post.id) : addCommentsInPost(post.id))"
                        class="p-1 text-xs mt-1" color="blue">
                        {{ (comment[post.id] && editableCommentId[post.id] ? 'Update comment' : 'Post comment') }}
                    </v-btn>
                </div>
                <span class="ml-3 cursor-pointer" @click="openSinglePagePost(post.id)">
                    <v-icon size="large" color="black-darken-2" icon="mdi-arrow-right-bold-box-outline"></v-icon>
                </span>
                <div v-if="deleteModal" class="fixed">
                    <confirmDelete :content="'Are you sure to delete this comment'" @deleteModal="handeldeleteComment()"
                        @closeModal="closePopUp()" />
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
import commentsonPosts  from '../components/showAllcomments.vue'
import confirmDelete from '../components/confirmationDeleteModal.vue'
import { useRouter } from 'vue-router';
import tagUserList from '../components/taggedUsersList.vue';
const router = useRouter();
const authUser = useAuthUserStore();
const { userDetails } = storeToRefs(authUser);
const allcomments = ref({});
const deleteModal = ref(false);
const totalPosts = ref(0);
const visiblePostCount = ref(5);
const { logout } = authUser;
const userPosts = postStore()
const comment = ref({})
const { getAllPosts, addCommentOnPost, getCommentsForPost, updateComment, deleteComment } = userPosts;
const tagUsers = ref({});
const posts = ref([]);
const openComments = ref({});
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
    openComments.value[postId] = !openComments.value[postId];
    comment.value[postId] = '';
    allcomments.value[postId] = await getCommentsForPost(postId);
    editableCommentId.value[postId] = null;
};
const addCommentsInPost = async (postId) => {
    if (userDetails && comment.value[postId]) {
        addCommentOnPost(comment.value[postId], postId)
        comment.value[postId] = null
        allcomments.value[postId] = await getCommentsForPost(postId);
        showNotification( `${userDetails.value.firstName}` , 'commented on a post '  );
    }
}
const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
        new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body });
            }
        });
    }
};


const editComment = (postId, commentId) => {
    editableCommentId.value[postId] = commentId;
    comment.value[postId] = allcomments.value[postId].find(comment => comment.id === commentId).commentTitle;
    commentsToEdit.value[postId] = commentId;

};
const openSinglePagePost = (postId) => {
    router.push(`/post/${postId}`)
}

const handelupdateComment = async (updateExistingComment, postId) => {
    const updatedComment = {
        updatedAt: new Date().toISOString(),
        commentTitle: updateExistingComment.trim()
    };
    await updateComment(commentsToEdit.value[postId], updatedComment, postId);
    comment.value[postId] = null
    editableCommentId.value[postId] = null;
    allcomments.value[postId] = await getCommentsForPost(postId);

}
const selectedCommentToDeleteId = ref({});
const selectedCommentPostId = ref({});
const handeldeleteComment = async () => {
    await deleteComment(selectedCommentToDeleteId.value, selectedCommentPostId.value);
    allcomments.value[selectedCommentPostId.value] = await getCommentsForPost(selectedCommentPostId.value);
    deleteModal.value = false;
}

const openDeleteModal = (updateExistingCommentID, postId) => {
    selectedCommentToDeleteId.value = updateExistingCommentID;
    selectedCommentPostId.value = postId;
    deleteModal.value = true;
}

const loadMorePosts = () => {
    visiblePostCount.value += 5;
};
const closePopUp = () => {
    deleteModal.value = false;
}
</script>