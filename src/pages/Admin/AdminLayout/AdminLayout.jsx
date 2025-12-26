import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Book,
  Calendar,
  Clock,
  Users,
  Tag,
  UserCircle,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Bell,
  Library,
} from "lucide-react";
import { useAuth } from "../../../context";
import { adminService } from "../../../services";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingMessages, setPendingMessages] = useState(0);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/") return "Dashboard";
    if (path.includes("/admin/books")) return "Books Management";
    if (path.includes("/admin/reservations")) return "Reservations";
    if (path.includes("/admin/borrowings")) return "Borrowings";
    if (path.includes("/admin/users")) return "Users";
    if (path.includes("/admin/genres")) return "Genres";
    if (path.includes("/admin/authors")) return "Authors";
    if (path.includes("/admin/messages")) return "Messages";
    return "Admin Panel";
  };

  // Fetch pending messages count
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await adminService.getPendingMessageCount();
        setPendingMessages(response?.count || 0);
      } catch (error) {
        console.error("Error fetching pending messages:", error);
      }
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    {
      section: "Overview",
      items: [
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
      ],
    },
    {
      section: "Management",
      items: [
        { path: "/admin/books", icon: Book, label: "Books" },
        { path: "/admin/reservations", icon: Calendar, label: "Reservations" },
        { path: "/admin/borrowings", icon: Clock, label: "Borrowings" },
        { path: "/admin/users", icon: Users, label: "Users" },
      ],
    },
    {
      section: "Catalog",
      items: [
        { path: "/admin/genres", icon: Tag, label: "Genres" },
        { path: "/admin/authors", icon: UserCircle, label: "Authors" },
      ],
    },
    {
      section: "Support",
      items: [
        { 
          path: "/admin/messages", 
          icon: MessageSquare, 
          label: "Messages",
          badge: pendingMessages > 0 ? pendingMessages : null
        },
      ],
    },
  ];

  const getUserInitials = () => {
    if (!user) return "AD";
    const first = user.firstName?.[0] || user.email?.[0] || "A";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  return (
    <div className={styles.adminLayout}>
      {/* Mobile overlay */}
      <div 
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <NavLink to="/admin" className={styles.logo} onClick={closeSidebar}>
            <div className={styles.logoIcon}>
              <Library size={22} />
            </div>
            <div className={styles.logoText}>
              BookNest
              <span>Admin Panel</span>
            </div>
          </NavLink>
          <button className={styles.closeBtn} onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((section) => (
            <div key={section.section} className={styles.navSection}>
              <div className={styles.navLabel}>{section.section}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                  onClick={closeSidebar}
                >
                  <item.icon size={20} />
                  {item.label}
                  {item.badge && (
                    <span className={styles.navBadge}>{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{getUserInitials()}</div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>
                {user?.firstName} {user?.lastName}
              </div>
              <div className={styles.userRole}>{user?.role || "Admin"}</div>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.mainWrapper}>
        <header className={styles.topHeader}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          <div className={styles.headerActions}>
            <button className={styles.headerBtn} title="Notifications">
              <Bell size={20} />
              {pendingMessages > 0 && (
                <span className={styles.headerBtnBadge}>{pendingMessages}</span>
              )}
            </button>
          </div>
        </header>

        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
