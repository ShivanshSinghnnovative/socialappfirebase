<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50" @click="closeModal">
    <div class="bg-green-700 p-4 md:p-8 text-center w-2/5 mx-auto" @click.stop>
      <div class="border-2 border-black p-4 md:p-8 text-white text-lg md:text-2xl">
        <div class="text-3xl font-bold">
          {{ content }}
        </div>
        <div>
          <button @click="closeModal"
            class="mt-4 text-lg md:text-xl px-4 py-2 rounded bg-white text-black cursor-pointer">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'
const { content } = defineProps(['content']);
const emit = defineEmits();

const closeModal = () => {
  emit('closeModals');
};
</script>
