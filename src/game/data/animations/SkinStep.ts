import { AnimationStep, type StepOptions } from '../../domain/Animation';
import type { Playback } from '../../entities/Playback';
import type { Direction, DirectionFacing } from '../../utils/orientation';
import type { SkinAction } from '../enums/SkinAction';

type SkinOptions = StepOptions & {
  action: SkinAction;
  /** Direction jouée, tirée du regard figé ; absente, le regard lui-même. */
  direction?: (facing: DirectionFacing) => Direction;
  duration?: number;
  reverse?: boolean;
};

/** Une action du skin de l'entité, jouée vers le regard figé. */
export default class SkinStep extends AnimationStep {
  constructor(private readonly options: SkinOptions) {
    super(options);
  }

  override get duration(): number {
    return this.options.duration ?? 0;
  }

  start({ entity, facing }: Playback): void {
    if (!entity.playAction) {
      throw new Error(`Action de skin sur l'entité ${entity.texture.key}, sans skin animé`);
    }

    entity.playAction(this.options.action, this.options.direction?.(facing) ?? facing.direction);

    if (this.options.reverse) {
      entity.anims.reverse();
    }
  }
}
