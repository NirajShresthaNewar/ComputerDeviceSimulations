import { useRef, useEffect } from 'react';
import styles from './WaveformCanvas.module.css';

export default function WaveformCanvas({ analyser, isActive }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    if (!isActive || !analyser) {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(137, 147, 168, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = accent || '#3DDC97';
      ctx.beginPath();

      const sliceWidth = width / dataArray.length;
      let x = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser, isActive]);

  return <canvas ref={canvasRef} width={500} height={120} className={styles.canvas} />;
}