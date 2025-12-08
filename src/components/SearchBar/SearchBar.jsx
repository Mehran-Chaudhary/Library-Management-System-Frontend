import { Search } from "lucide-react";
import styles from "./SearchBar.module.css";

const SearchBar = ({ value, onChange, placeholder = "Search books..." }) => {
  return (
    <div className={styles.searchBar}>
      <Search className={styles.icon} size={20} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
};

export default SearchBar;
