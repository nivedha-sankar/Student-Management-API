const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "student_management",
  password: "Nive486",
  port: 5432,
  ssl: false
});

pool.connect()
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.log("Database connection failed:", err.message));

module.exports = pool;