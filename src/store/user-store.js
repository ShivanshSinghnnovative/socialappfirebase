import { collection,  getDocs } from "firebase/firestore";
import { db } from "../firebase.js";
import { useAuthUserStore } from './auth-user-store.js';
import { storeToRefs } from 'pinia'
const store = useAuthUserStore();
const { userDetails } = storeToRefs(store);


export const userStore = (() => {
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
    return {  getUsersList };
});
