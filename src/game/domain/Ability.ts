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

  /**
   * @param customAngle angle (radians) des tirs à la place du regard, renseigné par les ennemis
   */
  execute(fighter: Fighter, customAngle?: number): void {
    this.animation.play(fighter, { onCue: (cue) => this.action(fighter, cue, customAngle), customAngle });
  }

  protected action(_fighter: Fighter, _cue: Cue, _customAngle?: number): void {}
}
