import React, { useEffect, useRef, useState } from 'react';

interface InteractiveElement {
  el: HTMLElement;
  rect: DOMRect;
  cx: number;
  cy: number;
}

export default function QuantumLightningCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
  
  // HUD tracking state for display
  const [coords, setCoords] = useState({ x: 0, y: 0, speed: 0, ping: 12, gas: 18 });
  const [activeConnections, setActiveConnections] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mx = 0;
    let my = 0;
    let lastMx = 0;
    let lastMy = 0;
    let mouseSpeed = 0;
    let isMouseInWindow = false;

    // Track list of elements we want to arc lightning to
    let targets: InteractiveElement[] = [];

    const updateTargets = () => {
      const elements = document.querySelectorAll('a, button, [role="button"], .interactive-cursor, .btn-neon, input');
      const tempTargets: InteractiveElement[] = [];
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const rect = htmlEl.getBoundingClientRect();
        // Skip elements that are offscreen or hidden
        if (rect.width === 0 || rect.height === 0 || rect.top < -200 || rect.bottom > window.innerHeight + 200) {
          return;
        }
        tempTargets.push({
          el: htmlEl,
          rect,
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
        });
      });
      targets = tempTargets;
    };

    // Periodically scan DOM for new elements (e.g. after AI token generation)
    const scanInterval = setInterval(updateTargets, 1200);
    updateTargets();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      updateTargets();
    };

    const handleScroll = () => {
      updateTargets();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      isMouseInWindow = true;

      // Update pointer speed
      const dx = mx - lastMx;
      const dy = my - lastMy;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      lastMx = mx;
      lastMy = my;

      // Position the HUD container
      if (hudRef.current) {
        hudRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
    };

    const onMouseLeave = () => {
      isMouseInWindow = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // Lightning midpoint displacement algorithm
    const drawLightning = (
      x1: number, 
      y1: number, 
      x2: number, 
      y2: number, 
      displace: number, 
      minDisplace: number,
      color: string,
      lineWidth: number
    ) => {
      if (displace < minDisplace) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      } else {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const offsetRatio = (Math.random() - 0.5) * displace;
        const nx = midX + (Math.random() - 0.5) * displace * 0.4;
        const ny = midY + (Math.random() - 0.5) * displace * 0.4;
        
        drawLightning(x1, y1, nx, ny, displace / 2, minDisplace, color, lineWidth);
        drawLightning(nx, ny, x2, y2, displace / 2, minDisplace, color, lineWidth);
      }
    };

    // Particle pool for lightning strike contact points
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      color: string;
      life: number;
      decay: number;
    }
    const sparks: Spark[] = [];

    const spawnSparks = (x: number, y: number, color: string) => {
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * 1.5 + 0.5,
          color,
          life: 1.0,
          decay: Math.random() * 0.05 + 0.03,
        });
      }
    };

    // Direct HUD data updates periodically (throttled to save rendering power)
    let lastDataUpdate = 0;

    let animId: number;
    const loop = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw/Update Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.life;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      let connections = 0;

      // 2. Compute connections to elements when mouse is in window
      if (isMouseInWindow) {
        // Max range for electric field
        const connectionRange = 180;

        targets.forEach((target) => {
          // Re-measure distance
          const dx = target.cx - mx;
          const dy = target.cy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionRange) {
            connections++;
            
            // Choose color: green, blue, or pinkish red based on element properties
            let themeColor = '#00ff88'; // default neon green
            if (target.el.classList.contains('red') || target.el.id.includes('red')) {
              themeColor = '#ff1a4a';
            } else if (target.el.classList.contains('cyan') || target.el.className.includes('blue')) {
              themeColor = '#00eeff';
            } else if (Math.random() < 0.1) {
              themeColor = '#7b2dff'; // exotic deep space violet
            }

            // Draw connecting electrical branches
            // Layer 1: Broad glowing background beam
            ctx.shadowBlur = 0; // disable slow canvas shadow
            drawLightning(mx, my, target.cx, target.cy, dist * 0.15, 8, themeColor, 1.5);
            
            // Layer 2: Core hot white bolt for intense realism
            drawLightning(mx, my, target.cx, target.cy, dist * 0.15, 12, '#ffffff', 0.8);

            // Spawn micro sparks at contact points
            if (Math.random() < 0.25) {
              spawnSparks(target.cx, target.cy, themeColor);
              spawnSparks(mx, my, themeColor);
            }
          }
        });
      }

      // Update React state for connection and coordinates counter (throttled to 10 FPS to preserve resources)
      if (timestamp - lastDataUpdate > 100) {
        setCoords({
          x: Math.round(mx),
          y: Math.round(my),
          speed: Math.round(mouseSpeed * 10),
          ping: 10 + Math.floor(Math.random() * 8),
          gas: 14 + Math.floor(Math.sin(timestamp / 5000) * 4)
        });
        setActiveConnections(connections);
        lastDataUpdate = timestamp;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(scanInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Absolute canvas for lightning arcs */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[9995] mix-blend-screen"
      />

      {/* Futuristic Hologram HUD following the cursor closely */}
      <div
        ref={hudRef}
        className="fixed top-0 left-0 pointer-events-none z-[99997] hidden md:block select-none font-mono"
        style={{
          willChange: 'transform',
        }}
      >
        {/* Scope Reticle with rotating elements */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          
          {/* Main targeting laser lines reaching out */}
          {activeConnections > 0 && (
            <div className="absolute w-[80px] h-[80px] border border-g/30 rounded-full animate-spin [animation-duration:8s] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              <div className="absolute -top-1 w-[1px] h-2 bg-g" />
              <div className="absolute -bottom-1 w-[1px] h-2 bg-g" />
              <div className="absolute -left-1 w-2 h-[1px] bg-g" />
              <div className="absolute -right-1 w-2 h-[1px] bg-g" />
            </div>
          )}

          {/* Outer tech bracket indicator */}
          <div className="absolute w-[60px] h-[60px] border border-[#00eeff]/20 rounded-sm animate-spin [animation-duration:15s]" />

          {/* Real-time telemetry specs box - aligned bottom-right */}
          <div className="absolute left-[36px] top-[16px] bg-black/85 border border-g/20 p-2 text-[8px] leading-tight text-g tracking-[1px] flex flex-col gap-1 w-[120px] shadow-[0_0_15px_rgba(0,255,136,0.15)] opacity-85">
            <div className="flex justify-between items-center border-b border-g/10 pb-0.5">
              <span className="text-white/40">SYS_COORDS</span>
              <span className="text-white font-bold">{coords.x},{coords.y}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">BEAM_CONNS</span>
              <span className={activeConnections > 0 ? "text-cyan font-bold" : "text-white/40"}>
                0{activeConnections}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">VELOCITY_M/S</span>
              <span className="text-g font-bold">{coords.speed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">GAS_RENT_M</span>
              <span className="text-r font-bold">{coords.gas} SOL</span>
            </div>
          </div>
          
          {/* Futuristic radar rotating ring */}
          <svg className="absolute w-[110px] h-[110px] transform -rotate-90 pointer-events-none opacity-40">
            <circle
              cx="55"
              cy="55"
              r="48"
              stroke="#00ff88"
              strokeWidth="1"
              fill="transparent"
              strokeDasharray="12 18 36 24 6 12"
              className="animate-spin [animation-duration:12s]"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
