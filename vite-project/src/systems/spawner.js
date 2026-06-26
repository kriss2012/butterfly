export const WING_COLORS = [
  ["#7C3AED", "#C4B5FD", "#4C1D95"], // Violet/Purple
  ["#0EA5E9", "#BAE6FD", "#0C4A6E"], // Sky Blue
  ["#F59E0B", "#FDE68A", "#92400E"], // Amber/Orange
  ["#10B981", "#A7F3D0", "#064E3B"], // Emerald Green
  ["#EC4899", "#FBCFE8", "#831843"], // Pink
  ["#6366F1", "#C7D2FE", "#312E81"], // Indigo
];

export function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export function createButterfly(id, width, height, config = {}) {
  // Respect selected palette if custom colors are provided
  const palette = config.WING_COLORS || WING_COLORS;
  const colorSet = palette[Math.floor(Math.random() * palette.length)];
  
  const gravityRange = config.GRAVITY_Y || [-1.2, -0.3];
  const driftRange = config.DRIFT_AMPLITUDE || [0.3, 1.1];

  return {
    id,
    x: randomBetween(50, width - 50),
    y: randomBetween(height * 0.4, height - 50),
    vx: randomBetween(-0.4, 0.4),
    vy: randomBetween(gravityRange[0], gravityRange[1]), // negative = upward
    phase: Math.random() * Math.PI * 2,
    flapSpeed: randomBetween(0.06, 0.14),
    size: randomBetween(22, 42),
    opacity: randomBetween(0.7, 1),
    colorSet,
    trail: [],
    wobble: randomBetween(0.008, 0.025),
    age: 0,
    maxAge: randomBetween(400, 900),
    driftAmplitude: randomBetween(driftRange[0], driftRange[1]),
    driftFreq: randomBetween(0.008, 0.02),
  };
}
