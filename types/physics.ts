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

export interface DriftAnchor {
  id: string;
  name?: string;
  position: Vector2D; // x, y world coordinates
  radius: number;     // collision radius of the anchor post (e.g. 16px)
  activeRange: number;// reach range for hook laser (e.g. 170px)
  color?: string;
}

export interface SkidMark {
  id: string;
  leftWheel: Vector2D;
  rightWheel: Vector2D;
  opacity: number;
}

export interface CyberCarState {
  position: Vector2D;
  velocity: Vector2D;
  angle: number;       // in degrees (0 = UP, 90 = RIGHT, 180 = DOWN, 270 = LEFT)
  speed: number;       // px/sec
  isHooked: boolean;
  activeAnchorId: string | null;
  orbitRadius: number;
  orbitAngle: number;  // radians
  orbitDirection: number; // 1 = clockwise, -1 = counter-clockwise
  driftScoreMultiplier: number;
}

export interface LaserHookState {
  active: boolean;
  anchorPos: Vector2D;
  carPos: Vector2D;
  length: number;
  color: string;
}

export interface ICollisionSystem {
  checkCircleCollision(entityA: IEntity, entityB: IEntity): boolean;
  checkAABBCollision(boxA: BoundingBox, boxB: BoundingBox): boolean;
  checkCircleAABBCollision(circlePos: Vector2D, circleRadius: number, box: BoundingBox): boolean;
  checkCircleOutOfBounds(circlePos: Vector2D, circleRadius: number, arenaWidth: number, arenaHeight: number): boolean;
  resolveCollisions(entities: IEntity[]): CollisionResult[];
}
