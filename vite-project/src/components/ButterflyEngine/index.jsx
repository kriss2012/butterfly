import React from "react";
import { ButterflyShape } from "./ButterflyShape";
import { TrailSystem } from "./TrailSystem";

export default function ButterflyEngine({ butterflies, trails, tick, dims, mousePos, repulsionRadius = 120 }) {
  return (
    <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "hidden" }}>
      {/* Ambient background particles (stars/dust) */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i}
            cx={`${(i * 2.5 + 3) % 100}%`}
            cy={`${(i * 3.7 + 5) % 100}%`}
            r={i % 5 === 0 ? 1.5 : 0.8}
            fill="white"
            opacity={(Math.sin(tick * 0.02 + i) + 1) / 2 * 0.3 + 0.15}
          />
        ))}
      </svg>

      {/* Main SVG canvas */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox={`0 0 ${dims.width || 900} ${dims.height || 600}`}
        preserveAspectRatio="none"
      >
        {/* Trail particles */}
        <TrailSystem trails={trails} />

        {/* Butterflies */}
        {butterflies.map(bf => (
          <ButterflyShape key={bf.id} bf={bf} tick={tick} />
        ))}

        {/* Mouse cursor ring */}
        {mousePos && (
          <g opacity={0.4}>
            <circle
              cx={mousePos.x}
              cy={mousePos.y}
              r={repulsionRadius}
              fill="none"
              stroke="var(--color-ascent, #7C3AED)"
              strokeWidth={0.75}
              strokeDasharray="4 8"
            />
            <circle
              cx={mousePos.x}
              cy={mousePos.y}
              r={4}
              fill="var(--color-trail, #C4B5FD)"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
