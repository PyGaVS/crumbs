import { Physics, Scene } from 'phaser';
import { Mob } from '../entities/Mob';

type ArcadeBody = Physics.Arcade.Body | Physics.Arcade.StaticBody;

/** Les mobs dont le corps chevauche le cercle centré en (x, y). */
export function mobsInCircle(scene: Scene, x: number, y: number, radius: number): Mob[] {
  const bodies = scene.physics.overlapCirc(x, y, radius, true, false) as ArcadeBody[];

  return bodies.map((body) => body.gameObject).filter((gameObject): gameObject is Mob => gameObject instanceof Mob);
}

/**
 * Un obstacle occupe-t-il le rectangle centré en (cx, cy) ?
 * @param blockers murs = corps statiques, mobs = corps dynamiques
 */
export function hasObstacle(
  scene: Scene,
  cx: number,
  cy: number,
  width: number,
  height: number,
  blockers: { walls: boolean; mobs: boolean },
): boolean {
  if (!blockers.walls && !blockers.mobs) {
    return false;
  }

  const bodies = scene.physics.overlapRect(
    cx - width / 2,
    cy - height / 2,
    width,
    height,
    blockers.mobs,
    blockers.walls,
  ) as ArcadeBody[];

  return bodies.some((body) => body instanceof Physics.Arcade.StaticBody || body.gameObject instanceof Mob);
}
