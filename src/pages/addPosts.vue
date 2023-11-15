<template>
    <v-container fluid class="bg-gray-900 min-h-screen h-full">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card class="mt-12" elevation="12">
                    <v-card-title class="text-center">
                        <h1 class="text-h3 font-weight-bold mb-4 text-blue ">ADD POST</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="createPostsByUser">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="postDetails.title" :rules="requiredField" label="Title" outlined>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-file-input v-model="postDetails.photo" :rules="requiredField" label="Upload  Photo" accept="image/*">
                                    </v-file-input>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="postDetails.description" :rules="requiredField" label="Description" outlined>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-btn class="mt-2 pointer ml-1" color="blue" type="submit" dark :disabled="hasErrors">
                                        <div>
                                            Add Post
                                        </div>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
   
<script setup>
import { computed } from 'vue';
import { createPostApi } from '../composables/createPost.js'
import { requiredField } from "../composables/validationRules"

const { postDetails , createPostsByUser } = createPostApi()
const hasErrors = computed(() => {
    const errorFields = [
        ...requiredField.map((rule) => rule(postDetails.title)),
        ...requiredField.map((rule) => rule(postDetails.description)),
        ...requiredField.map((rule) => rule(postDetails.photo)),
    ];

    return errorFields.some((errors) =>
        Array.isArray(errors) ? errors.length > 0 : !!errors
    );
});
</script>
