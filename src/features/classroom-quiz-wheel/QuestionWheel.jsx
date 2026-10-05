import React, { useEffect, useRef, useState, useCallback } from 'react';
import { wheelAudio } from './wheelAudio';

const VIBRANT_PALETTE = [
  { bg: '#3B82F6', text: '#FFFFFF', border: '#2563EB' }, // Blue
  { bg: '#10B981', text: '#FFFFFF', border: '#059669' }, // Emerald
  { bg: '#F59E0B', text: '#1F2937', border: '#D97706' }, // Amber
  { bg: '#EC4899', text: '#FFFFFF', border: '#DB2777' }, // Pink
  { bg: '#8B5CF6', text: '#FFFFFF', border: '#7C3AED' }, // Purple
  { bg: '#06B6D4', text: '#1F2937', border: '#0891B2' }, // Cyan
  { bg: '#F97316', text: '#FFFFFF', border: '#EA580C' }, // Orange
  { bg: '#14B8A6', text: '#FFFFFF', border: '#0D9488' }, // Teal
  { bg: '#6366F1', text: '#FFFFFF', border: '#4F46E5' }, // Indigo
  { bg: '#EF4444', text: '#FFFFFF', border: '#DC2626' }, // Rose
  { bg: '#84CC16', text: '#1F2937', border: '#65A30D' }, // Lime
  { bg: '#A855F7', text: '#FFFFFF', border: '#9333EA' }, // Violet
];

// Word wrap helper for canvas
function wrapText(ctx, text, maxWidth, maxLines = 3) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  lines.push(currentLine);
  return lines;
}

export default function QuestionWheel({
  questions = [],
  onSpinEnd,
  isSpinning,
  setIsSpinning,
  spinDuration = 3800,
  soundEnabled = true,
}) {
  const canvasRef = useRef(null);
  const currentRotationRef = useRef(0);
  const animationFrameRef = useRef(null);
  const [pointerWobble, setPointerWobble] = useState(0);
  const lastPegIndexRef = useRef(-1);

  const numSegments = Math.max(questions.length, 1);
  const arcSize = (2 * Math.PI) / numSegments;

  // Render the wheel onto the canvas
  const drawWheel = useCallback(
    (rotation) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const size = canvas.width;
      const center = size / 2;
      const radius = center - 24;

      ctx.clearRect(0, 0, size, size);

      // Outer glow and rim shadow
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius + 12, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e293b';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      ctx.fill();
      ctx.restore();

      // Outer decorative metallic ring
      const rimGrad = ctx.createRadialGradient(
        center,
        center,
        radius,
        center,
        center,
        radius + 14
      );
      rimGrad.addColorStop(0, '#475569');
      rimGrad.addColorStop(0.5, '#cbd5e1');
      rimGrad.addColorStop(1, '#1e293b');

      ctx.beginPath();
      ctx.arc(center, center, radius + 10, 0, 2 * Math.PI);
      ctx.lineWidth = 14;
      ctx.strokeStyle = rimGrad;
      ctx.stroke();

      // Draw segments
      for (let i = 0; i < numSegments; i++) {
        const item = questions[i] || { text: `Q${i + 1}`, shortText: `Question ${i + 1}` };
        const color = VIBRANT_PALETTE[i % VIBRANT_PALETTE.length];
        const startAngle = rotation + i * arcSize;
        const endAngle = startAngle + arcSize;

        // Slice path
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();

        // Gradient slice fill for 3D look
        const sliceGrad = ctx.createRadialGradient(
          center,
          center,
          radius * 0.15,
          center,
          center,
          radius
        );
        sliceGrad.addColorStop(0, '#ffffff');
        sliceGrad.addColorStop(0.2, color.bg);
        sliceGrad.addColorStop(1, color.border);

        ctx.fillStyle = sliceGrad;
        ctx.fill();

        // Slice borders
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Inner shadow on slice edge
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Render Text inside slice
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + arcSize / 2);

        ctx.fillStyle = color.text;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        // Question Number tag
        ctx.font = 'bold 12px "Space Grotesk", system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(`Q${i + 1}`, radius - 14, -14);

        // Multi-line Question Text
        const textToDraw = item.shortText || item.text;
        const maxTextWidth = radius * 0.58;
        
        // Dynamic font size depending on slice count
        let fontSize = numSegments > 14 ? 12 : numSegments > 8 ? 13 : 15;
        ctx.font = `600 ${fontSize}px "Inter", system-ui, sans-serif`;
        ctx.fillStyle = color.text;

        const lines = wrapText(ctx, textToDraw, maxTextWidth, 3);
        const lineHeight = fontSize * 1.25;
        const totalHeight = lines.length * lineHeight;
        const startY = -(totalHeight / 2) + 8;

        lines.forEach((line, lineIdx) => {
          ctx.fillText(line, radius - 14, startY + lineIdx * lineHeight);
        });

        ctx.restore();
      }

      // Outer gold/silver studs around the rim
      for (let i = 0; i < numSegments * 2; i++) {
        const pegAngle = rotation + (i * arcSize) / 2;
        const pegX = center + (radius + 4) * Math.cos(pegAngle);
        const pegY = center + (radius + 4) * Math.sin(pegAngle);

        ctx.beginPath();
        ctx.arc(pegX, pegY, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 3;
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Center Hub Cap
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, 42, 0, 2 * Math.PI);
      ctx.fillStyle = '#0f172a';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 10;
      ctx.fill();

      // Inner Hub Ring
      const hubGrad = ctx.createRadialGradient(center, center, 5, center, center, 36);
      hubGrad.addColorStop(0, '#f43f5e');
      hubGrad.addColorStop(0.7, '#be123c');
      hubGrad.addColorStop(1, '#881337');

      ctx.beginPath();
      ctx.arc(center, center, 34, 0, 2 * Math.PI);
      ctx.fillStyle = hubGrad;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Center Icon
      ctx.font = '22px "Segoe UI Emoji", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎯', center, center);
      ctx.restore();
    },
    [questions, numSegments, arcSize]
  );

  // Setup canvas resolution and initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const displaySize = 480;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    canvas.style.width = '100%';
    canvas.style.maxWidth = `${displaySize}px`;
    canvas.style.height = 'auto';
    canvas.style.aspectRatio = '1 / 1';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    drawWheel(currentRotationRef.current);
  }, [drawWheel]);

  // Spin trigger function
  const spin = useCallback(
    (targetIndex = null) => {
      if (isSpinning || questions.length === 0) return;

      setIsSpinning(true);
      if (soundEnabled) {
        wheelAudio.playSpinStart();
      }

      // Choose random winner index if not explicitly specified
      const chosenIndex =
        targetIndex !== null
          ? targetIndex
          : Math.floor(Math.random() * questions.length);

      // Math for pointer landing at top (12 o'clock = 3*PI/2 = -PI/2)
      const topPointer = (3 * Math.PI) / 2;
      const chosenCenter = chosenIndex * arcSize + arcSize / 2;

      // Small jitter so it doesn't always land at dead center of segment
      const jitter = (Math.random() - 0.5) * (arcSize * 0.65);

      // Add 5 to 8 full spins
      const fullRotations = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;

      // Calculate start and final angles
      const startAngle = currentRotationRef.current % (2 * Math.PI);
      let targetAngle = topPointer - chosenCenter + jitter;
      while (targetAngle < startAngle + fullRotations) {
        targetAngle += 2 * Math.PI;
      }

      const totalRotationDelta = targetAngle - startAngle;
      const startTime = performance.now();
      lastPegIndexRef.current = -1;

      // Easing function: Quartic ease-out (fast start, gradual dramatic slowdown)
      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        const easedProgress = easeOutQuart(progress);

        const currentAngle = startAngle + totalRotationDelta * easedProgress;
        currentRotationRef.current = currentAngle;
        drawWheel(currentAngle);

        // Sound and peg wobble calculation
        const normalizedAngle =
          ((topPointer - currentAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const currentPeg = Math.floor(normalizedAngle / (arcSize / 2));

        if (currentPeg !== lastPegIndexRef.current) {
          lastPegIndexRef.current = currentPeg;
          if (soundEnabled) {
            wheelAudio.playTick();
          }
          // Pointer wiggles back and forth
          setPointerWobble(progress < 0.8 ? (currentPeg % 2 === 0 ? 14 : -14) : (currentPeg % 2 === 0 ? 6 : -6));
          setTimeout(() => setPointerWobble(0), 40);
        }

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          currentRotationRef.current = targetAngle;
          drawWheel(targetAngle);
          setIsSpinning(false);
          setPointerWobble(0);

          if (soundEnabled) {
            wheelAudio.playQuestionFanfare();
          }

          if (onSpinEnd) {
            onSpinEnd(questions[chosenIndex], chosenIndex);
          }
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [isSpinning, questions, arcSize, drawWheel, isSpinning, setIsSpinning, spinDuration, soundEnabled, onSpinEnd]
  );

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Top Pointer with Realistic Spring Needle */}
      <div
        style={{
          position: 'absolute',
          top: '-12px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
          transform: `rotate(${pointerWobble}deg)`,
          transformOrigin: 'top center',
          transition: 'transform 50ms ease-out',
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '18px solid transparent',
            borderRight: '18px solid transparent',
            borderTop: '36px solid #EF4444',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))',
          }}
        />
        <div
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#FDE047',
            border: '2px solid #B91C1C',
            marginTop: '-38px',
          }}
        />
      </div>

      {/* Canvas Wheel Element */}
      <div
        style={{
          padding: '12px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.8) 100%)',
          boxShadow: '0 20px 35px -8px rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <canvas ref={canvasRef} />
      </div>

      {/* Action Spin Button */}
      <button
        onClick={() => spin()}
        disabled={isSpinning || questions.length === 0}
        style={{
          marginTop: '20px',
          padding: '16px 36px',
          fontSize: '1.25rem',
          fontWeight: '800',
          fontFamily: 'var(--font-display, sans-serif)',
          color: '#ffffff',
          background: isSpinning
            ? 'linear-gradient(135deg, #64748b, #475569)'
            : 'linear-gradient(135deg, #EC4899, #8B5CF6)',
          border: 'none',
          borderRadius: '16px',
          cursor: isSpinning || questions.length === 0 ? 'not-allowed' : 'pointer',
          boxShadow: isSpinning
            ? 'none'
            : '0 10px 25px -4px rgba(236, 72, 153, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.1)',
          transform: isSpinning ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
        onMouseEnter={(e) => {
          if (!isSpinning) e.currentTarget.style.transform = 'scale(1.04)';
        }}
        onMouseLeave={(e) => {
          if (!isSpinning) e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <span style={{ fontSize: '1.4rem' }}>🎯</span>
        {isSpinning ? 'SPINNING QUESTION...' : 'SPIN QUESTION'}
      </button>
    </div>
  );
}
