import { reactive, ref } from "vue";
import { storeToRefs } from 'pinia'
import { userRegisterUse } from '../store/registerUser.js'

export const signUpApi = () => {
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
    const store = userRegisterUse();
    const { createUser  } = store;
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
    const resetForm = () => {
        signUser.firstName = "";
        signUser.lastName = "";
        signUser.mobileNumber = "";
        signUser.email = "";
        signUser.password = "";
        signUser.confirmPassword = "";
        signUser.profilePhoto = null || "";
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
        isLoading
    };
}

