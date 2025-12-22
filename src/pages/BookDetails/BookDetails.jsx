import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Calendar,
  BookOpen,
  Building2,
  Hash,
  Clock,
  Star,
  User,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Rating,
  LoadingSpinner,
  Modal,
  Input,
  Select,
} from "../../components";
import { bookService, reviewService } from "../../services";
import { useUser, useAuth } from "../../context";
import {
  AVAILABILITY_STATUS,
  BORROWING_DURATIONS,
  formatDate,
  getMinPickupDate,
} from "../../utils";
import styles from "./BookDetails.module.css";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    addToCart,
    isInCart,
    canAddToCart,
  } = useUser();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reserveForm, setReserveForm] = useState({
    pickupDate: getMinPickupDate(),
    duration: 14,
  });

  useEffect(() => {
    const fetchBook = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [bookData, bookReviews] = await Promise.all([
          bookService.getBookById(id),
          reviewService.getReviewsByBook(id).catch(() => []),
        ]);
        
        setBook(bookData);
        setReviews(bookReviews || []);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError(err.message || "Failed to load book details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading book details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.notFound}>
        <AlertCircle size={48} />
        <h2>Error Loading Book</h2>
        <p>{error}</p>
        <Button onClick={() => navigate("/")}>Go Back Home</Button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className={styles.notFound}>
        <h2>Book Not Found</h2>
        <p>The book you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => navigate("/")}>Go Back Home</Button>
      </div>
    );
  }

  // Handle both backend and legacy data structures
  const availableCopies = book.availableCopies ?? 0;
  const totalCopies = book.totalCopies ?? 0;
  const status = book.status || (availableCopies > 0 ? AVAILABILITY_STATUS.AVAILABLE : AVAILABILITY_STATUS.BORROWED);
  const isAvailable = status === AVAILABILITY_STATUS.AVAILABLE && availableCopies > 0;
  
  const authorName = book.authors
    ? book.authors.map(a => a.name).join(", ")
    : book.author || "Unknown Author";
  
  const genreName = book.genres && book.genres.length > 0
    ? book.genres.map(g => g.name).join(", ")
    : book.genre || "General";
  
  const coverImage = book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop";
  const bookRating = book.averageRating || book.rating || 0;

  const inWishlist = isInWishlist(book.id);
  const inCart = isInCart(book.id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book.id);
    }
  };

  const handleReserve = () => {
    addToCart(book.id, reserveForm.pickupDate, reserveForm.duration);
    setIsReserveModalOpen(false);
  };

  const getStatusBadgeClass = () => {
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

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className={styles.bookLayout}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img
              src={coverImage}
              alt={book.title}
              className={styles.coverImage}
            />
            <span className={`${styles.statusBadge} ${getStatusBadgeClass()}`}>
              {status}
            </span>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <span className={styles.genre}>{genreName}</span>
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>by {authorName}</p>

          <div className={styles.ratingSection}>
            <Rating value={bookRating} size="large" />
            <span className={styles.reviewCount}>
              ({reviews.length} reviews)
            </span>
          </div>

          <p className={styles.description}>{book.description}</p>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <Hash size={18} />
              <span>ISBN: {book.isbn || "N/A"}</span>
            </div>
            <div className={styles.metaItem}>
              <Building2 size={18} />
              <span>{book.publisher || "Unknown Publisher"}</span>
            </div>
            <div className={styles.metaItem}>
              <Calendar size={18} />
              <span>
                {book.publicationYear > 0
                  ? book.publicationYear
                  : book.publicationYear
                  ? `${Math.abs(book.publicationYear)} BC`
                  : "Unknown"}
              </span>
            </div>
            <div className={styles.metaItem}>
              <BookOpen size={18} />
              <span>{book.pageCount || "N/A"} pages</span>
            </div>
          </div>

          <div className={styles.availability}>
            <div className={styles.availabilityInfo}>
              <span className={styles.copiesLabel}>Availability:</span>
              <span className={styles.copiesValue}>
                {availableCopies} of {totalCopies} copies available
              </span>
            </div>
            {book.expectedReturnDate &&
              status === AVAILABILITY_STATUS.BORROWED && (
                <div className={styles.returnDate}>
                  <Clock size={18} />
                  <span>
                    Expected return: {formatDate(book.expectedReturnDate)}
                  </span>
                </div>
              )}
          </div>

          <div className={styles.actions}>
            {isAvailable ? (
              <Button
                onClick={() => {
                  if (isAuthenticated) {
                    setIsReserveModalOpen(true);
                  } else {
                    navigate("/login", { state: { from: { pathname: `/book/${book.id}` } } });
                  }
                }}
                disabled={inCart || !canAddToCart}
                icon={ShoppingCart}
                size="large"
              >
                {inCart
                  ? "In Cart"
                  : canAddToCart
                  ? "Reserve Book"
                  : "Cart Full"}
              </Button>
            ) : (
              <Button disabled size="large">
                Not Available
              </Button>
            )}
            <Button
              variant={inWishlist ? "primary" : "outline"}
              onClick={handleWishlistToggle}
              icon={Heart}
              size="large"
            >
              {inWishlist ? "In Wishlist" : "Add to Wishlist"}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className={styles.reviewsSection}>
        <h2 className={styles.reviewsTitle}>
          <Star size={24} />
          Reviews & Ratings
        </h2>
        {reviews.length > 0 ? (
          <div className={styles.reviewsList}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewUser}>
                    <div className={styles.avatar}>
                      <User size={20} />
                    </div>
                    <span className={styles.userName}>
                      {review.user?.firstName 
                        ? `${review.user.firstName} ${review.user.lastName || ""}`
                        : review.user || "Anonymous"}
                    </span>
                  </div>
                  <Rating
                    value={review.rating}
                    size="small"
                    showValue={false}
                  />
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
                <span className={styles.reviewDate}>
                  {formatDate(review.createdAt || review.date)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noReviews}>
            No reviews yet. Be the first to review!
          </p>
        )}
      </section>

      {/* Reserve Modal */}
      <Modal
        isOpen={isReserveModalOpen}
        onClose={() => setIsReserveModalOpen(false)}
        title="Reserve Book"
        size="small"
      >
        <div className={styles.reserveModal}>
          <div className={styles.reserveBookInfo}>
            <img src={coverImage} alt={book.title} />
            <div>
              <h4>{book.title}</h4>
              <p>{authorName}</p>
            </div>
          </div>
          <Input
            label="Preferred Pickup Date"
            type="date"
            min={getMinPickupDate()}
            value={reserveForm.pickupDate}
            onChange={(e) =>
              setReserveForm({ ...reserveForm, pickupDate: e.target.value })
            }
            fullWidth
          />
          <Select
            label="Borrowing Duration"
            options={BORROWING_DURATIONS}
            value={reserveForm.duration}
            onChange={(e) =>
              setReserveForm({
                ...reserveForm,
                duration: parseInt(e.target.value),
              })
            }
            fullWidth
          />
          <div className={styles.reserveActions}>
            <Button
              variant="secondary"
              onClick={() => setIsReserveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleReserve}>Add to Cart</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookDetails;
