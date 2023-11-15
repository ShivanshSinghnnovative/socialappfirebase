import { defineStore } from 'pinia';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { collection, addDoc, getDocs, doc, query, where, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app, db } from '../firebase.js';
import { reactive, toRefs } from 'vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const auth = getAuth(app);
const storage = getStorage();
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

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
            await storeUserData(authResult.user.uid, userData);
        } catch (error) {
            console.log(error);
            state.existUserError = true;
        }
    };

    const signInUser = async (loginUserDetails) => {
        try {
            const result = await signInWithEmailAndPassword(auth, loginUserDetails.email, loginUserDetails.password);
            state.invalidMailError = false;
        } catch (error) {
            console.error("Sign-in error:", error);
            state.invalidMailError = true;
        }
    };

    const updateUserDetails = async (uid, updatedDetails) => {
        try {
            const userDetailsCollection = collection(db, 'userDetails');
            const querySnapshot = await getDocs(query(userDetailsCollection, where('uid', '==', uid)));
            if (!querySnapshot.empty) {
                const userDocRef = querySnapshot.docs[0].ref;
                await setDoc(userDocRef, updatedDetails, { merge: true });
            } else {
                console.error('User document not found for UID:', uid);
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    const router = useRouter();
    const logout = async () => {
        try {
            signOut(auth).then(() => {
                router.push('/')
            })
        } catch (error) {
            console.log(error)
        }
    }
    const createUserGoogle = async () => {
        await createAccountWithAuthProvider(provider);
    };

    const createUserFacebook = async () => {
        await createAccountWithAuthProvider(facebookProvider);
    };

    const createUserTwitter = async () => {
        await createAccountWithAuthProvider(twitterProvider);
    };
    const createAccountWithAuthProvider = async (provider) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = provider.credentialFromResult(result);
            const user = result.user;
            await storeUserData(user.uid, {
                firstName: user.displayName.split(' ')[0],
                lastName: user.displayName.split(' ')[1] || '',
                email: user.email,
                profilepic: user.photoURL,
            });
        } catch (error) {
            console.error(error);
        }
        router.push('/posts')
    };

    const storeUserData = async (uid, userData) => {
        const storageRef = ref(storage, `userProfile/${uid}/profilepic`);
        await uploadBytes(storageRef, userData.profilepic);
        const downloadURL = await getDownloadURL(storageRef);
        const payload = {
            uid: uid,
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobileNumber: userData.mobileNumber || '',
            email: userData.email,
            profilePhotoPath: downloadURL,
        };
        const storedata = await addDoc(collection(db, 'userDetails'), payload);
        state.existUserError = false;

        if (storedata) {
            state.userDetails = payload;
        }
    };

    const userDetails = computed(() => state.userDetails);
    const userLoggedIn = computed(() => state.userLoggedIn);
    return { createUser, userDetails, userLoggedIn, logout, signInUser, updateUserDetails, createUserGoogle, createUserFacebook, createUserTwitter, ...toRefs(state) };
});
