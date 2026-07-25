import { useState, useRef, useEffect } from 'react';
import styles from './LedSim.module.css';

export default function LedSim() {
  const [mode, setMode] = useState('fald'); // 'edge', 'fald', 'oled'
  const [view, setView] = useState('split'); // 'split', 'backlight', 'final'
  const [pos, setPos] = useState({ x: 240, y: 150 });
  const canvasRef = useRef(null);

  // Handle pointer tracking
  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Constrain inside canvas
    setPos({
      x: Math.max(0, Math.min(canvas.width, x)),
      y: Math.max(0, Math.min(canvas.height, y))
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const circleRadius = 30;

      // Draw function helper
      const drawBacklight = (context, startX, width) => {
        // Draw backlight panel
        context.fillStyle = '#050508';
        context.fillRect(startX, 0, width, h);

        if (mode === 'edge') {
          // Edge-lit: Uniform bright white/blue-white sheet
          const grad = context.createLinearGradient(startX, 0, startX + width, 0);
          grad.addColorStop(0, '#3182ce');
          grad.addColorStop(0.05, '#ffffff');
          grad.addColorStop(0.5, '#e2e8f0');
          grad.addColorStop(0.95, '#ffffff');
          grad.addColorStop(1, '#3182ce');
          context.fillStyle = grad;
          context.globalAlpha = 0.55;
          context.fillRect(startX, 0, width, h);
          context.globalAlpha = 1.0;

          // Draw LEDs along the edges (small glowing blue dots)
          context.fillStyle = '#63b3ed';
          for (let y = 10; y < h; y += 20) {
            context.beginPath();
            context.arc(startX + 3, y, 3, 0, 2 * Math.PI);
            context.arc(startX + width - 3, y, 3, 0, 2 * Math.PI);
            context.fill();
          }
        } 
        else if (mode === 'fald') {
          // FALD: 4x4 Grid of individual dimming zones
          const cols = 5;
          const rows = 4;
          const zoneW = width / cols;
          const zoneH = h / rows;

          // Calculate which zones are active based on the pointer position
          for (let r = 0; r < rows; r++) {
            const zY = r * zoneH + zoneH / 2;
            for (let c = 0; c < cols; c++) {
              const zX = startX + c * zoneW + zoneW / 2;

              // Distance from pointer (offset pointer to fit startX coordinate system)
              const pointerXInBacklight = pos.x - (w / 2) + zX - startX;
              const dist = Math.hypot(pos.x - zX, pos.y - zY);
              
              // Zone intensity based on proximity to pointer
              const maxDist = 120;
              const zoneIntensity = Math.max(0, 1 - dist / maxDist);

              // Draw zone boundary
              context.strokeStyle = 'rgba(255, 255, 255, 0.05)';
              context.strokeRect(startX + c * zoneW, r * zoneH, zoneW, zoneH);

              if (zoneIntensity > 0) {
                const grad = context.createRadialGradient(zX, zY, 5, zX, zY, zoneW * 0.9);
                grad.addColorStop(0, `rgba(255, 255, 255, ${zoneIntensity * 0.8})`);
                grad.addColorStop(0.5, `rgba(240, 244, 255, ${zoneIntensity * 0.3})`);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                context.fillStyle = grad;
                context.fillRect(startX + c * zoneW, r * zoneH, zoneW, zoneH);

                // LED center point
                context.fillStyle = `rgba(255, 255, 255, ${zoneIntensity})`;
                context.beginPath();
                context.arc(zX, zY, 4, 0, 2 * Math.PI);
                context.fill();
              }
            }
          }
        } 
        else if (mode === 'oled') {
          // OLED: Emissive - only the exact pixels of the circle glow
          const grad = context.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, circleRadius);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          context.fillStyle = grad;
          context.beginPath();
          context.arc(pos.x, pos.y, circleRadius, 0, 2 * Math.PI);
          context.fill();
        }
      };

      const drawFinalImage = (context, startX, width) => {
        // Draw LCD crystal sheet front screen
        context.fillStyle = '#020204';
        context.fillRect(startX, 0, width, h);

        if (mode === 'edge') {
          // Edge-lit: Background is washed out gray because backlight is fully on
          context.fillStyle = '#18181f';
          context.fillRect(startX, 0, width, h);

          // White circle
          context.fillStyle = '#ffffff';
          context.shadowBlur = 8;
          context.shadowColor = '#ffffff';
          context.beginPath();
          context.arc(pos.x, pos.y, circleRadius, 0, 2 * Math.PI);
          context.fill();
          context.shadowBlur = 0;
        } 
        else if (mode === 'fald') {
          // FALD: Halo / Blooming effect
          // Draw the FALD backlight contribution on the front screen (bloomed halo)
          const cols = 5;
          const rows = 4;
          const zoneW = width / cols;
          const zoneH = h / rows;

          for (let r = 0; r < rows; r++) {
            const zY = r * zoneH + zoneH / 2;
            for (let c = 0; c < cols; c++) {
              const zX = startX + c * zoneW + zoneW / 2;
              const dist = Math.hypot(pos.x - zX, pos.y - zY);
              const maxDist = 120;
              const zoneIntensity = Math.max(0, 1 - dist / maxDist);

              if (zoneIntensity > 0) {
                // Draw light blooming on the screen where the backlight zone is on
                const grad = context.createRadialGradient(zX, zY, 5, zX, zY, zoneW * 0.85);
                grad.addColorStop(0, `rgba(255, 255, 255, ${zoneIntensity * 0.15})`);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                context.fillStyle = grad;
                context.fillRect(startX + c * zoneW, r * zoneH, zoneW, zoneH);
              }
            }
          }

          // White circle (with crisp edges over the bloom)
          context.fillStyle = '#ffffff';
          context.beginPath();
          context.arc(pos.x, pos.y, circleRadius, 0, 2 * Math.PI);
          context.fill();
        } 
        else if (mode === 'oled') {
          // OLED: Perfect pitch black background, crisp emissive circle
          context.fillStyle = '#ffffff';
          context.shadowBlur = 12;
          context.shadowColor = '#ffffff';
          context.beginPath();
          context.arc(pos.x, pos.y, circleRadius, 0, 2 * Math.PI);
          context.fill();
          context.shadowBlur = 0;
        }
      };

      // Clear Canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);

      if (view === 'split') {
        // Draw Split screen (Backlight on left, Final Image on right)
        ctx.save();
        
        // Left half (Backlight)
        ctx.rect(0, 0, w / 2, h);
        ctx.clip();
        drawBacklight(ctx, 0, w / 2);
        ctx.restore();

        ctx.save();
        // Right half (Final Image)
        ctx.rect(w / 2, 0, w / 2, h);
        ctx.clip();
        drawFinalImage(ctx, 0, w);
        ctx.restore();

        // Divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();

        // Titles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '11px sans-serif';
        ctx.fillText('BACKLIGHT STATE', 10, 20);
        ctx.fillText('FINAL SCREEN OUTPUT', w / 2 + 10, 20);
      } 
      else if (view === 'backlight') {
        drawBacklight(ctx, 0, w);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '11px sans-serif';
        ctx.fillText('BACKLIGHT PANEL VIEW', 10, 20);
      } 
      else if (view === 'final') {
        drawFinalImage(ctx, 0, w);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '11px sans-serif';
        ctx.fillText('FRONT SCREEN VIEW', 10, 20);
      }

      // Draw target indicator at cursor position
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, circleRadius + 6, 0, 2 * Math.PI);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mode, view, pos]);

  // Mode explanations
  let explanationText = '';
  if (mode === 'edge') {
    explanationText = 'Edge-Lit LED monitors place LEDs only around the outer edges of the display. A light guide plate distributes it across the screen. Since the backlight is always turned ON completely, dark scenes look dark gray instead of deep black. Contrast is low.';
  } else if (mode === 'fald') {
    explanationText = 'Full-Array Local Dimming (FALD) places LEDs directly behind the LCD panel in a grid. It turns off or dims specific zones behind dark areas. This yields great contrast, but because zones are larger than individual pixels, it causes "blooming" or "halos" around bright objects.';
  } else if (mode === 'oled') {
    explanationText = 'OLED (Organic LED) screens are emissive: every pixel generates its own light. There is no backlight. To display black, pixels turn off entirely, yielding infinite contrast (true blacks) and zero blooming or halos around bright objects.';
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div>
          <h2 className={styles.panelTitle}>LED / OLED Dimming Explorer</h2>
          <p className={styles.subTitle}>
            Compare backlighting tech to see how contrast ratios and blooming occur.
          </p>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Backlighting Technology</label>
          <div className={styles.buttonGrid}>
            <button
              className={`${styles.modeBtn} ${mode === 'edge' ? styles.modeBtnActive : ''}`}
              onClick={() => setMode('edge')}
            >
              <span className={styles.modeTitle}>Edge-Lit LED LCD</span>
              <span className={styles.modeDesc}>Backlight is always 100% on. Gray blacks.</span>
            </button>
            <button
              className={`${styles.modeBtn} ${mode === 'fald' ? styles.modeBtnActive : ''}`}
              onClick={() => setMode('fald')}
            >
              <span className={styles.modeTitle}>FALD (Full-Array Local Dimming)</span>
              <span className={styles.modeDesc}>Grid zones turn off behind black zones. Blooming halos.</span>
            </button>
            <button
              className={`${styles.modeBtn} ${mode === 'oled' ? styles.modeBtnActive : ''}`}
              onClick={() => setMode('oled')}
            >
              <span className={styles.modeTitle}>OLED (Self-Emissive Pixels)</span>
              <span className={styles.modeDesc}>Individual subpixels turn off completely. Infinite contrast.</span>
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Display View Mode</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{ flex: 1, padding: '6px 8px', fontSize: '0.8rem' }}
              className={`${styles.modeBtn} ${view === 'split' ? styles.modeBtnActive : ''}`}
              onClick={() => setView('split')}
            >
              Split View
            </button>
            <button
              style={{ flex: 1, padding: '6px 8px', fontSize: '0.8rem' }}
              className={`${styles.modeBtn} ${view === 'backlight' ? styles.modeBtnActive : ''}`}
              onClick={() => setView('backlight')}
            >
              Backlight Only
            </button>
            <button
              style={{ flex: 1, padding: '6px 8px', fontSize: '0.8rem' }}
              className={`${styles.modeBtn} ${view === 'final' ? styles.modeBtnActive : ''}`}
              onClick={() => setView('final')}
            >
              Final Screen
            </button>
          </div>
        </div>

        <div className={styles.explanation}>
          <strong>How it works:</strong> {explanationText}
        </div>
      </div>

      <div className={styles.right}>
        <div
          className={styles.canvasContainer}
          onMouseMove={handlePointerMove}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              handlePointerMove(e.touches[0]);
            }
          }}
        >
          <canvas ref={canvasRef} width={480} height={300} className={styles.canvas} />
        </div>
        <div className={styles.instruction}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
          Move your cursor over the screen to slide the test object.
        </div>
      </div>
    </div>
  );
}
