import { GameObjects, Geom, Scene } from 'phaser';
import { Inputs } from '../data/enums/Inputs';
import { Cardinal, Diagonal } from '../utils/input';
import { FRAME_MS, SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';

export type Direction = Cardinal;

/** Déplacement unitaire par direction. Attention : dans Phaser l'axe Y pointe vers le BAS (inverse d'Arcade). */
const MOVES: Record<Direction, readonly [number, number]> = {
  [Inputs.RIGHT]: [1, 0],
  [Inputs.LEFT]: [-1, 0],
  [Inputs.UP]: [0, -1],
  [Inputs.DOWN]: [0, 1]
};
export class Entity extends GameObjects.Sprite {
  direction: Direction = Inputs.RIGHT;
  speed = 5;

  private readonly hitBox = new Geom.Rectangle();

  constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
  }

  forward(delta: number, boost = 0): void {
    const speed = (this.speed + boost) * (delta / FRAME_MS);
    const [dx, dy] = MOVES[this.direction];

    this.x += dx * speed;
    this.y += dy * speed;
  }

  /** Fait demi-tour quand l'entité touche un bord de l'écran. */
  checkBorder(): void {
    const halfWidth = this.displayWidth / 2;
    const halfHeight = this.displayHeight / 2;

    if (this.x + halfWidth >= SCREEN_WIDTH) {
      this.setDirection(Inputs.LEFT);
    } else if (this.x - halfWidth <= 1) {
      this.setDirection(Inputs.RIGHT);
    } else if (this.y - halfHeight <= 1) {
      this.setDirection(Inputs.DOWN);
    } else if (this.y + halfHeight >= SCREEN_HEIGHT) {
      this.setDirection(Inputs.UP);
    }
  }

  setDirection(direction: Direction): void {
    this.direction = direction;
  }

  isCloseTo(pos: { x: number; y: number }, range = 150): boolean {
    return Math.abs(this.x - pos.x) < range && Math.abs(this.y - pos.y) < range;
  }

  /**
   * Rectangle de collision centré sur le sprite, sans tenir compte de la rotation
   * (Pac-man est rond : tourner le sprite ne change pas sa forme réelle).
   */
  getHitBox(): Geom.Rectangle {
    return this.hitBox.setTo(
      this.x - this.displayWidth / 2,
      this.y - this.displayHeight / 2,
      this.displayWidth,
      this.displayHeight,
    );
  }

  collidesWith(other: Entity): boolean {
    return Geom.Intersects.RectangleToRectangle(this.getHitBox(), other.getHitBox());
  }
}
