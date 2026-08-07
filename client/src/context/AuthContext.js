import React, { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import authService from "../services/authService";

// Create authentication context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Store authenticated user
  const [user, setUser] = useState(null);

  // Indicates whether authentication status is still being checked
  const [loading, setLoading] = useState(true);

  /**
   * Check whether a user session already exists.
   * If a valid token is found, fetch the user profile.
   */
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("sms_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.getMe();
        setUser(data.user);
      } catch (err) {
        // Remove invalid session data
        localStorage.removeItem("sms_token");
        localStorage.removeItem("sms_user");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  /**
   * Register a new user account.
   */
  const register = useCallback(async (formData) => {
    const data = await authService.register(formData);

    localStorage.setItem("sms_token", data.token);
    localStorage.setItem("sms_user", JSON.stringify(data.user));

    setUser(data.user);

    return data;
  }, []);

  /**
   * Authenticate an existing user.
   */
  const login = useCallback(async (formData) => {
  try {
    const data = await authService.login(formData);

    localStorage.setItem("sms_token", data.token);
    localStorage.setItem("sms_user", JSON.stringify(data.user));

    setUser(data.user);
    toast.success("Login successful");

    return data;
  } catch (error) {
    toast.error("Login failed. Please check your email and password.");
    throw error;
  }
}, []);

  /**
   * Logout current user and clear stored session.
   */
  const logout = useCallback(async () => {
    await authService.logout();

    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_user");

    setUser(null);

    toast.info("You have been logged out");
  }, []);

  /**
   * Update user information after profile changes.
   */
  const updateUserInState = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("sms_user", JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    register,
    login,
    logout,
    updateUserInState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};