import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  QrCode,
  Eye,
} from "lucide-react";
import { Button, Modal, LoadingSpinner } from "../../../components";
import { adminService } from "../../../services";
import { formatDate } from "../../../utils";
import styles from "./AdminReservations.module.css";

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "picked_up", label: "Picked Up" },
  { key: "cancelled", label: "Cancelled" },
  { key: "expired", label: "Expired" },
];

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;

      const response = await adminService.getReservations(params);
      
      if (Array.isArray(response)) {
        setReservations(response);
        setTotalPages(1);
        setTotalItems(response.length);
      } else {
        setReservations(response?.items || response?.data || []);
        setTotalPages(response?.totalPages || 1);
        setTotalItems(response?.total || response?.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setIsLoading(true);
    try {
      const reservation = await adminService.getReservationByNumber(search.trim());
      if (reservation) {
        setSelectedReservation(reservation);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error("Error finding reservation:", error);
      alert("Reservation not found");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkPickedUp = async (reservationId) => {
    setActionLoading(true);
    try {
      await adminService.markReservationPickedUp(reservationId);
      fetchReservations();
      setShowDetailModal(false);
    } catch (error) {
      console.error("Error marking pickup:", error);
      alert(error.message || "Failed to mark as picked up");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock size={14} />,
      confirmed: <CheckCircle size={14} />,
      picked_up: <CheckCircle size={14} />,
      cancelled: <XCircle size={14} />,
      expired: <XCircle size={14} />,
    };
    return icons[status] || <Clock size={14} />;
  };

  const getStatusClass = (status) => {
    const classes = {
      pending: styles.pending,
      confirmed: styles.confirmed,
      picked_up: styles.pickedUp,
      cancelled: styles.cancelled,
      expired: styles.expired,
    };
    return classes[status] || "";
  };

  if (isLoading && reservations.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading reservations..." />
      </div>
    );
  }

  return (
    <div className={styles.reservationsPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <form onSubmit={handleSearch} className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by reservation number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" size="small">
            Find
          </Button>
        </form>
        <Button icon={QrCode} onClick={() => setShowQrModal(true)} variant="secondary">
          Scan QR
        </Button>
      </div>

      {/* Status Tabs */}
      <div className={styles.statusTabs}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.statusTab} ${statusFilter === tab.key ? styles.active : ""}`}
            onClick={() => {
              setStatusFilter(tab.key);
              setPage(1);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reservations List */}
      <div className={styles.reservationsList}>
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <div key={reservation.id} className={styles.reservationCard}>
              <div className={styles.cardHeader}>
                <div className={styles.reservationInfo}>
                  <span className={styles.reservationNumber}>
                    #{reservation.reservationNumber || reservation.id?.slice(0, 8).toUpperCase()}
                  </span>
                  <span className={styles.reservationDate}>
                    {formatDate(reservation.createdAt)}
                  </span>
                </div>
                <span className={`${styles.statusBadge} ${getStatusClass(reservation.status)}`}>
                  {getStatusIcon(reservation.status)}
                  {reservation.status?.replace("_", " ")}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {reservation.user?.firstName?.[0] || "U"}
                  </div>
                  <div>
                    <div className={styles.userName}>
                      {reservation.user?.firstName} {reservation.user?.lastName}
                    </div>
                    <div className={styles.userEmail}>{reservation.user?.email}</div>
                  </div>
                </div>

                <div className={styles.booksInfo}>
                  <span className={styles.booksCount}>
                    {reservation.items?.length || 0} book(s)
                  </span>
                  <span className={styles.pickupDate}>
                    Pickup: {formatDate(reservation.pickupDate)}
                  </span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <Button
                  size="small"
                  variant="ghost"
                  icon={Eye}
                  onClick={() => {
                    setSelectedReservation(reservation);
                    setShowDetailModal(true);
                  }}
                >
                  View Details
                </Button>
                {(reservation.status === "pending" || reservation.status === "confirmed") && (
                  <Button
                    size="small"
                    onClick={() => handleMarkPickedUp(reservation.id)}
                    loading={actionLoading}
                  >
                    Mark Picked Up
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <Calendar size={48} />
            <h3>No Reservations Found</h3>
            <p>No reservations match your current filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {reservations.length > 0 && (
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, totalItems)} of{" "}
            {totalItems} reservations
          </span>
          <div className={styles.paginationControls}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className={styles.pageNumber}>{page} / {totalPages}</span>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedReservation(null);
        }}
        title="Reservation Details"
        size="medium"
      >
        {selectedReservation && (
          <div className={styles.detailModal}>
            <div className={styles.detailHeader}>
              <div>
                <h3>#{selectedReservation.reservationNumber || selectedReservation.id?.slice(0, 8)}</h3>
                <span className={`${styles.statusBadge} ${getStatusClass(selectedReservation.status)}`}>
                  {selectedReservation.status?.replace("_", " ")}
                </span>
              </div>
              {selectedReservation.qrCode && (
                <img
                  src={selectedReservation.qrCode}
                  alt="QR Code"
                  className={styles.qrCode}
                />
              )}
            </div>

            <div className={styles.detailSection}>
              <h4>Customer</h4>
              <p>
                {selectedReservation.user?.firstName} {selectedReservation.user?.lastName}
              </p>
              <p>{selectedReservation.user?.email}</p>
            </div>

            <div className={styles.detailSection}>
              <h4>Books</h4>
              <div className={styles.booksList}>
                {(selectedReservation.items || []).map((item) => (
                  <div key={item.id || item.bookId} className={styles.bookItem}>
                    <img
                      src={item.book?.coverImageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=60&h=90&fit=crop"}
                      alt={item.book?.title}
                    />
                    <div>
                      <span>{item.book?.title}</span>
                      <span>Due: {formatDate(item.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.detailSection}>
              <h4>Dates</h4>
              <p>Created: {formatDate(selectedReservation.createdAt)}</p>
              <p>Pickup: {formatDate(selectedReservation.pickupDate)}</p>
            </div>

            {(selectedReservation.status === "pending" || selectedReservation.status === "confirmed") && (
              <div className={styles.detailActions}>
                <Button
                  onClick={() => handleMarkPickedUp(selectedReservation.id)}
                  loading={actionLoading}
                >
                  Mark as Picked Up
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* QR Scanner Modal */}
      <Modal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title="Scan Reservation QR"
        size="small"
      >
        <div className={styles.qrScanner}>
          <QrCode size={64} />
          <p>QR scanner functionality would be implemented here</p>
          <p className={styles.hint}>
            Or enter reservation number manually in the search bar
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AdminReservations;
