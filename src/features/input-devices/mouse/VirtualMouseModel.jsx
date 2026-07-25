import styles from './VirtualMouseModel.module.css';

export default function VirtualMouseModel({ leftDown, rightDown, moving, doubleClick }) {
  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 220 320" className={styles.svg}>
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-surface-raised)" />
            <stop offset="55%" stopColor="var(--color-surface)" />
            <stop offset="100%" stopColor="var(--color-bg)" />
          </linearGradient>
          <radialGradient id="sensorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* mouse body — rounded top-down silhouette with slight 3D shading */}
        <path
          d="M110,12
             C165,12 196,55 196,120
             C196,210 175,300 110,308
             C45,300 24,210 24,120
             C24,55 55,12 110,12 Z"
          fill="url(#bodyGrad)"
          stroke="var(--color-border)"
          strokeWidth="2"
          className={styles.body}
        />

        {/* center seam between left/right buttons */}
        <line x1="110" y1="14" x2="110" y2="150" className={styles.seam} />

        {/* left button (depresses on left click) */}
        <path
          d="M110,16 C70,16 30,45 26,118 L106,118 L110,118 Z"
          className={`${styles.button} ${leftDown ? styles.buttonDown : ''}`}
        />

        {/* right button */}
        <path
          d="M110,16 C150,16 190,45 194,118 L114,118 L110,118 Z"
          className={`${styles.button} ${rightDown ? styles.buttonDown : ''}`}
        />

        {/* scroll wheel */}
        <rect x="101" y="40" width="18" height="40" rx="8" className={styles.wheel} />

        {/* lower body / palm rest */}
        <path
          d="M26,120 L194,120 C193,210 172,298 110,306 C48,298 27,210 26,120 Z"
          fill="url(#bodyGrad)"
          className={styles.lowerBody}
        />

        {/* optical sensor window, visible through the bottom of the silhouette */}
        <g transform="translate(110, 260)">
          <circle r="22" fill="url(#sensorGlow)" className={moving ? styles.sensorActive : ''} />
          <rect x="-10" y="-7" width="20" height="14" rx="2" className={styles.sensorWindow} />
        </g>

        {/* double-click ripple */}
        {doubleClick && (
          <circle cx="110" cy="70" r="10" className={styles.ripple} />
        )}
      </svg>

      <div className={styles.statusRow}>
        <StatusPill label="L" active={leftDown} />
        <StatusPill label="R" active={rightDown} />
        <StatusPill label="Sensor" active={moving} wide />
      </div>
    </div>
  );
}

function StatusPill({ label, active, wide }) {
  return (
    <span className={`${styles.pill} ${active ? styles.pillActive : ''} ${wide ? styles.pillWide : ''}`}>
      {label}
    </span>
  );
}