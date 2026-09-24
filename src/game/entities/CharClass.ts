import type { CharClassId } from '../data/enums/CharClassId';
import type { TechniqueId } from '../data/enums/TechniqueId';
import type { Technique } from './Technique';
import { getTechnique } from '../data/techniques';

/** Une classe jouable et ses techniques (DESIGN.md §4). */
export class CharClass {
  constructor(
    readonly id: CharClassId,
    readonly name: string,
    readonly techniqueIds: readonly TechniqueId[],
  ) {}

  get techniques(): Technique[] {
    return this.techniqueIds.map(getTechnique);
  }
}
