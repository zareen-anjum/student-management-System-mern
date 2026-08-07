const Student = require("../models/Student");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a new student
// @route   POST /api/students
// @access  Private
const createStudent = asyncHandler(async (req, res) => {
  const studentData = { ...req.body, createdBy: req.user._id };

  const student = await Student.create(studentData);

  res.status(201).json({
    success: true,
    message: "Student added successfully",
    student,
  });
});

// @desc    Get all students (supports search, filter, pagination)
// @route   GET /api/students
// @access  Private
const getStudents = asyncHandler(async (req, res) => {
  const { search, department, page = 1, limit = 10, sort = "-createdAt" } = req.query;

  const query = {};

  // Search across name, studentId, email or department using a case-insensitive regex
  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [
      { fullName: regex },
      { studentId: regex },
      { email: regex },
      { department: regex },
    ];
  }

  if (department) {
    query.department = department;
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  const [students, total] = await Promise.all([
    Student.find(query).sort(sort).skip(skip).limit(limitNum),
    Student.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: students.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    students,
  });
});

// @desc    Get a single student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  res.status(200).json({ success: true, student });
});

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const updatableFields = [
    "studentId",
    "fullName",
    "email",
    "phone",
    "department",
    "semester",
    "gender",
    "dateOfBirth",
    "address",
    "profilePhoto",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      student[field] = req.body[field];
    }
  });

  await student.save();

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    student,
  });
});

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  await student.deleteOne();

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
  });
});

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
