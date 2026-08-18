import { Vector2D } from '../../types/game';
import { CyberCarState, DriftAnchor } from '../../types/physics';

/**
 * DriftCore — 2D Cyber Sling-Drift Physics Engine
 * Computes straight line motion, circular orbit drift dynamics, and tangential release mechanics.
 */
export class DriftPhysicsSystem {
  /**
   * Update straight driving movement along current heading angle
   */
  public updateStraightMotion(car: CyberCarState, deltaTime: number): CyberCarState {
    const angleRad = (car.angle * Math.PI) / 180;
    const vx = Math.sin(angleRad) * car.speed;
    const vy = -Math.cos(angleRad) * car.speed; // UP is negative Y in 2D canvas

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
   * Find the closest anchor within active hook reach range
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
    const radius = Math.max(25, Math.sqrt(dx * dx + dy * dy));
    const initialOrbitAngle = Math.atan2(dy, dx);

    // Determine orbit rotation direction (clockwise vs counter-clockwise) via 2D cross product
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
   * Update circular orbit drift motion around active anchor
   */
  public updateOrbitMotion(car: CyberCarState, anchor: DriftAnchor, deltaTime: number): CyberCarState {
    const angularSpeed = (car.speed / Math.max(20, car.orbitRadius)) * car.orbitDirection;
    const newOrbitAngle = car.orbitAngle + angularSpeed * deltaTime;

    const newX = anchor.position.x + Math.cos(newOrbitAngle) * car.orbitRadius;
    const newY = anchor.position.y + Math.sin(newOrbitAngle) * car.orbitRadius;

    // Tangent heading angle perpendicular to radius
    const tangentAngleRad = newOrbitAngle + (car.orbitDirection > 0 ? Math.PI / 2 : -Math.PI / 2);
    let newCarAngle = (tangentAngleRad * 180) / Math.PI + 90;
    newCarAngle = ((newCarAngle % 360) + 360) % 360;

    const angleRad = (newCarAngle * Math.PI) / 180;
    const vx = Math.sin(angleRad) * car.speed;
    const vy = -Math.cos(angleRad) * car.speed;

    return {
      ...car,
      position: { x: newX, y: newY },
      velocity: { x: vx, y: vy },
      angle: newCarAngle,
      orbitAngle: newOrbitAngle,
    };
  }

  /**
   * Release hook and transition back to straight tangential flight
   */
  public releaseHook(car: CyberCarState): CyberCarState {
    return {
      ...car,
      isHooked: false,
      activeAnchorId: null,
    };
  }
}

export const driftPhysicsSystem = new DriftPhysicsSystem();
