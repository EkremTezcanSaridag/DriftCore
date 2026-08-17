import { Vector2D, BoundingBox } from './game';
import { IEntity } from './entities';

export interface Velocity extends Vector2D {
  angular: number;
}

export interface Acceleration extends Vector2D {
  angular: number;
}

export interface CollisionBox extends BoundingBox {
  circleRadius?: number;
}

export interface CollisionResult {
  collided: boolean;
  entityAId?: string;
  entityBId?: string;
  penetrationDepth?: number;
  contactPoint?: Vector2D;
}

export interface ICollisionSystem {
  checkCircleCollision(entityA: IEntity, entityB: IEntity): boolean;
  checkAABBCollision(boxA: BoundingBox, boxB: BoundingBox): boolean;
  checkCircleAABBCollision(circlePos: Vector2D, circleRadius: number, box: BoundingBox): boolean;
  checkCircleOutOfBounds(circlePos: Vector2D, circleRadius: number, arenaWidth: number, arenaHeight: number): boolean;
  resolveCollisions(entities: IEntity[]): CollisionResult[];
}
