import { WeaponSkin } from '../domain/WeaponSkin';
import { WeaponSkinId } from './enums/WeaponSkinId';

/** Catalogue des apparences d'armes. */
export const ALL_WEAPON_SKINS: readonly WeaponSkin[] = [
  new WeaponSkin(WeaponSkinId.FALCHION, 'falchion',
    { handPosition: [0.5, 1], assetAngle: -Math.PI / 2 },
    { handPosition: [0.5, -0.1], assetAngle: Math.PI / 2 },
  ),
  new WeaponSkin(WeaponSkinId.BOW, 'bow', { handPosition: [0.5, 0.92], assetAngle: 0 }),
];

export function getWeaponSkin(id: WeaponSkinId): WeaponSkin {
  const skin = ALL_WEAPON_SKINS.find((s) => s.id === id);

  if (!skin) {
    throw new Error(`Apparence d'arme inconnue : ${id}`);
  }

  return skin;
}
