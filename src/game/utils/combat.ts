import { Geom } from 'phaser';
import type { Cue, Hitbox } from '../domain/Animation';
import type { Entity } from '../entities/Entity';
import type { Fighter, FighterClass } from '../entities/Fighter';
import { fightersInCircle } from './collision';
import type { Facing } from './orientation';

export enum CombatEvent {
  STRIKE = 'strike',
}

/** Les fighters de la classe target touchés par au moins une des hitboxs posées autour d'attacker, chacun une seule fois. */
export function touchedFighters<T extends Fighter>(
  attacker: Entity,
  facing: Facing,
  hitboxes: readonly Hitbox[],
  target: FighterClass<T>,
): Set<T> {
  const { scene } = attacker;
  const circles = hitboxes.map(
    ({ x, y, radius }) => new Geom.Circle(...facing.place(attacker.x, attacker.y, x, y), radius),
  );

  scene.events.emit(CombatEvent.STRIKE, circles);

  return new Set(circles.flatMap(({ x, y, radius }) => fightersInCircle(scene, x, y, radius, target)));
}

/** Inflige damage une seule fois à chaque fighter de la classe target touché par au moins une hitbox du repère. */
export function strike(attacker: Entity, { facing, hitboxes }: Cue, damage: number, target: FighterClass): void {
  touchedFighters(attacker, facing, hitboxes, target).forEach((fighter) => fighter.takeDamage(damage));
}
