import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import Rating from "../Rating";
import { useUser } from "../../context";
import { AVAILABILITY_STATUS } from "../../utils";
import styles from "./BookCard.module.css";

const BookCard = ({ book }) => {
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
  const status = book.status || (availableCopies > 0 ? AVAILABILITY_STATUS.AVAILABLE : AVAILABILITY_STATUS.BORROWED);
  const isAvailable = status === AVAILABILITY_STATUS.AVAILABLE && availableCopies > 0;
  
  // Handle authors from backend (array) or legacy (string)
  const authorName = book.authors
    ? book.authors.map(a => a.name).join(", ")
    : book.author || "Unknown Author";
  
  // Handle genres from backend (array) or legacy (string)
  const genreName = book.genres && book.genres.length > 0
    ? book.genres[0].name
    : book.genre || "General";
  
  // Cover image with fallback
  const coverImage = book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop";

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
    if (!inCart && isAvailable && canAddToCart) {
      addToCart(book.id, null, 14);
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case AVAILABILITY_STATUS.AVAILABLE:
        return availableCopies > 0 ? styles.available : styles.unavailable;
      case AVAILABILITY_STATUS.RESERVED:
        return styles.reserved;
      case AVAILABILITY_STATUS.BORROWED:
        return styles.borrowed;
      default:
        return "";
    }
  };

  const getStatusText = () => {
    if (status === AVAILABILITY_STATUS.AVAILABLE && availableCopies === 0) {
      return "Unavailable";
    }
    return status;
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
          <Rating value={book.averageRating || book.rating || 0} size="small" />
          <span className={styles.copies}>
            {availableCopies}/{totalCopies} available
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
