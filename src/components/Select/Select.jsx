import { forwardRef } from "react";
import styles from "./Select.module.css";

const Select = forwardRef(
  (
    { label, error, options, fullWidth = false, className = "", ...props },
    ref
  ) => {
    const wrapperClasses = [
      styles.wrapper,
      fullWidth && styles.fullWidth,
      error && styles.hasError,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        {label && <label className={styles.label}>{label}</label>}
        <select ref={ref} className={styles.select} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
