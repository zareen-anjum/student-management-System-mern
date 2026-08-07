const Student = require("../models/Student");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get aggregate dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalStudents = await Student.countDocuments();

  // Count distinct departments actually in use
  const departments = await Student.distinct("department");
  const totalDepartments = departments.length;

  // 5 most recently added students
  const recentStudents = await Student.find()
    .sort("-createdAt")
    .limit(5)
    .select("studentId fullName email department semester createdAt");

  // Breakdown of student count per department (useful for charts)
  const departmentBreakdown = await Student.aggregate([
    { $group: { _id: "$department", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Breakdown by gender
  const genderBreakdown = await Student.aggregate([
    { $group: { _id: "$gender", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalStudents,
      totalDepartments,
      recentStudents,
      departmentBreakdown,
      genderBreakdown,
    },
  });
});

module.exports = { getDashboardStats };
