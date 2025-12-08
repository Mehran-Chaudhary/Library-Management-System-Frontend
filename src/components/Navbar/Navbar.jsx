import { Link, useLocation } from "react-router-dom";
import { Book, ShoppingCart, User, Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme, useUser } from "../../context";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { cart } = useUser();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
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

          <Link to="/cart" className={styles.cartBtn} aria-label="View cart">
            <ShoppingCart size={22} />
            {cart.length > 0 && (
              <span className={styles.cartBadge}>{cart.length}</span>
            )}
          </Link>

          <Link
            to="/dashboard"
            className={styles.iconBtn}
            aria-label="Dashboard"
          >
            <User size={22} />
          </Link>

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
