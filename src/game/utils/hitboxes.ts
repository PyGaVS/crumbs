import type { Hitbox } from '../domain/Animation';
import { polar, ringAngles } from './orientation';

/** count hitboxs de rayon radius, réparties en cercle à distance px de l'entité. */
export function hitboxRing(count: number, distance: number, radius: number): Hitbox[] {
  return ringAngles(count).map((angle) => {
    const [x, y] = polar(0, 0, angle, distance);

    return { x, y, radius };
  });
}
