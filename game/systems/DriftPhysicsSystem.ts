import { Vector2D } from '../../types/game';
import { CyberCarState, DriftAnchor } from '../../types/physics';

/**
 * DriftCore — Ultra-Responsive 2D Sling-Drift Physics Engine
 * Bulletproof circular orbit drift dynamics, smooth continuous tethering, and snappy launch.
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
   * Attach laser hook to anchor and compute initial orbit radius without teleportation
   */
  public attachHook(car: CyberCarState, anchor: DriftAnchor): CyberCarState {
    const dx = car.position.x - anchor.position.x;
    const dy = car.position.y - anchor.position.y;
    const actualDist = Math.max(25, Math.sqrt(dx * dx + dy * dy));
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
   * Update circular orbit drift motion with oversteer angle
   */
  public updateOrbitMotion(car: CyberCarState, anchor: DriftAnchor, deltaTime: number): CyberCarState {
    const safeRadius = Math.max(25, car.orbitRadius);
    const angularSpeed = (car.speed / safeRadius) * car.orbitDirection;
    const newOrbitAngle = car.orbitAngle + angularSpeed * deltaTime;

    const newX = anchor.position.x + Math.cos(newOrbitAngle) * safeRadius;
    const newY = anchor.position.y + Math.sin(newOrbitAngle) * safeRadius;

    // Tangent angle perpendicular to radius
    const tangentAngleRad = newOrbitAngle + (car.orbitDirection > 0 ? Math.PI / 2 : -Math.PI / 2);
    let baseAngleDeg = (tangentAngleRad * 180) / Math.PI + 90;
    baseAngleDeg = ((baseAngleDeg % 360) + 360) % 360;

    // Add +10° drift oversteer tail-kick angle
    const driftOversteer = car.orbitDirection * 10;
    const visualCarAngle = (((baseAngleDeg + driftOversteer) % 360) + 360) % 360;

    const angleRad = (baseAngleDeg * Math.PI) / 180;
    const vx = Math.sin(angleRad) * car.speed;
    const vy = -Math.cos(angleRad) * car.speed;

    return {
      ...car,
      position: { x: newX, y: newY },
      velocity: { x: vx, y: vy },
      angle: visualCarAngle,
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
