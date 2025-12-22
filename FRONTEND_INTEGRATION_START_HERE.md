# 🎯 Frontend Integration Guide - START HERE

Welcome to the complete frontend integration documentation for the **Library Management System**!

---

## 📚 What You Have

This documentation provides **EVERYTHING** you need to connect your frontend to the backend API:

✅ **70+ API endpoints** fully documented  
✅ **Complete request/response formats** with TypeScript types  
✅ **Ready-to-use code examples** (fetch & axios)  
✅ **React component patterns** with hooks  
✅ **Error handling patterns**  
✅ **Authentication & authorization** implementation  
✅ **File upload handling**  
✅ **Complete page examples**  

---

## 🚀 Quick Start

### 1. **Backend Configuration**
- **Base URL:** `http://localhost:4000/api`
- **Port:** 4000
- **API Prefix:** `/api` (already included in examples)
- **Authentication:** JWT Bearer Token
- **CORS:** Enabled for `http://localhost:5173`

### 2. **Authentication Flow**
1. User registers/logs in → Receives JWT token
2. Store token in `localStorage`
3. Include token in `Authorization` header for protected routes
4. Handle 401 errors by redirecting to login

### 3. **File Structure Suggestion**
```
src/
├── services/
│   ├── authService.ts
│   ├── userService.ts
│   ├── bookService.ts
│   ├── authorService.ts
│   ├── genreService.ts
│   ├── borrowingService.ts
│   ├── reservationService.ts
│   ├── wishlistService.ts
│   ├── reviewService.ts
│   └── contactService.ts
├── utils/
│   ├── auth.ts
│   └── axios.ts
├── context/
│   └── AuthContext.tsx
└── components/
    └── ProtectedRoute.tsx
```

---

## 📖 Documentation Structure

### 🔍 [API_ENDPOINTS_QUICK_REFERENCE.md](API_ENDPOINTS_QUICK_REFERENCE.md)
**START HERE for a quick overview!**
- Complete list of all 70+ endpoints
- HTTP methods, authentication requirements, roles
- Quick lookup table format
- Status codes reference

### 📘 [FRONTEND_INTEGRATION_GUIDE_PART_1.md](FRONTEND_INTEGRATION_GUIDE_PART_1.md)
**Authentication & User Management**
- User Registration
- User Login
- Get Current User
- Change Password
- User Profile Management
- Dark Mode Toggle
- Admin User Management
- Setup utilities (Auth helpers, Axios config, Protected Routes)

### 📗 [FRONTEND_INTEGRATION_GUIDE_PART_2.md](FRONTEND_INTEGRATION_GUIDE_PART_2.md)
**Books, Authors & Genres**
- Books CRUD with pagination & filtering
- Featured, New Arrivals, Popular books
- Book availability checking
- Authors CRUD
- Genres CRUD
- Search functionality
- Complete catalog page example

### 📙 [FRONTEND_INTEGRATION_GUIDE_PART_3.md](FRONTEND_INTEGRATION_GUIDE_PART_3.md)
**Borrowings, Reservations & Wishlist**
- Borrowings management (active, history, extend)
- Dashboard statistics
- Reservation system (create, confirm, cancel, QR codes)
- Wishlist management (add, remove, check)
- Admin borrowing operations
- Complete reservation flow example

### 📕 [FRONTEND_INTEGRATION_GUIDE_PART_4.md](FRONTEND_INTEGRATION_GUIDE_PART_4.md)
**Reviews, Contact & Storage**
- Book reviews system
- Contact form (public & authenticated)
- Admin message management
- File uploads (book covers)
- Complete integration examples

---

## 🎯 Implementation Roadmap

### Phase 1: Core Setup (Day 1)
1. ✅ Set up axios instance with base URL
2. ✅ Create authentication utilities
3. ✅ Implement auth service (login, register)
4. ✅ Create AuthContext provider
5. ✅ Build ProtectedRoute component
6. ✅ Create Login & Register pages

### Phase 2: Books Catalog (Day 2-3)
1. ✅ Implement book service
2. ✅ Build book listing with pagination
3. ✅ Add search & filter functionality
4. ✅ Create book details page
5. ✅ Implement authors & genres services

### Phase 3: User Features (Day 4-5)
1. ✅ User dashboard with statistics
2. ✅ Borrowings management
3. ✅ Reservations system
4. ✅ Wishlist functionality
5. ✅ Reviews system

### Phase 4: Additional Features (Day 6)
1. ✅ Contact form
2. ✅ User profile management
3. ✅ Dark mode toggle
4. ✅ File upload for book covers

### Phase 5: Admin Panel (Day 7)
1. ✅ Admin dashboard
2. ✅ Book/Author/Genre management
3. ✅ Borrowing operations
4. ✅ Reservation management
5. ✅ Contact messages handling

---

## 💡 Important Notes

### Authentication
- **Token Storage:** Use `localStorage.setItem('accessToken', token)`
- **Token Retrieval:** `localStorage.getItem('accessToken')`
- **Authorization Header:** `Authorization: Bearer ${token}`
- **Logout:** Clear localStorage and redirect to login

### Error Handling
```typescript
try {
  const response = await fetch(url, options);
  
  if (response.status === 401) {
    // Redirect to login
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
    return;
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return await response.json();
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

### Role-Based Access
```typescript
// Check user role
const user = JSON.parse(localStorage.getItem('user'));
const isAdmin = user?.role === 'ADMIN';
const isLibrarian = user?.role === 'LIBRARIAN';
const canManageBooks = isAdmin || isLibrarian;
```

### Pagination
```typescript
const [filters, setFilters] = useState({
  page: 1,
  limit: 12,
  search: '',
  genreId: '',
});

// Update page
const handlePageChange = (newPage) => {
  setFilters(prev => ({ ...prev, page: newPage }));
};
```

---

## 🛠️ Common Patterns

### Service Function Template
```typescript
export const apiFunction = async (params) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/endpoint`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Operation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};
```

### Component Usage Template
```typescript
const Component = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiFunction();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* Render data */}</div>;
};
```

---

## 🎨 Response Format

All API responses follow this structure:

### Success Response
```typescript
{
  message: string;  // Success message
  data: any;        // Response data
  meta?: {          // Optional pagination metadata
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### Error Response
```typescript
{
  statusCode: number;
  message: string;    // Error message
  error?: string;     // Error type
}
```

---

## 📞 Need Help?

### Checklist Before Starting
- [ ] Backend is running on `http://localhost:4000`
- [ ] Can access `http://localhost:4000/api` (should return API info)
- [ ] Database is connected (check backend logs)
- [ ] CORS is configured for your frontend URL
- [ ] You have all 5 documentation files

### Common Issues

**401 Unauthorized**
- Check if token is stored in localStorage
- Verify token is included in Authorization header
- Token might be expired (re-login)

**403 Forbidden**
- User doesn't have required role (Admin/Librarian)
- Check user.role in localStorage

**404 Not Found**
- Verify endpoint URL includes `/api` prefix
- Check if resource ID exists
- Verify HTTP method (GET, POST, etc.)

**CORS Error**
- Backend CORS must allow your frontend origin
- Check `ALLOWED_ORIGINS` in backend .env

---

## 🎉 You're Ready!

You now have everything needed to build a fully-functional library management system frontend!

**Key Features to Implement:**
- 📚 Browse & search books
- 👤 User authentication & profile
- 📖 Borrow & return books
- 🎫 Reserve multiple books
- ❤️ Wishlist management
- ⭐ Book reviews
- 📧 Contact form
- 🎨 Dark mode
- 🔐 Role-based access (Admin/Librarian/Member)

**Good luck with your implementation! 🚀**

---

**Documentation Version:** 1.0  
**Last Updated:** December 23, 2025  
**Backend Version:** NestJS + PostgreSQL  
**Total Endpoints:** 70+
