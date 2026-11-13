import type { AnimationId } from '../data/enums/AnimationId';
import type { Animation, Cue } from './Animation';
import type { Fighter } from '../entities/Fighter';
import { getAnimation } from '../data/animations';

export type AbilityOptions = {
  animationId: AnimationId;
};

/** Ce que fait un fighter : une animation et l'effet de chacun de ses repères. */
export class Ability {
  readonly animationId: AnimationId;

  constructor(options: AbilityOptions) {
    this.animationId = options.animationId;
  }

  get animation(): Animation {
    return getAnimation(this.animationId);
  }

  execute(fighter: Fighter): void {
    this.animation.play(fighter, { onCue: (cue) => this.action(fighter, cue) });
  }

  protected action(_fighter: Fighter, _cue: Cue): void {}
}
