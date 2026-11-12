import type { WeaponSkinId } from '../data/enums/WeaponSkinId';

export type HandPosition = [x: number, y: number];

export type WeaponSprite = { readonly handPosition: HandPosition; readonly assetAngle: number };

export class WeaponSkin {
  constructor(
    readonly id: WeaponSkinId,
    readonly textureKey: string,
    readonly sprite: WeaponSprite,
    private readonly inHandSprite?: WeaponSprite,
  ) {}

  get inHand(): WeaponSprite {
    return this.inHandSprite ?? this.sprite;
  }

  getHandSprite(): string {
    return this.inHandSprite ? `${this.textureKey}-inHand` : this.textureKey;
  }
}
