import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// BUTTERFLY ANTIGRAVITY ENGINE  ·  kriss2012/butterfly  v2.0
// Company-level vibe-coded showcase  ·  Antigravity Physics
// ─────────────────────────────────────────────────────────────

const WING_COLORS = [
  ["#7C3AED", "#C4B5FD", "#4C1D95"],
  ["#0EA5E9", "#BAE6FD", "#0C4A6E"],
  ["#F59E0B", "#FDE68A", "#92400E"],
  ["#10B981", "#A7F3D0", "#064E3B"],
  ["#EC4899", "#FBCFE8", "#831843"],
  ["#6366F1", "#C7D2FE", "#312E81"],
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createButterfly(id, width, height) {
  const colorSet = WING_COLORS[Math.floor(Math.random() * WING_COLORS.length)];
  return {
    id,
    x: randomBetween(50, width - 50),
    y: randomBetween(height * 0.4, height - 50),
    vx: randomBetween(-0.4, 0.4),
    vy: randomBetween(-1.2, -0.3),   // negative = upward (antigravity)
    phase: Math.random() * Math.PI * 2,
    flapSpeed: randomBetween(0.06, 0.14),
    size: randomBetween(22, 42),
    opacity: randomBetween(0.7, 1),
    colorSet,
    trail: [],
    wobble: randomBetween(0.008, 0.025),
    age: 0,
    maxAge: randomBetween(400, 900),
    driftAmplitude: randomBetween(0.3, 1.1),
    driftFreq: randomBetween(0.008, 0.02),
  };
}

function ButterflyShape({ bf, tick }) {
  const flapAngle = Math.abs(Math.sin(tick * bf.flapSpeed + bf.phase));
  const wingOpen = flapAngle;           // 0 = closed, 1 = fully open
  const [primary, light, dark] = bf.colorSet;
  const s = bf.size;

  // Wing control points scale with flapAngle
  const topWingX = s * 1.5 * wingOpen;
  const botWingX = s * 1.1 * wingOpen;
  const wingY   = s * 0.9;

  // Left top wing
  const ltw = `M0,0 C-${topWingX},${-wingY} -${topWingX * 1.3},${wingY * 0.5} 0,${s * 0.3}`;
  // Right top wing (mirror)
  const rtw = `M0,0 C${topWingX},${-wingY} ${topWingX * 1.3},${wingY * 0.5} 0,${s * 0.3}`;
  // Left bottom wing
  const lbw = `M0,${s * 0.3} C-${botWingX},${s * 0.4} -${botWingX * 0.8},${s} 0,${s * 0.7}`;
  // Right bottom wing
  const rbw = `M0,${s * 0.3} C${botWingX},${s * 0.4} ${botWingX * 0.8},${s} 0,${s * 0.7}`;

  const gId = `wg-${bf.id}`;

  return (
    <g transform={`translate(${bf.x}, ${bf.y})`} opacity={bf.opacity}>
      {/* Glow halo */}
      <ellipse cx={0} cy={s * 0.35} rx={s * wingOpen * 1.2} ry={s * 0.5}
        fill="none" stroke={light} strokeWidth={2}
        opacity={wingOpen * 0.35} filter={`url(#glow-${bf.id})`} />

      <defs>
        <radialGradient id={gId} cx="30%" cy="30%">
          <stop offset="0%" stopColor={light} />
          <stop offset="60%" stopColor={primary} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        <filter id={`glow-${bf.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Wings */}
      <path d={ltw} fill={`url(#${gId})`} stroke={light} strokeWidth={0.5} opacity={0.92} />
      <path d={rtw} fill={`url(#${gId})`} stroke={light} strokeWidth={0.5} opacity={0.92} />
      <path d={lbw} fill={`url(#${gId})`} stroke={primary} strokeWidth={0.5} opacity={0.82} />
      <path d={rbw} fill={`url(#${gId})`} stroke={primary} strokeWidth={0.5} opacity={0.82} />

      {/* Body */}
      <ellipse cx={0} cy={s * 0.4} rx={s * 0.07} ry={s * 0.4}
        fill={dark} stroke={light} strokeWidth={0.5} />

      {/* Antennae */}
      <path d={`M0,0 Q${-s * 0.2 * wingOpen},${-s * 0.5} ${-s * 0.15},${-s * 0.7}`}
        stroke={primary} strokeWidth={0.8} fill="none" />
      <path d={`M0,0 Q${s * 0.2 * wingOpen},${-s * 0.5} ${s * 0.15},${-s * 0.7}`}
        stroke={primary} strokeWidth={0.8} fill="none" />
      <circle cx={-s * 0.15} cy={-s * 0.7} r={s * 0.04} fill={light} />
      <circle cx={s * 0.15} cy={-s * 0.7} r={s * 0.04} fill={light} />
    </g>
  );
}

function TrailDot({ x, y, color, opacity, size }) {
  return (
    <circle cx={x} cy={y} r={size} fill={color} opacity={opacity} />
  );
}

export default function ButterflyAntigravity() {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 900, height: 600 });
  const [butterflies, setButterflies] = useState([]);
  const [trails, setTrails] = useState([]);
  const [tick, setTick] = useState(0);
  const [particlePool, setParticlePool] = useState([]);
  const [mousePos, setMousePos] = useState(null);
  const [count, setCount] = useState(0);
  const nextId = useRef(0);
  const rafRef = useRef(null);
  const tickRef = useRef(0);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setDims({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    ro.observe(el);
    setDims({ width: el.offsetWidth, height: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  // Spawn initial butterflies
  useEffect(() => {
    if (!dims.width) return;
    const initial = Array.from({ length: 8 }, (_, i) =>
      createButterfly(nextId.current++, dims.width, dims.height)
    );
    setButterflies(initial);
    setCount(initial.length);
  }, [dims.width]);

  const spawnAt = useCallback((x, y) => {
    setButterflies(prev => {
      const bf = createButterfly(nextId.current++, dims.width, dims.height);
      bf.x = x; bf.y = y;
      bf.vy = randomBetween(-1.8, -0.8);
      const next = [...prev, bf].slice(-28); // cap at 28
      setCount(next.length);
      return next;
    });
  }, [dims]);

  // Animation loop
  useEffect(() => {
    const loop = () => {
      tickRef.current += 1;
      setTick(tickRef.current);

      setButterflies(prev => {
        const newTrailParts = [];
        const updated = prev.map(bf => {
          // Trail snapshot every few ticks
          if (tickRef.current % 3 === 0) {
            newTrailParts.push({
              id: `t${bf.id}-${tickRef.current}`,
              x: bf.x, y: bf.y + bf.size * 0.4,
              color: bf.colorSet[0],
              opacity: 0.35,
              size: bf.size * 0.08,
              decay: 0.025,
            });
          }

          // Horizontal drift (sinusoidal)
          const drift = Math.sin(tickRef.current * bf.driftFreq + bf.phase) * bf.driftAmplitude;

          // Mouse repulsion
          let repX = 0, repY = 0;
          if (mousePos) {
            const dx = bf.x - mousePos.x;
            const dy = bf.y - mousePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 0) {
              const force = (120 - dist) / 120 * 0.6;
              repX = (dx / dist) * force;
              repY = (dy / dist) * force;
            }
          }

          const newX = bf.x + bf.vx + drift + repX;
          const newY = bf.y + bf.vy + repY;
          const newAge = bf.age + 1;

          // Fade out near end of life
          const fadeOut = newAge > bf.maxAge * 0.8
            ? 1 - (newAge - bf.maxAge * 0.8) / (bf.maxAge * 0.2)
            : 1;

          // Respawn when offscreen or aged out
          if (newY < -80 || newAge > bf.maxAge) {
            return createButterfly(bf.id, dims.width, dims.height);
          }
          // Bounce horizontal edges
          const vxBounced = (newX < 10 || newX > dims.width - 10) ? -bf.vx : bf.vx;

          return { ...bf, x: newX, y: newY, vx: vxBounced, age: newAge, opacity: Math.min(bf.opacity, fadeOut) };
        });

        // Update trails
        setTrails(prev => {
          const live = prev
            .map(t => ({ ...t, opacity: t.opacity - t.decay, size: t.size * 0.97 }))
            .filter(t => t.opacity > 0.01);
          return [...live, ...newTrailParts].slice(-200);
        });

        return updated;
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dims, mousePos]);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleClick = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    spawnAt(e.clientX - rect.left, e.clientY - rect.top);
  }, [spawnAt]);

  const handleMouseLeave = useCallback(() => setMousePos(null), []);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      width: "100%", height: "100%", minHeight: 560,
      background: "#06060f", fontFamily: "'Inter', system-ui, sans-serif",
      overflow: "hidden",
    }}>
      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px", background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #7C3AED, #0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14,
          }}>🦋</div>
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em" }}>
              BUTTERFLY ANTIGRAVITY
            </div>
            <div style={{ color: "#6366F1", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              vibe coding engine · v2.0
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "ACTIVE", value: count },
            { label: "TICK", value: tick },
            { label: "TRAILS", value: trails.length },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "right" }}>
              <div style={{ color: "#94A3B8", fontSize: 9, letterSpacing: "0.12em" }}>{label}</div>
              <div style={{ color: "#C4B5FD", fontSize: 13, fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} style={{ flex: 1, position: "relative", cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Ambient background */}
        <div style={{
          position: "absolute", inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(99,102,241,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 20% 80%, rgba(124,58,237,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 80% 70%, rgba(14,165,233,0.07) 0%, transparent 55%)
          `,
          pointerEvents: "none",
        }} />

        {/* Floating particles (stars) */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {Array.from({ length: 40 }, (_, i) => (
            <circle key={i}
              cx={`${(i * 2.5 + 3) % 100}%`}
              cy={`${(i * 3.7 + 5) % 100}%`}
              r={i % 5 === 0 ? 1.5 : 0.8}
              fill="white"
              opacity={(Math.sin(tick * 0.02 + i) + 1) / 2 * 0.4 + 0.1}
            />
          ))}
        </svg>

        {/* Main SVG canvas */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox={`0 0 ${dims.width} ${dims.height}`}
          preserveAspectRatio="none"
        >
          {/* Trail particles */}
          {trails.map(t => (
            <TrailDot key={t.id} {...t} />
          ))}

          {/* Butterflies */}
          {butterflies.map(bf => (
            <ButterflyShape key={bf.id} bf={bf} tick={tick} />
          ))}

          {/* Mouse cursor ring */}
          {mousePos && (
            <g opacity={0.5}>
              <circle cx={mousePos.x} cy={mousePos.y} r={120}
                fill="none" stroke="#7C3AED" strokeWidth={0.5} strokeDasharray="4 8" />
              <circle cx={mousePos.x} cy={mousePos.y} r={4}
                fill="#C4B5FD" />
            </g>
          )}
        </svg>

        {/* Click hint */}
        <div style={{
          position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
          color: "rgba(148,163,184,0.5)", fontSize: 11, letterSpacing: "0.08em",
          pointerEvents: "none", userSelect: "none",
        }}>
          CLICK TO SPAWN · HOVER TO REPEL
        </div>
      </div>

      {/* Footer tech bar */}
      <div style={{
        padding: "8px 20px", background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", gap: 20, alignItems: "center",
        flexShrink: 0,
      }}>
        {[
          { k: "PHYSICS", v: "Antigravity + Drift" },
          { k: "STACK", v: "React + SVG" },
          { k: "INTERACTIONS", v: "Mouse Repulsion" },
          { k: "REPO", v: "kriss2012/butterfly" },
        ].map(({ k, v }) => (
          <div key={k} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ color: "#475569", fontSize: 9, letterSpacing: "0.1em" }}>{k}</span>
            <span style={{ color: "#94A3B8", fontSize: 10 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
