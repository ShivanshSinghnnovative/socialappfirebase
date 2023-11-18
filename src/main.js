/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import './style.css'
// Plugins
import { registerPlugins } from '@/plugins'
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const app = createApp(App)

registerPlugins(app)
app.component('ckeditor', CKEditor.component);
app.mount('#app')
