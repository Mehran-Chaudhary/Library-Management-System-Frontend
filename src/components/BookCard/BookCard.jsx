import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import Rating from "../Rating";
import { useUser } from "../../context";
import { AVAILABILITY_STATUS } from "../../utils";
import styles from "./BookCard.module.css";

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isInCart,
    addToCart,
    canAddToCart,
  } = useUser();

  const inWishlist = isInWishlist(book.id);
  const inCart = isInCart(book.id);
  
  // Handle both backend and legacy data structures
  const availableCopies = book.availableCopies ?? 0;
  const totalCopies = book.totalCopies ?? 0;
  
  // Backend returns lowercase status: "available", "borrowed", "reserved", "maintenance"
  // Convert to uppercase for consistency
  const status = (book.status?.toUpperCase() || (availableCopies > 0 ? "AVAILABLE" : "BORROWED"));
  const isAvailable = (status === "AVAILABLE" && availableCopies > 0) || (book.status?.toLowerCase() === "available" && availableCopies > 0);
  
  // Handle authors from backend (array) or legacy (string)
  const authorName = book.authors
    ? book.authors.map(a => a.name).join(", ")
    : book.author || "Unknown Author";
  
  // Handle genres from backend (array) or legacy (string)
  let genreName = "General";
  if (book.genres && Array.isArray(book.genres) && book.genres.length > 0) {
    genreName = book.genres[0].name || "General";
  } else if (book.genre) {
    genreName = typeof book.genre === 'string' ? book.genre : (book.genre?.name || "General");
  }
  
  // Cover image with fallback - backend uses coverImageUrl
  const coverImage = book.coverImageUrl || book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop";
  
  // Get rating - backend returns averageRating
  const bookRating = book.averageRating || book.rating || 0;
  const reviewCount = book.reviewCount || book.reviews?.length || 0;
  
  // Debug log for first book only
  if (!window.bookCardDebugLogged) {
    console.log("📚 BookCard Debug - First Book:", {
      title: book.title,
      averageRating: book.averageRating,
      rating: book.rating,
      reviewCount: book.reviewCount,
      reviews: book.reviews,
      finalRating: bookRating
    });
    window.bookCardDebugLogged = true;
  }

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book.id);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to book details page where user can properly select pickup date and duration
    // This ensures complete reservation flow with all required information
    if (!inCart && isAvailable && canAddToCart) {
      navigate(`/book/${book.id}`);
    }
  };

  const getStatusClass = () => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "AVAILABLE":
        return availableCopies > 0 ? styles.available : styles.unavailable;
      case "RESERVED":
        return styles.reserved;
      case "BORROWED":
        return styles.borrowed;
      case "MAINTENANCE":
        return styles.maintenance;
      default:
        return "";
    }
  };

  const getStatusText = () => {
    if (status === "AVAILABLE" && availableCopies === 0) {
      return "Unavailable";
    }
    // Display user-friendly status text
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <Link to={`/book/${book.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={coverImage} alt={book.title} className={styles.image} />
        <div className={styles.overlay}>
          <button
            className={`${styles.actionBtn} ${inWishlist ? styles.active : ""}`}
            onClick={handleWishlistClick}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
          </button>
          {isAvailable && (
            <button
              className={`${styles.actionBtn} ${inCart ? styles.active : ""}`}
              onClick={handleAddToCart}
              disabled={inCart || !canAddToCart}
              aria-label={inCart ? "In cart" : "Add to cart"}
            >
              <ShoppingCart size={20} />
            </button>
          )}
        </div>
        <span className={`${styles.status} ${getStatusClass()}`}>
          {getStatusText()}
        </span>
        {book.isNewArrival && <span className={styles.newBadge}>New</span>}
      </div>
      <div className={styles.content}>
        <span className={styles.genre}>{genreName}</span>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>by {authorName}</p>
        <div className={styles.footer}>
          <Rating value={bookRating} size="small" />
          <span className={styles.copies}>
            {availableCopies}/{totalCopies} available
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
