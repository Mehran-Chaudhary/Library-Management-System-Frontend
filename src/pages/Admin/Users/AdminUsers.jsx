import { useState, useEffect, useCallback } from "react";
import { Search, Users, ChevronLeft, ChevronRight, Mail, Book } from "lucide-react";
import { LoadingSpinner } from "../../../components";
import { adminService } from "../../../services";
import { formatDate } from "../../../utils";
import styles from "./AdminUsers.module.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const response = await adminService.getUsers(params);
      
      if (Array.isArray(response)) {
        setUsers(response);
        setTotalPages(1);
        setTotalItems(response.length);
      } else {
        setUsers(response?.items || response?.data || []);
        setTotalPages(response?.totalPages || 1);
        setTotalItems(response?.total || response?.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const getRoleClass = (role) => {
    const classes = {
      ADMIN: styles.admin,
      LIBRARIAN: styles.librarian,
      MEMBER: styles.member,
    };
    return classes[role] || styles.member;
  };

  if (isLoading && users.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className={styles.usersPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <form onSubmit={handleSearch} className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <select
          className={styles.filterSelect}
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="LIBRARIAN">Librarian</option>
          <option value="MEMBER">Member</option>
        </select>
      </div>

      {/* Users Grid */}
      <div className={styles.usersGrid}>
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.userHeader}>
                <div className={styles.userAvatar}>
                  {user.firstName?.[0] || user.email?.[0] || "U"}
                </div>
                <span className={`${styles.roleBadge} ${getRoleClass(user.role)}`}>
                  {user.role || "MEMBER"}
                </span>
              </div>
              <div className={styles.userInfo}>
                <h4 className={styles.userName}>
                  {user.firstName} {user.lastName}
                </h4>
                <p className={styles.userEmail}>
                  <Mail size={14} />
                  {user.email}
                </p>
              </div>
              <div className={styles.userStats}>
                <div className={styles.stat}>
                  <Book size={14} />
                  <span>{user.borrowingCount || 0} borrowed</span>
                </div>
                <div className={styles.stat}>
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
              <div className={styles.userStatus}>
                <span className={`${styles.statusDot} ${user.isActive !== false ? styles.active : styles.inactive}`} />
                {user.isActive !== false ? "Active" : "Inactive"}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <Users size={48} />
            <h3>No Users Found</h3>
            <p>No users match your current search</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {users.length > 0 && (
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, totalItems)} of{" "}
            {totalItems} users
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
    </div>
  );
};

export default AdminUsers;
