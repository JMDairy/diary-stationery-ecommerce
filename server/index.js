// server/index.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // For handling file uploads
const path = require('path');   // For working with file paths
const fs = require('fs');       // For file system operations

const app = express();
const port = process.env.PORT || 5000;

console.log("Starting server setup...");

// --- Configuration ---
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1);
}
console.log("JWT_SECRET loaded.");

// --- MongoDB Connection ---
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/diary_stationery_db';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => {
      console.error('MongoDB Connection Error:', err);
      process.exit(1);
  });

// --- Mongoose Schema Definitions ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true },
  description: { type: String, required: false, trim: true },
  price: { type: Number, required: [true, 'Product price is required'], min: [0, 'Price cannot be negative'] },
  quantity: { type: Number, required: [true, 'Product quantity is required'], min: [0, 'Quantity cannot be negative'], default: 0 },
  category: { type: String, required: false, trim: true },
  sku: { type: String, required: false, trim: true, unique: true, sparse: true },
  imageUrls: [{ type: String, trim: true }]
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: [true, 'Email is required'], unique: true, trim: true, lowercase: true, match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'] },
  password: { type: String, required: [true, 'Password is required'], minlength: [6, 'Password must be at least 6 characters long'] },
  role: { type: String, default: 'admin' }
}, { timestamps: true });
adminUserSchema.pre('save', async function(next) { if (!this.isModified('password')) return next(); try { const salt = await bcrypt.genSalt(10); this.password = await bcrypt.hash(this.password, salt); next(); } catch (error) { next(error); }});
adminUserSchema.methods.comparePassword = async function(candidatePassword) { return bcrypt.compare(candidatePassword, this.password); };
const AdminUser = mongoose.model('AdminUser', adminUserSchema);


// --- Middleware ---
app.use(cors());
console.log("CORS middleware enabled.");
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // Important for FormData text fields if multer is used
console.log("express.json and express.urlencoded middleware enabled.");

// --- Multer Setup for Local Disk Storage ---
const UPLOADS_DIR = 'public/uploads/products';
const fullUploadsDir = path.join(__dirname, UPLOADS_DIR);

if (!fs.existsSync(fullUploadsDir)) {
    fs.mkdirSync(fullUploadsDir, { recursive: true });
    console.log(`Created directory: ${fullUploadsDir}`);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, fullUploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("File upload only supports: " + allowedTypes.toString()));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});
console.log("Multer configured for local disk storage.");

// --- Serve Static Files ---
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
console.log("Static files from 'public/uploads' being served under '/uploads'.");


// --- Authentication Middleware (protectAdmin) ---
const protectAdmin = (req, res, next) => {
  console.log("protectAdmin middleware hit for URL:", req.originalUrl);
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    console.log("Token found in protectAdmin:", token ? "Yes" : "No");
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = decoded;
      console.log("Token verified in protectAdmin. Admin role:", req.admin.role);
      if (req.admin.role !== 'admin') {
          console.log("Forbidden in protectAdmin: Not an admin role.");
          return res.status(403).json({ message: 'Forbidden: Not an admin role' });
      }
      next();
    } catch (error) {
      console.error("Token verification failed in protectAdmin:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log("No token or invalid format in Authorization header in protectAdmin.");
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- API Endpoints ---
// Admin Authentication Routes
app.post('/api/admin/register', async (req, res) => {
  console.log("POST /api/admin/register hit. Body:", req.body);
  const { email, password } = req.body;
  try {
    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }
    const newAdmin = new AdminUser({ email, password });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin user registered successfully', adminId: newAdmin._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin registration', error: error.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  console.log("POST /api/admin/login hit. Body:", req.body);
  const { email, password } = req.body;
  try {
    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials (email not found)' });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (password incorrect)' });
    }
    const payload = { adminId: admin._id, email: admin.email, role: admin.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token: token, admin: { id: admin._id, email: admin.email, role: admin.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin login', error: error.message });
  }
});

// Product API Endpoints
app.post('/api/products', protectAdmin, upload.single('productImage'), async (req, res) => {
  console.log("POST /api/products hit. Body:", req.body, "File:", req.file ? req.file.filename : "No file");
  try {
    const { name, description, price, quantity, category, sku, externalImageUrl } = req.body;
    if (!name || price === undefined || quantity === undefined) {
        return res.status(400).json({ message: "Name, price, and quantity are required." });
    }
    let imageUrlsArray = [];
    if (req.file) {
      imageUrlsArray.push(`/uploads/products/${req.file.filename}`);
    } else if (externalImageUrl && externalImageUrl.trim() !== '') {
      imageUrlsArray.push(externalImageUrl.trim());
    }
    const newProduct = new Product({ name, description, price: parseFloat(price), quantity: parseInt(quantity, 10), category, sku, imageUrls: imageUrlsArray });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    if (req.file && req.file.path) { fs.unlink(req.file.path, (err) => { if (err) console.error("Error deleting orphaned file:", err); }); }
    if (error.code === 11000) return res.status(400).json({ message: "SKU already exists." });
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  console.log("GET /api/products hit. Query params:", req.query);
  try {
    const { category } = req.query;
    let queryFilter = {};
    if (category) {
      queryFilter.category = { $regex: new RegExp(category, "i") };
    }
    const products = await Product.find(queryFilter);
    console.log(`Found ${products.length} products.`);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products in /api/products route:", error.message);
    res.status(500).json({ message: "Failed to retrieve products", error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
    console.log(`GET /api/products/${req.params.id} hit.`);
    try {
        const product = await Product.findById(req.params.id);
        if (!product) { return res.status(404).json({ message: "Product not found" }); }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve product", error: error.message });
    }
});

app.put('/api/products/:id', protectAdmin, upload.single('productImage'), async (req, res) => {
  console.log(`PUT /api/products/${req.params.id} hit. Body:`, req.body, "File:", req.file ? req.file.filename : "No file");
  try {
    const { name, description, price, quantity, category, sku, externalImageUrl, clearCurrentImage } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Product not found" });
    }
    let oldLocalImagePath = null;
    if (product.imageUrls && product.imageUrls.length > 0 && product.imageUrls[0].startsWith('/uploads/products/')) {
      oldLocalImagePath = path.join(__dirname, 'public', product.imageUrls[0].replace('/uploads', 'uploads'));
    }
    let newImageUrlsArray = product.imageUrls || [];
    if (req.file) {
      if (oldLocalImagePath && fs.existsSync(oldLocalImagePath)) fs.unlinkSync(oldLocalImagePath);
      newImageUrlsArray = [`/uploads/products/${req.file.filename}`];
    } else if (clearCurrentImage === 'true') {
        if (oldLocalImagePath && fs.existsSync(oldLocalImagePath)) fs.unlinkSync(oldLocalImagePath);
        newImageUrlsArray = [];
    } else if (externalImageUrl !== undefined) {
      if (oldLocalImagePath && fs.existsSync(oldLocalImagePath)) fs.unlinkSync(oldLocalImagePath);
      newImageUrlsArray = externalImageUrl.trim() !== '' ? [externalImageUrl.trim()] : [];
    }
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (quantity !== undefined) product.quantity = parseInt(quantity, 10);
    if (category !== undefined) product.category = category;
    if (sku !== undefined) product.sku = sku;
    product.imageUrls = newImageUrlsArray;
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    if (req.file && req.file.path) fs.unlinkSync(req.file.path);
    if (error.code === 11000) return res.status(400).json({ message: "SKU already exists." });
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
});

app.delete('/api/products/:id', protectAdmin, async (req, res) => {
  console.log(`DELETE /api/products/${req.params.id} hit.`);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) { return res.status(404).json({ message: "Product not found" }); }
    if (product.imageUrls && product.imageUrls.length > 0 && product.imageUrls[0].startsWith('/uploads/products/')) {
      const localFilePath = path.join(__dirname, 'public', product.imageUrls[0].replace('/uploads', 'uploads'));
      if (fs.existsSync(localFilePath)) {
        fs.unlink(localFilePath, (err) => { if (err) console.error(`Error deleting local image ${localFilePath}:`, err); else console.log(`Local image ${localFilePath} deleted.`); });
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
});

app.get('/', (req, res) => {
  console.log("GET / (root) hit.");
  res.send('Hello from Diary & Stationery E-commerce Backend! Hybrid Image Upload. Enhanced Logging.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Enhanced logging is enabled for routes.");
});
