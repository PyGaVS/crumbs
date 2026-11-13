import type { Playback } from '../../entities/Playback';
import PulseStep, { type PulseOptions } from './PulseStep';

type HurtboxOptions = PulseOptions & {
  /** Multiplicateur du rayon au plus fort. */
  scale: number;
};

/** La hurtbox grossie ou rétrécie autour de son centre, puis rendue à sa taille. */
export default class HurtboxStep extends PulseStep {
  constructor(private readonly options: HurtboxOptions) {
    super(options);
  }

  override start(playback: Playback): void {
    if (!playback.entity.scaleHurtbox) {
      throw new Error(`Animation ${playback.animation.id} : hurtbox sur une entité sans hurtbox`);
    }

    super.start(playback);
  }

  protected apply({ entity }: Playback, amount: number): void {
    entity.scaleHurtbox?.(1 + (this.options.scale - 1) * amount);
  }
}
