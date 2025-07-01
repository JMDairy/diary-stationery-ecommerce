// stationery-vue-frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Eagerly load core views
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CategoryView from '../views/CategoryView.vue'

// Admin specific views
import AdminLoginView from '../views/AdminLoginView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminProductManagementView from '../views/AdminProductManagementView.vue'

// Lazy load less critical views
const AboutView = () => import('../views/AboutView.vue');
const ContactView = () => import('../views/ContactView.vue');

// Placeholder components for Privacy Policy and Terms of Service
const PrivacyPolicyView = { template: '<div class="container-global" style="padding: 2rem 1rem; text-align:center; min-height: 60vh;"><h1>Privacy Policy</h1><p>Our detailed privacy policy will be available here soon. We are committed to protecting your data.</p><router-link to="/" style="display:inline-block; margin-top:1rem; color:#007bff; font-weight:bold;">Go Back Home</router-link></div>' };
const TermsOfServiceView = { template: '<div class="container-global" style="padding: 2rem 1rem; text-align:center; min-height: 60vh;"><h1>Terms of Service</h1><p>Our terms of service will be available here soon. Please read them carefully before using our services.</p><router-link to="/" style="display:inline-block; margin-top:1rem; color:#007bff; font-weight:bold;">Go Back Home</router-link></div>' };

const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

const adminBasePath = '/store-management-portal';

const routes = [
  // Public Customer-Facing Routes
  { path: '/', name: 'home', component: HomeView },
  { path: '/products', name: 'Products', component: ProductsView },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetailView, props: true },
  { path: '/category/:categoryName', name: 'CategoryView', component: CategoryView, props: true },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/contact', name: 'ContactUs', component: ContactView },
  { path: '/privacy-policy', name: 'PrivacyPolicy', component: PrivacyPolicyView },
  { path: '/terms-of-service', name: 'TermsOfService', component: TermsOfServiceView },

  // Admin Login Route
  {
    path: `${adminBasePath}/login`,
    name: 'AdminLogin',
    component: AdminLoginView,
    beforeEnter: (to, from, next) => {
      if (isAdminAuthenticated()) {
        next({ name: 'AdminDashboard' });
      } else {
        next();
      }
    }
  },
  // Admin Protected Routes
  { path: `${adminBasePath}/dashboard`, name: 'AdminDashboard', component: AdminDashboardView, meta: { requiresAdminAuth: true } },
  { path: `${adminBasePath}/products`, name: 'AdminProducts', component: AdminProductManagementView, meta: { requiresAdminAuth: true } }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) { return { el: to.hash, behavior: 'smooth' }; }
    else if (savedPosition) { return savedPosition; }
    else { return { top: 0, behavior: 'smooth' }; }
  }
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAdminAuth);
  const authenticated = isAdminAuthenticated();
  if (requiresAuth && !authenticated) {
    next({ name: 'AdminLogin', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
