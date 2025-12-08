import { Link } from "react-router-dom";
import {
  Book,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <Book size={28} />
              <span>BookNest</span>
            </Link>
            <p className={styles.description}>
              Your digital library companion. Browse, reserve, and manage your
              reading journey with ease.
            </p>
            <div className={styles.social}>
              <a href="#" aria-label="Twitter" className={styles.socialLink}>
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="GitHub" className={styles.socialLink}>
                <Github size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className={styles.socialLink}>
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className={styles.links}>
            <h4>Quick Links</h4>
            <Link to="/">Browse Books</Link>
            <Link to="/dashboard">My Dashboard</Link>
            <Link to="/cart">Reservation Cart</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className={styles.links}>
            <h4>Categories</h4>
            <Link to="/?genre=Fiction">Fiction</Link>
            <Link to="/?genre=Non-Fiction">Non-Fiction</Link>
            <Link to="/?genre=Science">Science</Link>
            <Link to="/?genre=Technology">Technology</Link>
          </div>

          <div className={styles.contact}>
            <h4>Contact Info</h4>
            <div className={styles.contactItem}>
              <MapPin size={18} />
              <span>123 Library Street, Book City, BC 12345</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={18} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className={styles.contactItem}>
              <Mail size={18} />
              <span>hello@booknest.com</span>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            &copy; {new Date().getFullYear()} BookNest. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
