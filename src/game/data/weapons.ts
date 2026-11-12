import { AnimationId } from './enums/AnimationId';
import { ProjectileSkinId } from './enums/ProjectileSkinId';
import { TechniqueId } from './enums/TechniqueId';
import { WeaponId } from './enums/WeaponId';
import { WeaponSkinId } from './enums/WeaponSkinId';
import { Weapon } from '../domain/Weapon';
import { Enemy } from '../entities/Enemy';
import ProjectileAbility from './abilities/ProjectileAbility';
import StrikeAbility from './abilities/StrikeAbility';

/** Catalogue des armes. */
export const ALL_WEAPONS: readonly Weapon[] = [
  new Weapon( WeaponId.FALCHION, 'Fauchon', WeaponSkinId.FALCHION,
    new StrikeAbility({ damage: 5, animationId: AnimationId.FALCHION_ATTACK, target: Enemy }),
    [TechniqueId.SHOOT_SLASH, TechniqueId.SPIN_SLASH],
  ),
  new Weapon( WeaponId.BOW, 'Arc', WeaponSkinId.BOW,
    new ProjectileAbility({
      skinId: ProjectileSkinId.ARROW, speed: 2300, range: 900, damage: 10, target: Enemy, size: 48,
      hitboxes: [{ x: 18, y: 0, radius: 8 }],
      crossBody: false, animationId: AnimationId.BOW_SHOT,
    }),
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
