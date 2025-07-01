// stationery-vue-frontend/src/main.js

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Your router configuration

// Import global CSS file - ensure this path is correct.
// This should be the file where you have your base styles.
import './assets/main.css' // Assuming your global styles are in src/assets/main.css

const app = createApp(App)

app.use(router) // This line registers the router with your Vue application

app.mount('#app') // Mount the application to the DOM element with id="app" in your public/index.html
