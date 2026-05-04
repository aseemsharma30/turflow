import React, { createContext, useCallback, useEffect, useState } from 'react';
import { apiUrl } from '../apiConfig';

export const UserContext = createContext();

const USER_SESSION_API_URL = apiUrl('/api/user-session.php');
const SIGNUP_API_URL = apiUrl('/api/signup.php');
const SIGNIN_API_URL = apiUrl('/api/signin.php');
const LOGOUT_API_URL = apiUrl('/api/user-logout.php');
const PROFILE_API_URL = apiUrl('/api/profile.php');
const REQUEST_RESET_API_URL = apiUrl('/api/request-password-reset.php');
const RESET_PASSWORD_API_URL = apiUrl('/api/reset-password.php');

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }
      const response = await fetch(USER_SESSION_API_URL, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signup = useCallback(async (userData) => {
    try {
      const response = await fetch(SIGNUP_API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('userToken', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: 'Network error' };
    }
  }, []);

  const signin = useCallback(async (credentials) => {
    try {
      const response = await fetch(SIGNIN_API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('userToken', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error: 'Network error' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(LOGOUT_API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userToken');
  }, []);

  const getProfile = useCallback(async () => {
    try {
      const response = await fetch(PROFILE_API_URL, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        return data;
      } else {
        console.error('Failed to get profile');
      }
    } catch (error) {
      console.error('Error getting profile:', error);
    }
  }, []);

  const requestPasswordReset = useCallback(async (phone) => {
    try {
      const response = await fetch(REQUEST_RESET_API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await response.json();
      return { success: response.ok && data.success, message: data.message, error: data.error };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return { success: false, error: 'Network error' };
    }
  }, []);

  const resetPassword = useCallback(async (phone, otp, newPassword) => {
    try {
      const response = await fetch(RESET_PASSWORD_API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, newPassword })
      });
      const data = await response.json();
      return { success: response.ok && data.success, message: data.message, error: data.error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: 'Network error' };
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    signup,
    signin,
    logout,
    getProfile,
    requestPasswordReset,
    resetPassword,
    checkSession
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
