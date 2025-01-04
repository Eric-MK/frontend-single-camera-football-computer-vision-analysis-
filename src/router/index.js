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
    meta: { requiresAuth: false } // Protected route
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Guard for Authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth) {
    if (!token) {
      // No token, redirect to login
      next('/login');
    } else {
      // If token exists, validate it (you can add token expiration check here)
      const isTokenValid = checkTokenValidity(token);
      
      if (!isTokenValid) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('token'); // Clear the invalid token
        next('/login');
      } else {
        next(); // Proceed to the route
      }
    }
  } else {
    next(); // If route doesn't require authentication, proceed normally
  }
});

function checkTokenValidity(token) {
  // Check token expiration (if you have an expiry field in your JWT)
  const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
  const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
  
  return payload.exp > currentTime; // Token is valid if expiration time is in the future
}

export default router;
