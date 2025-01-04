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
    meta: { requiresAuth: true }, // Protected route
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Guard for Authentication
router.beforeEach((to, from, next) => {
  const userId = localStorage.getItem('user_id');
  console.log('Checking user_id in localStorage:', userId);  // Debugging line
  
  if (to.meta.requiresAuth) {
    if (!userId) {
      console.log('No user_id found, redirecting to login');  // Debugging line
      next('/login');  // Redirect to login if no user_id found
    } else {
      console.log('user_id found, accessing the route');  // Debugging line
      next(); // User is authenticated, proceed to the route
    }
  } else {
    console.log('Route does not require authentication, proceeding');  // Debugging line
    next();  // If route doesn't require authentication, proceed normally
  }
});

export default router;
