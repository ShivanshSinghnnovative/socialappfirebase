import { createRouter, createWebHashHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();

const afterSuccessfulLoginsignup = (to, from, next) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      next('/posts');
    } else {
      next();
    }
  });
};

const commonBeforeEnter = (to, from, next) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      next();
    } else {
      next('/');
    }
  });
};

const routes = [
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/registerUser.vue'),
    beforeEnter: afterSuccessfulLoginsignup,
  },
  {
    path: '/',
    name: 'login',
    component: () => import('@/pages/userLogin.vue'),
    beforeEnter: afterSuccessfulLoginsignup,
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => import('@/pages/showPost.vue'),
    beforeEnter: commonBeforeEnter,
  },
  {
    path: '/updateuserdetails',
    name: 'detailsupdated',
    component: () => import('@/pages/updateUserDetails.vue'),
    beforeEnter: commonBeforeEnter,
  },
  {
    path: '/addpost',
    name: 'addpost',
    component: () => import('@/pages/addPosts.vue'),
    beforeEnter: commonBeforeEnter,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedOut = to.name !== 'login' && to.name !== 'register';
  onAuthStateChanged(auth, (user) => {
    if (isLoggedOut && !user) {
      next({ name: 'login' });
    } else {
      next();
    }
  });
});

export default router;

