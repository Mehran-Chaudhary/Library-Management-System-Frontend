# 🚀 Frontend Integration Guide - Part 1: Authentication & User Management

**Backend Base URL:** `http://localhost:4000/api`

---

## 📋 Table of Contents
1. [Authentication System](#1-authentication-system)
2. [User Management](#2-user-management)
3. [Setup & Configuration](#3-setup--configuration)

---

## 1. AUTHENTICATION SYSTEM

### 1.1 User Registration

**Endpoint:** `POST /auth/register`  
**Authentication:** Not required (Public)

#### Request Body:
```typescript
{
  email: string;          // Valid email format
  password: string;       // Min 8 chars, 1 uppercase, 1 lowercase, 1 number/special
  firstName: string;      // Min 2, Max 50 chars
  lastName: string;       // Min 2, Max 50 chars
  phone?: string;         // Optional, Min 5, Max 20 chars
  address?: string;       // Optional, Max 200 chars
}
```

#### Response (201 Created):
```typescript
{
  message: "Registration successful",
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      membershipId: string;
    },
    accessToken: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/authService.ts
const API_URL = 'http://localhost:4000/api';

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
```

#### State Management (React Context/Redux):
```typescript
// context/AuthContext.tsx
const handleRegister = async (formData) => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || '',
      address: formData.address || '',
    });
    
    setUser(result.data.user);
    setIsAuthenticated(true);
    
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

### 1.2 User Login

**Endpoint:** `POST /auth/login`  
**Authentication:** Not required (Public)

#### Request Body:
```typescript
{
  email: string;
  password: string;
}
```

#### Response (200 OK):
```typescript
{
  message: "Login successful",
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      membershipId: string;
      role: "MEMBER" | "LIBRARIAN" | "ADMIN";
      darkModeEnabled: boolean;
    },
    accessToken: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/authService.ts
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store token and user data
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    // Apply dark mode preference
    if (data.data.user.darkModeEnabled) {
      document.documentElement.classList.add('dark');
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

---

### 1.3 Get Current User Profile

**Endpoint:** `GET /auth/me`  
**Authentication:** Required (JWT)

#### Headers:
```typescript
{
  'Authorization': 'Bearer {accessToken}'
}
```

#### Response (200 OK):
```typescript
{
  message: "Profile retrieved successfully",
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    membershipId: string;
    phone: string | null;
    address: string | null;
    role: "MEMBER" | "LIBRARIAN" | "ADMIN";
    totalBooksBorrowed: number;
    darkModeEnabled: boolean;
    createdAt: string; // ISO date
  }
}
```

#### Frontend Implementation:
```typescript
// services/authService.ts
export const getCurrentUser = async () => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Token might be expired
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        throw new Error('Session expired. Please login again.');
      }
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    
    // Update stored user data
    localStorage.setItem('user', JSON.stringify(data.data));
    
    return data.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};
```

#### Usage in Component:
```typescript
// components/ProtectedRoute.tsx
useEffect(() => {
  const verifyAuth = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // Redirect to login if token is invalid
      navigate('/login');
    }
  };
  
  verifyAuth();
}, []);
```

---

### 1.4 Change Password

**Endpoint:** `POST /auth/change-password`  
**Authentication:** Required (JWT)

#### Headers:
```typescript
{
  'Authorization': 'Bearer {accessToken}'
}
```

#### Request Body:
```typescript
{
  oldPassword: string;
  newPassword: string;
}
```

#### Response (200 OK):
```typescript
{
  message: "Password changed successfully"
}
```

#### Frontend Implementation:
```typescript
// services/authService.ts
export const changePassword = async (oldPassword, newPassword) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password change failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/ChangePasswordForm.tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate new password matches confirmation
  if (newPassword !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }
  
  try {
    setLoading(true);
    await changePassword(oldPassword, newPassword);
    
    // Show success message
    setSuccess('Password changed successfully');
    
    // Reset form
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 2. USER MANAGEMENT

### 2.1 Get User Profile

**Endpoint:** `GET /users/profile`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Profile retrieved successfully",
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    membershipId: string;
    phone: string | null;
    address: string | null;
    role: string;
    totalBooksBorrowed: number;
    darkModeEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/userService.ts
const API_URL = 'http://localhost:4000/api';

export const getUserProfile = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch profile');
    
    return await response.json();
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};
```

---

### 2.2 Update User Profile

**Endpoint:** `PATCH /users/profile`  
**Authentication:** Required (JWT)

#### Request Body (All fields optional):
```typescript
{
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}
```

#### Response (200 OK):
```typescript
{
  message: "Profile updated successfully",
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    membershipId: string;
    role: string;
    darkModeEnabled: boolean;
    totalBooksBorrowed: number;
    createdAt: string;
    updatedAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/userService.ts
export const updateUserProfile = async (updates) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profile update failed');
    }

    const data = await response.json();
    
    // Update local storage
    localStorage.setItem('user', JSON.stringify(data.data));
    
    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/ProfileEditForm.tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setLoading(true);
    const result = await updateUserProfile({
      firstName,
      lastName,
      phone,
      address,
    });
    
    // Update context/state
    setUser(result.data);
    setSuccess('Profile updated successfully');
    
    // Switch back to view mode
    setIsEditing(false);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

### 2.3 Toggle Dark Mode

**Endpoint:** `PATCH /users/dark-mode`  
**Authentication:** Required (JWT)

#### Request Body:
```typescript
{
  enabled: boolean;
}
```

#### Response (200 OK):
```typescript
{
  message: "Dark mode preference updated",
  data: {
    darkModeEnabled: boolean;
  }
}
```

#### Frontend Implementation:
```typescript
// services/userService.ts
export const toggleDarkMode = async (enabled) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/users/dark-mode`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled }),
    });

    if (!response.ok) throw new Error('Failed to update dark mode preference');
    
    const data = await response.json();
    
    // Apply dark mode to DOM
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update user in localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    user.darkModeEnabled = enabled;
    localStorage.setItem('user', JSON.stringify(user));
    
    return data;
  } catch (error) {
    console.error('Toggle dark mode error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/DarkModeToggle.tsx
const handleToggle = async () => {
  const newValue = !darkModeEnabled;
  
  try {
    await toggleDarkMode(newValue);
    setDarkModeEnabled(newValue);
  } catch (err) {
    console.error('Failed to toggle dark mode:', err);
    // Revert on error
    setDarkModeEnabled(!newValue);
  }
};
```

---

### 2.4 Get All Users (Admin/Librarian Only)

**Endpoint:** `GET /users`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

#### Response (200 OK):
```typescript
{
  message: "Users retrieved successfully",
  data: [
    {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      membershipId: string;
      role: string;
      totalBooksBorrowed: number;
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/userService.ts (Admin)
export const getAllUsers = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 403) {
      throw new Error('Insufficient permissions');
    }

    if (!response.ok) throw new Error('Failed to fetch users');
    
    return await response.json();
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};
```

---

### 2.5 Get User By ID (Admin/Librarian Only)

**Endpoint:** `GET /users/:id`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

#### Response (200 OK):
```typescript
{
  message: "User retrieved successfully",
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    membershipId: string;
    phone: string | null;
    address: string | null;
    role: string;
    totalBooksBorrowed: number;
    darkModeEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/userService.ts (Admin)
export const getUserById = async (userId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch user');
    
    return await response.json();
  } catch (error) {
    console.error('Get user by ID error:', error);
    throw error;
  }
};
```

---

## 3. SETUP & CONFIGURATION

### 3.1 Authentication Utilities

```typescript
// utils/auth.ts

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
```

### 3.2 Axios Instance Setup (Alternative to Fetch)

```typescript
// utils/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 3.3 Using Axios Instance

```typescript
// services/authService.ts (with Axios)
import axiosInstance from '../utils/axios';

export const login = async (credentials) => {
  try {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const register = async (userData) => {
  try {
    const { data } = await axiosInstance.post('/auth/register', userData);
    
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
```

### 3.4 Protected Route Component

```typescript
// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

// Usage in App.tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="ADMIN">
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

### 3.5 Auth Context Provider

```typescript
// context/AuthContext.tsx
import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth init error:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## 🎯 Key Points to Remember

1. **Always include Authorization header** for protected endpoints
2. **Store JWT token securely** in localStorage/sessionStorage
3. **Handle 401 errors** by redirecting to login
4. **Validate user role** for admin/librarian features
5. **Update localStorage** when user data changes
6. **Apply dark mode preference** on login/toggle
7. **Clear all auth data** on logout
8. **Handle token expiration** gracefully

---

**Next:** Part 2 - Books, Authors, and Genres Management
