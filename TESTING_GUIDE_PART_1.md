# 🧪 Testing Guide - Part 1: Authentication & User Management

## ✅ Manual Testing Checklist

### Prerequisites
- [ ] Backend running on `http://localhost:4000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Database connected and seeded
- [ ] CORS configured correctly
- [ ] Environment variables set

---

## 1️⃣ User Registration Tests

### Test Case 1.1: Successful Registration
**Steps:**
1. Navigate to `/register`
2. Fill in all required fields:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john.doe@test.com"
   - Password: "Password123!"
   - Confirm Password: "Password123!"
3. Click "Register"

**Expected:**
- ✅ Success message or redirect to dashboard
- ✅ Token stored in localStorage (`accessToken`)
- ✅ User data stored in localStorage (`user`)
- ✅ User is logged in automatically
- ✅ Redirected to dashboard or home

### Test Case 1.2: Registration with Optional Fields
**Steps:**
1. Navigate to `/register`
2. Fill required fields + optional fields:
   - Phone: "1234567890"
   - Address: "123 Main St"
3. Click "Register"

**Expected:**
- ✅ Registration successful
- ✅ Phone and address saved in profile

### Test Case 1.3: Duplicate Email
**Steps:**
1. Try to register with an existing email

**Expected:**
- ❌ Error message: "Email already exists"
- ❌ No navigation occurs
- ❌ Form remains filled

### Test Case 1.4: Password Validation
**Steps:**
1. Try various invalid passwords:
   - Too short: "Pass1!"
   - No uppercase: "password123!"
   - No lowercase: "PASSWORD123!"
   - No special char: "Password123"

**Expected:**
- ❌ Validation error for each case
- ❌ Cannot submit form

### Test Case 1.5: Email Validation
**Steps:**
1. Try invalid email formats:
   - "notanemail"
   - "test@"
   - "@test.com"

**Expected:**
- ❌ Email validation error
- ❌ Cannot submit form

### Test Case 1.6: Password Mismatch
**Steps:**
1. Enter different passwords in password and confirm fields

**Expected:**
- ❌ Error: "Passwords do not match"
- ❌ Cannot submit

---

## 2️⃣ User Login Tests

### Test Case 2.1: Successful Login
**Steps:**
1. Navigate to `/login`
2. Enter valid credentials:
   - Email: "john.doe@test.com"
   - Password: "Password123!"
3. Click "Login"

**Expected:**
- ✅ Success message or redirect
- ✅ Token stored in localStorage
- ✅ User data stored in localStorage
- ✅ Dark mode applied if enabled in profile
- ✅ Redirected to previous page or dashboard

### Test Case 2.2: Invalid Credentials
**Steps:**
1. Try to login with wrong password

**Expected:**
- ❌ Error message: "Invalid credentials"
- ❌ No navigation
- ❌ No data stored
- ❌ Form stays visible

### Test Case 2.3: Non-existent User
**Steps:**
1. Try to login with email that doesn't exist

**Expected:**
- ❌ Error message
- ❌ No login occurs

### Test Case 2.4: Dark Mode on Login
**Steps:**
1. Create user with dark mode enabled
2. Logout
3. Login again

**Expected:**
- ✅ Dark mode automatically applied after login
- ✅ `dark` class added to `document.documentElement`

### Test Case 2.5: Saved Location Redirect
**Steps:**
1. Logout
2. Try to access `/dashboard` (protected)
3. Get redirected to `/login`
4. Login successfully

**Expected:**
- ✅ After login, redirected to `/dashboard` (the attempted page)

---

## 3️⃣ Current User & Profile Tests

### Test Case 3.1: Get Current User
**Steps:**
1. Login
2. Open DevTools → Console
3. Run: `localStorage.getItem('user')`

**Expected:**
- ✅ User object present with all fields
- ✅ Contains: id, email, firstName, lastName, role, membershipId, etc.

### Test Case 3.2: Profile Page Display
**Steps:**
1. Login
2. Navigate to profile page

**Expected:**
- ✅ All user data displayed correctly
- ✅ Name, email, member ID, phone, address
- ✅ Role displayed
- ✅ Total books borrowed shown

### Test Case 3.3: Token Validation on App Load
**Steps:**
1. Login
2. Refresh the page
3. Wait for app to load

**Expected:**
- ✅ User remains logged in
- ✅ Profile data loaded
- ✅ No redirect to login

### Test Case 3.4: Expired Token Handling
**Steps:**
1. Login
2. Manually clear token: `localStorage.setItem('accessToken', 'invalid')`
3. Refresh page or make API call

**Expected:**
- ❌ Automatic logout
- ❌ Redirect to login
- ❌ localStorage cleared

---

## 4️⃣ Update Profile Tests

### Test Case 4.1: Update Name
**Steps:**
1. Login
2. Go to profile edit
3. Change first name to "Jane"
4. Save

**Expected:**
- ✅ Success message
- ✅ Name updated in UI
- ✅ localStorage updated
- ✅ Backend updated

### Test Case 4.2: Update Phone & Address
**Steps:**
1. Update phone to "9876543210"
2. Update address to "456 Elm St"
3. Save

**Expected:**
- ✅ Both fields updated
- ✅ Changes persisted after page refresh

### Test Case 4.3: Clear Optional Fields
**Steps:**
1. Set phone and address to empty
2. Save

**Expected:**
- ✅ Fields cleared
- ✅ Saved as null/empty in backend

### Test Case 4.4: Validation on Update
**Steps:**
1. Try to save empty first name

**Expected:**
- ❌ Validation error
- ❌ Cannot save

---

## 5️⃣ Change Password Tests

### Test Case 5.1: Successful Password Change
**Steps:**
1. Login
2. Go to change password
3. Enter current password
4. Enter new password (valid)
5. Confirm new password
6. Submit

**Expected:**
- ✅ Success message
- ✅ Password changed in backend
- ✅ Can login with new password
- ✅ Cannot login with old password

### Test Case 5.2: Wrong Current Password
**Steps:**
1. Enter incorrect current password
2. Enter new password
3. Submit

**Expected:**
- ❌ Error: "Current password is incorrect"
- ❌ Password not changed

### Test Case 5.3: Password Mismatch
**Steps:**
1. Enter correct current password
2. Enter different values for new password and confirm
3. Submit

**Expected:**
- ❌ Error: "Passwords do not match"
- ❌ Cannot submit

### Test Case 5.4: Invalid New Password
**Steps:**
1. Try to change to weak password (e.g., "123456")

**Expected:**
- ❌ Validation error
- ❌ Password not changed

---

## 6️⃣ Dark Mode Tests

### Test Case 6.1: Enable Dark Mode
**Steps:**
1. Login (dark mode disabled)
2. Toggle dark mode ON
3. Check UI

**Expected:**
- ✅ Dark theme applied immediately
- ✅ `document.documentElement.classList` contains 'dark'
- ✅ Preference saved to backend
- ✅ localStorage user updated

### Test Case 6.2: Dark Mode Persists
**Steps:**
1. Enable dark mode
2. Logout
3. Login again

**Expected:**
- ✅ Dark mode automatically applied on login

### Test Case 6.3: Disable Dark Mode
**Steps:**
1. With dark mode ON
2. Toggle dark mode OFF

**Expected:**
- ✅ Light theme applied
- ✅ 'dark' class removed
- ✅ Preference saved

### Test Case 6.4: Dark Mode Across Pages
**Steps:**
1. Enable dark mode
2. Navigate to different pages

**Expected:**
- ✅ Dark mode persists across all pages
- ✅ No flashing between themes

---

## 7️⃣ Logout Tests

### Test Case 7.1: Successful Logout
**Steps:**
1. Login
2. Click logout button

**Expected:**
- ✅ Redirected to login page
- ✅ localStorage cleared (`accessToken` and `user` removed)
- ✅ Dark mode disabled
- ✅ Cannot access protected routes

### Test Case 7.2: Logout Clears Dark Mode
**Steps:**
1. Login with dark mode enabled
2. Logout

**Expected:**
- ✅ 'dark' class removed from document
- ✅ UI returns to light mode

### Test Case 7.3: Cannot Access Protected Routes After Logout
**Steps:**
1. Logout
2. Try to navigate to `/dashboard`

**Expected:**
- ❌ Redirected to `/login`
- ❌ Dashboard not accessible

---

## 8️⃣ Protected Routes Tests

### Test Case 8.1: Access Protected Route While Logged In
**Steps:**
1. Login
2. Navigate to `/dashboard`

**Expected:**
- ✅ Dashboard page loads
- ✅ Content displayed

### Test Case 8.2: Access Protected Route While Logged Out
**Steps:**
1. Logout
2. Try to navigate to `/dashboard`

**Expected:**
- ❌ Redirected to `/login`
- ❌ Attempted URL saved in location state

### Test Case 8.3: Loading State
**Steps:**
1. Clear localStorage
2. Add token manually
3. Refresh page
4. Observe loading state

**Expected:**
- ✅ Loading spinner shown while validating token
- ✅ Content loads after validation

---

## 9️⃣ Role-Based Access Tests

### Test Case 9.1: Member Access
**Steps:**
1. Login as MEMBER
2. Try to access admin routes

**Expected:**
- ❌ Redirected to `/unauthorized`
- ❌ Admin features not visible

### Test Case 9.2: Librarian Access
**Steps:**
1. Login as LIBRARIAN
2. Access book management routes

**Expected:**
- ✅ Can access book management
- ✅ Can view all users
- ❌ Cannot access admin-only features

### Test Case 9.3: Admin Access
**Steps:**
1. Login as ADMIN
2. Try all routes

**Expected:**
- ✅ Can access all routes
- ✅ All features available

### Test Case 9.4: Role-Based UI Elements
**Steps:**
1. Login with different roles
2. Check navigation/UI

**Expected:**
- ✅ Admin sees all menu items
- ✅ Librarian sees book management
- ✅ Member sees only basic features

---

## 🔟 Admin User Management Tests

### Test Case 10.1: Get All Users (Admin)
**Steps:**
1. Login as ADMIN
2. Navigate to user management
3. View user list

**Expected:**
- ✅ All users displayed
- ✅ Shows: name, email, role, membershipId, books borrowed

### Test Case 10.2: Get All Users (Non-Admin)
**Steps:**
1. Login as MEMBER
2. Try to access user list API

**Expected:**
- ❌ 403 Forbidden error
- ❌ Cannot view user list

### Test Case 10.3: Get User By ID (Admin)
**Steps:**
1. Login as ADMIN
2. Click on a user to view details

**Expected:**
- ✅ Full user details displayed
- ✅ All fields visible

### Test Case 10.4: Get User By ID (Librarian)
**Steps:**
1. Login as LIBRARIAN
2. Try to view user details

**Expected:**
- ✅ Can view user details (librarians have access)

---

## 1️⃣1️⃣ Error Handling Tests

### Test Case 11.1: Network Error
**Steps:**
1. Stop backend server
2. Try to login

**Expected:**
- ❌ Error message: "Network error" or similar
- ❌ No crash
- ❌ Form remains usable

### Test Case 11.2: 401 Unauthorized
**Steps:**
1. Login
2. Manually corrupt token in localStorage
3. Make API call

**Expected:**
- ❌ Automatic logout
- ❌ Redirect to login
- ✅ Clear error message

### Test Case 11.3: 403 Forbidden
**Steps:**
1. Login as MEMBER
2. Try to access admin route with ProtectedRoute

**Expected:**
- ❌ Redirect to `/unauthorized`
- ✅ Unauthorized page shown with options

### Test Case 11.4: Error State in Context
**Steps:**
1. Trigger an error (wrong credentials)
2. Check `useAuth().error`

**Expected:**
- ✅ Error message available in context
- ✅ Can be displayed in UI
- ✅ Can be cleared with `clearError()`

---

## 1️⃣2️⃣ localStorage Tests

### Test Case 12.1: Token Storage
**Steps:**
1. Login
2. Check localStorage

**Expected:**
- ✅ Key `accessToken` exists
- ✅ Value is a valid JWT token
- ✅ Token format: `eyJhbGciOiJIUzI1...`

### Test Case 12.2: User Storage
**Steps:**
1. Login
2. Check `localStorage.getItem('user')`

**Expected:**
- ✅ Valid JSON object
- ✅ Contains all user fields
- ✅ Can be parsed with `JSON.parse()`

### Test Case 12.3: Storage Updates
**Steps:**
1. Update profile
2. Check localStorage

**Expected:**
- ✅ User object updated with new values
- ✅ Changes reflected immediately

### Test Case 12.4: Storage Cleared on Logout
**Steps:**
1. Login
2. Logout
3. Check localStorage

**Expected:**
- ❌ No `accessToken` key
- ❌ No `user` key
- ✅ All auth data removed

---

## 1️⃣3️⃣ Integration Tests

### Test Case 13.1: Full User Journey
**Steps:**
1. Register new account
2. Auto-login after registration
3. View dashboard
4. Update profile
5. Change password
6. Toggle dark mode
7. Logout
8. Login with new password

**Expected:**
- ✅ All steps complete successfully
- ✅ No errors or issues

### Test Case 13.2: Cross-Component State
**Steps:**
1. Login
2. Update name in profile
3. Check navbar (should show new name)
4. Navigate to different page
5. Name still updated

**Expected:**
- ✅ State synchronized across components
- ✅ All components show updated data

### Test Case 13.3: Multiple Tabs
**Steps:**
1. Open app in two tabs
2. Login in tab 1
3. Refresh tab 2

**Expected:**
- ✅ Tab 2 recognizes login (localStorage shared)
- ⚠️ OR tab 2 needs manual refresh (expected behavior)

---

## 🎯 Performance Tests

### Test Case 14.1: Initial Load Time
**Steps:**
1. Clear cache
2. Load app
3. Measure time to interactive

**Expected:**
- ✅ Page loads in < 2 seconds
- ✅ No unnecessary API calls

### Test Case 14.2: Token Validation Speed
**Steps:**
1. With valid token
2. Refresh page
3. Measure time to show content

**Expected:**
- ✅ Validation completes quickly (< 500ms)
- ✅ Smooth loading state

### Test Case 14.3: No Unnecessary Re-renders
**Steps:**
1. Open React DevTools
2. Enable "Highlight updates"
3. Interact with app

**Expected:**
- ✅ Only affected components re-render
- ✅ No infinite re-render loops

---

## 🔒 Security Tests

### Test Case 15.1: XSS Protection
**Steps:**
1. Try to input `<script>alert('XSS')</script>` in fields
2. Submit

**Expected:**
- ✅ Script not executed
- ✅ Stored as plain text

### Test Case 15.2: Token Security
**Steps:**
1. Check token storage location

**Expected:**
- ✅ Stored in localStorage (acceptable for JWT)
- ✅ Not exposed in URL or cookies

### Test Case 15.3: CORS Protection
**Steps:**
1. Try to make API call from different origin

**Expected:**
- ❌ CORS error (backend should block)

---

## 📝 Test Results Template

```
Date: _______________
Tester: _____________
Environment: Development / Staging / Production

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1.1 | ✅/❌ |       |
| 1.2 | ✅/❌ |       |
| ... | ✅/❌ |       |

Issues Found:
1. _______________________________
2. _______________________________

Overall Status: PASS / FAIL
```

---

## 🚀 Automated Testing (Future)

### Recommended Test Framework
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Jest + React Testing Library
- **E2E Tests**: Cypress or Playwright

### Example Test Cases
```javascript
// authService.test.js
describe('authService', () => {
  test('login returns user and token', async () => {
    const result = await authService.login('test@test.com', 'password');
    expect(result.data.user).toBeDefined();
    expect(result.data.accessToken).toBeDefined();
  });
});

// AuthContext.test.js
describe('AuthContext', () => {
  test('login updates user state', async () => {
    const { result } = renderHook(() => useAuth());
    await act(() => result.current.login('test@test.com', 'password'));
    expect(result.current.user).toBeDefined();
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

---

## ✅ Test Coverage Goals

- **Services**: 100% (all functions tested)
- **Components**: 80%+ (critical paths covered)
- **Utils**: 100% (all utility functions)
- **Context**: 100% (all state changes)

---

**Status:** Ready for Testing ✅  
**Last Updated:** December 23, 2025
