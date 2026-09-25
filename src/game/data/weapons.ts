import { WeaponId } from './enums/WeaponId';
import { Weapon } from '../entities/Weapon';

/** Catalogue des armes. La répartition des techniques est provisoire (jalon 0.3). */
export const ALL_WEAPONS: readonly Weapon[] = [
  new Weapon(WeaponId.HAMMER, 'Marteau', []),
  new Weapon(WeaponId.KATANA, 'Katana', []),
];

export function getWeapon(id: WeaponId): Weapon {
  const weapon = ALL_WEAPONS.find((w) => w.id === id);

  if (!weapon) {
    throw new Error(`Arme inconnue : ${id}`);
  }

  return weapon;
}
