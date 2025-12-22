import { Link, useLocation, useNavigate } from "react-router-dom";
import { Book, ShoppingCart, User, Moon, Sun, Menu, X, LogIn, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme, useUser, useAuth } from "../../context";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { cart } = useUser();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const navLinks = [
    { path: "/", label: "Home" },
    ...(isAuthenticated ? [{ path: "/dashboard", label: "Dashboard" }] : []),
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <Book className={styles.logoIcon} size={32} />
          <span className={styles.logoText}>BookNest</span>
        </Link>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`${styles.navLink} ${
                isActive(path) ? styles.active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          {isAuthenticated && (
            <Link to="/cart" className={styles.cartBtn} aria-label="View cart">
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className={styles.cartBadge}>{cart.length}</span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className={styles.userMenu} ref={dropdownRef}>
              <button
                className={styles.userBtn}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className={styles.avatar}>
                  {user?.firstName?.[0]?.toUpperCase() || "U"}
                </div>
                <span className={styles.userName}>{user?.firstName || "User"}</span>
                <ChevronDown size={16} className={isDropdownOpen ? styles.rotated : ""} />
              </button>
              
              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <span className={styles.dropdownName}>
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className={styles.dropdownEmail}>{user?.email}</span>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link
                    to="/dashboard"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User size={18} />
                    Dashboard
                  </Link>
                  <button
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.loginBtn}>
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className={styles.registerBtn}>
                Sign Up
              </Link>
            </div>
          )}

          <button
            className={styles.menuBtn}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
