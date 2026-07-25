import styles from './MonitorOutput.module.css';

export default function MonitorOutput({ powered, mode, onModeChange, image, extractedText }) {
  return (
    <div className={styles.wrap}>
      <div className={`${styles.screen} ${powered ? styles.screenOn : ''}`}>
        {!powered && <span className={styles.standby}>Standby — waiting for scan</span>}
        {powered && mode === 'image' && image && (
          <img src={image} alt="Original scanned page" className={styles.screenImage} />
        )}
        {powered && mode === 'text' && (
          <pre className={styles.screenText}>{extractedText}</pre>
        )}
      </div>

      {powered && (
        <div className={styles.toggle}>
          <button
            className={mode === 'image' ? `${styles.toggleBtn} ${styles.toggleActive}` : styles.toggleBtn}
            onClick={() => onModeChange('image')}
          >
            Original
          </button>
          <button
            className={mode === 'text' ? `${styles.toggleBtn} ${styles.toggleActive}` : styles.toggleBtn}
            onClick={() => onModeChange('text')}
          >
            OCR Text
          </button>
        </div>
      )}
    </div>
  );
}