import { Geom } from 'phaser';
import type { Cue } from '../entities/Animation';
import type { Entity } from '../entities/Entity';
import { mobsInCircle } from './collision';

export enum CombatEvent {
  STRIKE = 'strike',
}

/** Inflige damage une seule fois à chaque mob touché par au moins une hitbox du repère. */
export function strike(attacker: Entity, { facing, hitboxes }: Cue, damage: number): void {
  const { scene } = attacker;
  const circles = hitboxes.map(
    ({ x, y, radius }) => new Geom.Circle(...facing.place(attacker.x, attacker.y, x, y), radius),
  );
  const mobs = new Set(circles.flatMap(({ x, y, radius }) => mobsInCircle(scene, x, y, radius)));

  mobs.forEach((mob) => mob.takeDamage(damage));
  scene.events.emit(CombatEvent.STRIKE, circles);
}
