import { AnimationStep, type StepOptions } from '../../domain/Animation';
import { FxSprite, type FxSpriteConfig } from '../../entities/FxSprite';
import type { Playback } from '../../entities/Playback';
import { polar, ringAngles } from '../../utils/orientation';
import type { FxId } from '../enums/FxId';
import { getFx } from '../fx';

type FxOptions = StepOptions &
  Pick<FxSpriteConfig, 'size' | 'duration' | 'tint'> & {
    fx: FxId;
    /** px entre l'entité et le centre de chaque effet. */
    reach: number;
    /** Écart local au regard du premier effet, en radians. */
    angle?: number;
    /** Effets répartis en cercle à partir du premier. */
    count?: number;
    /** Reste droit au lieu de suivre le regard. */
    upright?: boolean;
    /** Miroir vers la droite, le haut et le bas, inversé vers la gauche. */
    mirrored?: boolean;
  };

/** Des effets posés autour de l'entité, qui finissent seuls. */
export default class FxStep extends AnimationStep {
  constructor(private readonly options: FxOptions) {
    super(options);
  }

  start({ entity, facing }: Playback): void {
    const { fx, reach, angle = 0, count = 1, upright = false, mirrored = false, size, duration, tint } = this.options;

    ringAngles(count, angle).forEach((local) => {
      const world = facing.toWorld(local);
      const [x, y] = polar(entity.x, entity.y, world, reach);

      new FxSprite(entity.scene, x, y, getFx(fx), {
        angle: upright ? undefined : world,
        size,
        mirrored: facing.mirror(mirrored),
        duration,
        tint,
      });
    });
  }
}
