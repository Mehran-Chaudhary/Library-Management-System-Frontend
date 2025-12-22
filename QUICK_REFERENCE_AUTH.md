# 🚀 Quick Reference Card - Authentication & User Management

## 📞 API Endpoints

### Authentication
```javascript
POST   /auth/register        // Register new user
POST   /auth/login          // Login user
GET    /auth/me            // Get current user (JWT required)
POST   /auth/change-password // Change password (JWT required)
```

### User Management
```javascript
GET    /users/profile       // Get profile (JWT required)
PATCH  /users/profile       // Update profile (JWT required)
PATCH  /users/dark-mode     // Toggle dark mode (JWT required)
GET    /users              // Get all users (Admin/Librarian only)
GET    /users/:id          // Get user by ID (Admin/Librarian only)
```

---

## 🎯 Quick Usage

### 1. Login
```jsx
import { useAuth } from './context/AuthContext';

const { login } = useAuth();
await login('user@example.com', 'password123');
```

### 2. Register
```jsx
const { register } = useAuth();
await register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'Password123!',
  phone: '1234567890',      // optional
  address: '123 Main St'    // optional
});
```

### 3. Get Current User
```jsx
const { user } = useAuth();
console.log(user.firstName, user.email, user.role);
```

### 4. Update Profile
```jsx
const { updateProfile } = useAuth();
await updateProfile({
  firstName: 'Jane',
  phone: '9876543210'
});
```

### 5. Change Password
```jsx
const { changePassword } = useAuth();
await changePassword('oldPassword123', 'newPassword456');
```

### 6. Toggle Dark Mode
```jsx
const { toggleDarkMode, user } = useAuth();
await toggleDarkMode(!user.darkModeEnabled);
```

### 7. Logout
```jsx
const { logout } = useAuth();
logout(); // Clears all data and redirects to login
```

---

## 🔐 Protected Routes

### Basic Protection
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### Role-Based Protection
```jsx
// Admin only
<ProtectedRoute requiredRole="ADMIN">
  <AdminPanel />
</ProtectedRoute>

// Librarian or Admin
<ProtectedRoute requiredRole="LIBRARIAN">
  <ManageBooks />
</ProtectedRoute>
```

---

## 🛠️ Utility Functions

```javascript
import { 
  isAuthenticated, 
  hasRole, 
  isAdmin, 
  isLibrarian,
  canManageBooks,
  getStoredUser 
} from './utils/auth';

// Check if logged in
if (isAuthenticated()) { }

// Check role
if (hasRole('ADMIN')) { }
if (isAdmin()) { }
if (isLibrarian()) { }

// Check permissions
if (canManageBooks()) { }

// Get user
const user = getStoredUser();
```

---

## 📦 Service Functions

### authService
```javascript
import { authService } from './services';

authService.register(userData)
authService.login(email, password)
authService.getCurrentUser()
authService.changePassword(oldPass, newPass)
authService.logout()
authService.isAuthenticated()
authService.getStoredUser()
authService.getToken()
```

### userService
```javascript
import { userService } from './services';

userService.getUserProfile()
userService.updateUserProfile(updates)
userService.toggleDarkMode(enabled)
userService.getAllUsers()        // Admin/Librarian only
userService.getUserById(userId)  // Admin/Librarian only
```

---

## 🎨 User Object Structure

```javascript
{
  id: "uuid",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  membershipId: "MEM-12345",
  phone: "1234567890",
  address: "123 Main St",
  role: "MEMBER" | "LIBRARIAN" | "ADMIN",
  totalBooksBorrowed: 5,
  darkModeEnabled: false,
  createdAt: "2025-12-23T10:00:00Z",
  updatedAt: "2025-12-23T12:00:00Z"
}
```

---

## ⚡ Role Hierarchy

```
ADMIN (3)
  ├─ Full access to everything
  └─ User management
       ↓
LIBRARIAN (2)
  ├─ Book management
  └─ Borrowing operations
       ↓
MEMBER (1)
  └─ Basic user features
```

---

## 🔑 LocalStorage Keys

```javascript
accessToken  // JWT authentication token
user         // User profile data (JSON)
```

---

## ⚠️ Error Handling

```javascript
try {
  await login(email, password);
} catch (error) {
  console.error(error.message);
  // Error is also available in context: const { error } = useAuth();
}
```

### Automatic Error Handling
- **401 Unauthorized** → Auto logout + redirect to login
- **403 Forbidden** → Redirect to /unauthorized
- **Network errors** → Error message in context

---

## 💡 Best Practices

1. **Always use AuthProvider**
   ```jsx
   <AuthProvider>
     <App />
   </AuthProvider>
   ```

2. **Use ProtectedRoute for private pages**
   ```jsx
   <ProtectedRoute requiredRole="ADMIN">
     <AdminPanel />
   </ProtectedRoute>
   ```

3. **Check loading state**
   ```jsx
   const { isLoading } = useAuth();
   if (isLoading) return <Spinner />;
   ```

4. **Handle errors gracefully**
   ```jsx
   const { error, clearError } = useAuth();
   {error && <Alert onClose={clearError}>{error}</Alert>}
   ```

5. **Refresh profile after updates**
   ```jsx
   const { refreshProfile } = useAuth();
   await updateSomething();
   await refreshProfile();
   ```

---

## 🎯 Common Patterns

### Conditional Rendering by Role
```jsx
{isAdmin() && <AdminButton />}
{canManageBooks() && <ManageBooksLink />}
```

### Protected Component
```jsx
function MyComponent() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <div>Hello {user.firstName}!</div>;
}
```

### Form with Loading & Error
```jsx
function Form() {
  const { login, isLoading, error } = useAuth();
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <Error>{error}</Error>}
      <Input />
      <Button disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </Button>
    </form>
  );
}
```

---

## 📱 Environment Setup

```env
# .env
VITE_API_URL=http://localhost:4000/api
```

---

## ✅ Checklist

Before deploying:
- [ ] Backend is running on correct port
- [ ] CORS is configured for frontend origin
- [ ] Environment variable is set
- [ ] AuthProvider wraps app
- [ ] Protected routes use ProtectedRoute
- [ ] Error handling is in place
- [ ] Loading states are shown
- [ ] Unauthorized page exists

---

**Backend:** `http://localhost:4000/api`  
**Frontend:** `http://localhost:5173` (Vite default)  
**Status:** ✅ Production Ready
