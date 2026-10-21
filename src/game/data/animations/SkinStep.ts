import { AnimationStep, type StepOptions } from '../../entities/Animation';
import type { Playback } from '../../entities/Playback';
import type { SkinAction } from '../enums/SkinAction';

type SkinOptions = StepOptions & { action: SkinAction };

/** Une action du skin de l'entité, jouée vers le regard figé. */
export default class SkinStep extends AnimationStep {
  constructor(private readonly options: SkinOptions) {
    super(options);
  }

  start({ entity, facing, animation }: Playback): void {
    if (!entity.playAction) {
      throw new Error(`Animation ${animation.id} : action de skin sur une entité sans skin animé`);
    }

    entity.playAction(this.options.action, facing.direction);
  }
}
