import { Star } from "lucide-react";
import styles from "./Rating.module.css";

const Rating = ({ value, max = 5, size = "medium", showValue = true }) => {
  // Convert value to number and handle invalid values
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const safeValue = Math.max(0, Math.min(max, numericValue)); // Clamp between 0 and max
  
  const fullStars = Math.floor(safeValue);
  const hasHalfStar = safeValue % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  const starSize = size === "small" ? 14 : size === "large" ? 24 : 18;

  return (
    <div className={styles.rating}>
      <div className={styles.stars}>
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={starSize}
            className={styles.starFilled}
            fill="currentColor"
          />
        ))}
        {hasHalfStar && (
          <div className={styles.halfStarWrapper}>
            <Star size={starSize} className={styles.starEmpty} />
            <div className={styles.halfStarOverlay}>
              <Star
                size={starSize}
                className={styles.starFilled}
                fill="currentColor"
              />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={starSize}
            className={styles.starEmpty}
          />
        ))}
      </div>
      {showValue && <span className={styles.value}>{safeValue.toFixed(1)}</span>}
    </div>
  );
};

export default Rating;
