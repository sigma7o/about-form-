const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ DB Connection Error:", err));

// Schema
const formSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    place: String,
    city: String,
    country: String,
    hobby: String
});

// Model
const FormData = mongoose.model("FormData", formSchema);

// Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

// Handle form submission
app.post("/submit", async (req, res) => {
    try {
        const formData = new FormData(req.body);
        await formData.save();

        // Redirect with success query param
        res.redirect("/?success=true");
    } catch (error) {
        console.error("❌ Error saving form:", error);
        res.status(500).send("Error saving form data");
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
