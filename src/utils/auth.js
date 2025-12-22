/**
 * Authentication Utilities
 * Helper functions for authentication and authorization
 */

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

// Get stored user
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Logout user
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Check if user has specific role
export const hasRole = (requiredRole) => {
  const user = getStoredUser();
  if (!user) return false;
  
  const roleHierarchy = {
    'ADMIN': 3,
    'LIBRARIAN': 2,
    'MEMBER': 1,
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

// Check if user is admin
export const isAdmin = () => {
  const user = getStoredUser();
  return user?.role === 'ADMIN';
};

// Check if user is librarian
export const isLibrarian = () => {
  const user = getStoredUser();
  return user?.role === 'LIBRARIAN';
};

// Check if user is member
export const isMember = () => {
  const user = getStoredUser();
  return user?.role === 'MEMBER';
};

// Check if user can manage books (Admin or Librarian)
export const canManageBooks = () => {
  return isAdmin() || isLibrarian();
};

// Check if user can manage users (Admin only)
export const canManageUsers = () => {
  return isAdmin();
};

export default {
  isAuthenticated,
  getStoredUser,
  getAuthToken,
  logout,
  hasRole,
  isAdmin,
  isLibrarian,
  isMember,
  canManageBooks,
  canManageUsers,
};
