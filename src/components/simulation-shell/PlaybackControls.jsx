import styles from './PlaybackControls.module.css';

export default function PlaybackControls({
  isPlaying,
  onPlayPause,
  onReset,
  speed,
  onSpeedChange,
}) {
  return (
    <div className={styles.bar}>
      <button className={styles.btn} onClick={onPlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? '❙❙' : '▶'}
      </button>
      <button className={styles.btn} onClick={onReset} aria-label="Reset">
        ↺
      </button>
      <div className={styles.speedGroup}>
        <span className={styles.speedLabel}>Speed</span>
        {[0.5, 1, 2].map((s) => (
          <button
            key={s}
            className={speed === s ? `${styles.speedBtn} ${styles.speedActive}` : styles.speedBtn}
            onClick={() => onSpeedChange(s)}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}