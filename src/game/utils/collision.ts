import { Physics, Scene } from 'phaser';
import { Entity } from '../entities/Entity';
import { Player } from '../entities/Player';
import { Projectile } from '../entities/Projectile';

type ArcadeBody = Physics.Arcade.Body | Physics.Arcade.StaticBody;

function isMob(body: ArcadeBody): boolean {
  const gameObject = body.gameObject;

  return gameObject instanceof Entity && !(gameObject instanceof Player) && !(gameObject instanceof Projectile);
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

  return bodies.some((body) => body instanceof Physics.Arcade.StaticBody || isMob(body));
}
