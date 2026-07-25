import { useState, useRef, useEffect } from 'react';
import styles from './PixelSim.module.css';

// Draw a beautiful original image: retrowave sunset cat
function drawOriginalImage(ctx, w, h) {
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, '#1a0033'); // Deep space violet
  skyGrad.addColorStop(0.35, '#800080'); // Purple
  skyGrad.addColorStop(0.65, '#ff007f'); // Neon pink
  skyGrad.addColorStop(0.85, '#ff5e00'); // Vivid orange
  skyGrad.addColorStop(1, '#ffc800'); // Golden yellow
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Draw starry grid sky
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  const stars = [
    {x: 25, y: 30}, {x: 75, y: 20}, {x: 130, y: 40}, {x: 180, y: 15},
    {x: 235, y: 35}, {x: 275, y: 25}, {x: 55, y: 70}, {x: 260, y: 65},
    {x: 100, y: 80}, {x: 210, y: 85}
  ];
  stars.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.2, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Neon Grid on the bottom sky boundary
  ctx.strokeStyle = 'rgba(0, 255, 240, 0.15)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 15) {
    ctx.beginPath();
    ctx.moveTo(x, h - 45);
    ctx.lineTo(x + (x - w/2) * 0.4, h);
    ctx.stroke();
  }
  for (let y = h - 45; y <= h; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Draw synthwave sun (stripes near bottom)
  const sunX = w / 2;
  const sunY = h / 2 + 10;
  const sunRadius = 40;
  ctx.save();
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, 2 * Math.PI);
  ctx.clip();

  const sunGrad = ctx.createLinearGradient(sunX, sunY - sunRadius, sunX, sunY + sunRadius);
  sunGrad.addColorStop(0, '#ffff00');
  sunGrad.addColorStop(1, '#ff0055');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(sunX - sunRadius, sunY - sunRadius, sunRadius * 2, sunRadius * 2);

  // Draw horizontal slice cutouts for retrowave sun look
  ctx.fillStyle = '#1a0033';
  for (let y = sunY - sunRadius; y < sunY + sunRadius; y += 6) {
    const sliceHeight = Math.max(1, (y - (sunY - sunRadius)) / 15);
    ctx.fillRect(sunX - sunRadius - 10, y, sunRadius * 2 + 20, sliceHeight);
  }
  ctx.restore();

  // Mountain Silhouette
  ctx.fillStyle = '#0f001f';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(40, h - 55);
  ctx.lineTo(90, h - 35);
  ctx.lineTo(140, h - 65);
  ctx.lineTo(200, h - 40);
  ctx.lineTo(250, h - 60);
  ctx.lineTo(w, h - 45);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Ridge in front
  ctx.fillStyle = '#05000c';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(100, h - 35);
  ctx.lineTo(160, h - 38);
  ctx.lineTo(w, h - 25);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Draw two neon green palm trees on the ridges to provide pure green pixels
  const drawPalm = (px, py, pheight) => {
    ctx.save();
    // Trunk
    ctx.strokeStyle = '#00ff66';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(px - 3, py - pheight * 0.4, px - 6, py - pheight);
    ctx.stroke();
    // Leaves
    ctx.fillStyle = '#00ff66';
    ctx.strokeStyle = '#00ff66';
    ctx.lineWidth = 1.8;
    for (let i = 0; i < 5; i++) {
      const angle = -Math.PI / 2 + (i - 2) * 0.45;
      const leafX = px - 6 + Math.cos(angle) * 14;
      const leafY = py - pheight + Math.sin(angle) * 10;
      ctx.beginPath();
      ctx.moveTo(px - 6, py - pheight);
      ctx.quadraticCurveTo(px - 6 + Math.cos(angle) * 6, py - pheight + Math.sin(angle) * 12 - 3, leafX, leafY);
      ctx.stroke();
    }
    ctx.restore();
  };

  drawPalm(45, h - 50, 24);
  drawPalm(245, h - 55, 20);

  // Cute silhouette of a cat sitting looking at the sun
  const catX = w / 2 - 15;
  const catY = h - 42;

  ctx.fillStyle = '#000000';
  // Body
  ctx.beginPath();
  ctx.ellipse(catX, catY, 8, 13, 0.08, 0, 2 * Math.PI);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(catX, catY - 14, 5.5, 0, 2 * Math.PI);
  ctx.fill();

  // Ears
  ctx.beginPath();
  ctx.moveTo(catX - 5, catY - 16);
  ctx.lineTo(catX - 6.5, catY - 22);
  ctx.lineTo(catX - 1, catY - 18);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(catX + 1, catY - 18);
  ctx.lineTo(catX + 6.5, catY - 22);
  ctx.lineTo(catX + 5, catY - 16);
  ctx.fill();

  // Tail
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(catX + 5, catY + 6);
  ctx.quadraticCurveTo(catX + 14, catY + 9, catX + 11, catY - 2);
  ctx.stroke();
}

export default function PixelSim() {
  const [zoom, setZoom] = useState(12); // 1x to 40x
  const [pos, setPos] = useState({ x: 150, y: 150 });
  const [hoverColor, setHoverColor] = useState({ r: 255, g: 0, b: 127 });

  const srcCanvasRef = useRef(null);
  const zoomCanvasRef = useRef(null);

  // Initialize and draw the original image once on mount
  useEffect(() => {
    const canvas = srcCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    drawOriginalImage(ctx, canvas.width, canvas.height);
    
    // Set initial color at start pos
    const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
    setHoverColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
  }, []);

  // Update hover position and read color channel data
  const handlePointerMove = (e) => {
    const canvas = srcCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    // Scale coordinates in case canvas CSS size differs from internal dimensions
    const x = Math.max(0, Math.min(canvas.width - 1, Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width)));
    const y = Math.max(0, Math.min(canvas.height - 1, Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height)));
    
    setPos({ x, y });

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    setHoverColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
  };

  // Render the Zoom Lens Canvas
  useEffect(() => {
    const srcCanvas = srcCanvasRef.current;
    const zoomCanvas = zoomCanvasRef.current;
    if (!srcCanvas || !zoomCanvas) return;
    
    const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true });
    const zoomCtx = zoomCanvas.getContext('2d');
    
    const zw = zoomCanvas.width;
    const zh = zoomCanvas.height;
    
    zoomCtx.fillStyle = '#000';
    zoomCtx.fillRect(0, 0, zw, zh);

    // Number of source pixels we want to display along one axis
    // At zoom = 1, show full image. At zoom = 40, show a small window of 7.5x7.5 pixels.
    const size = Math.max(2, Math.round(srcCanvas.width / zoom));
    
    // Corner coordinate of the source window, centered at pointer
    let srcX = Math.round(pos.x - size / 2);
    let srcY = Math.round(pos.y - size / 2);
    
    // Keep window within boundaries
    srcX = Math.max(0, Math.min(srcCanvas.width - size, srcX));
    srcY = Math.max(0, Math.min(srcCanvas.height - size, srcY));

    // Get the pixel data from the source image
    const imgData = srcCtx.getImageData(srcX, srcY, size, size);
    
    if (zoom < 5) {
      // Low Zoom: Just standard scale up with smoothing
      zoomCtx.imageSmoothingEnabled = false;
      zoomCtx.drawImage(
        srcCanvas,
        srcX, srcY, size, size,
        0, 0, zw, zh
      );
    } 
    else {
      // High Zoom: Render custom pixel grid and subpixel matrices
      const pixelW = zw / size;
      const pixelH = zh / size;
      const showSubpixels = zoom >= 15;

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const idx = (r * size + c) * 4;
          const rVal = imgData.data[idx];
          const gVal = imgData.data[idx + 1];
          const bVal = imgData.data[idx + 2];
          
          const px = c * pixelW;
          const py = r * pixelH;

          if (showSubpixels) {
            // Render RGB stripes
            const subW = pixelW / 3;

            // Red Subpixel
            zoomCtx.fillStyle = `rgb(${rVal}, 0, 0)`;
            zoomCtx.fillRect(px, py, subW - 1, pixelH - 1);
            
            // Green Subpixel
            zoomCtx.fillStyle = `rgb(0, ${gVal}, 0)`;
            zoomCtx.fillRect(px + subW, py, subW - 1, pixelH - 1);
            
            // Blue Subpixel
            zoomCtx.fillStyle = `rgb(0, 0, ${bVal})`;
            zoomCtx.fillRect(px + subW * 2, py, subW - 1, pixelH - 1);

            // Draw a subtle border around the subpixels
            zoomCtx.strokeStyle = 'rgba(0,0,0,0.5)';
            zoomCtx.lineWidth = 1;
            zoomCtx.strokeRect(px, py, pixelW, pixelH);
          } else {
            // Render solid blended color
            zoomCtx.fillStyle = `rgb(${rVal}, ${gVal}, ${bVal})`;
            zoomCtx.fillRect(px, py, pixelW - 1, pixelH - 1);

            // Draw a subtle white/gray pixel boundary grid
            zoomCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            zoomCtx.strokeRect(px, py, pixelW, pixelH);
          }

          // Highlight the center pixel corresponding exactly to the cursor coordinate
          const globalX = srcX + c;
          const globalY = srcY + r;
          if (globalX === pos.x && globalY === pos.y) {
            zoomCtx.strokeStyle = '#ffffff';
            zoomCtx.lineWidth = 2.5;
            zoomCtx.strokeRect(px, py, pixelW, pixelH);
          }
        }
      }
    }
  }, [pos, zoom]);

  // Convert color channels to hexadecimal helper
  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div>
          <h2 className={styles.panelTitle}>Pixel Grid Zoom Simulator</h2>
          <p className={styles.subTitle}>
            Hover over the image and adjust the zoom slider to see how R, G, and B subpixels form complete colors.
          </p>
        </div>

        <div className={styles.zoomSliderGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.label}>Zoom Magnification</span>
            <span style={{ color: '#38a169', fontWeight: 'bold' }}>{zoom}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            step="1"
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            className={styles.slider}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#718096' }}>
            <span>1x (Full Image)</span>
            <span>15x (Solid Pixels)</span>
            <span>40x (RGB Subpixels)</span>
          </div>
        </div>

        <div className={styles.explanation}>
          <strong>How details merge:</strong> 
          {zoom < 15 ? (
            ' When viewed from a distance, or at low zoom, the individual light points blur in our eyes, blending the distinct Red, Green, and Blue rays together to form continuous color gradients.'
          ) : (
            ' Zoomed in to the subpixel level, you can see that there is no pink, yellow, or white light! There are only Red, Green, and Blue columns glowing at different intensities. Your brain blends these adjacent stripes into a single solid color.'
          )}
        </div>

        <div className={styles.infoPanel}>
          <span className={styles.label}>Selected Pixel Details</span>
          <div className={styles.colorPreviewRow}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: `rgb(${hoverColor.r}, ${hoverColor.g}, ${hoverColor.b})` }}
            />
            <div className={styles.colorValues}>
              <span className={styles.rgbText}>RGB({hoverColor.r}, {hoverColor.g}, {hoverColor.b})</span>
              <span className={styles.hexText}>{rgbToHex(hoverColor.r, hoverColor.g, hoverColor.b)}</span>
            </div>
          </div>

          <div className={styles.subpixelBreakdown}>
            {/* Red Subpixel Info */}
            <div className={styles.subpixelBar}>
              <span className={styles.barLabel} style={{ color: '#ff4d4d' }}>R (Red)</span>
              <div className={styles.barContainer}>
                <div
                  className={styles.barFill}
                  style={{
                    height: `${(hoverColor.r / 255) * 100}%`,
                    backgroundColor: '#ff4d4d',
                    boxShadow: '0 0 8px rgba(255, 77, 77, 0.6)'
                  }}
                />
              </div>
              <span className={styles.barValue}>{hoverColor.r}</span>
            </div>

            {/* Green Subpixel Info */}
            <div className={styles.subpixelBar}>
              <span className={styles.barLabel} style={{ color: '#4dff4d' }}>G (Green)</span>
              <div className={styles.barContainer}>
                <div
                  className={styles.barFill}
                  style={{
                    height: `${(hoverColor.g / 255) * 100}%`,
                    backgroundColor: '#4dff4d',
                    boxShadow: '0 0 8px rgba(77, 255, 77, 0.6)'
                  }}
                />
              </div>
              <span className={styles.barValue}>{hoverColor.g}</span>
            </div>

            {/* Blue Subpixel Info */}
            <div className={styles.subpixelBar}>
              <span className={styles.barLabel} style={{ color: '#4d4dff' }}>B (Blue)</span>
              <div className={styles.barContainer}>
                <div
                  className={styles.barFill}
                  style={{
                    height: `${(hoverColor.b / 255) * 100}%`,
                    backgroundColor: '#4d4dff',
                    boxShadow: '0 0 8px rgba(77, 77, 255, 0.6)'
                  }}
                />
              </div>
              <span className={styles.barValue}>{hoverColor.b}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div
          className={styles.canvasWrapper}
          onMouseMove={handlePointerMove}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              handlePointerMove(e.touches[0]);
            }
          }}
        >
          <canvas ref={srcCanvasRef} width={300} height={300} className={styles.canvas} />
        </div>
        <div style={{ margin: '14px 0 10px 0', fontSize: '0.8rem', color: '#718096' }}>
          🔍 Loupe View (Magnified Area)
        </div>
        <canvas ref={zoomCanvasRef} width={300} height={300} style={{ borderRadius: '8px', border: '2px solid rgba(255,255,255,0.08)' }} />
      </div>
    </div>
  );
}
