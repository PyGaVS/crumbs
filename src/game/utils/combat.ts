import type { Entity } from '../entities/Entity';
import { mobsInFront } from './collision';

export type MeleeHit = {
  damage: number;
  /** Zone de touche devant l'attaquant, en px : distance de son centre, largeur et profondeur. */
  reach: number;
  width: number;
  depth: number;
};

/** Frappe les mobs de la zone posée devant l'attaquant et tournée vers angle (radians). */
export function strike(attacker: Entity, angle: number, { damage, reach, width, depth }: MeleeHit): void {
  mobsInFront(attacker.scene, attacker.x, attacker.y, angle, reach, width, depth).forEach((mob) =>
    mob.takeDamage(damage),
  );
}
