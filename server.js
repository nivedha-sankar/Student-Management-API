require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db");
const studentRoutes = require("./routes/students");

const app = express();

// Middleware
git(cors());
app.use(express.json());

// Student API routes
app.use("/api/students", studentRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Student Management API is running!");
});

// Start server after checking database connection
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const client = await pool.connect();

    console.log("PostgreSQL Connected Successfully!");

    client.release();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

startServer();;