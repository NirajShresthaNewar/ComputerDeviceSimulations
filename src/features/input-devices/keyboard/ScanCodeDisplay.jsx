import styles from './ScanCodeDisplay.module.css';

export default function ScanCodeDisplay({ lastEvent }) {
  if (!lastEvent) {
    return (
      <div className={styles.wrap}>
        <p className={styles.placeholder}>Press any key to see its scan code and ASCII value.</p>
      </div>
    );
  }

  const { scanCode, ascii, char, code } = lastEvent;

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <span className={styles.label}>Key code</span>
        <span className={styles.value}>{code}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Scan code (hex)</span>
        <span className={styles.value}>
          {scanCode != null ? `0x${scanCode.toString(16).toUpperCase().padStart(2, '0')}` : '—'}
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>ASCII code</span>
        <span className={styles.value}>{ascii != null ? ascii : '—'}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Character</span>
        <span className={styles.valueChar}>{char || '—'}</span>
      </div>
    </div>
  );
}