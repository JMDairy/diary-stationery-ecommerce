<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <p v-if="adminUserDisplayEmail">Welcome, {{ adminUserDisplayEmail }}!</p>
      <p v-else>Welcome, Admin!</p>
    </header>
    <nav class="dashboard-nav">
      <ul>
        <li>
          <RouterLink to="/store-management-portal/products" class="nav-button">Manage Products</RouterLink>
        </li>
        <li>
          <button @click="handleLogout" class="nav-button logout-button">Logout</button>
        </li>
      </ul>
    </nav>
    <div class="dashboard-content">
      <p>Select an option from the navigation to manage your store.</p>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();
const adminUserDisplayEmail = ref(null); // For displaying user's email

onMounted(() => {
  const storedUser = localStorage.getItem('adminUser');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.email) {
        adminUserDisplayEmail.value = parsedUser.email;
      }
    } catch (e) {
      console.error("Failed to parse adminUser from localStorage on dashboard:", e);
      // Optionally clear corrupted data and redirect
      // localStorage.removeItem('adminUser');
      // localStorage.removeItem('adminToken');
      // router.push('/store-management-portal/login');
    }
  }
  // The route guard in router/index.js should handle redirection if not authenticated
  // and token is missing. This component assumes authentication has passed.
});

const handleLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  // In a real app with global state (like Pinia), you'd dispatch a logout action here.
  router.push('/store-management-portal/login'); // Redirect to login page
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 960px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 35px;
  padding-bottom: 25px;
  border-bottom: 1px solid #dee2e6;
}

.dashboard-header h1 {
  color: #212529;
  font-size: 2.25em;
  font-weight: 600;
  margin-bottom: 8px;
}

.dashboard-header p {
  color: #495057;
  font-size: 1.1em;
}

.dashboard-nav ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-bottom: 35px;
}

.nav-button {
  text-decoration: none;
  color: white;
  background-color: #20c997; /* Professional Teal Accent */
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.2s ease;
  border: none;
  cursor: pointer;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.nav-button:hover {
  background-color: #1baa80; /* Darker Teal on hover */
  transform: translateY(-1px);
}

.logout-button {
  background-color: #6c757d; /* Muted gray for logout */
}
.logout-button:hover {
  background-color: #5a6268;
}

.dashboard-content {
  text-align: center;
  font-size: 1.15em;
  color: #495057;
  padding: 20px;
  background-color: #f8f9fa; /* Very light gray for content background */
  border-radius: 6px;
}
</style>
