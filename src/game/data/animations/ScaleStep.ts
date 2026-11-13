import { Tweens } from 'phaser';
import { AnimationStep, type Ease, type StepOptions } from '../../domain/Animation';
import type { EaseFunction, Playback } from '../../entities/Playback';
import type { Point } from '../../utils/orientation';

type ScaleOptions = StepOptions & {
  /** Multiplicateurs de l'échelle au plus fort, [largeur, hauteur]. */
  scale: Point;
  /** ms pour se déformer */
  duration: number;
  /** ms tenus déformé */
  hold?: number;
  /** ms pour se reformer */
  recover: number;
  ease: Ease;
};

/** Le skin aplati, étiré ou grossi depuis ses pieds, puis rendu à sa forme. */
export default class ScaleStep extends AnimationStep {
  private readonly ease: EaseFunction;

  constructor(private readonly options: ScaleOptions) {
    super(options);
    this.ease = Tweens.Builders.GetEaseFunction(options.ease) as EaseFunction;
  }

  override get duration(): number {
    const { duration, hold = 0, recover } = this.options;

    return duration + hold + recover;
  }

  start(playback: Playback): void {
    const { renderScale } = playback.entity;
    const [width, height] = this.options.scale;

    playback.during(this.duration, (ms) => {
      const amount = this.amount(ms);

      renderScale.x = 1 + (width - 1) * amount;
      renderScale.y = 1 + (height - 1) * amount;
    });
  }

  private amount(ms: number): number {
    const { duration, hold = 0, recover } = this.options;

    if (ms < duration) {
      return this.ease(ms / duration);
    }

    const back = ms - duration - hold;

    return back <= 0 ? 1 : 1 - this.ease(Math.min(1, back / recover));
  }
}
