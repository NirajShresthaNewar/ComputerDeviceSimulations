import { useRef } from 'react';
import styles from './ScanBed.module.css';

export default function ScanBed({ image, isScanning, scanProgress, onUpload }) {
  const fileInputRef = useRef(null);

  return (
    <div className={styles.wrap}>
      <div className={styles.bed}>
        {image ? (
          <img src={image} alt="Document to scan" className={styles.image} />
        ) : (
          <div className={styles.placeholder}>No document loaded</div>
        )}

        {/* the glass/lid edge framing, purely visual */}
        <div className={styles.bedFrame} />

        {/* scan bar sweeps top to bottom while isScanning */}
        {isScanning && (
          <div className={styles.scanBar} style={{ top: `${scanProgress}%` }}>
            <div className={styles.scanGlow} />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
        className={styles.hiddenInput}
      />
      <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
        {image ? 'Choose a different page' : 'Upload a page to scan'}
      </button>
    </div>
  );
}