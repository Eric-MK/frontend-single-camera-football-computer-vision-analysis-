import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage.vue';
import HomePage from '../components/HomePage.vue';
import Login from '../components/Login.vue';
import Registration from '../components/Registration.vue';


const routes = [
  { path: '/', component: LandingPage },
  { path: '/login', component: Login },
  { path: '/register', component: Registration },
  {
    path: '/home',
    component: HomePage,
    meta: { requiresAuth: true } // Add a meta field for protected routes
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Guard for Authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;
