import type { Hitbox } from '../domain/Animation';
import { ring } from './orientation';

/** count hitboxs de rayon radius, réparties en cercle à distance px de l'entité. */
export function hitboxRing(count: number, distance: number, radius: number): Hitbox[] {
  return ring(0, 0, count, distance).map(([x, y]) => ({ x, y, radius }));
}
