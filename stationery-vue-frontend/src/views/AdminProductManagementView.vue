<template>
  <div class="product-management-view">
    <header class="page-header">
      <h1>Manage Your Products</h1>
      <button
        @click="toggleAddEditForm(null)"
        class="action-btn primary-action-btn add-product-btn"
        :class="{ 'cancel-btn-style': showAddEditForm && !editingProduct }">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        {{ (showAddEditForm && !editingProduct) ? 'Cancel Adding' : 'Add New Product' }}
      </button>
    </header>

    <div v-if="showAddEditForm || editingProduct" class="form-container">
      <h3>{{ editingProduct ? `Edit: ${formState.name}` : 'Add New Product' }}</h3>
      <form @submit.prevent="handleSubmitForm" class="product-form" enctype="multipart/form-data">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model.trim="formState.name" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" v-model.trim="formState.description"></textarea>
        </div>
        <div class="form-group form-row">
          <div>
            <label for="price">Price ($):</label>
            <input type="number" id="price" v-model.number="formState.price" required min="0" step="0.01" />
          </div>
          <div>
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" v-model.number="formState.quantity" required min="0" step="1" />
          </div>
        </div>
        <div class="form-group form-row">
          <div>
            <label for="category">Category:</label>
            <select id="category" v-model="formState.category" class="category-select" required>
              <option value="" disabled>-- Select a Category --</option>
              <option v-for="cat in predefinedCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div>
            <label for="sku">SKU (Stock Keeping Unit):</label>
            <input type="text" id="sku" v-model.trim="formState.sku" />
          </div>
        </div>

        <div class="form-group">
          <label>Product Image:</label>
          <div class="image-option">
            <label for="productImageFile">Option 1: Upload new image from your system:</label>
            <input type="file" id="productImageFile" @change="handleImageFileChange" accept="image/png, image/jpeg, image/gif" class="file-input"/>
          </div>
          <div class="image-option-divider">OR</div>
          <div class="image-option">
            <label for="externalImageUrl">Option 2: Use an external image link (e.g., Google Drive):</label>
            <input
              type="url"
              id="externalImageUrl"
              v-model.trim="formState.externalImageUrl"
              placeholder="Paste direct public image link here"
              class="image-url-input"
            />
          </div>
          <small class="input-hint">If you upload a file, it will be prioritized. Ensure external links are direct and publicly viewable.</small>

          <div v-if="imagePreviewUrl" class="image-preview-container">
            <p>New image (file) preview:</p>
            <img :src="imagePreviewUrl" alt="New image preview" class="image-preview" />
          </div>
          <div v-else-if="formState.externalImageUrl && !imagePreviewError" class="image-preview-container">
            <p>Image preview (from link):</p>
            <img :src="formState.externalImageUrl.split(',')[0].trim()" alt="Image preview from link" class="image-preview" @error="imagePreviewError = true" />
          </div>
          <div v-else-if="editingProduct && formState.currentImageUrl" class="image-preview-container">
            <p>Current image:</p>
            <img :src="formState.currentImageUrl.startsWith('http') ? formState.currentImageUrl : `http://localhost:5000${formState.currentImageUrl}`"
                 alt="Current product image"
                 class="image-preview"
                 @error="imagePreviewError = true"/>
            <button v-if="editingProduct && formState.currentImageUrl" @click.prevent="clearCurrentImage" type="button" class="clear-image-btn action-btn warning-action-btn">Remove Current Image</button>
          </div>
          <p v-if="imagePreviewError && (formState.externalImageUrl || (editingProduct && formState.currentImageUrl  && !formState.currentImageUrl.startsWith('/uploads')) )" class="error-text">
            Could not load image preview. Ensure link is valid, direct, and public.
          </p>
        </div>

        <div v-if="formMessage.text" :class="['message-display', formMessage.type]">
          {{ formMessage.text }}
        </div>
        <div class="form-actions">
          <button type="submit" :disabled="isSubmitting" class="action-btn primary-action-btn">
            <svg v-if="isSubmitting" class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
            {{ isSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product') }}
          </button>
          <button type="button" @click="cancelForm" class="action-btn secondary-action-btn">Cancel</button>
        </div>
      </form>
    </div>

    <div class="products-table-container">
      <h2>Existing Products List</h2>
      <table v-if="!isLoadingProducts && !productsError && products.length > 0" class="products-table">
        <thead>
          <tr>
            <th class="th-image">Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Category</th>
            <th>SKU</th>
            <th class="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td class="td-image">
              <img v-if="product.imageUrls && product.imageUrls.length > 0 && product.imageUrls[0]"
                   :src="product.imageUrls[0].startsWith('http') ? product.imageUrls[0] : `http://localhost:5000${product.imageUrls[0]}`"
                   :alt="product.name"
                   class="table-product-image"
                   @error="($event) => { $event.target.style.display='none'; let span = $event.target.nextElementSibling; if(span) span.style.display='inline'; }" />
              <span class="no-image-placeholder" style="display:none;">No Img</span>
              <span class="no-image-placeholder" v-if="!(product.imageUrls && product.imageUrls.length > 0 && product.imageUrls[0])">No Image</span>
            </td>
            <td data-label="Name">{{ product.name }}</td>
            <td data-label="Price">${{ formatPrice(product.price) }}</td>
            <td data-label="Qty">{{ product.quantity }}</td>
            <td data-label="Category">{{ product.category || '-' }}</td>
            <td data-label="SKU">{{ product.sku || '-' }}</td>
            <td class="td-actions">
              <button @click="startEditProduct(product)" class="action-btn edit-btn" :disabled="isSubmitting || showAddEditForm" title="Edit Product">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button @click="handleDeleteProduct(product._id, product.name)" class="action-btn delete-btn" :disabled="isSubmitting || showAddEditForm" title="Delete Product">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="isLoadingProducts" class="loading-message">Loading products...</div>
      <div v-if="!isLoadingProducts && productsError" class="error-message list-error">{{ productsError }}</div>
      <div v-if="!isLoadingProducts && !productsError && products.length === 0" class="no-products-message">
        No products found. Click "Add New Product" to get started!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import axios from 'axios';

const products = ref([]);
const isLoadingProducts = ref(true);
const productsError = ref('');
const showAddEditForm = ref(false);
const editingProduct = ref(null);
const isSubmitting = ref(false);
const formMessage = reactive({ text: '', type: 'error' });
const imagePreviewError = ref(false);

const predefinedCategories = ref([
  'Personal Diaries', 'Planner Diaries', 'Themed/Journaling Diaries',
  'Academic Diaries', 'Business Diaries', 'Notebooks',
  'Pens & Pencils', 'Desk Accessories', 'Other'
]);

const initialFormState = {
  _id: null, name: '', description: '', price: '', quantity: '',
  category: '', sku: '',
  imageFile: null,
  externalImageUrl: '',
  currentImageUrl: '',
  clearCurrentImage: false
};
const formState = reactive({ ...initialFormState });
const imagePreviewUrl = ref('');

const apiBaseUrl = 'http://localhost:5000/api';

watch(() => formState.externalImageUrl, (newVal) => {
    imagePreviewError.value = false;
    if (newVal && formState.imageFile) {
        formState.imageFile = null;
        const fileInput = document.getElementById('productImageFile');
        if (fileInput) fileInput.value = "";
        imagePreviewUrl.value = '';
    }
});
watch(() => formState.imageFile, (newFile) => {
    imagePreviewError.value = false;
    if (newFile && formState.externalImageUrl) {
        formState.externalImageUrl = '';
    }
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    formMessage.text = "Authentication token not found. Please log in again.";
    formMessage.type = 'error'; return null;
  }
  return { 'Authorization': `Bearer ${token}` };
};

const fetchProducts = async () => {
  isLoadingProducts.value = true; productsError.value = '';
  try {
    const response = await axios.get(`${apiBaseUrl}/products`);
    products.value = response.data;
  } catch (err) {
    console.error('Failed to fetch products:', err);
    productsError.value = 'Failed to load products. ' + (err.response?.data?.message || err.message);
  } finally { isLoadingProducts.value = false; }
};

onMounted(fetchProducts);

const resetFormAndHide = () => {
  Object.assign(formState, initialFormState);
  editingProduct.value = null;
  showAddEditForm.value = false;
  imagePreviewUrl.value = '';
  formMessage.text = '';
  imagePreviewError.value = false;
  const fileInput = document.getElementById('productImageFile');
  if (fileInput) fileInput.value = "";
};

const cancelForm = () => resetFormAndHide();

const handleImageFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formState.imageFile = file;
    imagePreviewUrl.value = URL.createObjectURL(file);
    formState.externalImageUrl = ''; 
    imagePreviewError.value = false;
  } else {
    formState.imageFile = null;
    imagePreviewUrl.value = '';
  }
};

const clearCurrentImage = () => {
    formState.currentImageUrl = '';
    formState.externalImageUrl = '';
    formState.imageFile = null;
    imagePreviewUrl.value = '';
    formState.clearCurrentImage = true;
    const fileInput = document.getElementById('productImageFile');
    if (fileInput) fileInput.value = "";
};

const toggleAddEditForm = (productToEdit = null) => {
  resetFormAndHide();
  if (productToEdit) {
    editingProduct.value = productToEdit;
    formState._id = productToEdit._id;
    formState.name = productToEdit.name;
    formState.description = productToEdit.description || '';
    formState.price = productToEdit.price?.toString() || '';
    formState.quantity = productToEdit.quantity?.toString() || '';
    formState.category = productToEdit.category || '';
    formState.sku = productToEdit.sku || '';
    formState.currentImageUrl = productToEdit.imageUrls && productToEdit.imageUrls.length > 0 ? productToEdit.imageUrls[0] : '';
    if (formState.currentImageUrl.startsWith('http')) { 
        formState.externalImageUrl = formState.currentImageUrl;
    }
  }
  showAddEditForm.value = true;
};

const handleSubmitForm = async () => {
  imagePreviewError.value = false;
  if (editingProduct.value) {
    await handleUpdateProduct();
  } else {
    await handleAddProduct();
  }
};

const handleAddProduct = async () => {
  isSubmitting.value = true; formMessage.text = '';
  const headers = getAuthHeaders();
  if (!headers) { isSubmitting.value = false; return; }

  if (!formState.name || formState.price === '' || formState.quantity === '' || !formState.category) {
    formMessage.text = "Name, Price, Quantity, and Category are required.";
    formMessage.type = 'error'; isSubmitting.value = false; return;
  }
  const priceNum = parseFloat(formState.price);
  const quantityNum = parseInt(formState.quantity, 10);
  if (isNaN(priceNum) || isNaN(quantityNum) || priceNum < 0 || quantityNum < 0) {
    formMessage.text = "Price and Quantity must be valid non-negative numbers.";
    formMessage.type = 'error'; isSubmitting.value = false; return;
  }

  const formData = new FormData();
  formData.append('name', formState.name);
  formData.append('description', formState.description);
  formData.append('price', priceNum.toString());
  formData.append('quantity', quantityNum.toString());
  formData.append('category', formState.category);
  formData.append('sku', formState.sku);

  if (formState.imageFile) {
    formData.append('productImage', formState.imageFile);
  } else if (formState.externalImageUrl.trim() !== '') {
    formData.append('externalImageUrl', formState.externalImageUrl.trim());
  }

  try {
    const response = await axios.post(`${apiBaseUrl}/products`, formData, { headers });
    products.value.push(response.data);
    formMessage.text = 'Product added successfully!'; formMessage.type = 'success';
    resetFormAndHide();
  } catch (err) {
    console.error('Failed to add product:', err.response?.data || err.message);
    formMessage.text = 'Failed to add product. ' + (err.response?.data?.message || err.message);
    formMessage.type = 'error';
  } finally { isSubmitting.value = false; }
};

const startEditProduct = (product) => { // This function should be correctly exposed
  toggleAddEditForm(product);
};

const handleUpdateProduct = async () => {
  isSubmitting.value = true; formMessage.text = '';
  const headers = getAuthHeaders();
  if (!headers || !formState._id) {
    formMessage.text = "Cannot update product. Missing ID or auth token.";
    formMessage.type = 'error'; isSubmitting.value = false; return;
  }
  if (!formState.name || formState.price === '' || formState.quantity === '' || !formState.category) {
    formMessage.text = "Name, Price, Quantity, and Category are required for update.";
    formMessage.type = 'error'; isSubmitting.value = false; return;
  }
  const priceNum = parseFloat(formState.price);
  const quantityNum = parseInt(formState.quantity, 10);
  if (isNaN(priceNum) || isNaN(quantityNum) || priceNum < 0 || quantityNum < 0) {
    formMessage.text = "Price and Quantity must be valid non-negative numbers for update.";
    formMessage.type = 'error'; isSubmitting.value = false; return;
  }

  const formData = new FormData();
  formData.append('name', formState.name);
  formData.append('description', formState.description);
  formData.append('price', priceNum.toString());
  formData.append('quantity', quantityNum.toString());
  formData.append('category', formState.category);
  formData.append('sku', formState.sku);

  if (formState.imageFile) {
    formData.append('productImage', formState.imageFile);
  } else if (formState.externalImageUrl.trim() !== '') {
    formData.append('externalImageUrl', formState.externalImageUrl.trim());
  } else if (formState.clearCurrentImage) {
      formData.append('clearCurrentImage', 'true');
  }

  try {
    const response = await axios.put(`${apiBaseUrl}/products/${formState._id}`, formData, { headers });
    const index = products.value.findIndex(p => p._id === formState._id);
    if (index !== -1) { products.value.splice(index, 1, response.data); }
    formMessage.text = 'Product updated successfully!'; formMessage.type = 'success';
    resetFormAndHide();
  } catch (err) {
    console.error('Failed to update product:', err.response?.data || err.message);
    formMessage.text = 'Failed to update product. ' + (err.response?.data?.message || err.message);
    formMessage.type = 'error';
  } finally { isSubmitting.value = false; }
};

const handleDeleteProduct = async (productId, productName) => {
  if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;
  const headers = getAuthHeaders(); 
  if (!headers) { alert("Authentication error. Please log in again."); return; }
  try {
    await axios.delete(`${apiBaseUrl}/products/${productId}`, { headers });
    products.value = products.value.filter(p => p._id !== productId);
    alert(`Product "${productName}" deleted successfully!`);
    if (editingProduct.value && editingProduct.value._id === productId) {
      resetFormAndHide();
    }
  } catch (err) {
    console.error('Failed to delete product:', err.response?.data || err.message);
    alert('Failed to delete product. ' + (err.response?.data?.message || err.message));
  }
};

const formatPrice = (price) => typeof price === 'number' ? price.toFixed(2) : 'N/A';
</script>

<style scoped>
/* Styles from vue_admin_product_management_google_drive_links_final artifact */
.product-management-view { padding: 25px; max-width: 1100px; margin: 30px auto; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background-color: #f9f9f9; border-radius: 8px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0; }
.page-header h1 { font-size: 1.75em; color: #2c3e50; font-weight: 600; }
.action-btn { padding: 10px 18px; border-radius: 6px; border: none; cursor: pointer; font-size: 0.95em; font-weight: 500; transition: all 0.2s ease-in-out; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.action-btn:hover { box-shadow: 0 2px 4px rgba(0,0,0,0.1); transform: translateY(-1px); }
.action-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: translateY(0); }
/* .btn-icon {  }  -- removed empty ruleset as icons inherit color from button text by default */
.primary-action-btn { background-color: #007bff; color: white; }
.primary-action-btn:hover:not(:disabled) { background-color: #0056b3; }
.add-product-btn.cancel-btn-style { background-color: #ffc107; color: #212529; }
.add-product-btn.cancel-btn-style:hover:not(:disabled) { background-color: #e0a800; }
.secondary-action-btn { background-color: #6c757d; color: white; }
.secondary-action-btn:hover:not(:disabled) { background-color: #545b62; }
.edit-btn { background-color: #17a2b8; color: white; padding: 6px 10px; font-size: 0.85em; }
.edit-btn:hover:not(:disabled) { background-color: #117a8b; }
.delete-btn { background-color: #dc3545; color: white; padding: 6px 10px; font-size: 0.85em; }
.delete-btn:hover:not(:disabled) { background-color: #bd2130; }
.warning-action-btn { background-color: #ffc107; color: #212529; }
.warning-action-btn:hover:not(:disabled) { background-color: #e0a800; }
.form-container { background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); border: 1px solid #e9ecef; }
.form-container h3 { margin-top: 0; margin-bottom: 25px; color: #343a40; font-size: 1.5em; font-weight: 600; border-bottom: 1px solid #e0e0e0; padding-bottom: 12px; }
.product-form .form-group { margin-bottom: 18px; }
.product-form .form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: #495057; font-size: 0.9em; }
.product-form .form-group input[type="text"],
.product-form .form-group input[type="number"],
.product-form .form-group input[type="url"],
.product-form .form-group input[type="file"], /* Added file input styling */
.product-form .form-group textarea,
.product-form .form-group select { width: 100%; padding: 10px 12px; border: 1px solid #ced4da; border-radius: 6px; box-sizing: border-box; font-size: 0.95em; background-color: #fff; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }
.product-form .form-group input[type="file"].file-input { padding: 8px; /* Adjust padding for file input */ }
.product-form .form-group input:focus,
.product-form .form-group textarea:focus,
.product-form .form-group select:focus { border-color: #80bdff; outline: 0; box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); }
.product-form .form-group textarea { min-height: 100px; }
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
.form-actions { margin-top: 25px; display: flex; gap: 12px; justify-content: flex-end; }
.image-option { margin-bottom: 12px; }
.image-option label { font-size: 0.9em; color: #555; }
.image-option-divider { text-align: center; margin: 12px 0; font-weight: 500; color: #888; font-size: 0.9em; }
.input-hint { font-size: 0.8em; color: #6c757d; display: block; margin-top: 4px; }
.image-preview-container { margin-top: 12px; margin-bottom: 12px; }
.image-preview-container p { font-size: 0.85em; color: #555; margin-bottom: 6px; }
.image-preview { max-width: 160px; max-height: 160px; border: 1px solid #dee2e6; padding: 4px; border-radius: 4px; object-fit: cover; background-color: #f8f9fa; }
.clear-image-btn { font-size: 0.8em; padding: 5px 10px; margin-top: 8px; }
.error-text { color: #dc3545; font-size: 0.85em; margin-top: 6px; }
.message-display { padding: 12px; margin-top: 18px; border-radius: 6px; font-size: 0.95em; text-align: center; }
.message-display.success { background-color: #d1e7dd; color: #0f5132; border: 1px solid #badbcc; }
.message-display.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
.products-table-container { background-color: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); border: 1px solid #e9ecef; }
.products-table-container h2 { font-size: 1.6em; color: #343a40; margin-bottom: 20px; }
.products-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 15px; font-size: 0.9em;}
.products-table th, .products-table td { border-bottom: 1px solid #dee2e6; padding: 12px 15px; text-align: left; vertical-align: middle; }
.products-table th { background-color: #f8f9fa; font-weight: 600; color: #495057; text-transform: uppercase; font-size: 0.8em; letter-spacing: 0.05em;}
.products-table tr:hover { background-color: #f1f3f5; }
.th-image, .td-image { width: 80px; text-align: center; }
.th-actions, .td-actions { width: 120px; text-align: center; }
.table-product-image { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #e0e0e0; background-color: #f8f9fa; }
.no-image-placeholder { font-size: 0.8em; color: #6c757d; }
.loading-message, .no-products-message { text-align: center; padding: 25px; color: #6c757d; font-style: italic; font-size: 1.05em; }
.list-error { color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 12px; border-radius: 6px; margin-bottom: 20px; text-align: center; }
.category-select { appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236c757d%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right .7em top 50%; background-size: .65em auto; padding-right: 2.5em; }
.spinner { animation: rotate 2s linear infinite; width: 16px; height: 16px; margin-right: 8px; }
.spinner .path { stroke: #fff; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }
</style>
