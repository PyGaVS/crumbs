import { TechniqueId, WeaponId } from './ids';
import { Weapon } from './Weapon';

/** Catalogue des armes. La répartition des techniques est provisoire (jalon 0.3). */
export const ALL_WEAPONS: readonly Weapon[] = [
  new Weapon(WeaponId.HAMMER, 'Marteau', [TechniqueId.SPEED_BOOST]),
  new Weapon(WeaponId.KATANA, 'Katana', [TechniqueId.DIAGONAL]),
];

export function getWeapon(id: WeaponId): Weapon {
  const weapon = ALL_WEAPONS.find((w) => w.id === id);

  if (!weapon) {
    throw new Error(`Arme inconnue : ${id}`);
  }

  return weapon;
}
