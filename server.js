const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/students");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Student Management API is running!");
});

// Student CRUD routes
app.use("/students", studentRoutes);

// Start server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});