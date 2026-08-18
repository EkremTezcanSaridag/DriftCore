import { Vector2D } from '../../types/game';
import { CyberCarState, DriftAnchor } from '../../types/physics';

/**
 * DriftCore — Ultra-Responsive 2D Sling-Drift Physics Engine
 * Features progressive inward apex pull, oversteer body roll, and snappy slingshot release.
 */
export class DriftPhysicsSystem {
  /**
   * Update straight driving movement along current heading angle
   */
  public updateStraightMotion(car: CyberCarState, deltaTime: number): CyberCarState {
    const safeAngle = Number.isFinite(car.angle) ? car.angle : 0;
    const angleRad = (safeAngle * Math.PI) / 180;
    const vx = Math.sin(angleRad) * car.speed;
    const vy = -Math.cos(angleRad) * car.speed; // UP is negative Y

    return {
      ...car,
      position: {
        x: car.position.x + vx * deltaTime,
        y: car.position.y + vy * deltaTime,
      },
      velocity: { x: vx, y: vy },
    };
  }

  /**
   * Find the closest anchor within active reach range
   */
  public findBestAnchor(carPos: Vector2D, anchors: DriftAnchor[]): DriftAnchor | null {
    let closestAnchor: DriftAnchor | null = null;
    let minDistance = Infinity;

    for (const anchor of anchors) {
      const dx = carPos.x - anchor.position.x;
      const dy = carPos.y - anchor.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= anchor.activeRange && dist < minDistance) {
        minDistance = dist;
        closestAnchor = anchor;
      }
    }

    return closestAnchor;
  }

  /**
   * Attach laser hook to anchor and capture initial orbit radius
   */
  public attachHook(car: CyberCarState, anchor: DriftAnchor): CyberCarState {
    const dx = car.position.x - anchor.position.x;
    const dy = car.position.y - anchor.position.y;
    const actualDist = Math.max(30, Math.sqrt(dx * dx + dy * dy));
    const initialOrbitAngle = Math.atan2(dy, dx);

    // Determine orbit rotation direction via 2D cross product
    const safeAngle = Number.isFinite(car.angle) ? car.angle : 0;
    const angleRad = (safeAngle * Math.PI) / 180;
    const headingVx = Math.sin(angleRad);
    const headingVy = -Math.cos(angleRad);

    const crossProduct = dx * headingVy - dy * headingVx;
    const orbitDirection = crossProduct >= 0 ? 1 : -1;

    return {
      ...car,
      isHooked: true,
      activeAnchorId: anchor.id,
      orbitRadius: actualDist,
      orbitAngle: initialOrbitAngle,
      orbitDirection,
    };
  }

  /**
   * Update circular orbit drift motion with dynamic inward apex pull & oversteer
   */
  public updateOrbitMotion(car: CyberCarState, anchor: DriftAnchor, deltaTime: number): CyberCarState {
    // Dynamic Inward Pull: Tether tightens smoothly towards the anchor apex as you hold!
    const INWARD_PULL_SPEED = 24; // px/sec
    const minSafeRadius = Math.max(anchor.radius + 12, 34);
    const newRadius = Math.max(minSafeRadius, car.orbitRadius - INWARD_PULL_SPEED * deltaTime);

    // Higher angular speed as radius tightens (conservation of angular momentum feel)
    const angularSpeed = (car.speed / newRadius) * car.orbitDirection;
    const newOrbitAngle = car.orbitAngle + angularSpeed * deltaTime;

    const newX = anchor.position.x + Math.cos(newOrbitAngle) * newRadius;
    const newY = anchor.position.y + Math.sin(newOrbitAngle) * newRadius;

    // Tangent angle perpendicular to radius
    const tangentAngleRad = newOrbitAngle + (car.orbitDirection > 0 ? Math.PI / 2 : -Math.PI / 2);
    let baseAngleDeg = (tangentAngleRad * 180) / Math.PI + 90;
    baseAngleDeg = ((baseAngleDeg % 360) + 360) % 360;

    // Add +12° oversteer drift angle
    const driftOversteer = car.orbitDirection * 12;
    const visualCarAngle = (((baseAngleDeg + driftOversteer) % 360) + 360) % 360;

    const angleRad = (baseAngleDeg * Math.PI) / 180;
    const vx = Math.sin(angleRad) * car.speed;
    const vy = -Math.cos(angleRad) * car.speed;

    return {
      ...car,
      position: { x: newX, y: newY },
      velocity: { x: vx, y: vy },
      angle: visualCarAngle,
      orbitRadius: newRadius,
      orbitAngle: newOrbitAngle,
    };
  }

  /**
   * Release hook and launch tangentially with forward impulse
   */
  public releaseHook(car: CyberCarState): CyberCarState {
    const tangentAngleRad = car.orbitAngle + (car.orbitDirection > 0 ? Math.PI / 2 : -Math.PI / 2);
    let launchAngle = (tangentAngleRad * 180) / Math.PI + 90;
    launchAngle = ((launchAngle % 360) + 360) % 360;

    const angleRad = (launchAngle * Math.PI) / 180;
    const vx = Math.sin(angleRad) * car.speed;
    const vy = -Math.cos(angleRad) * car.speed;

    return {
      ...car,
      isHooked: false,
      activeAnchorId: null,
      angle: launchAngle,
      velocity: { x: vx, y: vy },
    };
  }
}

export const driftPhysicsSystem = new DriftPhysicsSystem();
