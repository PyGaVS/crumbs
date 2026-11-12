import { Physics, Scene } from 'phaser';
import type { Entity } from '../entities/Entity';
import { Fighter, type FighterClass } from '../entities/Fighter';

type ArcadeBody = Physics.Arcade.Body | Physics.Arcade.StaticBody;

/** Les fighters de la classe fighterClass dont le corps chevauche le cercle centré en (x, y). */
export function fightersInCircle<T extends Fighter>(
  scene: Scene,
  x: number,
  y: number,
  radius: number,
  fighterClass: FighterClass<T>,
): T[] {
  const bodies = scene.physics.overlapCirc(x, y, radius, true, false) as ArcadeBody[];

  return bodies
    .map((body) => body.gameObject)
    .filter((gameObject): gameObject is T => gameObject instanceof fighterClass);
}

/**
 * Un obstacle occupe-t-il le corps de mover s'il était centré en (cx, cy) ?
 * @param blockers murs = corps statiques, fighters = les autres fighters
 */
export function hasObstacle(
  mover: Entity,
  cx: number,
  cy: number,
  blockers: { walls: boolean; fighters: boolean },
): boolean {
  if (!blockers.walls && !blockers.fighters) {
    return false;
  }

  const { width, height } = mover.body || { width: 0, height: 0 };
  const bodies = mover.scene.physics.overlapRect(
    cx - width / 2,
    cy - height / 2,
    width,
    height,
    blockers.fighters,
    blockers.walls,
  ) as ArcadeBody[];

  return bodies.some(
    (body) =>
      body instanceof Physics.Arcade.StaticBody || (body.gameObject instanceof Fighter && body.gameObject !== mover),
  );
}
