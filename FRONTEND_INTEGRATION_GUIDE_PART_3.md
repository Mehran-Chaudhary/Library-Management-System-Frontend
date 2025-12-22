# 🚀 Frontend Integration Guide - Part 3: Borrowings, Reservations & Wishlist

**Backend Base URL:** `http://localhost:4000/api`

---

## 📋 Table of Contents
1. [Borrowings Management](#1-borrowings-management)
2. [Reservations System](#2-reservations-system)
3. [Wishlist Management](#3-wishlist-management)

---

## 1. BORROWINGS MANAGEMENT

### 1.1 Get User's Borrowings

**Endpoint:** `GET /borrowings/my-borrowings`  
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
  message: "Borrowings retrieved successfully",
  data: [
    {
      id: string;
      borrowedDate: string;  // ISO date
      dueDate: string;       // ISO date
      returnedDate: string | null;  // ISO date or null
      status: "ACTIVE" | "RETURNED" | "OVERDUE";
      fineAmount: number;
      finePaid: boolean;
      hasBeenExtended: boolean;
      book: {
        id: string;
        title: string;
        coverImage: string;
        isbn: string;
        authors: [...];
      };
      user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/borrowingService.ts
const API_URL = 'http://localhost:4000/api';

export const getMyBorrowings = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/borrowings/my-borrowings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch borrowings');
    return await response.json();
  } catch (error) {
    console.error('Get borrowings error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/MyBorrowings.tsx
const [borrowings, setBorrowings] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const result = await getMyBorrowings();
      setBorrowings(result.data);
    } catch (error) {
      console.error('Error fetching borrowings:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchBorrowings();
}, []);
```

---

### 1.2 Get Active Borrowings

**Endpoint:** `GET /borrowings/active`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Active borrowings retrieved successfully",
  data: [
    {
      id: string;
      borrowedDate: string;
      dueDate: string;
      status: "ACTIVE" | "OVERDUE";
      hasBeenExtended: boolean;
      remainingDays: number;      // Calculated field
      isOverdue: boolean;         // Calculated field
      book: {
        id: string;
        title: string;
        coverImage: string;
        authors: [...];
      };
      fineAmount: number;
      createdAt: string;
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/borrowingService.ts
export const getActiveBorrowings = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/borrowings/active`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch active borrowings');
    return await response.json();
  } catch (error) {
    console.error('Get active borrowings error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/ActiveBorrowings.tsx
const [activeBorrowings, setActiveBorrowings] = useState([]);

useEffect(() => {
  const fetchActive = async () => {
    const result = await getActiveBorrowings();
    setActiveBorrowings(result.data);
  };
  fetchActive();
}, []);

return (
  <div>
    {activeBorrowings.map(borrowing => (
      <div key={borrowing.id} className={borrowing.isOverdue ? 'overdue' : ''}>
        <h3>{borrowing.book.title}</h3>
        <p>
          {borrowing.isOverdue 
            ? `Overdue by ${Math.abs(borrowing.remainingDays)} days` 
            : `Due in ${borrowing.remainingDays} days`
          }
        </p>
        {borrowing.fineAmount > 0 && (
          <p className="fine">Fine: ${borrowing.fineAmount.toFixed(2)}</p>
        )}
      </div>
    ))}
  </div>
);
```

---

### 1.3 Get Borrowing History

**Endpoint:** `GET /borrowings/history`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Borrowing history retrieved successfully",
  data: [
    {
      id: string;
      borrowedDate: string;
      dueDate: string;
      returnedDate: string;
      status: "RETURNED";
      fineAmount: number;
      finePaid: boolean;
      book: {
        id: string;
        title: string;
        coverImage: string;
        authors: [...];
      };
      createdAt: string;
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/borrowingService.ts
export const getBorrowingHistory = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/borrowings/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch borrowing history');
    return await response.json();
  } catch (error) {
    console.error('Get borrowing history error:', error);
    throw error;
  }
};
```

---

### 1.4 Get Dashboard Statistics

**Endpoint:** `GET /borrowings/dashboard`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Dashboard stats retrieved successfully",
  data: {
    totalBorrowings: number;
    activeBorrowings: number;
    overdueBorrowings: number;
    totalFines: number;
    booksReadThisMonth: number;
    favoriteGenre: string | null;
  }
}
```

#### Frontend Implementation:
```typescript
// services/borrowingService.ts
export const getDashboardStats = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/borrowings/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return await response.json();
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// pages/UserDashboard.tsx
const [stats, setStats] = useState(null);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const result = await getDashboardStats();
      setStats(result.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  fetchStats();
}, []);

return (
  <div className="dashboard">
    <div className="stat-card">
      <h3>{stats?.totalBorrowings}</h3>
      <p>Total Borrowings</p>
    </div>
    <div className="stat-card">
      <h3>{stats?.activeBorrowings}</h3>
      <p>Active Borrowings</p>
    </div>
    <div className="stat-card alert">
      <h3>{stats?.overdueBorrowings}</h3>
      <p>Overdue Books</p>
    </div>
    <div className="stat-card">
      <h3>${stats?.totalFines.toFixed(2)}</h3>
      <p>Total Fines</p>
    </div>
  </div>
);
```

---

### 1.5 Extend Borrowing

**Endpoint:** `PATCH /borrowings/:id/extend`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Borrowing extended successfully for 7 days",
  data: {
    id: string;
    newDueDate: string;  // ISO date
    hasBeenExtended: boolean;
  }
}
```

#### Frontend Implementation:
```typescript
// services/borrowingService.ts
export const extendBorrowing = async (borrowingId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(
      `${API_URL}/borrowings/${borrowingId}/extend`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to extend borrowing');
    }

    return await response.json();
  } catch (error) {
    console.error('Extend borrowing error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/BorrowingCard.tsx
const handleExtend = async () => {
  if (borrowing.hasBeenExtended) {
    alert('This borrowing has already been extended');
    return;
  }

  try {
    setExtending(true);
    const result = await extendBorrowing(borrowing.id);
    
    // Update the borrowing data
    setBorrowing(prev => ({
      ...prev,
      dueDate: result.data.newDueDate,
      hasBeenExtended: true,
    }));

    toast.success('Borrowing extended successfully!');
  } catch (err) {
    toast.error(err.message);
  } finally {
    setExtending(false);
  }
};
```

---

### 1.6 Get Single Borrowing

**Endpoint:** `GET /borrowings/:id`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Borrowing retrieved successfully",
  data: {
    id: string;
    borrowedDate: string;
    dueDate: string;
    returnedDate: string | null;
    status: string;
    fineAmount: number;
    finePaid: boolean;
    hasBeenExtended: boolean;
    book: {
      id: string;
      title: string;
      isbn: string;
      coverImage: string;
      authors: [...];
      genres: [...];
    };
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      membershipId: string;
    };
    createdAt: string;
    updatedAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/borrowingService.ts
export const getBorrowingById = async (borrowingId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/borrowings/${borrowingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch borrowing');
    return await response.json();
  } catch (error) {
    console.error('Get borrowing by ID error:', error);
    throw error;
  }
};
```

---

### 1.7 Admin/Librarian Endpoints

#### Get All Borrowings
**Endpoint:** `GET /borrowings`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
// services/borrowingService.ts (Admin)
export const getAllBorrowings = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/borrowings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch all borrowings');
    return await response.json();
  } catch (error) {
    console.error('Get all borrowings error:', error);
    throw error;
  }
};
```

#### Create Borrowing (Manual)
**Endpoint:** `POST /borrowings`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
// Request Body
{
  userId: string;          // UUID
  bookId: string;          // UUID
  borrowedDate: string;    // ISO date
  duration: "ONE_WEEK" | "TWO_WEEKS" | "ONE_MONTH";
  reservationId?: string;  // Optional UUID
}

// Frontend Implementation
export const createBorrowing = async (borrowingData) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/borrowings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(borrowingData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create borrowing');
    }

    return await response.json();
  } catch (error) {
    console.error('Create borrowing error:', error);
    throw error;
  }
};
```

#### Return Book
**Endpoint:** `PATCH /borrowings/:id/return`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
export const returnBook = async (borrowingId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(
      `${API_URL}/borrowings/${borrowingId}/return`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to return book');
    return await response.json();
  } catch (error) {
    console.error('Return book error:', error);
    throw error;
  }
};
```

#### Pay Fine
**Endpoint:** `PATCH /borrowings/:id/pay-fine`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
export const payFine = async (borrowingId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(
      `${API_URL}/borrowings/${borrowingId}/pay-fine`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to pay fine');
    return await response.json();
  } catch (error) {
    console.error('Pay fine error:', error);
    throw error;
  }
};
```

#### Get All Overdue Borrowings
**Endpoint:** `GET /borrowings/overdue/all`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
export const getOverdueBorrowings = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/borrowings/overdue/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch overdue borrowings');
    return await response.json();
  } catch (error) {
    console.error('Get overdue borrowings error:', error);
    throw error;
  }
};
```

---

## 2. RESERVATIONS SYSTEM

### 2.1 Create Reservation

**Endpoint:** `POST /reservations`  
**Authentication:** Required (JWT)

#### Request Body:
```typescript
{
  pickupDate: string;  // ISO date, must be future date
  items: [
    {
      bookId: string;  // UUID
      borrowingDuration: "ONE_WEEK" | "TWO_WEEKS" | "ONE_MONTH";
    }
  ];  // Min 1, Max 5 items
  notes?: string;  // Optional notes
}
```

#### Response (201 Created):
```typescript
{
  message: "Reservation created successfully",
  data: {
    id: string;
    reservationNumber: string;  // e.g., "RES-2024-001234"
    pickupDate: string;
    status: "PENDING";
    notes: string | null;
    qrCode: string | null;  // Generated after confirmation
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    items: [
      {
        id: string;
        borrowingDuration: string;
        dueDate: string | null;
        book: {
          id: string;
          title: string;
          coverImage: string;
          authors: [...];
        };
      }
    ];
    createdAt: string;
    updatedAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/reservationService.ts
const API_URL = 'http://localhost:4000/api';

export const createReservation = async (reservationData) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create reservation');
    }

    return await response.json();
  } catch (error) {
    console.error('Create reservation error:', error);
    throw error;
  }
};
```

#### Component Usage (Shopping Cart Style):
```typescript
// components/ReservationCart.tsx
const [cart, setCart] = useState([]);  // Books to reserve
const [pickupDate, setPickupDate] = useState('');

const handleReserve = async () => {
  // Validate
  if (cart.length === 0) {
    toast.error('Please add books to your reservation');
    return;
  }

  if (cart.length > 5) {
    toast.error('Maximum 5 books per reservation');
    return;
  }

  if (!pickupDate) {
    toast.error('Please select a pickup date');
    return;
  }

  const reservationData = {
    pickupDate,
    items: cart.map(item => ({
      bookId: item.bookId,
      borrowingDuration: item.duration || 'TWO_WEEKS',
    })),
    notes: notes || '',
  };

  try {
    setLoading(true);
    const result = await createReservation(reservationData);
    
    toast.success('Reservation created successfully!');
    
    // Clear cart
    setCart([]);
    
    // Navigate to reservation details
    navigate(`/reservations/${result.data.id}`);
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

### 2.2 Confirm Reservation

**Endpoint:** `PATCH /reservations/:id/confirm`  
**Authentication:** Required (JWT)

#### Request Body:
```typescript
{
  paymentMethod: "CASH" | "CARD" | "ONLINE";
}
```

#### Response (200 OK):
```typescript
{
  message: "Reservation confirmed successfully",
  data: {
    id: string;
    reservationNumber: string;
    qrCode: string;  // QR code URL for pickup
    pickupDate: string;
    items: [
      {
        book: {
          id: string;
          title: string;
          authors: [...];
        };
        dueDate: string;
        borrowingDuration: string;
      }
    ];
    status: "CONFIRMED";
  }
}
```

#### Frontend Implementation:
```typescript
// services/reservationService.ts
export const confirmReservation = async (reservationId, paymentMethod) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(
      `${API_URL}/reservations/${reservationId}/confirm`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethod }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to confirm reservation');
    }

    return await response.json();
  } catch (error) {
    console.error('Confirm reservation error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/ReservationConfirmation.tsx
const handleConfirm = async (paymentMethod) => {
  try {
    setConfirming(true);
    const result = await confirmReservation(reservationId, paymentMethod);
    
    // Show QR code
    setQrCode(result.data.qrCode);
    
    toast.success('Reservation confirmed! Show this QR code during pickup.');
  } catch (err) {
    toast.error(err.message);
  } finally {
    setConfirming(false);
  }
};
```

---

### 2.3 Cancel Reservation

**Endpoint:** `PATCH /reservations/:id/cancel`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Reservation cancelled successfully",
  data: {
    id: string;
    status: "CANCELLED";
    // ... reservation details
  }
}
```

#### Frontend Implementation:
```typescript
// services/reservationService.ts
export const cancelReservation = async (reservationId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(
      `${API_URL}/reservations/${reservationId}/cancel`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel reservation');
    }

    return await response.json();
  } catch (error) {
    console.error('Cancel reservation error:', error);
    throw error;
  }
};
```

---

### 2.4 Get My Reservations

**Endpoint:** `GET /reservations/my-reservations`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Reservations retrieved successfully",
  data: [
    {
      id: string;
      reservationNumber: string;
      pickupDate: string;
      status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "EXPIRED";
      qrCode: string | null;
      notes: string | null;
      items: [
        {
          id: string;
          borrowingDuration: string;
          dueDate: string | null;
          book: {
            id: string;
            title: string;
            coverImage: string;
            authors: [...];
          };
        }
      ];
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/reservationService.ts
export const getMyReservations = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/reservations/my-reservations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch reservations');
    return await response.json();
  } catch (error) {
    console.error('Get reservations error:', error);
    throw error;
  }
};
```

---

### 2.5 Get Active Reservations

**Endpoint:** `GET /reservations/active`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Active reservations retrieved successfully",
  data: [
    {
      id: string;
      reservationNumber: string;
      pickupDate: string;
      status: "PENDING" | "CONFIRMED";
      qrCode: string | null;
      items: [...];
      createdAt: string;
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/reservationService.ts
export const getActiveReservations = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/reservations/active`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch active reservations');
    return await response.json();
  } catch (error) {
    console.error('Get active reservations error:', error);
    throw error;
  }
};
```

---

### 2.6 Get Reservation History

**Endpoint:** `GET /reservations/history`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Reservation history retrieved successfully",
  data: [
    {
      id: string;
      reservationNumber: string;
      pickupDate: string;
      status: "COMPLETED" | "CANCELLED" | "EXPIRED";
      items: [...];
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/reservationService.ts
export const getReservationHistory = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/reservations/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch reservation history');
    return await response.json();
  } catch (error) {
    console.error('Get reservation history error:', error);
    throw error;
  }
};
```

---

### 2.7 Get Late Return Policy

**Endpoint:** `GET /reservations/policy`  
**Authentication:** Not required (Public)

#### Response (200 OK):
```typescript
{
  message: "Late return policy retrieved successfully",
  data: {
    finePerDay: number;
    gracePeriodDays: number;
    maxFineAmount: number;
    currency: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/reservationService.ts
export const getLateReturnPolicy = async () => {
  try {
    const response = await fetch(`${API_URL}/reservations/policy`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to fetch policy');
    return await response.json();
  } catch (error) {
    console.error('Get policy error:', error);
    throw error;
  }
};
```

---

### 2.8 Get Single Reservation

**Endpoint:** `GET /reservations/:id`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Reservation retrieved successfully",
  data: {
    id: string;
    reservationNumber: string;
    pickupDate: string;
    status: string;
    qrCode: string | null;
    notes: string | null;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      membershipId: string;
    };
    items: [
      {
        id: string;
        borrowingDuration: string;
        dueDate: string | null;
        book: {
          id: string;
          title: string;
          isbn: string;
          coverImage: string;
          authors: [...];
          genres: [...];
        };
      }
    ];
    createdAt: string;
    updatedAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/reservationService.ts
export const getReservationById = async (reservationId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch reservation');
    return await response.json();
  } catch (error) {
    console.error('Get reservation by ID error:', error);
    throw error;
  }
};
```

---

### 2.9 Admin/Librarian Endpoints

#### Get All Reservations
**Endpoint:** `GET /reservations`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

This endpoint is already documented above in section 2.8.

#### Mark Reservation as Picked Up
**Endpoint:** `PATCH /reservations/:id/pickup`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
export const markAsPickedUp = async (reservationId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(
      `${API_URL}/reservations/${reservationId}/pickup`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to mark as picked up');
    return await response.json();
  } catch (error) {
    console.error('Mark as picked up error:', error);
    throw error;
  }
};
```

#### Find Reservation by Number
**Endpoint:** `GET /reservations/by-number/:reservationNumber`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
export const findReservationByNumber = async (reservationNumber) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(
      `${API_URL}/reservations/by-number/${reservationNumber}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to find reservation');
    return await response.json();
  } catch (error) {
    console.error('Find reservation by number error:', error);
    throw error;
  }
};
```

---

## 3. WISHLIST MANAGEMENT

### 3.1 Get Wishlist

**Endpoint:** `GET /wishlist`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Wishlist retrieved successfully",
  data: [
    {
      id: string;
      priority: number;  // 1 = high, 2 = medium, 3 = low
      notes: string | null;
      book: {
        id: string;
        title: string;
        isbn: string;
        coverImage: string;
        status: string;
        availableCopies: number;
        averageRating: number;
        authors: [...];
        genres: [...];
      };
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/wishlistService.ts
const API_URL = 'http://localhost:4000/api';

export const getWishlist = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return await response.json();
  } catch (error) {
    console.error('Get wishlist error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// pages/Wishlist.tsx
const [wishlist, setWishlist] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const result = await getWishlist();
      setWishlist(result.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchWishlist();
}, []);
```

---

### 3.2 Add to Wishlist

**Endpoint:** `POST /wishlist`  
**Authentication:** Required (JWT)

#### Request Body:
```typescript
{
  bookId: string;       // UUID, required
  priority?: number;    // Optional: 1, 2, or 3 (default: 2)
  notes?: string;       // Optional notes
}
```

#### Response (201 Created):
```typescript
{
  message: "Book added to wishlist successfully",
  data: {
    id: string;
    priority: number;
    notes: string | null;
    book: {
      id: string;
      title: string;
      coverImage: string;
      authors: [...];
    };
    createdAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/wishlistService.ts
export const addToWishlist = async (bookId, priority = 2, notes = '') => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookId, priority, notes }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add to wishlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Add to wishlist error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/AddToWishlistButton.tsx
const [isInWishlist, setIsInWishlist] = useState(false);

const handleAddToWishlist = async () => {
  try {
    setLoading(true);
    await addToWishlist(bookId, 2);
    
    setIsInWishlist(true);
    toast.success('Added to wishlist!');
  } catch (err) {
    if (err.message.includes('already in wishlist')) {
      setIsInWishlist(true);
    }
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

### 3.3 Update Wishlist Item

**Endpoint:** `PATCH /wishlist/:id`  
**Authentication:** Required (JWT)

#### Request Body (All optional):
```typescript
{
  priority?: number;  // 1, 2, or 3
  notes?: string;
}
```

#### Response (200 OK):
```typescript
{
  message: "Wishlist item updated successfully",
  data: {
    id: string;
    priority: number;
    notes: string;
    // ... wishlist item details
  }
}
```

#### Frontend Implementation:
```typescript
// services/wishlistService.ts
export const updateWishlistItem = async (itemId, updates) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/wishlist/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to update wishlist item');
    return await response.json();
  } catch (error) {
    console.error('Update wishlist item error:', error);
    throw error;
  }
};
```

---

### 3.4 Remove from Wishlist (by Book ID)

**Endpoint:** `DELETE /wishlist/book/:bookId`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Book removed from wishlist successfully"
}
```

#### Frontend Implementation:
```typescript
// services/wishlistService.ts
export const removeFromWishlist = async (bookId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/wishlist/book/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to remove from wishlist');
    return await response.json();
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    throw error;
  }
};
```

---

### 3.5 Remove Wishlist Item (by Item ID)

**Endpoint:** `DELETE /wishlist/:id`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Wishlist item removed successfully"
}
```

#### Frontend Implementation:
```typescript
// services/wishlistService.ts
export const removeWishlistItem = async (itemId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/wishlist/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to remove wishlist item');
    return await response.json();
  } catch (error) {
    console.error('Remove wishlist item error:', error);
    throw error;
  }
};
```

---

### 3.6 Check if Book is in Wishlist

**Endpoint:** `GET /wishlist/check/:bookId`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Wishlist status checked",
  data: {
    isInWishlist: boolean;
  }
}
```

#### Frontend Implementation:
```typescript
// services/wishlistService.ts
export const checkIfInWishlist = async (bookId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/wishlist/check/${bookId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to check wishlist status');
    return await response.json();
  } catch (error) {
    console.error('Check wishlist error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/BookDetails.tsx
const [isInWishlist, setIsInWishlist] = useState(false);

useEffect(() => {
  const checkWishlist = async () => {
    try {
      const result = await checkIfInWishlist(bookId);
      setIsInWishlist(result.data.isInWishlist);
    } catch (error) {
      // User might not be logged in
      console.log('Not logged in or error checking wishlist');
    }
  };

  if (isAuthenticated()) {
    checkWishlist();
  }
}, [bookId]);
```

---

### 3.7 Clear Wishlist

**Endpoint:** `DELETE /wishlist`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Wishlist cleared successfully"
}
```

#### Frontend Implementation:
```typescript
// services/wishlistService.ts
export const clearWishlist = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to clear wishlist');
    return await response.json();
  } catch (error) {
    console.error('Clear wishlist error:', error);
    throw error;
  }
};
```

---

### 3.8 Get Wishlist Count

**Endpoint:** `GET /wishlist/count`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Wishlist count retrieved",
  data: {
    count: number;
  }
}
```

#### Frontend Implementation:
```typescript
// services/wishlistService.ts
export const getWishlistCount = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/wishlist/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to get wishlist count');
    return await response.json();
  } catch (error) {
    console.error('Get wishlist count error:', error);
    throw error;
  }
};
```

#### Component Usage (Header Badge):
```typescript
// components/Header.tsx
const [wishlistCount, setWishlistCount] = useState(0);

useEffect(() => {
  const fetchCount = async () => {
    try {
      const result = await getWishlistCount();
      setWishlistCount(result.data.count);
    } catch (error) {
      console.log('Error fetching wishlist count');
    }
  };

  if (isAuthenticated()) {
    fetchCount();
  }
}, [isAuthenticated()]);

return (
  <Link to="/wishlist">
    <HeartIcon />
    {wishlistCount > 0 && (
      <span className="badge">{wishlistCount}</span>
    )}
  </Link>
);
```

---

## 🎯 Key Integration Patterns

### Complete Reservation Flow Example:
```typescript
// components/ReservationFlow.tsx
const ReservationFlow = () => {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);  // 1: Cart, 2: Details, 3: Confirm

  // Step 1: Add books to cart
  const addToCart = (book, duration) => {
    if (cart.length >= 5) {
      toast.error('Maximum 5 books per reservation');
      return;
    }
    setCart([...cart, { bookId: book.id, book, duration }]);
  };

  // Step 2: Create reservation
  const handleCreateReservation = async (pickupDate, notes) => {
    const reservationData = {
      pickupDate,
      items: cart.map(item => ({
        bookId: item.bookId,
        borrowingDuration: item.duration,
      })),
      notes,
    };

    try {
      const result = await createReservation(reservationData);
      setReservationId(result.data.id);
      setStep(3);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Step 3: Confirm reservation
  const handleConfirmReservation = async (paymentMethod) => {
    try {
      const result = await confirmReservation(reservationId, paymentMethod);
      setQrCode(result.data.qrCode);
      toast.success('Reservation confirmed!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {step === 1 && <CartStep cart={cart} onNext={() => setStep(2)} />}
      {step === 2 && <DetailsStep onSubmit={handleCreateReservation} />}
      {step === 3 && <ConfirmStep onConfirm={handleConfirmReservation} />}
    </div>
  );
};
```

---

**Next:** Part 4 - Reviews, Contact & Storage
