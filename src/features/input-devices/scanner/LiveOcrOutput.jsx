import styles from './LiveOcrOutput.module.css';

// Same content as the book, in true reading order: left page top-to-bottom,
// then right page top-to-bottom — so the output mirrors what the beam passes over.
export const OCR_LINES = [
  'The scanner moves a light',
  'source beneath the page,',
  'capturing reflected light',
  'as the carriage travels',
  'from top to bottom across',
  'the entire document.',
  'Each line is read by a',
  'sensor strip, converting',
  'brightness into an',
  'electrical signal that the',
  'computer can store and',
  'later recognize as text.',
];

export default function LiveOcrOutput({ revealedCount, isScanning }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.dot} />
        <span className={styles.headerLabel}>Recognized text — live</span>
      </div>
      <div className={styles.screen}>
        {OCR_LINES.slice(0, revealedCount).map((line, i) => (
          <p key={i} className={styles.line}>
            {line}
          </p>
        ))}
        {isScanning && revealedCount < OCR_LINES.length && (
          <span className={styles.cursor} />
        )}
        {revealedCount === 0 && (
          <p className={styles.placeholder}>Waiting for scan to begin…</p>
        )}
      </div>
    </div>
  );
}