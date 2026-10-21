import { AnimationStep, type StepOptions } from '../../entities/Animation';
import type { Playback } from '../../entities/Playback';
import { Slash, type SlashConfig } from '../../entities/Slash';
import { polar } from '../../utils/orientation';
import type { FxId } from '../enums/FxId';
import { getFx } from '../fx';

type SlashOptions = StepOptions &
  Pick<SlashConfig, 'size' | 'duration'> & {
    fx: FxId;
    /** px entre l'entité et le centre de l'entaille. */
    reach: number;
    /** Écart local au regard, en radians. */
    angle?: number;
    /** Miroir vers la droite, le haut et le bas, inversé vers la gauche. */
    mirrored?: boolean;
  };

/** Une entaille posée devant l'entité, qui finit seule. */
export default class SlashStep extends AnimationStep {
  constructor(private readonly options: SlashOptions) {
    super(options);
  }

  start({ entity, facing }: Playback): void {
    const { fx, reach, size, angle = 0, mirrored = false, duration } = this.options;
    const world = facing.toWorld(angle);
    const [x, y] = polar(entity.x, entity.y, world, reach);

    new Slash(entity.scene, x, y, getFx(fx), { angle: world, size, mirrored: facing.mirror(mirrored), duration });
  }
}
