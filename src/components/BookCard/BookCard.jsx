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
  const isAvailable =
    book.status === AVAILABILITY_STATUS.AVAILABLE && book.availableCopies > 0;

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
    switch (book.status) {
      case AVAILABILITY_STATUS.AVAILABLE:
        return book.availableCopies > 0 ? styles.available : styles.unavailable;
      case AVAILABILITY_STATUS.RESERVED:
        return styles.reserved;
      case AVAILABILITY_STATUS.BORROWED:
        return styles.borrowed;
      default:
        return "";
    }
  };

  const getStatusText = () => {
    if (
      book.status === AVAILABILITY_STATUS.AVAILABLE &&
      book.availableCopies === 0
    ) {
      return "Unavailable";
    }
    return book.status;
  };

  return (
    <Link to={`/book/${book.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={book.coverImage} alt={book.title} className={styles.image} />
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
        <span className={styles.genre}>{book.genre}</span>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>by {book.author}</p>
        <div className={styles.footer}>
          <Rating value={book.rating} size="small" />
          <span className={styles.copies}>
            {book.availableCopies}/{book.totalCopies} available
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
