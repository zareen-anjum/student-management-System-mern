import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import dashboardService from "../services/dashboardService";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data.stats);
      } catch (err) {
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner fullPage label="Loading dashboard..." />;

  return (
    <div className="container page-wrapper py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Welcome back, {user?.name?.split(" ")[0]} 👋</h3>
          <p className="text-muted mb-0">Here's what's happening with your students today.</p>
        </div>
        <Link to="/students/add" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i> Add Student
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents ?? 0}
          icon="bi-people-fill"
          gradient="bg-gradient-blue"
        />
        <StatCard
          title="Total Departments"
          value={stats?.totalDepartments ?? 0}
          icon="bi-diagram-3-fill"
          gradient="bg-gradient-purple"
        />
        <StatCard
          title="Recently Added"
          value={stats?.recentStudents?.length ?? 0}
          icon="bi-clock-history"
          gradient="bg-gradient-green"
        />
        <StatCard
          title="Male / Female"
          value={`${stats?.genderBreakdown?.find((g) => g._id === "Male")?.count ?? 0} / ${
            stats?.genderBreakdown?.find((g) => g._id === "Female")?.count ?? 0
          }`}
          icon="bi-gender-ambiguous"
          gradient="bg-gradient-orange"
        />
      </div>

      <div className="row g-4">
        {/* Recent Students */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-semibold">Recently Added Students</h6>
              <Link to="/students" className="small">
                View All
              </Link>
            </div>
            <div className="card-body p-0">
              {stats?.recentStudents?.length ? (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Student ID</th>
                        <th>Department</th>
                        <th>Semester</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentStudents.map((s) => (
                        <tr key={s._id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar-circle">
                                {s.fullName?.charAt(0)?.toUpperCase()}
                              </div>
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
                          <td className="text-end">
                            <Link to={`/students/${s._id}`} className="btn btn-sm btn-outline-primary">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <i className="bi bi-people fs-1 d-block mb-2"></i>
                  No students added yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h6 className="mb-0 fw-semibold">Quick Actions</h6>
            </div>
            <div className="card-body d-grid gap-2">
              <Link to="/students/add" className="btn btn-outline-primary text-start">
                <i className="bi bi-person-plus-fill me-2"></i> Add New Student
              </Link>
              <Link to="/students" className="btn btn-outline-secondary text-start">
                <i className="bi bi-list-ul me-2"></i> View All Students
              </Link>
              <Link to="/profile" className="btn btn-outline-secondary text-start">
                <i className="bi bi-person-circle me-2"></i> My Profile
              </Link>
            </div>

            {stats?.departmentBreakdown?.length > 0 && (
              <>
                <div className="card-header bg-white border-top">
                  <h6 className="mb-0 fw-semibold">Students by Department</h6>
                </div>
                <div className="card-body">
                  {stats.departmentBreakdown.map((d) => (
                    <div key={d._id} className="d-flex justify-content-between small mb-2">
                      <span>{d._id}</span>
                      <span className="fw-semibold">{d.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
