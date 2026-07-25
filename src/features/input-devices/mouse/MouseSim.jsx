import { useState, useRef, useCallback, useEffect } from 'react';
import SimTabs from '../../../components/simulation-shell/SimTabs';
import ExplanationPanel from '../../../components/simulation-shell/ExplanationPanel';
import CpuInternalsDiagram from '../../../components/simulation-shell/CpuInternalsDiagram';
import MouseTrackingArea from './MouseTrackingArea';
import VirtualMouseModel from './VirtualMouseModel';
import DragDropExercise from './DragDropExercise';
import styles from './MouseSim.module.css';

export default function MouseSim() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [lastAction, setLastAction] = useState(null);
  const [signal, setSignal] = useState(null);
  const [leftDown, setLeftDown] = useState(false);
  const [rightDown, setRightDown] = useState(false);
  const [moving, setMoving] = useState(false);
  const [doubleClick, setDoubleClick] = useState(false);

  const lastClickTime = useRef(0);
  const moveTimeout = useRef(null);

  const handleMove = useCallback((x, y) => {
    setCoords({ x, y });
    setLastAction('move');
    setMoving(true);

    clearTimeout(moveTimeout.current);
    moveTimeout.current = setTimeout(() => setMoving(false), 180);

    setSignal({
      kind: 'Data',
      usesALU: false,
      usesStorage: false,
      detail: `Optical sensor reported position (${x}, ${y}). The Control Unit passed this coordinate data to Memory, which updated the cursor position sent to Output.`,
    });
  }, []);

  const handleButtonDown = useCallback((button, x, y) => {
    if (button === 'left') setLeftDown(true);
    if (button === 'right') setRightDown(true);

    const now = Date.now();
    const isDouble = button === 'left' && now - lastClickTime.current < 400;
    lastClickTime.current = now;

    if (isDouble) {
      setDoubleClick(true);
      setTimeout(() => setDoubleClick(false), 500);
    }

    const actionLabel = isDouble ? 'double-click' : `${button}-click`;
    setLastAction(actionLabel);

    setSignal({
      kind: 'Data',
      usesALU: true,
      usesStorage: false,
      detail: `A ${actionLabel.replace('-', ' ')} at (${x}, ${y}) was sent as data. The ALU compared the coordinates against on-screen elements (hit-testing) before the Control Unit triggered the matching action.`,
    });
  }, []);

  const handleButtonUp = useCallback((button) => {
    if (button === 'left') setLeftDown(false);
    if (button === 'right') setRightDown(false);
  }, []);

  useEffect(() => {
    return () => clearTimeout(moveTimeout.current);
  }, []);

  const simulateContent = (
    <div className={styles.simulateGrid}>
      <div className={styles.left}>
        <MouseTrackingArea
          coords={coords}
          lastAction={lastAction}
          onMove={handleMove}
          onButtonDown={handleButtonDown}
          onButtonUp={handleButtonUp}
        />
        <DragDropExercise />
      </div>
      <div className={styles.middle}>
        <VirtualMouseModel
          leftDown={leftDown}
          rightDown={rightDown}
          moving={moving}
          doubleClick={doubleClick}
        />
      </div>
      <div className={styles.right}>
        <div className={styles.readout}>
          <div className={styles.row}>
            <span className={styles.label}>Position</span>
            <span className={styles.value}>x: {coords.x}, y: {coords.y}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Last action</span>
            <span className={styles.value}>{lastAction || '—'}</span>
          </div>
        </div>
        <CpuInternalsDiagram signal={signal} />
      </div>
    </div>
  );

  const learnContent = (
    <ExplanationPanel
      description="A mouse is an input device that reports relative movement and button presses to the computer. Inside, an optical sensor takes thousands of tiny images of the surface beneath it every second and calculates how far and in what direction it moved between frames. That movement is sent as data — not an instruction — because the mouse itself doesn't decide what should happen; it just reports position and clicks. The CPU's Control Unit passes this through Memory to update the cursor, and the ALU gets involved during clicks to compare coordinates against on-screen elements (hit-testing) so the operating system knows what you clicked on."
      advantages={[
        'Precise, fast pointing and selection',
        'Intuitive — minimal learning curve for basic use',
        'Supports complex interactions (drag, scroll, multi-button)',
        'Works well alongside a keyboard for most desktop tasks',
      ]}
      disadvantages={[
        'Needs a flat surface (for optical/laser types)',
        'Less practical on touch-first or mobile devices',
        'Can contribute to wrist strain with prolonged use',
        'Precision drops on very high-friction or reflective surfaces',
      ]}
      uses={[
        'Navigating graphical user interfaces',
        'Precision work: design, photo editing, CAD',
        'Gaming, especially aim-based genres',
        'Drag-and-drop file management and form interaction',
      ]}
    />
  );

  const quizContent = (
    <p style={{ color: 'var(--color-text-muted)' }}>
      Quiz questions for this device are coming in Phase 6.
    </p>
  );

  return (
    <div>
      <h1>Mouse</h1>
      <p className={styles.subtitle}>
        Move and click inside the tracking area — watch the virtual mouse react in real time.
      </p>
      <SimTabs
        learnContent={learnContent}
        simulateContent={simulateContent}
        quizContent={quizContent}
      />
    </div>
  );
}