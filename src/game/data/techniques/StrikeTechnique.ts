import type { Player } from '../../entities/Player';
import type { Cue } from '../../domain/Animation';
import { Technique, type TechniqueOptions } from '../../domain/Technique';
import { strike } from '../../utils/combat';
import type Sequence from '../../utils/Sequence';
import type { TechniqueId } from '../enums/TechniqueId';

type StrikeOptions = TechniqueOptions & { damage: number };

export default class StrikeTechnique extends Technique {
  constructor(
    id: TechniqueId,
    name: string,
    sequence: Sequence,
    private readonly options: StrikeOptions,
  ) {
    super(id, name, sequence, options);
  }

  protected override action(player: Player, cue: Cue): void {
    strike(player, cue, this.options.damage);
    super.action(player, cue);
  }
}
