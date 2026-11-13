import type { Playback } from '../../entities/Playback';
import type { Point } from '../../utils/orientation';
import { Inputs } from '../enums/Inputs';
import PulseStep, { type PulseOptions } from './PulseStep';

type ScaleOptions = PulseOptions & {
  /** Multiplicateurs de l'échelle au plus fort, décrits regard à droite : [le long du regard, en travers]. */
  scale: Point;
  /** Reste [largeur, hauteur] au lieu de suivre le regard. */
  upright?: boolean;
};

/** Le skin aplati, étiré ou grossi depuis ses pieds, puis rendu à sa forme. */
export default class ScaleStep extends PulseStep {
  constructor(private readonly options: ScaleOptions) {
    super(options);
  }

  protected apply({ entity, facing }: Playback, amount: number): void {
    const { scale, upright = false } = this.options;
    const vertical = facing.direction === Inputs.UP || facing.direction === Inputs.DOWN;
    const [width, height] = !upright && vertical ? [scale[1], scale[0]] : scale;

    entity.renderScale.x = 1 + (width - 1) * amount;
    entity.renderScale.y = 1 + (height - 1) * amount;
  }
}
