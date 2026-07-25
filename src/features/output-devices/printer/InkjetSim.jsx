import { useState, useRef, useEffect } from 'react';
import styles from './InkjetSim.module.css';

// Draw a beautiful cat flower image onto an offscreen canvas
function drawCatFlowerImage(ctx, w, h) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // Offset coordinates to center illustration
  const cx = w / 2;
  const cy = h / 2 + 3;

  // 1. Draw Flower behind ear (Pink/Magenta petals, Yellow center)
  ctx.fillStyle = '#ff00ff';
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.arc(cx + w * 0.18 + Math.cos(angle) * (w * 0.09), cy - h * 0.18 + Math.sin(angle) * (h * 0.09), w * 0.08, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(cx + w * 0.18, cy - h * 0.18, w * 0.05, 0, 2 * Math.PI);
  ctx.fill();

  // 2. Draw Cat Face Silhouette (Cyan body)
  ctx.fillStyle = '#00ffff';
  ctx.beginPath();
  ctx.arc(cx, cy, w * 0.26, 0, 2 * Math.PI);
  ctx.fill();

  // Left Ear (Cyan)
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.21, cy - h * 0.14);
  ctx.lineTo(cx - w * 0.28, cy - h * 0.33);
  ctx.lineTo(cx - w * 0.08, cy - h * 0.25);
  ctx.closePath();
  ctx.fill();

  // Right Ear (Cyan)
  ctx.beginPath();
  ctx.moveTo(cx + w * 0.08, cy - h * 0.25);
  ctx.lineTo(cx + w * 0.28, cy - h * 0.33);
  ctx.lineTo(cx + w * 0.21, cy - h * 0.14);
  ctx.closePath();
  ctx.fill();

  // Left Ear Inner (Magenta)
  ctx.fillStyle = '#ff00ff';
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.18, cy - h * 0.17);
  ctx.lineTo(cx - w * 0.24, cy - h * 0.29);
  ctx.lineTo(cx - w * 0.10, cy - h * 0.24);
  ctx.closePath();
  ctx.fill();

  // 3. Cat Eyes (Yellow with Black Pupils)
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(cx - w * 0.09, cy - h * 0.04, w * 0.045, 0, 2 * Math.PI);
  ctx.arc(cx + w * 0.09, cy - h * 0.04, w * 0.045, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(cx - w * 0.09, cy - h * 0.04, w * 0.02, 0, 2 * Math.PI);
  ctx.arc(cx + w * 0.09, cy - h * 0.04, w * 0.02, 0, 2 * Math.PI);
  ctx.fill();

  // 4. Nose (Magenta)
  ctx.fillStyle = '#ff00ff';
  ctx.beginPath();
  ctx.moveTo(cx, cy + h * 0.02);
  ctx.lineTo(cx - w * 0.03, cy - h * 0.01);
  ctx.lineTo(cx + w * 0.03, cy - h * 0.01);
  ctx.closePath();
  ctx.fill();

  // 5. Mouth & Whiskers (Black lines)
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = w * 0.013;
  ctx.beginPath();
  // Mouth
  ctx.moveTo(cx, cy + h * 0.02);
  ctx.quadraticCurveTo(cx - w * 0.04, cy + h * 0.08, cx - w * 0.08, cy + h * 0.04);
  ctx.moveTo(cx, cy + h * 0.02);
  ctx.quadraticCurveTo(cx + w * 0.04, cy + h * 0.08, cx + w * 0.08, cy + h * 0.04);
  // Whiskers
  ctx.moveTo(cx - w * 0.17, cy + h * 0.02);
  ctx.lineTo(cx - w * 0.29, cy + h * 0.01);
  ctx.moveTo(cx - w * 0.17, cy + h * 0.05);
  ctx.lineTo(cx - w * 0.28, cy + h * 0.08);
  ctx.moveTo(cx + w * 0.17, cy + h * 0.02);
  ctx.lineTo(cx + w * 0.29, cy + h * 0.01);
  ctx.moveTo(cx + w * 0.17, cy + h * 0.05);
  ctx.lineTo(cx + w * 0.28, cy + h * 0.08);
  ctx.stroke();
}

export default function InkjetSim() {
  const [cyan, setCyan] = useState(true);
  const [magenta, setMagenta] = useState(true);
  const [yellow, setYellow] = useState(true);
  const [key, setKey] = useState(true);
  const [distance, setDistance] = useState(1); // 1x to 30x
  const [quality, setQuality] = useState('medium'); // 'low', 'medium', 'high'
  const [printing, setPrinting] = useState(false);
  const [printedDots, setPrintedDots] = useState([]);
  const canvasRef = useRef(null);

  // Animation state in refs
  const animState = useRef({
    carriageX: 90,
    columnIdx: 0,
    sourcePixels: null,
    droplets: [], // array of animated falling ink drops
    stepCounter: 0,
  });

  // Dynamic parameters based on DPI Quality selection
  let imgW = 60;
  let imgH = 60;
  let scale = 3.5;
  let dotRadius = 2.0;

  if (quality === 'low') {
    imgW = 30;
    imgH = 30;
    scale = 7.0;
    dotRadius = 4.0;
  } else if (quality === 'high') {
    imgW = 95;
    imgH = 95;
    scale = 2.2;
    dotRadius = 1.25;
  }

  const startX = 90;
  const startY = 40;

  const handlePrint = () => {
    if (printing) return;
    setPrinting(true);
    setPrintedDots([]);

    // Draw the image on an offscreen canvas to extract pixel data
    const offscreen = document.createElement('canvas');
    offscreen.width = imgW;
    offscreen.height = imgH;
    const offscreenCtx = offscreen.getContext('2d');
    drawCatFlowerImage(offscreenCtx, imgW, imgH);
    
    animState.current = {
      carriageX: startX,
      columnIdx: 0,
      sourcePixels: offscreenCtx.getImageData(0, 0, imgW, imgH).data,
      droplets: [],
      stepCounter: 0,
    };
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

      // 1. Process Printing & Nozzle Ejections
      if (printing && state.sourcePixels) {
        state.stepCounter++;
        // Print one column of pixels every 2 frames
        if (state.stepCounter >= 2) {
          state.stepCounter = 0;
          const col = state.columnIdx;

          if (col < imgW) {
            // Eject droplets for the active column
            for (let row = 0; row < imgH; row++) {
              const pixelIdx = (row * imgW + col) * 4;
              const r = state.sourcePixels[pixelIdx];
              const g = state.sourcePixels[pixelIdx + 1];
              const b = state.sourcePixels[pixelIdx + 2];

              // Skip white background pixels
              if (r > 245 && g > 245 && b > 245) continue;

              // Convert RGB to CMYK
              const rNorm = r / 255;
              const gNorm = g / 255;
              const bNorm = b / 255;
              const kVal = 1 - Math.max(rNorm, gNorm, bNorm);
              
              let cVal = 0, mVal = 0, yVal = 0;
              if (kVal < 1) {
                cVal = (1 - rNorm - kVal) / (1 - kVal);
                mVal = (1 - gNorm - kVal) / (1 - kVal);
                yVal = (1 - bNorm - kVal) / (1 - kVal);
              }

              // Fire CMYK droplets if enabled and matching threshold
              const dropTargetY = startY + row * scale;

              if (cyan && cVal > 0.15) {
                state.droplets.push({
                  x: state.carriageX - 6,
                  y: 25,
                  targetY: dropTargetY,
                  color: '#00ffff',
                  speed: 4 + Math.random() * 2,
                  radius: dotRadius,
                });
              }
              if (magenta && mVal > 0.15) {
                state.droplets.push({
                  x: state.carriageX - 2,
                  y: 25,
                  targetY: dropTargetY,
                  color: '#ff00ff',
                  speed: 4 + Math.random() * 2,
                  radius: dotRadius,
                });
              }
              if (yellow && yVal > 0.15) {
                state.droplets.push({
                  x: state.carriageX + 2,
                  y: 25,
                  targetY: dropTargetY,
                  color: '#ffff00',
                  speed: 4 + Math.random() * 2,
                  radius: dotRadius,
                });
              }
              if (key && (kVal > 0.15 || (r < 30 && g < 30 && b < 30))) {
                state.droplets.push({
                  x: state.carriageX + 6,
                  y: 25,
                  targetY: dropTargetY,
                  color: '#000000',
                  speed: 4 + Math.random() * 2,
                  radius: dotRadius,
                });
              }
            }

            state.columnIdx++;
            state.carriageX = startX + state.columnIdx * scale;
          } else {
            // Check if all droplets have finished falling
            if (state.droplets.length === 0) {
              setPrinting(false);
            }
          }
        }
      }

      // Update falling droplets position
      const remainingDroplets = [];
      const newHits = [];

      state.droplets.forEach((drop) => {
        drop.y += drop.speed;
        if (drop.y >= drop.targetY) {
          // Landing collision: append permanent dot to paper
          newHits.push({
            x: drop.x,
            y: drop.targetY,
            color: drop.color,
            radius: drop.radius,
          });
        } else {
          remainingDroplets.push(drop);
        }
      });
      state.droplets = remainingDroplets;

      if (newHits.length > 0) {
        setPrintedDots((prev) => [...prev, ...newHits]);
      }

      // 2. Rendering Code
      // Background / Paper sheet
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // Draw paper borders/shadows
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, w - 20, h - 20);

      // Draw printed ink dots on paper using multiply blending
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      printedDots.forEach((dot) => {
        ctx.fillStyle = dot.color;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
        ctx.fill();
      });
      ctx.restore();

      // Draw falling ink droplets
      state.droplets.forEach((drop) => {
        ctx.fillStyle = drop.color;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius * 0.9, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Draw moving print head carriage
      const cx = state.carriageX;
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(cx - 20, 10, 40, 15);
      ctx.strokeStyle = '#4a5568';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 20, 10, 40, 15);

      // Draw active nozzles under the print head (color coded stripes)
      ctx.fillStyle = '#00ffff'; ctx.fillRect(cx - 8, 23, 3, 2); // Cyan nozzle
      ctx.fillStyle = '#ff00ff'; ctx.fillRect(cx - 3, 23, 3, 2); // Magenta nozzle
      ctx.fillStyle = '#ffff00'; ctx.fillRect(cx + 2, 23, 3, 2); // Yellow nozzle
      ctx.fillStyle = '#000000'; ctx.fillRect(cx + 7, 23, 3, 2); // Black nozzle

      // Guide rails
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(15, 17);
      ctx.lineTo(w - 15, 17);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [printing, printedDots, cyan, magenta, yellow, key, quality, imgW, imgH, scale, dotRadius]);

  const blurAmount = (distance - 1) * 0.45;

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div>
          <h2 className={styles.panelTitle}>Inkjet Print Quality</h2>
          <p className={styles.subTitle}>
            Choose the printer resolution (DPI) to see how droplet density and quantity affect image quality.
          </p>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Print Quality (DPI)</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`${styles.colorToggle} ${quality === 'low' ? styles.activeCyan : ''}`}
              onClick={() => setQuality('low')}
              disabled={printing}
            >
              Draft (Low DPI)
            </button>
            <button
              className={`${styles.colorToggle} ${quality === 'medium' ? styles.activeMagenta : ''}`}
              onClick={() => setQuality('medium')}
              disabled={printing}
            >
              Standard (Med DPI)
            </button>
            <button
              className={`${styles.colorToggle} ${quality === 'high' ? styles.activeYellow : ''}`}
              onClick={() => setQuality('high')}
              disabled={printing}
            >
              Photo (High DPI)
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Active Cartridges</label>
          <div className={styles.cmykSwitches}>
            <button
              className={`${styles.colorToggle} ${cyan ? styles.activeCyan : ''}`}
              onClick={() => setCyan(!cyan)}
              disabled={printing}
            >
              C
            </button>
            <button
              className={`${styles.colorToggle} ${magenta ? styles.activeMagenta : ''}`}
              onClick={() => setMagenta(!magenta)}
              disabled={printing}
            >
              M
            </button>
            <button
              className={`${styles.colorToggle} ${yellow ? styles.activeYellow : ''}`}
              onClick={() => setYellow(!yellow)}
              disabled={printing}
            >
              Y
            </button>
            <button
              className={`${styles.colorToggle} ${key ? styles.activeKey : ''}`}
              onClick={() => setKey(!key)}
              disabled={printing}
            >
              K
            </button>
          </div>
        </div>

        <button className={styles.btn} onClick={handlePrint} disabled={printing}>
          {printing ? 'Printing...' : 'Print Cat Flower'}
        </button>

        <div className={styles.controlGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.label}>Viewing Distance</span>
            <span style={{ color: '#3182ce', fontWeight: 'bold' }}>{distance}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value))}
            className={styles.slider}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#718096' }}>
            <span>Close (1x)</span>
            <span>Medium (15x)</span>
            <span>Far (30x)</span>
          </div>
        </div>

        <div className={styles.explanation}>
          <strong>Resolution Impact:</strong> 
          {quality === 'low' && ' Draft mode (Low DPI) sprays fewer, larger droplets (~900 dots). Printing is fast, but individual dots are highly visible and look pixelated even at a distance.'}
          {quality === 'medium' && ' Standard mode (Medium DPI) sprays a moderate density of dots (~3,600 dots), offering a good balance of speed and clarity.'}
          {quality === 'high' && ' Photo mode (High DPI) sprays a massive density of tiny droplets (~9,000 dots). This takes longer to print but delivers sharp, continuous lines and crisp photo reproduction.'}
        </div>
      </div>

      <div className={styles.right}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
          Droplet grid size: {imgW} x {imgH} ({imgW * imgH} pixels)
        </div>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className={styles.canvas}
          style={{
            filter: `blur(${blurAmount}px)`,
            backgroundColor: '#ffffff',
          }}
        />
        <div className={styles.instruction}>
          {printing 
            ? `Ejecting ${imgW * imgH} droplets...` 
            : 'Select a print quality mode and click print.'}
        </div>
      </div>
    </div>
  );
}
