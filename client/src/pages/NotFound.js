import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container page-wrapper d-flex align-items-center justify-content-center text-center py-5">
      <div>
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h4 className="fw-semibold mb-2">Page Not Found</h4>
        <p className="text-muted mb-4">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          <i className="bi bi-house-door me-1"></i> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
