import { useEffect, useState } from 'react';
import styles from './CpuFlowAnimation.module.css';

export default function CpuFlowAnimation({ lastEvent }) {
  const [pulseId, setPulseId] = useState(0);

  useEffect(() => {
    if (lastEvent) setPulseId((id) => id + 1);
  }, [lastEvent]);

  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 640 140" className={styles.svg}>
        {/* connecting line */}
        <line x1="80" y1="70" x2="560" y2="70" className={styles.track} />

        {/* traveling pulse, replayed via key= so it restarts every keypress */}
        {lastEvent && (
          <circle key={pulseId} r="6" className={styles.pulse}>
            <animateMotion
              dur="1.1s"
              repeatCount="1"
              path="M80,70 L240,70 L400,70 L560,70"
            />
          </circle>
        )}

        {/* stage nodes */}
        {[
          { x: 80, label: 'Key Press' },
          { x: 240, label: 'Keyboard Controller' },
          { x: 400, label: 'CPU' },
          { x: 560, label: 'Output' },
        ].map((stage, i) => (
          <g key={stage.label} className={lastEvent ? styles.stageActive : ''}>
            <circle cx={stage.x} cy="70" r="26" className={styles.node} />
            <text x={stage.x} y="75" textAnchor="middle" className={styles.nodeText}>
              {i + 1}
            </text>
            <text x={stage.x} y="118" textAnchor="middle" className={styles.label}>
              {stage.label}
            </text>
          </g>
        ))}
      </svg>
      <p className={styles.caption}>
        {lastEvent
          ? `Scan code 0x${lastEvent.scanCode?.toString(16).toUpperCase().padStart(2, '0') || '??'} traveled from the key to the controller, was translated by the CPU, and produced "${lastEvent.char || lastEvent.code}".`
          : 'Press a key to watch the signal travel through each stage.'}
      </p>
    </div>
  );
}