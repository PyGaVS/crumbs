import { Geom } from 'phaser';
import type { Cue, Hitbox } from '../domain/Animation';
import type { Entity } from '../entities/Entity';
import type { Mob } from '../entities/Mob';
import { mobsInCircle } from './collision';
import type { Facing } from './orientation';

export enum CombatEvent {
  STRIKE = 'strike',
}

/** Les mobs touchés par au moins une des hitboxs posées autour d'attacker, chacun une seule fois. */
export function touchedMobs(attacker: Entity, facing: Facing, hitboxes: readonly Hitbox[]): Set<Mob> {
  const { scene } = attacker;
  const circles = hitboxes.map(
    ({ x, y, radius }) => new Geom.Circle(...facing.place(attacker.x, attacker.y, x, y), radius),
  );

  scene.events.emit(CombatEvent.STRIKE, circles);

  return new Set(circles.flatMap(({ x, y, radius }) => mobsInCircle(scene, x, y, radius)));
}

/** Inflige damage une seule fois à chaque mob touché par au moins une hitbox du repère. */
export function strike(attacker: Entity, { facing, hitboxes }: Cue, damage: number): void {
  touchedMobs(attacker, facing, hitboxes).forEach((mob) => mob.takeDamage(damage));
}
