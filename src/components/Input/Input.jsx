import { forwardRef } from "react";
import styles from "./Input.module.css";

const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      type = "text",
      fullWidth = false,
      className = "",
      ...props
    },
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
        <div className={styles.inputWrapper}>
          {Icon && <Icon className={styles.icon} size={20} />}
          <input ref={ref} type={type} className={styles.input} {...props} />
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
