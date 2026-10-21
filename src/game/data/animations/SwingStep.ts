import { Tweens } from 'phaser';
import { AnimationStep, type Ease, type StepCheck, type StepOptions } from '../../entities/Animation';
import type { WeaponPose } from '../../entities/HeldWeapon';
import type { EaseFunction, Playback } from '../../entities/Playback';

type SwingOptions = StepOptions & {
  /** Obligatoire au premier geste ; absente, l'arme part de la pose laissée par le geste précédent. */
  from?: WeaponPose;
  to: Partial<WeaponPose>;
  /** ms */
  duration: number;
  ease: Ease;
  /** Sens du geste vers la droite, le haut et le bas, inversé vers la gauche. Horaire par défaut. */
  clockwise?: boolean;
};

/** Un geste de l'arme tenue, d'une pose à une autre. */
export default class SwingStep extends AnimationStep {
  private readonly ease: EaseFunction;

  constructor(private readonly options: SwingOptions) {
    super(options);
    this.ease = Tweens.Builders.GetEaseFunction(options.ease) as EaseFunction;
  }

  override get duration(): number {
    return this.options.duration;
  }

  override check(state: StepCheck): void {
    if (!this.options.from && !state.holdsWeapon) {
      throw new Error(`Animation ${state.id} : premier geste sans pose de départ`);
    }

    state.holdsWeapon = true;
  }

  start(playback: Playback): void {
    const { from, to, duration, clockwise = true } = this.options;

    playback.animate(playback.holdWeapon(clockwise, from), to, duration, this.ease, from);
  }
}
