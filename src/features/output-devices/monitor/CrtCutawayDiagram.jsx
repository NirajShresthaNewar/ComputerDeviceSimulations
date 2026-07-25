import styles from './CrtCutawayDiagram.module.css';

export default function CrtCutawayDiagram({ beamPos, gridW, gridH, running }) {
  // map grid position to a vertical/horizontal deflection angle for the beam line
  const screenX = 320; // x position of the phosphor screen in this diagram
  const screenY = 40 + (beamPos.row / gridH) * 160; // beam vertical position on screen
  const gunX = 30;
  const gunY = 120;
  const coilX = 130;

  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 360 220" className={styles.svg}>
        {/* tube outline, narrow at the back, wide at the screen */}
        <path
          d="M20,100 L20,140 L120,150 L120,90 L20,100 Z M120,90 L120,150 L300,190 L300,50 L120,90 Z"
          className={styles.tubeBody}
        />

        {/* electron gun */}
        <rect x="22" y="110" width="30" height="20" className={styles.gun} />
        <text x="37" y="146" textAnchor="middle" className={styles.partLabel}>Electron gun</text>

        {/* deflection coils, around the tube neck */}
        <ellipse cx={coilX} cy="120" rx="10" ry="34" className={styles.coil} />
        <text x={coilX} y="170" textAnchor="middle" className={styles.partLabel}>Deflection coils</text>

        {/* phosphor screen, far right */}
        <rect x="296" y="48" width="8" height="142" className={styles.screen} />
        <text x="300" y="208" textAnchor="middle" className={styles.partLabel}>Phosphor screen</text>

        {/* electron beam, bending toward current scan row */}
        {running && (
          <>
            <line x1={gunX + 22} y1={gunY} x2={coilX} y2="120" className={styles.beam} />
            <line x1={coilX} y1="120" x2={screenX - 20} y2={screenY} className={styles.beam} />
            <circle cx={screenX - 20} cy={screenY} r="3.5" className={styles.beamDot} />
          </>
        )}
      </svg>
      <p className={styles.caption}>
        {running
          ? `Beam steering to row ${beamPos.row + 1} of ${gridH} — sweeping left to right, then dropping down one line.`
          : 'Press Start to fire the electron beam and watch it raster-scan the screen.'}
      </p>
    </div>
  );
}