import { Inputs } from '../data/enums/Inputs';
import type { Direction } from '../utils/types';

/** Colonne de chaque direction dans les feuilles du pack Ninja Adventure (Walk et Idle). */
const COLUMNS: Record<Direction, number> = {
  [Inputs.DOWN]: 0,
  [Inputs.UP]: 1,
  [Inputs.LEFT]: 2,
  [Inputs.RIGHT]: 3,
};

const ANIMATION_NAMES: Record<Direction, string> = {
  [Inputs.DOWN]: 'down',
  [Inputs.UP]: 'up',
  [Inputs.LEFT]: 'left',
  [Inputs.RIGHT]: 'right',
};

/** L'habillage d'une classe : dérive textures et clés d'animation de sa clé du pack. */
export class Skin {
  constructor(readonly textureKey: string) {}

  get idleTexture(): string {
    return `${this.textureKey}-idle`;
  }

  walkAnimation(direction: Direction): string {
    return `${this.textureKey}-${ANIMATION_NAMES[direction]}`;
  }

  idleFrame(direction: Direction): number {
    return COLUMNS[direction];
  }
}
