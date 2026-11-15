import type { Fighter, FighterClass } from '../../entities/Fighter';
import type { Cue } from '../../domain/Animation';
import { Ability, type AbilityOptions } from '../../domain/Ability';
import { strike, type Hit } from '../../utils/combat';

type StrikeOptions = AbilityOptions & Hit & { target: FighterClass };

export default class StrikeAbility extends Ability {
  constructor(private readonly options: StrikeOptions) {
    super(options);
  }

  protected override action(fighter: Fighter, cue: Cue): void {
    strike(fighter, cue, this.options, this.options.target);
  }
}
