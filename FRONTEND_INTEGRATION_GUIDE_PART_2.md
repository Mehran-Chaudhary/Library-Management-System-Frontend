# 🚀 Frontend Integration Guide - Part 2: Books, Authors & Genres

**Backend Base URL:** `http://localhost:4000/api`

---

## 📋 Table of Contents
1. [Books Management](#1-books-management)
2. [Authors Management](#2-authors-management)
3. [Genres Management](#3-genres-management)

---

## 1. BOOKS MANAGEMENT

### 1.1 Get All Books (with Filtering & Pagination)

**Endpoint:** `GET /books`  
**Authentication:** Not required (Public)

#### Query Parameters:
```typescript
{
  search?: string;          // Search in title, ISBN, description
  genreId?: string;         // Filter by genre UUID
  status?: "AVAILABLE" | "BORROWED" | "RESERVED" | "MAINTENANCE";
  page?: number;            // Default: 1
  limit?: number;           // Default: 12
  sortBy?: "title" | "publicationYear" | "averageRating" | "createdAt";  // Default: "createdAt"
  sortOrder?: "ASC" | "DESC";  // Default: "DESC"
  featured?: boolean;       // Filter featured books
  newArrivals?: boolean;    // Filter new arrivals
}
```

#### Response (200 OK):
```typescript
{
  message: "Books retrieved successfully",
  data: [
    {
      id: string;
      title: string;
      isbn: string;
      description: string;
      coverImage: string;
      publicationYear: number;
      totalCopies: number;
      availableCopies: number;
      status: "AVAILABLE" | "BORROWED" | "RESERVED" | "MAINTENANCE";
      isFeatured: boolean;
      averageRating: number;
      totalReviews: number;
      language: string;
      pageCount: number;
      publisher: string;
      expectedReturnDate: string | null;  // ISO date if not available
      authors: [
        {
          id: string;
          name: string;
          bio: string;
          photoUrl: string;
        }
      ];
      genres: [
        {
          id: string;
          name: string;
          description: string;
        }
      ];
      createdAt: string;
      updatedAt: string;
    }
  ],
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
```

#### Frontend Implementation:
```typescript
// services/bookService.ts
const API_URL = 'http://localhost:4000/api';

export const getBooks = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key].toString());
      }
    });

    const queryString = queryParams.toString();
    const url = `${API_URL}/books${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return await response.json();
  } catch (error) {
    console.error('Get books error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/BookList.tsx
const [books, setBooks] = useState([]);
const [loading, setLoading] = useState(true);
const [filters, setFilters] = useState({
  search: '',
  genreId: '',
  page: 1,
  limit: 12,
  sortBy: 'createdAt',
  sortOrder: 'DESC',
});
const [meta, setMeta] = useState(null);

useEffect(() => {
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const result = await getBooks(filters);
      setBooks(result.data);
      setMeta(result.meta);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchBooks();
}, [filters]);

// Handle search
const handleSearch = (searchTerm) => {
  setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
};

// Handle genre filter
const handleGenreFilter = (genreId) => {
  setFilters(prev => ({ ...prev, genreId, page: 1 }));
};

// Handle pagination
const handlePageChange = (newPage) => {
  setFilters(prev => ({ ...prev, page: newPage }));
};
```

---

### 1.2 Get Featured Books

**Endpoint:** `GET /books/featured`  
**Authentication:** Not required (Public)

#### Query Parameters:
```typescript
{
  limit?: number;  // Optional, default handled by backend
}
```

#### Response (200 OK):
```typescript
{
  message: "Featured books retrieved successfully",
  data: [
    {
      id: string;
      title: string;
      coverImage: string;
      averageRating: number;
      authors: [...];
      genres: [...];
      // ... other book fields
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/bookService.ts
export const getFeaturedBooks = async (limit = 6) => {
  try {
    const response = await fetch(
      `${API_URL}/books/featured?limit=${limit}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch featured books');
    return await response.json();
  } catch (error) {
    console.error('Get featured books error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/HomePage.tsx
const [featuredBooks, setFeaturedBooks] = useState([]);

useEffect(() => {
  const loadFeaturedBooks = async () => {
    try {
      const result = await getFeaturedBooks(6);
      setFeaturedBooks(result.data);
    } catch (error) {
      console.error('Error loading featured books:', error);
    }
  };

  loadFeaturedBooks();
}, []);
```

---

### 1.3 Get New Arrivals

**Endpoint:** `GET /books/new-arrivals`  
**Authentication:** Not required (Public)

#### Query Parameters:
```typescript
{
  limit?: number;  // Optional
}
```

#### Response (200 OK):
```typescript
{
  message: "New arrivals retrieved successfully",
  data: [
    {
      id: string;
      title: string;
      coverImage: string;
      publicationYear: number;
      createdAt: string;
      authors: [...];
      // ... other book fields
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/bookService.ts
export const getNewArrivals = async (limit = 8) => {
  try {
    const response = await fetch(
      `${API_URL}/books/new-arrivals?limit=${limit}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch new arrivals');
    return await response.json();
  } catch (error) {
    console.error('Get new arrivals error:', error);
    throw error;
  }
};
```

---

### 1.4 Get Popular Books

**Endpoint:** `GET /books/popular`  
**Authentication:** Not required (Public)

#### Query Parameters:
```typescript
{
  limit?: number;  // Optional
}
```

#### Response (200 OK):
```typescript
{
  message: "Popular books retrieved successfully",
  data: [
    {
      id: string;
      title: string;
      coverImage: string;
      averageRating: number;
      totalReviews: number;
      borrowCount: number;  // Based on borrowing history
      authors: [...];
      // ... other book fields
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/bookService.ts
export const getPopularBooks = async (limit = 10) => {
  try {
    const response = await fetch(
      `${API_URL}/books/popular?limit=${limit}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch popular books');
    return await response.json();
  } catch (error) {
    console.error('Get popular books error:', error);
    throw error;
  }
};
```

---

### 1.5 Get Single Book by ID

**Endpoint:** `GET /books/:id`  
**Authentication:** Not required (Public)

#### Response (200 OK):
```typescript
{
  message: "Book retrieved successfully",
  data: {
    id: string;
    title: string;
    isbn: string;
    description: string;
    coverImage: string;
    publicationYear: number;
    totalCopies: number;
    availableCopies: number;
    status: string;
    isFeatured: boolean;
    averageRating: number;
    totalReviews: number;
    language: string;
    pageCount: number;
    publisher: string;
    expectedReturnDate: string | null;
    authors: [
      {
        id: string;
        name: string;
        bio: string;
        photoUrl: string;
        nationality: string;
      }
    ];
    genres: [
      {
        id: string;
        name: string;
        description: string;
      }
    ];
    reviews: [
      {
        id: string;
        rating: number;
        comment: string;
        user: {
          id: string;
          firstName: string;
          lastName: string;
        };
        createdAt: string;
      }
    ];
    createdAt: string;
    updatedAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/bookService.ts
export const getBookById = async (bookId) => {
  try {
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Book not found');
      }
      throw new Error('Failed to fetch book');
    }

    return await response.json();
  } catch (error) {
    console.error('Get book by ID error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// pages/BookDetails.tsx
const { bookId } = useParams();
const [book, setBook] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchBook = async () => {
    try {
      setLoading(true);
      const result = await getBookById(bookId);
      setBook(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchBook();
}, [bookId]);
```

---

### 1.6 Check Book Availability

**Endpoint:** `GET /books/:id/availability`  
**Authentication:** Not required (Public)

#### Response (200 OK):
```typescript
{
  message: "Availability checked",
  data: {
    isAvailable: boolean;
    availableCopies: number;
    totalCopies: number;
    expectedReturnDate: string | null;  // ISO date when book might be available
  }
}
```

#### Frontend Implementation:
```typescript
// services/bookService.ts
export const checkBookAvailability = async (bookId) => {
  try {
    const response = await fetch(
      `${API_URL}/books/${bookId}/availability`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) throw new Error('Failed to check availability');
    return await response.json();
  } catch (error) {
    console.error('Check availability error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/BookAvailability.tsx
const [availability, setAvailability] = useState(null);

useEffect(() => {
  const checkAvailability = async () => {
    try {
      const result = await checkBookAvailability(bookId);
      setAvailability(result.data);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  checkAvailability();
}, [bookId]);

return (
  <div>
    {availability?.isAvailable ? (
      <span className="available">
        ✓ Available ({availability.availableCopies} copies)
      </span>
    ) : (
      <span className="unavailable">
        ✗ Not Available
        {availability?.expectedReturnDate && (
          <small>
            Expected: {new Date(availability.expectedReturnDate).toLocaleDateString()}
          </small>
        )}
      </span>
    )}
  </div>
);
```

---

### 1.7 Create Book (Admin/Librarian Only)

**Endpoint:** `POST /books`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

#### Request Body:
```typescript
{
  title: string;              // Required
  isbn: string;               // Required, unique
  description: string;        // Required
  coverImage: string;         // URL
  publicationYear: number;    // Required
  totalCopies: number;        // Required, min: 1
  language: string;           // Required
  pageCount: number;          // Required
  publisher: string;          // Required
  authorIds: string[];        // Required, array of UUIDs
  genreIds: string[];         // Required, array of UUIDs
  isFeatured?: boolean;       // Optional, default: false
}
```

#### Response (201 Created):
```typescript
{
  message: "Book created successfully",
  data: {
    id: string;
    title: string;
    isbn: string;
    // ... all book fields
    authors: [...];
    genres: [...];
  }
}
```

#### Frontend Implementation:
```typescript
// services/bookService.ts (Admin)
export const createBook = async (bookData) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    if (response.status === 403) {
      throw new Error('Insufficient permissions');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create book');
    }

    return await response.json();
  } catch (error) {
    console.error('Create book error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/CreateBookForm.tsx (Admin)
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const bookData = {
    title,
    isbn,
    description,
    coverImage,
    publicationYear: parseInt(publicationYear),
    totalCopies: parseInt(totalCopies),
    language,
    pageCount: parseInt(pageCount),
    publisher,
    authorIds: selectedAuthors.map(a => a.id),
    genreIds: selectedGenres.map(g => g.id),
    isFeatured,
  };

  try {
    setLoading(true);
    const result = await createBook(bookData);
    setSuccess('Book created successfully!');
    
    // Redirect to book details
    navigate(`/books/${result.data.id}`);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

### 1.8 Update Book (Admin/Librarian Only)

**Endpoint:** `PATCH /books/:id`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

#### Request Body (All fields optional):
```typescript
{
  title?: string;
  isbn?: string;
  description?: string;
  coverImage?: string;
  publicationYear?: number;
  totalCopies?: number;
  language?: string;
  pageCount?: number;
  publisher?: string;
  authorIds?: string[];
  genreIds?: string[];
  isFeatured?: boolean;
  status?: "AVAILABLE" | "BORROWED" | "RESERVED" | "MAINTENANCE";
}
```

#### Response (200 OK):
```typescript
{
  message: "Book updated successfully",
  data: {
    // Updated book object
  }
}
```

#### Frontend Implementation:
```typescript
// services/bookService.ts (Admin)
export const updateBook = async (bookId, updates) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update book');
    }

    return await response.json();
  } catch (error) {
    console.error('Update book error:', error);
    throw error;
  }
};
```

---

### 1.9 Delete Book (Admin Only)

**Endpoint:** `DELETE /books/:id`  
**Authentication:** Required (JWT) + Role: ADMIN

#### Response (200 OK):
```typescript
{
  message: "Book deleted successfully"
}
```

#### Frontend Implementation:
```typescript
// services/bookService.ts (Admin)
export const deleteBook = async (bookId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete book error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/DeleteBookButton.tsx (Admin)
const handleDelete = async () => {
  if (!window.confirm('Are you sure you want to delete this book?')) {
    return;
  }

  try {
    setLoading(true);
    await deleteBook(bookId);
    
    // Show success message
    toast.success('Book deleted successfully');
    
    // Redirect to books list
    navigate('/admin/books');
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 2. AUTHORS MANAGEMENT

### 2.1 Get All Authors

**Endpoint:** `GET /authors`  
**Authentication:** Not required (Public)

#### Query Parameters:
```typescript
{
  search?: string;  // Search by author name
}
```

#### Response (200 OK):
```typescript
{
  message: "Authors retrieved successfully",
  data: [
    {
      id: string;
      name: string;
      bio: string;
      photoUrl: string;
      nationality: string;
      birthDate: string | null;
      deathDate: string | null;
      website: string | null;
      books: [
        {
          id: string;
          title: string;
          coverImage: string;
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
// services/authorService.ts
const API_URL = 'http://localhost:4000/api';

export const getAuthors = async (search = '') => {
  try {
    const url = search 
      ? `${API_URL}/authors?search=${encodeURIComponent(search)}`
      : `${API_URL}/authors`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to fetch authors');
    return await response.json();
  } catch (error) {
    console.error('Get authors error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/AuthorsList.tsx
const [authors, setAuthors] = useState([]);
const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  const fetchAuthors = async () => {
    try {
      const result = await getAuthors(searchTerm);
      setAuthors(result.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  // Debounce search
  const timer = setTimeout(fetchAuthors, 300);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

---

### 2.2 Get Author by ID

**Endpoint:** `GET /authors/:id`  
**Authentication:** Not required (Public)

#### Response (200 OK):
```typescript
{
  message: "Author retrieved successfully",
  data: {
    id: string;
    name: string;
    bio: string;
    photoUrl: string;
    nationality: string;
    birthDate: string | null;
    deathDate: string | null;
    website: string | null;
    books: [
      {
        id: string;
        title: string;
        isbn: string;
        coverImage: string;
        publicationYear: number;
        averageRating: number;
      }
    ];
    createdAt: string;
    updatedAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/authorService.ts
export const getAuthorById = async (authorId) => {
  try {
    const response = await fetch(`${API_URL}/authors/${authorId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Author not found');
      }
      throw new Error('Failed to fetch author');
    }

    return await response.json();
  } catch (error) {
    console.error('Get author by ID error:', error);
    throw error;
  }
};
```

---

### 2.3 Create Author (Admin/Librarian Only)

**Endpoint:** `POST /authors`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

#### Request Body:
```typescript
{
  name: string;           // Required, min 2 chars
  bio: string;            // Required
  photoUrl?: string;      // Optional
  nationality?: string;   // Optional
  birthDate?: string;     // Optional, ISO date
  deathDate?: string;     // Optional, ISO date
  website?: string;       // Optional, valid URL
}
```

#### Response (201 Created):
```typescript
{
  message: "Author created successfully",
  data: {
    id: string;
    name: string;
    bio: string;
    // ... all author fields
  }
}
```

#### Frontend Implementation:
```typescript
// services/authorService.ts (Admin)
export const createAuthor = async (authorData) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/authors`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authorData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create author');
    }

    return await response.json();
  } catch (error) {
    console.error('Create author error:', error);
    throw error;
  }
};
```

---

### 2.4 Update Author (Admin/Librarian Only)

**Endpoint:** `PATCH /authors/:id`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

#### Request Body (All optional):
```typescript
{
  name?: string;
  bio?: string;
  photoUrl?: string;
  nationality?: string;
  birthDate?: string;
  deathDate?: string;
  website?: string;
}
```

#### Response (200 OK):
```typescript
{
  message: "Author updated successfully",
  data: {
    // Updated author object
  }
}
```

#### Frontend Implementation:
```typescript
// services/authorService.ts (Admin)
export const updateAuthor = async (authorId, updates) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/authors/${authorId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to update author');
    return await response.json();
  } catch (error) {
    console.error('Update author error:', error);
    throw error;
  }
};
```

---

### 2.5 Delete Author (Admin Only)

**Endpoint:** `DELETE /authors/:id`  
**Authentication:** Required (JWT) + Role: ADMIN

#### Response (200 OK):
```typescript
{
  message: "Author deleted successfully"
}
```

#### Frontend Implementation:
```typescript
// services/authorService.ts (Admin)
export const deleteAuthor = async (authorId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/authors/${authorId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to delete author');
    return await response.json();
  } catch (error) {
    console.error('Delete author error:', error);
    throw error;
  }
};
```

---

## 3. GENRES MANAGEMENT

### 3.1 Get All Genres

**Endpoint:** `GET /genres`  
**Authentication:** Not required (Public)

#### Response (200 OK):
```typescript
{
  message: "Genres retrieved successfully",
  data: [
    {
      id: string;
      name: string;
      description: string;
      books: [
        {
          id: string;
          title: string;
          coverImage: string;
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
// services/genreService.ts
const API_URL = 'http://localhost:4000/api';

export const getGenres = async () => {
  try {
    const response = await fetch(`${API_URL}/genres`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to fetch genres');
    return await response.json();
  } catch (error) {
    console.error('Get genres error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/GenreFilter.tsx
const [genres, setGenres] = useState([]);

useEffect(() => {
  const fetchGenres = async () => {
    try {
      const result = await getGenres();
      setGenres(result.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  fetchGenres();
}, []);

return (
  <select onChange={(e) => onGenreSelect(e.target.value)}>
    <option value="">All Genres</option>
    {genres.map(genre => (
      <option key={genre.id} value={genre.id}>
        {genre.name}
      </option>
    ))}
  </select>
);
```

---

### 3.2 Get Genre by ID

**Endpoint:** `GET /genres/:id`  
**Authentication:** Not required (Public)

#### Response (200 OK):
```typescript
{
  message: "Genre retrieved successfully",
  data: {
    id: string;
    name: string;
    description: string;
    books: [
      {
        id: string;
        title: string;
        isbn: string;
        coverImage: string;
        averageRating: number;
      }
    ];
    createdAt: string;
    updatedAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/genreService.ts
export const getGenreById = async (genreId) => {
  try {
    const response = await fetch(`${API_URL}/genres/${genreId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to fetch genre');
    return await response.json();
  } catch (error) {
    console.error('Get genre by ID error:', error);
    throw error;
  }
};
```

---

### 3.3 Create Genre (Admin/Librarian Only)

**Endpoint:** `POST /genres`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

#### Request Body:
```typescript
{
  name: string;         // Required, unique
  description: string;  // Required
}
```

#### Response (201 Created):
```typescript
{
  message: "Genre created successfully",
  data: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/genreService.ts (Admin)
export const createGenre = async (genreData) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/genres`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(genreData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create genre');
    }

    return await response.json();
  } catch (error) {
    console.error('Create genre error:', error);
    throw error;
  }
};
```

---

### 3.4 Update Genre (Admin/Librarian Only)

**Endpoint:** `PATCH /genres/:id`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

#### Request Body (All optional):
```typescript
{
  name?: string;
  description?: string;
}
```

#### Response (200 OK):
```typescript
{
  message: "Genre updated successfully",
  data: {
    // Updated genre object
  }
}
```

#### Frontend Implementation:
```typescript
// services/genreService.ts (Admin)
export const updateGenre = async (genreId, updates) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/genres/${genreId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to update genre');
    return await response.json();
  } catch (error) {
    console.error('Update genre error:', error);
    throw error;
  }
};
```

---

### 3.5 Delete Genre (Admin Only)

**Endpoint:** `DELETE /genres/:id`  
**Authentication:** Required (JWT) + Role: ADMIN

#### Response (200 OK):
```typescript
{
  message: "Genre deleted successfully"
}
```

#### Frontend Implementation:
```typescript
// services/genreService.ts (Admin)
export const deleteGenre = async (genreId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/genres/${genreId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to delete genre');
    return await response.json();
  } catch (error) {
    console.error('Delete genre error:', error);
    throw error;
  }
};
```

---

## 🎯 Key Integration Points

### Book Catalog Page Example:
```typescript
// pages/BookCatalog.tsx
const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    genreId: '',
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  // Load genres for filter
  useEffect(() => {
    const loadGenres = async () => {
      const result = await getGenres();
      setGenres(result.data);
    };
    loadGenres();
  }, []);

  // Load books when filters change
  useEffect(() => {
    const loadBooks = async () => {
      const result = await getBooks(filters);
      setBooks(result.data);
    };
    loadBooks();
  }, [filters]);

  return (
    <div>
      {/* Search bar */}
      <input
        value={filters.search}
        onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
      />
      
      {/* Genre filter */}
      <select
        value={filters.genreId}
        onChange={(e) => setFilters({...filters, genreId: e.target.value, page: 1})}
      >
        <option value="">All Genres</option>
        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>

      {/* Book grid */}
      <div className="books-grid">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};
```

---

**Next:** Part 3 - Borrowings, Reservations & Wishlist
