import { useEffect, useState } from 'react';
import styles from './ScannerMechanism.module.css';

const LEFT_PAGE_LINES = [
  'The scanner moves a light',
  'source beneath the page,',
  'capturing reflected light',
  'as the carriage travels',
  'from top to bottom across',
  'the entire document.',
];

const RIGHT_PAGE_LINES = [
  'Each line is read by a',
  'sensor strip, converting',
  'brightness into an',
  'electrical signal that the',
  'computer can store and',
  'later recognize as text.',
];

export default function ScannerMechanism({ isScanning, scanProgress, onToggle }) {
  const [sensorPulse, setSensorPulse] = useState(0);

  // bump a key whenever the carriage crosses a new "line" so sensor dots flash
  useEffect(() => {
    if (isScanning) setSensorPulse((p) => p + 1);
  }, [Math.floor(scanProgress / 8)]); // re-trigger roughly every 8% of travel

  const carriageY = 60 + (scanProgress / 100) * 170; // travel range within the bed

  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 360 320" className={styles.svg}>
        <defs>
          <linearGradient id="pageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4f4f0" />
            <stop offset="100%" stopColor="#e2e2dc" />
          </linearGradient>
        </defs>

        {/* scanner body / glass bed frame */}
        <rect x="20" y="40" width="320" height="200" rx="6" className={styles.bedFrame} />
        <rect x="26" y="46" width="308" height="188" rx="4" className={styles.glass} />

        {/* open book, slight angle, resting on the glass */}
        <g transform="translate(180, 130) rotate(-4)">
          {/* left page */}
          <path d="M-110,-70 L-6,-78 L-6,78 L-110,72 Z" className={styles.page} />
          {/* right page */}
          <path d="M6,-78 L112,-68 L108,74 L6,78 Z" className={styles.page} />
          {/* spine shadow */}
          <rect x="-7" y="-78" width="14" height="156" className={styles.spine} />

          {/* simple but real text on both pages */}
          <g className={styles.bookText}>
            {LEFT_PAGE_LINES.map((line, i) => (
              <text key={`l${i}`} x="-95" y={-50 + i * 20} className={styles.pageText}>
                {line}
              </text>
            ))}
            {RIGHT_PAGE_LINES.map((line, i) => (
              <text key={`r${i}`} x="20" y={-48 + i * 20} className={styles.pageText}>
                {line}
              </text>
            ))}
          </g>
        </g>

        {/* scan carriage assembly: light + mirror + lens + sensor, moves as one unit */}
        {isScanning && (
          <g transform={`translate(0, ${carriageY})`}>
            {/* light source bar */}
            <rect x="26" y="-3" width="308" height="6" rx="3" className={styles.lightBar} />

            {/* the reflected beam shooting up off the page into the mirror */}
            <line x1="180" y1="0" x2="180" y2="-30" className={styles.beam} />

            {/* angled mirror redirecting light sideways toward the lens */}
            <g transform="translate(180, -34)">
              <rect x="-16" y="-3" width="32" height="6" rx="2" className={styles.mirror} transform="rotate(35)" />
              <line x1="0" y1="0" x2="44" y2="-22" className={styles.beam} />
            </g>

            {/* lens focusing the beam down onto the sensor */}
            <g transform="translate(224, -56)">
              <ellipse cx="0" cy="0" rx="9" ry="14" className={styles.lens} />
              <line x1="0" y1="0" x2="0" y2="20" className={styles.beam} />
            </g>

            {/* CCD sensor strip */}
            <g transform="translate(224, -36)">
              <rect x="-26" y="0" width="52" height="8" rx="2" className={styles.sensorStrip} />
              {Array.from({ length: 9 }).map((_, i) => (
                <circle
                  key={`${sensorPulse}-${i}`}
                  cx={-22 + i * 5.5}
                  cy="4"
                  r="1.6"
                  className={styles.sensorDot}
                  style={{ animationDelay: `${i * 30}ms` }}
                />
              ))}
            </g>
          </g>
        )}
      </svg>

      <p className={styles.caption}>
        {isScanning
          ? 'The carriage sweeps the light source across the page. Reflected light bounces off a mirror, passes through a lens, and lands on the CCD sensor strip, which converts brightness into an electrical signal — one line at a time.'
          : 'A scanner reads a page using a moving light source, a mirror, a lens, and a sensor strip — all working together as one unit.'}
      </p>

      <button className={styles.toggleBtn} onClick={onToggle}>
        {isScanning ? 'Pause' : 'Start Scanning Animation'}
      </button>
    </div>
  );
}