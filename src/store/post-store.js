import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
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
            const postRef = await addDoc(collection(db, "post"), postData);
            const taggedUserRef = collection(db, `post/${postRef.id}/taggedUsers`);
            await addDoc(taggedUserRef, { userId: postDetails.taggedUsers });
        }
        catch (error) {
            console.log(error)
        }

    };
    const getUsersList = async () => {
        try {
            const userCollection = collection(db, "userDetails");
            const userDocs = await getDocs(userCollection);
            const usersList = [];

            userDocs.forEach((doc) => {
                const userData = doc.data();
                usersList.push({
                    uid: userData.uid,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                });
            });

            return usersList;
        } catch (error) {
            console.error("Error fetching users list:", error);
            return [];
        }
    };
    return { addPost, getUsersList };
});
