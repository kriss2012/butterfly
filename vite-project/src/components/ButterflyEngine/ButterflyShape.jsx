import React from "react";

export function ButterflyShape({ bf, tick }) {
  const flapAngle = Math.abs(Math.sin(tick * bf.flapSpeed + bf.phase));
  const wingOpen = flapAngle; // 0 = closed, 1 = fully open
  const [primary, light, dark] = bf.colorSet;
  const s = bf.size;

  // Wing control points scale with flapAngle
  const topWingX = s * 1.5 * wingOpen;
  const botWingX = s * 1.1 * wingOpen;
  const wingY = s * 0.9;

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
      <ellipse
        cx={0}
        cy={s * 0.35}
        rx={s * wingOpen * 1.2}
        ry={s * 0.5}
        fill="none"
        stroke={light}
        strokeWidth={2}
        opacity={wingOpen * 0.35}
        filter={`url(#glow-${bf.id})`}
      />

      <defs>
        <radialGradient id={gId} cx="30%" cy="30%">
          <stop offset="0%" stopColor={light} />
          <stop offset="60%" stopColor={primary} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        <filter id={`glow-${bf.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Wings */}
      <path d={ltw} fill={`url(#${gId})`} stroke={light} strokeWidth={0.5} opacity={0.92} />
      <path d={rtw} fill={`url(#${gId})`} stroke={light} strokeWidth={0.5} opacity={0.92} />
      <path d={lbw} fill={`url(#${gId})`} stroke={primary} strokeWidth={0.5} opacity={0.82} />
      <path d={rbw} fill={`url(#${gId})`} stroke={primary} strokeWidth={0.5} opacity={0.82} />

      {/* Body */}
      <ellipse cx={0} cy={s * 0.4} rx={s * 0.07} ry={s * 0.4} fill={dark} stroke={light} strokeWidth={0.5} />

      {/* Antennae */}
      <path
        d={`M0,0 Q${-s * 0.2 * wingOpen},${-s * 0.5} ${-s * 0.15},${-s * 0.7}`}
        stroke={primary}
        strokeWidth={0.8}
        fill="none"
      />
      <path
        d={`M0,0 Q${s * 0.2 * wingOpen},${-s * 0.5} ${s * 0.15},${-s * 0.7}`}
        stroke={primary}
        strokeWidth={0.8}
        fill="none"
      />
      <circle cx={-s * 0.15} cy={-s * 0.7} r={s * 0.04} fill={light} />
      <circle cx={s * 0.15} cy={-s * 0.7} r={s * 0.04} fill={light} />
    </g>
  );
}
