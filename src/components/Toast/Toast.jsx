import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";
import styles from "./Toast.module.css";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const Toast = ({ message, type = "info", onClose }) => {
  const Icon = icons[type];

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert">
      <Icon className={styles.icon} size={20} />
      <span className={styles.message}>{message}</span>
      {onClose && (
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Dismiss"
        >
          <XCircle size={18} />
        </button>
      )}
    </div>
  );
};

export default Toast;
