import type { GameObjects } from 'phaser';
import { Inputs } from '../data/enums/Inputs';
import type { Cardinal, Direction } from './types';

/** Angle (radians) du regard du joueur. Rappel : l'axe Y de Phaser pointe vers le bas. */
export const FACING_ANGLES: Record<Cardinal, number> = {
  [Inputs.RIGHT]: 0,
  [Inputs.DOWN]: Math.PI / 2,
  [Inputs.LEFT]: Math.PI,
  [Inputs.UP]: -Math.PI / 2,
};

export function isMirrored(angle: number): boolean {
  return Math.cos(angle) < 0;
}

export function polar(x: number, y: number, angle: number, distance: number): [x: number, y: number] {
  return [x + Math.cos(angle) * distance, y + Math.sin(angle) * distance];
}

const CLOCKWISE: readonly Direction[] = [Inputs.RIGHT, Inputs.DOWN, Inputs.LEFT, Inputs.UP];

function clockwiseAt(index: number): Direction {
  const { length } = CLOCKWISE;

  return CLOCKWISE[((index % length) + length) % length];
}

export function opposite(direction: Direction): Direction {
  return clockwiseAt(CLOCKWISE.indexOf(direction) + 2);
}

/** Les 4 directions vers un déplacement (dx, dy), de celle qui en rapproche le plus à celle qui en éloigne le plus. */
export function directionsTowards(dx: number, dy: number): Direction[] {
  const horizontal: Direction = dx < 0 ? Inputs.LEFT : Inputs.RIGHT;
  const vertical: Direction = dy < 0 ? Inputs.UP : Inputs.DOWN;
  const [dominant, other] = Math.abs(dx) >= Math.abs(dy) ? [horizontal, vertical] : [vertical, horizontal];

  return [dominant, other, opposite(other), opposite(dominant)];
}

/** Un regard figé : seul endroit qui décide du miroir. */
export abstract class Facing {
  protected constructor(
    readonly angle: number,
    readonly mirrored: boolean,
  ) {}

  /** Angle monde d'un angle local, horaire vers la droite, le haut et le bas, inversé vers la gauche. */
  toWorld(local: number): number {
    return this.angle + (this.mirrored ? -local : local);
  }

  /** Miroir de ce qui vaut mirrored vers la droite, le haut et le bas, et l'inverse vers la gauche. */
  mirror(mirrored: boolean): boolean {
    return this.mirrored !== mirrored;
  }

  /** Point monde d'un point local décrit regard à droite (x vers l'avant, y vers le bas), inversé vers la gauche. */
  place(originX: number, originY: number, x: number, y: number): [x: number, y: number] {
    return polar(...polar(originX, originY, this.angle, x), this.toWorld(Math.PI / 2), y);
  }
}

/** Un regard libre, celui d'un projectile. */
export class AngleFacing extends Facing {
  constructor(angle: number) {
    super(angle, isMirrored(angle));
  }
}

/** Un regard sur un cardinal, celui des animations : miroité vers la gauche seulement. */
export class DirectionFacing extends Facing {
  constructor(readonly direction: Direction) {
    super(FACING_ANGLES[direction], direction === Inputs.LEFT);
  }

  /**
   * La direction à quarters quarts de tour du regard.
   * @param clockwise horaire vers la droite, le haut et le bas, inversé vers la gauche
   */
  rotate(quarters: number, clockwise = true): Direction {
    return clockwiseAt(CLOCKWISE.indexOf(this.direction) + (clockwise === this.mirrored ? -quarters : quarters));
  }
}

/**
 * Tourne l'objet vers angle, miroité plutôt que retourné quand il vise la gauche.
 * @param assetAngle angle (radians) vers lequel pointe l'asset dans son image source
 * @param mirrored impose le miroir, qui retourne l'objet autour de son axe de visée
 */
export function orient(
  gameObject: GameObjects.Components.Flip & GameObjects.Components.Transform,
  angle: number,
  assetAngle: number,
  mirrored = isMirrored(angle),
): void {
  gameObject.setFlipX(mirrored);
  gameObject.setRotation(mirrored ? angle - Math.PI + assetAngle : angle - assetAngle);
}
