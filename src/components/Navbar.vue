<template>
  <nav class="navbar">
    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>
      <!-- Upload Video link visible only when authenticated -->
      <li v-if="authState.isAuthenticated"><router-link to="/home">Upload Video</router-link></li> 
      <li v-if="!authState.isAuthenticated"><router-link to="/login">Login</router-link></li>
      <li v-if="!authState.isAuthenticated"><router-link to="/register">Register</router-link></li>
      <li v-if="authState.isAuthenticated"><router-link to="/user-videos">Your Videos</router-link></li>
    </ul>
    <div class="user-section" v-if="authState.isAuthenticated">
      <span class="user-name">{{ userName }}</span>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>
  </nav>
</template>

<script>
import { reactive, onMounted, ref } from "vue";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const authState = reactive({
      isAuthenticated: false
    });
    const userName = ref("");  // Variable to hold the user's name

    // Check authentication and set userName on mount
    onMounted(() => {
      // On page load, check if the user is authenticated (i.e., if user_id exists in localStorage)
      authState.isAuthenticated = !!localStorage.getItem("user_id");
      if (authState.isAuthenticated) {
        userName.value = localStorage.getItem("user_name") || "Guest";  // Get user name from localStorage
      }
    });

    // Logout functionality
    const logout = () => {
      // Clear user_id and user_name from localStorage and force a page reload
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      authState.isAuthenticated = false;
      window.location.reload(); // Reload the page to reflect changes
    };

    return {
      authState,
      logout,
      userName
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
  justify-content: space-between; /* Distribute items across the navbar */
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 20px;
  margin-right: auto; /* Push nav links to the left */
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

.user-section {
  display: flex;
  align-items: center; /* Align username and logout button horizontally */
  gap: 10px; /* Add spacing between username and button */
}

.user-name {
  font-size: 16px;
  color: white;
}
</style>
