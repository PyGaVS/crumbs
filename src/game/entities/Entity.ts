import { Physics, Scene } from 'phaser';
import { Inputs } from '../data/enums/Inputs';
import { Direction } from '../utils/types';

/** Déplacement unitaire par direction. Attention : dans Phaser l'axe Y pointe vers le BAS (inverse d'Arcade). */
const MOVES: Record<Direction, readonly [number, number]> = {
  [Inputs.RIGHT]: [1, 0],
  [Inputs.LEFT]: [-1, 0],
  [Inputs.UP]: [0, -1],
  [Inputs.DOWN]: [0, 1],
};

export class Entity extends Physics.Arcade.Sprite {
  direction: Direction = Inputs.RIGHT;
  /** px par seconde. */
  speed = 300;
  /** Angle (radians) vers lequel pointe l'asset dans son image source. */
  assetAngle?: number;

  constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  setDirection(direction: Direction): void {
    this.direction = direction;

    const [dx, dy] = MOVES[direction];

    this.setVelocity(dx * this.speed, dy * this.speed);
    this.orientTo(Math.atan2(dy, dx));
  }

  orientTo(angle: number): void {
    if (this.assetAngle !== undefined) {
      this.setRotation(angle - this.assetAngle);
    }
  }

  isCloseTo(pos: { x: number; y: number }, range = 150): boolean {
    return Math.abs(this.x - pos.x) < range && Math.abs(this.y - pos.y) < range;
  }
}
