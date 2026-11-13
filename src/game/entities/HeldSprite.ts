import { orient, type Point } from '../utils/orientation';
import { Attachment } from './Attachment';
import type { Entity } from './Entity';
import type { Playback } from './Playback';

/** Un sprite tenu sur l'axe du regard d'une lecture, placé comme l'arme mais au-dessus d'elle, détruit avec la lecture. */
export class HeldSprite extends Attachment<Entity> {
  /** Centre du sprite autour de l'entité, en px décrits regard à droite. */
  position: Point = [0, 0];

  constructor(
    private readonly playback: Playback,
    texture: string,
    private readonly assetAngle?: number,
  ) {
    super(playback.entity, texture);
  }

  protected follow(): void {
    if (!this.playback.playing) {
      this.destroy();

      return;
    }

    const { facing } = this.playback;

    this.setPosition(...facing.place(this.target.x, this.target.y, ...this.position));

    if (this.assetAngle !== undefined) {
      orient(this, facing.angle, this.assetAngle);
    }

    this.layer(facing.direction);

    if (this.target.heldWeapon) {
      this.scene.children.moveAbove(this, this.target.heldWeapon);
    }
  }
}
