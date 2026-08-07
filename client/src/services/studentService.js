import api from "./api";

// Fetch a paginated / filtered / searched list of students
const getStudents = async (params = {}) => {
  const res = await api.get("/students", { params });
  return res.data;
};

// Fetch a single student by ID
const getStudentById = async (id) => {
  const res = await api.get(`/students/${id}`);
  return res.data;
};

// Create a new student
const createStudent = async (data) => {
  const res = await api.post("/students", data);
  return res.data;
};

// Update an existing student
const updateStudent = async (id, data) => {
  const res = await api.put(`/students/${id}`, data);
  return res.data;
};

// Delete a student
const deleteStudent = async (id) => {
  const res = await api.delete(`/students/${id}`);
  return res.data;
};

const studentService = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};

export default studentService;
