import { Physics, Scene } from 'phaser';
import { Mob } from '../entities/Mob';
import { polar } from './orientation';

type ArcadeBody = Physics.Arcade.Body | Physics.Arcade.StaticBody;

/** Les mobs dont le corps chevauche le rectangle centré en (cx, cy). */
export function overlappingMobs(scene: Scene, cx: number, cy: number, width: number, height: number): Mob[] {
  const bodies = scene.physics.overlapRect(cx - width / 2, cy - height / 2, width, height, true, false) as ArcadeBody[];

  return bodies.map((body) => body.gameObject).filter((gameObject): gameObject is Mob => gameObject instanceof Mob);
}

/**
 * Les mobs dans une zone rectangulaire posée devant (x, y) et tournée vers angle.
 * @param reach distance en px entre (x, y) et le centre de la zone
 * @param width largeur en px, en travers de angle
 * @param depth profondeur en px, le long de angle
 */
export function mobsInFront(
  scene: Scene,
  x: number,
  y: number,
  angle: number,
  reach: number,
  width: number,
  depth: number,
): Mob[] {
  const cos = Math.abs(Math.cos(angle));
  const sin = Math.abs(Math.sin(angle));
  const [cx, cy] = polar(x, y, angle, reach);

  return overlappingMobs(scene, cx, cy, cos * depth + sin * width, sin * depth + cos * width);
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
