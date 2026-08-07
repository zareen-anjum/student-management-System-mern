import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StudentForm from "../components/StudentForm";
import studentService from "../services/studentService";

const AddStudent = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await studentService.createStudent(data);
      toast.success("Student added successfully!");
      navigate("/students");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add student";
      const fieldErrors = err.response?.data?.errors;
      toast.error(Array.isArray(fieldErrors) ? fieldErrors.join(", ") : message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page-wrapper py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <h4 className="fw-bold mb-0">Add New Student</h4>
      </div>

      <div className="card">
        <div className="card-body p-4">
          <StudentForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Save Student" />
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
