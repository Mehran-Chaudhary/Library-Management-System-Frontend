import { GENRES } from "../../utils";
import styles from "./CategoryFilter.module.css";

const CategoryFilter = ({ selected, onChange, categories }) => {
  // Use provided categories or fall back to default GENRES
  const genreList = categories && categories.length > 0 ? categories : GENRES;
  
  return (
    <div className={styles.filter}>
      {genreList.map((genre) => (
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
