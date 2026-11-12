import { GameObjects, Tweens } from 'phaser';
import { Inputs } from '../data/enums/Inputs';
import { type Direction, DirectionFacing, FACING_ANGLES, orient, polar } from '../utils/orientation';
import { Attachment } from './Attachment';
import type { EaseFunction } from './Playback';
import type { Skin } from '../domain/Skin';
import type { WeaponSkin } from '../domain/WeaponSkin';

/** Pose dans le repère du regard : angle local (radians), rayon et pivot en px. */
export type WeaponPose = { angle: number; radius: number; pivot: number };

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
      const [pivotX, pivotY] = polar(this.target.x, this.target.y, this.grip.facing.angle, this.grip.pose.pivot);

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

  /** Derrière le porteur quand il regarde vers le haut */
  private layer(direction: Direction): void {
    if (direction === Inputs.UP) {
      this.scene.children.moveBelow(this, this.target);
    } else {
      this.scene.children.moveAbove(this, this.target);
    }
  }

  private showInHand(): void {
    this.wieldedAt = undefined;
    this.setTexture(this.weaponSkin.getHandSprite()).setOrigin(...this.weaponSkin.inHand.handPosition);
  }
}
