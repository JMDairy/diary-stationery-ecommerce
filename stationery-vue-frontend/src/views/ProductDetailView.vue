<template>
  <div class="product-detail-view container-global">
    <div v-if="isLoading" class="loading-message">Loading product details...</div>
    <div v-if="error" class="error-message">
      <p>Error loading product: {{ error }}</p>
      <RouterLink to="/products">Back to Products</RouterLink>
    </div>
    <div v-if="product && !isLoading && !error" class="product-layout">
      <div class="product-image-gallery">
        <img :src="getProductImageUrl(product, true)" :alt="product.name" class="main-product-image" @error="handleMainImageError" />
        </div>
      <div class="product-information">
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-category-detail">Category: {{ product.category || 'N/A' }}</p>
        <p class="product-sku">SKU: {{ product.sku || 'N/A' }}</p>
        <p class="product-price-detail">${{ formatPrice(product.price) }}</p>
        
        <div class="product-description">
          <h3>Description</h3>
          <p>{{ product.description || 'No description available.' }}</p>
        </div>

        <div class="product-actions">
          <div class="quantity-selector">
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" v-model.number="selectedQuantity" min="1" :max="product.quantity > 0 ? product.quantity : 1" />
            <span v-if="product.quantity > 0" class="stock-info"> ({{ product.quantity }} in stock)</span>
            <span v-else class="stock-info out-of-stock">Out of stock</span>
          </div>
          <button 
            @click="handleAddToCart(product)" 
            class="add-to-cart-button-detail"
            :disabled="product.quantity === 0 || selectedQuantity <= 0 || selectedQuantity > product.quantity"
          >
            Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
    <div v-if="!product && !isLoading && !error" class="no-product-found">
        <p>Product not found.</p>
        <RouterLink to="/products">Back to Products</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router'; // useRoute to get route params
import axios from 'axios';

// **IMPORTANT**: Replace with your actual WhatsApp Business number
const WHATSAPP_BUSINESS_NUMBER = '910000000000'; // Example: Indian number

const route = useRoute(); // Access route information
const product = ref(null);
const isLoading = ref(true);
const error = ref('');
const selectedQuantity = ref(1);

const productId = computed(() => route.params.id); // Get product ID from route params

const fetchProductDetails = async () => {
  if (!productId.value) {
    error.value = "Product ID is missing.";
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  error.value = '';
  try {
    const response = await axios.get(`http://localhost:5000/api/products/${productId.value}`);
    product.value = response.data;
    if (product.value && product.value.quantity === 0) {
      selectedQuantity.value = 0; 
    } else if (product.value && product.value.quantity > 0) {
      selectedQuantity.value = 1; 
    }
  } catch (err) {
    console.error('Failed to fetch product details:', err);
    error.value = err.response?.data?.message || err.message || 'Could not load product details.';
    product.value = null; 
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProductDetails();
});

// Watch for changes in the route parameter (e.g., if navigating between product pages directly)
watch(productId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchProductDetails();
  }
});

const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2) : 'N/A';
};

// Inside getProductImageUrl function
const getProductImageUrl = (prod, isMainImage = false) => {
  const size = isMainImage ? '800x600' : '400x300';
  const placeholderBase = `https://placehold.co/${size}/e0e7ff/3730a3?text=`;
  if (prod && prod.imageUrls && prod.imageUrls.length > 0 && prod.imageUrls[0]) {
    const imgUrl = prod.imageUrls[0];
    return imgUrl.startsWith('/uploads/') ? `http://localhost:5000${imgUrl}` : imgUrl;
  }
  return `${placeholderBase}${encodeURIComponent(prod ? prod.name || 'Product' : 'Product')}`;
};
  // Fallback if using Cloudinary and 'images' array (adapt if necessary)
  // if (prod && prod.images && prod.images.length > 0 && prod.images[0].url) {
  //   return prod.images[0].url;
  // }

const handleMainImageError = (event) => {
  event.target.onerror = null;
  event.target.src = `https://placehold.co/800x600/E2E8F0/A0AEC0?text=No+Image`;
};

const handleAddToCart = (prod) => {
  if (!prod || !prod.name) {
    console.error("Product data is missing for WhatsApp redirect.");
    alert("Sorry, product information is currently unavailable.");
    return;
  }
  if (selectedQuantity.value <= 0) {
    alert("Please select a valid quantity.");
    return;
  }

  const productName = prod.name;
  const productPrice = formatPrice(prod.price);
  const message = `Hi! I'm interested in ordering ${selectedQuantity.value} of the product: ${productName} (Price: $${productPrice} each). Please provide more details.`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodedMessage}`;
  
  console.log('Redirecting to WhatsApp:', whatsappUrl);
  window.open(whatsappUrl, '_blank'); 
};

</script>

<style scoped>
.product-detail-view {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.loading-message, .no-product-found p {
  text-align: center;
  font-size: 1.2em;
  color: #666;
  padding: 40px 0;
}
.no-product-found a {
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #007bff;
  font-weight: 500;
}

.error-message {
  text-align: center;
  color: #c53030; /* Darker Red */
  background-color: #fed7d7; /* Lighter Red background */
  border: 1px solid #fca5a5; /* Red border */
  padding: 1.25rem;
  border-radius: 0.375rem;
  margin: 1.5rem auto;
  max-width: 700px;
}
.error-message a {
    display: block;
    margin-top: 10px;
    font-weight: bold;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr; /* Single column on small screens */
  gap: 2rem; /* Spacing between image and info */
  max-width: 1100px; /* Max width of the product detail content */
  margin: 0 auto;
}

@media (min-width: 768px) { /* md breakpoint */
  .product-layout {
    grid-template-columns: 1fr 1.25fr; /* Two columns: image | info */
  }
}

.product-image-gallery {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.main-product-image {
  max-width: 100%;
  height: auto;
  max-height: 500px; /* Limit image height */
  border-radius: 8px;
  object-fit: contain;
  border: 1px solid #e2e8f0;
  background-color: #f8f9fa;
}

.product-information {
  padding: 1rem 0; 
}
@media (min-width: 768px) {
  .product-information {
    padding: 0 1rem; 
  }
}


.product-title {
  font-size: 2.25rem; 
  font-weight: 700;
  color: #2d3748; 
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.product-category-detail, .product-sku {
  font-size: 0.95rem;
  color: #718096; 
  margin-bottom: 0.5rem;
}

.product-price-detail {
  font-size: 1.75rem; 
  font-weight: bold;
  color: #007bff; 
  margin-bottom: 1.5rem;
}

.product-description {
  margin-bottom: 1.5rem;
}
.product-description h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #e9ecef;
}
.product-description p {
  font-size: 1rem;
  line-height: 1.7;
  color: #495057;
}

.product-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
@media (min-width: 576px) { 
    .product-actions {
        flex-direction: row;
        align-items: center;
    }
}


.quantity-selector {
  display: flex;
  align-items: center;
  margin-bottom: 1rem; 
}
@media (min-width: 576px) {
    .quantity-selector {
        margin-bottom: 0;
        margin-right: 1rem;
    }
}

.quantity-selector label {
  margin-right: 0.75rem;
  font-weight: 500;
  color: #495057;
}

.quantity-selector input[type="number"] {
  width: 70px; 
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 1rem;
}
.stock-info {
    font-size: 0.85rem;
    color: #6c757d;
    margin-left: 0.5rem;
}
.stock-info.out-of-stock {
    color: #dc3545;
    font-weight: bold;
}


.add-to-cart-button-detail {
  background-color: #25D366; /* WhatsApp Green */
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1.05rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
  text-align: center;
}

.add-to-cart-button-detail:hover:not(:disabled) {
  background-color: #1DA851; /* Darker WhatsApp Green */
}
.add-to-cart-button-detail:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

/* Global container class from main.css if you use it */
.container-global {
  width: 100%;
  max-width: 1280px; /* Or your preferred max width */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
