<template>
  <nav class="navbar">
    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>
      <li v-if="!authState.isAuthenticated"><router-link to="/login">Login</router-link></li>
      <li v-if="!authState.isAuthenticated"><router-link to="/register">Register</router-link></li>
      <li v-if="authState.isAuthenticated">
        <button @click="logout" class="logout-btn">Logout</button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { reactive, watchEffect } from "vue";
import { useRouter } from 'vue-router';  // Ensure you import the router

export default {
  setup() {
    const router = useRouter();  // Initialize the router
    const authState = reactive({
      isAuthenticated: !!localStorage.getItem("user_id")
    });

    // Watch for changes to localStorage and update the authState accordingly
    watchEffect(() => {
      authState.isAuthenticated = !!localStorage.getItem("user_id");
    });

    // Logout functionality
    const logout = () => {
      localStorage.removeItem("user_id");  // Clear user_id from localStorage
      authState.isAuthenticated = false;  // Update reactive state
      router.push("/login");  // Redirect to login page
    };

    return {
      authState,
      logout
    };
  }
};
</script>

<style scoped>
.navbar {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links li {
  list-style: none;
}

.nav-links a,
.logout-btn {
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 5px;
}

.nav-links a:hover,
.logout-btn:hover {
  background-color: #555;
}

.logout-btn {
  border: none;
  cursor: pointer;
  background-color: transparent;
  padding: 10px 15px;
}
</style>
