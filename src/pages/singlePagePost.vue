<template>
    <div class=" m-auto  ">
        <div class="text-right p-4">
            <v-btn class="mt-2 pointer mr-2" color="blue" @click="goback()">
                Go Back
            </v-btn>
        </div>
        <div v-if="post.title" class=" w-4/6 m-auto bg-gray-300 border border-gray-300 rounded-xl">
            <h2 class=" text-left font-bold p-4 text-xl ml-15 mr-15">{{ post.title }}</h2>
            <div class=" p-4 flex items-center h-10 mt-1 ml-15">
                <img :src="post.profilePhotoPath" alt="Profile Photo" class=" w-13 h-12 rounded-full mr-4" />
                <span>
                    <h2 class=" text-sm font-bold">{{ post.firstName }} {{ post.lastName }}</h2>
                    <h4 class="text-xs ">{{ new Date(post.updatedAt).toLocaleDateString() }}
                        {{ new Date(post.updatedAt).toLocaleTimeString() }}
                    </h4>
                </span>
            </div>
            <img :src="post.photo" alt="Post Photo" class=" w-full  m-auto  mt-5 object-cover" />
            <p class=" ml-15 mr-15 text-xs mt-10 " v-html="post.description"></p>
            <div class="mb-3 mt-6 ml-15">
                <tagUserList :taggedUsersList="post.taggedUsers"/>
            </div>
            <div class="p-3 ml-15">
                <div class=" w-4/5">
                    <div v-for="commentDetails in allcomments" :key="commentDetails.id"
                        class="mb-3 bg-white  border-black rounded-lg">
                        <commentsonPost :commentDetails="commentDetails" :updatedBy="post.updatedBy" @editComment="editComment( commentDetails.id)"  @opendelete="openDeleteModal(commentDetails.id, post.id)"/>
                    </div>
                </div>
                <input v-model="comment"
                    class="border break-all border-gray-300 text-gray-800 text-xl p-2 rounded-lg mt-3  block w-4/5  bg-blue-200 "
                    type="text" placeholder="add comments">
                <v-btn
                    @click=" ((comment && editableCommentId.length) ? handelupdateComment(comment, post.id) : addCommentsInPost(post.id))"
                    class="p-1.5 mt-3" color="blue">
                    {{ ((comment && editableCommentId.length) ? 'Update comment' : 'Post comment') }}
                </v-btn>
            </div>
        </div>
        <div v-else class="text-center m-auto">
            <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <div v-if="deleteModal" class="fixed">
            <confirmDelete :content="'Are you sure to delete this comment'" @deleteModal="handeldeleteComment()"
                @closeModal="closePopUp()" />
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import commentsonPost  from '../components/showAllcomments.vue'
import { ref, onMounted } from 'vue';
import { postStore } from '@/store/post-store';
import { storeToRefs } from 'pinia';
import confirmDelete from '../components/confirmationDeleteModal.vue'
import { useAuthUserStore } from '../store/auth-user-store.js';
import tagUserList from '../components/taggedUsersList.vue';
const router = useRouter();
const authUser = useAuthUserStore();
const { userDetails } = storeToRefs(authUser);
const userSinglePost = postStore();
const { getPost, addCommentOnPost, getCommentsForPost, updateComment, deleteComment } = userSinglePost;
const route = useRoute();
const allcomments = ref({});
let post = ref([]);
const deleteModal = ref(false);
onMounted(async () => {
    try {
        post.value = await getPost(route.params.id);
        allcomments.value = await getCommentsForPost(route.params.id);
    } catch (error) {
        console.error(error);
    }
});
const comment = ref([])
const commentsToEdit = ref([])
const editableCommentId = ref([]);
const editComment = ( commentId) => {
    editableCommentId.value = commentId;
    comment.value = allcomments.value.find(comment => comment.id === commentId).commentTitle;
    commentsToEdit.value = commentId;

};
const selectedCommentToDeleteId = ref([]);
const selectedCommentPostId = ref([]);
const handeldeleteComment = async () => {
    await deleteComment(selectedCommentToDeleteId.value, selectedCommentPostId.value);
    allcomments.value = await getCommentsForPost(selectedCommentPostId.value);
    deleteModal.value = false;
}
const openDeleteModal = (updateExistingCommentID, postId) => {
    selectedCommentToDeleteId.value = updateExistingCommentID;
    selectedCommentPostId.value = postId;
    deleteModal.value = true;
}
const handelupdateComment = async (updateExistingComment, postId) => {
    const updatedComment = {
        updatedAt: new Date().toISOString(),
        commentTitle: updateExistingComment.trim()
    };
    await updateComment(commentsToEdit.value, updatedComment, postId);
    comment.value = null
    editableCommentId.value = null;
    allcomments.value = await getCommentsForPost(postId);
}
const addCommentsInPost = async (postId) => {
    if (userDetails && comment.value) {
        addCommentOnPost(comment.value, postId)
        comment.value = null
        allcomments.value = await getCommentsForPost(postId);
    }
}
const goback = () => {
    router.go(-1);
}
const closePopUp = () => {
    deleteModal.value = false;
}
</script>