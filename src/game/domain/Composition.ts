import type { CharClass } from './CharClass';
import type { Technique } from './Technique';
import type { Weapon } from './Weapon';

/** L'assemblage du joueur pour un run : une classe et deux armes (DESIGN.md §4). */
export class Composition {
  constructor(
    readonly charClass: CharClass,
    readonly weapons: readonly [Weapon, Weapon],
  ) {}

  /** Techniques de la classe plus celles de l'arme active. */
  techniquesWith(activeWeapon: 0 | 1): Technique[] {
    return [...this.charClass.techniques, ...this.weapons[activeWeapon].techniques];
  }
}
