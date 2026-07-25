import { useState, useRef, useEffect } from 'react';
import styles from './LcdSim.module.css';

export default function LcdSim() {
  const [voltage, setVoltage] = useState(0); // 0 to 1
  const [color, setColor] = useState('Green'); // Red, Green, Blue
  const canvasRef = useRef(null);

  // Compute transmission intensity
  // At 0V, crystals are twisted by 90 degrees, turning vertical light to horizontal.
  // Since Polarizer 2 is horizontal, light passes through (intensity = 1.0).
  // At max voltage (1.0), crystals align vertically (0 degrees twist).
  // Light stays vertical and is blocked by the horizontal Polarizer 2 (intensity = 0.0).
  const twistAngleDeg = (1 - voltage) * 90;
  const intensity = Math.sin((twistAngleDeg * Math.PI) / 180) ** 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const render = () => {
      time += 0.05;
      const w = canvas.width;
      const h = canvas.height;

      // Clear canvas
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, w, h);

      // Define columns
      const xBacklight = 40;
      const xPol1 = 100;
      const xLcStart = 140;
      const xLcEnd = 260;
      const xFilter = 300;
      const xPol2 = 350;
      const xEye = 430;

      // 1. Draw Backlight (White Light Source)
      const gradBack = ctx.createLinearGradient(xBacklight - 20, 0, xBacklight + 10, 0);
      gradBack.addColorStop(0, '#ffffff');
      gradBack.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
      ctx.fillStyle = gradBack;
      ctx.fillRect(xBacklight - 20, 30, 35, h - 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('BACKLIGHT', xBacklight - 20, 25);

      // 2. Draw Polarizer 1 (Vertical)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(xPol1 - 8, 30, 16, h - 60);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(xPol1 - 8, 30, 16, h - 60);
      ctx.strokeStyle = '#4299e1';
      ctx.lineWidth = 1.5;
      for (let y = 35; y < h - 30; y += 8) {
        ctx.beginPath();
        ctx.moveTo(xPol1 - 4, y);
        ctx.lineTo(xPol1 + 4, y);
        ctx.stroke();
      }
      ctx.fillStyle = '#4299e1';
      ctx.fillText('VERTICAL', xPol1 - 20, 25);
      ctx.fillText('POLARIZER', xPol1 - 22, h - 15);

      // 3. Draw Liquid Crystal Layer
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(xLcStart, 30, xLcEnd - xLcStart, h - 60);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fillRect(xLcStart, 30, xLcEnd - xLcStart, h - 60);
      ctx.fillStyle = '#a0aec0';
      ctx.fillText('LIQUID CRYSTALS', xLcStart + 10, 25);

      // Draw LC Molecules
      // We draw rows of molecules (ellipses).
      // Their twist angle interpolates from 0 degrees (vertical) at xLcStart
      // to the current twistAngleDeg at xLcEnd.
      const rows = 6;
      const cols = 5;
      for (let r = 0; r < rows; r++) {
        const y = 50 + r * ((h - 100) / (rows - 1));
        for (let c = 0; c < cols; c++) {
          const t = c / (cols - 1); // 0 at start, 1 at end
          const x = xLcStart + 15 + t * (xLcEnd - xLcStart - 30);
          
          // Angle of molecule: TN LCD twists molecules from vertical (0) to horizontal (90 - voltage*90)
          const currentMaxTwist = (1 - voltage) * 90;
          const angleRad = ((t * currentMaxTwist) * Math.PI) / 180;

          // Draw capsule/ellipse
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angleRad);
          
          // Glow effect on crystals
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#63b3ed';
          
          ctx.fillStyle = `rgba(99, 179, 237, ${0.4 + (1 - voltage) * 0.6})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, 4, 15, 0, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw a small line inside the molecule to show orientation better
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(0, 10);
          ctx.stroke();
          
          ctx.restore();
        }
      }

      // 4. Draw Color Filter (Red, Green, or Blue)
      let filterColor = '#e53e3e';
      if (color === 'Green') filterColor = '#38a169';
      if (color === 'Blue') filterColor = '#3182ce';

      ctx.fillStyle = filterColor;
      ctx.fillRect(xFilter - 5, 30, 10, h - 60);
      ctx.shadowBlur = 10;
      ctx.shadowColor = filterColor;
      ctx.strokeStyle = filterColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(xFilter - 5, 30, 10, h - 60);
      ctx.shadowBlur = 0; // reset glow

      ctx.fillStyle = filterColor;
      ctx.fillText(`${color.toUpperCase()}`, xFilter - 15, 25);
      ctx.fillText('FILTER', xFilter - 18, h - 15);

      // 5. Draw Polarizer 2 (Horizontal)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(xPol2 - 8, 30, 16, h - 60);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(xPol2 - 8, 30, 16, h - 60);
      ctx.strokeStyle = '#e53e3e';
      ctx.lineWidth = 1.5;
      for (let y = 35; y < h - 30; y += 6) {
        ctx.beginPath();
        ctx.moveTo(xPol2 - 6, y);
        ctx.lineTo(xPol2 + 6, y);
        ctx.stroke();
      }
      ctx.fillStyle = '#e53e3e';
      ctx.fillText('HORIZONTAL', xPol2 - 30, 25);
      ctx.fillText('POLARIZER', xPol2 - 25, h - 15);

      // 6. Draw Wave / Light Beam
      // Wave before Polarizer 1 (unpolarized - we represent this by drawing multiple offset waves)
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      for (let x = xBacklight; x <= xPol1; x++) {
        const y = h / 2 + Math.sin(x * 0.15 - time * 3) * 15;
        if (x === xBacklight) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave after Polarizer 1 (vertically polarized - represented as a vertical wave)
      ctx.strokeStyle = '#4299e1';
      ctx.beginPath();
      for (let x = xPol1; x <= xLcStart; x++) {
        const y = h / 2 + Math.sin(x * 0.15 - time * 3) * 15;
        if (x === xPol1) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave inside LC Layer (rotates/twists polarization)
      // We will show the wave rotating by twisting the drawn height/width of the sine wave
      ctx.beginPath();
      for (let x = xLcStart; x <= xLcEnd; x++) {
        const t = (x - xLcStart) / (xLcEnd - xLcStart);
        const currentTwist = t * twistAngleDeg;
        const twistRad = (currentTwist * Math.PI) / 180;
        
        // Compute wave profile
        const waveVal = Math.sin(x * 0.15 - time * 3) * 15;
        // Project waveVal on vertical and horizontal axes based on polarization rotation
        const yOffset = waveVal * Math.cos(twistRad);
        
        const y = h / 2 + yOffset;
        if (x === xLcStart) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#63b3ed';
      ctx.stroke();

      // Wave between LC and Color Filter (polarized at twistAngleDeg)
      const currentFinalTwistRad = (twistAngleDeg * Math.PI) / 180;
      ctx.beginPath();
      for (let x = xLcEnd; x <= xFilter; x++) {
        const waveVal = Math.sin(x * 0.15 - time * 3) * 15;
        const y = h / 2 + waveVal * Math.cos(currentFinalTwistRad);
        if (x === xLcEnd) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#63b3ed';
      ctx.stroke();

      // Wave between Filter and Polarizer 2 (colored, still polarized at twistAngleDeg)
      ctx.strokeStyle = filterColor;
      ctx.beginPath();
      for (let x = xFilter; x <= xPol2; x++) {
        const waveVal = Math.sin(x * 0.15 - time * 3) * 15;
        const y = h / 2 + waveVal * Math.cos(currentFinalTwistRad);
        if (x === xFilter) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave after Polarizer 2 (filtered color, horizontally polarized, intensity is attenuated)
      // Since it's horizontally polarized, we draw it as a horizontal projection.
      // Light amplitude after polarizer 2 is proportional to sin(twistAngleDeg)
      const outAmplitude = 15 * Math.sin(currentFinalTwistRad);
      if (Math.abs(outAmplitude) > 0.2) {
        ctx.strokeStyle = filterColor;
        ctx.beginPath();
        for (let x = xPol2; x <= xEye - 20; x++) {
          const y = h / 2 + Math.sin(x * 0.15 - time * 3) * outAmplitude;
          if (x === xPol2) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 7. Draw Eye/Viewer
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText('VIEWER', xEye - 15, 25);
      
      // Draw a cute simple eye shape
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(xEye, h / 2, 14, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(xEye, h / 2, 14, 1.15 * Math.PI, 1.85 * Math.PI);
      ctx.stroke();
      
      // Iris
      const lightVal = Math.floor(intensity * 255);
      let eyeColor = 'rgba(0,0,0,0)';
      if (color === 'Red') eyeColor = `rgba(${lightVal}, 0, 0, 0.8)`;
      if (color === 'Green') eyeColor = `rgba(0, ${lightVal}, 0, 0.8)`;
      if (color === 'Blue') eyeColor = `rgba(0, 0, ${lightVal}, 0.8)`;
      
      ctx.fillStyle = eyeColor;
      ctx.beginPath();
      ctx.arc(xEye, h / 2, 7, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(xEye, h / 2, 3, 0, 2 * Math.PI);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [voltage, color, twistAngleDeg, intensity]);

  // Description dynamic text
  let lcdStateDesc = '';
  if (voltage === 0) {
    lcdStateDesc = 'With 0V applied, liquid crystals are fully twisted (90°). Vertically polarized light from the backlight enters, rotates by 90° to become horizontal, and easily passes through the horizontal filter. The subpixel is 100% lit.';
  } else if (voltage === 1) {
    lcdStateDesc = 'At max voltage, the liquid crystal molecules align completely straight. They do not rotate the light, meaning it stays vertically polarized. The horizontal polarizer blocks this vertical light completely. The subpixel is 100% dark (OFF).';
  } else {
    const angle = Math.round(twistAngleDeg);
    const pass = Math.round(intensity * 100);
    lcdStateDesc = `At moderate voltage, liquid crystals twist partially to ${angle}°. The light's polarization angle is rotated by ${angle}°, allowing only ${pass}% of the light to pass through the horizontal polarizer. This is how shades of brightness are created.`;
  }

  // Final color value style
  let finalColorStyle = 'rgb(0, 0, 0)';
  if (color === 'Red') finalColorStyle = `rgb(${Math.round(intensity * 255)}, 0, 0)`;
  if (color === 'Green') finalColorStyle = `rgb(0, ${Math.round(intensity * 255)}, 0)`;
  if (color === 'Blue') finalColorStyle = `rgb(0, 0, ${Math.round(intensity * 255)})`;

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div>
          <h2 className={styles.panelTitle}>LCD Subpixel Explorer</h2>
          <p className={styles.subTitle}>
            Control the voltage across the liquid crystal stack to see how light is twisted.
          </p>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Subpixel Color Filter</label>
          <div className={styles.colorButtons}>
            {['Red', 'Green', 'Blue'].map((c) => {
              let activeClass = '';
              if (color === c) {
                if (c === 'Red') activeClass = styles.colorBtnActiveRed;
                if (c === 'Green') activeClass = styles.colorBtnActiveGreen;
                if (c === 'Blue') activeClass = styles.colorBtnActiveBlue;
              }
              return (
                <button
                  key={c}
                  className={`${styles.colorBtn} ${activeClass}`}
                  onClick={() => setColor(c)}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.label}>Voltage Control</span>
            <span style={{ color: '#4299e1', fontWeight: 'bold' }}>{(voltage * 5).toFixed(1)}V</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={voltage}
            onChange={(e) => setVoltage(parseFloat(e.target.value))}
            className={styles.slider}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#718096' }}>
            <span>0V (Fully Twisted)</span>
            <span>5V (Fully Straight)</span>
          </div>
        </div>

        <div className={styles.explanation}>
          <strong>How it works:</strong> {lcdStateDesc}
        </div>
      </div>

      <div className={styles.right}>
        <canvas ref={canvasRef} width={480} height={320} className={styles.canvas} />
        <div className={styles.subpixelPreview}>
          <div
            className={styles.colorIndicator}
            style={{
              backgroundColor: finalColorStyle,
              boxShadow: `0 0 16px ${finalColorStyle}`,
            }}
          />
          <span className={styles.previewText}>
            Subpixel State: {Math.round(intensity * 100)}% Brightness ({color})
          </span>
        </div>
      </div>
    </div>
  );
}
