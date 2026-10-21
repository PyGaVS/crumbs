import type { CharClassId } from '../data/enums/CharClassId';
import type { SkinId } from '../data/enums/SkinId';
import type { TechniqueId } from '../data/enums/TechniqueId';
import type { Technique } from './Technique';
import type { Skin } from './Skin';
import { getSkin } from '../data/skins';
import { getTechnique } from '../data/techniques';

/** Une classe jouable, son habillage et ses techniques (DESIGN.md §4). */
export class CharClass {
  constructor(
    readonly id: CharClassId,
    readonly name: string,
    readonly skinId: SkinId,
    readonly techniqueIds: readonly TechniqueId[],
  ) {}

  get skin(): Skin {
    return getSkin(this.skinId);
  }

  get techniques(): Technique[] {
    return this.techniqueIds.map(getTechnique);
  }
}
