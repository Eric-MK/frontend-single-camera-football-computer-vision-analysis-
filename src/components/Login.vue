<template>
  <div class="auth-container">
    <form @submit.prevent="submitLogin" class="form-container">
      <h2>Login</h2>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          type="email"
          v-model="email"
          :class="{ invalid: errors.email, valid: !errors.email && email }"
          class="input-text"
          aria-label="Email"
        />
        <span v-if="errors.email" class="error-message">Please enter a valid email.</span>
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          id="password"
          type="password"
          v-model="password"
          :class="{ invalid: errors.password }"
          class="input-text"
          aria-label="Password"
        />
        <span v-if="errors.password" class="error-message">Password is required.</span>
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        <span v-if="loading">Loading...</span>
        <span v-else>Login</span>
      </button>

      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      errors: {
        email: false,
        password: false,
      },
      loading: false, // Loading state for API requests
    };
  },
  methods: {
    validateLoginForm() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Improved email regex
      this.errors.email = !emailPattern.test(this.email);
      this.errors.password = this.password.trim().length === 0;
    },
    async submitLogin() {
      this.validateLoginForm();
      if (Object.values(this.errors).includes(true)) {
        alert("Please correct the errors before submitting.");
        return;
      }

      this.loading = true; // Start loading state
      try {
        const response = await axios.post("http://localhost:5000/login", {
          email: this.email,
          password: this.password,
        });

        // Handle successful login
        localStorage.setItem("token", response.data.access_token); // Save JWT token
        this.$router.push("/home"); // Navigate to homepage
        alert("Login successful!");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Invalid email or password.");
        } else {
          alert("An error occurred. Please try again.");
        }
      } finally {
        this.loading = false; // Reset loading state
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h2 {
  text-align: center;
  color: #333;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.input-text {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.input-text.invalid {
  border: 1px solid #e74c3c;
  background-color: #fbeaea;
}

.input-text.valid {
  border: 1px solid #2ecc71;
  background-color: #eafaf1;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
}

.submit-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
