<template>
  <div class="homepage-container">
    <header class="header">
      <h1>Welcome to Our Application</h1>
    </header>
    <main class="main-content">
      <p>Welcome to our platform where you can access amazing features by logging in or registering.</p>
      <button @click="navigateToLogin" class="login-btn">Login</button>
    </main>
  </div>
</template>

<script>
export default {
  methods: {
    navigateToLogin() {
      this.$router.push("/login"); // Assumes you have Vue Router set up with a '/login' route
    },
  },
};
</script>

<style scoped>
.homepage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #f0f4f8;
  padding: 20px;
  text-align: center;
}

.header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.main-content {
  font-size: 1.2rem;
  color: #555;
}

.login-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.login-btn:hover {
  background-color: #0056b3;
}
</style>
