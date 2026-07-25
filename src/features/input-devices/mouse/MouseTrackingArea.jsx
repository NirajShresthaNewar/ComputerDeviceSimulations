import styles from './MouseTrackingArea.module.css';

export default function MouseTrackingArea({ coords, lastAction, onMove, onButtonDown, onButtonUp }) {
  const getXY = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    };
  };

  const handleMouseMove = (e) => {
    const { x, y } = getXY(e);
    onMove(x, y);
  };

  const handleMouseDown = (e) => {
    const { x, y } = getXY(e);
    onButtonDown(e.button === 2 ? 'right' : 'left', x, y);
  };

  const handleMouseUp = (e) => {
    onButtonUp(e.button === 2 ? 'right' : 'left');
  };

  return (
    <div
      className={styles.area}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className={styles.cursorDot} style={{ left: coords.x, top: coords.y }} />
      <span className={styles.hint}>
        Move here — left-click, right-click, or double-click to test each action.
      </span>
      {lastAction && <span className={styles.actionBadge}>{lastAction.replace('-', ' ')}</span>}
    </div>
  );
}