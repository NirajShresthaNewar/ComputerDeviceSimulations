import { useState, useRef, useEffect } from 'react';
import styles from './LaserSim.module.css';

const STEPS = [
  {
    id: 'charge',
    label: '1. Charging the Drum',
    desc: 'The Primary Charge Roller (PCR) coats the photosensitive drum with a uniform negative electrostatic charge (represented by "-" charges).',
  },
  {
    id: 'expose',
    label: '2. Laser Exposure',
    desc: 'A laser beam scans the rotating drum. Where the light hits, it discharges the drum (neutralizing the negative charge) to form a latent electrostatic image of the character.',
  },
  {
    id: 'develop',
    label: '3. Developing (Toner)',
    desc: 'The developer roller holds negatively charged toner powder. The toner is repelled by the charged areas of the drum but clings to the discharged (neutralized) areas written by the laser.',
  },
  {
    id: 'transfer',
    label: '4. Toner Transfer',
    desc: 'A strongly positive transfer roller behind the paper pulls the negatively charged toner particles away from the drum, transferring the image onto the paper.',
  },
  {
    id: 'fuse',
    label: '5. Heat Fusing',
    desc: 'The paper passes through fuser rollers heated to 200°C. The heat and pressure melt the plastic toner particles, bonding them permanently into the fibers of the paper.',
  },
  {
    id: 'clean',
    label: '6. Cleaning & Erasing',
    desc: 'A rubber blade scrapes off any residual toner, and a discharge lamp clears any remaining electrostatic charge, preparing the drum for the next page.',
  },
];

export default function LaserSim() {
  const [activeStep, setActiveStep] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const render = () => {
      time += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#0f1016';
      ctx.fillRect(0, 0, w, h);

      // Core Coordinates
      const drumX = 200;
      const drumY = 140;
      const drumRadius = 52;
      const paperY = 193;

      // Draw Paper Path (Horizontal line moving left to right)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, paperY);
      ctx.lineTo(w - 20, paperY);
      ctx.stroke();

      // Draw Paper sheet sliding from left to right
      // Paper starts at left (x = 30) and slides right (x = 420)
      const paperX = 30 + ((time * 20) % 360);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(paperX, paperY - 1, 100, 2);

      // Draw 6 Stations
      
      // 1. Primary Charge Roller (PCR) - Top right of drum (approx 45 degrees)
      const pcrAngle = -Math.PI / 4;
      const pcrX = drumX + Math.cos(pcrAngle) * (drumRadius + 14);
      const pcrY = drumY + Math.sin(pcrAngle) * (drumRadius + 14);
      const pcrRadius = 14;

      ctx.fillStyle = activeStep === 0 ? '#3182ce' : '#2d3748';
      ctx.strokeStyle = '#4a5568';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pcrX, pcrY, pcrRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = '8px sans-serif';
      ctx.fillText('PCR', pcrX - 8, pcrY + 3);

      // 2. Laser Unit - Top left, fires green beam at drum (approx 135 degrees)
      const laserSourceX = 60;
      const laserSourceY = 60;
      const targetAngle = -3 * Math.PI / 4;
      const targetX = drumX + Math.cos(targetAngle) * drumRadius;
      const targetY = drumY + Math.sin(targetAngle) * drumRadius;

      // Laser Casing
      ctx.fillStyle = activeStep === 1 ? '#48bb78' : '#2d3748';
      ctx.fillRect(laserSourceX - 25, laserSourceY - 15, 30, 20);
      ctx.strokeStyle = '#4a5568';
      ctx.strokeRect(laserSourceX - 25, laserSourceY - 15, 30, 20);
      ctx.fillStyle = '#fff';
      ctx.fillText('LASER', laserSourceX - 20, laserSourceY - 3);

      // Laser Beam (Fires when Expose step is active)
      if (activeStep === 1) {
        ctx.strokeStyle = '#00ff66';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ff66';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(laserSourceX + 5, laserSourceY - 5);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
        
        // Impact glow
        ctx.fillStyle = '#00ff66';
        ctx.beginPath();
        ctx.arc(targetX, targetY, 3, 0, 2 * Math.PI);
        ctx.fill();
      }

      // 3. Developer Roller (Toner Hopper) - Left of drum (180 degrees)
      const devX = drumX - drumRadius - 20;
      const devY = drumY;
      const devRadius = 18;

      ctx.fillStyle = activeStep === 2 ? '#d69e2e' : '#2d3748';
      ctx.beginPath();
      ctx.arc(devX, devY, devRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.fillText('TONER', devX - 15, devY + 3);

      // Toner hopper box
      ctx.strokeStyle = '#4a5568';
      ctx.strokeRect(devX - 35, devY - 25, 20, 50);

      // Toner particles jumping onto drum (flying black dots)
      if (activeStep === 2) {
        ctx.fillStyle = '#a0aec0';
        for (let i = 0; i < 8; i++) {
          const px = devX + devRadius + Math.random() * 18;
          const py = devY - 10 + Math.random() * 20;
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // 4. Transfer Roller - Directly below paper (270 degrees)
      const transX = drumX;
      const transY = drumY + drumRadius + 22;
      const transRadius = 14;

      ctx.fillStyle = activeStep === 3 ? '#e53e3e' : '#2d3748';
      ctx.beginPath();
      ctx.arc(transX, transY, transRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.fillText('XFER', transX - 10, transY + 3);

      // Plus charges on transfer roller pulling negative toner
      if (activeStep === 3) {
        ctx.fillStyle = '#ecc94b';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('+', transX - 4, transY - 18);
      }

      // 5. Fuser Assembly - Right side on paper path
      const fuseX = 380;
      const fuseTopY = paperY - 18;
      const fuseBotY = paperY + 18;
      const fuseRadius = 15;

      // Draw Fuser Rollers
      // Top Roller (Heated)
      const isFusing = activeStep === 4;
      ctx.fillStyle = isFusing ? '#ff5a36' : '#2d3748'; // Glows orange-red when fusing
      if (isFusing) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ff5a36';
      }
      ctx.beginPath();
      ctx.arc(fuseX, fuseTopY, fuseRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Bottom Roller (Pressure)
      ctx.fillStyle = '#2d3748';
      ctx.beginPath();
      ctx.arc(fuseX, fuseBotY, fuseRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.fillText('FUSER', fuseX - 15, fuseTopY + 3);

      // Steam/Heat lines when fusing
      if (isFusing) {
        ctx.strokeStyle = 'rgba(255, 90, 54, 0.4)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 3; i++) {
          const sx = fuseX + 15 + i * 5;
          const sy = paperY - 10 + Math.sin(time * 5 + i) * 3;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + 3, sy - 8);
          ctx.stroke();
        }
      }

      // 6. Cleaning Blade - Right side of drum (0 degrees)
      const cleanX = drumX + drumRadius + 12;
      const cleanY = drumY;
      ctx.fillStyle = activeStep === 5 ? '#9b2c2c' : '#4a5568';
      ctx.fillRect(cleanX, cleanY - 10, 8, 20);
      ctx.fillStyle = '#fff';
      ctx.fillText('BLADE', cleanX - 30, cleanY + 3);

      // Discharge Erase Lamp (near blade)
      ctx.fillStyle = activeStep === 5 ? '#ecc94b' : '#2d3748';
      ctx.beginPath();
      ctx.arc(cleanX + 4, cleanY - 24, 4, 0, 2 * Math.PI);
      ctx.fill();

      // --- Draw OPC Drum in Center ---
      // Rotate drum counter-clockwise
      const drumAngle = -time * 0.4;
      ctx.save();
      ctx.translate(drumX, drumY);
      ctx.rotate(drumAngle);

      // Drum outer cylinder
      const drumGrad = ctx.createRadialGradient(-10, -10, 5, 0, 0, drumRadius);
      drumGrad.addColorStop(0, '#00b7c3');
      drumGrad.addColorStop(1, '#005a60'); // Photosensitive teal color coating
      ctx.fillStyle = drumGrad;
      ctx.beginPath();
      ctx.arc(0, 0, drumRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#008080';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw electrostatic charges and toner particles on the drum surface
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';

      const numCharges = 12;
      for (let i = 0; i < numCharges; i++) {
        const angle = (i * 2 * Math.PI) / numCharges;
        const cx = Math.cos(angle) * (drumRadius - 8);
        const cy = Math.sin(angle) * (drumRadius - 8);

        // Calculate global angle of this charge point to see which station it is currently passing
        const globalAngle = (angle + drumAngle) % (2 * Math.PI);
        const normAngle = globalAngle < 0 ? globalAngle + 2 * Math.PI : globalAngle;

        // Determine charge / toner state based on position and activeStep
        // PCR (approx 315° or 5.5 rad): charges drum negative
        // Laser (approx 225° or 3.9 rad): discharges drum (creates positive/neutral spots)
        // Developer (approx 180° or 3.1 rad): toner sticks to discharged areas
        // Transfer (approx 90° or 1.5 rad): toner leaves drum onto paper
        // Clean (approx 0° or 0 rad): blade scrapes toner, erase lamp neutralizes

        let displaySymbol = '-';
        let displayColor = 'rgba(255, 255, 255, 0.4)';
        let isToner = false;

        // If PCR step is active, draw charges on drum
        if (activeStep >= 0) {
          // Exclude spots discharged by laser (between laser at 3.9 rad and dev at 3.1 rad)
          if (activeStep >= 1 && normAngle > 3.2 && normAngle < 4.2) {
            displaySymbol = ''; // Discharged by laser (neutral)
          }
          // If developer step active, draw toner dots on discharged areas
          else if (activeStep >= 2 && normAngle > 1.6 && normAngle < 3.2) {
            displaySymbol = '●'; // Toner particles
            displayColor = '#1a202c';
            isToner = true;
          }
          // After transfer roller (90° or 1.5 rad), toner has been transferred to paper
          else if (normAngle > 0.1 && normAngle < 1.6) {
            displaySymbol = '-'; // residual charge, toner has been transferred
          }
        }

        if (displaySymbol) {
          ctx.fillStyle = displayColor;
          if (isToner) {
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
            ctx.fill();
            // outline
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          } else {
            ctx.fillText(displaySymbol, cx, cy + 3);
          }
        }
      }
      ctx.restore();

      // Central Hub
      ctx.fillStyle = '#2d3748';
      ctx.beginPath();
      ctx.arc(drumX, drumY, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw title of active station indicator
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('OPC DRUM ASSEMBLY', drumX - 58, drumY - 5);

      // Paper details (toner dust on paper vs fused letters)
      if (paperX > transX - 50 && paperX < w - 40) {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 9px monospace';
        
        // Before fuser (150-380): show loose toner dots forming 'L'
        if (paperX + 50 < fuseX) {
          ctx.fillStyle = '#2d3748';
          ctx.fillText('● ● ●', paperX + 30, paperY - 8);
          ctx.fillText('  ●', paperX + 30, paperY - 4);
        } 
        // After fuser (380+): show solid printed fused letter 'L'
        else {
          ctx.fillStyle = '#48bb78'; // Green printed character to show complete
          ctx.fillText('L A S E R', paperX + 20, paperY - 6);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeStep]);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div>
          <h2 className={styles.panelTitle}>Laser Printer Cycle</h2>
          <p className={styles.subTitle}>
            Step through the 6 electro-photographic stages to see how light and static electricity print pages.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {STEPS.map((step, idx) => (
            <button
              key={step.id}
              className={`${styles.stepRow} ${activeStep === idx ? styles.stepRowActive : ''}`}
              onClick={() => setActiveStep(idx)}
            >
              <span className={styles.stepNum}>{idx + 1}</span>
              <span className={styles.stepLabel}>{step.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.explanation}>
          <strong>Active Stage Mechanics:</strong> {STEPS[activeStep].desc}
        </div>
      </div>

      <div className={styles.right}>
        <canvas ref={canvasRef} width={480} height={320} className={styles.canvas} />
        <div className={styles.instruction}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Watch the rotating drum and paper path to visualize charges and fuser heating.
        </div>
      </div>
    </div>
  );
}
