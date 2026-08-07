import api from "./api";

// Register a new user
const register = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// Log in an existing user
const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// Log out (invalidate server-side session placeholder)
const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    // Even if the server call fails, client-side logout should proceed
  }
};

// Get the currently logged in user's profile
const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

// Update profile info
const updateProfile = async (data) => {
  const res = await api.put("/auth/me", data);
  return res.data;
};

// Change password
const changePassword = async (data) => {
  const res = await api.put("/auth/change-password", data);
  return res.data;
};

const authService = { register, login, logout, getMe, updateProfile, changePassword };

export default authService;
