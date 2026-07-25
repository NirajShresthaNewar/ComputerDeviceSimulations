import { useRef, useEffect } from 'react';
import styles from './SpeakerSim.module.css';

/**
 * Renders two canvases:
 *  1. Time-domain waveform (oscilloscope-style)
 *  2. Frequency spectrum (bar graph)
 */
export default function WaveformCanvas({ timeDomain, freqData, waveform, playing }) {
  const waveCanvasRef = useRef(null);
  const freqCanvasRef = useRef(null);

  /* ---- draw time-domain waveform ---- */
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Center line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    // Waveform
    const sliceWidth = W / timeDomain.length;
    const gradient = ctx.createLinearGradient(0, 0, W, 0);

    // Color palette based on waveform type
    const palettes = {
      sine:     ['#38bdf8', '#818cf8', '#c084fc'],
      square:   ['#f472b6', '#fb923c', '#facc15'],
      triangle: ['#34d399', '#2dd4bf', '#22d3ee'],
      sawtooth: ['#fb7185', '#f43f5e', '#e11d48'],
    };
    const colors = palettes[waveform] || palettes.sine;
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();

    for (let i = 0; i < timeDomain.length; i++) {
      const v = timeDomain[i] / 128.0;
      const y = (v * H) / 2;
      if (i === 0) ctx.moveTo(0, y);
      else ctx.lineTo(i * sliceWidth, y);
    }
    ctx.stroke();

    // Glow layer
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2.5;

  }, [timeDomain, waveform]);

  /* ---- draw frequency spectrum ---- */
  useEffect(() => {
    const canvas = freqCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background grid lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
    ctx.lineWidth = 1;
    for (let y = 0; y < H; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    const barCount = freqData.length;
    const barWidth = W / barCount;

    for (let i = 0; i < barCount; i++) {
      const barHeight = (freqData[i] / 255) * H;
      const x = i * barWidth;

      // Hue shifts across the spectrum for a rainbow effect
      const hue = (i / barCount) * 280 + 180; // cyan → purple
      const sat = 85;
      const lum = 50 + (freqData[i] / 255) * 15;

      const grad = ctx.createLinearGradient(x, H, x, H - barHeight);
      grad.addColorStop(0, `hsla(${hue}, ${sat}%, ${lum * 0.4}%, 0.9)`);
      grad.addColorStop(1, `hsla(${hue}, ${sat}%, ${lum}%, 0.9)`);

      ctx.fillStyle = grad;
      ctx.fillRect(x, H - barHeight, barWidth - 1, barHeight);

      // Glow cap
      if (barHeight > 4) {
        ctx.fillStyle = `hsla(${hue}, 90%, 70%, 0.6)`;
        ctx.fillRect(x, H - barHeight, barWidth - 1, 3);
      }
    }
  }, [freqData]);

  return (
    <div className={styles.waveformWrap}>
      <div className={styles.canvasBox}>
        <span className={styles.canvasLabel}>Waveform</span>
        <canvas ref={waveCanvasRef} width={560} height={160} className={styles.canvas} />
        {!playing && (
          <div className={styles.canvasOverlay}>
            <span>Press <strong>Play</strong> to generate a waveform</span>
          </div>
        )}
      </div>
      <div className={styles.canvasBox}>
        <span className={styles.canvasLabel}>Frequency Spectrum</span>
        <canvas ref={freqCanvasRef} width={560} height={120} className={styles.canvas} />
        {!playing && (
          <div className={styles.canvasOverlay}>
            <span>No audio data</span>
          </div>
        )}
      </div>
    </div>
  );
}
