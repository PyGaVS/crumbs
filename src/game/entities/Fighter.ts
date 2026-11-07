import { Scene } from 'phaser';
import { Entity } from './Entity';

export enum FighterEvent {
  DAMAGED = 'damaged',
}

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

  protected die(): void {
    this.destroy();
  }
}
