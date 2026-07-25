import styles from './SoundWaveTravel.module.css';

export default function SoundWaveTravel({ volume, isActive }) {
  // Generate 3 rings with staggered animation delays; their visibility/speed
  // reacts to volume via inline style overrides on opacity/duration.
  const ringCount = 3;
  const intensity = Math.max(0.15, volume); // floor so silence still shows a faint hint

  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 480 160" className={styles.svg}>
        {/* person figure, fixed left */}
        <g transform="translate(60, 80)">
          <circle cx="0" cy="-28" r="14" className={styles.personHead} />
          <path d="M-18,30 C-18,2 -10,-6 0,-6 C10,-6 18,2 18,30 Z" className={styles.personBody} />
        </g>
        <text x="60" y="140" textAnchor="middle" className={styles.caption}>Sound source</text>

        {/* traveling rings, only rendered while active */}
        {isActive &&
          Array.from({ length: ringCount }).map((_, i) => (
            <circle
              key={i}
              cx="60"
              cy="74"
              r="20"
              className={styles.ring}
              style={{
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${1.8 - intensity * 0.8}s`,
                opacity: intensity,
              }}
            />
          ))}

        {/* microphone, fixed right */}
        <g transform="translate(400, 74)">
          <rect x="-14" y="-40" width="28" height="56" rx="14" className={styles.micBody} />
          <line x1="0" y1="16" x2="0" y2="36" className={styles.micStand} />
          <line x1="-16" y1="36" x2="16" y2="36" className={styles.micStand} />
          {isActive && (
            <circle
              r="22"
              className={styles.micGlow}
              style={{ opacity: intensity }}
            />
          )}
        </g>
        <text x="400" y="140" textAnchor="middle" className={styles.caption}>Microphone</text>
      </svg>
    </div>
  );
}