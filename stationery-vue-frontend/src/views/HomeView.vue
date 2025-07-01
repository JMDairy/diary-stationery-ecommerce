<template>
  <div class="home-view">
    <section class="hero-section">
      <div class="hero-background-overlay"></div>
      <div class="hero-content container">
        <h1 class="hero-title">Craft Your Story, Organize Your Life</h1>
        <p class="hero-subtitle">
          Explore our curated collection of beautiful diaries, quality pens, and unique stationery essentials.
        </p>
        <RouterLink to="/products" class="hero-cta-button">Discover Now</RouterLink>
      </div>
    </section>

    <section class="highlights-section">
      <div class="container highlights-grid">
        <div class="highlight-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
          <h3>Curated Selection</h3>
          <p>Handpicked for quality and unique style.</p>
        </div>
        <div class="highlight-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 20 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          <h3>Fast Shipping</h3>
          <p>Get your stationery treasures quickly.</p>
        </div>
        <div class="highlight-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
          <h3>Inspire Creativity</h3>
          <p>Tools that spark your imagination.</p>
        </div>
      </div>
    </section>

    <section class="products-section">
      <div class="container">
        <h2 class="section-title">Featured Products</h2>
        <div v-if="loading" class="loading-message">Loading products...</div>
        <div v-if="error" class="error-message">
          <p>Error fetching products: {{ error }}</p>
        </div>
        <div v-if="!loading && !error && featuredProducts.length === 0" class="no-products-message">
          No featured products available at the moment.
        </div>
        <div v-if="!loading && !error && featuredProducts.length > 0" class="products-grid">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product._id"
            :product="product"
          />
        </div>
        <div class="view-all-container" v-if="!loading && !error && featuredProducts.length > 0">
          <RouterLink to="/products" class="view-all-button">View All Products</RouterLink>
        </div>
      </div>
    </section>

    <section class="categories-section">
      <div class="container">
        <h2 class="section-title">Shop by Diary Type</h2>
        <div class="category-grid">
          <RouterLink to="/category/personal-diaries" class="category-link-card">
            <span>Personal Diaries</span>
          </RouterLink>
          <RouterLink to="/category/planner-diaries" class="category-link-card">
            <span>Planner Diaries</span>
          </RouterLink>
          <RouterLink to="/category/themed-journaling-diaries" class="category-link-card">
            <span>Themed/Journaling</span>
          </RouterLink>
          <RouterLink to="/category/academic-diaries" class="category-link-card">
            <span>Academic Diaries</span>
          </RouterLink>
          <RouterLink to="/category/business-diaries" class="category-link-card">
            <span>Business Diaries</span>
          </RouterLink>
          <RouterLink to="/category/notebooks" class="category-link-card">
            <span>Notebooks</span>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import ProductCard from '../components/ProductCard.vue'; // Ensure this path is correct

const featuredProducts = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchFeaturedProducts = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.get('http://localhost:5000/api/products');
    featuredProducts.value = response.data.slice(0, 4); // Show first 4 as featured
  } catch (err) {
    console.error('Failed to fetch featured products:', err);
    error.value = err.response?.data?.message || err.message || 'Could not fetch products.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchFeaturedProducts();
});
</script>

<style scoped>
/* General Container for centering content */
.container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem; /* 16px */
  padding-right: 1rem; /* 16px */
}

/* Hero Section */
.hero-section {
  /* You can replace this URL with a high-quality, relevant image for your store */
  background-image: url('https://images.unsplash.com/photo-1516962084343-6addac61f713?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center 60%; /* Adjust vertical position if needed */
  color: white;
  padding: 6rem 1rem; /* More padding for impact */
  text-align: center;
  position: relative; /* For overlay and content positioning */
  min-height: 450px; /* Ensure hero has some height */
  display: flex; /* For centering content vertically */
  align-items: center;
  justify-content: center;
}

.hero-background-overlay { /* Optional: Add a semi-transparent overlay for better text contrast */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.35); /* Adjust darkness as needed */
  z-index: 1;
}

.hero-content {
  position: relative; /* To sit on top of the overlay */
  z-index: 2;
  /* Optional: Give the content block a slightly "floating" panel appearance */
  /* background-color: rgba(255, 255, 255, 0.1); Backdrop filter can be nice but has browser support issues */
  /* backdrop-filter: blur(5px); */ /* If you want a frosted glass effect */
  /* padding: 2rem; */
  /* border-radius: 0.5rem; */
  /* box-shadow: 0 4px 15px rgba(0,0,0,0.2); */
}

.hero-title {
  font-size: 3rem; /* text-5xl */
  font-weight: 700; /* bold */
  margin-bottom: 1.5rem; /* mb-6 */
  line-height: 1.2;
  text-shadow: 2px 2px 6px rgba(0,0,0,0.5); /* Stronger text shadow for readability */
}
@media (min-width: 768px) { /* md */
  .hero-title {
    font-size: 4rem; /* text-6xl */
  }
}

.hero-subtitle {
  font-size: 1.25rem; /* text-xl */
  margin-bottom: 2.5rem; /* mb-10 */
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.95;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
}

.hero-cta-button {
  background-color: #ffffff;
  color: #4f46e5; /* Your primary accent color */
  padding: 0.875rem 2.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out, transform 0.2s ease, box-shadow 0.2s ease;
  display: inline-block;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.hero-cta-button:hover {
  background-color: #f0f2f5;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.2);
}

/* Highlights Section */
.highlights-section {
  padding: 4rem 0; /* Increased padding */
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}
.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2.5rem; /* Increased gap */
  text-align: center;
}
.highlight-item {
  padding: 1.5rem;
}
.highlight-item svg {
  color: #4f46e5; /* Accent color */
  margin: 0 auto 1rem auto;
  width: 40px; /* Slightly smaller icons */
  height: 40px;
  stroke-width: 1.5;
}
.highlight-item h3 {
  font-size: 1.2rem; /* Slightly smaller */
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
}
.highlight-item p {
  color: #4a5568; /* Slightly darker paragraph text */
  font-size: 0.9rem; /* Slightly smaller */
  line-height: 1.6;
}


/* Products & Categories Section Common Title */
.section-title {
  font-size: 2.25rem; /* text-3xl or 4xl */
  font-weight: 700;
  text-align: center;
  color: #1a202c;
  margin-bottom: 3rem;
  padding-bottom: 0.75rem; /* Increased padding */
  position: relative;
  display: inline-block; /* For centering the pseudo-element */
  left: 50%;
  transform: translateX(-50%);
}
.section-title::after { /* Subtle underline accent */
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 70px; /* Width of the underline */
  height: 3px;
  background-color: #4f46e5; /* Accent color */
  border-radius: 2px;
}

.products-section {
  padding: 4rem 0;
  background-color: #f8f9fa;
}

.loading-message, .no-products-message { text-align: center; font-size: 1.1em; color: #718096; padding: 20px; }
.error-message { text-align: center; color: #c53030; background-color: #fed7d7; border: 1px solid #fca5a5; padding: 1rem; border-radius: 0.375rem; margin: 1rem auto; max-width: 600px; }

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
}

.view-all-container { text-align: center; margin-top: 3rem; }
.view-all-button {
  display: inline-block; padding: 0.75rem 2rem; background-color: #343a40; color: white;
  text-decoration: none; border-radius: 0.375rem; font-weight: 500;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.view-all-button:hover { background-color: #23272b; transform: translateY(-1px); }

.categories-section {
  padding: 4rem 0;
  background-color: #ffffff;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* Smaller minmax for more cards */
  gap: 1.5rem;
}
.category-link-card {
  background-color: #ffffff;
  color: #495057;
  padding: 2rem 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 1.05rem; /* Slightly smaller */
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid #dee2e6;
  box-shadow: 0 3px 6px rgba(0,0,0,0.04); /* Softer shadow */
}
.category-link-card:hover {
  background-color: #4f46e5; /* Accent color */
  color: white;
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 8px 15px rgba(79, 70, 229, 0.2); /* Accent shadow */
}
.category-link-card span { display: block; }
</style>
