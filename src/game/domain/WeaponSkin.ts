import type { WeaponSkinId } from '../data/enums/WeaponSkinId';

export type HandPosition = [x: number, y: number];

export class WeaponSkin {
  constructor(
    readonly id: WeaponSkinId,
    readonly textureKey: string,
    readonly handPosition: HandPosition,
    readonly assetAngle: number,
    readonly spriteHandPosition: HandPosition,
    readonly spriteAssetAngle: number,
  ) {}

  getHandSprite(): string {
    return `${this.textureKey}-inHand`;
  }
}
