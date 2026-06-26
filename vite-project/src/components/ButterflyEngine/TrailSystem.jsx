import React from "react";

export function TrailDot({ x, y, color, opacity, size }) {
  return <circle cx={x} cy={y} r={size} fill={color} opacity={opacity} />;
}

export function TrailSystem({ trails }) {
  return (
    <>
      {trails.map((t) => (
        <TrailDot
          key={t.id}
          x={t.x}
          y={t.y}
          color={t.color}
          opacity={t.opacity}
          size={t.size}
        />
      ))}
    </>
  );
}
