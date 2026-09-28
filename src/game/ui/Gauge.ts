import { GameObjects, Scene, TintModes } from 'phaser';

/** Contour en texels des images de barre, hors jauge. */
const BORDER = 1;

/** Jauge en pixel art, ancrée par son coin haut gauche. */
export class Gauge extends GameObjects.Container {
  private readonly fill: GameObjects.Image;

  constructor(scene: Scene, x: number, y: number, scale: number, color?: number) {
    super(scene, x, y);
    const under = new GameObjects.Image(scene, 0, 0, 'lifeBarMini-under').setOrigin(0);
    this.fill = new GameObjects.Image(scene, 0, 0, 'lifeBarMini-progress').setOrigin(0);

    if (color !== undefined) {
      this.fill.setTint(color).setTintMode(TintModes.FILL);
    }

    this.add([under, this.fill]);
    this.setScale(scale);
    this.setDepth(1);
    this.setRatio(1);
    scene.add.existing(this);
  }

  get barWidth(): number {
    return this.fill.width * this.scaleX;
  }

  get barHeight(): number {
    return this.fill.height * this.scaleY;
  }

  /** ratio dans [0, 1] ; la jauge se vide par la droite. */
  setRatio(ratio: number): void {
    const { width, height } = this.fill;
    this.fill.setCrop(BORDER, BORDER, (width - 2 * BORDER) * ratio, height - 2 * BORDER);
  }
}
