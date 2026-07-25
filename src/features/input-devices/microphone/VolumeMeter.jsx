import styles from './VolumeMeter.module.css';

export default function VolumeMeter({ volume }) {
  const bars = 20;
  const litBars = Math.round(volume * bars);

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Volume</span>
      <div className={styles.bars}>
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={`${styles.bar} ${i < litBars ? styles.barLit : ''} ${
              i > bars * 0.8 ? styles.barHot : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}