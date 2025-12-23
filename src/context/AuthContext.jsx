import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const token = authService.getToken();
        
        if (storedUser && token) {
          // Verify token is still valid by fetching profile
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
            
            // Apply dark mode preference
            if (userData.darkModeEnabled) {
              document.documentElement.classList.add('dark');
            }
          } catch (err) {
            // Token is invalid, clear storage
            console.error('Token validation failed:', err);
            authService.logout();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const login = useCallback(async (email, password) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register new user
   * @param {Object} userData - User registration data
   */
  const register = useCallback(async (userData) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  /**
   * Refresh user profile
   * Fetches the latest user data from the server
   */
  const refreshProfile = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Failed to refresh profile:', err);
      throw err;
    }
  }, []);

  /**
   * Update user profile
   * @param {Object} updates - Profile fields to update
   */
  const updateProfile = useCallback(async (updates) => {
    try {
      const response = await userService.updateUserProfile(updates);
      setUser(response);
      return response;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  }, []);

  /**
   * Change password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   */
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      const response = await authService.changePassword(oldPassword, newPassword);
      return response;
    } catch (err) {
      console.error('Failed to change password:', err);
      throw err;
    }
  }, []);

  /**
   * Toggle dark mode
   * @param {boolean} enabled - Whether to enable dark mode
   */
  const toggleDarkMode = useCallback(async (enabled) => {
    try {
      const response = await userService.toggleDarkMode(enabled);
      
      // Update user state
      setUser(prev => ({
        ...prev,
        darkModeEnabled: enabled,
      }));
      
      return response;
    } catch (err) {
      console.error('Failed to toggle dark mode:', err);
      throw err;
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshProfile,
    updateProfile,
    changePassword,
    toggleDarkMode,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
