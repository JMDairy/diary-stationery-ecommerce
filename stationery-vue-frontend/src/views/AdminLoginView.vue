<template>
  <div class="admin-login-view">
    <div class="login-form-container">
      <h2>Admin Login</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required autocomplete="current-password" />
        </div>
        <button type="submit" :disabled="isLoading" class="submit-button">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Import useRouter for navigation

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const router = useRouter(); // Initialize router

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = ''; // Clear previous errors

  try {
    // Make sure your backend server is running and accessible on port 5000
    const response = await axios.post('http://localhost:5000/api/admin/login', {
      email: email.value,
      password: password.value,
    });

    if (response.data && response.data.token) {
      // Store the token and user info in localStorage
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.admin)); // Store admin user details

      // Optionally, you might want to set up a global state/store (e.g., Pinia) here
      // For now, we'll just redirect

      // Redirect to an admin dashboard page (we'll create this route/view later)
      router.push('/admin/dashboard'); // Example redirect
      // Or, if you have a specific home page for admin after login:
      // router.push({ name: 'AdminDashboard' }); // Assuming you have a named route

    } else {
      // Handle cases where token might be missing in a successful response (unlikely for this API)
      errorMessage.value = 'Login successful, but no token received. Please contact support.';
    }
  } catch (err) {
    console.error('Admin login error:', err.response ? err.response.data : err.message);
    if (err.response && err.response.data && err.response.data.message) {
      errorMessage.value = err.response.data.message;
    } else if (err.request) {
      errorMessage.value = 'No response from server. Please check if the backend is running.';
    } else {
      errorMessage.value = 'Login failed. An unexpected error occurred.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.admin-login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; /* Adjust as needed, or use 100vh for full page */
  background-color: #f4f7f6; /* Light background for the page */
  padding: 20px;
}

.login-form-container {
  background-color: #ffffff;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px; /* Max width of the form */
  text-align: center;
}

.login-form-container h2 {
  margin-bottom: 25px;
  color: #333;
  font-size: 1.8em;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* Important for padding and border to not increase width */
  font-size: 1em;
}

.form-group input[type="email"]:focus,
.form-group input[type="password"]:focus {
  outline: none;
  border-color: #4f46e5; /* Indigo color on focus */
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.submit-button {
  background-color: #4f46e5; /* Indigo color */
  color: white;
  padding: 12px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #4338ca; /* Darker indigo */
}

.submit-button:disabled {
  background-color: #a5b4fc; /* Lighter indigo for disabled state */
  cursor: not-allowed;
}

.error-message {
  margin-top: 20px;
  color: #e74c3c; /* Red for errors */
  background-color: #fdeded;
  border: 1px solid #e74c3c;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
