<template>
  <div class="product-card">
    <RouterLink :to="`/product/${product._id}`" class="product-link">
      <div class="image-container">
        <img :src="getProductImageUrl(product)" :alt="product.name || 'Product Image'" class="product-image" @error="handleImageError" />
      </div>
      <div class="product-info">
        <h3 class="product-name" :title="product.name">{{ product.name || 'Unnamed Product' }}</h3>
        <p class="product-category">{{ product.category || 'Uncategorized' }}</p>
        <p class="product-price">${{ formatPrice(product.price) }}</p>
      </div>
    </RouterLink>
    <button @click="addToCart(product)" class="add-to-cart-button">Add to Cart</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';

// Define props that this component accepts
defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({ name: 'Loading...', price: 0, images: [], category: '' }) // Default for when data might be loading
  }
});

// Helper function to get product image URL or a placeholder
// Inside getProductImageUrl function
const getProductImageUrl = (productInstance) => {
  const placeholderBase = 'https://placehold.co/400x300/e0e7ff/3730a3?text=';
  if (productInstance && productInstance.imageUrls && productInstance.imageUrls.length > 0 && productInstance.imageUrls[0]) {
    const imgUrl = productInstance.imageUrls[0];
    // Check if it's a local path or an external URL
    return imgUrl.startsWith('/uploads/') ? `http://localhost:5000${imgUrl}` : imgUrl;
  }
  return `${placeholderBase}${encodeURIComponent(productInstance.name || 'Stationery')}`;
};

// Handle image loading errors by replacing with a generic placeholder
const handleImageError = (event) => {
  event.target.onerror = null; // Prevent infinite loop if placeholder also fails
  event.target.src = 'https://placehold.co/400x300/E2E8F0/A0AEC0?text=No+Image';
};

// Helper function to format price
const formatPrice = (price) => {
  if (typeof price === 'number') {
    return price.toFixed(2);
  }
  return 'N/A';
};

// Placeholder for addToCart functionality
const addToCart = (product) => {
  console.log('Adding to cart:', product.name);
  alert(`"${product.name}" added to cart (placeholder action).`);
  // Later, this would interact with a cart state/store
};
</script>

<style scoped>
.product-card {
  border: 1px solid #e5e7eb; /* gray-200 */
  border-radius: 0.5rem; /* rounded-lg */
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow-md */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease-in-out;
}

.product-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Allows info to push button down */
}

.image-container {
  width: 100%;
  padding-top: 75%; /* Aspect ratio 4:3 (300/400) - adjust as needed */
  position: relative;
  background-color: #f3f4f6; /* gray-100 for placeholder bg */
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the area, might crop */
}

.product-info {
  padding: 1rem; /* p-4 */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1.125rem; /* text-lg */
  font-weight: 600; /* font-semibold */
  color: #1f2937; /* gray-800 */
  margin-bottom: 0.25rem; /* mb-1 */
  /* For truncating long names: */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-category {
  font-size: 0.875rem; /* text-sm */
  color: #6b7280; /* gray-500 */
  margin-bottom: 0.5rem; /* mb-2 */
}

.product-price {
  font-size: 1.25rem; /* text-xl */
  font-weight: bold;
  color: #4f46e5; /* indigo-600 */
  margin-top: auto; /* Pushes price to bottom if other content is short */
  margin-bottom: 0.75rem; /* mb-3 */
}

.add-to-cart-button {
  background-color: #4f46e5; /* indigo-600 */
  color: white;
  padding: 0.625rem 1rem; /* py-2.5 px-4 */
  border-radius: 0.375rem; /* rounded-md */
  border: none;
  cursor: pointer;
  font-weight: 500; /* font-medium */
  text-align: center;
  transition: background-color 0.2s ease-in-out;
  margin: 1rem; /* Add margin to separate from card edge */
  margin-top: 0; /* No top margin as price pushes it down */
}

.add-to-cart-button:hover {
  background-color: #4338ca; /* indigo-700 */
}
</style>
