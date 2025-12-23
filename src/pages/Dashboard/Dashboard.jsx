import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  User,
  AlertCircle,
} from "lucide-react";
import { Button, Modal, LoadingSpinner } from "../../components";
import { useUser, useAuth } from "../../context";
import { borrowingService, reservationService, wishlistService } from "../../services";
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { removeFromWishlist } = useUser();

  // State for backend data
  const [activeBorrowings, setActiveBorrowings] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [reservationHistory, setReservationHistory] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("borrowed");
  const [extendModal, setExtendModal] = useState({ isOpen: false, borrowing: null });
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    reservationId: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [borrowings, reservations, history, wishlist, stats] = await Promise.all([
          borrowingService.getActiveBorrowings().catch(() => []),
          reservationService.getActiveReservations().catch(() => []),
          reservationService.getReservationHistory().catch(() => []),
          wishlistService.getWishlist().catch(() => []),
          borrowingService.getDashboardStats().catch(() => null),
        ]);

        setActiveBorrowings(borrowings || []);
        setActiveReservations(reservations || []);
        setReservationHistory(history || []);
        setWishlistItems(wishlist || []);
        setDashboardStats(stats);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleExtend = async () => {
    if (extendModal.borrowing) {
      setActionLoading(true);
      try {
        const result = await borrowingService.extendBorrowing(extendModal.borrowing.id);
        // Update local state
        setActiveBorrowings(prev => 
          prev.map(b => 
            b.id === extendModal.borrowing.id 
              ? { ...b, dueDate: result.data.newDueDate, hasBeenExtended: true }
              : b
          )
        );
        setExtendModal({ isOpen: false, borrowing: null });
      } catch (err) {
        console.error("Error extending borrowing:", err);
        alert(err.message || "Failed to extend borrowing");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleCancelReservation = async () => {
    if (cancelModal.reservationId) {
      setActionLoading(true);
      try {
        await reservationService.cancelReservation(cancelModal.reservationId);
        // Remove from active reservations
        setActiveReservations(prev => 
          prev.filter(r => r.id !== cancelModal.reservationId)
        );
        // Refresh history
        const history = await reservationService.getReservationHistory().catch(() => []);
        setReservationHistory(history || []);
        setCancelModal({ isOpen: false, reservationId: null });
      } catch (err) {
        console.error("Error cancelling reservation:", err);
        alert(err.message || "Failed to cancel reservation");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleRemoveFromWishlist = async (bookId) => {
    try {
      await wishlistService.removeFromWishlist(bookId);
      setWishlistItems(prev => prev.filter(item => item.book?.id !== bookId && item.id !== bookId));
      removeFromWishlist(bookId); // Also update local context
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const tabs = [
    {
      id: "borrowed",
      label: "Borrowed Books",
      icon: Book,
      count: activeBorrowings.length,
    },
    {
      id: "reservations",
      label: "Reservations",
      icon: Calendar,
      count: activeReservations.length,
    },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: wishlistItems.length },
    {
      id: "history",
      label: "History",
      icon: History,
      count: reservationHistory.length,
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading your dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} />
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Welcome, {user?.firstName || "User"}!</h1>
          <p>Manage your borrowed books, reservations, and wishlist</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <Book size={24} />
            <div>
              <span className={styles.statValue}>{activeBorrowings.length}</span>
              <span className={styles.statLabel}>Currently Borrowed</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <CheckCircle size={24} />
            <div>
              <span className={styles.statValue}>
                {dashboardStats?.totalBorrowed || activeBorrowings.length}
              </span>
              <span className={styles.statLabel}>Total Borrowed</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Heart size={24} />
            <div>
              <span className={styles.statValue}>{wishlistItems.length}</span>
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
            {activeBorrowings.length > 0 ? (
              <div className={styles.booksList}>
                {activeBorrowings.map((borrowing) => {
                  const book = borrowing.book;
                  if (!book) return null;
                  const remaining = borrowing.remainingDays ?? getRemainingDays(borrowing.dueDate);
                  const overdue = borrowing.isOverdue ?? isOverdue(borrowing.dueDate);
                  const fine = borrowing.fineAmount ?? calculateLateFine(borrowing.dueDate, LATE_FINE_PER_DAY);
                  const coverImage = book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop";
                  const authorName = book.authors?.map(a => a.name).join(", ") || book.author || "Unknown";

                  return (
                    <div key={borrowing.id} className={styles.borrowedCard}>
                      <Link
                        to={`/book/${book.id}`}
                        className={styles.bookLink}
                      >
                        <img src={coverImage} alt={book.title} />
                      </Link>
                      <div className={styles.bookInfo}>
                        <Link to={`/book/${book.id}`}>
                          <h3>{book.title}</h3>
                        </Link>
                        <p>{authorName}</p>
                        <div className={styles.borrowDetails}>
                          <span>
                            <Calendar size={14} />
                            Due: {formatDate(borrowing.dueDate)}
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
                              {fine > 0 && <span className={styles.fine}>Fine: ${fine}</span>}
                            </>
                          ) : (
                            <span>{remaining} days remaining</span>
                          )}
                        </div>
                        {!borrowing.hasBeenExtended && !overdue && (
                          <Button
                            variant="outline"
                            size="small"
                            icon={RefreshCw}
                            onClick={() =>
                              setExtendModal({ isOpen: true, borrowing })
                            }
                          >
                            Extend
                          </Button>
                        )}
                        {borrowing.hasBeenExtended && (
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
                <Button onClick={() => navigate("/")}>
                  Browse Books
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === "reservations" && (
          <div className={styles.tabContent}>
            {activeReservations.length > 0 ? (
              <div className={styles.reservationsList}>
                {activeReservations.map((reservation) => (
                  <div key={reservation.id} className={styles.reservationCard}>
                    <div className={styles.reservationHeader}>
                      <div>
                        <span className={styles.reservationId}>
                          #{reservation.reservationNumber || reservation.id?.slice(0, 8).toUpperCase()}
                        </span>
                        <span className={styles.reservationDate}>
                          Reserved on {formatDate(reservation.createdAt)}
                        </span>
                      </div>
                      <span
                        className={`${styles.statusBadge} ${styles[reservation.status] || styles.pending}`}
                      >
                        {reservation.status === "confirmed" ? "Ready for Pickup" : "Pending"}
                      </span>
                    </div>
                    <div className={styles.reservationBooks}>
                      {(reservation.items || reservation.books || []).map((item) => {
                        const book = item.book || item;
                        const coverImage = book.coverImageUrl || book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop";
                        return (
                          <div key={book.id || item.bookId} className={styles.miniBook}>
                            <img src={coverImage} alt={book.title} />
                            <div>
                              <h4>{book.title}</h4>
                              <span>Due: {formatDate(item.dueDate || reservation.pickupDate)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Show QR code for confirmed reservations */}
                    {reservation.status === "confirmed" && reservation.qrCode && (
                      <div className={styles.qrCodeSection}>
                        <img 
                          src={reservation.qrCode} 
                          alt="Pickup QR Code"
                          className={styles.qrCodeImage}
                        />
                        <span>Show at pickup</span>
                      </div>
                    )}
                    <div className={styles.reservationActions}>
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
                <Button onClick={() => navigate("/")}>
                  Reserve Books
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <div className={styles.tabContent}>
            {wishlistItems.length > 0 ? (
              <div className={styles.wishlistGrid}>
                {wishlistItems.map((item) => {
                  const book = item.book || item;
                  const coverImage = book.coverImageUrl || book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop";
                  const authorName = book.authors?.map(a => a.name).join(", ") || book.author || "Unknown";
                  const genreName = book.genres?.[0]?.name || (typeof book.genre === 'object' ? book.genre?.name : book.genre) || "General";
                  
                  return (
                    <div key={item.id || book.id} className={styles.wishlistCard}>
                      <Link to={`/book/${book.id}`}>
                        <img src={coverImage} alt={book.title} />
                      </Link>
                      <div className={styles.wishlistInfo}>
                        <Link to={`/book/${book.id}`}>
                          <h3>{book.title}</h3>
                        </Link>
                        <p>{authorName}</p>
                        <span className={styles.genre}>{genreName}</span>
                      </div>
                      <div className={styles.wishlistActions}>
                        <Link to={`/book/${book.id}`} className={styles.viewBtn}>
                          View <ChevronRight size={16} />
                        </Link>
                        <button
                          className={styles.removeWishlist}
                          onClick={() => handleRemoveFromWishlist(book.id)}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Heart size={48} />
                <h3>Your Wishlist is Empty</h3>
                <p>Save books you want to read later!</p>
                <Button onClick={() => navigate("/")}>
                  Browse Books
                </Button>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className={styles.tabContent}>
            {reservationHistory.length > 0 ? (
              <div className={styles.historyList}>
                {reservationHistory.map((reservation) => (
                  <div key={reservation.id} className={styles.historyCard}>
                    <div className={styles.historyHeader}>
                      <span className={styles.reservationId}>
                        #{reservation.reservationNumber || reservation.id?.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[reservation.status]
                        }`}
                      >
                        {reservation.status === "picked_up" || reservation.status === "completed"
                          ? "Completed"
                          : reservation.status === "cancelled"
                          ? "Cancelled"
                          : reservation.status}
                      </span>
                    </div>
                    <p className={styles.historyDate}>
                      {formatDate(reservation.createdAt)}
                    </p>
                    <div className={styles.historyBooks}>
                      {(reservation.items || reservation.books || []).map((item) => {
                        const book = item.book || item;
                        return <span key={book.id || item.bookId}>{book.title}</span>;
                      })}
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
        onClose={() => setExtendModal({ isOpen: false, borrowing: null })}
        title="Extend Borrowing Period"
        size="small"
      >
        {extendModal.borrowing && (
          <div className={styles.extendModal}>
            <p>
              Extend your borrowing period for{" "}
              <strong>{extendModal.borrowing.book?.title}</strong> by{" "}
              {EXTENSION_DAYS} days?
            </p>
            <div className={styles.extendInfo}>
              <div>
                <span>Current Due Date:</span>
                <strong>{formatDate(extendModal.borrowing.dueDate)}</strong>
              </div>
              <div>
                <span>New Due Date:</span>
                <strong>
                  {formatDate(
                    new Date(
                      new Date(extendModal.borrowing.dueDate).getTime() +
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
                onClick={() => setExtendModal({ isOpen: false, borrowing: null })}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleExtend} loading={actionLoading}>
                Confirm Extension
              </Button>
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
              disabled={actionLoading}
            >
              Keep Reservation
            </Button>
            <Button 
              variant="danger" 
              onClick={handleCancelReservation}
              loading={actionLoading}
            >
              Cancel Reservation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
