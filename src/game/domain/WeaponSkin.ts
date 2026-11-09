import type { WeaponSkinId } from '../data/enums/WeaponSkinId';

export type HandPosition = [x: number, y: number];

/** L'apparence d'une arme : son sprite, sa version en main et la façon de la tenir. */
export class WeaponSkin {
  constructor(
    readonly id: WeaponSkinId,
    readonly textureKey: string,
    readonly handPosition: HandPosition,
    readonly assetAngle: number,
  ) {}

  getHandSprite(): string {
    return `${this.textureKey}-inHand`;
  }
}
