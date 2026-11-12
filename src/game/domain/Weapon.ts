import type { TechniqueId } from '../data/enums/TechniqueId';
import type { WeaponId } from '../data/enums/WeaponId';
import type { WeaponSkinId } from '../data/enums/WeaponSkinId';
import type { Ability } from './Ability';
import type { Technique } from './Technique';
import type { WeaponSkin } from './WeaponSkin';
import { getTechnique } from '../data/techniques';
import { getWeaponSkin } from '../data/weaponSkins';

/** Une arme, son apparence, son attaque de base et ses techniques. */
export class Weapon {
  constructor(
    readonly id: WeaponId,
    readonly name: string,
    readonly skinId: WeaponSkinId,
    readonly attack: Ability,
    readonly techniqueIds: readonly TechniqueId[],
  ) {}

  get skin(): WeaponSkin {
    return getWeaponSkin(this.skinId);
  }

  get techniques(): Technique[] {
    return this.techniqueIds.map(getTechnique);
  }
}
