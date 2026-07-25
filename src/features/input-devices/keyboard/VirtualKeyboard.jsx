import { keyboardLayout } from './keyboardData';
import styles from './VirtualKeyboard.module.css';

export default function VirtualKeyboard({ activeCode }) {
  return (
    <div className={styles.keyboard}>
      {keyboardLayout.map((row, i) => (
        <div className={styles.row} key={i}>
          {row.map((key) => (
            <div
              key={key.code}
              className={
                activeCode === key.code ? `${styles.key} ${styles.keyActive}` : styles.key
              }
              style={{ flexGrow: key.width || 1 }}
            >
              {key.label}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}