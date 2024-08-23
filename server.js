const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const userId = new mongoose.Types.ObjectId(); // Generates a new ObjectId
console.log(userId.toString());

const app = express();

const port = 4500;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/eCommerceDB")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB...", err));

// Define Schemas and Models
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    stock: { type: Number, required: true },
    images: [String],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, required: true },
    comment: String
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    orderDate: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true }
    }]
});

const User = mongoose.model("User", userSchema);
const Category = mongoose.model("Category", categorySchema);
const Product = mongoose.model("Product", productSchema);
const Review = mongoose.model("Review", reviewSchema);
const Order = mongoose.model("Order", orderSchema);
const Cart = mongoose.model("Cart", cartSchema);

app.use(express.json());

// User Registration
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ user: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// User Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new product
app.post("/products", async (req, res) => {
    try {
        const { name, description, price, category, stock, images } = req.body;

        const newProduct = new Product({ name, description, price, category, stock, images });
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all products
app.get('/products', async (req, res) => {
    try {
        const { name, category } = req.query;
        let filters = {};

        if (name) filters.name = new RegExp(name, 'i');
        if (category) filters.category = category;

        const products = await Product.find(filters);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single product by ID
app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a product by ID
app.patch("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a product by ID
app.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post("/cart", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate input
        if (!userId || !productId || quantity == null || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid input: userId, productId, and quantity are required, and quantity must be greater than 0' });
        }

        // Find or create a cart for the user
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        // Check if the product is already in the cart
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex > -1) {
            // If the product is already in the cart, update the quantity
            cart.products[productIndex].quantity += quantity;
        } else {
            // If the product is not in the cart, add it
            cart.products.push({ product: productId, quantity });
        }

        // Save the cart
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        console.error('Error adding product to cart:', err.message);
        res.status(500).json({ message: err.message });
    }
});

app.get("/cart/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
  
      const cart = await Cart.findOne({ user: userId }).populate('products.product');
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  


// Place an order
app.post("/orders", async (req, res) => {
    try {
        const { userId, products } = req.body;

        const totalAmount = products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

        const newOrder = new Order({
            user: userId,
            products,
            totalAmount
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user's orders
app.get("/orders/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
