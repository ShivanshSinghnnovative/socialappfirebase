import { createRouter, createWebHashHistory } from 'vue-router';

const userIsLoggedIn = () => {
  return localStorage.getItem('UID') !== null;
}

const afterSuccessfulLoginsignup = (to, from, next) => {
  if (userIsLoggedIn()) {
    next('/posts');
  } else {
    next();
  }
};
const commonBeforeEnter = (to, from, next) => {
  if (userIsLoggedIn()) {
    next();
  } else {
    next('/');
  }
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
    beforeEnter: commonBeforeEnter

  },
]
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})



router.beforeEach((to, from, next) => {
  const isLoggedOut = (to.name !== 'login' && to.name !== 'register' && !userIsLoggedIn());
  if (isLoggedOut) {
    next({ name: 'login' });
  } else {
    next();
  }
});
export default router;
