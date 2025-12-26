# Admin Dashboard Frontend Integration Guide

> Complete API reference for implementing the Admin/Librarian Dashboard

---

## ⚠️ CRITICAL: Response Data Structure

> [!IMPORTANT]
> **All API responses are wrapped in a standardized format.** The axios interceptor in `api.js` extracts `response.data.data` automatically, so services receive the inner data directly.

### Paginated Endpoints Response Format

Paginated admin endpoints (`/admin/books`, `/admin/users`, `/admin/reservations`, `/admin/borrowings`) return data in a **nested structure**:

| Endpoint | Response Structure | Array Property |
|----------|-------------------|----------------|
| `/admin/books` | `{ books: [...], total, page, totalPages }` | `response.books` |
| `/admin/users` | `{ users: [...], total, page, totalPages }` | `response.users` |
| `/admin/reservations` | `{ reservations: [...], total, page, totalPages }` | `response.reservations` |
| `/admin/borrowings` | `{ borrowings: [...], total, page, totalPages }` | `response.borrowings` |

**Correct usage example:**
```javascript
const fetchBooks = async () => {
  const response = await adminService.getBooks({ page: 1, limit: 10 });
  // Response: { books: [...], total: 150, page: 1, totalPages: 15 }
  
  setBooks(response.books);        // ✅ CORRECT: Extract the named array
  setTotal(response.total);         // ✅ Pagination metadata
  setTotalPages(response.totalPages);
};
```

**Common mistake:**
```javascript
setBooks(response.data);  // ❌ WRONG: response.data is an OBJECT, not an array!
setBooks(response);       // ❌ WRONG: response is the whole object with pagination
```

### Non-Paginated Endpoints

Simple list endpoints (`/genres`, `/authors`, `/contact`) return arrays directly:
```javascript
const genres = await genreService.getGenres();  // Returns array directly
```

---

## Authentication

All admin endpoints require JWT authentication with **ADMIN** or **LIBRARIAN** role.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@booknest.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "user": { "id": "uuid", "email": "...", "role": "admin" },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

> **All subsequent requests need this header:**
> `Authorization: Bearer <accessToken>`

---

## Admin Dashboard Endpoints

### 1. Dashboard Statistics
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalBooks": 150,
    "totalAvailableBooks": 120,
    "totalBorrowedBooks": 25,
    "totalReservedBooks": 5,
    "totalUsers": 75,
    "totalActiveUsers": 70,
    "newUsersThisMonth": 8,
    "pendingReservations": 3,
    "confirmedReservations": 7,
    "todaysPickups": 2,
    "activeBorrowings": 30,
    "overdueBorrowings": 5,
    "totalFinesPending": 45.50,
    "totalGenres": 12,
    "totalAuthors": 45,
    "pendingMessages": 4
  }
}
```

### 2. Recent Activity Feed
```http
GET /api/admin/activity?limit=20
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Recent activity retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "type": "reservation",
      "description": "Reservation #RES-202312-XXXX - confirmed",
      "userId": "uuid",
      "userName": "John Doe",
      "bookTitle": "The Great Gatsby",
      "createdAt": "2024-12-26T10:30:00Z"
    },
    {
      "id": "uuid",
      "type": "borrowing",
      "description": "Book borrowed: 1984",
      "userId": "uuid",
      "userName": "Jane Smith",
      "bookId": "uuid",
      "bookTitle": "1984",
      "createdAt": "2024-12-26T09:15:00Z"
    }
  ]
}
```

### 3. Inventory Statistics
```http
GET /api/admin/inventory
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Inventory statistics retrieved successfully",
  "data": {
    "totalBooks": 150,
    "byStatus": {
      "available": 120,
      "reserved": 10,
      "borrowed": 15,
      "unavailable": 5
    },
    "lowStockBooks": [
      {
        "id": "uuid",
        "title": "Clean Code",
        "isbn": "9780132350884",
        "genre": "Technology",
        "authors": ["Robert C. Martin"],
        "totalCopies": 5,
        "availableCopies": 1,
        "status": "available",
        "isLowStock": true
      }
    ],
    "outOfStockBooks": [...]
  }
}
```

### 4. User Analytics
```http
GET /api/admin/analytics/users
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "User analytics retrieved successfully",
  "data": {
    "totalUsers": 75,
    "byRole": { "users": 72, "librarians": 2, "admins": 1 },
    "registrationTrends": [
      { "date": "2024-12-20", "count": 3 },
      { "date": "2024-12-21", "count": 1 }
    ],
    "topBorrowers": [
      { "userId": "uuid", "userName": "John Doe", "borrowCount": 15 }
    ]
  }
}
```

---

## Book Management

### List Books (Admin View)
```http
GET /api/admin/books?page=1&limit=20&status=available&genreId=uuid&search=keyword
Authorization: Bearer <token>
```

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |
| status | string | Filter: `available`, `reserved`, `borrowed`, `unavailable` |
| genreId | UUID | Filter by genre |
| search | string | Search in title/ISBN |

### Create Book
```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "isbn": "9780743273565",
  "publisher": "Scribner",
  "publicationYear": 1925,
  "pageCount": 180,
  "description": "A novel about...",
  "coverImageUrl": "https://...",
  "totalCopies": 5,
  "genreId": "uuid",
  "authorIds": ["uuid1", "uuid2"],
  "isFeatured": false,
  "isNewArrival": true
}
```

### Update Book
```http
PATCH /api/books/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "totalCopies": 10
}
```

### Delete Book (Admin Only)
```http
DELETE /api/books/:id
Authorization: Bearer <token>
```

---

## Reservation Management

### List All Reservations
```http
GET /api/admin/reservations?page=1&limit=20&status=pending
Authorization: Bearer <token>
```

| Status Values | Description |
|--------------|-------------|
| pending | Awaiting confirmation |
| confirmed | Ready for pickup |
| picked_up | Books collected |
| cancelled | User cancelled |
| expired | Not picked up in time |

### Mark as Picked Up
```http
PATCH /api/reservations/:id/pickup
Authorization: Bearer <token>
```

### Find by Reservation Number
```http
GET /api/reservations/by-number/:reservationNumber
Authorization: Bearer <token>
```

---

## Borrowing Management

### List All Borrowings
```http
GET /api/admin/borrowings?page=1&limit=20&status=active&overdue=true
Authorization: Bearer <token>
```

### Process Book Return
```http
PATCH /api/borrowings/:id/return
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Book returned successfully",
  "data": {
    "id": "uuid",
    "returnedDate": "2024-12-26T12:00:00Z",
    "fineAmount": 5.00,
    "status": "returned"
  }
}
```

### Mark Fine as Paid
```http
PATCH /api/borrowings/:id/pay-fine
Authorization: Bearer <token>
```

### Get Overdue Books
```http
GET /api/borrowings/overdue/all
Authorization: Bearer <token>
```

---

## Genre Management

### List All Genres
```http
GET /api/genres
```

### Create Genre
```http
POST /api/genres
Authorization: Bearer <token>

{ "name": "Science Fiction", "description": "..." }
```

### Update Genre
```http
PATCH /api/genres/:id
Authorization: Bearer <token>

{ "name": "Updated Name" }
```

### Delete Genre (Admin Only)
```http
DELETE /api/genres/:id
Authorization: Bearer <token>
```

---

## Author Management

### List All Authors
```http
GET /api/authors?search=keyword
```

### Create Author
```http
POST /api/authors
Authorization: Bearer <token>

{ "name": "Author Name", "bio": "..." }
```

### Update Author
```http
PATCH /api/authors/:id
Authorization: Bearer <token>

{ "name": "Updated Name" }
```

### Delete Author (Admin Only)
```http
DELETE /api/authors/:id
Authorization: Bearer <token>
```

---

## User Management

### List All Users
```http
GET /api/admin/users?page=1&limit=20&role=user&search=email
Authorization: Bearer <token>
```

### View User Details
```http
GET /api/users/:id
Authorization: Bearer <token>
```

---

## Contact Messages

### List All Messages
```http
GET /api/contact
Authorization: Bearer <token>
```

### Get Pending Messages
```http
GET /api/contact/pending
Authorization: Bearer <token>
```

### Get Pending Count
```http
GET /api/contact/pending/count
Authorization: Bearer <token>
```

### Mark as Read
```http
PATCH /api/contact/:id/read
Authorization: Bearer <token>
```

### Close Message
```http
PATCH /api/contact/:id/close
Authorization: Bearer <token>
```

---

## Error Handling

All errors return:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error |

---

## TypeScript Interfaces

```typescript
interface DashboardStats {
  totalBooks: number;
  totalAvailableBooks: number;
  totalBorrowedBooks: number;
  totalReservedBooks: number;
  totalUsers: number;
  totalActiveUsers: number;
  newUsersThisMonth: number;
  pendingReservations: number;
  confirmedReservations: number;
  todaysPickups: number;
  activeBorrowings: number;
  overdueBorrowings: number;
  totalFinesPending: number;
  totalGenres: number;
  totalAuthors: number;
  pendingMessages: number;
}

interface RecentActivity {
  id: string;
  type: 'reservation' | 'borrowing' | 'return' | 'new_user' | 'new_book';
  description: string;
  userId?: string;
  userName?: string;
  bookId?: string;
  bookTitle?: string;
  createdAt: string;
}

interface Book {
  id: string;
  title: string;
  isbn: string;
  publisher: string;
  publicationYear: number;
  pageCount: number;
  description: string;
  coverImageUrl?: string;
  totalCopies: number;
  availableCopies: number;
  status: 'available' | 'reserved' | 'borrowed' | 'unavailable';
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  genre: Genre;
  authors: Author[];
}

interface Reservation {
  id: string;
  reservationNumber: string;
  pickupDate: string;
  status: 'pending' | 'confirmed' | 'picked_up' | 'cancelled' | 'expired';
  qrCode?: string;
  user: User;
  items: ReservationItem[];
}

interface Borrowing {
  id: string;
  borrowedDate: string;
  dueDate: string;
  returnedDate?: string;
  status: 'active' | 'returned' | 'overdue' | 'extended';
  fineAmount: number;
  finePaid: boolean;
  user: User;
  book: Book;
}
```

---

## Quick Implementation Checklist

### Dashboard Page
- [ ] Fetch `/api/admin/dashboard` for stats cards
- [ ] Fetch `/api/admin/activity` for activity feed
- [ ] Implement auto-refresh every 30 seconds

### Books Management
- [ ] Fetch `/api/admin/books` with pagination
- [ ] Create book form with genre/author dropdowns
- [ ] Edit book modal
- [ ] Delete confirmation dialog

### Reservations
- [ ] Fetch `/api/admin/reservations?status=pending` for pending list
- [ ] "Mark as Picked Up" button calling `PATCH /api/reservations/:id/pickup`
- [ ] QR code scanner integration

### Borrowings
- [ ] Fetch `/api/admin/borrowings` with filters
- [ ] "Return Book" button calling `PATCH /api/borrowings/:id/return`
- [ ] "Pay Fine" button calling `PATCH /api/borrowings/:id/pay-fine`
- [ ] Overdue books alert section

### Categories
- [ ] Genres CRUD using `/api/genres`
- [ ] Authors CRUD using `/api/authors`

### Users
- [ ] User list with search from `/api/admin/users`
- [ ] User detail view
