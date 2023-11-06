import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth } from '../store/authUser.js'; 
import { storeToRefs } from 'pinia'

const routes = [
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/registerUser.vue'),
  },
  {
    path: '/',
    name: 'login',
    component: () => import('@/pages/userLogin.vue'),
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => import('@/pages/showPost.vue'),
    
  },
]
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router;
