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
} from "lucide-react";
import {
  Button,
  Rating,
  LoadingSpinner,
  Modal,
  Input,
  Select,
} from "../../components";
import { getBookById } from "../../data";
import { useUser } from "../../context";
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
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    addToCart,
    isInCart,
    canAddToCart,
  } = useUser();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reserveForm, setReserveForm] = useState({
    pickupDate: getMinPickupDate(),
    duration: 14,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundBook = getBookById(id);
      setBook(foundBook);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading book details..." />
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

  const inWishlist = isInWishlist(book.id);
  const inCart = isInCart(book.id);
  const isAvailable =
    book.status === AVAILABILITY_STATUS.AVAILABLE && book.availableCopies > 0;

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
              src={book.coverImage}
              alt={book.title}
              className={styles.coverImage}
            />
            <span className={`${styles.statusBadge} ${getStatusBadgeClass()}`}>
              {book.status}
            </span>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <span className={styles.genre}>{book.genre}</span>
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>by {book.author}</p>

          <div className={styles.ratingSection}>
            <Rating value={book.rating} size="large" />
            <span className={styles.reviewCount}>
              ({book.reviews.length} reviews)
            </span>
          </div>

          <p className={styles.description}>{book.description}</p>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <Hash size={18} />
              <span>ISBN: {book.isbn}</span>
            </div>
            <div className={styles.metaItem}>
              <Building2 size={18} />
              <span>{book.publisher}</span>
            </div>
            <div className={styles.metaItem}>
              <Calendar size={18} />
              <span>
                {book.publicationYear > 0
                  ? book.publicationYear
                  : `${Math.abs(book.publicationYear)} BC`}
              </span>
            </div>
            <div className={styles.metaItem}>
              <BookOpen size={18} />
              <span>{book.pageCount} pages</span>
            </div>
          </div>

          <div className={styles.availability}>
            <div className={styles.availabilityInfo}>
              <span className={styles.copiesLabel}>Availability:</span>
              <span className={styles.copiesValue}>
                {book.availableCopies} of {book.totalCopies} copies available
              </span>
            </div>
            {book.expectedReturnDate &&
              book.status === AVAILABILITY_STATUS.BORROWED && (
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
                onClick={() => setIsReserveModalOpen(true)}
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
        {book.reviews.length > 0 ? (
          <div className={styles.reviewsList}>
            {book.reviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewUser}>
                    <div className={styles.avatar}>
                      <User size={20} />
                    </div>
                    <span className={styles.userName}>{review.user}</span>
                  </div>
                  <Rating
                    value={review.rating}
                    size="small"
                    showValue={false}
                  />
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
                <span className={styles.reviewDate}>
                  {formatDate(review.date)}
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
            <img src={book.coverImage} alt={book.title} />
            <div>
              <h4>{book.title}</h4>
              <p>{book.author}</p>
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
