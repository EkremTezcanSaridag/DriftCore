import { IEntity } from '../../types/entities';
import { BoundingBox, Vector2D } from '../../types/game';
import { ICollisionSystem, CollisionResult } from '../../types/physics';

/**
 * DriftCore — Collision System Architecture Abstraction
 */
export class CollisionSystem implements ICollisionSystem {
  public checkCircleCollision(entityA: IEntity, entityB: IEntity): boolean {
    const dx = entityA.position.x - entityB.position.x;
    const dy = entityA.position.y - entityB.position.y;
    const distanceSq = dx * dx + dy * dy;
    const radiusSum = entityA.radius + entityB.radius;
    return distanceSq <= radiusSum * radiusSum;
  }

  public checkAABBCollision(boxA: BoundingBox, boxB: BoundingBox): boolean {
    return (
      boxA.x < boxB.x + boxB.width &&
      boxA.x + boxA.width > boxB.x &&
      boxA.y < boxB.y + boxB.height &&
      boxA.y + boxA.height > boxB.y
    );
  }

  public checkCircleAABBCollision(circlePos: Vector2D, circleRadius: number, box: BoundingBox): boolean {
    const closestX = Math.max(box.x, Math.min(circlePos.x, box.x + box.width));
    const closestY = Math.max(box.y, Math.min(circlePos.y, box.y + box.height));

    const dx = circlePos.x - closestX;
    const dy = circlePos.y - closestY;

    return dx * dx + dy * dy <= circleRadius * circleRadius;
  }

  public checkCircleOutOfBounds(circlePos: Vector2D, circleRadius: number, arenaWidth: number, arenaHeight: number): boolean {
    return (
      circlePos.x - circleRadius <= 0 ||
      circlePos.x + circleRadius >= arenaWidth ||
      circlePos.y - circleRadius <= 0 ||
      circlePos.y + circleRadius >= arenaHeight
    );
  }

  public resolveCollisions(entities: IEntity[]): CollisionResult[] {
    const results: CollisionResult[] = [];
    const activeEntities = entities.filter((e) => e.active);

    for (let i = 0; i < activeEntities.length; i++) {
      for (let j = i + 1; j < activeEntities.length; j++) {
        const a = activeEntities[i];
        const b = activeEntities[j];

        if (this.checkCircleCollision(a, b)) {
          results.push({
            collided: true,
            entityAId: a.id,
            entityBId: b.id,
          });
        }
      }
    }

    return results;
  }
}

export const collisionSystem = new CollisionSystem();
