import React, { useEffect, useRef } from 'react';

interface Node {
  name: string;
  core?: boolean;
  color: string;
  size: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  base: { x: number; y: number };
  phase: number;
}

interface Pulse {
  from: number;
  to: number;
  t: number;
  color: string;
}

const PROTOCOLS = [
  { name: 'SOLAX', core: true, color: '#00ff88', size: 28 },
  { name: 'Raydium', color: '#00eeff', size: 16 },
  { name: 'Orca', color: '#00ccff', size: 16 },
  { name: 'Jupiter', color: '#ffd700', size: 18 },
  { name: 'Marinade', color: '#00ff88', size: 15 },
  { name: 'Serum', color: '#ff4466', size: 15 },
  { name: 'Mango', color: '#ff8800', size: 14 },
  { name: 'Drift', color: '#cc44ff', size: 14 },
  { name: 'Phoenix', color: '#ff2244', size: 14 },
  { name: 'Kamino', color: '#00ff66', size: 13 },
  { name: 'marginfi', color: '#4488ff', size: 13 },
  { name: 'Jito', color: '#ffdd00', size: 14 },
  { name: 'Tensor', color: '#ff66aa', size: 13 },
  { name: 'Pyth', color: '#66ccff', size: 12 },
  { name: 'Switchboard', color: '#aa88ff', size: 12 },
];

export default function NetworkViz() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth || 800);
    let height = (canvas.height = canvas.offsetHeight || 500);

    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let pulseTimer: NodeJS.Timeout;

    const buildNodes = () => {
      const cx = width / 2;
      const cy = height / 2;

      nodes = PROTOCOLS.map((p, i) => {
        if (p.core) {
          return {
            ...p,
            x: cx,
            y: cy,
            vx: 0,
            vy: 0,
            base: { x: cx, y: cy },
            phase: 0,
          };
        }
        
        const angle = ((i - 1) / (PROTOCOLS.length - 1)) * Math.PI * 2;
        // Random distance from core center
        const radius = 110 + Math.random() * 80;
        const bx = cx + Math.cos(angle) * radius;
        const by = cy + Math.sin(angle) * radius;
        
        return {
          ...p,
          x: bx,
          y: by,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          base: { x: bx, y: by },
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    buildNodes();

    // Spawn pulses periodically
    pulseTimer = setInterval(() => {
      if (nodes.length <= 1) return;
      const targetIndex = Math.floor(Math.random() * (nodes.length - 1)) + 1;
      
      // Core to target pulse
      pulses.push({
        from: 0,
        to: targetIndex,
        t: 0,
        color: nodes[targetIndex].color,
      });

      // Random target to core pulse (30% chance)
      if (Math.random() < 0.3) {
        pulses.push({
          from: targetIndex,
          to: 0,
          t: 0,
          color: nodes[targetIndex].color,
        });
      }
    }, 850);

    const handleResize = () => {
      const container = canvas.parentElement;
      if (container) {
        width = canvas.width = container.offsetWidth || 800;
        height = canvas.height = container.offsetHeight || 500;
        buildNodes();
      }
    };

    // ResizeObserver is standard for modern layouts to prevent canvas stretch & pixel mismatch
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.006;

      // 1. Float Nodes slightly (deterministic path, avoiding complex physical interactions)
      nodes.forEach((n, i) => {
        if (i === 0) return; // SOLAX core remains centered
        n.x = n.base.x + Math.sin(t * 1.5 + n.phase) * 14;
        n.y = n.base.y + Math.cos(t * 1.2 + n.phase) * 11;
      });

      const core = nodes[0];

      // 2. Draw Connection Lines
      if (core) {
        nodes.forEach((n, i) => {
          if (i === 0) return;
          const dx = n.x - core.x;
          const dy = n.y - core.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Fading connections further from core
          const maxDist = 240;
          const alpha = Math.max(0, (maxDist - dist) / maxDist * 0.32);

          ctx.beginPath();
          ctx.moveTo(core.x, core.y);
          ctx.lineTo(n.x, n.y);
          ctx.strokeStyle = n.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Inter-node secondary ring lines
          if (i > 1 && i < nodes.length - 1) {
            const nextNode = nodes[i + 1];
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(nextNode.x, nextNode.y);
            ctx.strokeStyle = n.color;
            ctx.globalAlpha = alpha * 0.2;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }
      ctx.globalAlpha = 1.0;

      // 3. Update & Draw Pulses
      pulses = pulses.filter((p) => {
        p.t += 0.018; // Speed of the pulse traveling
        if (p.t > 1) return false;

        const fromNode = nodes[p.from];
        const toNode = nodes[p.to];
        if (!fromNode || !toNode) return false;

        const px = fromNode.x + (toNode.x - fromNode.x) * p.t;
        const py = fromNode.y + (toNode.y - fromNode.y) * p.t;

        // Pulse outer glow circle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = (1 - p.t) * 0.3;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        // Pulse bright core
        ctx.globalAlpha = 1 - p.t * 0.4;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });
      ctx.globalAlpha = 1.0;

      // 4. Draw Nodes
      nodes.forEach((n, i) => {
        const pulseCycle = Math.sin(t * 3.5 + i) * 0.35 + 0.65; // breathing pulse scale
        
        // A. Glow Aureola (Replaces shadowBlur!)
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.04 + pulseCycle * 0.05;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * (1.8 + pulseCycle * 0.3), 0, Math.PI * 2);
        ctx.fill();

        // B. Mid-intensity halo
        ctx.globalAlpha = 0.16 + pulseCycle * 0.12;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * 0.6 + pulseCycle * 2, 0, Math.PI * 2);
        ctx.fill();

        // C. Core circle
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * 0.28, 0, Math.PI * 2);
        ctx.fill();

        // D. Draw text names
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = n.color;
        ctx.font = `${i === 0 ? '700 13px' : '600 10px'} 'Share Tech Mono', monospace`;
        ctx.textAlign = 'center';
        
        // Drop simple text shadow using double-draw or simple solid offsets
        ctx.fillText(n.name, n.x, n.y + n.size + (i === 0 ? 18 : 14));
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(pulseTimer);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[520px] max-w-[900px] pointer-events-none select-none relative z-[2] block"
    />
  );
}
