import { useState, useRef, useEffect } from 'react';
import styles from './DaisyWheelSim.module.css';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?-. ';
const NUM_PETALS = ALPHABET.length;
const CHAR_WIDTH = 12;

export default function DaisyWheelSim() {
  const [inputText, setInputText] = useState('HELLO WORLD');
  const [printing, setPrinting] = useState(false);
  const [printedText, setPrintedText] = useState([]);
  const [activeCharIdx, setActiveCharIdx] = useState(-1);
  const canvasRef = useRef(null);

  // Animation values using refs to keep canvas updates synchronous in RAF
  const animState = useRef({
    currentAngle: 0,
    targetAngle: 0,
    hammerOffset: 0, // 0 to 10px forward
    hammerPhase: 'idle', // 'idle' | 'forward' | 'strike' | 'retract'
    ribbonFlash: 0,
    carriageX: 50,
    targetCarriageX: 50,
    printQueue: [],
    queueIdx: -1,
  });

  const handlePrint = () => {
    if (printing) return;
    setPrinting(true);
    setPrintedText([]);
    
    // Prepare character queue
    const queue = inputText.toUpperCase().split('').map((char) => {
      const idx = ALPHABET.indexOf(char);
      return { char, alphabetIdx: idx >= 0 ? idx : ALPHABET.indexOf(' ') };
    });

    animState.current = {
      currentAngle: animState.current.currentAngle,
      targetAngle: animState.current.currentAngle,
      hammerOffset: 0,
      hammerPhase: 'idle',
      ribbonFlash: 0,
      carriageX: 50,
      targetCarriageX: 50,
      printQueue: queue,
      queueIdx: 0,
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

      // 1. Core Electromechanical Logic
      if (printing && state.printQueue.length > 0) {
        const item = state.printQueue[state.queueIdx];
        
        // Target angle matches the petal at 12 o'clock position (top: -Math.PI / 2)
        // Since angle increases clockwise, the angle offset for character at index 'idx' is:
        // angle = - (idx * 2 * Math.PI / NUM_PETALS)
        const target = -((item.alphabetIdx * 2 * Math.PI) / NUM_PETALS);
        state.targetAngle = target;

        // Animate Wheel Rotation
        let diff = state.targetAngle - state.currentAngle;
        // Normalize diff to -PI to PI for shortest-path rotation
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        
        if (Math.abs(diff) > 0.01) {
          // Rotate slower towards target character (0.05 instead of 0.15)
          state.currentAngle += diff * 0.05;
          state.hammerPhase = 'idle';
        } else {
          // Locked in position: trigger hammer sequence
          state.currentAngle = state.targetAngle;

          if (state.hammerPhase === 'idle') {
            state.hammerPhase = 'forward';
          }

          if (state.hammerPhase === 'forward') {
            // Slower hammer strike (0.6 instead of 2.0)
            state.hammerOffset += 0.6;
            if (state.hammerOffset >= 12) {
              state.hammerOffset = 12;
              state.hammerPhase = 'strike';
            }
          } 
          else if (state.hammerPhase === 'strike') {
            // Append character to paper slightly above the ribbon (y = 70) so it's fully visible
            setPrintedText((prev) => [
              ...prev,
              { char: item.char, x: state.carriageX, y: 70 },
            ]);
            state.targetCarriageX = state.carriageX + CHAR_WIDTH;
            state.ribbonFlash = 1.0;
            state.hammerPhase = 'retract';
          } 
          else if (state.hammerPhase === 'retract') {
            // Slower hammer retraction
            state.hammerOffset -= 0.6;
            if (state.hammerOffset <= 0) {
              state.hammerOffset = 0;
              state.hammerPhase = 'idle';
              
              // Move carriage forward
              state.carriageX = state.targetCarriageX;

              // Check if queue completed
              if (state.queueIdx < state.printQueue.length - 1) {
                state.queueIdx += 1;
                setActiveCharIdx(state.queueIdx);
              } else {
                setPrinting(false);
                setActiveCharIdx(-1);
              }
            }
          }
        }
      }

      // Decay Ribbon Flash Glow
      if (state.ribbonFlash > 0) {
        state.ribbonFlash -= 0.05; // Slower fade for visual clarity
      }

      // 2. Rendering Code
      // Background / Chasis
      ctx.fillStyle = '#111219';
      ctx.fillRect(0, 0, w, h);

      // Draw Paper Roll in background
      ctx.fillStyle = '#fff9e6'; // Cream vintage paper
      ctx.fillRect(20, 20, w - 40, 110);
      
      // Paper grid lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 30; x < w - 30; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, 130);
        ctx.stroke();
      }

      // Draw printed text on paper (drawn above ribbon for visibility)
      ctx.fillStyle = '#1a1a24';
      ctx.font = 'bold 13px monospace';
      printedText.forEach((t) => {
        ctx.fillText(t.char, t.x, t.y);
      });

      // Draw Ink Ribbon (Horizontal strip in front of paper, centered on y = 88)
      ctx.fillStyle = '#22222a';
      ctx.fillRect(20, 84, w - 40, 8);
      // Ribbon ink highlight active impact point
      if (state.ribbonFlash > 0) {
        const glowGrad = ctx.createRadialGradient(
          state.carriageX, 88, 2,
          state.carriageX, 88, 20
        );
        glowGrad.addColorStop(0, `rgba(180, 50, 255, ${state.ribbonFlash})`);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(state.carriageX - 30, 81, 60, 14);
      }

      // Draw Print Carriage assembly containing the Daisy Wheel & Hammer
      const cx = state.carriageX;
      
      // We align the wheel center so that the 12 o'clock petal tip sits exactly at y = 88
      const wheelRadius = 110;
      const cy = 192; // 192 - 110 + 6 = 88 (aligns top character exactly at y = 88)

      // Draw Carriage Base
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(cx - 35, cy - 25, 70, 110);
      ctx.strokeStyle = '#4a5568';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - 35, cy - 25, 70, 110);

      // Draw Daisy Wheel (Centered on carriage)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(state.currentAngle);

      // Hub center
      ctx.fillStyle = '#a0aec0';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#718096';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, 2 * Math.PI);
      ctx.fill();

      // Petals/Spokes
      ctx.strokeStyle = 'rgba(200, 200, 220, 0.4)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < NUM_PETALS; i++) {
        const angle = (i * 2 * Math.PI) / NUM_PETALS;
        ctx.save();
        ctx.rotate(angle);
        
        // Draw stem
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(0, -wheelRadius + 6);
        ctx.stroke();

        // Draw character petal tip
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(0, -wheelRadius + 6, 5.5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw character text on petal
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 7px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(ALPHABET[i], 0, -wheelRadius + 9);

        ctx.restore();
      }
      ctx.restore();

      // Draw Impact Hammer (Solenoid) above the wheel at 12 o'clock position
      const hx = cx;
      const hy = cy - wheelRadius - 20; // Solenoid body base position (62)

      // Solenoid bracket
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(hx - 8, hy - 25, 16, 25);
      
      // Hammer plunger (pin that strikes the wheel petal)
      // Styled dark steel shaft with a distinct brass striking tip to avoid visual confusion
      ctx.fillStyle = '#2d3748'; // Dark steel shaft
      ctx.fillRect(hx - 2, hy - 15 + state.hammerOffset, 4, 25);
      
      ctx.fillStyle = '#d69e2e'; // Brass striking tip
      ctx.fillRect(hx - 4, hy + 10 + state.hammerOffset, 8, 5);

      // Hammer solenoid coils
      ctx.fillStyle = '#b7791f'; // Copper color coils
      ctx.fillRect(hx - 6, hy - 20, 12, 16);

      // Draw simple indicator label on top to guide viewer
      if (printing) {
        ctx.fillStyle = '#ecc94b';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('STRIKE ZONE', cx, cy - wheelRadius - 38);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [printing, printedText]);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div>
          <h2 className={styles.panelTitle}>Daisy Wheel Printer</h2>
          <p className={styles.subTitle}>
            Compare legacy solid-font mechanical printing where character wheels spin to align characters with a strike hammer.
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
          {printing ? 'Printing...' : 'Execute Print'}
        </button>

        {printing && (
          <div className={styles.controlGroup}>
            <span className={styles.statusText}>Carriage Queue:</span>
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
          Observe the daisy wheel rotate to index each character before the hammer strikes it onto the carbon ribbon.
        </div>
      </div>
    </div>
  );
}
