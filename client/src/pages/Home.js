import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const features = [
  {
    icon: "bi-people-fill",
    title: "Student Records",
    text: "Add, edit, view and delete student records with a clean, structured interface.",
  },
  {
    icon: "bi-search",
    title: "Powerful Search",
    text: "Instantly search students by name, student ID, department or email.",
  },
  {
    icon: "bi-shield-lock-fill",
    title: "Secure Access",
    text: "JWT-based authentication with hashed passwords keeps your data safe.",
  },
  {
    icon: "bi-bar-chart-fill",
    title: "Live Dashboard",
    text: "Get an at-a-glance overview of total students, departments and recent activity.",
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <section className="hero-section text-center">
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">Student Management System</h1>
          <p className="lead mb-4 col-lg-8 mx-auto">
            A modern, secure and easy-to-use platform to manage student records, departments and
            enrollment data — all in one place.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-light btn-lg text-primary fw-semibold">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-light btn-lg text-primary fw-semibold">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {features.map((f) => (
            <div className="col-md-6 col-lg-3" key={f.title}>
              <div className="card h-100 p-4 text-center">
                <div className="feature-icon mx-auto mb-3">
                  <i className={`bi ${f.icon}`}></i>
                </div>
                <h5 className="fw-semibold">{f.title}</h5>
                <p className="text-muted small mb-0">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
