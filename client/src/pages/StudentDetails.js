import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import studentService from "../services/studentService";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await studentService.deleteStudent(id);
      toast.success("Student deleted successfully");
      navigate("/students");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete student");
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage label="Loading student details..." />;

  if (notFound || !student) {
    return (
      <div className="container page-wrapper py-5 text-center">
        <h4>Student not found</h4>
        <Link to="/students" className="btn btn-primary mt-3">
          Back to Student List
        </Link>
      </div>
    );
  }

  const details = [
    { label: "Student ID", value: student.studentId, icon: "bi-hash" },
    { label: "Email", value: student.email, icon: "bi-envelope" },
    { label: "Phone", value: student.phone, icon: "bi-telephone" },
    { label: "Department", value: student.department, icon: "bi-diagram-3" },
    { label: "Semester", value: student.semester, icon: "bi-bookmark" },
    { label: "Gender", value: student.gender, icon: "bi-person-badge" },
    { label: "Date of Birth", value: formatDate(student.dateOfBirth), icon: "bi-cake2" },
    { label: "Address", value: student.address, icon: "bi-geo-alt" },
  ];

  return (
    <div className="container page-wrapper py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <h4 className="fw-bold mb-0">Student Details</h4>
      </div>

      <div className="card">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center gap-4 mb-4">
            {student.profilePhoto ? (
              <img src={student.profilePhoto} alt={student.fullName} className="profile-photo-lg" />
            ) : (
              <div className="avatar-circle avatar-circle-lg">
                {student.fullName?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-1">{student.fullName}</h4>
              <span className="badge badge-dept">{student.department}</span>
              <span className="text-muted small ms-2">Semester {student.semester}</span>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary" onClick={() => navigate(`/students/${id}/edit`)}>
                <i className="bi bi-pencil me-1"></i> Edit
              </button>
              <button className="btn btn-outline-danger" onClick={() => setShowDelete(true)}>
                <i className="bi bi-trash me-1"></i> Delete
              </button>
            </div>
          </div>

          <hr />

          <div className="row g-4">
            {details.map((d) => (
              <div className="col-md-6" key={d.label}>
                <div className="d-flex align-items-start gap-3">
                  <div className="feature-icon" style={{ width: 44, height: 44, fontSize: "1.1rem" }}>
                    <i className={`bi ${d.icon}`}></i>
                  </div>
                  <div>
                    <div className="text-muted small">{d.label}</div>
                    <div className="fw-semibold">{d.value || "-"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${student.fullName}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  );
};

export default StudentDetails;
