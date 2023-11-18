import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, query, doc, where, orderBy } from "firebase/firestore";
import { db } from "../firebase.js";
import slugify from 'slugify';
import { useAuthUserStore } from './auth-user-store.js';
import { storeToRefs } from 'pinia'
const store = useAuthUserStore();
const { userDetails } = storeToRefs(store);
const storage = getStorage();

export const postStore = (() => {

    const addPost = async (postDetails) => {
        try {
            const slug = slugify(postDetails.title, {
                lower: true,
                strict: true,
            });
            const timestamp = new Date().toISOString();;
            const createdBy = userDetails.value.uid;
            const storageRef = ref(storage, `post/${createdBy}/postphotos${timestamp}`);
            await uploadBytes(storageRef, postDetails.photo[0]);
            const downloadURL = await getDownloadURL(storageRef);
            const taggedUserNames = postDetails.taggedUsers;
            const postData = {
                title: postDetails.title,
                description: postDetails.description,
                slug: slug,
                createdAt: timestamp,
                updatedAt: timestamp,
                updatedBy: createdBy,
                photo: downloadURL,
                firstName: userDetails.value.firstName,
                lastName: userDetails.value.lastName,
                profilePhotoPath: userDetails.value.profilePhotoPath,
                taggedUsers: taggedUserNames,
            }
            const postRef = await addDoc(collection(db, "post"), postData);
        }
        catch (error) {
            console.log(error)
        }

    };

    const getAllPosts = async () => {
        try {
            let posts = []
            const querySnapshot = await getDocs(query(collection(db, "post"), orderBy("createdAt", "desc")));
            if (!querySnapshot.empty) {
                for (const doc of querySnapshot.docs) {
                    const post = { ...doc.data(), id: doc.id };
                    posts.push(post);
                }
                return posts;
            } else {
                console.error("not found ");
            }
        } catch (error) {
            console.log(error)
        }
    }
    return { addPost, getAllPosts };
});
