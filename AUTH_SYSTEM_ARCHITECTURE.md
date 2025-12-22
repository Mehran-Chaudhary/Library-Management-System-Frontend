# 📊 Authentication System Architecture

## 🔄 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     REACT COMPONENTS                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Login   │  │ Register │  │ Profile  │  │ Settings │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AUTH CONTEXT (State)                         │
│  • user                    • isAuthenticated                     │
│  • isLoading              • error                                │
│  • login()                • register()                           │
│  • logout()               • updateProfile()                      │
│  • changePassword()       • toggleDarkMode()                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                 │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │  authService     │         │  userService     │             │
│  │  • register()    │         │  • getProfile()  │             │
│  │  • login()       │         │  • updateProfile()│            │
│  │  • getCurrentUser()       │  • toggleDarkMode()│            │
│  │  • changePassword()       │  • getAllUsers()  │             │
│  └──────────────────┘         └──────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AXIOS INSTANCE                               │
│  • Base URL: http://localhost:4000/api                          │
│  • Request Interceptor: Add JWT token                           │
│  • Response Interceptor: Handle errors                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND API                                  │
│  POST   /auth/register                                           │
│  POST   /auth/login                                              │
│  GET    /auth/me                                                 │
│  POST   /auth/change-password                                    │
│  GET    /users/profile                                           │
│  PATCH  /users/profile                                           │
│  PATCH  /users/dark-mode                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LOCAL STORAGE                                │
│  • accessToken (JWT)                                             │
│  • user (JSON object)                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Login Flow

```
User enters credentials
        │
        ▼
Login component calls useAuth().login(email, password)
        │
        ▼
AuthContext.login() called
        │
        ▼
authService.login(email, password)
        │
        ▼
POST /auth/login with credentials
        │
        ▼
Backend validates and returns JWT + user data
        │
        ▼
Store token and user in localStorage
        │
        ▼
Apply dark mode if enabled
        │
        ▼
Update AuthContext state (user, isAuthenticated)
        │
        ▼
Redirect to dashboard/home
```

---

## 📝 Registration Flow

```
User fills registration form
        │
        ▼
Register component calls useAuth().register(userData)
        │
        ▼
AuthContext.register() called
        │
        ▼
authService.register(userData)
        │
        ▼
POST /auth/register with user data
        │
        ▼
Backend creates user and returns JWT + user data
        │
        ▼
Store token and user in localStorage
        │
        ▼
Update AuthContext state
        │
        ▼
Redirect to dashboard
```

---

## 🔄 Token Refresh Flow

```
App mounts
        │
        ▼
AuthProvider useEffect runs
        │
        ▼
Check localStorage for token
        │
        ├─ No token → Set isLoading: false
        │
        └─ Token found
               │
               ▼
        Call authService.getCurrentUser()
               │
               ▼
        GET /auth/me with token
               │
               ├─ Success → Update user state
               │
               └─ Error (401) → Clear storage, logout
```

---

## 🚫 Error Handling Flow

```
API Request
        │
        ▼
Error occurs
        │
        ├─ 401 Unauthorized
        │   │
        │   ▼
        │   Axios interceptor catches
        │   │
        │   ▼
        │   Clear localStorage
        │   │
        │   ▼
        │   Redirect to /login
        │
        ├─ 403 Forbidden
        │   │
        │   ▼
        │   Component/Route handles
        │   │
        │   ▼
        │   Redirect to /unauthorized
        │
        └─ Other errors
            │
            ▼
            Error message extracted
            │
            ▼
            Passed to component/context
```

---

## 🛡️ Protected Route Flow

```
User navigates to protected route
        │
        ▼
ProtectedRoute component renders
        │
        ▼
Check isLoading
        │
        ├─ Loading → Show spinner
        │
        └─ Not loading
               │
               ▼
        Check isAuthenticated
               │
               ├─ Not authenticated
               │   │
               │   ▼
               │   Redirect to /login
               │   (save attempted URL)
               │
               └─ Authenticated
                      │
                      ▼
               Check requiredRole (if specified)
                      │
                      ├─ Has required role
                      │   │
                      │   ▼
                      │   Render children
                      │
                      └─ Doesn't have role
                          │
                          ▼
                          Redirect to /unauthorized
```

---

## 🎨 Dark Mode Flow

```
User toggles dark mode
        │
        ▼
Component calls toggleDarkMode(enabled)
        │
        ▼
AuthContext.toggleDarkMode() called
        │
        ▼
userService.toggleDarkMode(enabled)
        │
        ▼
PATCH /users/dark-mode { enabled }
        │
        ▼
Backend updates user preference
        │
        ▼
Add/remove 'dark' class to document.documentElement
        │
        ▼
Update user in localStorage
        │
        ▼
Update AuthContext user state
```

---

## 📦 Data Flow

```
┌──────────────┐
│   Backend    │
│   (NestJS)   │
└──────┬───────┘
       │
       │ HTTP Response
       │ { message, data: { user, accessToken } }
       │
       ▼
┌──────────────┐
│ Axios Instance│
│ (api.js)     │
└──────┬───────┘
       │
       │ Intercepts response
       │ Returns response.data
       │
       ▼
┌──────────────┐
│  authService │
│  userService │
└──────┬───────┘
       │
       │ Processes data
       │ Stores in localStorage
       │
       ▼
┌──────────────┐
│ AuthContext  │
└──────┬───────┘
       │
       │ Updates state
       │ { user, isAuthenticated, ... }
       │
       ▼
┌──────────────┐
│  Components  │
│  (useAuth)   │
└──────────────┘
```

---

## 🔄 State Management

```
AuthContext State:
├── user: User | null
│   ├── id
│   ├── email
│   ├── firstName
│   ├── lastName
│   ├── role
│   ├── membershipId
│   ├── darkModeEnabled
│   └── ...
├── isLoading: boolean
├── error: string | null
└── isAuthenticated: boolean (computed: !!user)

Methods:
├── login(email, password)
├── register(userData)
├── logout()
├── refreshProfile()
├── updateProfile(updates)
├── changePassword(oldPass, newPass)
├── toggleDarkMode(enabled)
└── clearError()
```

---

## 🗂️ File Dependencies

```
App.jsx
  └── AuthProvider (AuthContext.jsx)
       ├── authService.js
       │    └── api.js (axios instance)
       └── userService.js
            └── api.js (axios instance)

Components
  └── useAuth() hook
       └── AuthContext

ProtectedRoute
  ├── useAuth() hook
  └── auth.js (utilities)
       └── hasRole(), isAdmin(), etc.
```

---

## 🎯 Component Communication

```
Login/Register Component
        │
        │ Calls useAuth() methods
        ▼
AuthContext (Global State)
        │
        │ All components can access
        ▼
Dashboard, Profile, Settings, etc.
        │
        │ Read user data
        │ Call auth methods
        ▼
Automatic re-render on state change
```

---

## 🔑 Key Principles

1. **Single Source of Truth**: AuthContext manages all auth state
2. **Automatic Token Management**: Axios interceptors handle tokens
3. **Centralized Error Handling**: Errors caught and displayed
4. **Persistent State**: localStorage for cross-session persistence
5. **Role-Based Access**: Hierarchical permission system
6. **Optimistic Updates**: UI updates before API confirmation
7. **Graceful Degradation**: Handle network errors gracefully

---

## 📊 Performance Optimizations

```
✅ useCallback for methods (prevent re-renders)
✅ Single axios instance (reuse connections)
✅ localStorage caching (fast initial load)
✅ Token validation on mount only
✅ Lazy loading of protected routes
✅ Minimal re-renders with proper state management
```

---

## 🎨 Visual Component Tree

```
<BrowserRouter>
  <AuthProvider> ← Provides auth context
    <App>
      <Navbar> ← Can use useAuth()
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute> ← Checks auth
            <Dashboard /> ← Can use useAuth()
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="ADMIN"> ← Checks role
            <AdminPanel /> ← Admin only
          </ProtectedRoute>
        } />
      </Routes>
      <Footer> ← Can use useAuth()
    </App>
  </AuthProvider>
</BrowserRouter>
```

---

**Created:** December 23, 2025  
**Status:** Complete Documentation ✅
