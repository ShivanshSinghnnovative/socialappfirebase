import { defineStore } from 'pinia';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { app, db } from '../firebase.js';
const auth = getAuth(app);
const storage = getStorage();

export const userRegisterUse = defineStore('userRegister', () => {
    const createUser = async (userData) => {
        try {
            const authResult = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const storedata = await addDoc(collection(db, "registerusersdetails"), {
                uid: authResult.user.uid,
                firstName: userData.firstName,
                lastName: userData.lastName,
                mobileNumber: userData.mobileNumber,
                email: userData.email
            })
            const storageRef = ref(storage, `userProfile/${authResult.user.uid}/profilepic`);
            uploadBytes(storageRef, userData.profilePhoto);
            console.log(authResult, storedata , userData.profilePhoto)
        } catch (error) {
            console.log(error );
        }
    };

    return { createUser };
});
