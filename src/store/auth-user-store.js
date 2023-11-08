import { defineStore } from 'pinia';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app, db } from '../firebase.js';
import { reactive, toRefs } from 'vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const auth = getAuth(app);
const storage = getStorage();

export const useAuthUserStore = defineStore('useAuth', () => {
    const state = reactive({
        userLoggedIn: false,
        userDetails: null,
        invalidMailError: false,
        existUserError: false,
    })
    const getUserDetails = async (uid) => {
        try {
            const userDoc = await getDocs(collection(db, "userDetails"));
            let userDetails = null;

            userDoc.forEach((doc) => {
                const data = doc.data();
                if (data.uid === uid) {
                    userDetails = data;
                }
            });
            return userDetails;
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    };

    onAuthStateChanged(auth, async (user) => {
        state.userLoggedIn = !!user;
        if (user) {
            const userDetails = await getUserDetails(user.uid);
            state.userDetails = userDetails;
        } else {
            state.userDetails = null;
        }
    });

    const createUser = async (userData) => {
        try {
            const authResult = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const storageRef = ref(storage, `userProfile/${authResult.user.uid}/profilepic`);
            await uploadBytes(storageRef, userData.profilepic);
            const downloadURL = await getDownloadURL(storageRef);
            const payload = {
                uid: authResult.user.uid,
                firstName: userData.firstName,
                lastName: userData.lastName,
                mobileNumber: userData.mobileNumber,
                email: userData.email,
                profilePhotoPath: downloadURL
            }
            const storedata = await addDoc(collection(db, "userDetails"), payload)
            state.existUserError = false;
            if (storedata) {
                state.userDetails = payload
            }
            localStorage.setItem('UID', JSON.stringify(payload.uid));
        } catch (error) {
            console.log(error);
            state.existUserError = true;
        }
    };

    const signInUser = async (loginUserDetails) => {
        try {
            const result = await signInWithEmailAndPassword(auth, loginUserDetails.email, loginUserDetails.password);
            state.invalidMailError = false;
            localStorage.setItem('UID', JSON.stringify(loginUserDetails.uid));
        } catch (error) {
            console.error("Sign-in error:", error);
            state.invalidMailError = true;
        }
    };

    const router = useRouter();
    const logout = async () => {
        try {
            signOut(auth).then(() => {
                router.push('/')
            })
            localStorage.removeItem('UID')
        } catch (error) {
            console.log(error)
        }
    }
    const userDetails = computed(() => state.userDetails);
    const userLoggedIn = computed(() => state.userLoggedIn);
    return { createUser, userDetails, userLoggedIn, logout, signInUser, ...toRefs(state) };
});