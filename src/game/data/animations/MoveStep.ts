import { Tweens } from 'phaser';
import { AnimationStep, type Ease, type StepOptions } from '../../domain/Animation';
import type { EaseFunction, Playback } from '../../entities/Playback';
import { polar } from '../../utils/orientation';

type MoveOptions = StepOptions & {
  /** px vers le regard, négatif pour reculer. */
  distance: number;
  /** px au sommet de l'arc */
  height?: number;
  /** ms */
  duration: number;
  ease: Ease;
};

/** Un déplacement de l'entité le long du regard figé, en arc si height. */
export default class MoveStep extends AnimationStep {
  private readonly ease: EaseFunction;

  constructor(private readonly options: MoveOptions) {
    super(options);
    this.ease = Tweens.Builders.GetEaseFunction(options.ease) as EaseFunction;
  }

  override get duration(): number {
    return this.options.duration;
  }

  start(playback: Playback): void {
    const { entity, facing } = playback;
    const { distance, height = 0, duration } = this.options;
    const { x: fromX, y: fromY } = entity;
    const [toX, toY] = polar(fromX, fromY, facing.angle, distance);

    playback.during(duration, (_ms, progress) => {
      const t = this.ease(progress);

      entity.altitude = height * Math.sin(Math.PI * t);
      entity.setPosition(fromX + (toX - fromX) * t, fromY + (toY - fromY) * t);
    });
  }
}
