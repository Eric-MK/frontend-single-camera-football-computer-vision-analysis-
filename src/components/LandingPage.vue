<template>
  <div class="homepage-container">
    <header class="header">
      <h1>Football Match Analysis</h1>
    </header>
    <main class="main-content">
      <p>Welcome to our cutting-edge platform designed for advanced football match analysis using a single-camera solution. Unlock insights from your matches with our powerful computer vision tools. Whether you're a coach, player, or analyst, our application provides you with real-time stats and performance metrics that can elevate your game.</p>
      <button @click="navigateToLogin" class="login-btn">Get Started</button>
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
/* Global reset for box-sizing */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f7fa;
  color: #333;
}

/* Homepage container styling */
.homepage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 0 20px;
  position: relative; /* Make sure the overlay covers the whole container */
  background-image: url('@/assets/pexels-carlos-cesar-1203812-2291073.jpg'); /* Replace 'your-image.jpg' with the actual image name */
  background-size: cover;
  background-position: center;
  color: #fff;
}

.homepage-container::before {
  content: ''; /* Empty content to create an overlay */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4); /* Dark overlay to increase contrast */
  z-index: 1; /* Place the overlay behind the text */
}

.header h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.7); /* Strong text shadow for better readability */
  z-index: 2; /* Ensure the text is above the overlay */
}

.main-content {
  font-size: 1.2rem;
  margin-bottom: 40px;
  max-width: 700px;
  line-height: 1.6;
  margin: 0 auto;
  z-index: 2; /* Ensure the text is above the overlay */
}

.login-btn {
  padding: 14px 30px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 2; /* Ensure the button is above the overlay */
}

.login-btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.login-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(38, 143, 255, 0.5);
}

.login-btn:active {
  background-color: #003f7f;
}

@media (max-width: 768px) {
  .homepage-container {
    padding: 20px 10px;
  }

  .header h1 {
    font-size: 2.2rem;
  }

  .main-content {
    font-size: 1rem;
  }

  .login-btn {
    padding: 12px 24px;
    font-size: 1rem;
  }
}

</style>
