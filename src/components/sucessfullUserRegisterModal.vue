<template>
  <div class="text-center">
    <v-btn color="blue" class=" cursor-pointer" cols="12" @click="dialog = true">
      User Register
    </v-btn>
    <v-dialog v-model="dialog" width="auto">
      <v-card class="p-50 m-3 ">
        <v-card-text>
          User Register Sucessfully
        </v-card-text>
        <v-card-actions>
          <v-btn cols="12" color="blue" block @click="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
    }
  },
}
</script>