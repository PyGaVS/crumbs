import { AnimationStep, type StepOptions } from '../../domain/Animation';
import { HeldSprite } from '../../entities/HeldSprite';
import type { Playback } from '../../entities/Playback';
import type { Point } from '../../utils/orientation';
import type { ProjectileSkinId } from '../enums/ProjectileSkinId';
import { getProjectileSkin } from '../projectileSkins';

type SpriteOptions = StepOptions & {
  skinId: ProjectileSkinId;
  /** Centres successifs du sprite autour de l'entité, décrits regard à droite, un par part égale de duration. */
  positions: readonly Point[];
  duration: number;
};

/** Un sprite tenu devant l'entité, à l'échelle de son porteur, qui disparaît après duration. */
export default class SpriteStep extends AnimationStep {
  constructor(private readonly options: SpriteOptions) {
    super(options);
  }

  override get duration(): number {
    return this.options.duration;
  }

  start(playback: Playback): void {
    const { skinId, positions, duration } = this.options;
    const { textureKey, assetAngle } = getProjectileSkin(skinId);
    const sprite = new HeldSprite(playback, textureKey, assetAngle);

    playback.during(duration, (_ms, progress) => {
      if (progress >= 1) {
        sprite.destroy();

        return;
      }

      sprite.position = positions[Math.min(positions.length - 1, Math.floor(progress * positions.length))];
    });
  }
}
