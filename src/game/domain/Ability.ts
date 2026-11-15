import type { Animation, Cue } from './Animation';
import type { Fighter } from '../entities/Fighter';

export type AbilityOptions = {
  animation: Animation;
};

/** Ce que fait un fighter : une animation et l'effet de chacun de ses repères. */
export class Ability {
  readonly animation: Animation;

  constructor(options: AbilityOptions) {
    this.animation = options.animation;
  }

  execute(fighter: Fighter): void {
    this.animation.play(fighter, { onCue: (cue) => this.action(fighter, cue) });
  }

  protected action(_fighter: Fighter, _cue: Cue): void {}
}
