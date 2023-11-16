import { reactive, ref } from "vue";
import { postUserStore } from '../store/post-store.js';

const store = postUserStore();

const { addPosts } = store;
export const createPostApi = () => {
    const postDetails = reactive({
        title: "",
        photo: null,
        description: "",
    });
    const isLoading = ref(false)
    const sucessModal = ref(false)

    const createPostsByUser = async () => {
        isLoading.value = true
        await addPosts({
            title: postDetails.title,
            photo: postDetails.photo,
            description: postDetails.description,
        })
        isLoading.value = false
        sucessModal.value = true
    };

    return { postDetails, createPostsByUser, isLoading, sucessModal }
}