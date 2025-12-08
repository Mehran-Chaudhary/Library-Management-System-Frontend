import { Star } from "lucide-react";
import styles from "./Rating.module.css";

const Rating = ({ value, max = 5, size = "medium", showValue = true }) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
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
      {showValue && <span className={styles.value}>{value.toFixed(1)}</span>}
    </div>
  );
};

export default Rating;
