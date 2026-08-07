import React, { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import authService from "../services/authService";

const Profile = () => {
  const { user, updateUserInState } = useAuth();

  const [profileData, setProfileData] = useState({ name: user?.name || "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  // ---------- Profile Info ----------
  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const validateProfile = () => {
    const errors = {};
    if (!profileData.name.trim()) errors.name = "Name is required";
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setSavingProfile(true);
    try {
      const data = await authService.updateProfile(profileData);
      updateUserInState(data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // ---------- Password ----------
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = "Current password is required";
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters";
    }
    if (passwordData.confirmNewPassword !== passwordData.newPassword) {
      errors.confirmNewPassword = "Passwords do not match";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setSavingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="container page-wrapper py-4" style={{ maxWidth: 720 }}>
      <h4 className="fw-bold mb-4">My Profile</h4>

      <div className="card mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="avatar-circle avatar-circle-lg">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div>
              <h5 className="fw-semibold mb-0">{user?.name}</h5>
              <p className="text-muted mb-0 small">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className={`form-control ${profileErrors.name ? "is-invalid" : ""}`}
                value={profileData.name}
                onChange={handleProfileChange}
              />
              {profileErrors.name && <div className="invalid-feedback">{profileErrors.name}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" value={user?.email || ""} disabled />
              <div className="form-text">Email address cannot be changed.</div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={savingProfile}>
              {savingProfile ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>Saving...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-4">
          <h6 className="fw-semibold mb-3">Change Password</h6>
          <form onSubmit={handlePasswordSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className={`form-control ${passwordErrors.currentPassword ? "is-invalid" : ""}`}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
              {passwordErrors.currentPassword && (
                <div className="invalid-feedback">{passwordErrors.currentPassword}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className={`form-control ${passwordErrors.newPassword ? "is-invalid" : ""}`}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
              {passwordErrors.newPassword && (
                <div className="invalid-feedback">{passwordErrors.newPassword}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                className={`form-control ${passwordErrors.confirmNewPassword ? "is-invalid" : ""}`}
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
              />
              {passwordErrors.confirmNewPassword && (
                <div className="invalid-feedback">{passwordErrors.confirmNewPassword}</div>
              )}
            </div>
            <button type="submit" className="btn btn-outline-primary" disabled={savingPassword}>
              {savingPassword ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>Updating...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
