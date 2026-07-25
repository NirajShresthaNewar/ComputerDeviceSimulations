import { useState, useRef, useEffect, useCallback } from 'react';
import { CAT_BITMAP } from './catBitmap';

const GRID_W = CAT_BITMAP[0].length;
const GRID_H = CAT_BITMAP.length;
const LINE_DURATION_MS = 60; // time to sweep one full horizontal line
const DECAY_PER_FRAME = 3.5; // how fast phosphor brightness fades each tick

export function usePhosphorScan() {
  const [running, setRunning] = useState(false);
  const [beamPos, setBeamPos] = useState({ col: 0, row: 0 }); // current beam position in grid units
  const phosphorRef = useRef(new Float32Array(GRID_W * GRID_H)); // current displayed brightness, with decay
  const [revision, forceRender] = useState(0); // bump to trigger re-render for consumers reading phosphorRef
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const frameDurationMs = LINE_DURATION_MS * GRID_H;

  const tick = useCallback((now) => {
    if (!startRef.current) startRef.current = now;
    const elapsed = (now - startRef.current) % frameDurationMs;

    const row = Math.floor(elapsed / LINE_DURATION_MS);
    const lineProgress = (elapsed % LINE_DURATION_MS) / LINE_DURATION_MS;
    const col = Math.floor(lineProgress * GRID_W);

    setBeamPos({ col, row });

    // decay everything slightly, then "paint" up to the current beam position
    const phosphor = phosphorRef.current;
    for (let i = 0; i < phosphor.length; i++) {
      phosphor[i] = Math.max(0, phosphor[i] - DECAY_PER_FRAME);
    }
    for (let r = 0; r <= row; r++) {
      const maxCol = r === row ? col : GRID_W - 1;
      for (let c = 0; c <= maxCol; c++) {
        const target = CAT_BITMAP[r][c];
        const idx = r * GRID_W + c;
        // beam excites phosphor toward the bitmap's brightness value
        phosphor[idx] = Math.max(phosphor[idx], target);
      }
    }

    forceRender((n) => n + 1);
    rafRef.current = requestAnimationFrame(tick);
  }, [frameDurationMs]);

  useEffect(() => {
    if (running) {
      startRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, tick]);

  const start = () => setRunning(true);
  const stop = () => setRunning(false);
  const reset = () => {
    phosphorRef.current.fill(0);
    startRef.current = null;
    setBeamPos({ col: 0, row: 0 });
    forceRender((n) => n + 1);
  };

  return {
    running,
    start,
    stop,
    reset,
    beamPos,
    phosphor: phosphorRef.current,
    gridW: GRID_W,
    gridH: GRID_H,
    revision,
  };
}