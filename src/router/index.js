import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterPage from '../views/register/RegisterPage.vue'
import LoginPage from '../views/login/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/user', name: 'user', component: RegisterPage },
    { path: '/user/:id', name: 'editUser', component: RegisterPage },
    { path: '/register', name: 'register', component: RegisterPage },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },

  ]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next('/login');
  } else {
    // this.$up("$loggedIn", true)
  }

  next();
})
export default router
