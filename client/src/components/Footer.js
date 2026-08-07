import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-top py-3 mt-auto">
      <div className="container text-center text-muted small">
        &copy; {new Date().getFullYear()} Student Management System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
