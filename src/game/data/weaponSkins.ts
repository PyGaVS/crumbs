import { WeaponSkin } from '../domain/WeaponSkin';
import { WeaponSkinId } from './enums/WeaponSkinId';

/** Catalogue des apparences d'armes. Les SpriteInHand du pack se tiennent par le haut, lame vers le bas, tranchant à gauche. */
export const ALL_WEAPON_SKINS: readonly WeaponSkin[] = [
  new WeaponSkin(WeaponSkinId.FALCHION, 'falchion', [0.5, -0.1], Math.PI / 2),
];

export function getWeaponSkin(id: WeaponSkinId): WeaponSkin {
  const skin = ALL_WEAPON_SKINS.find((s) => s.id === id);

  if (!skin) {
    throw new Error(`Apparence d'arme inconnue : ${id}`);
  }

  return skin;
}
