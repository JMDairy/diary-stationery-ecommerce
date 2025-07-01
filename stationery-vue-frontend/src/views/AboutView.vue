    <template>
      <div class="about-view container">
        <h1>About Us</h1>
        <p>Welcome to Diary & Stationery Co., your one-stop shop for beautiful and functional stationery items.</p>
        <p>Founded in [Year], our mission is to bring joy and organization to your daily life through high-quality diaries, notebooks, pens, and desk accessories. We believe that the right tools can inspire creativity and productivity.</p>
        <p>Thank you for choosing us!</p>
      </div>
    </template>

    <script setup>
    // No script needed for this simple static page yet
    </script>

    <style scoped>
    .about-view {
      padding: 2rem 1rem;
      text-align: center;
    }
    .about-view h1 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      color: #333;
    }
    .about-view p {
      font-size: 1.1rem;
      line-height: 1.7;
      color: #555;
      max-width: 700px;
      margin: 0 auto 1rem auto;
    }
    .container { /* Optional: If you have a global container class or define it here */
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
    }
    </style>
    