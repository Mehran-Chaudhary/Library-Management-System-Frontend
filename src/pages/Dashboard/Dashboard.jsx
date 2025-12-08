import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Book,
  Clock,
  Heart,
  History,
  Calendar,
  RefreshCw,
  X,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { Button, Modal } from "../../components";
import { useUser } from "../../context";
import { getBookById } from "../../data";
import {
  formatDate,
  getRemainingDays,
  isOverdue,
  calculateLateFine,
  LATE_FINE_PER_DAY,
  EXTENSION_DAYS,
} from "../../utils";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const {
    borrowedBooks,
    reservations,
    wishlist,
    totalBorrowed,
    extendBorrowing,
    cancelReservation,
    pickupReservation,
    removeFromWishlist,
  } = useUser();

  const [activeTab, setActiveTab] = useState("borrowed");
  const [extendModal, setExtendModal] = useState({ isOpen: false, book: null });
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    reservationId: null,
  });

  const pendingReservations = reservations.filter(
    (r) => r.status === "pending"
  );
  const pastReservations = reservations.filter((r) => r.status !== "pending");
  const wishlistBooks = wishlist.map((id) => getBookById(id)).filter(Boolean);

  const handleExtend = () => {
    if (extendModal.book) {
      const currentDue = new Date(extendModal.book.dueDate);
      currentDue.setDate(currentDue.getDate() + EXTENSION_DAYS);
      extendBorrowing(extendModal.book.bookId, currentDue.toISOString());
      setExtendModal({ isOpen: false, book: null });
    }
  };

  const handleCancelReservation = () => {
    if (cancelModal.reservationId) {
      cancelReservation(cancelModal.reservationId);
      setCancelModal({ isOpen: false, reservationId: null });
    }
  };

  const tabs = [
    {
      id: "borrowed",
      label: "Borrowed Books",
      icon: Book,
      count: borrowedBooks.length,
    },
    {
      id: "reservations",
      label: "Reservations",
      icon: Calendar,
      count: pendingReservations.length,
    },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: wishlist.length },
    {
      id: "history",
      label: "History",
      icon: History,
      count: pastReservations.length,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>My Dashboard</h1>
          <p>Manage your borrowed books, reservations, and wishlist</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <Book size={24} />
            <div>
              <span className={styles.statValue}>{borrowedBooks.length}</span>
              <span className={styles.statLabel}>Currently Borrowed</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <CheckCircle size={24} />
            <div>
              <span className={styles.statValue}>{totalBorrowed}</span>
              <span className={styles.statLabel}>Total Borrowed</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Heart size={24} />
            <div>
              <span className={styles.statValue}>{wishlist.length}</span>
              <span className={styles.statLabel}>In Wishlist</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.count > 0 && (
                <span className={styles.badge}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {/* Borrowed Books Tab */}
        {activeTab === "borrowed" && (
          <div className={styles.tabContent}>
            {borrowedBooks.length > 0 ? (
              <div className={styles.booksList}>
                {borrowedBooks.map((item) => {
                  const book = getBookById(item.bookId);
                  if (!book) return null;
                  const remaining = getRemainingDays(item.dueDate);
                  const overdue = isOverdue(item.dueDate);
                  const fine = calculateLateFine(
                    item.dueDate,
                    LATE_FINE_PER_DAY
                  );

                  return (
                    <div key={item.bookId} className={styles.borrowedCard}>
                      <Link
                        to={`/book/${item.bookId}`}
                        className={styles.bookLink}
                      >
                        <img src={book.coverImage} alt={book.title} />
                      </Link>
                      <div className={styles.bookInfo}>
                        <Link to={`/book/${item.bookId}`}>
                          <h3>{book.title}</h3>
                        </Link>
                        <p>{book.author}</p>
                        <div className={styles.borrowDetails}>
                          <span>
                            <Calendar size={14} />
                            Due: {formatDate(item.dueDate)}
                          </span>
                        </div>
                      </div>
                      <div className={styles.statusSection}>
                        <div
                          className={`${styles.daysRemaining} ${
                            overdue
                              ? styles.overdue
                              : remaining <= 3
                              ? styles.warning
                              : ""
                          }`}
                        >
                          <Clock size={18} />
                          {overdue ? (
                            <>
                              <span>{Math.abs(remaining)} days overdue</span>
                              <span className={styles.fine}>Fine: ${fine}</span>
                            </>
                          ) : (
                            <span>{remaining} days remaining</span>
                          )}
                        </div>
                        {!item.extended && !overdue && (
                          <Button
                            variant="outline"
                            size="small"
                            icon={RefreshCw}
                            onClick={() =>
                              setExtendModal({ isOpen: true, book: item })
                            }
                          >
                            Extend
                          </Button>
                        )}
                        {item.extended && (
                          <span className={styles.extendedBadge}>
                            Already Extended
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Book size={48} />
                <h3>No Borrowed Books</h3>
                <p>You haven&apos;t borrowed any books yet.</p>
                <Button onClick={() => (window.location.href = "/")}>
                  Browse Books
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === "reservations" && (
          <div className={styles.tabContent}>
            {pendingReservations.length > 0 ? (
              <div className={styles.reservationsList}>
                {pendingReservations.map((reservation) => (
                  <div key={reservation.id} className={styles.reservationCard}>
                    <div className={styles.reservationHeader}>
                      <div>
                        <span className={styles.reservationId}>
                          #{reservation.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className={styles.reservationDate}>
                          Reserved on {formatDate(reservation.createdAt)}
                        </span>
                      </div>
                      <span
                        className={`${styles.statusBadge} ${styles.pending}`}
                      >
                        Pending Pickup
                      </span>
                    </div>
                    <div className={styles.reservationBooks}>
                      {reservation.books.map((book) => (
                        <div key={book.bookId} className={styles.miniBook}>
                          <img src={book.coverImage} alt={book.title} />
                          <div>
                            <h4>{book.title}</h4>
                            <span>Pickup: {formatDate(book.pickupDate)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.reservationActions}>
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => pickupReservation(reservation.id)}
                      >
                        Mark as Picked Up
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() =>
                          setCancelModal({
                            isOpen: true,
                            reservationId: reservation.id,
                          })
                        }
                      >
                        Cancel Reservation
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Calendar size={48} />
                <h3>No Active Reservations</h3>
                <p>You don&apos;t have any pending reservations.</p>
                <Button onClick={() => (window.location.href = "/")}>
                  Reserve Books
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <div className={styles.tabContent}>
            {wishlistBooks.length > 0 ? (
              <div className={styles.wishlistGrid}>
                {wishlistBooks.map((book) => (
                  <div key={book.id} className={styles.wishlistCard}>
                    <Link to={`/book/${book.id}`}>
                      <img src={book.coverImage} alt={book.title} />
                    </Link>
                    <div className={styles.wishlistInfo}>
                      <Link to={`/book/${book.id}`}>
                        <h3>{book.title}</h3>
                      </Link>
                      <p>{book.author}</p>
                      <span className={styles.genre}>{book.genre}</span>
                    </div>
                    <div className={styles.wishlistActions}>
                      <Link to={`/book/${book.id}`} className={styles.viewBtn}>
                        View <ChevronRight size={16} />
                      </Link>
                      <button
                        className={styles.removeWishlist}
                        onClick={() => removeFromWishlist(book.id)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Heart size={48} />
                <h3>Your Wishlist is Empty</h3>
                <p>Save books you want to read later!</p>
                <Button onClick={() => (window.location.href = "/")}>
                  Browse Books
                </Button>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className={styles.tabContent}>
            {pastReservations.length > 0 ? (
              <div className={styles.historyList}>
                {pastReservations.map((reservation) => (
                  <div key={reservation.id} className={styles.historyCard}>
                    <div className={styles.historyHeader}>
                      <span className={styles.reservationId}>
                        #{reservation.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[reservation.status]
                        }`}
                      >
                        {reservation.status === "picked_up"
                          ? "Picked Up"
                          : "Cancelled"}
                      </span>
                    </div>
                    <p className={styles.historyDate}>
                      {formatDate(reservation.createdAt)}
                    </p>
                    <div className={styles.historyBooks}>
                      {reservation.books.map((book) => (
                        <span key={book.bookId}>{book.title}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <History size={48} />
                <h3>No History Yet</h3>
                <p>Your reservation history will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Extend Modal */}
      <Modal
        isOpen={extendModal.isOpen}
        onClose={() => setExtendModal({ isOpen: false, book: null })}
        title="Extend Borrowing Period"
        size="small"
      >
        {extendModal.book && (
          <div className={styles.extendModal}>
            <p>
              Extend your borrowing period for{" "}
              <strong>{getBookById(extendModal.book.bookId)?.title}</strong> by{" "}
              {EXTENSION_DAYS} days?
            </p>
            <div className={styles.extendInfo}>
              <div>
                <span>Current Due Date:</span>
                <strong>{formatDate(extendModal.book.dueDate)}</strong>
              </div>
              <div>
                <span>New Due Date:</span>
                <strong>
                  {formatDate(
                    new Date(
                      new Date(extendModal.book.dueDate).getTime() +
                        EXTENSION_DAYS * 24 * 60 * 60 * 1000
                    )
                  )}
                </strong>
              </div>
            </div>
            <p className={styles.extendNote}>
              <AlertTriangle size={16} />
              This is a one-time extension. You cannot extend again after this.
            </p>
            <div className={styles.modalActions}>
              <Button
                variant="secondary"
                onClick={() => setExtendModal({ isOpen: false, book: null })}
              >
                Cancel
              </Button>
              <Button onClick={handleExtend}>Confirm Extension</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, reservationId: null })}
        title="Cancel Reservation"
        size="small"
      >
        <div className={styles.cancelModal}>
          <p>Are you sure you want to cancel this reservation?</p>
          <p className={styles.cancelWarning}>
            <AlertTriangle size={16} />
            This action cannot be undone.
          </p>
          <div className={styles.modalActions}>
            <Button
              variant="secondary"
              onClick={() =>
                setCancelModal({ isOpen: false, reservationId: null })
              }
            >
              Keep Reservation
            </Button>
            <Button variant="danger" onClick={handleCancelReservation}>
              Cancel Reservation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
