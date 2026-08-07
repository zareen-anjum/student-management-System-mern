const express = require("express");
const { body } = require("express-validator");
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

// All student routes require authentication
router.use(protect);

const studentValidationRules = [
  body("studentId").trim().notEmpty().withMessage("Student ID is required"),
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("phone")
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage("A valid phone number is required"),
  body("department").trim().notEmpty().withMessage("Department is required"),
  body("semester")
    .isInt({ min: 1, max: 12 })
    .withMessage("Semester must be between 1 and 12"),
  body("gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female or Other"),
  body("dateOfBirth").notEmpty().withMessage("Date of birth is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
];

// @route   GET /api/students
router.get("/", getStudents);

// @route   POST /api/students
router.post("/", studentValidationRules, validate, createStudent);

// @route   GET /api/students/:id
router.get("/:id", getStudentById);

// @route   PUT /api/students/:id
router.put("/:id", updateStudent);

// @route   DELETE /api/students/:id
router.delete("/:id", deleteStudent);

module.exports = router;
