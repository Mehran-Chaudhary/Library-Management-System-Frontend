import styles from "./Button.module.css";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} />
      ) : (
        <>
          {Icon && (
            <Icon className={styles.icon} size={size === "small" ? 16 : 20} />
          )}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
