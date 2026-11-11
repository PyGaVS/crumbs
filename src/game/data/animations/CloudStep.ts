import { AnimationStep, type StepOptions } from '../../domain/Animation';
import type { Playback } from '../../entities/Playback';
import { Slash, type SlashConfig } from '../../entities/Slash';
import { ring } from '../../utils/orientation';
import type { FxId } from '../enums/FxId';
import { getFx } from '../fx';

type CloudOptions = StepOptions &
  Pick<SlashConfig, 'size' | 'duration' | 'tint'> & {
    fx: FxId;
    count: number;
    distance: number;
  };

/** Un nuage de count bouffées droites, en cercle autour de l'entité, qui finissent seules. */
export default class CloudStep extends AnimationStep {
  constructor(private readonly options: CloudOptions) {
    super(options);
  }

  start({ entity }: Playback): void {
    const { fx, count, distance, size, duration, tint } = this.options;

    ring(entity.x, entity.y, count, distance).forEach(([x, y]) => {
      new Slash(entity.scene, x, y, getFx(fx), { size, duration, tint });
    });
  }
}
