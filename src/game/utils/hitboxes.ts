import type { Hitbox } from '../domain/Animation';
import { polar } from './orientation';

/** count hitboxs de rayon radius, réparties en cercle à distance px de l'entité. */
export function hitboxRing(count: number, distance: number, radius: number): Hitbox[] {
  return Array.from({ length: count }, (_, i) => {
    const [x, y] = polar(0, 0, (2 * Math.PI * i) / count, distance);

    return { x, y, radius };
  });
}
