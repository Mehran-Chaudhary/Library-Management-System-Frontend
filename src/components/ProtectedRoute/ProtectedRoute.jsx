import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';
import { hasRole } from '../../utils/auth';

/**
 * Protected Route Component
 * Protects routes from unauthorized access
 * Supports role-based access control
 * 
 * @param {ReactNode} children - Child components to render if authorized
 * @param {string} requiredRole - Required role to access the route (optional)
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <LoadingSpinner size="large" text="Checking authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted url for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if required role is specified
  if (requiredRole && !hasRole(requiredRole)) {
    // User is authenticated but doesn't have required role
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required role (if specified)
  return children;
};

export default ProtectedRoute;

