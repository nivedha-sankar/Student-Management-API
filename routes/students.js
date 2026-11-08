const express = require("express");
const router = express.Router();
const pool = require("../db");

// Validate student details
const validateStudent = (data) => {
  const { name, age, course, email } = data;

  if (
    !name?.trim() ||
    age === undefined ||
    age === null ||
    !course?.trim() ||
    !email?.trim()
  ) {
    return "All fields are required";
  }

  if (!Number.isInteger(Number(age)) || Number(age) <= 0) {
    return "Age must be a positive whole number";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    return "Please enter a valid email address";
  }

  return null;
};

// GET - Get all students
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM students ORDER BY id ASC"
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      students: result.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch students"
    });
  }
});

// GET - Get student by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid student ID"
      });
    }

    const result = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      student: result.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch student"
    });
  }
});

// POST - Add student
router.post("/", async (req, res) => {
  try {
    const error = validateStudent(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error
      });
    }

    const { name, age, course, email } = req.body;

    const result = await pool.query(
      `INSERT INTO students (name, age, course, email)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name.trim(), Number(age), course.trim(), email.trim()]
    );

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      student: result.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: "Failed to add student"
    });
  }
});

// PUT - Update student
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid student ID"
      });
    }

    const error = validateStudent(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error
      });
    }

    const { name, age, course, email } = req.body;

    const result = await pool.query(
      `UPDATE students
       SET name=$1, age=$2, course=$3, email=$4
       WHERE id=$5
       RETURNING *`,
      [name.trim(), Number(age), course.trim(), email.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: result.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: "Failed to update student"
    });
  }
});

// DELETE - Delete student
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid student ID"
      });
    }

    const result = await pool.query(
      "DELETE FROM students WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: "Failed to delete student"
    });
  }
});

module.exports = router;