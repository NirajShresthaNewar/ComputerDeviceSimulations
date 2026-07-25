import { useRef, useEffect } from 'react';
import styles from './PhosphorScreen.module.css';

export default function PhosphorScreen({ phosphor, gridW, gridH, revision }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const cellW = canvas.width / gridW;
    const cellH = canvas.height / gridH;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < gridH; r++) {
      for (let c = 0; c < gridW; c++) {
        const brightness = phosphor[r * gridW + c];
        if (brightness > 1) {
          // Create a colorful retro phosphor rainbow effect using HSL
          const hue = Math.floor(((r / gridH) * 0.4 + (c / gridW) * 0.6) * 360);
          const saturation = 90;
          const lightness = Math.min(65, (brightness / 255) * 65);
          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        }
      }
    }
  }, [phosphor, gridW, gridH, revision]);

  return (
    <div className={styles.frame}>
      <canvas ref={canvasRef} width={400} height={300} className={styles.canvas} />
      <div className={styles.scanlineOverlay} />
    </div>
  );
}