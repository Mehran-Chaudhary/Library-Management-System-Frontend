import { GENRES } from "../../utils";
import styles from "./CategoryFilter.module.css";

const CategoryFilter = ({ selected, onChange }) => {
  return (
    <div className={styles.filter}>
      {GENRES.map((genre) => (
        <button
          key={genre}
          className={`${styles.chip} ${
            selected === genre ? styles.active : ""
          }`}
          onClick={() => onChange(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
