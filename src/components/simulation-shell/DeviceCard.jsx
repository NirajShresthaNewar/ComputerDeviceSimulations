import { Link } from 'react-router-dom';
import styles from './DeviceCard.module.css';

export default function DeviceCard({ device }) {
  const isReady = device.status === 'done';

  return (
    <Link
      to={isReady ? device.route : '#'}
      className={`${styles.card} ${!isReady ? styles.cardDisabled : ''}`}
      onClick={(e) => !isReady && e.preventDefault()}
    >
      <div className={styles.cardTop}>
        <span className={styles.category}>{device.category}</span>
        <span className={`${styles.status} ${styles[`status-${device.status}`]}`}>
          {device.status === 'done' ? 'Ready' : device.status === 'in-progress' ? 'In progress' : 'Planned'}
        </span>
      </div>
      <h3 className={styles.name}>{device.name}</h3>
      <p className={styles.description}>{device.description}</p>
      <span className={styles.trace} aria-hidden="true" />
    </Link>
  );
}