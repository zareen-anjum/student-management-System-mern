import React from "react";

// Simple reusable Bootstrap spinner, sized for full-page or inline use
const LoadingSpinner = ({ fullPage = false, label = "Loading..." }) => {
  return (
    <div
      className={fullPage ? "spinner-wrapper" : "d-flex align-items-center justify-content-center py-4"}
    >
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{label}</span>
        </div>
        <p className="mt-2 text-muted small mb-0">{label}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
