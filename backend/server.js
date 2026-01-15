const express = require("express");
const mongoose = require("mongoose");
const app = express();

// ========== CORS ==========
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// ========== MONGODB CONNECTION ==========
// 👇 PASTE YOUR CONNECTION STRING HERE (replace the whole string)
const MONGO_URI = "mongodb+srv://ankitbelive_db_user:P20QPpElcAC38K95@cluster0.8dxkrzj.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("\n✅ ================================");
        console.log("✅ MongoDB Connected Successfully!");
        console.log("✅ ================================\n");
    })
    .catch(err => {
        console.error("\n❌ MongoDB Connection Error:");
        console.error(err);
        console.error("\n");
    });

// ========== ORDER MODEL ==========
const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    total: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', OrderSchema);

// ========== API ROUTES ==========

// Create Order (Save to Database)
app.post("/api/order", async (req, res) => {
    try {
        console.log("\n==========================================");
        console.log("📦 NEW ORDER RECEIVED!");
        console.log("==========================================");
        console.log("Items:", req.body.items);
        console.log("Total: ₹" + req.body.total);
        console.log("Time:", new Date().toLocaleString());
        
        // Create order ID
        const orderId = "ORD-" + Date.now();
        
        // Save to MongoDB
        const newOrder = new Order({
            orderId: orderId,
            items: req.body.items,
            total: req.body.total
        });
        
        await newOrder.save();
        
        console.log("✅ Order saved to MongoDB database!");
        console.log("📝 Order ID:", orderId);
        console.log("==========================================\n");
        
        res.status(201).json({
            status: "success",
            message: "Order saved to database",
            orderId: orderId
        });
        
    } catch (error) {
        console.error("❌ Error saving order:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to save order"
        });
    }
});

// Get All Orders
app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        console.log(`📊 Fetched ${orders.length} orders from database`);
        res.json({
            status: "success",
            count: orders.length,
            orders: orders
        });
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        res.status(500).json({ 
            status: "error",
            message: "Failed to fetch orders" 
        });
    }
});

// Get Single Order by ID
app.get("/api/order/:orderId", async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        
        if (!order) {
            return res.status(404).json({ 
                status: "error",
                message: "Order not found" 
            });
        }
        
        res.json({
            status: "success",
            order: order
        });
    } catch (error) {
        console.error("❌ Error fetching order:", error);
        res.status(500).json({ 
            status: "error",
            message: "Failed to fetch order" 
        });
    }
});

// Delete Order (for testing)
app.delete("/api/order/:orderId", async (req, res) => {
    try {
        const result = await Order.deleteOne({ orderId: req.params.orderId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                status: "error",
                message: "Order not found" 
            });
        }
        
        console.log(`🗑️ Deleted order: ${req.params.orderId}`);
        res.json({
            status: "success",
            message: "Order deleted"
        });
    } catch (error) {
        console.error("❌ Error deleting order:", error);
        res.status(500).json({ 
            status: "error",
            message: "Failed to delete order" 
        });
    }
});

// ========== START SERVER ==========
const PORT = 5000;



app.listen(PORT, () => {
    console.log("\n✅ ================================");
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log("✅ Waiting for orders...");
    console.log("✅ ================================\n");
});