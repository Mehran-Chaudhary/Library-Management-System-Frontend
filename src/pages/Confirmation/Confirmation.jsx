import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle,
  Calendar,
  Clock,
  Book,
  Mail,
  Download,
  Home,
} from "lucide-react";
import { Button } from "../../components";
import { useUser } from "../../context";
import { formatDate, LATE_FINE_PER_DAY } from "../../utils";
import styles from "./Confirmation.module.css";

const Confirmation = () => {
  const navigate = useNavigate();
  const { reservations } = useUser();
  const [accepted, setAccepted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Get the latest reservation
  const latestReservation = reservations[reservations.length - 1];

  useEffect(() => {
    if (!latestReservation) {
      navigate("/cart");
    }
  }, [latestReservation, navigate]);

  if (!latestReservation) {
    return null;
  }

  const handleConfirm = () => {
    if (accepted) {
      setShowConfirmation(true);
    }
  };

  if (showConfirmation) {
    return (
      <div className={styles.confirmationPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle size={64} />
          </div>
          <h1>Reservation Confirmed!</h1>
          <p>Your books have been successfully reserved.</p>

          <div className={styles.reservationId}>
            <span>Reservation ID</span>
            <strong>{latestReservation.id.slice(0, 8).toUpperCase()}</strong>
          </div>

          <div className={styles.qrSection}>
            <QRCodeSVG
              value={`BOOKNEST-${latestReservation.id}`}
              size={180}
              level="H"
              includeMargin
              className={styles.qrCode}
            />
            <p>Show this QR code at the library for pickup</p>
          </div>

          <div className={styles.emailNotice}>
            <Mail size={20} />
            <span>
              A confirmation email has been sent to{" "}
              <strong>{latestReservation.email}</strong>
            </span>
          </div>

          <div className={styles.booksList}>
            <h3>Reserved Books</h3>
            {latestReservation.books.map((book) => {
              // Handle author from backend (array) or legacy (string)
              const authorName = book.authors
                ? book.authors.map(a => a.name).join(", ")
                : book.author || "Unknown Author";
              
              return (
                <div key={book.bookId} className={styles.bookItem}>
                  <img src={book.coverImageUrl || book.coverImage} alt={book.title} />
                  <div className={styles.bookDetails}>
                    <h4>{book.title}</h4>
                    <p>{authorName}</p>
                  <div className={styles.dates}>
                    <span>
                      <Calendar size={14} /> Pickup:{" "}
                      {formatDate(book.pickupDate)}
                    </span>
                    <span>
                      <Clock size={14} /> Due: {formatDate(book.dueDate)}
                    </span>
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
              Reserved Books ({latestReservation.books.length})
            </h2>
            <div className={styles.booksGrid}>
              {latestReservation.books.map((book) => {
                // Handle author from backend (array) or legacy (string)
                const authorName = book.authors
                  ? book.authors.map(a => a.name).join(", ")
                  : book.author || "Unknown Author";
                
                return (
                  <div key={book.bookId} className={styles.summaryBook}>
                    <img src={book.coverImageUrl || book.coverImage} alt={book.title} />
                    <div>
                      <h4>{book.title}</h4>
                      <p>{authorName}</p>
                    <div className={styles.bookDates}>
                      <span>
                        <Calendar size={14} /> Pickup:{" "}
                        {formatDate(book.pickupDate)}
                      </span>
                      <span>
                        <Clock size={14} /> Due: {formatDate(book.dueDate)}
                      </span>
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
                <span>{latestReservation.fullName}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Email</label>
                <span>{latestReservation.email}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Membership ID</label>
                <span>{latestReservation.membershipId}</span>
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

            <div className={styles.termsCheck}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span className={styles.checkmark}></span>I have read and agree
                to the <a href="#">Terms & Conditions</a> and{" "}
                <a href="#">Late Return Policy</a>
              </label>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!accepted}
              fullWidth
              size="large"
            >
              Confirm Reservation
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
