import React, { useEffect, useRef, useState, useCallback } from 'react';
import { wheelAudio } from './wheelAudio';

const STUDENT_PALETTE = [
  { bg: '#3B82F6', border: '#1D4ED8' },
  { bg: '#10B981', border: '#047857' },
  { bg: '#F59E0B', border: '#B45309' },
  { bg: '#8B5CF6', border: '#6D28D9' },
  { bg: '#EC4899', border: '#BE185D' },
  { bg: '#06B6D4', border: '#0E7490' },
  { bg: '#F97316', border: '#C2410C' },
  { bg: '#14B8A6', border: '#0F766E' },
  { bg: '#6366F1', border: '#4338CA' },
  { bg: '#84CC16', border: '#4D7C0F' },
];

const LOGICAL_SIZE = 480;

export default function StudentWheel({
  totalStudents = 26,
  usedStudents = [],
  onSpinEnd,
  isSpinning,
  setIsSpinning,
  spinDuration = 3800,
  soundEnabled = true,
  onStartNewRound,
}) {
  const canvasRef = useRef(null);
  const currentRotationRef = useRef(0);
  const animationFrameRef = useRef(null);
  const [pointerWobble, setPointerWobble] = useState(0);
  const lastPegIndexRef = useRef(-1);

  const studentsList = Array.from({ length: totalStudents }, (_, i) => i + 1);
  const availableStudents = studentsList.filter((roll) => !usedStudents.includes(roll));
  const isRoundComplete = availableStudents.length === 0 && totalStudents > 0;

  const numSegments = Math.max(totalStudents, 1);
  const arcSize = (2 * Math.PI) / numSegments;

  // Render the student wheel
  const drawWheel = useCallback(
    (rotation) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;

      // Reset transform and clear full canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set High-DPI logical scale
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const size = LOGICAL_SIZE;
      const center = size / 2;
      const radius = center - 24;

      // Outer glow and shadow
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius + 12, 0, 2 * Math.PI);
      ctx.fillStyle = '#0f172a';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      ctx.fill();
      ctx.restore();

      // Rim metallic gradient
      const rimGrad = ctx.createRadialGradient(
        center,
        center,
        radius,
        center,
        center,
        radius + 14
      );
      rimGrad.addColorStop(0, '#334155');
      rimGrad.addColorStop(0.5, '#94a3b8');
      rimGrad.addColorStop(1, '#0f172a');

      ctx.beginPath();
      ctx.arc(center, center, radius + 10, 0, 2 * Math.PI);
      ctx.lineWidth = 14;
      ctx.strokeStyle = rimGrad;
      ctx.stroke();

      // Draw all segments
      for (let i = 0; i < totalStudents; i++) {
        const rollNum = i + 1;
        const isUsed = usedStudents.includes(rollNum);
        const palette = STUDENT_PALETTE[i % STUDENT_PALETTE.length];
        const startAngle = rotation + i * arcSize;
        const endAngle = startAngle + arcSize;

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();

        if (isUsed) {
          // Dimmed / Grayed out for used students
          ctx.fillStyle = i % 2 === 0 ? '#334155' : '#1e293b';
        } else {
          // Vibrant slice for active available students
          const sliceGrad = ctx.createRadialGradient(
            center,
            center,
            radius * 0.2,
            center,
            center,
            radius
          );
          sliceGrad.addColorStop(0, '#ffffff');
          sliceGrad.addColorStop(0.25, palette.bg);
          sliceGrad.addColorStop(1, palette.border);
          ctx.fillStyle = sliceGrad;
        }

        ctx.fill();

        // Borders between slices
        ctx.strokeStyle = isUsed ? '#475569' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Render Roll Number Text inside slice
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + arcSize / 2);

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        // Font scaling for roll number wheel
        let fontSize = totalStudents > 35 ? 13 : totalStudents > 25 ? 15 : totalStudents > 15 ? 18 : 22;
        ctx.font = `bold ${fontSize}px "Space Grotesk", "Inter", sans-serif`;

        if (isUsed) {
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(`✓ ${rollNum}`, radius - 14, 0);
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 4;
          ctx.fillText(`${rollNum}`, radius - 16, 0);
        }

        ctx.restore();
      }

      // Outer chrome pegs
      for (let i = 0; i < totalStudents; i++) {
        const pegAngle = rotation + i * arcSize;
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
      hubGrad.addColorStop(0, '#3b82f6');
      hubGrad.addColorStop(0.7, '#1d4ed8');
      hubGrad.addColorStop(1, '#1e3a8a');

      ctx.beginPath();
      ctx.arc(center, center, 34, 0, 2 * Math.PI);
      ctx.fillStyle = hubGrad;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Center Student Icon
      ctx.font = '22px "Segoe UI Emoji", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👨‍🎓', center, center);
      ctx.restore();
    },
    [totalStudents, usedStudents, arcSize]
  );

  // Setup canvas resolution and initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = LOGICAL_SIZE * dpr;
      canvas.height = LOGICAL_SIZE * dpr;
      drawWheel(currentRotationRef.current);
    };

    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    return () => window.removeEventListener('resize', updateCanvasDimensions);
  }, [drawWheel]);

  // Spin trigger function
  const spin = useCallback(
    (targetRoll = null) => {
      if (isSpinning || totalStudents === 0 || availableStudents.length === 0) return;

      setIsSpinning(true);
      if (soundEnabled) {
        wheelAudio.playSpinStart();
      }

      // Strictly select an AVAILABLE student who hasn't had a turn yet
      const chosenRoll =
        targetRoll !== null && !usedStudents.includes(targetRoll)
          ? targetRoll
          : availableStudents[Math.floor(Math.random() * availableStudents.length)];

      const chosenIndex = chosenRoll - 1; // 0-indexed segment

      // Math for pointer landing at top (12 o'clock = 3*PI/2)
      const topPointer = (3 * Math.PI) / 2;
      const chosenCenter = chosenIndex * arcSize + arcSize / 2;
      const jitter = (Math.random() - 0.5) * (arcSize * 0.65);

      const fullRotations = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;

      const startAngle = currentRotationRef.current % (2 * Math.PI);
      let targetAngle = topPointer - chosenCenter + jitter;
      while (targetAngle < startAngle + fullRotations) {
        targetAngle += 2 * Math.PI;
      }

      const totalRotationDelta = targetAngle - startAngle;
      const startTime = performance.now();
      lastPegIndexRef.current = -1;

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        const easedProgress = easeOutQuart(progress);

        const currentAngle = startAngle + totalRotationDelta * easedProgress;
        currentRotationRef.current = currentAngle;
        drawWheel(currentAngle);

        // Sound and peg calculation
        const normalizedAngle =
          ((topPointer - currentAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const currentPeg = Math.floor(normalizedAngle / arcSize);

        if (currentPeg !== lastPegIndexRef.current) {
          lastPegIndexRef.current = currentPeg;
          if (soundEnabled) {
            wheelAudio.playTick();
          }
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
            wheelAudio.playStudentFanfare();
          }

          if (onSpinEnd) {
            onSpinEnd(chosenRoll);
          }
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [isSpinning, totalStudents, availableStudents, usedStudents, arcSize, drawWheel, setIsSpinning, spinDuration, soundEnabled, onSpinEnd]
  );

  // Cleanup on unmount
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
        width: '100%',
        userSelect: 'none',
      }}
    >
      {/* Wheel and Pointer Anchor Wrapper */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: `${LOGICAL_SIZE}px`,
        }}
      >
        {/* Top Pointer */}
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
            transform: `translateX(-50%) rotate(${pointerWobble}deg)`,
            transformOrigin: '50% 0px',
            transition: 'transform 50ms ease-out',
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '18px solid transparent',
              borderRight: '18px solid transparent',
              borderTop: '36px solid #3B82F6',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))',
            }}
          />
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#FDE047',
              border: '2px solid #1D4ED8',
              marginTop: '-38px',
            }}
          />
        </div>

        {/* Canvas Wheel Element Container */}
        <div
          style={{
            padding: '12px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.8) 100%)',
            boxShadow: '0 20px 35px -8px rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            aspectRatio: '1 / 1',
            boxSizing: 'border-box',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              aspectRatio: '1 / 1',
            }}
          />
        </div>
      </div>

      {/* Spin or Start New Round Button */}
      {isRoundComplete ? (
        <button
          onClick={onStartNewRound}
          style={{
            marginTop: '20px',
            padding: '16px 36px',
            fontSize: '1.25rem',
            fontWeight: '800',
            fontFamily: 'var(--font-display, sans-serif)',
            color: '#ffffff',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            boxShadow: '0 10px 25px -4px rgba(16, 185, 129, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'pulse 1.8s infinite',
          }}
        >
          <span>🔄</span>
          START NEW ROUND
        </button>
      ) : (
        <button
          onClick={() => spin()}
          disabled={isSpinning || totalStudents === 0}
          style={{
            marginTop: '20px',
            padding: '16px 36px',
            fontSize: '1.25rem',
            fontWeight: '800',
            fontFamily: 'var(--font-display, sans-serif)',
            color: '#ffffff',
            background: isSpinning
              ? 'linear-gradient(135deg, #64748b, #475569)'
              : 'linear-gradient(135deg, #3B82F6, #06B6D4)',
            border: 'none',
            borderRadius: '16px',
            cursor: isSpinning || totalStudents === 0 ? 'not-allowed' : 'pointer',
            boxShadow: isSpinning
              ? 'none'
              : '0 10px 25px -4px rgba(59, 130, 246, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.1)',
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
          <span style={{ fontSize: '1.4rem' }}>🎲</span>
          {isSpinning ? 'SPINNING STUDENT...' : 'SPIN STUDENT'}
        </button>
      )}
    </div>
  );
}
