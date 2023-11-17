import { reactive, ref } from "vue";
import { postStore } from '../store/post-store.js';
import { computed } from 'vue';

import { requiredField } from './validationRules.js'
const store = postStore();

const { addPost } = store;
export const createPostApi = () => {
    const postDetails = reactive({
        title: "",
        photo: null,
        description: "",
        taggedUsers: [],
    });
    const isLoading = ref(false)
    const sucessModal = ref(false)

    const hasErrors = computed(() => {
        const errorFields = [
            ...requiredField.map((rule) => rule(postDetails.title)),
            ...requiredField.map((rule) => rule(postDetails.description)),
            ...requiredField.map((rule) => rule(postDetails.photo)),
        ];

        return errorFields.some((errors) =>
            Array.isArray(errors) ? errors.length > 0 : !!errors
        );
    });
    const createPost = async () => {
        isLoading.value = true
        await addPost({
            title: postDetails.title,
            photo: postDetails.photo,
            description: postDetails.description,
            taggedUsers: postDetails.taggedUsers,
        })
        isLoading.value = false
        sucessModal.value = true
    };

    return { postDetails, createPost, isLoading, sucessModal, hasErrors }
}