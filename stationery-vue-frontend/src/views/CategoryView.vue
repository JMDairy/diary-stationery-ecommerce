<template>
  <div class="category-view">
    <div class="container-global page-padding">
      <h1 class="page-title">Shop: {{ categoryTitle }}</h1>
      <div v-if="loading" class="loading-message">Loading products for {{ categoryTitle }}...</div>
      <div v-if="error" class="error-message">
        <p>Error fetching products: {{ error }}</p>
        <RouterLink to="/products">View All Products</RouterLink>
      </div>
      <div v-if="!loading && !error && products.length === 0" class="no-products-message">
        No products found in the "{{ categoryTitle }}" category yet.
      </div>
      <div v-if="!loading && !error && products.length > 0" class="products-grid">
        <ProductCard
          v-for="product in products"
          :key="product._id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import axios from 'axios';
import ProductCard from '../components/ProductCard.vue'; // Ensure this path is correct

const route = useRoute();
const products = ref([]);
const loading = ref(true);
const error = ref(null);

// Get the category name from the route parameter
const categoryName = computed(() => route.params.categoryName);

// Create a more display-friendly title from the categoryName
const categoryTitle = computed(() => {
  if (!categoryName.value) return 'Category';
  // Replace dashes with spaces and capitalize words
  return categoryName.value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});

const fetchProductsByCategory = async (catName) => {
  if (!catName) return;
  try {
    loading.value = true;
    error.value = null;
    // The backend expects the category name as it's stored (e.g., "Personal Diaries")
    // The route param might be "personal-diaries". We'll use categoryTitle for the API call.
    const apiCategoryName = catName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    console.log(`Fetching products for category (API param): ${apiCategoryName}`);
    const response = await axios.get(`http://localhost:5000/api/products?category=${encodeURIComponent(apiCategoryName)}`);
    products.value = response.data;
  } catch (err) {
    console.error(`Failed to fetch products for category ${catName}:`, err);
    error.value = err.response?.data?.message || err.message || `Could not fetch products for ${categoryTitle.value}.`;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProductsByCategory(categoryName.value);
});

// Watch for changes in the route parameter (e.g., if navigating between category pages)
watch(categoryName, (newCatName) => {
  fetchProductsByCategory(newCatName);
});
</script>

<style scoped>
.category-view {
  width: 100%;
}
.page-padding {
  padding-top: 2rem;
  padding-bottom: 3rem;
}
.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #2d3748;
  margin-bottom: 2.5rem;
}
.loading-message, .no-products-message {
  text-align: center; font-size: 1.15em; color: #6c757d; padding: 30px 0; min-height: 200px;
  display: flex; align-items: center; justify-content: center;
}
.error-message {
  text-align: center; color: #c53030; background-color: #fed7d7; border: 1px solid #fca5a5;
  padding: 1.25rem; border-radius: 0.375rem; margin: 1.5rem auto; max-width: 700px;
}
.error-message a { display: block; margin-top: 10px; font-weight: bold; color: #007bff;}
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.75rem;
}
.container-global { /* From your global CSS */
  width: 100%;
  max-width: 1320px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
