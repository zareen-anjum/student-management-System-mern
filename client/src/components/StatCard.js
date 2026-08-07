import React from "react";

// Displays a single dashboard statistic in a colored card
const StatCard = ({ title, value, icon, gradient = "bg-gradient-blue" }) => {
  return (
    <div className="col-sm-6 col-lg-3">
      <div className={`card stat-card ${gradient} p-3 h-100`}>
        <i className={`bi ${icon} stat-icon`}></i>
        <div className="stat-value">{value}</div>
        <div className="text-white-50">{title}</div>
      </div>
    </div>
  );
};

export default StatCard;
