<template>
  <div id="app-layout">
    <header class="app-header-main">
      <div class="header-content-wrapper">
        <RouterLink to="/" class="logo">
          <img src="D:\logo.png" alt="J M Dairy Logo" class="logo-img" /> <span>J M Dairy</span>
        </RouterLink>
        <nav class="main-nav desktop-nav">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/products">Products</RouterLink>
          <RouterLink to="/about">About Us</RouterLink>
          <RouterLink to="/contact">Contact Us</RouterLink>
          <template v-if="isLoggedInAdmin">
            <RouterLink to="/store-management-portal/dashboard" class="admin-link">Dashboard</RouterLink>
            <button @click="handleAdminLogout" class="logout-button-app">Logout</button>
          </template>
          <template v-else>
            <RouterLink to="/store-management-portal/login" class="admin-link">Admin Login</RouterLink>
          </template>
        </nav>
        <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu" :aria-expanded="isMobileMenuOpen.toString()">
          <span class="hamburger-icon" :class="{'is-open': isMobileMenuOpen}"></span>
        </button>
      </div>
      <nav class="mobile-nav" :class="{ 'is-open': isMobileMenuOpen }">
          <RouterLink to="/" @click="closeMobileMenu">Home</RouterLink>
          <RouterLink to="/products" @click="closeMobileMenu">Products</RouterLink>
          <RouterLink to="/about" @click="closeMobileMenu">About Us</RouterLink>
          <RouterLink to="/contact" @click="closeMobileMenu">Contact Us</RouterLink>
          <hr class="mobile-nav-divider" />
          <template v-if="isLoggedInAdmin">
            <RouterLink to="/store-management-portal/dashboard" class="admin-link" @click="closeMobileMenu">Dashboard</RouterLink>
            <button @click="handleAdminLogoutMobile" class="logout-button-app mobile-logout">Logout</button>
          </template>
          <template v-else>
            <RouterLink to="/store-management-portal/login" class="admin-link" @click="closeMobileMenu">Admin Login</RouterLink>
          </template>
      </nav>
    </header>

    <main class="app-main-content">
      <RouterView v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </main>

    <footer class="app-footer-main">
      <div class="footer-content container-global">
        <div class="footer-columns">
          <div class="footer-column">
            <h4>Quick Links</h4>
            <RouterLink to="/products">All Products</RouterLink>
            <RouterLink to="/about">About Us</RouterLink>
            <RouterLink to="/contact">Contact Us</RouterLink>
            <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
            <RouterLink to="/terms-of-service">Terms of Service</RouterLink>
          </div>
          <div class="footer-column">
            <h4>Categories</h4>
            <RouterLink to="/category/personal-diaries">Personal Diaries</RouterLink>
            <RouterLink to="/category/planner-diaries">Planner Diaries</RouterLink>
            <RouterLink to="/category/themed-journaling-diaries">Themed/Journaling</RouterLink>
            <RouterLink to="/category/academic-diaries">Academic Diaries</RouterLink>
            <RouterLink to="/category/business-diaries">Business Diaries</RouterLink>
          </div>
          <div class="footer-column">
            <h4>Connect With Us</h4>
            <div class="social-media-links">
              <a href="YOUR_FACEBOOK_URL" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-icon" title="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2.04c-5.5 0-10 4.49-10 10s4.5 10 10 10c5.51 0 10-4.49 10-10s-4.49-10-10-10zm3.5 10.46h-2.17v6.5h-2.66v-6.5H9V9.32h1.67V7.77c0-1.53.82-2.47 2.56-2.47.72 0 1.27.05 1.47.08v2.08h-1.4c-.73 0-.87.34-.87.86v1.04h2.26l-.29 2.14z"/></svg>
              </a>
              <a href="YOUR_INSTAGRAM_URL" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-icon" title="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
              </a>
              <a href="YOUR_TWITTER_URL" target="_blank" rel="noopener noreferrer" aria-label="Twitter" class="social-icon" title="Twitter/X">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.9-.53 1.59-1.37 1.92-2.38-.84.5-1.78.86-2.79 1.07A4.67 4.67 0 0 0 16.15 4c-2.38 0-4.31 1.93-4.31 4.31 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.5.76 2.82 1.92 3.6A4.62 4.62 0 0 1 2.22 10v.06c0 2.09 1.49 3.84 3.47 4.24-.32.09-.66.13-1.01.13-.28 0-.55-.03-.81-.08 0 .02.01.03.01.05.55 1.71 2.14 2.95 4.03 3-1.48 1.16-3.35 1.85-5.38 1.85-.35 0-.69-.02-1.03-.06C2.94 19.29 5.18 20 7.62 20c7.37 0 11.4-6.11 11.4-11.4v-.52c.78-.57 1.46-1.28 2-2.04z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <p class="copyright-text">&copy; {{ new Date().getFullYear() }} J M Dairy. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';

const isLoggedInAdmin = ref(false);
const isMobileMenuOpen = ref(false);
const router = useRouter();

const updateLoginStatus = () => {
  isLoggedInAdmin.value = !!localStorage.getItem('adminToken');
};

const handleAdminLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  updateLoginStatus();
  router.push('/store-management-portal/login');
};

const handleAdminLogoutMobile = () => {
  handleAdminLogout();
  closeMobileMenu();
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

onMounted(updateLoginStatus);
watch(() => router.currentRoute.value, (toRoute, fromRoute) => {
  updateLoginStatus();
  isMobileMenuOpen.value = false;
  if ((fromRoute && toRoute.path !== fromRoute.path) || !toRoute.hash) {
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 0);
  }
}, { immediate: true });
</script>

<style scoped>
/* Styles from vue_app_vue_full_nav artifact */
#app-layout { display: flex; flex-direction: column; min-height: 100vh; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #f9fafb; color: #374151; }
.app-header-main { background-color: #ffffff; padding: 0 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03); border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 1000; }
.header-content-wrapper { max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; height: 70px; }
.logo { font-size: 1.6em; font-weight: 700; color: #4f46e5; text-decoration: none; display: flex; align-items: center; }
.logo-img { height: 32px; margin-right: 0.6rem; }
.logo span { color: #1f2937; }
.main-nav { display: none; gap: 1.75rem; }
@media (min-width: 768px) { .main-nav { display: flex; align-items: center; } }
.main-nav a { font-weight: 500; color: #4b5563; text-decoration: none; padding: 0.25rem 0; transition: color 0.2s ease-in-out, border-bottom-color 0.2s ease-in-out; border-bottom: 2px solid transparent; position: relative; }
.main-nav a:hover { color: #4f46e5; }
.main-nav a.router-link-exact-active { color: #4f46e5; border-bottom-color: #4f46e5; font-weight: 600; }
.logout-button-app { padding: 0.4rem 0.9rem; background-color: transparent; color: #ef4444; border: 1px solid #ef4444; border-radius: 0.375rem; cursor: pointer; font-weight: 500; transition: background-color 0.2s ease, color 0.2s ease; margin-left: 0.75rem; }
.logout-button-app:hover { background-color: #ef4444; color: white; }
.mobile-menu-toggle { display: block; background: none; border: none; cursor: pointer; padding: 0.5rem; z-index: 1010; }
@media (min-width: 768px) { .mobile-menu-toggle { display: none; } }
.hamburger-icon { display: block; width: 24px; height: 2px; background-color: #374151; position: relative; transition: all 0.3s ease-in-out; }
.hamburger-icon::before, .hamburger-icon::after { content: ''; position: absolute; left: 0; width: 24px; height: 2px; background-color: #374151; transition: all 0.3s ease-in-out; }
.hamburger-icon::before { top: -7px; }
.hamburger-icon::after { bottom: -7px; }
.hamburger-icon.is-open { background-color: transparent; }
.hamburger-icon.is-open::before { transform: rotate(45deg); top: 0; }
.hamburger-icon.is-open::after { transform: rotate(-45deg); bottom: 0; top:0; }
.mobile-nav { display: flex; flex-direction: column; background-color: #ffffff; position: absolute; top: 70px; left: 0; right: 0; padding: 0.5rem 0; box-shadow: 0 6px 12px rgba(0,0,0,0.1); border-top: 1px solid #e5e7eb; z-index: 999; transform: translateY(-120%); opacity: 0; visibility: hidden; transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), visibility 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
.mobile-nav.is-open { transform: translateY(0%); opacity: 1; visibility: visible; }
.mobile-nav a, .mobile-nav .mobile-logout { padding: 0.9rem 1.5rem; text-align: left; color: #374151; text-decoration: none; border-bottom: 1px solid #f3f4f6; width: 100%; box-sizing: border-box; display: block; }
.mobile-nav a:last-of-type, .mobile-nav .mobile-logout:last-of-type { border-bottom: none; }
.mobile-nav a:hover { background-color: #e9ecef; color: #4f46e5; }
.mobile-nav .mobile-logout { background-color: transparent; border: none; color: #ef4444; font-weight: 500; cursor: pointer; }
.mobile-nav .mobile-logout:hover { background-color: #fee2e2; }
.mobile-nav-divider { border: none; border-top: 1px solid #e5e7eb; margin: 0.5rem 0; }
.app-main-content { flex-grow: 1; padding-top: 2.5rem; padding-bottom: 2.5rem; width: 100%; }
.app-footer-main { background-color: #1f2937; color: #9ca3af; text-align: center; padding: 3rem 1rem; font-size: 0.875em; }
/* .footer-content uses .container-global for max-width and padding if needed */
.footer-links { margin-bottom: 1.5rem; display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
.footer-links a { color: #d1d5db; text-decoration: none; font-size: 0.9rem;}
.footer-links a:hover { color: #ffffff; text-decoration: underline; }
.social-media-links { margin-bottom: 1.5rem; display: flex; justify-content: center; gap: 1.25rem; }
.social-media-links a.social-icon { color: #9ca3af; transition: color 0.2s ease-in-out; border-bottom: none; padding: 0; }
.social-media-links a.social-icon:hover { color: #ffffff; border-bottom: none; }
.social-icon svg { width: 24px; height: 24px; }
.copyright-text { font-size: 0.8rem; color: #6b7280; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
