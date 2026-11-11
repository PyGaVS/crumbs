import { Inputs } from '../data/enums/Inputs';
import { SkinAction } from '../data/enums/SkinAction';
import type { SkinId } from '../data/enums/SkinId';
import { CARDINALS, type Direction } from '../utils/orientation';

type Point = readonly [x: number, y: number];

export type Hand = { x: number; y: number; direction: Direction };

/** Main qui tient l'arme par feuille et direction, en px de la frame source, une position par ligne de la feuille. */
export type SkinHands = Record<string, Record<Direction, readonly Point[]>>;

/** Colonne de chaque direction dans les feuilles du pack Ninja Adventure (Walk, Idle et Attack). */
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

/** L'habillage d'une classe ou d'un ennemi : dérive textures et clés d'animation de sa clé du pack. */
export class Skin {
  constructor(
    readonly id: SkinId,
    readonly textureKey: string,
    private readonly hands: SkinHands = {},
  ) {}

  get walkTexture(): string {
    return `${this.textureKey}-walk`;
  }

  get idleTexture(): string {
    return `${this.textureKey}-idle`;
  }

  /** Clé d'animation d'une action, ex. `ninjaGreen-attack-down`, ou `mushroom-charge` sans direction. */
  animation(action: SkinAction, direction?: Direction): string {
    const key = `${this.textureKey}-${action}`;

    return direction === undefined ? key : `${key}-${ANIMATION_NAMES[direction]}`;
  }

  walkAnimation(direction: Direction): string {
    return this.animation(SkinAction.WALK, direction);
  }

  idleFrame(direction: Direction): number {
    return COLUMNS[direction];
  }

  /**
   * La main qui tient l'arme sur une frame du skin.
   * @returns `undefined` si la feuille n'a pas de main renseignée
   */
  hand(texture: string, frame: number): Hand | undefined {
    const sheet = Object.keys(this.hands).find((name) => texture === `${this.textureKey}-${name}`);
    const direction = CARDINALS.find((d) => COLUMNS[d] === frame % CARDINALS.length);

    if (!sheet || !direction) {
      return undefined;
    }

    const [x, y] = this.hands[sheet][direction][Math.floor(frame / CARDINALS.length)];

    return { x, y, direction };
  }
}
