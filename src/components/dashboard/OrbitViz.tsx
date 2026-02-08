import { useEffect, useRef } from 'react';

export const OrbitViz = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Array<{
      angle: number;
      radius: number;
      speed: number;
      size: number;
      color: string;
    }> = [];

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Initialize random asteroids
    for (let i = 0; i < 50; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 50 + Math.random() * 100,
        speed: (0.002 + Math.random() * 0.005) * (Math.random() < 0.5 ? 1 : -1),
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.8 ? '#22d3ee' : '#ffffff'
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Sun
      ctx.shadowBlur = 40;
      ctx.shadowColor = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Earth Orbit
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 100, 0, Math.PI * 2);
      ctx.stroke();

      // Earth
      const earthAngle = Date.now() * 0.0005;
      const ex = cx + Math.cos(earthAngle) * 100;
      const ey = cy + Math.sin(earthAngle) * 100;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#3b82f6';
      ctx.beginPath();
      ctx.arc(ex, ey, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Asteroids
      particles.forEach(p => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * p.radius;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
