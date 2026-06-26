export const PHYSICS = {
  BUTTERFLY_CAP:      28,       // Maximum concurrent butterflies
  TRAIL_LENGTH:       200,      // Trail particle pool size
  TRAIL_DECAY:        0.025,    // Opacity loss per frame
  RESPAWN_RATE:       0.002,    // Probability of new spawn per tick
  REPULSION_RADIUS:   120,      // Mouse repulsion distance (px)
  REPULSION_FORCE:    0.6,      // Maximum repulsion acceleration
  GRAVITY_Y:          [-1.2, -0.3],  // [min, max] upward velocity
  DRIFT_AMPLITUDE:    [0.3, 1.1],    // [min, max] horizontal oscillation
};

export function driftForce(bf, tick) {
  return Math.sin(tick * bf.driftFreq + bf.phase) * bf.driftAmplitude;
}

export function repulsionForce(bf, mousePos, radius = 120, strength = 0.6) {
  if (!mousePos) return { x: 0, y: 0 };
  const dx = bf.x - mousePos.x;
  const dy = bf.y - mousePos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < radius && dist > 0) {
    const force = ((radius - dist) / radius) * strength;
    return {
      x: (dx / dist) * force,
      y: (dy / dist) * force
    };
  }
  return { x: 0, y: 0 };
}

export function windForce(bf, windAngleDegrees = 0, windStrength = 0) {
  if (windStrength === 0) return { x: 0, y: 0 };
  // Convert angle to radians
  const angleRad = (windAngleDegrees * Math.PI) / 180;
  return {
    x: Math.cos(angleRad) * windStrength * 0.2,
    y: Math.sin(angleRad) * windStrength * 0.2,
  };
}
