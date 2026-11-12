import type { AnimationId } from '../data/enums/AnimationId';
import { DirectionFacing } from '../utils/orientation';
import type { Animation, Cue } from './Animation';
import type { Fighter } from '../entities/Fighter';
import { getAnimation } from '../data/animations';

export type AbilityOptions = {
  animationId?: AnimationId;
};

/** Ce que fait un fighter : une animation et l'effet de chacun de ses repères. A est le fighter qui peut la lancer. */
export abstract class Ability<A extends Fighter = Fighter> {
  readonly animationId?: AnimationId;

  constructor(options: AbilityOptions = {}) {
    this.animationId = options.animationId;
  }

  get animation(): Animation | undefined {
    return this.animationId === undefined ? undefined : getAnimation(this.animationId);
  }

  execute(fighter: A): void {
    const { animation } = this;

    if (animation) {
      animation.play(fighter, { onCue: (cue) => this.action(fighter, cue) });
    } else {
      this.action(fighter, { facing: new DirectionFacing(fighter.direction), index: 0, last: true, hitboxes: [] });
    }
  }

  protected abstract action(fighter: A, cue: Cue): void;
}
