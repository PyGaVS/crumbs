import { AnimationId } from './enums/AnimationId';
import { WeaponId } from './enums/WeaponId';
import { WeaponSkinId } from './enums/WeaponSkinId';
import { Weapon } from '../entities/Weapon';

/** Catalogue des armes. */
export const ALL_WEAPONS: readonly Weapon[] = [
  new Weapon( WeaponId.FALCHION, 'Fauchon', WeaponSkinId.FALCHION,
    { damage: 5, animationId: AnimationId.FALCHION_ATTACK },
    [],
  ),
];

export function getWeapon(id: WeaponId): Weapon {
  const weapon = ALL_WEAPONS.find((w) => w.id === id);

  if (!weapon) {
    throw new Error(`Arme inconnue : ${id}`);
  }

  return weapon;
}
