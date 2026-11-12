require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const pool = require("./db");
const studentRoutes = require("./routes/students");

const app = express();

app.use(cors());
app.use(express.json());

// Frontend
app.use(express.static(
    path.join(__dirname, "frontend", "public")
));

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Student Management API is running!"
    });
});

// Student API
app.use("/api/students", studentRoutes);

// Home page
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "frontend", "public", "index.html")
    );
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

// Check database connection
pool.query("SELECT NOW()")
    .then(() => {
        console.log("PostgreSQL Connected Successfully!");
    })
    .catch((error) => {
        console.error("Database connection failed:", error.message);
    });