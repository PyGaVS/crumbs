import { Geom } from 'phaser';
import type { Animation, Cue, Hitbox } from '../domain/Animation';
import type { Entity } from '../entities/Entity';
import type { Fighter, FighterClass } from '../entities/Fighter';
import { fightersInCircle } from './collision';
import type { Direction, Facing } from './orientation';

export type Hit = {
  damage: number;
  onHit?: Animation;
};

export enum CombatEvent {
  STRIKE = 'strike',
}

/**
 * Les fighters de la classe target touchés par au moins une des hitboxs posées autour d'attacker.
 * @returns chaque fighter une seule fois, avec le multiplicateur de la hitbox qui l'emporte
 */
export function touchedFighters<T extends Fighter>(
  attacker: Entity,
  facing: Facing,
  hitboxes: readonly Hitbox[],
  target: FighterClass<T>,
): Map<T, number> {
  const { scene } = attacker;
  const circles = hitboxes.map(
    ({ x, y, radius }) => new Geom.Circle(...facing.place(attacker.x, attacker.y, x, y), radius),
  );

  scene.events.emit(CombatEvent.STRIKE, circles);

  const winners = new Map<T, Hitbox>();

  circles.forEach(({ x, y, radius }, i) => {
    for (const fighter of fightersInCircle(scene, x, y, radius, target)) {
      const current = winners.get(fighter);

      if (!current || outranks(hitboxes[i], current)) {
        winners.set(fighter, hitboxes[i]);
      }
    }
  });

  return new Map([...winners].map(([fighter, hitbox]) => [fighter, hitbox.multiplier ?? 1]));
}

function outranks(a: Hitbox, b: Hitbox): boolean {
  const priority = (a.priority ?? 0) - (b.priority ?? 0);

  return priority !== 0 ? priority > 0 : (a.multiplier ?? 1) > (b.multiplier ?? 1);
}

export function inflict(fighter: Fighter, { damage, onHit }: Hit, multiplier: number, direction: Direction): void {
  fighter.takeDamage(damage * multiplier);

  if (fighter.active) {
    onHit?.play(fighter, { direction });
  }
}

export function strike(attacker: Entity, { facing, hitboxes }: Cue, hit: Hit, target: FighterClass): void {
  touchedFighters(attacker, facing, hitboxes, target).forEach((multiplier, fighter) =>
    inflict(fighter, hit, multiplier, facing.direction),
  );
}
