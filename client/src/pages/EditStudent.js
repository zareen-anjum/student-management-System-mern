import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import StudentForm from "../components/StudentForm";
import LoadingSpinner from "../components/LoadingSpinner";
import studentService from "../services/studentService";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await studentService.getStudentById(id);
        setStudent(data.student);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await studentService.updateStudent(id, data);
      toast.success("Student updated successfully!");
      navigate(`/students/${id}`);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update student";
      const fieldErrors = err.response?.data?.errors;
      toast.error(Array.isArray(fieldErrors) ? fieldErrors.join(", ") : message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage label="Loading student details..." />;

  if (notFound) {
    return (
      <div className="container page-wrapper py-5 text-center">
        <h4>Student not found</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/students")}>
          Back to Student List
        </button>
      </div>
    );
  }

  return (
    <div className="container page-wrapper py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <h4 className="fw-bold mb-0">Edit Student</h4>
      </div>

      <div className="card">
        <div className="card-body p-4">
          <StudentForm
            initialData={student}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitLabel="Update Student"
          />
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
