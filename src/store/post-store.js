import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, query, doc, setDoc, where, orderBy, deleteDoc } from "firebase/firestore";
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
        let posts = []
        try {
            posts = []
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
    const addCommentOnPost = async (commentTitle, postId) => {
        try {
            if (commentTitle.trim() !== '') {
                const timestamp = new Date().toISOString();
                const commentData = {
                    commentTitle,
                    userId: userDetails.value.uid,
                    firstName: userDetails.value.firstName,
                    profilePhotoPath: userDetails.value.profilePhotoPath,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                };
                const commentsRef = collection(db, `post/${postId}/comment`);
                await addDoc(commentsRef, commentData);

            }
        } catch (error) {
            console.error(error);
        }
    };
    const getCommentsForPost = async (postId) => {
        try {
            const comments = [];
            const commentsSnapshot = await getDocs(query(collection(db, `post/${postId}/comment`), orderBy("createdAt", "desc")));
            commentsSnapshot.forEach((commentDoc) => {
                const comment = { ...commentDoc.data(), id: commentDoc.id };
                comments.push(comment);
            });
            return comments;
        } catch (error) {
            console.error(error);
        }
    };
    const updateComment = async (createdAt, updatedComment, postId) => {
        try {
            const userDetailsCollection = collection(db, `post/${postId}/comment`);
            const querySnapshot = await getDocs(query(userDetailsCollection, where("createdAt", "==", createdAt)));
            if (!querySnapshot.empty) {
                const userDocRef = querySnapshot.docs[0].ref;
                await setDoc(userDocRef, updatedComment, { merge: true });
            }
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    };

    const deleteComment = async (commentId, postId) => {
        try {
            const commentsRef = collection(db, `post/${postId}/comment`);
            const commentDocRef = doc(commentsRef, commentId);
            await deleteDoc(commentDocRef);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };
    return { addPost, getAllPosts, addCommentOnPost, getCommentsForPost, updateComment, deleteComment };
});
