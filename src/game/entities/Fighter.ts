import { Scene } from 'phaser';
import type { Skin } from '../domain/Skin';
import type { Direction } from '../utils/orientation';
import { Entity } from './Entity';

export enum FighterEvent {
  DAMAGED = 'damaged',
}

export type FighterClass<T extends Fighter = Fighter> = abstract new (...args: never[]) => T;

export class Fighter extends Entity {
  health: number;
  armor: number;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    readonly maxHealth: number,
    readonly maxArmor: number,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.health = maxHealth;
    this.armor = maxArmor;

    const radius = Math.min(this.width, this.height) / 2;

    this.setCircle(radius, this.width / 2 - radius, this.height / 2 - radius);
  }

  takeDamage(amount: number): void {
    if (this.health === 0) {
      return;
    }

    // Sans débordement : l'armure absorbe le coup entier tant qu'il en reste
    if (this.armor > 0) {
      this.armor = Math.max(0, this.armor - amount);
    } else {
      this.health = Math.max(0, this.health - amount);
    }

    this.emit(FighterEvent.DAMAGED, this);

    if (this.health === 0) {
      this.die();
    }
  }

  isWithin(distance: number, targets: Fighter | readonly Fighter[]): boolean {
    return [targets].flat().some((target) => target !== this && this.gap(target) <= distance);
  }

  protected walk(skin: Skin, direction: Direction): void {
    this.setDirection(direction);
    this.play(skin.walkAnimation(direction), true);
  }

  protected rest(skin: Skin): void {
    this.setVelocity(0, 0);
    this.stop();
    this.setTexture(skin.idleTexture, skin.idleFrame(this.direction));
  }

  protected die(): void {
    this.destroy();
  }

  protected get hurtboxRadius(): number {
    return Math.min(this.displayWidth, this.displayHeight) / 2;
  }

  /** px entre sa hurtbox et celle d'other, négatif quand elles se chevauchent. */
  private gap(other: Fighter): number {
    return Math.hypot(other.x - this.x, other.y - this.y) - this.hurtboxRadius - other.hurtboxRadius;
  }
}
