import type { AnimationId } from '../data/enums/AnimationId';
import type { TechniqueId } from '../data/enums/TechniqueId';
import type { WeaponId } from '../data/enums/WeaponId';
import type { WeaponSkinId } from '../data/enums/WeaponSkinId';
import type { MeleeHit } from '../utils/combat';
import type { Animation } from './Animation';
import type { Technique } from './Technique';
import type { WeaponSkin } from './WeaponSkin';
import { getAnimation } from '../data/animations';
import { getTechnique } from '../data/techniques';
import { getWeaponSkin } from '../data/weaponSkins';

export type WeaponAttack = MeleeHit & {
  /** ms pendant lesquelles le joueur reste figé. */
  lag: number;
  animationId: AnimationId;
};

/** Une arme, son apparence, son attaque de base et ses techniques. */
export class Weapon {
  constructor(
    readonly id: WeaponId,
    readonly name: string,
    readonly skinId: WeaponSkinId,
    readonly attack: WeaponAttack,
    readonly techniqueIds: readonly TechniqueId[],
  ) {
    this.attackAnimation.checkCuesBefore(attack.lag, `Arme ${name}`);
  }

  get skin(): WeaponSkin {
    return getWeaponSkin(this.skinId);
  }

  get attackAnimation(): Animation {
    return getAnimation(this.attack.animationId);
  }

  get techniques(): Technique[] {
    return this.techniqueIds.map(getTechnique);
  }
}
