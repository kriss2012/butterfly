import { driftForce, repulsionForce, windForce } from "../../systems/antigravity";
import { createButterfly } from "../../systems/spawner";
import { createTrailDot, updateTrails } from "../../systems/particles";

export function tickPhysics(butterflies, trails, tick, mousePos, dims, config, scrollVelocity = 0) {
  const newTrailParts = [];
  
  const updatedButterflies = butterflies.map(bf => {
    // 1. Trail creation every 3 ticks
    if (tick % 3 === 0) {
      newTrailParts.push(createTrailDot(bf, tick, config));
    }

    // 2. Compute forces
    const base = { x: bf.x + bf.vx, y: bf.y + bf.vy };
    const drift = driftForce(bf, tick);
    
    // Repulsion from mouse
    const repel = repulsionForce(
      bf,
      mousePos,
      config.REPULSION_RADIUS,
      config.REPULSION_FORCE
    );
    
    // Wind force
    const wind = windForce(bf, config.WIND_ANGLE, config.WIND_STRENGTH);

    // Scroll force (moving down pushes butterflies up)
    const scrollPush = -scrollVelocity * 6;

    // 3. Apply forces
    let nextX = base.x + drift + repel.x + wind.x;
    let nextY = base.y + repel.y + wind.y + scrollPush;
    const nextAge = bf.age + 1;

    // Fade out near end of life
    const fadeOut = nextAge > bf.maxAge * 0.8
      ? 1 - (nextAge - bf.maxAge * 0.8) / (bf.maxAge * 0.2)
      : 1;

    // 4. Respawn when offscreen or aged out
    if (nextY < -80 || nextAge > bf.maxAge) {
      return createButterfly(bf.id, dims.width, dims.height, config);
    }

    // Bounce horizontal edges
    let vxBounced = bf.vx;
    if (nextX < 10) {
      nextX = 10;
      vxBounced = Math.abs(bf.vx); // Move right
    } else if (nextX > dims.width - 10) {
      nextX = dims.width - 10;
      vxBounced = -Math.abs(bf.vx); // Move left
    }

    return {
      ...bf,
      x: nextX,
      y: nextY,
      vx: vxBounced,
      age: nextAge,
      opacity: Math.min(bf.opacity, fadeOut)
    };
  });

  // Update trails
  const updatedTrails = updateTrails(trails, newTrailParts, config.TRAIL_LENGTH);

  return {
    butterflies: updatedButterflies,
    trails: updatedTrails
  };
}
