<template>
  <div class="product-card">
    <RouterLink :to="`/product/${props.product._id}`" class="product-link">
      <div class="image-container">
        <img
          :src="getProductImageUrl(props.product)"
          :alt="props.product.name || 'Product Image'"
          class="product-image"
          @error="handleImageError"
        />
      </div>
      <div class="product-info">
        <p class="product-category">{{ props.product.category || 'Uncategorized' }}</p>
        <h3 class="product-name" :title="props.product.name">{{ props.product.name || 'Unnamed Product' }}</h3>
        <p class="product-price">${{ formatPrice(props.product.price) }}</p>
      </div>
    </RouterLink>
    <button @click="handleAddToCartWithWhatsApp(props.product)" class="add-to-cart-button">
      Order on WhatsApp
    </button>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

const WHATSAPP_BUSINESS_NUMBER = '910000000000'; // REPLACE WITH YOUR ACTUAL NUMBER

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      _id: 'temp_id',
      name: 'Loading...',
      price: 0,
      imageUrls: [],
      category: 'N/A'
    })
  }
});

const getProductImageUrl = (productInstance) => {
  const placeholderBase = 'https://placehold.co/400x300/e0e7ff/3730a3?text=';
  if (productInstance && productInstance.imageUrls && productInstance.imageUrls.length > 0 && productInstance.imageUrls[0]) {
    const imageUrl = productInstance.imageUrls[0];
    // Check if it's a local path (starts with /uploads/) or a full external URL
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:5000${imageUrl}`; // Prepend backend URL for local images
    }
    return imageUrl; // Assume it's a full external URL (e.g., Google Drive direct link)
  }
  return `${placeholderBase}${encodeURIComponent(productInstance.name || 'Stationery')}`;
};

const handleImageError = (event) => {
  event.target.onerror = null;
  event.target.src = 'https://placehold.co/400x300/e0e7ff/3730a3?text=No+Image';
};

const formatPrice = (price) => {
  if (typeof price === 'number') { return price.toFixed(2); } return 'N/A';
};

const handleAddToCartWithWhatsApp = (productInstance) => {
  if (!productInstance || !productInstance.name) { console.error("Product data missing"); alert("Product info unavailable."); return; }
  const message = `Hi! I'm interested in ordering: ${productInstance.name} (Price: $${formatPrice(productInstance.price)}).`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};
</script>

<style scoped>
/* ... (Keep existing styles from vue_product_card_component_recheck) ... */
.product-card { background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03); overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s ease, box-shadow 0.3s ease; border: 1px solid #e5e7eb; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -2px rgba(0,0,0,0.04); }
.product-link { text-decoration: none; color: inherit; display: flex; flex-direction: column; flex-grow: 1; }
.image-container { width: 100%; padding-top: 100%; position: relative; background-color: #f3f4f6; overflow: hidden; }
.product-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.product-card:hover .product-image { transform: scale(1.05); }
.product-info { padding: 1rem; flex-grow: 1; display: flex; flex-direction: column; text-align: left; }
.product-category { font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em; }
.product-name { 
  font-size: 1rem; 
  font-weight: 600; 
  color: #1f2937; 
  margin-bottom: 0.5rem; 
  line-height: 1.4; 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  line-clamp: 2;
  -webkit-box-orient: vertical; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  min-height: 2.8em; 
}
.product-price { font-size: 1.125rem; font-weight: 700; color: #374151; margin-top: auto; margin-bottom: 0.75rem; }
.add-to-cart-button { background-color: #25D366; color: white; padding: 0.625rem 1rem; border-radius: 0.375rem; border: none; cursor: pointer; font-weight: 500; text-align: center; margin: 0 1rem 1rem 1rem; opacity: 0; transform: translateY(10px); transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease-in-out; }
.product-card:hover .add-to-cart-button { opacity: 1; transform: translateY(0); }
.add-to-cart-button:hover { background-color: #1DA851; }
</style>
