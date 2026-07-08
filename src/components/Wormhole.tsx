import React, { useEffect, useRef } from 'react';

export default function Wormhole() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || 1200);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth || 1200;
        height = canvas.height = canvas.parentElement.offsetHeight || 600;
      }
    };
    window.addEventListener('resize', handleResize);

    let wt = 0;
    const ringCount = 14; // Reduced from 28 for major rendering speedup (still looks dense!)

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      wt += 0.005;

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.max(cx, cy) * 1.15;

      for (let i = 0; i < ringCount; i++) {
        const t = i / ringCount;
        const r = t * maxRadius;
        const alpha = (1 - t) * 0.28;
        const twist = t * Math.PI * 3 + wt * 1.5;
        const squish = 0.22 + t * 0.68;

        // Optimized Ellipse ring drawing without save/restore overhead
        ctx.beginPath();
        
        // Ring offset for twist
        const offsetX = Math.sin(twist) * r * 0.04;
        
        // Draw the ring ellipse directly
        ctx.ellipse(
          cx + offsetX, 
          cy, 
          r, 
          r * squish * 0.45 + t * 30, 
          0, 
          0, 
          Math.PI * 2
        );

        // Alternating theme colors
        const colorIndex = i % 3;
        const strokeColor = colorIndex === 0 ? '#00ff88' : colorIndex === 1 ? '#ff1a4a' : '#00eeff';
        
        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Center portal glow (Layered core drawing - replaces slow shadowBlur)
      ctx.globalAlpha = 1.0;
      const glowLayers = [
        { r: 75, color: 'rgba(0,255,136,0.06)' },
        { r: 50, color: 'rgba(0,255,136,0.14)' },
        { r: 30, color: 'rgba(0,238,255,0.22)' },
        { r: 15, color: 'rgba(255,26,74,0.35)' },
        { r: 6, color: '#ffffff' },
      ];

      glowLayers.forEach((layer) => {
        ctx.beginPath();
        ctx.arc(cx, cy, layer.r, 0, Math.PI * 2);
        ctx.fillStyle = layer.color;
        ctx.fill();
      });

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
