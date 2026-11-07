import { GameObjects } from 'phaser';
import { FACING_ANGLES, type Facing, orient, polar } from '../utils/orientation';
import { Attachment } from './Attachment';
import type { Skin } from './Skin';
import type { WeaponSkin } from './WeaponSkin';

/** Pose dans le repère du regard : angle local (radians), rayon et pivot en px. */
export type WeaponPose = { angle: number; radius: number; pivot: number };

export type WeaponGrip = { readonly facing: Facing; readonly pose: WeaponPose; mirror: boolean };

/** L'arme en main, recalée chaque frame sur la main que montre la frame du skin, sauf quand une animation la tient. */
export class HeldWeapon extends Attachment {
  private grip?: WeaponGrip;

  constructor(
    holder: GameObjects.Sprite,
    private readonly skin: Skin,
    private readonly weaponSkin: WeaponSkin,
  ) {
    super(holder, weaponSkin.getHandSprite());
    this.setOrigin(...weaponSkin.handPosition);
  }

  hold(grip?: WeaponGrip): void {
    this.grip = grip;
  }

  protected follow(): void {

    if (this.grip) {
      const angle = this.grip.facing.toWorld(this.grip.pose.angle);
      const [pivotX, pivotY] = polar(this.target.x, this.target.y, this.grip.facing.angle, this.grip.pose.pivot);

      this.setVisible(true);
      this.setPosition(...polar(pivotX, pivotY, angle, this.grip.pose.radius));
      orient(this, angle, this.weaponSkin.assetAngle, this.grip.facing.mirror(this.grip.mirror));

      return;
    }

    const hand = this.skin.hand(this.target.texture.key, Number(this.target.frame.name));

    this.setVisible(hand !== undefined);

    if (!hand) {
      return;
    }

    this.setPosition(
      this.target.x + (hand.x - this.target.displayOriginX) * this.target.scaleX,
      this.target.y + (hand.y - this.target.displayOriginY) * this.target.scaleY,
    );
    orient(this, FACING_ANGLES[hand.direction], this.weaponSkin.assetAngle);
  }
}
