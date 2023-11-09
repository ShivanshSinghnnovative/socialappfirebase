import { reactive, ref } from "vue";
import { storeToRefs } from 'pinia'
import { useAuthUserStore } from '../store/auth-user-store.js'
import { useRouter } from 'vue-router';

export const signUpApi = () => {
    const router = useRouter();
    const hidePassword = ref(false);
    const sucessModal = ref(false);
    const userExist = ref(false);
    const isLoading = ref(false);
    const signUser = reactive({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePhoto: null,
    });
    const store = useAuthUserStore();
    const { createUser , createUserGoogle , createUserFacebook , createUserTwitter} = store;
    const { existUserError } = storeToRefs(store)

    const createAccount = async () => {
        isLoading.value = true;
        await createUser({
            firstName: signUser.firstName,
            lastName: signUser.lastName,
            mobileNumber: signUser.mobileNumber,
            email: signUser.email,
            password: signUser.password,
            profilepic: signUser.profilePhoto
        });
        if (!existUserError.value) {
            userExist.value = false;
            sucessModal.value = true;
            isLoading.value = false;
            resetForm();

        } else {
            userExist.value = true;
            isLoading.value = false;
        }
    };
    const createAccountwithGoogle = async () =>{
        await createUserGoogle();
    };
    const createAccountwithFacebook = async () =>{
        await createUserFacebook();
    };
    const createAccountwithTwitter = async () =>{
        await createUserTwitter();
    };
    const resetForm = () => {
        signUser.firstName = "";
        signUser.lastName = "";
        signUser.mobileNumber = "";
        signUser.email = "";
        signUser.password = "";
        signUser.confirmPassword = "";
        signUser.profilePhoto = null || "";
    };
    const handleFileChange = (event) => {
        signUser.profilePhoto = event.target.files[0];
    };
    const togglePassword = () => {
        hidePassword.value = !hidePassword.value;
    };
    return {
        signUser,
        createAccount,
        hidePassword,
        togglePassword,
        userExist,
        sucessModal,
        isLoading,
        handleFileChange,
        createAccountwithGoogle,
        createAccountwithFacebook,
        createAccountwithTwitter
    };
}

export const loginApi = () => {
    const router = useRouter();
    const hidePassword = ref(false);
    const invalidUser = ref(false);
    const isLoading = ref(false);
    const loginUser = reactive({
        email: "",
        password: ""
    });
    const store = useAuthUserStore();
    const { signInUser } = store;
    const { invalidMailError } = storeToRefs(store)
    const signInRegisterUser = async () => {
        isLoading.value = true;
        await signInUser({
            email: loginUser.email,
            password: loginUser.password
        });
        if (!invalidMailError.value) {
            invalidUser.value = false;
            isLoading.value = false;
            router.push({ path: '/posts' })
        }
        else {
            invalidUser.value = true;
            isLoading.value = false;
        }
    }
    const togglePassword = () => {
        hidePassword.value = !hidePassword.value;
    };
    return {
        hidePassword,
        togglePassword,
        isLoading,
        loginUser,
        invalidUser,
        signInRegisterUser,

    }
}
