import { useEffect, useRef } from 'react';

export default function ConfettiEffect({ trigger, count = 120, duration = 3000 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      '#FF5964',
      '#FFD166',
      '#06D6A0',
      '#118AB2',
      '#073B4C',
      '#AA3BFF',
      '#FF6B4A',
      '#3DDC97',
      '#FFBF00',
      '#38BDF8',
    ];

    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 200,
        y: height * 0.4 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 22,
        vy: Math.random() * -18 - 6,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        wobble: Math.random() * 10,
        alpha: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
      });
    }

    let animationId;
    const startTime = performance.now();

    const render = (time) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // gravity
        p.vx *= 0.985; // friction
        p.rotation += p.rSpeed;

        if (elapsed > duration * 0.6) {
          p.alpha = Math.max(0, 1 - (elapsed - duration * 0.6) / (duration * 0.4));
        }

        if (p.alpha > 0 && p.y < height + 40) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (alive && elapsed < duration) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [trigger, count, duration]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
