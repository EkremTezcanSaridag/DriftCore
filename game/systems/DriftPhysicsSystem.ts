import { Vector2D } from '../../types/game';
import { CyberCarState, DriftAnchor } from '../../types/physics';

/**
 * DriftCore — Ultra-Responsive 2D Sling-Drift Physics Engine
 * Features elastic hook tethering, drift oversteer angle, dynamic angular momentum and snappy tangential launch.
 */
export class DriftPhysicsSystem {
  /**
   * Update straight driving movement along current heading angle
   */
  public updateStraightMotion(car: CyberCarState, deltaTime: number): CyberCarState {
    const angleRad = (car.angle * Math.PI) / 180;
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
   * Attach laser hook to anchor and compute initial orbit radius and direction
   */
  public attachHook(car: CyberCarState, anchor: DriftAnchor): CyberCarState {
    const dx = car.position.x - anchor.position.x;
    const dy = car.position.y - anchor.position.y;
    const radius = Math.max(30, Math.sqrt(dx * dx + dy * dy));
    const initialOrbitAngle = Math.atan2(dy, dx);

    // Determine orbit rotation direction via 2D cross product
    const angleRad = (car.angle * Math.PI) / 180;
    const headingVx = Math.sin(angleRad);
    const headingVy = -Math.cos(angleRad);

    const crossProduct = dx * headingVy - dy * headingVx;
    const orbitDirection = crossProduct >= 0 ? 1 : -1;

    return {
      ...car,
      isHooked: true,
      activeAnchorId: anchor.id,
      orbitRadius: radius,
      orbitAngle: initialOrbitAngle,
      orbitDirection,
    };
  }

  /**
   * Update circular orbit drift motion with oversteer angle and centripetal tension
   */
  public updateOrbitMotion(car: CyberCarState, anchor: DriftAnchor, deltaTime: number): CyberCarState {
    // Angular speed inversely proportional to radius with higher torque
    const angularSpeed = (car.speed / Math.max(25, car.orbitRadius)) * car.orbitDirection * 1.05;
    const newOrbitAngle = car.orbitAngle + angularSpeed * deltaTime;

    // Slight elastic tether contraction for snappy drift feel
    const newRadius = Math.max(35, car.orbitRadius - 10 * deltaTime);

    const newX = anchor.position.x + Math.cos(newOrbitAngle) * newRadius;
    const newY = anchor.position.y + Math.sin(newOrbitAngle) * newRadius;

    // Tangent angle perpendicular to radius
    const tangentAngleRad = newOrbitAngle + (car.orbitDirection > 0 ? Math.PI / 2 : -Math.PI / 2);
    let baseAngleDeg = (tangentAngleRad * 180) / Math.PI + 90;
    baseAngleDeg = ((baseAngleDeg % 360) + 360) % 360;

    // Add +12° drift oversteer tail-kick angle for visual/physics juiciness
    const driftOversteer = car.orbitDirection * 14;
    const visualCarAngle = ((baseAngleDeg + driftOversteer % 360) + 360) % 360;

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
   * Release hook and launch tangentially with snappy forward impulse
   */
  public releaseHook(car: CyberCarState): CyberCarState {
    // Realign velocity vector with heading upon release
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
