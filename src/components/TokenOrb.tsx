import React, { useEffect, useRef } from 'react';

interface Ring {
  r: number;
  speed: number;
  color: string;
  dash: number[];
  width: number;
}

interface Particle {
  ring: Ring;
  angle: number;
  speed: number;
  color: string;
}

const TOK_RINGS: Ring[] = [
  { r: 130, speed: 0.006, color: '#00ff88', dash: [4, 8], width: 1.5 },
  { r: 110, speed: -0.01, color: 'rgba(0, 255, 136, 0.4)', dash: [], width: 1 },
  { r: 90, speed: 0.015, color: 'rgba(0, 238, 255, 0.4)', dash: [2, 10], width: 1 },
  { r: 150, speed: -0.004, color: 'rgba(255, 26, 74, 0.35)', dash: [8, 14], width: 1 },
  { r: 170, speed: 0.003, color: 'rgba(0, 255, 136, 0.15)', dash: [], width: 0.5 },
];

export default function TokenOrb() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || 440);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 440);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth || 440;
        height = canvas.height = canvas.parentElement.offsetHeight || 440;
      }
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = Array.from({ length: 28 }, (_, i) => {
      const ring = TOK_RINGS[i % TOK_RINGS.length];
      return {
        ring,
        angle: Math.random() * Math.PI * 2,
        speed: (0.003 + Math.random() * 0.006) * (Math.random() < 0.5 ? 1 : -1),
        color: ring.color,
      };
    });

    let tt = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      tt += 0.01;

      const cx = width / 2;
      const cy = height / 2;

      // 1. Outer nebula glow (Replaced radial gradient redraws with layered concentric circles)
      const pulseScale = Math.sin(tt) * 6;
      
      ctx.fillStyle = '#00ff88';
      ctx.globalAlpha = 0.02;
      ctx.beginPath();
      ctx.arc(cx, cy, 180 + pulseScale, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00ff88';
      ctx.globalAlpha = 0.04;
      ctx.beginPath();
      ctx.arc(cx, cy, 130 + pulseScale * 0.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00eeff';
      ctx.globalAlpha = 0.05;
      ctx.beginPath();
      ctx.arc(cx, cy, 90 + pulseScale * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Rings (Optimized: avoiding heavy context saves/restores)
      TOK_RINGS.forEach((ring) => {
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.width;
        
        if (ring.dash.length > 0) {
          ctx.setLineDash(ring.dash);
        } else {
          ctx.setLineDash([]);
        }
        
        ctx.globalAlpha = 0.7;
        ctx.stroke();
      });
      ctx.setLineDash([]); // Reset line dash

      // 3. Orbiting Particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.ring.r;
        const py = cy + Math.sin(p.angle) * p.ring.r;

        // Fading satellite dot
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Central Coin Ring & Core Glow
      const coinPulse = Math.sin(tt) * 5;
      const coinRadius = 58 + coinPulse * 0.3;

      // Outer golden-green neon aura
      ctx.fillStyle = '#00ff88';
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      ctx.arc(cx, cy, coinRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Coin base fill
      ctx.fillStyle = 'rgba(0, 10, 6, 0.92)';
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.arc(cx, cy, coinRadius, 0, Math.PI * 2);
      ctx.fill();

      // Coin glowing border line
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 1.8;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(cx, cy, coinRadius, 0, Math.PI * 2);
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[0] block"
    />
  );
}
