import type { TechniqueId } from '../data/enums/TechniqueId';
import type { WeaponId } from '../data/enums/WeaponId';
import type { Technique } from './Technique';
import { getTechnique } from '../data/techniques';

/** Une arme et ses techniques. Stats de combat au jalon 0.3. */
export class Weapon {
  constructor(
    readonly id: WeaponId,
    readonly name: string,
    readonly techniqueIds: readonly TechniqueId[],
  ) {}

  get techniques(): Technique[] {
    return this.techniqueIds.map(getTechnique);
  }
}
