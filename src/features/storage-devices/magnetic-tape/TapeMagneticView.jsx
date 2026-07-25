import React, { useRef, useEffect } from 'react';
import styles from './TapeSim.module.css';

/**
 * Zoomed-in view of the magnetic tape surface, showing:
 * - Magnetic domains (dipoles) aligning under the read/write electromagnetic heads.
 * - Coils showing current direction during writes.
 * - Magnetic flux graph.
 * 
 * @param {Object} props
 * @param {Array<Object>} props.recordedBits - List of bits stored on the tape [{bit: 0|1, label: string}, ...]
 * @param {number} props.position - Current position (0 to 1) representing tape scroll offset
 * @param {string} props.mode - 'read' | 'write' | 'seek' | 'idle'
 * @param {number} props.activeBitIndex - The index of the bit currently under the read/write head
 * @param {number} props.currentWritingBit - The bit value currently being written (0 or 1)
 */
export default function TapeMagneticView({
  recordedBits = [],
  position = 0,
  mode = 'idle',
  activeBitIndex = -1,
  currentWritingBit = 0,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0f172a'; // dark theme bg
    ctx.fillRect(0, 0, W, H);

    // Draw background tracks grid
    const tapeY = 60;
    const tapeH = 90;
    
    // 1. Draw PET plastic base film layer (dark brown backing)
    ctx.fillStyle = '#292524';
    ctx.fillRect(0, tapeY, W, tapeH);
    
    // Magnetic oxide coating top layer (warm medium brown)
    ctx.fillStyle = '#57534e';
    ctx.fillRect(0, tapeY, W, tapeH - 12);

    // Track divider lines (representing a multi-track tape structure, e.g. 9-track layout)
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 1;
    const trackCount = 5; // Simplified to 5 visible tracks
    const trackH = (tapeH - 12) / trackCount;
    for (let i = 1; i < trackCount; i++) {
      ctx.beginPath();
      ctx.moveTo(0, tapeY + i * trackH);
      ctx.lineTo(W, tapeY + i * trackH);
      ctx.stroke();
    }

    // 2. Draw Magnetic Domains (Dipoles)
    // The tape scrolls horizontally as the position changes.
    // Let's map position (0 to 1) to horizontal scrolling.
    const bitSpacing = 70; // pixels between bits
    const centerHeadX = W / 2 + 30; // alignment with read/write head blocks
    const startX = centerHeadX - position * recordedBits.length * bitSpacing;

    recordedBits.forEach((item, index) => {
      const bitX = startX + index * bitSpacing;
      
      // Only draw if on screen
      if (bitX > -50 && bitX < W + 50) {
        const isAligned = item.aligned;
        const val = item.bit;

        // Draw Inter-Record Gap (IRG) if marked
        if (item.isGap) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
          ctx.fillRect(bitX - bitSpacing/2, tapeY, bitSpacing, tapeH - 12);
          ctx.fillStyle = '#ef4444';
          ctx.font = '9px monospace';
          ctx.fillText('GAP', bitX - 8, tapeY + 12);
          return;
        }

        // Draw track domains
        for (let t = 0; t < trackCount; t++) {
          const dy = tapeY + t * trackH + trackH / 2;

          // Draw small arrows/magnetic domains inside the track segment
          // A bit has a group of 3 dipoles representing its state
          for (let d = -1; d <= 1; d++) {
            const dx = bitX + d * 14;
            
            ctx.save();
            ctx.translate(dx, dy);

            if (isAligned) {
              // 1 = North-Right (Red/Blue), 0 = South-Left (Blue/Red)
              const dir = val === 1 ? 1 : -1;
              
              // Draw small N-S magnet dipole
              ctx.fillStyle = dir === 1 ? '#3b82f6' : '#ef4444'; // Blue (S) | Red (N)
              ctx.fillRect(-6, -4, 6, 8);
              ctx.fillStyle = dir === 1 ? '#ef4444' : '#3b82f6';
              ctx.fillRect(0, -4, 6, 8);

              // Direction arrow overlay
              ctx.strokeStyle = 'white';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(-3 * dir, 0);
              ctx.lineTo(3 * dir, 0);
              ctx.lineTo(1 * dir, -2);
              ctx.moveTo(3 * dir, 0);
              ctx.lineTo(1 * dir, 2);
              ctx.stroke();
            } else {
              // Unaligned / Random orientation (gray, pointing arbitrarily)
              const angle = (Math.sin(index * 7 + t * 3 + d) * 180 * Math.PI) / 180;
              ctx.rotate(angle);
              ctx.fillStyle = '#78716c';
              ctx.fillRect(-5, -3, 10, 6);
              ctx.strokeStyle = '#a8a29e';
              ctx.beginPath();
              ctx.moveTo(-3, 0);
              ctx.lineTo(3, 0);
              ctx.stroke();
            }
            ctx.restore();
          }
        }

        // Bit value labels above the tape
        ctx.fillStyle = isAligned ? '#e2e8f0' : '#64748b';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(isAligned ? String(val) : '?', bitX, tapeY - 8);

        // Byte character grouping tags underneath tape
        if (item.label && isAligned) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(bitX - 25, tapeY + tapeH + 5);
          ctx.lineTo(bitX - 25, tapeY + tapeH + 12);
          ctx.lineTo(bitX + 25, tapeY + tapeH + 12);
          ctx.lineTo(bitX + 25, tapeY + tapeH + 5);
          ctx.stroke();

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(`'${item.label}'`, bitX, tapeY + tapeH + 24);
        }
      }
    });

    // 3. Draw stationary READ and WRITE heads in contact with tape
    const writeHeadX = centerHeadX; // Writes at this line
    const readHeadX = centerHeadX - 45; // Reads 45px behind

    // DRAW WRITE HEAD
    ctx.fillStyle = '#475569';
    ctx.fillRect(writeHeadX - 12, 10, 24, 52);
    // Metallic write gap at tape surface
    ctx.fillStyle = mode === 'write' ? '#ef4444' : '#64748b';
    ctx.fillRect(writeHeadX - 2, 58, 4, 6);

    // Electromagnetic coils representation
    ctx.strokeStyle = '#f59e0b'; // copper coil color
    ctx.lineWidth = 2.5;
    for (let c = 0; c < 4; c++) {
      ctx.beginPath();
      ctx.arc(writeHeadX, 22 + c * 8, 8, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }
    // Show current flow arrows when writing
    if (mode === 'write') {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      // Arrow showing direction of current depending on written bit
      const arrY = 25;
      if (currentWritingBit === 1) {
        ctx.moveTo(writeHeadX + 12, arrY);
        ctx.lineTo(writeHeadX + 16, arrY + 4);
        ctx.lineTo(writeHeadX + 8, arrY + 4);
      } else {
        ctx.moveTo(writeHeadX + 12, arrY + 4);
        ctx.lineTo(writeHeadX + 16, arrY);
        ctx.lineTo(writeHeadX + 8, arrY);
      }
      ctx.fill();
    }

    // DRAW READ HEAD
    ctx.fillStyle = '#475569';
    ctx.fillRect(readHeadX - 12, 10, 24, 52);
    ctx.fillStyle = mode === 'read' ? '#34d399' : '#64748b';
    ctx.fillRect(readHeadX - 2, 58, 4, 6);

    // Labels for Head functions
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText('READ GAP', readHeadX, 8);
    ctx.fillText('WRITE GAP', writeHeadX, 8);

    // Active markers
    if (mode === 'write') {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(writeHeadX - 15, 5, 30, 62);
      ctx.setLineDash([]);
    }
    if (mode === 'read') {
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(readHeadX - 15, 5, 30, 62);
      ctx.setLineDash([]);
    }

    // Draw Magnetic Flux Waveform Graph underneath
    const graphY = H - 35;
    const graphH = 25;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, graphY);
    ctx.lineTo(W, graphY);
    ctx.stroke();

    // Plot magnetic flux transitions
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let first = true;
    recordedBits.forEach((item, index) => {
      const bitX = startX + index * bitSpacing;
      if (bitX > 0 && bitX < W) {
        const val = item.bit;
        const fluxVal = item.aligned ? (val === 1 ? -1 : 1) : 0;
        const y = graphY + fluxVal * (graphH / 2);
        if (first) {
          ctx.moveTo(bitX, y);
          first = false;
        } else {
          ctx.lineTo(bitX, y);
        }
      }
    });
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '8px monospace';
    ctx.fillText('MAGNETIC FLUX DEMODULATION (READ SIGNAL)', 10, H - 5);

  }, [recordedBits, position, mode, activeBitIndex, currentWritingBit]);

  return (
    <div className={styles.magneticViewWrap}>
      <span className={styles.sectionLabel}>Microscopic Magnetic Tape Track Zoom</span>
      <canvas
        ref={canvasRef}
        width={580}
        height={210}
        className={styles.magneticCanvas}
      />
    </div>
  );
}
