"use client";

import { useEffect, useRef } from "react";
import { useReduced } from "@/lib/hooks";

interface Node {
  bx: number;
  by: number;
  x: number;
  y: number;
  phase: number;
  glow: number;
  layer: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  target: Node;
  age: number;
}
interface Pulse {
  path: Node[];
  seg: number;
  t: number;
  speed: number;
}

const TAU = Math.PI * 2;

/**
 * The hero's visual metaphor, drawn on one 2D canvas: loose "idea" particles
 * drift in from the left, get absorbed by the input layer of a small network,
 * and leave the output layer as signals. The pointer excites nearby nodes;
 * a click releases a handful of new ideas. It sleeps when off-screen.
 */
export function NeuralField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReduced();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let layers: Node[][] = [];
    let particles: Particle[] = [];
    let pulses: Pulse[] = [];
    let pointer = { x: -9999, y: -9999, active: false };
    let signal = "#ff5b1f";
    let raf = 0;
    let running = false;
    let last = 0;
    let spawnClock = 0;
    let pulseClock = 0;
    let frame = 0;
    let mobile = false;

    const readSignal = () => {
      signal = getComputedStyle(document.documentElement).getPropertyValue("--color-signal").trim() || signal;
    };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      mobile = w < 768;
      const sizes = mobile ? [3, 5, 5, 3] : [4, 6, 7, 5, 3];
      const x0 = mobile ? w * 0.14 : w * 0.5;
      const x1 = mobile ? w * 0.86 : w * 0.92;
      const cy = mobile ? h * 0.3 : h * 0.47;
      const span = mobile ? h * 0.3 : Math.min(h * 0.62, 560);

      layers = sizes.map((n, li) => {
        const x = x0 + ((x1 - x0) * li) / (sizes.length - 1);
        const gap = Math.min(span / Math.max(n - 1, 1), mobile ? 46 : 84);
        return Array.from({ length: n }, (_, i) => {
          const y = cy + (i - (n - 1) / 2) * gap;
          return { bx: x, by: y, x, y, phase: Math.random() * TAU, glow: 0, layer: li };
        });
      });
      particles = [];
      pulses = [];
    };

    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    const spawnParticle = (x?: number, y?: number) => {
      const target = pick(layers[0]);
      const sx = x ?? (mobile ? Math.random() * w * 0.12 : target.bx - 140 - Math.random() * w * 0.32);
      const sy = y ?? target.by + (Math.random() - 0.5) * (mobile ? 160 : 420);
      particles.push({ x: sx, y: sy, vx: 0.15 + Math.random() * 0.25, vy: (Math.random() - 0.5) * 0.2, target, age: 0 });
    };

    const spawnPulse = (from: Node) => {
      const path = [from];
      for (let i = from.layer + 1; i < layers.length; i++) path.push(pick(layers[i]));
      pulses.push({ path, seg: 0, t: 0, speed: 0.0016 + Math.random() * 0.0012 });
    };

    const draw = (time: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const near = 170;

      // Nodes breathe and lean towards the pointer.
      for (const layer of layers) {
        for (const n of layer) {
          let x = n.bx + Math.sin(time * 0.0006 + n.phase) * 3;
          let y = n.by + Math.cos(time * 0.0005 + n.phase) * 4;
          if (pointer.active) {
            const dx = pointer.x - x;
            const dy = pointer.y - y;
            const d = Math.hypot(dx, dy);
            if (d < near) {
              const f = (1 - d / near) * 12;
              x += (dx / (d || 1)) * f;
              y += (dy / (d || 1)) * f;
              n.glow = Math.max(n.glow, (1 - d / near) * 0.7);
            }
          }
          n.x = x;
          n.y = y;
          n.glow *= 0.95;
        }
      }

      // Edges: one batched stroke for the resting mesh.
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(236,235,230,0.055)";
      ctx.beginPath();
      for (let li = 0; li < layers.length - 1; li++) {
        for (const a of layers[li]) {
          for (const b of layers[li + 1]) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
        }
      }
      ctx.stroke();

      // Edges around excited nodes.
      for (let li = 0; li < layers.length - 1; li++) {
        for (const a of layers[li]) {
          for (const b of layers[li + 1]) {
            const g = Math.min(a.glow, b.glow);
            if (g < 0.08) continue;
            ctx.strokeStyle = `rgba(236,235,230,${0.05 + g * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Idea particles drift right until the input layer absorbs them.
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        const dx = p.target.x - p.x;
        const dy = p.target.y - p.y;
        const d = Math.hypot(dx, dy);
        const pull = Math.min(1, p.age / 2600) * 0.0006;
        p.vx += dx * pull * dt * 0.06;
        p.vy += dy * pull * dt * 0.06 + Math.sin(time * 0.002 + p.x * 0.02) * 0.004;
        p.vx *= 0.978;
        p.vy *= 0.978;
        p.x += p.vx * dt * 0.06;
        p.y += p.vy * dt * 0.06;
        const alpha = Math.min(1, p.age / 600) * 0.6;
        ctx.fillStyle = `rgba(236,235,230,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, TAU);
        ctx.fill();
        if (d < 12 || p.age > 14000) {
          particles.splice(i, 1);
          if (d < 12) {
            p.target.glow = 1;
            spawnPulse(p.target);
          }
        }
      }

      // Signals travel the network, lighting each edge as they pass.
      ctx.lineCap = "round";
      for (let i = pulses.length - 1; i >= 0; i--) {
        const s = pulses[i];
        s.t += s.speed * dt;
        if (s.t >= 1) {
          s.seg += 1;
          s.t = 0;
          const reached = s.path[s.seg];
          if (reached) reached.glow = 1;
          if (s.seg >= s.path.length - 1) {
            pulses.splice(i, 1);
            continue;
          }
        }
        const a = s.path[s.seg];
        const b = s.path[s.seg + 1];
        const x = a.x + (b.x - a.x) * s.t;
        const y = a.y + (b.y - a.y) * s.t;
        const tail = Math.max(0, s.t - 0.22);
        const grad = ctx.createLinearGradient(a.x + (b.x - a.x) * tail, a.y + (b.y - a.y) * tail, x, y);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, signal);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(a.x + (b.x - a.x) * tail, a.y + (b.y - a.y) * tail);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = signal;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, TAU);
        ctx.fill();
      }

      // Nodes on top.
      const outLayer = layers.length - 1;
      for (const layer of layers) {
        for (const n of layer) {
          const isOut = n.layer === outLayer;
          if (n.glow > 0.12) {
            ctx.fillStyle = isOut ? hexA(signal, n.glow * 0.18) : `rgba(236,235,230,${n.glow * 0.1})`;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 7 + n.glow * 9, 0, TAU);
            ctx.fill();
          }
          ctx.fillStyle = isOut && n.glow > 0.2 ? signal : `rgba(236,235,230,${0.4 + n.glow * 0.6})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.2 + n.glow * 1.6, 0, TAU);
          ctx.fill();
        }
      }

      if (!mobile) {
        ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillStyle = "rgba(236,235,230,0.32)";
        const first = layers[0][0];
        const out = layers[outLayer][0];
        ctx.fillText("INPUT / IDEAS", first.bx - 34, first.by - 34);
        ctx.fillText("OUTPUT / SYSTEMS", out.bx - 48, out.by - 34);
      }
    };

    const tick = (time: number) => {
      const dt = Math.min(48, time - (last || time));
      last = time;
      frame++;
      if (frame % 90 === 0) readSignal();
      spawnClock += dt;
      pulseClock += dt;
      const every = mobile ? 520 : 260;
      if (spawnClock > every && particles.length < (mobile ? 16 : 42)) {
        spawnClock = 0;
        spawnParticle();
      }
      if (pulseClock > 1600) {
        pulseClock = 0;
        spawnPulse(pick(layers[0]));
      }
      draw(time, dt);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    readSignal();
    layout();

    if (reduced) {
      // A single composed frame: a few lit paths, no motion.
      for (let i = 0; i < 3; i++) spawnPulse(layers[0][i % layers[0].length]);
      pulses.forEach((p) => (p.t = 0.6));
      draw(0, 0);
    }

    const ro = new ResizeObserver(() => {
      layout();
      if (reduced) draw(0, 0);
    });
    ro.observe(canvas);

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : visible && start());
    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientY >= r.top && e.clientY <= r.bottom };
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      pointer = { x: p.x, y: p.y, active: p.inside };
    };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e);
      if (!p.inside || reduced) return;
      if ((e.target as Element | null)?.closest("a, button")) return;
      for (let i = 0; i < 6; i++) spawnParticle(p.x + (Math.random() - 0.5) * 30, p.y + (Math.random() - 0.5) * 30);
    };
    const onLeave = () => (pointer = { ...pointer, active: false });

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 size-full" />;
}

function hexA(hex: string, a: number) {
  const m = hex.replace("#", "");
  if (m.length !== 6) return `rgba(255,91,31,${a})`;
  const n = parseInt(m, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
