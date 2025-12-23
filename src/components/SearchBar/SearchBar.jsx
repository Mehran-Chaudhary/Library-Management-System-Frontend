import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./SearchBar.module.css";

const SearchBar = ({ value, onChange, placeholder = "Search books...", onSearch }) => {
  const [inputValue, setInputValue] = useState(value || "");

  // Sync with external value changes (only when value prop changes externally)
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(inputValue);
    } else if (onChange) {
      onChange(inputValue);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // Only update parent immediately if no onSearch prop (real-time search mode)
    if (!onSearch && onChange) {
      onChange(newValue);
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <Search className={styles.icon} size={20} />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={styles.input}
      />
      {onSearch && (
        <button type="submit" className={styles.searchBtn} aria-label="Search">
          <Search size={18} />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
