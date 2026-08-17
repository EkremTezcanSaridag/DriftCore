import { IEntity, EntityType } from '../../types/entities';
import { Vector2D, BoundingBox } from '../../types/game';

export abstract class BaseEntity implements IEntity {
  public id: string;
  public type: EntityType;
  public position: Vector2D;
  public velocity: Vector2D;
  public rotation: number;
  public radius: number;
  public active: boolean;
  public bounds: BoundingBox;

  constructor(id: string, type: EntityType, x: number, y: number, radius: number) {
    this.id = id;
    this.type = type;
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.rotation = 0;
    this.radius = radius;
    this.active = true;
    this.bounds = {
      x: x - radius,
      y: y - radius,
      width: radius * 2,
      height: radius * 2,
    };
  }
}
