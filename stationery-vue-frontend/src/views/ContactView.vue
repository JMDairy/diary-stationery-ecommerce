    <template>
      <div class="contact-view container">
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We'd love to hear from you!</p>
        <form @submit.prevent="handleSubmitContact" class="contact-form">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="contactForm.name" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="contactForm.email" required />
          </div>
          <div class="form-group">
            <label for="message">Message:</label>
            <textarea id="message" v-model="contactForm.message" rows="5" required></textarea>
          </div>
          <button type="submit" class="submit-button">Send Message</button>
        </form>
        <p v-if="formSubmittedMessage" class="submitted-message">{{ formSubmittedMessage }}</p>
      </div>
    </template>

    <script setup>
    import { reactive, ref } from 'vue';

    const contactForm = reactive({
      name: '',
      email: '',
      message: ''
    });
    const formSubmittedMessage = ref('');

    const handleSubmitContact = () => {
      // For now, just log to console and show a message.
      // Later, you could integrate this with an email service or backend endpoint.
      console.log('Contact form submitted:', contactForm);
      formSubmittedMessage.value = `Thank you, ${contactForm.name}! Your message has been received (simulated).`;
      // Reset form
      contactForm.name = '';
      contactForm.email = '';
      contactForm.message = '';
    };
    </script>

    <style scoped>
    .contact-view {
      padding: 2rem 1rem;
      text-align: center;
    }
    .contact-view h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: #333;
    }
    .contact-view > p { /* Direct child p */
      font-size: 1.1rem;
      margin-bottom: 2rem;
      color: #555;
    }
    .contact-form {
      max-width: 600px;
      margin: 0 auto;
      text-align: left;
      background-color: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 1rem;
    }
    .form-group textarea {
      resize: vertical;
    }
    .submit-button {
      background-color: #4f46e5; /* Indigo */
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }
    .submit-button:hover {
      background-color: #4338ca; /* Darker Indigo */
    }
    .submitted-message {
      margin-top: 1.5rem;
      color: #16a34a; /* Green */
      font-weight: 500;
    }
    .container { /* Optional: If you have a global container class or define it here */
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
    }
    </style>
    