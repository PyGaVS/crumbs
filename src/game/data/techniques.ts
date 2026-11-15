import { FxId } from './enums/FxId';
import { ProjectileSkinId } from './enums/ProjectileSkinId';
import { SkinAction } from './enums/SkinAction';
import { TechniqueId } from './enums/TechniqueId';
import { Ability } from '../domain/Ability';
import { Animation, CueStep } from '../domain/Animation';
import { Technique } from '../domain/Technique';
import Sequence from '../utils/Sequence';
import { hitboxRing } from '../utils/hitboxes';
import { Enemy } from '../entities/Enemy';
import ProjectileAbility from './abilities/ProjectileAbility';
import StrikeAbility from './abilities/StrikeAbility';
import FxStep from './animations/FxStep';
import MoveStep from './animations/MoveStep';
import { bow, dash } from './animations/presets';
import SkinStep from './animations/SkinStep';
import SwingStep from './animations/SwingStep';

/** Catalogue des techniques. */
export const ALL_TECHNIQUES: readonly Technique[] = [
  new Technique(
    TechniqueId.DASH, 'Dash', new Sequence().cardinals().same().opposite(),
    new Ability({ animation: new Animation(dash()) }),
  ),
  new Technique(
    TechniqueId.SHURIKENS, 'Shurikens', new Sequence().cardinals().opposite().perpendicular().switch(), 
    new ProjectileAbility({
      skinId: ProjectileSkinId.SHURIKEN, speed: 1300, range: 512, damage: 7, target: Enemy,
      hitboxes: [{ x: 0, y: 0, radius: 14 }],
      spreadAngles: [0, -Math.PI / 16, Math.PI / 16],
      animation: new Animation([
        new SkinStep({ action: SkinAction.ATTACK, duration: 250 }),
        new CueStep(),
      ]),
    }),
  ),
  new Technique(
    TechniqueId.KUNAI, 'Kunai', new Sequence().cardinals().same().switch(), new ProjectileAbility({
      skinId: ProjectileSkinId.KUNAI, speed: 2000, range: 704, damage: 10, target: Enemy,
      hitboxes: [{ x: 14, y: 0, radius: 6 }, { x: 0, y: 0, radius: 8 }],
      crossBody: false,
      animation: new Animation([
        new SkinStep({ action: SkinAction.ATTACK, duration: 200 }),
        new CueStep(),
      ]),
    }),
  ),
  new Technique(
    TechniqueId.SHOOT_SLASH, 'Shoot Slash', new Sequence().cardinals().perpendicular().opposite(2).attack(), 
    new ProjectileAbility({
      skinId: ProjectileSkinId.SLASH_ARC, speed: 960, range: 400, damage: 8, target: Enemy, size: 192,
      hitboxes: [{ x: 36, y: 0, radius: 48 }, { x: 8, y: -60, radius: 36 }, { x: 8, y: 60, radius: 36 }],
      ease: 'Quint.out',
      animation: new Animation([
        new SkinStep({ action: SkinAction.ATTACK }),
        new SwingStep({
          from: { angle: -Math.PI*2 / 5, radius: 40 },
          to: { angle: Math.PI*2 / 5 },
          duration: 220, ease: 'Cubic.out', hold: 120,
        }),
        new CueStep({ at: 50 }),
      ]),
    }),
  ),
  new Technique(
    TechniqueId.SPIN_SLASH, 'Spin Slash', new Sequence().cardinals().perpendicular().opposite(2).opposite(2), 
    new StrikeAbility({
      damage: 8, target: Enemy,
      animation: new Animation([
        new SkinStep({ action: SkinAction.SPIN, duration: 250 }),
        new FxStep({ fx: FxId.SLASH_CIRCULAR, reach: 0, size: 192, mirrored: true, duration: 300 }),
        new CueStep({ at: 100, hitboxes: hitboxRing(8, 64, 36) }),
      ]),
    }),
  ),
  new Technique(
    TechniqueId.POWER_SHOT, 'Power Shot', new Sequence().cardinals().perpendicular().attack(),
    new ProjectileAbility({
      skinId: ProjectileSkinId.ARROW, speed: 2500, range: 1000, damage: 15, target: Enemy, size: 48,
      hitboxes: [{ x: 18, y: 0, radius: 8 }],
      crossBody: false,
      animation: new Animation([
        ...bow({ frames: [0, 1, 2, 3, 0], positions: [[38, 0], [30, 0], [26, 0], [-6, 0]] }),
        new MoveStep({ at: 525, distance: -48, duration: 50, ease: 'Quad.out' }),
      ]),
    }),
  ),
  new Technique(
    TechniqueId.KOCK_AWAY, 'Kock away', new Sequence().cardinals().same().attack(),
    new StrikeAbility({
      damage: 2, target: Enemy,
      onHit: new Animation([new MoveStep({ distance: 160, duration: 200, ease: 'Quad.out' })]),
      animation: new Animation([
        ...dash({ distance: 64, duration: 100, obstacles: { crossWalls: false, crossFighters: false } }),
        new SkinStep({ at: 120, action: SkinAction.ATTACK }),
        new SwingStep({
          at: 120,
          from: { angle: -Math.PI / 2, radius: 30, frontShift: 28 },
          to: { angle: 0, radius: 30, frontShift: 28, sideShift: 30 },
          duration: 100, ease: 'Cubic.out', hold: 100,
        }),
        new CueStep({ at: 170, hitboxes: [{ x: 50, y: 0, radius: 35 }] }),
      ]),
    }),
  ),
];

export function getTechnique(id: TechniqueId): Technique {
  const technique = ALL_TECHNIQUES.find((t) => t.id === id);

  if (!technique) {
    throw new Error(`Technique inconnue : ${id}`);
  }

  return technique;
}
