import { GameObjects, Tweens } from 'phaser';
import { DirectionFacing, FACING_ANGLES, orient, polar } from '../utils/orientation';
import { Attachment } from './Attachment';
import type { EaseFunction } from './Playback';
import type { Skin } from '../domain/Skin';
import type { WeaponSkin } from '../domain/WeaponSkin';

/**
 * Pose dans le repère du regard : angle local (radians), rayon en px autour du pivot, le centre de rotation,
 * décalé en px de frontShift vers l'avant et sideShift vers le bas regard à droite, 0 par défaut.
 */
export type WeaponPose = { angle: number; radius: number; frontShift?: number; sideShift?: number };

export type WeaponGrip = { readonly facing: DirectionFacing; readonly pose: WeaponPose; mirror: boolean };

const WIELD_DURATION = 200;
const WIELD_ANGLE = -Math.PI / 2;
const WIELD_EASE = Tweens.Builders.GetEaseFunction('Back.out') as EaseFunction;

/** L'arme en main, recalée chaque frame sur la main que montre la frame du skin, sauf quand une animation la tient. */
export class HeldWeapon extends Attachment {
  private grip?: WeaponGrip;
  private _sheathed = false;
  /** Instant de la prise en main. */
  private wieldedAt?: number;

  constructor(
    holder: GameObjects.Sprite,
    private readonly skin: Skin,
    private weaponSkin: WeaponSkin,
  ) {
    super(holder, weaponSkin.getHandSprite());
    this.showInHand();
  }

  get sheathed(): boolean {
    return this._sheathed;
  }

  hold(grip?: WeaponGrip): void {
    this.grip = grip;

    if (grip) {
      this.showInHand();
    } else {
      this.setFrame(this.texture.firstFrame);
    }
  }

  /** Cache l'arme jusqu'à la prochaine prise en main. */
  sheathe(): void {
    this._sheathed = true;
  }

  /** Prend weaponSkin en main : son sprite entier tourne jusqu'à sa pose, puis laisse place à sa version en main. */
  wield(weaponSkin: WeaponSkin): void {
    this.weaponSkin = weaponSkin;
    this._sheathed = false;
    // L'animation qui tenait l'arme peut finir une frame après la fin du verrou du joueur
    this.grip = undefined;
    this.wieldedAt = this.scene.time.now;
    this.setTexture(weaponSkin.textureKey).setOrigin(...weaponSkin.sprite.handPosition);
  }

  protected follow(): void {
    if (this.wieldedAt !== undefined && this.scene.time.now - this.wieldedAt >= WIELD_DURATION) {
      this.showInHand();
    }

    if (this._sheathed) {
      this.setVisible(false);

      return;
    }

    if (this.grip) {
      const angle = this.grip.facing.toWorld(this.grip.pose.angle);
      const { frontShift = 0, sideShift = 0 } = this.grip.pose;
      const [pivotX, pivotY] = this.grip.facing.place(this.target.x, this.target.y, frontShift, sideShift);

      this.setVisible(true);
      this.layer(this.grip.facing.direction);
      this.setPosition(...polar(pivotX, pivotY, angle, this.grip.pose.radius));
      orient(this, angle, this.weaponSkin.inHand.assetAngle, this.grip.facing.mirror(this.grip.mirror));

      return;
    }

    const hand = this.skin.hand(this.target.texture.key, Number(this.target.frame.name));

    this.setVisible(hand !== undefined);

    if (!hand) {
      return;
    }

    this.layer(hand.direction);
    this.setPosition(
      this.target.x + (hand.x - this.target.displayOriginX) * this.target.scaleX,
      this.target.y + (hand.y - this.target.displayOriginY) * this.target.scaleY,
    );

    if (this.wieldedAt === undefined) {
      orient(this, FACING_ANGLES[hand.direction], this.weaponSkin.inHand.assetAngle);

      return;
    }

    const facing = new DirectionFacing(hand.direction);
    const progress = WIELD_EASE((this.scene.time.now - this.wieldedAt) / WIELD_DURATION);

    orient(this, facing.toWorld(WIELD_ANGLE * (1 - progress)), this.weaponSkin.sprite.assetAngle, facing.mirrored);
  }

  private showInHand(): void {
    this.wieldedAt = undefined;
    this.setTexture(this.weaponSkin.getHandSprite()).setOrigin(...this.weaponSkin.inHand.handPosition);
  }
}
