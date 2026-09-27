import { Scene } from 'phaser';
import { SPRITE_SIZE } from '../core/settings';
import { hasObstacle } from '../utils/collision';
import { Entity } from './Entity';

export type ProjectileAnimation = {
  /** Rotation du sprite en degrés par seconde. */
  spin?: number;
  /** Clé d'une animation Phaser jouée en boucle (texture spritesheet requise). */
  key?: string;
};

export type ProjectileConfig = {
  angle: number;
  speed: number;
  range: number;
  /** Angle (radians) vers lequel pointe l'asset dans son image source. */
  assetAngle?: number;
  ignoreWalls?: boolean;
  crossBody?: boolean;
  animation?: ProjectileAnimation;
};

export class Projectile extends Entity {
  private readonly startX: number;
  private readonly startY: number;
  private readonly range: number;
  private readonly ignoreWalls: boolean;
  private readonly crossBody: boolean;

  constructor(scene: Scene, x: number, y: number, texture: string, config: ProjectileConfig) {
    super(scene, x, y, texture);
    this.startX = x;
    this.startY = y;
    this.speed = config.speed;
    this.range = config.range;
    this.ignoreWalls = config.ignoreWalls ?? false;
    this.crossBody = config.crossBody ?? true;
    this.assetAngle = config.assetAngle;
    this.setScale(SPRITE_SIZE / 2 / this.width);
    this.setCollideWorldBounds(false);
    this.setVelocity(Math.cos(config.angle) * this.speed, Math.sin(config.angle) * this.speed);
    this.orientTo(config.angle);

    if (config.animation?.spin) {
      this.setAngularVelocity(config.animation.spin);
    }

    if (config.animation?.key) {
      this.play(config.animation.key);
    }
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    if (this.outOfRange() || !this.scene.physics.world.bounds.contains(this.x, this.y) || this.hitsObstacle()) {
      this.destroy();
    }
  }

  private outOfRange(): boolean {
    return Math.hypot(this.x - this.startX, this.y - this.startY) >= this.range;
  }

  private hitsObstacle(): boolean {
    const { width, height } = this.body || { width: 0, height: 0 };

    return hasObstacle(this.scene, this.x, this.y, width, height, {
      walls: !this.ignoreWalls,
      mobs: !this.crossBody,
    });
  }
}
