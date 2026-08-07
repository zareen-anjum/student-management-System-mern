import React, { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import authService from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking existing session

  // On first load, if a token exists, validate it by fetching the profile
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
        localStorage.removeItem("sms_token");
        localStorage.removeItem("sms_user");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Register a new account
  const register = useCallback(async (formData) => {
    const data = await authService.register(formData);
    localStorage.setItem("sms_token", data.token);
    localStorage.setItem("sms_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  // Log in
  const login = useCallback(async (formData) => {
    const data = await authService.login(formData);
    localStorage.setItem("sms_token", data.token);
    localStorage.setItem("sms_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  // Log out
  const logout = useCallback(async () => {
    await authService.logout();
    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_user");
    setUser(null);
    toast.info("You have been logged out");
  }, []);

  // Update the locally stored user (e.g. after profile edit)
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
