const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("static")); // Serves static files from the 'static' folder

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Sample Schema
const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const Item = mongoose.model("Item", ItemSchema);

// Routes
app.post("/items", async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newItem = new Item({ name, description, price });
    await newItem.save();
    res.status(201).json({ message: "Item added", data: newItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({items: "Welcome"});
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.get("/", (req,res) => {
  res.send("Server is running!!!")
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});