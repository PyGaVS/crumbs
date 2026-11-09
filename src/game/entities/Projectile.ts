import { Scene, Tweens } from 'phaser';
import { SPRITE_SIZE } from '../core/settings';
import { frameRateOver } from '../utils/animation';
import { hasObstacle } from '../utils/collision';
import { touchedMobs } from '../utils/combat';
import { Facing, polar } from '../utils/orientation';
import { SpritePlayback } from '../data/enums/SpritePlayback';
import type { Ease, Hitbox } from '../domain/Animation';
import { Entity } from './Entity';
import type { Mob } from './Mob';
import type { EaseFunction } from './Playback';
import type { ProjectileSkin } from '../domain/ProjectileSkin';

export type ProjectileConfig = {
  angle: number;
  /** px par seconde, en moyenne sur la course. */
  speed: number;
  range: number;
  damage: number;
  /** Décrites regard à droite autour du projectile, tournées vers sa trajectoire. */
  hitboxes: readonly Hitbox[];
  /** Largeur affichée en px. */
  size?: number;
  /** Progression le long de la course, linéaire par défaut. */
  ease?: Ease;
  ignoreWalls?: boolean;
  crossBody?: boolean;
};

export class Projectile extends Entity {
  private readonly startX: number;
  private readonly startY: number;
  private readonly range: number;
  /** ms */
  private readonly duration: number;
  private readonly ease: EaseFunction;
  private elapsed = 0;
  private readonly ignoreWalls: boolean;
  private readonly crossBody: boolean;
  private readonly damage: number;
  private readonly facing: Facing;
  private readonly hitboxes: readonly Hitbox[];
  /** Mobs déjà touchés : chacun ne prend les dégâts qu'une seule fois. */
  private readonly mobsHit = new Set<Mob>();

  constructor(scene: Scene, x: number, y: number, skin: ProjectileSkin, config: ProjectileConfig) {
    super(scene, x, y, skin.textureKey);
    this.startX = x;
    this.startY = y;
    this.range = config.range;
    this.duration = (config.range / config.speed) * 1000;
    this.ease = Tweens.Builders.GetEaseFunction(config.ease ?? 'Linear') as EaseFunction;
    this.damage = config.damage;
    this.facing = new Facing(config.angle);
    this.hitboxes = config.hitboxes;
    this.ignoreWalls = config.ignoreWalls ?? false;
    this.crossBody = config.crossBody ?? true;
    this.assetAngle = skin.assetAngle;
    this.setScale((config.size ?? SPRITE_SIZE / 2) / this.width);
    this.setCollideWorldBounds(false);
    this.orientTo(config.angle);

    if (skin.spin) {
      this.setAngularVelocity(skin.spin);
    }

    if (skin.animation) {
      this.fly(skin.animation, skin.playback);
    }
  }

  private fly(key: string, playback: SpritePlayback): void {
    switch (playback) {
      case SpritePlayback.LOOP:
        this.play({ key, repeat: -1 });
        break;
      case SpritePlayback.LIFETIME:
        this.play({ key, repeat: 0, frameRate: frameRateOver(this.scene, key, this.duration) });
        break;
    }
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.advance(delta);
    this.damageMobs();

    if (!this.active) {
      return;
    }

    if (
      this.elapsed >= this.duration ||
      !this.scene.physics.world.bounds.contains(this.x, this.y) ||
      this.hitsObstacle()
    ) {
      this.destroy();
    }
  }

  private advance(delta: number): void {
    this.elapsed = Math.min(this.duration, this.elapsed + delta);
    const distance = this.range * this.ease(this.elapsed / this.duration);

    this.setPosition(...polar(this.startX, this.startY, this.facing.angle, distance));
  }

  private damageMobs(): void {
    for (const mob of touchedMobs(this, this.facing, this.hitboxes)) {
      if (this.mobsHit.has(mob)) {
        continue;
      }

      this.mobsHit.add(mob);
      mob.takeDamage(this.damage);

      if (!this.crossBody) {
        this.destroy();
        return;
      }
    }
  }

  private hitsObstacle(): boolean {
    const { width, height } = this.body || { width: 0, height: 0 };

    return hasObstacle(this.scene, this.x, this.y, width, height, { walls: !this.ignoreWalls, mobs: false });
  }
}
