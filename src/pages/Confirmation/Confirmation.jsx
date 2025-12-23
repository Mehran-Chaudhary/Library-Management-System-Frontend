import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  Clock,
  Book,
  Mail,
  Download,
  Home,
  AlertCircle,
  Loader,
} from "lucide-react";
import { Button, LoadingSpinner } from "../../components";
import { useUser } from "../../context";
import { reservationService } from "../../services";
import { formatDate, LATE_FINE_PER_DAY } from "../../utils";
import styles from "./Confirmation.module.css";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservations } = useUser();

  // Get reservation data from navigation state (passed from Cart.jsx)
  const { reservation: navReservation, formData, books: navBooks } = location.state || {};

  const [accepted, setAccepted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState(null);
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  // Use navigation state reservation or fall back to local reservations
  const latestReservation = navReservation || reservations[reservations.length - 1];
  const books = navBooks || latestReservation?.books || latestReservation?.items || [];

  useEffect(() => {
    if (!latestReservation) {
      navigate("/cart");
    }
  }, [latestReservation, navigate]);

  if (!latestReservation) {
    return null;
  }

  const handleConfirm = async () => {
    if (!accepted) return;

    setIsConfirming(true);
    setConfirmError(null);

    try {
      // Call backend API to confirm reservation and get QR code
      const confirmed = await reservationService.confirmReservation(
        latestReservation.id,
        { termsAccepted: true }
      );

      setConfirmedReservation(confirmed);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Confirmation error:", error);
      setConfirmError(error.message || "Failed to confirm reservation. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  // Helper to get book info from items
  const getBookDisplay = (item) => {
    const book = item.book || item;
    const authorName = book.authors
      ? book.authors.map(a => a.name).join(", ")
      : book.author || "Unknown Author";
    const coverImage = book.coverImageUrl || book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop";
    const title = book.title || "Untitled";
    const pickupDate = item.pickupDate || latestReservation.pickupDate;
    const dueDate = item.dueDate || book.dueDate;

    return { title, authorName, coverImage, pickupDate, dueDate };
  };

  if (showConfirmation && confirmedReservation) {
    return (
      <div className={styles.confirmationPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle size={64} />
          </div>
          <h1>Reservation Confirmed!</h1>
          <p>Your books have been successfully reserved.</p>

          <div className={styles.reservationId}>
            <span>Reservation Number</span>
            <strong>{confirmedReservation.reservationNumber || latestReservation.reservationNumber || latestReservation.id?.slice(0, 8).toUpperCase()}</strong>
          </div>

          {/* Display QR Code from backend - it's a base64 data URL */}
          <div className={styles.qrSection}>
            {confirmedReservation.qrCode ? (
              <img 
                src={confirmedReservation.qrCode} 
                alt="Reservation QR Code"
                className={styles.qrCode}
                style={{ width: 180, height: 180 }}
              />
            ) : (
              <div className={styles.qrPlaceholder}>
                <Book size={64} />
                <p>QR Code not available</p>
              </div>
            )}
            <p>Show this QR code at the library for pickup</p>
          </div>

          <div className={styles.emailNotice}>
            <Mail size={20} />
            <span>
              A confirmation email has been sent to{" "}
              <strong>{formData?.email || latestReservation.email || "your email"}</strong>
            </span>
          </div>

          <div className={styles.booksList}>
            <h3>Reserved Books</h3>
            {books.map((item, index) => {
              const { title, authorName, coverImage, pickupDate, dueDate } = getBookDisplay(item);
              
              return (
                <div key={item.bookId || item.id || index} className={styles.bookItem}>
                  <img src={coverImage} alt={title} />
                  <div className={styles.bookDetails}>
                    <h4>{title}</h4>
                    <p>{authorName}</p>
                    <div className={styles.dates}>
                      {pickupDate && (
                        <span>
                          <Calendar size={14} /> Pickup: {formatDate(pickupDate)}
                        </span>
                      )}
                      {dueDate && (
                        <span>
                          <Clock size={14} /> Due: {formatDate(dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.actions}>
            <Button onClick={() => navigate("/dashboard")} size="large">
              View Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              icon={Home}
              size="large"
            >
              Continue Browsing
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Checkout Summary</h1>
        <p>Review your reservation details before confirming</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.summarySection}>
          <div className={styles.card}>
            <h2>
              <Book size={22} />
              Reserved Books ({books.length})
            </h2>
            <div className={styles.booksGrid}>
              {books.map((item, index) => {
                const { title, authorName, coverImage, pickupDate, dueDate } = getBookDisplay(item);
                
                return (
                  <div key={item.bookId || item.id || index} className={styles.summaryBook}>
                    <img src={coverImage} alt={title} />
                    <div>
                      <h4>{title}</h4>
                      <p>{authorName}</p>
                      <div className={styles.bookDates}>
                        {pickupDate && (
                          <span>
                            <Calendar size={14} /> Pickup: {formatDate(pickupDate)}
                          </span>
                        )}
                        {dueDate && (
                          <span>
                            <Clock size={14} /> Due: {formatDate(dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.card}>
            <h2>Borrower Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Full Name</label>
                <span>{formData?.fullName || latestReservation.fullName || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Email</label>
                <span>{formData?.email || latestReservation.email || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Reservation Number</label>
                <span>{latestReservation.reservationNumber || latestReservation.id?.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.confirmSection}>
          <div className={styles.policyCard}>
            <h3>Late Return Policy</h3>
            <div className={styles.policyContent}>
              <p>Please return books by their due date to avoid late fees.</p>
              <div className={styles.fineInfo}>
                <span>Late Fine:</span>
                <strong>${LATE_FINE_PER_DAY} per day per book</strong>
              </div>
              <ul>
                <li>Books must be returned in good condition</li>
                <li>One-time extension of 7 days is available</li>
                <li>Lost or damaged books may incur replacement costs</li>
                <li>
                  Reservations not picked up within 48 hours will be cancelled
                </li>
              </ul>
            </div>

            {confirmError && (
              <div className={styles.errorAlert}>
                <AlertCircle size={18} />
                {confirmError}
              </div>
            )}

            <div className={styles.termsCheck}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  disabled={isConfirming}
                />
                <span className={styles.checkmark}></span>I have read and agree
                to the <a href="#">Terms & Conditions</a> and{" "}
                <a href="#">Late Return Policy</a>
              </label>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!accepted || isConfirming}
              loading={isConfirming}
              fullWidth
              size="large"
            >
              {isConfirming ? "Confirming..." : "Confirm Reservation"}
            </Button>

            <Link to="/cart" className={styles.backLink}>
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
