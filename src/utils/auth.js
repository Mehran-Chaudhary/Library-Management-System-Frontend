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

// Check if user has specific role (case-insensitive)
export const hasRole = (requiredRole) => {
  const user = getStoredUser();
  if (!user) return false;
  
  const userRole = user.role?.toUpperCase();
  const roleHierarchy = {
    'ADMIN': 3,
    'LIBRARIAN': 2,
    'MEMBER': 1,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole?.toUpperCase()];
};

// Check if user is admin (case-insensitive)
export const isAdmin = () => {
  const user = getStoredUser();
  return user?.role?.toUpperCase() === 'ADMIN';
};

// Check if user is librarian (case-insensitive)
export const isLibrarian = () => {
  const user = getStoredUser();
  return user?.role?.toUpperCase() === 'LIBRARIAN';
};

// Check if user is member (case-insensitive)
export const isMember = () => {
  const user = getStoredUser();
  return user?.role?.toUpperCase() === 'MEMBER';
};

// Get redirect path based on user role
export const getRedirectPath = () => {
  const user = getStoredUser();
  if (!user) return '/login';
  
  const role = user.role?.toUpperCase();
  if (role === 'ADMIN' || role === 'LIBRARIAN') {
    return '/admin';
  }
  return '/';
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
  getRedirectPath,
};
