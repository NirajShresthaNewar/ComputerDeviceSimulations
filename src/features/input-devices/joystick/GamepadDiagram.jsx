import styles from './GamepadDiagram.module.css';

// Standard mapping indices (Xbox/PS-style controllers, per the W3C Gamepad standard)
const FACE_BUTTONS = [
  { index: 0, label: 'A', x: 235, y: 95 },
  { index: 1, label: 'B', x: 260, y: 70 },
  { index: 2, label: 'X', x: 210, y: 70 },
  { index: 3, label: 'Y', x: 235, y: 45 },
];

const SHOULDER_BUTTONS = [
  { index: 4, label: 'LB', x: 55, y: 15 },
  { index: 5, label: 'RB', x: 245, y: 15 },
];

export default function GamepadDiagram({ axes, buttons }) {
  const [lx, ly, rx, ry] = axes;

  // stick travel radius in SVG units
  const stickRadius = 16;

  return (
    <svg viewBox="0 0 300 160" className={styles.svg}>
      {/* body */}
      <path
        d="M40,40 C20,40 10,70 15,100 C20,125 40,130 60,120 L110,105 L190,105 L240,120 C260,130 280,125 285,100 C290,70 280,40 260,40 C240,40 230,55 220,55 L80,55 C70,55 60,40 40,40 Z"
        className={styles.body}
      />

      {/* left analog stick */}
      <g transform="translate(75, 90)">
        <circle r={stickRadius + 8} className={styles.stickWell} />
        <circle
          cx={lx * stickRadius}
          cy={ly * stickRadius}
          r={stickRadius}
          className={styles.stickNub}
        />
      </g>

      {/* right analog stick */}
      <g transform="translate(175, 95)">
        <circle r={stickRadius + 8} className={styles.stickWell} />
        <circle
          cx={rx * stickRadius}
          cy={ry * stickRadius}
          r={stickRadius}
          className={styles.stickNub}
        />
      </g>

      {/* face buttons */}
      {FACE_BUTTONS.map((btn) => (
        <g key={btn.label}>
          <circle
            cx={btn.x}
            cy={btn.y}
            r="10"
            className={buttons[btn.index]?.pressed ? `${styles.faceBtn} ${styles.faceBtnActive}` : styles.faceBtn}
          />
          <text x={btn.x} y={btn.y + 3} textAnchor="middle" className={styles.faceBtnLabel}>
            {btn.label}
          </text>
        </g>
      ))}

      {/* shoulder buttons */}
      {SHOULDER_BUTTONS.map((btn) => (
        <rect
          key={btn.label}
          x={btn.x - 18}
          y={btn.y}
          width="36"
          height="10"
          rx="3"
          className={buttons[btn.index]?.pressed ? `${styles.shoulderBtn} ${styles.shoulderBtnActive}` : styles.shoulderBtn}
        />
      ))}

      {/* d-pad, simplified as 4 wedges */}
      <g transform="translate(150, 95)">
        <circle r="14" className={styles.dpadBase} />
        <text textAnchor="middle" y="4" className={styles.dpadLabel}>+</text>
      </g>
    </svg>
  );
}