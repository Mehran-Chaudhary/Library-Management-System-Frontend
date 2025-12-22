# 🚀 Frontend Integration Guide - Part 4: Reviews, Contact & Storage

**Backend Base URL:** `http://localhost:4000/api`

---

## 📋 Table of Contents
1. [Reviews System](#1-reviews-system)
2. [Contact Messages](#2-contact-messages)
3. [File Storage & Uploads](#3-file-storage--uploads)
4. [Complete Integration Examples](#4-complete-integration-examples)

---

## 1. REVIEWS SYSTEM

### 1.1 Get Reviews for a Book

**Endpoint:** `GET /reviews/book/:bookId`  
**Authentication:** Not required (Public)

#### Response (200 OK):
```typescript
{
  message: "Reviews retrieved successfully",
  data: [
    {
      id: string;
      rating: number;       // 1-5
      comment: string;
      user: {
        id: string;
        firstName: string;
        lastName: string;
      };
      book: {
        id: string;
        title: string;
        coverImage: string;
      };
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/reviewService.ts
const API_URL = 'http://localhost:4000/api';

export const getBookReviews = async (bookId) => {
  try {
    const response = await fetch(`${API_URL}/reviews/book/${bookId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return await response.json();
  } catch (error) {
    console.error('Get reviews error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/BookReviews.tsx
const [reviews, setReviews] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const result = await getBookReviews(bookId);
      setReviews(result.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchReviews();
}, [bookId]);

// Calculate average rating
const averageRating = reviews.length > 0
  ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  : 0;

return (
  <div>
    <h3>Reviews ({reviews.length})</h3>
    <div className="average-rating">
      ⭐ {averageRating.toFixed(1)} / 5
    </div>
    {reviews.map(review => (
      <div key={review.id} className="review-card">
        <div className="review-header">
          <span className="author">
            {review.user.firstName} {review.user.lastName}
          </span>
          <span className="rating">
            {'⭐'.repeat(review.rating)}
          </span>
        </div>
        <p className="comment">{review.comment}</p>
        <small className="date">
          {new Date(review.createdAt).toLocaleDateString()}
        </small>
      </div>
    ))}
  </div>
);
```

---

### 1.2 Get My Reviews

**Endpoint:** `GET /reviews/my-reviews`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Your reviews retrieved successfully",
  data: [
    {
      id: string;
      rating: number;
      comment: string;
      book: {
        id: string;
        title: string;
        coverImage: string;
        isbn: string;
      };
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/reviewService.ts
export const getMyReviews = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/reviews/my-reviews`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch your reviews');
    }

    return await response.json();
  } catch (error) {
    console.error('Get my reviews error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// pages/MyReviews.tsx
const [myReviews, setMyReviews] = useState([]);

useEffect(() => {
  const fetchMyReviews = async () => {
    try {
      const result = await getMyReviews();
      setMyReviews(result.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  fetchMyReviews();
}, []);
```

---

### 1.3 Create Review

**Endpoint:** `POST /reviews/book/:bookId`  
**Authentication:** Required (JWT)

#### Request Body:
```typescript
{
  rating: number;   // Required, 1-5
  comment: string;  // Required, min 10 chars
}
```

#### Response (201 Created):
```typescript
{
  message: "Review created successfully",
  data: {
    id: string;
    rating: number;
    comment: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
    book: {
      id: string;
      title: string;
    };
    createdAt: string;
    updatedAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/reviewService.ts
export const createReview = async (bookId, rating, comment) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/reviews/book/${bookId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating, comment }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create review');
    }

    return await response.json();
  } catch (error) {
    console.error('Create review error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/ReviewForm.tsx
const [rating, setRating] = useState(5);
const [comment, setComment] = useState('');
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation
  if (rating < 1 || rating > 5) {
    toast.error('Rating must be between 1 and 5');
    return;
  }

  if (comment.length < 10) {
    toast.error('Review must be at least 10 characters');
    return;
  }

  try {
    setSubmitting(true);
    const result = await createReview(bookId, rating, comment);
    
    toast.success('Review submitted successfully!');
    
    // Add new review to list
    onReviewAdded(result.data);
    
    // Reset form
    setRating(5);
    setComment('');
  } catch (err) {
    if (err.message.includes('already reviewed')) {
      toast.error('You have already reviewed this book');
    } else {
      toast.error(err.message);
    }
  } finally {
    setSubmitting(false);
  }
};

return (
  <form onSubmit={handleSubmit}>
    <div className="rating-input">
      <label>Rating:</label>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={rating >= star ? 'active' : ''}
        >
          ⭐
        </button>
      ))}
    </div>

    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder="Write your review (min 10 characters)..."
      rows={4}
      minLength={10}
      required
    />

    <button type="submit" disabled={submitting}>
      {submitting ? 'Submitting...' : 'Submit Review'}
    </button>
  </form>
);
```

---

### 1.4 Update Review

**Endpoint:** `PATCH /reviews/:id`  
**Authentication:** Required (JWT)

#### Request Body (All optional):
```typescript
{
  rating?: number;   // 1-5
  comment?: string;  // min 10 chars
}
```

#### Response (200 OK):
```typescript
{
  message: "Review updated successfully",
  data: {
    id: string;
    rating: number;
    comment: string;
    // ... updated review details
  }
}
```

#### Frontend Implementation:
```typescript
// services/reviewService.ts
export const updateReview = async (reviewId, updates) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update review');
    }

    return await response.json();
  } catch (error) {
    console.error('Update review error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/EditReviewForm.tsx
const handleUpdate = async () => {
  try {
    setUpdating(true);
    const result = await updateReview(reviewId, {
      rating: newRating,
      comment: newComment,
    });
    
    toast.success('Review updated successfully');
    onReviewUpdated(result.data);
    setIsEditing(false);
  } catch (err) {
    toast.error(err.message);
  } finally {
    setUpdating(false);
  }
};
```

---

### 1.5 Delete Review

**Endpoint:** `DELETE /reviews/:id`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Review deleted successfully"
}
```

#### Frontend Implementation:
```typescript
// services/reviewService.ts
export const deleteReview = async (reviewId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete review');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// components/ReviewCard.tsx
const handleDelete = async () => {
  if (!window.confirm('Are you sure you want to delete this review?')) {
    return;
  }

  try {
    setDeleting(true);
    await deleteReview(review.id);
    
    toast.success('Review deleted successfully');
    onReviewDeleted(review.id);
  } catch (err) {
    toast.error(err.message);
  } finally {
    setDeleting(false);
  }
};
```

---

## 2. CONTACT MESSAGES

### 2.1 Send Contact Message (Public)

**Endpoint:** `POST /contact`  
**Authentication:** Not required (Public)

#### Request Body:
```typescript
{
  name: string;      // Required, min 2 chars
  email: string;     // Required, valid email
  subject: string;   // Required, min 5 chars
  message: string;   // Required, min 20 chars
  phone?: string;    // Optional
}
```

#### Response (201 Created):
```typescript
{
  message: "Message sent successfully. We will get back to you soon!",
  data: {
    id: string;
    subject: string;
    createdAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/contactService.ts
const API_URL = 'http://localhost:4000/api';

export const sendContactMessage = async (messageData) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Send contact message error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// pages/ContactUs.tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  subject: '',
  message: '',
  phone: '',
});
const [sending, setSending] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSending(true);
    const result = await sendContactMessage(formData);
    
    toast.success('Message sent successfully! We will get back to you soon.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      phone: '',
    });
  } catch (err) {
    toast.error(err.message);
  } finally {
    setSending(false);
  }
};

return (
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      value={formData.name}
      onChange={(e) => setFormData({...formData, name: e.target.value})}
      placeholder="Your Name"
      required
      minLength={2}
    />
    
    <input
      type="email"
      value={formData.email}
      onChange={(e) => setFormData({...formData, email: e.target.value})}
      placeholder="Your Email"
      required
    />
    
    <input
      type="tel"
      value={formData.phone}
      onChange={(e) => setFormData({...formData, phone: e.target.value})}
      placeholder="Phone Number (optional)"
    />
    
    <input
      type="text"
      value={formData.subject}
      onChange={(e) => setFormData({...formData, subject: e.target.value})}
      placeholder="Subject"
      required
      minLength={5}
    />
    
    <textarea
      value={formData.message}
      onChange={(e) => setFormData({...formData, message: e.target.value})}
      placeholder="Your Message"
      rows={6}
      required
      minLength={20}
    />
    
    <button type="submit" disabled={sending}>
      {sending ? 'Sending...' : 'Send Message'}
    </button>
  </form>
);
```

---

### 2.2 Send Authenticated Contact Message

**Endpoint:** `POST /contact/authenticated`  
**Authentication:** Required (JWT)

#### Request Body:
```typescript
{
  subject: string;   // Required
  message: string;   // Required
  phone?: string;    // Optional
}
```

#### Response (201 Created):
```typescript
{
  message: "Message sent successfully",
  data: {
    id: string;
    subject: string;
    message: string;
    status: "PENDING";
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    createdAt: string;
  }
}
```

#### Frontend Implementation:
```typescript
// services/contactService.ts
export const sendAuthenticatedMessage = async (subject, message, phone = '') => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/contact/authenticated`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, message, phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Send authenticated message error:', error);
    throw error;
  }
};
```

---

### 2.3 Get My Messages

**Endpoint:** `GET /contact/my-messages`  
**Authentication:** Required (JWT)

#### Response (200 OK):
```typescript
{
  message: "Messages retrieved successfully",
  data: [
    {
      id: string;
      subject: string;
      message: string;
      status: "PENDING" | "READ" | "CLOSED";
      response: string | null;
      createdAt: string;
      updatedAt: string;
    }
  ]
}
```

#### Frontend Implementation:
```typescript
// services/contactService.ts
export const getMyMessages = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/contact/my-messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return await response.json();
  } catch (error) {
    console.error('Get my messages error:', error);
    throw error;
  }
};
```

#### Component Usage:
```typescript
// pages/MyMessages.tsx
const [messages, setMessages] = useState([]);

useEffect(() => {
  const fetchMessages = async () => {
    try {
      const result = await getMyMessages();
      setMessages(result.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  fetchMessages();
}, []);
```

---

### 2.4 Admin/Librarian Endpoints

#### Get All Messages
**Endpoint:** `GET /contact`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
// services/contactService.ts (Admin)
export const getAllMessages = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch all messages');
    return await response.json();
  } catch (error) {
    console.error('Get all messages error:', error);
    throw error;
  }
};
```

#### Get Pending Messages
**Endpoint:** `GET /contact/pending`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
export const getPendingMessages = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/contact/pending`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch pending messages');
    return await response.json();
  } catch (error) {
    console.error('Get pending messages error:', error);
    throw error;
  }
};
```

#### Get Pending Count
**Endpoint:** `GET /contact/pending/count`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
export const getPendingCount = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/contact/pending/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch pending count');
    return await response.json();
  } catch (error) {
    console.error('Get pending count error:', error);
    throw error;
  }
};
```

#### Mark as Read
**Endpoint:** `PATCH /contact/:id/read`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
export const markMessageAsRead = async (messageId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/contact/${messageId}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to mark as read');
    return await response.json();
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
};
```

#### Close Message
**Endpoint:** `PATCH /contact/:id/close`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
export const closeMessage = async (messageId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/contact/${messageId}/close`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to close message');
    return await response.json();
  } catch (error) {
    console.error('Close message error:', error);
    throw error;
  }
};
```

#### Update Message (Add Response)
**Endpoint:** `PATCH /contact/:id`  
**Authentication:** Required (JWT) + Role: ADMIN or LIBRARIAN

```typescript
// Request Body
{
  response?: string;
  status?: "PENDING" | "READ" | "CLOSED";
}

// Implementation
export const updateMessage = async (messageId, updates) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/contact/${messageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to update message');
    return await response.json();
  } catch (error) {
    console.error('Update message error:', error);
    throw error;
  }
};
```

#### Delete Message
**Endpoint:** `DELETE /contact/:id`  
**Authentication:** Required (JWT) + Role: ADMIN

```typescript
export const deleteMessage = async (messageId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_URL}/contact/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to delete message');
    return await response.json();
  } catch (error) {
    console.error('Delete message error:', error);
    throw error;
  }
};
```

---

## 3. FILE STORAGE & UPLOADS

### 3.1 Upload Book Cover Image

The backend uses **Supabase Storage** for file uploads. The storage service is primarily used for book cover images.

#### Note on Storage:
- The backend has a `StorageService` that handles uploads to Supabase
- Files are stored in bucket: `book-covers`
- Folders: `books/`, `users/` etc.
- Public URLs are returned after upload

#### Implementation Pattern:

```typescript
// services/storageService.ts
const API_URL = 'http://localhost:4000/api';

export const uploadBookCover = async (file) => {
  const token = localStorage.getItem('accessToken');
  
  // Create FormData
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'books');

  try {
    // Note: You'll need to create an upload endpoint in your backend
    // or handle file upload as part of book creation
    const response = await fetch(`${API_URL}/storage/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type, browser will set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.data.url;  // Returns public URL
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

#### Component Usage (Image Upload):
```typescript
// components/ImageUpload.tsx
const ImageUpload = ({ onImageUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setUploading(true);
      const imageUrl = await uploadBookCover(file);
      
      onImageUploaded(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload image');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      
      {preview && (
        <div className="preview">
          <img src={preview} alt="Preview" />
        </div>
      )}
      
      {uploading && <div className="loading">Uploading...</div>}
    </div>
  );
};
```

#### Alternative: Direct URL Input
Since the backend accepts `coverImage` as a URL string, you can also:

```typescript
// components/BookForm.tsx
const [coverImageUrl, setCoverImageUrl] = useState('');

// User can paste image URL directly
<input
  type="url"
  value={coverImageUrl}
  onChange={(e) => setCoverImageUrl(e.target.value)}
  placeholder="Enter cover image URL"
/>
```

---

## 4. COMPLETE INTEGRATION EXAMPLES

### 4.1 Complete Book Details Page

```typescript
// pages/BookDetails.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getBookById, 
  checkBookAvailability 
} from '../services/bookService';
import { 
  getBookReviews, 
  createReview 
} from '../services/reviewService';
import {
  addToWishlist,
  checkIfInWishlist,
  removeFromWishlist
} from '../services/wishlistService';
import { isAuthenticated } from '../utils/auth';

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch book details, reviews, and availability in parallel
        const [bookResult, reviewsResult, availabilityResult] = 
          await Promise.all([
            getBookById(bookId),
            getBookReviews(bookId),
            checkBookAvailability(bookId),
          ]);

        setBook(bookResult.data);
        setReviews(reviewsResult.data);
        setAvailability(availabilityResult.data);

        // Check wishlist status if authenticated
        if (isAuthenticated()) {
          const wishlistResult = await checkIfInWishlist(bookId);
          setIsInWishlist(wishlistResult.data.isInWishlist);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId]);

  // Handle add to wishlist
  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist) {
        await removeFromWishlist(bookId);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(bookId);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (rating, comment) => {
    try {
      const result = await createReview(bookId, rating, comment);
      setReviews([result.data, ...reviews]);
      toast.success('Review submitted successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="book-details">
      <div className="book-header">
        <img src={book.coverImage} alt={book.title} />
        
        <div className="book-info">
          <h1>{book.title}</h1>
          
          <div className="authors">
            By: {book.authors.map(a => a.name).join(', ')}
          </div>
          
          <div className="rating">
            ⭐ {book.averageRating.toFixed(1)} ({book.totalReviews} reviews)
          </div>
          
          <div className="genres">
            {book.genres.map(g => (
              <span key={g.id} className="genre-tag">{g.name}</span>
            ))}
          </div>

          <div className="availability">
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

          <div className="actions">
            {isAuthenticated() && (
              <>
                <button 
                  onClick={handleWishlistToggle}
                  className={isInWishlist ? 'in-wishlist' : ''}
                >
                  {isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                </button>
                
                {availability?.isAvailable && (
                  <button onClick={() => navigate(`/reserve?book=${bookId}`)}>
                    Reserve This Book
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="book-details-section">
        <h2>Description</h2>
        <p>{book.description}</p>
      </div>

      <div className="book-meta">
        <div><strong>ISBN:</strong> {book.isbn}</div>
        <div><strong>Publisher:</strong> {book.publisher}</div>
        <div><strong>Publication Year:</strong> {book.publicationYear}</div>
        <div><strong>Language:</strong> {book.language}</div>
        <div><strong>Pages:</strong> {book.pageCount}</div>
      </div>

      <div className="reviews-section">
        <h2>Reviews</h2>
        
        {isAuthenticated() && (
          <ReviewForm onSubmit={handleReviewSubmit} />
        )}

        <div className="reviews-list">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
```

---

### 4.2 Complete User Dashboard

```typescript
// pages/UserDashboard.tsx
import { useState, useEffect } from 'react';
import {
  getDashboardStats,
  getActiveBorrowings,
} from '../services/borrowingService';
import { getActiveReservations } from '../services/reservationService';
import { getWishlist } from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeBorrowings, setActiveBorrowings] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all dashboard data in parallel
        const [
          statsResult,
          borrowingsResult,
          reservationsResult,
          wishlistResult,
        ] = await Promise.all([
          getDashboardStats(),
          getActiveBorrowings(),
          getActiveReservations(),
          getWishlist(),
        ]);

        setStats(statsResult.data);
        setActiveBorrowings(borrowingsResult.data);
        setActiveReservations(reservationsResult.data);
        setWishlist(wishlistResult.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>Welcome back, {user.firstName}!</h1>
      
      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalBorrowings}</h3>
          <p>Total Borrowings</p>
        </div>
        <div className="stat-card">
          <h3>{stats.activeBorrowings}</h3>
          <p>Currently Borrowed</p>
        </div>
        <div className="stat-card alert">
          <h3>{stats.overdueBorrowings}</h3>
          <p>Overdue Books</p>
        </div>
        <div className="stat-card">
          <h3>${stats.totalFines.toFixed(2)}</h3>
          <p>Outstanding Fines</p>
        </div>
      </div>

      {/* Active Borrowings */}
      <section className="dashboard-section">
        <h2>Currently Borrowed Books</h2>
        {activeBorrowings.length > 0 ? (
          <div className="borrowings-list">
            {activeBorrowings.map(borrowing => (
              <BorrowingCard key={borrowing.id} borrowing={borrowing} />
            ))}
          </div>
        ) : (
          <p>No active borrowings</p>
        )}
      </section>

      {/* Active Reservations */}
      <section className="dashboard-section">
        <h2>Active Reservations</h2>
        {activeReservations.length > 0 ? (
          <div className="reservations-list">
            {activeReservations.map(reservation => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        ) : (
          <p>No active reservations</p>
        )}
      </section>

      {/* Wishlist Preview */}
      <section className="dashboard-section">
        <h2>Your Wishlist ({wishlist.length})</h2>
        {wishlist.slice(0, 4).map(item => (
          <WishlistItem key={item.id} item={item} />
        ))}
        {wishlist.length > 4 && (
          <Link to="/wishlist">View all wishlist items</Link>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
```

---

### 4.3 Admin Panel - Contact Messages Manager

```typescript
// pages/admin/ContactMessagesManager.tsx
import { useState, useEffect } from 'react';
import {
  getAllMessages,
  getPendingCount,
  markMessageAsRead,
  updateMessage,
  closeMessage,
} from '../services/contactService';

const ContactMessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, pending, read, closed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    fetchPendingCount();
  }, []);

  const fetchMessages = async () => {
    try {
      const result = await getAllMessages();
      setMessages(result.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const result = await getPendingCount();
      setPendingCount(result.data.count);
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markMessageAsRead(messageId);
      fetchMessages();
      fetchPendingCount();
      toast.success('Message marked as read');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddResponse = async (messageId, response) => {
    try {
      await updateMessage(messageId, { response });
      fetchMessages();
      toast.success('Response added');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClose = async (messageId) => {
    try {
      await closeMessage(messageId);
      fetchMessages();
      fetchPendingCount();
      toast.success('Message closed');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="messages-manager">
      <h1>Contact Messages</h1>
      
      <div className="pending-badge">
        {pendingCount} Pending Messages
      </div>

      <div className="filter-tabs">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
        <button onClick={() => setFilter('read')}>Read</button>
        <button onClick={() => setFilter('closed')}>Closed</button>
      </div>

      <div className="messages-list">
        {filteredMessages.map(message => (
          <MessageCard
            key={message.id}
            message={message}
            onMarkAsRead={handleMarkAsRead}
            onAddResponse={handleAddResponse}
            onClose={handleClose}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## 🎯 Summary & Best Practices

### Error Handling Pattern:
```typescript
try {
  setLoading(true);
  const result = await apiCall();
  // Handle success
} catch (error) {
  // Handle specific errors
  if (error.message.includes('401')) {
    // Redirect to login
  } else if (error.message.includes('403')) {
    // Show permission error
  } else {
    // Show generic error
  }
} finally {
  setLoading(false);
}
```

### Loading States:
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
```

### Toast Notifications:
```typescript
// Success
toast.success('Operation completed successfully');

// Error
toast.error('Something went wrong');

// Info
toast.info('Please wait...');
```

### Authentication Check Before API Calls:
```typescript
if (!isAuthenticated()) {
  navigate('/login');
  return;
}
```

---

## 🚀 You're All Set!

You now have complete integration guides for ALL backend functionality:

✅ **Part 1:** Authentication & User Management  
✅ **Part 2:** Books, Authors & Genres  
✅ **Part 3:** Borrowings, Reservations & Wishlist  
✅ **Part 4:** Reviews, Contact & Storage

All endpoints are documented with:
- Request/Response formats
- Frontend implementation code
- Component usage examples
- Error handling patterns
- Best practices

**Start building your frontend with confidence! 💪**
