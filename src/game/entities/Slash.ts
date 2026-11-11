import { Animations, GameObjects, Scene } from 'phaser';
import { frameRateOver } from '../utils/animation';
import { orient } from '../utils/orientation';
import type { Fx } from '../domain/Fx';

export type SlashConfig = {
  /** Absent, l'effet reste droit. */
  angle?: number;
  /** Largeur affichée en px. */
  size: number;
  mirrored?: boolean;
  /** ms ; absente, le frameRate de l'animation fait foi. */
  duration?: number;
  /** Multipliée aux couleurs de l'effet. */
  tint?: number;
};

/** Un effet visuel, l'entaille par exemple : disparaît avec son animation. */
export class Slash extends GameObjects.Sprite {
  constructor(scene: Scene, x: number, y: number, fx: Fx, { angle, size, mirrored, duration, tint }: SlashConfig) {
    super(scene, x, y, fx.textureKey);
    scene.add.existing(this);
    this.setScale(size / this.width);

    if (angle !== undefined) {
      orient(this, angle, fx.assetAngle, mirrored);
    }

    if (tint !== undefined) {
      this.setTint(tint);
    }

    const frameRate = duration && frameRateOver(scene, fx.animation, duration);
    this.play(frameRate ? { key: fx.animation, frameRate } : fx.animation);
    this.once(Animations.Events.ANIMATION_COMPLETE, () => this.destroy());
  }
}
