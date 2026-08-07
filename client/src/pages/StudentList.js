import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import studentService from "../services/studentService";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

const DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Economics",
  "Other",
];

const StudentList = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentService.getStudents({
        search: search || undefined,
        department: department || undefined,
        page,
        limit: 10,
      });
      setStudents(data.students);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [search, department, page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Debounce search input changes by resetting to page 1
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setPage(1);
  };

  const confirmDelete = (student) => setDeleteTarget(student);
  const cancelDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await studentService.deleteStudent(deleteTarget._id);
      toast.success(`${deleteTarget.fullName} was deleted successfully`);
      setDeleteTarget(null);
      // Refetch, adjusting page if we deleted the last item on this page
      if (students.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchStudents();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete student");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container page-wrapper py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Students</h4>
          <p className="text-muted mb-0 small">{total} total student{total !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/students/add" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i> Add Student
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, student ID, email or department..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={department} onChange={handleDepartmentChange}>
                <option value="">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <LoadingSpinner label="Loading students..." />
          ) : students.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-people fs-1 d-block mb-2"></i>
              No students found. Try adjusting your search or filters.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Student ID</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>Phone</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {s.profilePhoto ? (
                            <img
                              src={s.profilePhoto}
                              alt={s.fullName}
                              className="avatar-circle"
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div className="avatar-circle">{s.fullName?.charAt(0)?.toUpperCase()}</div>
                          )}
                          <div>
                            <div className="fw-semibold">{s.fullName}</div>
                            <div className="text-muted small">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{s.studentId}</td>
                      <td>
                        <span className="badge badge-dept">{s.department}</span>
                      </td>
                      <td>{s.semester}</td>
                      <td>{s.phone}</td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate(`/students/${s._id}`)}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate(`/students/${s._id}/edit`)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => confirmDelete(s)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {pages > 1 && (
          <div className="card-footer bg-white py-3">
            <Pagination page={page} pages={pages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteTarget?.fullName}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={cancelDelete}
        loading={deleting}
      />
    </div>
  );
};

export default StudentList;
