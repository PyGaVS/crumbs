import type { Playback } from '../../entities/Playback';
import type { Point } from '../../utils/orientation';
import PulseStep, { type PulseOptions } from './PulseStep';

type ScaleOptions = PulseOptions & {
  /** Multiplicateurs de l'échelle au plus fort, [largeur, hauteur]. */
  scale: Point;
};

/** Le skin aplati, étiré ou grossi depuis ses pieds, puis rendu à sa forme. */
export default class ScaleStep extends PulseStep {
  constructor(private readonly options: ScaleOptions) {
    super(options);
  }

  protected apply({ entity }: Playback, amount: number): void {
    const [width, height] = this.options.scale;

    entity.renderScale.x = 1 + (width - 1) * amount;
    entity.renderScale.y = 1 + (height - 1) * amount;
  }
}
