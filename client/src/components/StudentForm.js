import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const defaultState = {
  studentId: "",
  fullName: "",
  email: "",
  phone: "",
  department: "",
  semester: "",
  gender: "",
  dateOfBirth: "",
  address: "",
  profilePhoto: "",
};

// Shared form used for both creating and editing a student.
// `initialData` pre-fills the form (edit mode); `onSubmit` receives the validated payload.
const StudentForm = ({ initialData = null, onSubmit, submitting, submitLabel = "Save" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ ...defaultState, ...initialData });
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(initialData?.profilePhoto || "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert selected image to a base64 string for simple storage without a file server
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toastLikeError("Please select a valid image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toastLikeError("Image must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePhoto: reader.result }));
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Small helper - avoids importing toast here just for a couple of validation edge cases
  const toastLikeError = (msg) => setErrors((prev) => ({ ...prev, profilePhoto: msg }));

  const validate = () => {
    const newErrors = {};
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    } else if (formData.semester < 1 || formData.semester > 12) {
      newErrors.semester = "Semester must be between 1 and 12";
    }
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...formData, semester: Number(formData.semester) });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        {/* Profile Photo */}
        <div className="col-12 d-flex align-items-center gap-3 mb-2">
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="profile-photo-lg" />
          ) : (
            <div className="avatar-circle avatar-circle-lg">
              {formData.fullName?.charAt(0)?.toUpperCase() || "S"}
            </div>
          )}
          <div>
            <label className="form-label d-block">Profile Photo (optional)</label>
            <input type="file" accept="image/*" className="form-control" onChange={handlePhotoChange} />
            {errors.profilePhoto && <div className="text-danger small mt-1">{errors.profilePhoto}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Student ID</label>
          <input
            type="text"
            name="studentId"
            className={`form-control ${errors.studentId ? "is-invalid" : ""}`}
            value={formData.studentId}
            onChange={handleChange}
            placeholder="e.g. STU2026001"
          />
          {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Jane Smith"
          />
          {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={formData.email}
            onChange={handleChange}
            placeholder="student@example.com"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            name="phone"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +1 555 123 4567"
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Department</label>
          <select
            name="department"
            className={`form-select ${errors.department ? "is-invalid" : ""}`}
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.department && <div className="invalid-feedback">{errors.department}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Semester</label>
          <input
            type="number"
            name="semester"
            min="1"
            max="12"
            className={`form-control ${errors.semester ? "is-invalid" : ""}`}
            value={formData.semester}
            onChange={handleChange}
            placeholder="1 - 12"
          />
          {errors.semester && <div className="invalid-feedback">{errors.semester}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Gender</label>
          <select
            name="gender"
            className={`form-select ${errors.gender ? "is-invalid" : ""}`}
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""}`}
            value={formData.dateOfBirth ? String(formData.dateOfBirth).slice(0, 10) : ""}
            onChange={handleChange}
          />
          {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
        </div>

        <div className="col-12">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            rows="3"
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            value={formData.address}
            onChange={handleChange}
            placeholder="Street, City, State, ZIP"
          ></textarea>
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>
      </div>

      <div className="d-flex gap-2 mt-4">
        <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
        <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
