import { reactive, ref } from "vue";
import { userRegisterUse } from '../store/registerUser.js'

export const signUpApi = () => {
    const hidePassword = ref(false);
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
    const { createUser } = store;
    const createAccount = async () => {
        await createUser({
            firstName: signUser.firstName,
            lastName: signUser.lastName,
            mobileNumber: signUser.mobileNumber,
            email: signUser.email,
            password: signUser.password,
            profilepic: signUser.profilePhoto
        });
    };
    const togglePassword = () => {
        hidePassword.value = !hidePassword.value;
    };
    return {
        signUser,
        createAccount,
        hidePassword,
        togglePassword,
    };
}

