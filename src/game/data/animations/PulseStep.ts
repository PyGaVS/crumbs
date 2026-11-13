import { Tweens } from 'phaser';
import { AnimationStep, type Ease, type StepOptions } from '../../domain/Animation';
import type { EaseFunction, Playback } from '../../entities/Playback';

export type PulseOptions = StepOptions & {
  /** ms pour atteindre le plus fort */
  duration: number;
  /** ms tenus au plus fort */
  hold?: number;
  /** ms pour revenir */
  recover: number;
  ease: Ease;
};

/** Un effet qui monte à son plus fort, y reste, puis revient : ses enfants disent ce qu'il touche. */
export default abstract class PulseStep extends AnimationStep {
  private readonly ease: EaseFunction;

  constructor(private readonly pulse: PulseOptions) {
    super(pulse);
    this.ease = Tweens.Builders.GetEaseFunction(pulse.ease) as EaseFunction;
  }

  override get duration(): number {
    const { duration, hold = 0, recover } = this.pulse;

    return duration + hold + recover;
  }

  start(playback: Playback): void {
    playback.during(this.duration, (ms) => this.apply(playback, this.amount(ms)));
  }

  /** @param amount part du plus fort, de 0 à 1 */
  protected abstract apply(playback: Playback, amount: number): void;

  private amount(ms: number): number {
    const { duration, hold = 0, recover } = this.pulse;

    if (ms < duration) {
      return this.ease(ms / duration);
    }

    const back = ms - duration - hold;

    return back <= 0 ? 1 : 1 - this.ease(Math.min(1, back / recover));
  }
}
