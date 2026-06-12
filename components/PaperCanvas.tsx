'use client';

import { useEffect, useRef } from 'react';

const LABELS = [
  'Widerspruch', 'MDK-Gutachten', 'Pflegegrad 2',
  '§ 15 SGB XI', 'Formular', 'Bescheid', 'Einspruch', 'Pflegekasse',
];

interface Paper {
  x: number; y: number;
  rotation: number; rotSpeed: number;
  speed: number; label: string; opacity: number;
}

const W = 62, H = 80;

function randomPaper(canvasWidth: number, startDistributed = false): Paper {
  return {
    x: Math.random() * canvasWidth,
    y: startDistributed ? Math.random() * 800 - 100 : -H - Math.random() * 300,
    rotation: (Math.random() - 0.5) * 50,
    rotSpeed: (Math.random() - 0.5) * 0.12,
    speed: 0.25 + Math.random() * 0.4,
    label: LABELS[Math.floor(Math.random() * LABELS.length)],
    opacity: 0.40 + Math.random() * 0.20,
  };
}

function getCanvasColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    paper:  s.getPropertyValue('--canvas-paper').trim()  || '#1e1e2e',
    stroke: s.getPropertyValue('--canvas-stroke').trim() || '#2a2a4a',
    lines:  s.getPropertyValue('--canvas-lines').trim()  || '#252540',
    label:  s.getPropertyValue('--canvas-label').trim()  || '#3a3a5a',
  };
}

export default function PaperCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let colors = getCanvasColors();
    const mutObs = new MutationObserver(() => { colors = getCanvasColors(); });
    mutObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const COUNT = 18;
    const papers: Paper[] = Array.from({ length: COUNT }, () => randomPaper(canvas.width, true));
    let animId: number;

    const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of papers) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        drawRoundRect(-W / 2, -H / 2, W, H, 3);
        ctx.fillStyle = colors.paper;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.strokeStyle = colors.lines;
        ctx.lineWidth = 0.6;
        for (let l = 0; l < 4; l++) {
          const ly = -H / 2 + 26 + l * 11;
          ctx.beginPath();
          ctx.moveTo(-W / 2 + 8, ly);
          ctx.lineTo(W / 2 - 8, ly);
          ctx.stroke();
        }

        ctx.fillStyle = colors.label;
        ctx.font = '500 7px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.label, 0, -H / 2 + 13);

        ctx.restore();
        p.y += p.speed;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height + H + 20) Object.assign(p, randomPaper(canvas.width, false));
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      mutObs.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
