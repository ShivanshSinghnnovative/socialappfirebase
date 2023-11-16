import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import slugify from 'slugify';
import { useAuthUserStore } from './auth-user-store.js';
import { storeToRefs } from 'pinia'
const store = useAuthUserStore();
const { userDetails } = storeToRefs(store);
const storage = getStorage();

export const userPostStore = (() => {

    const addPosts = async (postDetails) => {
        try {
            const slug = slugify(postDetails.title, {
                lower: true,
                strict: true,
            });
            const timestamp = new Date().toISOString();
            const createdBy = userDetails.value.uid;
            const storageRef = ref(storage, `post/${createdBy}/postphotos${timestamp}`);
            await uploadBytes(storageRef, postDetails.photo[0]);
            const downloadURL = await getDownloadURL(storageRef);
            const postData = {
                title: postDetails.title,
                description: postDetails.description,
                slug: slug,
                createdAt: timestamp,
                updatedAt: timestamp,
                updatedBy: createdBy,
                photo: downloadURL,
            }
            const postId = await addDoc(collection(db, "post"), postData);
        }
        catch (error) {
            console.log(error)
        }

    };
    return { addPosts };
});
