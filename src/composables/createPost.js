import { reactive } from "vue";
import { useAuthUserStore } from '../store/auth-user-store.js';

import { storeToRefs } from 'pinia';
const store = useAuthUserStore();
const { userDetails } = storeToRefs(store);

const { addPosts } = store;
export const createPostApi = ()=>{
    const postDetails = reactive({
        title: "",
        photo: null,
        description: "",
    });

    const createPostsByUser = async () => {
        await addPosts({
            title: postDetails.title,
            photo: postDetails.photo,
            description: postDetails.description,
          })
    };

    return { postDetails , createPostsByUser }
}