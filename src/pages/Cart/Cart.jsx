import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Button, Input, Select, LoadingSpinner } from "../../components";
import { useUser, useAuth } from "../../context";
import { reservationService } from "../../services";
import {
  BORROWING_DURATIONS,
  MAX_BOOKS_PER_RESERVATION,
  getMinPickupDate,
  calculateDueDate,
  formatDate,
  validateForm,
} from "../../utils";
import styles from "./Cart.module.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItem, clearCart, createReservation } =
    useUser();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    membershipId: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map cart items to include book data - cart already stores full book objects
  const cartBooks = cart
    .map((item) => ({
      ...item,
      book: item.book, // Book data is already stored in cart from cartService
    }))
    .filter((item) => item.book); // Filter out items without book data

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUpdateItem = (bookId, updates) => {
    updateCartItem(bookId, updates);
  };

  const handleCheckout = async () => {
    const { isValid, errors: validationErrors } = validateForm(formData, [
      "fullName",
      "email",
      "membershipId",
    ]);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    // Check if all items have pickup dates
    const missingDates = cartBooks.some((item) => !item.pickupDate);
    if (missingDates) {
      setErrors({ general: "Please select pickup dates for all books" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Get the common pickup date from first item or use default
      let pickupDate;
      if (cartBooks[0]?.pickupDate) {
        pickupDate = new Date(cartBooks[0].pickupDate).toISOString();
      } else {
        // Default to 24+ hours in future (backend requirement)
        const minDate = new Date();
        minDate.setHours(minDate.getHours() + 25); // 25 hours to be safe
        minDate.setMinutes(0, 0, 0);
        pickupDate = minDate.toISOString();
      }

      // Format items for backend API - MUST use borrowingDuration!
      const items = cartBooks.map((item) => ({
        bookId: item.bookId || item.book?.id,
        borrowingDuration: item.borrowingDuration || item.duration || 14, // Backend expects borrowingDuration!
      }));

      // Call backend API to create reservation
      const reservation = await reservationService.createReservation({
        pickupDate,
        items,
        notes: `Reservation by ${formData.fullName}`,
      });

      // Also save locally for UI state
      createReservation({
        ...formData,
        ...reservation,
        books: cartBooks.map((item) => ({
          bookId: item.bookId,
          title: item.book.title,
          author: item.book.author,
          coverImage: item.book.coverImageUrl || item.book.coverImage,
          pickupDate: item.pickupDate,
          borrowingDuration: item.borrowingDuration || item.duration || 14,
          duration: item.duration || item.borrowingDuration || 14, // Keep both for compatibility
          dueDate: calculateDueDate(item.pickupDate, item.borrowingDuration || item.duration || 14).toISOString(),
        })),
      });

      // Navigate to confirmation with reservation data
      navigate("/checkout/confirmation", { 
        state: { 
          reservation,
          formData,
          books: cartBooks.map((item) => ({
            bookId: item.bookId,
            title: item.book.title,
            author: item.book.author,
            coverImage: item.book.coverImageUrl || item.book.coverImage,
            pickupDate: item.pickupDate,
            borrowingDuration: item.borrowingDuration || item.duration || 14,
            duration: item.duration || item.borrowingDuration || 14,
            dueDate: calculateDueDate(item.pickupDate, item.borrowingDuration || item.duration || 14).toISOString(),
          })),
        } 
      });
    } catch (error) {
      console.error("Checkout error:", error);
      setErrors({ general: error.message || "Failed to create reservation. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyIcon}>
          <ShoppingCart size={64} />
        </div>
        <h2>Your Cart is Empty</h2>
        <p>Browse our collection and add some books to reserve!</p>
        <Button onClick={() => navigate("/")} size="large">
          Browse Books
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Reservation Cart</h1>
        <p>You can reserve up to {MAX_BOOKS_PER_RESERVATION} books at a time</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.cartSection}>
          <div className={styles.cartHeader}>
            <span>
              {cart.length} {cart.length === 1 ? "Book" : "Books"} in Cart
            </span>
            <button className={styles.clearBtn} onClick={clearCart}>
              Clear All
            </button>
          </div>

          <div className={styles.cartItems}>
            {cartBooks.map((item) => {
              // Handle genre from backend (array) or legacy (string)
              const genreName = item.book.genres && item.book.genres.length > 0
                ? item.book.genres[0].name
                : (typeof item.book.genre === 'string' ? item.book.genre : item.book.genre?.name || 'General');
              
              // Handle author from backend (array) or legacy (string)
              const authorName = item.book.authors
                ? item.book.authors.map(a => a.name).join(", ")
                : item.book.author || "Unknown Author";
              
              return (
                <div key={item.bookId} className={styles.cartItem}>
                  <Link to={`/book/${item.bookId}`} className={styles.bookInfo}>
                    <img src={item.book.coverImage} alt={item.book.title} />
                    <div>
                      <h3>{item.book.title}</h3>
                      <p>{authorName}</p>
                      <span className={styles.genre}>{genreName}</span>
                    </div>
                  </Link>

                <div className={styles.itemOptions}>
                  <div className={styles.optionGroup}>
                    <label>
                      <Calendar size={16} />
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      min={getMinPickupDate()}
                      value={item.pickupDate || ""}
                      onChange={(e) =>
                        handleUpdateItem(item.bookId, {
                          pickupDate: e.target.value,
                        })
                      }
                      className={styles.dateInput}
                    />
                  </div>
                  <div className={styles.optionGroup}>
                    <label>
                      <Clock size={16} />
                      Duration
                    </label>
                    <select
                      value={item.borrowingDuration || item.duration || 14}
                      onChange={(e) =>
                        handleUpdateItem(item.bookId, {
                          borrowingDuration: parseInt(e.target.value),
                          duration: parseInt(e.target.value), // Keep both for compatibility
                        })
                      }
                      className={styles.durationSelect}
                    >
                      {BORROWING_DURATIONS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {item.pickupDate && (
                    <div className={styles.dueDate}>
                      Due:{" "}
                      {formatDate(
                        calculateDueDate(item.pickupDate, item.borrowingDuration || item.duration || 14)
                      )}
                    </div>
                  )}
                </div>

                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.bookId)}
                  aria-label="Remove from cart"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              );
            })}
          </div>
        </div>

        <div className={styles.checkoutSection}>
          <div className={styles.checkoutCard}>
            <h2>Reservation Details</h2>

            {errors.general && (
              <div className={styles.errorAlert}>
                <AlertCircle size={18} />
                {errors.general}
              </div>
            )}

            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Mehran Akhtar"
              error={errors.fullName}
              fullWidth
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="mehran.dev.au@gmail.com"
              error={errors.email}
              fullWidth
            />

            <Input
              label="Library Membership ID"
              name="membershipId"
              value={formData.membershipId}
              onChange={handleInputChange}
              placeholder="LIB-XXXXXXXX"
              error={errors.membershipId}
              fullWidth
            />

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Total Books</span>
                <span>{cart.length}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Reservation Fee</span>
                <span className={styles.free}>Free</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              loading={isSubmitting}
              fullWidth
              size="large"
              icon={ArrowRight}
            >
              Proceed to Checkout
            </Button>

            <p className={styles.terms}>
              By proceeding, you agree to our <a href="#">Terms & Conditions</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
