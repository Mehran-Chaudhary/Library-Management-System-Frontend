import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Book,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Activity,
  DollarSign,
  Tag,
  MessageSquare,
  ChevronRight,
  Plus,
  Search,
  FileText,
  UserPlus,
} from "lucide-react";
import { LoadingSpinner, Button } from "../../../components";
import { adminService } from "../../../services";
import { formatDate } from "../../../utils";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    setError(null);

    try {
      const [statsData, activityData, inventoryData] = await Promise.all([
        adminService.getDashboardStats().catch(() => null),
        adminService.getRecentActivity(10).catch(() => []),
        adminService.getInventoryStats().catch(() => null),
      ]);

      setStats(statsData);
      setActivity(Array.isArray(activityData) ? activityData : []);
      setInventory(inventoryData);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchDashboardData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const getActivityIcon = (type) => {
    const icons = {
      reservation: Calendar,
      borrowing: Clock,
      return: Book,
      new_user: UserPlus,
      new_book: Plus,
    };
    return icons[type] || Activity;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} />
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <Button onClick={() => fetchDashboardData()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.books}`}>
              <Book size={24} />
            </div>
            {stats?.newBooksThisMonth > 0 && (
              <span className={`${styles.statTrend} ${styles.up}`}>
                <TrendingUp size={12} />
                +{stats.newBooksThisMonth}
              </span>
            )}
          </div>
          <div className={styles.statValue}>{stats?.totalBooks ?? 0}</div>
          <div className={styles.statLabel}>Total Books</div>
          <div className={styles.statSublabel}>
            {stats?.totalAvailableBooks ?? 0} available
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.users}`}>
              <Users size={24} />
            </div>
            {stats?.newUsersThisMonth > 0 && (
              <span className={`${styles.statTrend} ${styles.up}`}>
                <TrendingUp size={12} />
                +{stats.newUsersThisMonth}
              </span>
            )}
          </div>
          <div className={styles.statValue}>{stats?.totalUsers ?? 0}</div>
          <div className={styles.statLabel}>Total Users</div>
          <div className={styles.statSublabel}>
            {stats?.totalActiveUsers ?? 0} active
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.reservations}`}>
              <Calendar size={24} />
            </div>
          </div>
          <div className={styles.statValue}>
            {stats?.pendingReservations ?? 0}
          </div>
          <div className={styles.statLabel}>Pending Reservations</div>
          <div className={styles.statSublabel}>
            {stats?.todaysPickups ?? 0} pickups today
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.borrowings}`}>
              <Clock size={24} />
            </div>
          </div>
          <div className={styles.statValue}>{stats?.activeBorrowings ?? 0}</div>
          <div className={styles.statLabel}>Active Borrowings</div>
          <div className={styles.statSublabel}>
            {stats?.confirmedReservations ?? 0} confirmed
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.overdue}`}>
              <AlertTriangle size={24} />
            </div>
            {(stats?.overdueBorrowings ?? 0) > 0 && (
              <span className={`${styles.statTrend} ${styles.down}`}>
                <TrendingDown size={12} />
                Attention
              </span>
            )}
          </div>
          <div className={styles.statValue}>{stats?.overdueBorrowings ?? 0}</div>
          <div className={styles.statLabel}>Overdue Books</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.fines}`}>
              <DollarSign size={24} />
            </div>
          </div>
          <div className={styles.statValue}>
            ${(stats?.totalFinesPending ?? 0).toFixed(2)}
          </div>
          <div className={styles.statLabel}>Pending Fines</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.genres}`}>
              <Tag size={24} />
            </div>
          </div>
          <div className={styles.statValue}>{stats?.totalGenres ?? 0}</div>
          <div className={styles.statLabel}>Genres</div>
          <div className={styles.statSublabel}>
            {stats?.totalAuthors ?? 0} authors
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.messages}`}>
              <MessageSquare size={24} />
            </div>
            {(stats?.pendingMessages ?? 0) > 0 && (
              <span className={`${styles.statTrend} ${styles.down}`}>
                <TrendingDown size={12} />
                {stats.pendingMessages} new
              </span>
            )}
          </div>
          <div className={styles.statValue}>{stats?.pendingMessages ?? 0}</div>
          <div className={styles.statLabel}>Pending Messages</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Activity Feed */}
        <div className={styles.activitySection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <Activity size={18} />
              Recent Activity
            </h3>
            <button
              className={`${styles.refreshBtn} ${isRefreshing ? styles.spinning : ""}`}
              onClick={() => fetchDashboardData(true)}
              disabled={isRefreshing}
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
          <div className={styles.activityList}>
            {activity.length > 0 ? (
              activity.map((item) => {
                const IconComponent = getActivityIcon(item.type);
                return (
                  <div key={item.id} className={styles.activityItem}>
                    <div className={`${styles.activityIcon} ${styles[item.type]}`}>
                      <IconComponent size={18} />
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityDescription}>
                        {item.description}
                      </p>
                      <div className={styles.activityMeta}>
                        {item.userName && <span>{item.userName}</span>}
                        {item.bookTitle && <span>• {item.bookTitle}</span>}
                        <span>• {formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyActivity}>
                <Activity size={48} />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Alerts & Quick Actions */}
        <div className={styles.alertsSection}>
          {/* Low Stock Alert */}
          {inventory?.lowStockBooks?.length > 0 && (
            <div className={`${styles.alertCard} ${styles.warning}`}>
              <div className={styles.alertHeader}>
                <AlertTriangle size={18} />
                <h4 className={styles.alertTitle}>Low Stock Books</h4>
              </div>
              <p className={styles.alertContent}>
                {inventory.lowStockBooks.length} books have low availability
              </p>
              <div className={styles.alertList}>
                {inventory.lowStockBooks.slice(0, 3).map((book) => (
                  <div key={book.id} className={styles.alertItem}>
                    <span>{book.title}</span>
                    <span>{book.availableCopies} left</span>
                  </div>
                ))}
              </div>
              <Link to="/admin/books?status=low-stock" className={styles.alertLink}>
                View all <ChevronRight size={14} />
              </Link>
            </div>
          )}

          {/* Overdue Alert */}
          {(stats?.overdueBorrowings ?? 0) > 0 && (
            <div className={`${styles.alertCard} ${styles.danger}`}>
              <div className={styles.alertHeader}>
                <AlertCircle size={18} />
                <h4 className={styles.alertTitle}>Overdue Books</h4>
              </div>
              <p className={styles.alertContent}>
                {stats.overdueBorrowings} books are overdue and need attention
              </p>
              <Link to="/admin/borrowings?overdue=true" className={styles.alertLink}>
                View overdue <ChevronRight size={14} />
              </Link>
            </div>
          )}

          {/* Pending Messages */}
          {(stats?.pendingMessages ?? 0) > 0 && (
            <div className={`${styles.alertCard} ${styles.info}`}>
              <div className={styles.alertHeader}>
                <MessageSquare size={18} />
                <h4 className={styles.alertTitle}>Pending Messages</h4>
              </div>
              <p className={styles.alertContent}>
                {stats.pendingMessages} messages awaiting response
              </p>
              <Link to="/admin/messages" className={styles.alertLink}>
                View messages <ChevronRight size={14} />
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h4 className={styles.quickActionsTitle}>Quick Actions</h4>
            <div className={styles.quickActionsGrid}>
              <Link to="/admin/books" className={styles.quickActionBtn}>
                <Plus size={20} />
                <span>Add Book</span>
              </Link>
              <Link to="/admin/reservations" className={styles.quickActionBtn}>
                <Search size={20} />
                <span>Find Reservation</span>
              </Link>
              <Link to="/admin/borrowings" className={styles.quickActionBtn}>
                <FileText size={20} />
                <span>Process Return</span>
              </Link>
              <Link to="/admin/users" className={styles.quickActionBtn}>
                <Users size={20} />
                <span>View Users</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
