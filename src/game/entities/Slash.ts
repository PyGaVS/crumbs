import { Animations, GameObjects, Scene } from 'phaser';
import { orient } from '../utils/orientation';
import type { Fx } from './Fx';

export type SlashConfig = {
  angle: number;
  /** Largeur affichée en px. */
  size: number;
  mirrored: boolean;
  /** ms ; absente, le frameRate de l'animation fait foi. */
  duration?: number;
};

/** Une entaille, purement visuelle : disparaît avec son animation. */
export class Slash extends GameObjects.Sprite {
  constructor(scene: Scene, x: number, y: number, fx: Fx, { angle, size, mirrored, duration }: SlashConfig) {
    super(scene, x, y, fx.textureKey);
    scene.add.existing(this);
    this.setScale(size / this.width);
    orient(this, angle, fx.assetAngle, mirrored);
    // Phaser ignore duration dès que l'animation a un frameRate
    const frameRate = duration && (scene.anims.get(fx.animation).getTotalFrames() * 1000) / duration;
    this.play(frameRate ? { key: fx.animation, frameRate } : fx.animation);
    this.once(Animations.Events.ANIMATION_COMPLETE, () => this.destroy());
  }
}
