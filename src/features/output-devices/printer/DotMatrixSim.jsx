import { useState, useRef, useEffect } from 'react';
import styles from './DotMatrixSim.module.css';

// Standard 5x7 font definition for Dot Matrix simulation
const FONT_7X5 = {
  'A': [0x7E, 0x11, 0x11, 0x11, 0x7E],
  'B': [0x7F, 0x49, 0x49, 0x49, 0x36],
  'C': [0x3E, 0x41, 0x41, 0x41, 0x22],
  'D': [0x7F, 0x41, 0x41, 0x22, 0x1C],
  'E': [0x7F, 0x49, 0x49, 0x49, 0x41],
  'F': [0x7F, 0x09, 0x09, 0x09, 0x01],
  'G': [0x3E, 0x41, 0x49, 0x49, 0x7A],
  'H': [0x7F, 0x08, 0x08, 0x08, 0x7F],
  'I': [0x41, 0x41, 0x7F, 0x41, 0x41],
  'J': [0x20, 0x40, 0x41, 0x3F, 0x01],
  'K': [0x7F, 0x08, 0x14, 0x22, 0x41],
  'L': [0x7F, 0x40, 0x40, 0x40, 0x40],
  'M': [0x7F, 0x02, 0x0C, 0x02, 0x7F],
  'N': [0x7F, 0x04, 0x08, 0x10, 0x7F],
  'O': [0x3E, 0x41, 0x41, 0x41, 0x3E],
  'P': [0x7F, 0x09, 0x09, 0x09, 0x06],
  'Q': [0x3E, 0x41, 0x51, 0x21, 0x5E],
  'R': [0x7F, 0x09, 0x19, 0x29, 0x46],
  'S': [0x46, 0x49, 0x49, 0x49, 0x31],
  'T': [0x01, 0x01, 0x7F, 0x01, 0x01],
  'U': [0x3F, 0x40, 0x40, 0x40, 0x3F],
  'V': [0x1F, 0x20, 0x40, 0x20, 0x1F],
  'W': [0x7F, 0x20, 0x18, 0x20, 0x7F],
  'X': [0x63, 0x14, 0x08, 0x14, 0x63],
  'Y': [0x07, 0x08, 0x70, 0x08, 0x07],
  'Z': [0x61, 0x51, 0x49, 0x45, 0x43],
  ' ': [0x00, 0x00, 0x00, 0x00, 0x00],
  '0': [0x3e, 0x51, 0x49, 0x45, 0x3e],
  '1': [0x00, 0x42, 0x7f, 0x40, 0x00],
  '2': [0x42, 0x61, 0x51, 0x49, 0x46],
  '3': [0x21, 0x41, 0x45, 0x4b, 0x31],
  '4': [0x18, 0x14, 0x12, 0x7f, 0x10],
  '5': [0x27, 0x45, 0x45, 0x45, 0x39],
  '6': [0x3c, 0x4a, 0x49, 0x49, 0x30],
  '7': [0x01, 0x71, 0x09, 0x05, 0x03],
  '8': [0x36, 0x49, 0x49, 0x49, 0x36],
  '9': [0x06, 0x49, 0x49, 0x29, 0x1e],
  '!': [0x00, 0x00, 0x5F, 0x00, 0x00],
  '?': [0x02, 0x01, 0x51, 0x09, 0x06],
  '-': [0x08, 0x08, 0x08, 0x08, 0x08],
  '.': [0x00, 0x40, 0x00, 0x00, 0x00],
};

const STEP_SPEED = 3; // frames per dot column sweep step

export default function DotMatrixSim() {
  const [inputText, setInputText] = useState('DOT MATRIX');
  const [printing, setPrinting] = useState(false);
  const [printedDots, setPrintedDots] = useState([]);
  const [activeCharIdx, setActiveCharIdx] = useState(-1);
  const canvasRef = useRef(null);

  // Keep anim states synchronized in refs
  const animState = useRef({
    carriageX: 40,
    activePins: 0x00,
    pinsOffset: new Array(9).fill(0), // solenoid projection animation
    activeDots: [],
    columnQueue: [],
    queueIdx: 0,
    frameCounter: 0,
  });

  const handlePrint = () => {
    if (printing) return;
    setPrinting(true);
    setPrintedDots([]);

    // Build the dot column print queue
    const columns = [];
    const textChars = inputText.toUpperCase().split('');
    
    textChars.forEach((char, charIdx) => {
      const matrix = FONT_7X5[char] || FONT_7X5[' '];
      
      // A character consists of 5 columns of dots
      matrix.forEach((colByte) => {
        columns.push({
          byte: colByte,
          charIdx,
        });
      });
      // Plus 1 column gap between characters
      columns.push({
        byte: 0x00,
        charIdx,
      });
    });

    animState.current = {
      carriageX: 40,
      activePins: 0x00,
      pinsOffset: new Array(9).fill(0),
      activeDots: [],
      columnQueue: columns,
      queueIdx: 0,
      frameCounter: 0,
    };
    setActiveCharIdx(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const state = animState.current;

      // 1. Update Printing Logic
      if (printing && state.columnQueue.length > 0) {
        state.frameCounter++;
        
        // Wait according to printing speed
        if (state.frameCounter >= STEP_SPEED) {
          state.frameCounter = 0;
          
          const colData = state.columnQueue[state.queueIdx];
          state.activePins = colData.byte;
          setActiveCharIdx(colData.charIdx);

          // Update pin stroke offsets (shoot forward when active)
          for (let p = 0; p < 9; p++) {
            const isActive = (colData.byte & (1 << p)) !== 0;
            state.pinsOffset[p] = isActive ? 8 : 0;
          }

          // If pins are firing, record ink dots on the paper
          if (colData.byte > 0) {
            for (let p = 0; p < 7; p++) {
              if ((colData.byte & (1 << p)) !== 0) {
                // Pin Y coordinate (scale dots to fit paper)
                const dotY = 50 + p * 3.5;
                state.activeDots.push({
                  x: state.carriageX,
                  y: dotY
                });
              }
            }
            // Trigger local React re-render of dots list
            setPrintedDots([...state.activeDots]);
          }

          // Advance print head carriage
          state.carriageX += 3.2;

          // Shift queue index
          if (state.queueIdx < state.columnQueue.length - 1) {
            state.queueIdx++;
          } else {
            setPrinting(false);
            setActiveCharIdx(-1);
          }
        }
      } else {
        // Solenoids return to rest
        for (let p = 0; p < 9; p++) {
          state.pinsOffset[p] = Math.max(0, state.pinsOffset[p] - 1);
        }
        state.activePins = 0x00;
      }

      // 2. Rendering
      // Chassis background
      ctx.fillStyle = '#111219';
      ctx.fillRect(0, 0, w, h);

      // Continuous feed computer paper (tractor feed paper)
      ctx.fillStyle = '#f7fafc';
      ctx.fillRect(20, 20, w - 40, 110);
      
      // Tractor feed perforation holes along top and bottom edges
      ctx.fillStyle = '#0f172a';
      for (let px = 30; px < w - 20; px += 18) {
        ctx.beginPath();
        ctx.arc(px, 28, 3, 0, 2 * Math.PI);
        ctx.arc(px, 122, 3, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Draw horizontal green bar stripes (vintage tractor-feed look)
      ctx.fillStyle = 'rgba(72, 187, 120, 0.06)';
      ctx.fillRect(20, 35, w - 40, 20);
      ctx.fillRect(20, 75, w - 40, 20);
      ctx.fillRect(20, 115, w - 40, 15);

      // Draw all printed dots on paper
      ctx.fillStyle = '#1e293b'; // Charcoal ink
      printedDots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.4, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Draw Ink Ribbon (dark horizontal band)
      ctx.fillStyle = 'rgba(20, 20, 30, 0.85)';
      ctx.fillRect(20, 42, w - 40, 30);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 42, w - 40, 30);

      // Draw Print Head Carriage
      const hx = state.carriageX;
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(hx - 12, 35, 24, 44);
      ctx.strokeStyle = '#a0aec0';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(hx - 12, 35, 24, 44);

      // Microscopic Zoom Panel (Rendered on bottom left of canvas)
      const zx = 280;
      const zy = 175;
      const zw = 180;
      const zh = 130;

      // Zoom bubble background
      ctx.fillStyle = '#0f1016';
      ctx.fillRect(zx, zy, zw, zh);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(zx, zy, zw, zh);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('PIN ACTUATORS (CLOSE-UP)', zx + 10, zy + 15);

      // Draw 9 Solenoids inside the Zoom Panel
      // When a pin fires, it pushes forward and glows
      for (let p = 0; p < 9; p++) {
        const py = zy + 25 + p * 10;
        const isActive = (state.activePins & (1 << p)) !== 0;
        const offset = state.pinsOffset[p];

        // Solenoid casing
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(zx + 15, py - 3, 25, 7);

        // Copper coil wrap
        ctx.fillStyle = '#b7791f';
        ctx.fillRect(zx + 20, py - 3, 15, 7);

        // Pin rod (moves to the right when striking)
        ctx.fillStyle = isActive ? '#48bb78' : '#718096';
        ctx.fillRect(zx + 40 + offset, py - 1.5, 40, 3);
        
        // Ribbon collision point
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(zx + 130, zy + 20, 10, zh - 30);

        // Glow indicator
        if (isActive) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#48bb78';
          ctx.fillStyle = '#48bb78';
          ctx.beginPath();
          ctx.arc(zx + 100, py, 3, 0, 2 * Math.PI);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        } else {
          ctx.fillStyle = '#4a5568';
          ctx.beginPath();
          ctx.arc(zx + 100, py, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // Draw label showing pin count
      ctx.fillStyle = '#718096';
      ctx.font = '8px sans-serif';
      ctx.fillText('9 Pins Column', zx + 100, zy + 15);

      // Schematic lines connecting actual print head to zoom panel
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hx, 79);
      ctx.lineTo(zx, zy);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [printing, printedDots]);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div>
          <h2 className={styles.panelTitle}>Dot Matrix Printer</h2>
          <p className={styles.subTitle}>
            Observe how electromagnets shoot individual pins forward in rapid sequences, printing characters dot-by-dot.
          </p>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Text to Print</label>
          <input
            type="text"
            maxLength="20"
            className={styles.input}
            value={inputText}
            onChange={(e) => setInputText(e.target.value.toUpperCase())}
            disabled={printing}
          />
        </div>

        <button className={styles.btn} onClick={handlePrint} disabled={printing || !inputText.trim()}>
          {printing ? 'Printing Matrix...' : 'Execute Print'}
        </button>

        {printing && (
          <div className={styles.controlGroup}>
            <span className={styles.statusText}>Print Queue:</span>
            <div className={styles.queueProgress}>
              {inputText.split('').map((char, i) => {
                let cls = styles.charPending;
                if (i < activeCharIdx) cls = styles.charPrinted;
                if (i === activeCharIdx) cls = styles.charActive;
                return (
                  <span key={i} className={cls}>
                    {char === ' ' ? '␣' : char}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className={styles.right}>
        <canvas ref={canvasRef} width={480} height={320} className={styles.canvas} />
        <div className={styles.instruction}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Watch the Close-Up actuators view to see which of the 9 vertical solenoids push forward at each step.
        </div>
      </div>
    </div>
  );
}
