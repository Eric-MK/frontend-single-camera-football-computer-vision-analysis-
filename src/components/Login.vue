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

    <!-- Modal for invalid login -->
    <div v-if="showErrorModal" class="modal-overlay">
      <div class="modal">
        <p>Invalid email or password. Would you like to try again or go to the registration page?</p>
        <button @click="retryLogin">Try Again</button>
        <button @click="goToRegister">Go to Registration</button>
      </div>
    </div>

    <!-- Modal for successful login -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal">
        <p>Login successful! Redirecting to the homepage...</p>
        <button @click="closeSuccessModal">Okay</button>
      </div>
    </div>
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
      showErrorModal: false, // To show modal when login fails
      showSuccessModal: false, // To show modal for successful login
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

        // Save user_id in localStorage
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("user_name", response.data.user_name); // Save user name

        // Show success modal
        this.showSuccessModal = true;

        // Navigate to homepage after a short delay
        setTimeout(() => {
          this.$router.push("/home");
        }, 2000);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Show modal when login fails
          this.showErrorModal = true;
        } else {
          alert("An error occurred. Please try again.");
        }
      } finally {
        this.loading = false; // Reset loading state
      }
    },

    retryLogin() {
      this.clearForm();
      this.showErrorModal = false; // Hide error modal
    },

    goToRegister() {
      this.clearForm();
      this.showErrorModal = false; // Hide error modal
      this.$router.push("/register"); // Redirect to registration page
    },

    closeSuccessModal() {
      this.showSuccessModal = false; // Hide success modal
      this.$router.push("/home"); // Redirect to homepage
    },

    clearForm() {
      this.email = "";
      this.password = "";
      this.errors = { email: false, password: false };
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

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* Slightly darker overlay for focus */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px; /* Increased padding for better spacing */
  border-radius: 8px; /* Slightly rounded corners */
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
  animation: fadeIn 0.3s ease-out; /* Smooth entrance animation */
}

.modal p {
  font-size: 16px;
  color: #333; /* Neutral text color */
  margin-bottom: 20px;
}

.modal button {
  margin: 5px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease; /* Add interaction feedback */
}

.modal button:hover {
  background-color: #0056b3; /* Slightly darker blue on hover */
  transform: scale(1.05); /* Subtle scaling effect */
}

.modal button:active {
  transform: scale(1); /* Reset scaling when button is clicked */
}

/* Cancel button styling (if different from primary) */
.modal button:last-child {
  background-color: #6c757d; /* Gray background for secondary action */
}

.modal button:last-child:hover {
  background-color: #5a6268; /* Slightly darker gray on hover */
}

/* Smooth fade-in animation for the modal */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

button {
  margin: 5px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
