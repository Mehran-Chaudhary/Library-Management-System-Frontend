import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components';
import styles from './Unauthorized.module.css';

/**
 * Unauthorized Page
 * Displayed when a user tries to access a route they don't have permission for
 */
const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <ShieldAlert size={64} />
        </div>
        
        <h1 className={styles.title}>Access Denied</h1>
        
        <p className={styles.message}>
          You don't have permission to access this page.
        </p>
        
        <p className={styles.submessage}>
          If you believe this is an error, please contact an administrator.
        </p>
        
        <div className={styles.actions}>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft size={18} />}
          >
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            icon={<Home size={18} />}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
