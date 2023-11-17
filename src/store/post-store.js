import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, query, doc, where } from "firebase/firestore";
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

    const getAllPosts = async () => {
        try {
            let posts = []
            const querySnapshot = await getDocs(query(collection(db, "post")));
            if (!querySnapshot.empty) {
                for (const doc of querySnapshot.docs) {
                    const post = { ...doc.data(), id: doc.id };
                    post.userDetails = await getUserDetails(post.updatedBy);
                    post.taggedUserNames = await getTaggedUserNames(doc.id);
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
    const getTaggedUserNames = async (postId) => {
        try {
            const taggedUserRef = collection(db, `post/${postId}/taggedUsers`);
            const querySnapshot = await getDocs(taggedUserRef);
            if (!querySnapshot.empty) {
                const userNames = [];
                for (const doc of querySnapshot.docs) {
                    const userIds = doc.data().userId;
                    for (const userId of userIds) {
                        const userDetails = await getUserDetails(userId);
                        const userName = `${userDetails.firstName} ${userDetails.lastName}`;
                        userNames.push(userName);
                    }
                }
                return userNames;
            } else {
                console.error("No tagged users found for post ID:", postId);
                return [];
            }
        } catch (error) {
            console.error("Error fetching tagged user names:", error);
            return [];
        }
    }
    const getUserDetails = async (uid) => {
        try {
            const userDetailsCollection = collection(db, "userDetails");
            const querySnapshot = await getDocs(query(userDetailsCollection, where("uid", "==", uid)));
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0].data();
                const { profilePhotoPath, firstName, lastName } = userDoc;
                return { profilePhotoPath, firstName, lastName };
            } else {
                console.error("User document not found for UID:", uid);
            }
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    };
    return { addPost, getAllPosts, getUserDetails };
});
