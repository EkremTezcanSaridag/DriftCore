import { IEntity } from '../../types/entities';

/**
 * DriftCore — Movement System Interface
 */
export interface IMovementSystem {
  updateEntities(entities: IEntity[], deltaTime: number): void;
}

export class MovementSystem implements IMovementSystem {
  updateEntities(entities: IEntity[], deltaTime: number): void {
    for (const entity of entities) {
      if (!entity.active) continue;

      // Position update using velocity vector
      entity.position.x += entity.velocity.x * deltaTime;
      entity.position.y += entity.velocity.y * deltaTime;

      // Bounds synchronization
      entity.bounds.x = entity.position.x - entity.radius;
      entity.bounds.y = entity.position.y - entity.radius;
    }
  }
}

export const movementSystem = new MovementSystem();
