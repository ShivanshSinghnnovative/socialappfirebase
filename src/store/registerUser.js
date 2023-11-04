import { defineStore } from 'pinia';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes , getDownloadURL } from "firebase/storage";
import { app, db } from '../firebase.js';
import { reactive, toRefs } from 'vue';
const auth = getAuth(app);
const storage = getStorage();
export const userRegisterUse = defineStore('userRegister', () => {
    const state = reactive({
        existUserError: false
    })

    const createUser = async (userData) => {
        try {
            const authResult = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const storageRef = ref(storage, `userProfile/${authResult.user.uid}/profilepic`);
            uploadBytes(storageRef, userData.profilePhoto);

            const downloadURL = await getDownloadURL(storageRef);

            const storedata = await addDoc(collection(db, "userDetails"), {
                uid: authResult.user.uid,
                firstName: userData.firstName,
                lastName: userData.lastName,
                mobileNumber: userData.mobileNumber,
                email: userData.email ,
                profilePhotoPath: downloadURL
            })
            state.existUserError = false;
            console.log(authResult, storedata)
        } catch (error) {
            console.log(error);
            state.existUserError = true;
        }
    };

    return { createUser, ...toRefs(state) };
});
