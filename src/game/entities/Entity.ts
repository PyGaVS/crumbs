import { GameObjects, Geom, Scene } from 'phaser';
import { FRAME_MS, SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';

export type Direction = 'R' | 'L' | 'U' | 'D' | 'RU' | 'LU' | 'LD' | 'RD';

/** Déplacement unitaire par direction. Attention : dans Phaser l'axe Y pointe vers le BAS (inverse d'Arcade). */
const MOVES: Record<Direction, readonly [number, number]> = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, -1],
  D: [0, 1],
  RU: [1, -1],
  LU: [-1, -1],
  LD: [-1, 1],
  RD: [1, 1],
};
export class Entity extends GameObjects.Sprite {
  direction: Direction = 'R';
  speed = 5;

  private readonly hitBox = new Geom.Rectangle();

  constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
  }

  /** Avance dans la direction courante. `delta` (ms) sert à normaliser la vitesse à 60 FPS. */
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
      this.setDirection('L');
    } else if (this.x - halfWidth <= 1) {
      this.setDirection('R');
    } else if (this.y - halfHeight <= 1) {
      this.setDirection('D');
    } else if (this.y + halfHeight >= SCREEN_HEIGHT) {
      this.setDirection('U');
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
