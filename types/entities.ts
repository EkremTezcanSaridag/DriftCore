import { Vector2D, BoundingBox } from './game';

export enum EntityType {
  PLAYER = 'PLAYER',
  OBSTACLE = 'OBSTACLE',
  ENERGY_SHARD = 'ENERGY_SHARD',
  PARTICLE = 'PARTICLE',
}

export enum MovementPattern {
  STATIC = 'STATIC',
  LINEAR = 'LINEAR',
  CIRCULAR = 'CIRCULAR',
  DRIFT = 'DRIFT',
  PULSING = 'PULSING',
}

export interface IEntity {
  id: string;
  type: EntityType;
  position: Vector2D;
  velocity: Vector2D;
  rotation: number;
  radius: number;
  active: boolean;
  bounds: BoundingBox;
}

export interface IPlayer extends IEntity {
  energy: number;
  maxEnergy: number;
  driftAngle: number;
  speedMultiplier: number;
  shieldActive: boolean;
}

export interface IObstacle extends IEntity {
  obstacleType: 'ASTEROID' | 'BARRIER' | 'LASER_GRID';
  damage: number;
  rotationSpeed: number;
  movementPattern: MovementPattern;
}

export interface IEnergyShard extends IEntity {
  value: number;
  collected: boolean;
  magnetized: boolean;
}
