import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  RotateCcw,
} from "lucide-react";
import { Button, Modal, LoadingSpinner } from "../../../components";
import { adminService } from "../../../services";
import { formatDate, isOverdue, calculateLateFine, LATE_FINE_PER_DAY } from "../../../utils";
import styles from "./AdminBorrowings.module.css";

const AdminBorrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal states
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showFineModal, setShowFineModal] = useState(false);
  const [selectedBorrowing, setSelectedBorrowing] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBorrowings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (showOverdueOnly) params.overdue = true;

      const response = await adminService.getBorrowings(params);
      
      if (Array.isArray(response)) {
        setBorrowings(response);
        setTotalPages(1);
        setTotalItems(response.length);
      } else {
        // Backend returns { borrowings: [...], total, page, totalPages }
        setBorrowings(response?.borrowings || response?.items || []);
        setTotalPages(response?.totalPages || 1);
        setTotalItems(response?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching borrowings:", error);
      setBorrowings([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, showOverdueOnly]);

  useEffect(() => {
    fetchBorrowings();
  }, [fetchBorrowings]);

  const handleReturnBook = async () => {
    if (!selectedBorrowing) return;
    setActionLoading(true);
    try {
      await adminService.returnBook(selectedBorrowing.id);
      setShowReturnModal(false);
      setSelectedBorrowing(null);
      fetchBorrowings();
    } catch (error) {
      console.error("Error returning book:", error);
      alert(error.message || "Failed to return book");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayFine = async () => {
    if (!selectedBorrowing) return;
    setActionLoading(true);
    try {
      await adminService.markFinePaid(selectedBorrowing.id);
      setShowFineModal(false);
      setSelectedBorrowing(null);
      fetchBorrowings();
    } catch (error) {
      console.error("Error paying fine:", error);
      alert(error.message || "Failed to mark fine as paid");
    } finally {
      setActionLoading(false);
    }
  };

  const openReturnModal = (borrowing) => {
    setSelectedBorrowing(borrowing);
    setShowReturnModal(true);
  };

  const openFineModal = (borrowing) => {
    setSelectedBorrowing(borrowing);
    setShowFineModal(true);
  };

  const getStatusClass = (borrowing) => {
    if (borrowing.status === "returned") return styles.returned;
    if (borrowing.isOverdue || isOverdue(borrowing.dueDate)) return styles.overdue;
    if (borrowing.status === "extended") return styles.extended;
    return styles.active;
  };

  const getStatusLabel = (borrowing) => {
    if (borrowing.status === "returned") return "Returned";
    if (borrowing.isOverdue || isOverdue(borrowing.dueDate)) return "Overdue";
    if (borrowing.status === "extended") return "Extended";
    return "Active";
  };

  const filteredBorrowings = borrowings.filter((b) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      b.book?.title?.toLowerCase().includes(searchLower) ||
      b.user?.email?.toLowerCase().includes(searchLower) ||
      b.user?.firstName?.toLowerCase().includes(searchLower) ||
      b.user?.lastName?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading && borrowings.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading borrowings..." />
      </div>
    );
  }

  return (
    <div className={styles.borrowingsPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by book or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="returned">Returned</option>
              <option value="extended">Extended</option>
            </select>
          </div>
        </div>
        <button
          className={`${styles.overdueToggle} ${showOverdueOnly ? styles.active : ""}`}
          onClick={() => {
            setShowOverdueOnly(!showOverdueOnly);
            setPage(1);
          }}
        >
          <AlertTriangle size={16} />
          Overdue Only
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {filteredBorrowings.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>User</th>
                  <th>Borrowed</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Fine</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBorrowings.map((borrowing) => {
                  const overdueStatus = borrowing.isOverdue || isOverdue(borrowing.dueDate);
                  const calculatedFine = calculateLateFine(borrowing.dueDate, LATE_FINE_PER_DAY);
                  const fineAmount = parseFloat(borrowing.fineAmount) || calculatedFine || 0;
                  
                  return (
                    <tr key={borrowing.id} className={overdueStatus ? styles.overdueRow : ""}>
                      <td>
                        <div className={styles.bookInfo}>
                          <img
                            src={borrowing.book?.coverImageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=60&h=90&fit=crop"}
                            alt={borrowing.book?.title}
                            className={styles.bookCover}
                          />
                          <span>{borrowing.book?.title || "Unknown"}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.userInfo}>
                          <span className={styles.userName}>
                            {borrowing.user?.firstName} {borrowing.user?.lastName}
                          </span>
                          <span className={styles.userEmail}>{borrowing.user?.email}</span>
                        </div>
                      </td>
                      <td>{formatDate(borrowing.borrowedDate)}</td>
                      <td>
                        <span className={overdueStatus ? styles.overdueDue : ""}>
                          {formatDate(borrowing.dueDate)}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${getStatusClass(borrowing)}`}>
                          {getStatusLabel(borrowing)}
                        </span>
                      </td>
                      <td>
                        {overdueStatus && borrowing.status !== "returned" ? (
                          <span className={styles.fineAmount}>
                            ${fineAmount.toFixed(2)}
                            {borrowing.finePaid && (
                              <span className={styles.paidBadge}>Paid</span>
                            )}
                          </span>
                        ) : (
                          <span className={styles.noFine}>-</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          {borrowing.status !== "returned" && (
                            <Button
                              size="small"
                              icon={RotateCcw}
                              onClick={() => openReturnModal(borrowing)}
                            >
                              Return
                            </Button>
                          )}
                          {overdueStatus && !borrowing.finePaid && borrowing.status !== "returned" && (
                            <Button
                              size="small"
                              variant="secondary"
                              icon={DollarSign}
                              onClick={() => openFineModal(borrowing)}
                            >
                              Pay Fine
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>
                Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, totalItems)} of{" "}
                {totalItems} borrowings
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
          </>
        ) : (
          <div className={styles.emptyState}>
            <Clock size={48} />
            <h3>No Borrowings Found</h3>
            <p>No borrowings match your current filters</p>
          </div>
        )}
      </div>

      {/* Return Confirmation Modal */}
      <Modal
        isOpen={showReturnModal}
        onClose={() => {
          setShowReturnModal(false);
          setSelectedBorrowing(null);
        }}
        title="Return Book"
        size="small"
      >
        {selectedBorrowing && (
          <div className={styles.confirmModal}>
            <CheckCircle size={48} className={styles.successIcon} />
            <h4>Confirm Book Return</h4>
            <p>
              Return &quot;{selectedBorrowing.book?.title}&quot; from{" "}
              {selectedBorrowing.user?.firstName} {selectedBorrowing.user?.lastName}?
            </p>
            {(selectedBorrowing.isOverdue || isOverdue(selectedBorrowing.dueDate)) && (
              <div className={styles.fineWarning}>
                <AlertTriangle size={16} />
                <span>
                  This book is overdue. A fine of ${(parseFloat(calculateLateFine(selectedBorrowing.dueDate, LATE_FINE_PER_DAY)) || 0).toFixed(2)} may apply.
                </span>
              </div>
            )}
            <div className={styles.modalActions}>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowReturnModal(false);
                  setSelectedBorrowing(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleReturnBook} loading={actionLoading}>
                Confirm Return
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Pay Fine Modal */}
      <Modal
        isOpen={showFineModal}
        onClose={() => {
          setShowFineModal(false);
          setSelectedBorrowing(null);
        }}
        title="Mark Fine as Paid"
        size="small"
      >
        {selectedBorrowing && (
          <div className={styles.confirmModal}>
            <DollarSign size={48} className={styles.fineIcon} />
            <h4>Confirm Fine Payment</h4>
            <p>
              Mark the fine for &quot;{selectedBorrowing.book?.title}&quot; as paid?
            </p>
            <div className={styles.fineDetails}>
              <span>Fine Amount:</span>
              <strong>
                ${(parseFloat(selectedBorrowing.fineAmount) || parseFloat(calculateLateFine(selectedBorrowing.dueDate, LATE_FINE_PER_DAY)) || 0).toFixed(2)}
              </strong>
            </div>
            <div className={styles.modalActions}>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowFineModal(false);
                  setSelectedBorrowing(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handlePayFine} loading={actionLoading}>
                Confirm Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminBorrowings;
