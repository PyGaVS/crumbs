import { AnimationStep, type StepOptions } from '../../domain/Animation';
import type { Playback } from '../../entities/Playback';
import type { DirectionFacing } from '../../utils/orientation';
import type { Direction } from '../../utils/types';
import type { SkinAction } from '../enums/SkinAction';

type SkinOptions = StepOptions & {
  action: SkinAction;
  /** Direction jouée, tirée du regard figé ; absente, le regard lui-même. */
  direction?: (facing: DirectionFacing) => Direction;
  duration?: number;
};

/** Une action du skin de l'entité, jouée vers le regard figé. */
export default class SkinStep extends AnimationStep {
  constructor(private readonly options: SkinOptions) {
    super(options);
  }

  override get duration(): number {
    return this.options.duration ?? 0;
  }

  start({ entity, facing, animation }: Playback): void {
    if (!entity.playAction) {
      throw new Error(`Animation ${animation.id} : action de skin sur une entité sans skin animé`);
    }

    entity.playAction(this.options.action, this.options.direction?.(facing) ?? facing.direction);
  }
}
