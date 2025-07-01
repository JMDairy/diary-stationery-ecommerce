<template>
  <div class="products-view">
    <div class="container-global page-padding">
      <h1 class="page-title">Our Stationery Collection</h1>

      <div class="category-filter-section">
        <h3 class="filter-title">Filter by Category:</h3>
        <div class="category-buttons">
          <button
            @click="setSelectedCategory(null)"
            :class="{ 'active-category': selectedCategory === null }"
            class="category-button"
          >
            All Products
          </button>
          <button
            v-for="category in predefinedCategories"
            :key="category"
            @click="setSelectedCategory(category)"
            :class="{ 'active-category': selectedCategory === category }"
            class="category-button"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-message">Loading products...</div>
      <div v-if="error" class="error-message">
        <p>Error fetching products: {{ error }}</p>
      </div>
      <div v-if="!loading && !error && filteredProducts.length === 0" class="no-products-message">
        No products found for the selected criteria.
      </div>
      <div v-if="!loading && !error && filteredProducts.length > 0" class="products-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product._id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import ProductCard from '../components/ProductCard.vue'; // Ensure this path is correct

const allProducts = ref([]); // Stores all fetched products
const loading = ref(true);
const error = ref(null);
const selectedCategory = ref(null); // null means "All Products"

// Define your categories - should match those in AdminProductManagementView.vue for consistency
const predefinedCategories = ref([
  'Personal Diaries',
  'Planner Diaries',
  'Themed/Journaling Diaries',
  'Academic Diaries',
  'Business Diaries',
  'Notebooks',
  'Pens & Pencils',
  'Desk Accessories',
  'Other'
]);

const fetchAllProducts = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.get('http://localhost:5000/api/products');
    allProducts.value = response.data;
  } catch (err) {
    console.error('Failed to fetch all products:', err);
    error.value = err.response?.data?.message || err.message || 'Could not fetch products.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAllProducts();
});

// Computed property to filter products based on selectedCategory
const filteredProducts = computed(() => {
  if (!selectedCategory.value) {
    return allProducts.value; // Show all if no category is selected
  }
  return allProducts.value.filter(product => product.category === selectedCategory.value);
});

// Method to update the selected category
const setSelectedCategory = (category) => {
  selectedCategory.value = category;
};
</script>

<style scoped>
.products-view {
  width: 100%;
  /* Background inherited from #app-layout or body */
}

.page-padding {
  padding-top: 2rem;
  padding-bottom: 3rem; /* More space at the bottom */
}

.page-title {
  font-size: 2.5rem; /* Larger title */
  font-weight: 700;
  text-align: center;
  color: #2d3748; /* Darker Gray */
  margin-bottom: 2.5rem;
}

/* Category Filter Styles */
.category-filter-section {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background-color: #ffffff; /* White background for filter section */
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.filter-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 1rem;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
  gap: 0.75rem; /* Space between buttons */
}

.category-button {
  padding: 0.6rem 1.2rem;
  border: 1px solid #ced4da; /* Light gray border */
  background-color: #f8f9fa; /* Very light gray */
  color: #495057; /* Medium gray text */
  border-radius: 20px; /* Pill shape */
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.category-button:hover {
  background-color: #e9ecef; /* Slightly darker on hover */
  border-color: #adb5bd;
}

.category-button.active-category {
  background-color: #007bff; /* Primary accent color (e.g., blue) */
  color: white;
  border-color: #007bff;
  font-weight: 600;
}


.loading-message, .no-products-message {
  text-align: center;
  font-size: 1.15em;
  color: #6c757d; /* Medium Gray */
  padding: 30px 0;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.error-message {
  text-align: center;
  color: #c53030;
  background-color: #fed7d7;
  border: 1px solid #fca5a5;
  padding: 1.25rem;
  border-radius: 0.375rem;
  margin: 1.5rem auto;
  max-width: 700px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.75rem; /* Slightly increased gap */
}

@media (min-width: 576px) { /* Small devices (sm) */
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 768px) { /* Medium devices (md) */
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 1200px) { /* Large devices (lg) and wider */
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Global container class from main.css if you use it */
.container-global {
  width: 100%;
  max-width: 1320px; /* Or your preferred max width */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
