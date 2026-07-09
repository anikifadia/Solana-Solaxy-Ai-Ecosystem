import React, { useEffect, useRef } from 'react';

interface OrbitToken {
  ringIndex: number;
  angle: number;
  speed: number;
  size: number;
  type: 'sol' | 'slx';
  pulseOffset: number;
}

export default function Wormhole() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const dpr = window.devicePixelRatio || 1;
    let width = canvas.parentElement?.offsetWidth || 1200;
    let height = canvas.parentElement?.offsetHeight || 600;

    const setupCanvas = (w: number, h: number) => {
      width = w || 1200;
      height = h || 600;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Modern ResizeObserver keeps the canvas crisp & properly sized in absolute containers
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          setupCanvas(w, h);
        }
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
      // Initial sizing if non-zero
      if (canvas.parentElement.offsetWidth > 0 && canvas.parentElement.offsetHeight > 0) {
        setupCanvas(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
      }
    }

    let wt = 0;
    const ringCount = 18; // High-detail galactic rings

    // Generate orbiting SOL & SLX high fidelity tokens
    const tokens: OrbitToken[] = Array.from({ length: 12 }, (_, i) => {
      return {
        ringIndex: Math.floor(Math.random() * (ringCount - 5)) + 4, // keep in middle-outer orbits
        angle: (i / 12) * Math.PI * 2 + Math.random() * 0.4,
        speed: 0.0035 + Math.random() * 0.0055,
        size: 9 + Math.random() * 5,
        type: i % 2 === 0 ? 'sol' : 'slx',
        pulseOffset: Math.random() * 100,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      wt += 0.0055;

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.max(cx, cy) * 1.35;

      // 1. Draw Nebula Galactic Rings
      for (let i = 0; i < ringCount; i++) {
        const t = i / ringCount;
        const r = t * maxRadius;
        const alpha = (1 - t) * 0.38; // Rich alpha transparency
        const twist = t * Math.PI * 3.5 + wt * 1.6;
        const squish = 0.24 + t * 0.66;

        ctx.beginPath();
        
        // Twist offset for galactic wave spiral arm feel
        const offsetX = Math.sin(twist) * r * 0.06;
        
        ctx.ellipse(
          cx + offsetX, 
          cy, 
          r, 
          r * squish * 0.45 + t * 35, 
          0, 
          0, 
          Math.PI * 2
        );

        const colorIndex = i % 3;
        const strokeColor = colorIndex === 0 ? '#00ff88' : colorIndex === 1 ? '#ff1a4a' : '#00eeff';
        
        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.4; // HD stroke clarity
        ctx.stroke();
      }

      // 2. Draw Orbiting Solana and Solaxy Gold-Green/Cyan Neon Coins
      tokens.forEach((tok) => {
        tok.angle += tok.speed;
        
        const t = tok.ringIndex / ringCount;
        const r = t * maxRadius;
        const twist = t * Math.PI * 3.5 + wt * 1.6;
        const squish = 0.24 + t * 0.66;
        
        // Elliptical coordinate computation
        const ellipseX = Math.cos(tok.angle) * r;
        const ellipseY = Math.sin(tok.angle) * r * squish * 0.45;
        const offsetX = Math.sin(twist) * r * 0.06;
        
        const px = cx + ellipseX + offsetX;
        const py = cy + ellipseY;

        // Skip rendering if offscreen to optimize
        if (px >= -30 && px <= width + 30 && py >= -30 && py <= height + 30) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(wt * 0.8 + tok.pulseOffset); // Spin coin around its axis

          const pulse = Math.sin(wt * 4 + tok.pulseOffset) * 1.5;
          const rSize = tok.size + pulse;

          // Outer Neon Halo
          ctx.beginPath();
          ctx.arc(0, 0, rSize * 1.4, 0, Math.PI * 2);
          ctx.fillStyle = tok.type === 'sol' ? '#00eeff' : '#00ff88';
          ctx.globalAlpha = 0.18;
          ctx.fill();

          // Coin Inner Body (deep space backboard)
          ctx.beginPath();
          ctx.arc(0, 0, rSize, 0, Math.PI * 2);
          ctx.fillStyle = '#020612';
          ctx.globalAlpha = 0.95;
          ctx.fill();

          // Coin Glowing Rim
          ctx.beginPath();
          ctx.arc(0, 0, rSize, 0, Math.PI * 2);
          ctx.strokeStyle = tok.type === 'sol' ? '#00eeff' : '#00ff88';
          ctx.lineWidth = 1.8;
          ctx.globalAlpha = 0.9;
          ctx.stroke();

          // Symbol inside Coin
          ctx.strokeStyle = tok.type === 'sol' ? '#00eeff' : '#00ff88';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 1.0;

          if (tok.type === 'sol') {
            // Solana symbol: 3 parallel slanted segments
            const len = rSize * 0.5;
            const h = rSize * 0.14;
            ctx.beginPath();
            ctx.moveTo(-len / 2, -h * 1.6);
            ctx.lineTo(len / 2, -h * 1.6);
            ctx.moveTo(-len / 2 + 2, 0);
            ctx.lineTo(len / 2 + 2, 0);
            ctx.moveTo(-len / 2 + 4, h * 1.6);
            ctx.lineTo(len / 2 + 4, h * 1.6);
            ctx.stroke();
          } else {
            // Solaxy "S" logo text/path
            ctx.font = `bold ${Math.floor(rSize * 1.3)}px system-ui, sans-serif`;
            ctx.fillStyle = '#00ff88';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('S', 0, 0);
          }

          ctx.restore();
        }
      });

      // 3. Center Core Glowing Star/Portal
      ctx.globalAlpha = 1.0;
      const glowLayers = [
        { r: 90, color: 'rgba(0,255,136,0.08)' },
        { r: 60, color: 'rgba(0,255,136,0.18)' },
        { r: 38, color: 'rgba(0,238,255,0.26)' },
        { r: 20, color: 'rgba(255,26,74,0.4)' },
        { r: 8, color: '#ffffff' },
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
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[0] block"
    />
  );
}
