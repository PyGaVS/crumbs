import type { GameObjects } from 'phaser';
import { Inputs } from '../data/enums/Inputs';
import { CARDINALS, Cardinal } from './types';

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

export function nearestCardinal(angle: number): Cardinal {
  return CARDINALS.reduce((best, d) =>
    Math.cos(angle - FACING_ANGLES[d]) > Math.cos(angle - FACING_ANGLES[best]) ? d : best,
  );
}

/** Le regard figé d'une animation : seul endroit qui décide du miroir. */
export class Facing {
  readonly mirrored: boolean;
  readonly direction: Cardinal;

  constructor(readonly angle: number) {
    this.mirrored = isMirrored(angle);
    this.direction = nearestCardinal(angle);
  }

  /**
   * La direction à quarters quarts de tour du regard.
   * @param clockwise horaire vers la droite, le haut et le bas, inversé vers la gauche
   */
  rotate(quarters: number, clockwise = true): Cardinal {
    const sign = clockwise === this.mirrored ? -1 : 1;

    return nearestCardinal(this.angle + (sign * quarters * Math.PI) / 2);
  }

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
