import { AnimationId } from './enums/AnimationId';
import { TechniqueId } from './enums/TechniqueId';
import { WeaponId } from './enums/WeaponId';
import { WeaponSkinId } from './enums/WeaponSkinId';
import { Weapon } from '../domain/Weapon';
import { Enemy } from '../entities/Enemy';
import StrikeAbility from './abilities/StrikeAbility';

/** Catalogue des armes. */
export const ALL_WEAPONS: readonly Weapon[] = [
  new Weapon( WeaponId.FALCHION, 'Fauchon', WeaponSkinId.FALCHION,
    new StrikeAbility({ damage: 5, animationId: AnimationId.FALCHION_ATTACK, target: Enemy }),
    [TechniqueId.SHOOT_SLASH, TechniqueId.SPIN_SLASH],
  ),
];

export function getWeapon(id: WeaponId): Weapon {
  const weapon = ALL_WEAPONS.find((w) => w.id === id);

  if (!weapon) {
    throw new Error(`Arme inconnue : ${id}`);
  }

  return weapon;
}
