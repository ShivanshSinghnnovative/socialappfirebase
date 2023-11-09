<template>
    <v-container fluid class="bg-gray-900 min-h-screen flex justify-center h-full">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card class="mt-12" elevation="12">
                    <v-card-title class="text-center">
                        <h1 class="text-h3 font-weight-bold mb-4 text-blue">Login User</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="signInRegisterUser">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field :rules="requiredField" v-model="loginUser.email" label="Email"
                                        outlined></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-row class="mb-2">
                                        <v-col cols="11">
                                            <v-text-field :rules="requiredField" v-model="loginUser.password"
                                                :type="hidePassword ? 'text' : 'password'" label="Password" outlined
                                                required>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="1" class="mt-4">
                                            <v-icon @click="togglePassword"
                                                :icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'">
                                            </v-icon>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-col cols="12">
                                <v-alert v-if="invalidUser" type="error" class="mt-2">
                                    Invalid Login Credentials !
                                </v-alert>
                            </v-col>
                            <v-col cols="12">
                                <v-btn class="mt-2 pointer" color="blue" type="submit" dark :disabled="hasErrors">
                                    <div v-if="!isLoading">Login</div>
                                    <div v-else>
                                        <v-progress-circular indeterminate></v-progress-circular>
                                    </div>
                                </v-btn>
                            </v-col>
                            <v-col class="m-auto">
                                <div class="text-center text-green-900 m-auto">
                                    <div>Need an account ?</div>
                                    <router-link to="/register" class="mt-2 pointer text-center"
                                        style="display: inline-block; color: blue">
                                        SignUp
                                    </router-link>
                                </div>
                            </v-col>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed } from "vue";
import { loginApi } from "../composables/loginSignup.js";
import { requiredField } from "../composables/validationRules";
const {
    loginUser,
    togglePassword,
    hidePassword,
    sucessModal,
    signInRegisterUser,
    isLoading,
    invalidUser,
} = loginApi();

const hasErrors = computed(() => {
    const errorFields = [
        ...requiredField.map((rule) => rule(loginUser.email)),
        ...requiredField.map((rule) => rule(loginUser.password)),
    ];

    return errorFields.some((errors) =>
        Array.isArray(errors) ? errors.length > 0 : !!errors
    );
});
</script>
