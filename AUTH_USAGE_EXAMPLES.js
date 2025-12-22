/**
 * ============================================
 * AUTHENTICATION SYSTEM - USAGE EXAMPLES
 * ============================================
 * 
 * This file contains comprehensive examples of how to use
 * the authentication system in your components.
 */

// ============================================
// 1. BASIC AUTHENTICATION IN COMPONENTS
// ============================================

import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Member ID: {user.membershipId}</p>
    </div>
  );
}

// ============================================
// 2. LOGIN FORM EXAMPLE
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is already set in context
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// ============================================
// 3. REGISTRATION FORM EXAMPLE
// ============================================

function RegisterForm() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input name="firstName" onChange={handleChange} placeholder="First Name" required />
      <input name="lastName" onChange={handleChange} placeholder="Last Name" required />
      <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
      <input name="phone" onChange={handleChange} placeholder="Phone (optional)" />
      <input name="address" onChange={handleChange} placeholder="Address (optional)" />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}

// ============================================
// 4. LOGOUT BUTTON EXAMPLE
// ============================================

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}

// ============================================
// 5. USER PROFILE DISPLAY
// ============================================

function UserProfile() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await refreshProfile();
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.firstName} {user.lastName}</p>
      <p>Email: {user.email}</p>
      <p>Member ID: {user.membershipId}</p>
      <p>Phone: {user.phone || 'Not provided'}</p>
      <p>Address: {user.address || 'Not provided'}</p>
      <p>Books Borrowed: {user.totalBooksBorrowed}</p>
      <p>Dark Mode: {user.darkModeEnabled ? 'Enabled' : 'Disabled'}</p>
      
      <button onClick={handleRefresh} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh Profile'}
      </button>
    </div>
  );
}

// ============================================
// 6. UPDATE PROFILE FORM
// ============================================

function UpdateProfileForm() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || '',
    address: user.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      await updateProfile(formData);
      setSuccess(true);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {success && <div className="success">Profile updated successfully!</div>}
      
      <input
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        placeholder="First Name"
      />
      <input
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        placeholder="Last Name"
      />
      <input
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        placeholder="Phone"
      />
      <input
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        placeholder="Address"
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}

// ============================================
// 7. CHANGE PASSWORD FORM
// ============================================

function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Password changed successfully!</div>}
      
      <input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder="Current Password"
        required
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm New Password"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Changing...' : 'Change Password'}
      </button>
    </form>
  );
}

// ============================================
// 8. DARK MODE TOGGLE
// ============================================

function DarkModeToggle() {
  const { user, toggleDarkMode } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleDarkMode(!user.darkModeEnabled);
    } catch (err) {
      console.error('Failed to toggle dark mode:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleToggle} disabled={loading}>
      {loading ? 'Updating...' : user.darkModeEnabled ? 'Disable Dark Mode' : 'Enable Dark Mode'}
    </button>
  );
}

// ============================================
// 9. ROLE-BASED RENDERING
// ============================================

import { hasRole, isAdmin, isLibrarian, canManageBooks } from '../utils/auth';

function RoleBasedComponent() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Show to all authenticated users */}
      <section>
        <h2>My Books</h2>
        {/* Content */}
      </section>
      
      {/* Show only to Librarians and Admins */}
      {canManageBooks() && (
        <section>
          <h2>Manage Books</h2>
          {/* Book management content */}
        </section>
      )}
      
      {/* Show only to Admins */}
      {isAdmin() && (
        <section>
          <h2>Admin Panel</h2>
          {/* Admin content */}
        </section>
      )}
      
      {/* Check specific role */}
      {hasRole('LIBRARIAN') && (
        <section>
          <h2>Librarian Tools</h2>
          {/* Librarian content */}
        </section>
      )}
    </div>
  );
}

// ============================================
// 10. PROTECTED ROUTE USAGE IN APP.JSX
// ============================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Login, Register, Dashboard, Home, Unauthorized } from './pages';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes - requires authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Admin only route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          
          {/* Librarian or Admin route */}
          <Route
            path="/manage-books"
            element={
              <ProtectedRoute requiredRole="LIBRARIAN">
                <ManageBooks />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// ============================================
// 11. ADMIN USER MANAGEMENT
// ============================================

import { userService } from '../services';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers();
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Member ID</th>
            <th>Books Borrowed</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.membershipId}</td>
              <td>{user.totalBooksBorrowed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// 12. USING AUTH UTILITIES DIRECTLY
// ============================================

import { isAuthenticated, getStoredUser, getAuthToken, logout } from '../utils/auth';

function SomeComponent() {
  // Check if authenticated
  if (isAuthenticated()) {
    console.log('User is logged in');
  }

  // Get stored user
  const user = getStoredUser();
  console.log('User:', user);

  // Get auth token
  const token = getAuthToken();
  console.log('Token:', token);

  // Logout (clears storage and redirects)
  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {isAuthenticated() ? (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}

// ============================================
// KEY POINTS TO REMEMBER
// ============================================

/*
 * 1. Always wrap your app with AuthProvider
 * 2. Use useAuth() hook to access auth state and methods
 * 3. ProtectedRoute handles authentication checks automatically
 * 4. Pass requiredRole to ProtectedRoute for role-based access
 * 5. Error handling is built into the context
 * 6. Token is automatically added to API requests via axios interceptor
 * 7. Dark mode preference is automatically applied on login
 * 8. All auth data is stored in localStorage
 * 9. 401 errors automatically clear auth and redirect to login
 * 10. Use auth utilities for simple checks without context
 */

export default null; // This is just a documentation file
