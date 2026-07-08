import React, { useEffect, useRef } from 'react';

export default function BackgroundEffects() {
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let mx = -1000;
    let my = -1000;

    // Optimized Stars
    const starCount = 120;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random() * Math.PI * 2,
      spd: Math.random() * 0.015 + 0.005,
      color: Math.random() < 0.1 ? '#ff1a4a' : Math.random() < 0.15 ? '#00eeff' : '#00ff88',
    }));

    // Optimized Particles (energy drift)
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => createParticle(width, height));

    function createParticle(w: number, h: number, initAtCenter = false) {
      let x = 0, y = 0;
      if (initAtCenter) {
        x = w / 2 + (Math.random() - 0.5) * 100;
        y = h / 2 + (Math.random() - 0.5) * 100;
      } else {
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) { x = Math.random() * w; y = 0; }
        else if (edge === 1) { x = w; y = Math.random() * h; }
        else if (edge === 2) { x = Math.random() * w; y = h; }
        else { x = 0; y = Math.random() * h; }
      }

      const angle = Math.atan2(h / 2 - y, w / 2 - x) + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 1.2 + 0.4;
      
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.random() * 1.5 + 0.6,
        life: 1,
        decay: Math.random() * 0.004 + 0.0015,
        color: Math.random() < 0.7 ? '#00ff88' : Math.random() < 0.5 ? '#ff1a4a' : '#00eeff',
        trail: [] as { x: number; y: number }[],
        maxTrail: 8,
      };
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      // Clear space background
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-b').trim() || '#000208';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Twinkling Stars (No expensive shadowBlur!)
      for (let i = 0; i < starCount; i++) {
        const s = stars[i];
        s.a += s.spd;
        const alpha = 0.2 + Math.sin(s.a) * 0.6;
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // 2. Draw Energy Particles & Trails (Highly Optimized!)
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.maxTrail) {
          p.trail.shift();
        }

        // Draw Trail as a single continuous line segment with fading opacity
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let j = 1; j < p.trail.length; j++) {
            ctx.lineTo(p.trail[j].x, p.trail[j].y);
          }
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.r * 0.8;
          ctx.globalAlpha = p.life * 0.3;
          ctx.stroke();
        }

        // Draw Particle Head (Glow is simulated by drawing a slightly larger transparent circle, NOT using shadowBlur)
        ctx.fillStyle = p.color;
        
        // Outer glow
        ctx.globalAlpha = p.life * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Push particle away from mouse subtly (gravity/magnetism repulsion)
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220 && dist > 1) {
          const force = (220 - dist) / 220;
          p.x += (dx / dist) * force * 2.5;
          p.y += (dy / dist) * force * 2.5;
        }

        // Move & Decay
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        // Reset particle when dead or out of bounds
        if (p.life <= 0 || p.x < -30 || p.x > width + 30 || p.y < -30 || p.y > height + 30) {
          particles[i] = createParticle(width, height);
        }
      }
      ctx.globalAlpha = 1.0;

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Matrix digital rain effects (Optimized interval execution instead of 60 FPS redraw)
  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = '01アイウエオカキサシスSOLAX$₿⚡▲▼◆∞';
    const fontSize = 14;
    const cols = Math.floor(width / fontSize);
    
    // Fewer columns to improve performance, spacing them out
    const step = 2; // draw every 2 columns
    const drops = Array.from({ length: Math.ceil(cols / step) }, () => ({
      colIndex: 0,
      y: Math.random() * -60,
      bright: Math.random() < 0.1,
      speed: Math.random() * 0.35 + 0.15,
    }));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let frameCount = 0;
    let animationId: number;

    const renderRain = () => {
      // Throttle matrix rain to ~25fps to save CPU/GPU cycles
      frameCount++;
      if (frameCount % 2 === 0) {
        // Draw slightly transparent black box to fade trails
        ctx.fillStyle = 'rgba(0, 2, 8, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `500 ${fontSize}px 'Share Tech Mono', monospace`;

        drops.forEach((d, i) => {
          const ch = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize * step;
          const y = d.y * fontSize;

          if (y > 0 && y < height + fontSize) {
            if (d.bright) {
              ctx.fillStyle = '#ffffff';
              ctx.fillText(ch, x, y);
              
              // Draw small neon aura behind bright drop
              ctx.fillStyle = 'rgba(0, 255, 136, 0.2)';
              ctx.fillText(ch, x - 1, y);
              ctx.fillText(ch, x + 1, y);
            } else if (Math.random() < 0.01) {
              ctx.fillStyle = '#ff1a4a';
              ctx.fillText(ch, x, y);
            } else {
              ctx.fillStyle = 'rgba(0, 180, 90, 0.35)';
              ctx.fillText(ch, x, y);
            }
          }

          d.y += d.speed;

          // Reset drop
          if (y > height && Math.random() > 0.975) {
            d.y = 0;
            d.bright = Math.random() < 0.1;
            d.speed = Math.random() * 0.35 + 0.15;
          }
        });
      }

      animationId = requestAnimationFrame(renderRain);
    };

    renderRain();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* 1. Background Starfield + Particles unified Canvas */}
      <canvas
        ref={bgCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[0]"
      />

      {/* 2. Cosmic Nebulas - CSS-based (GPU-accelerated transformations, 0% CPU overhead!) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1] opacity-80 mix-blend-screen select-none">
        {/* Nebula 1: Green */}
        <div 
          className="absolute w-[1000px] h-[700px] rounded-full blur-[180px] opacity-[0.09] bg-gradient-to-r from-[#00ff88] via-[#00ffaa]/50 to-transparent animate-nebula-1" 
          style={{ top: '-10%', left: '-10%', transform: 'translate3d(0,0,0)' }} 
        />
        {/* Nebula 2: Red */}
        <div 
          className="absolute w-[900px] h-[600px] rounded-full blur-[160px] opacity-[0.08] bg-gradient-to-r from-[#ff1a4a] to-transparent animate-nebula-2" 
          style={{ top: '20%', right: '-15%', transform: 'translate3d(0,0,0)' }} 
        />
        {/* Nebula 3: Cyan */}
        <div 
          className="absolute w-[1100px] h-[700px] rounded-full blur-[200px] opacity-[0.07] bg-gradient-to-r from-[#00eeff] via-g/30 to-transparent animate-nebula-3" 
          style={{ bottom: '-10%', left: '10%', transform: 'translate3d(0,0,0)' }} 
        />
        {/* Nebula 4: Purple */}
        <div 
          className="absolute w-[800px] h-[600px] rounded-full blur-[150px] opacity-[0.07] bg-gradient-to-r from-[#7b2dff] to-transparent animate-nebula-4" 
          style={{ bottom: '25%', right: '15%', transform: 'translate3d(0,0,0)' }} 
        />
      </div>

      {/* 3. Matrix Rain Canvas - Optimized low frequency */}
      <canvas
        ref={rainCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[2] opacity-[0.32]"
      />
    </>
  );
}
