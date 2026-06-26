export function createTrailDot(butterfly, tick, config = {}) {
  // Use the butterfly primary color or a custom override
  const trailColor = config.COLOR_TRAIL || butterfly.colorSet[0];
  const decay = config.TRAIL_DECAY || 0.025;
  return {
    id: `t${butterfly.id}-${tick}`,
    x: butterfly.x,
    y: butterfly.y + butterfly.size * 0.4,
    color: trailColor,
    opacity: 0.35,
    size: butterfly.size * 0.08,
    decay: decay,
  };
}

export function updateTrails(trails, newDots, maxLength = 200) {
  const live = trails
    .map(t => ({
      ...t,
      opacity: t.opacity - t.decay,
      size: t.size * 0.97
    }))
    .filter(t => t.opacity > 0.01);
  
  return [...live, ...newDots].slice(-maxLength);
}
