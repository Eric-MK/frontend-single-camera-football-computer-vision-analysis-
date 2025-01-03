// Registration Component
<template>
  <div class="auth-container">
    <form @submit.prevent="submitRegistration" class="form-container">
      <h2>Register</h2>
      <div class="form-group">
        <label for="name">Name:</label>
        <input
          id="name"
          type="text"
          v-model="name"
          :class="{ invalid: errors.name }"
          class="input-text"
        />
        <span v-if="errors.name" class="error-message">Name is required.</span>
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          type="email"
          v-model="email"
          :class="{ invalid: errors.email }"
          class="input-text"
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
        />
        <span v-if="errors.password" class="error-message">Password is required.</span>
      </div>

      <div class="form-group">
        <label for="confirm-password">Confirm Password:</label>
        <input
          id="confirm-password"
          type="password"
          v-model="confirmPassword"
          :class="{ invalid: errors.confirmPassword }"
          class="input-text"
        />
        <span v-if="errors.confirmPassword" class="error-message">Passwords do not match.</span>
      </div>

      <button type="submit" class="submit-btn">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
      },
    };
  },
  methods: {
    validateRegistrationForm() {
      this.errors.name = !this.name;
      this.errors.email = !this.email.includes("@");
      this.errors.password = !this.password;
      this.errors.confirmPassword = this.password !== this.confirmPassword;
    },
    async submitRegistration() {
      this.validateRegistrationForm();
      if (Object.values(this.errors).includes(true)) {
        alert("Please correct the errors before submitting.");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/register", {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        alert("Registration successful!");
        // Redirect or handle success
      } catch (error) {
        alert("Registration failed.");
      }
    },
  },
};
</script>

<style scoped>
 
 .container {
  max-width: 800px;
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

.form-container h2 {
  text-align: center;
  margin-bottom: 20px;
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

.input-file,
.input-text {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-text.invalid {
  border: 1px solid #e74c3c;
  background-color: #fbeaea;
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
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #f3f3f3;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 15px;
}

.progress-bar-fill {
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
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

.output-container {
  margin-top: 30px;
  text-align: center;
}

.output-container h3 {
  margin-bottom: 15px;
  color: #333;
}

.success-message {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 10px;
  border: 1px solid #d6e9c6;
  border-radius: 5px;
  margin-bottom: 15px;
}

.output-video {
  border: 1px solid #ddd;
  border-radius: 5px;
}

.download-link {
  display: inline-block;
  margin-top: 10px;
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  transition: color 0.3s ease;
}

.download-link:hover {
  color: #0056b3;
}

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
</style>
