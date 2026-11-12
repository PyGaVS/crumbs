import { AnimationId } from './enums/AnimationId';
import { ProjectileSkinId } from './enums/ProjectileSkinId';
import { TechniqueId } from './enums/TechniqueId';
import { Technique } from '../domain/Technique';
import Sequence from '../utils/Sequence';
import { Enemy } from '../entities/Enemy';
import DashAbility from './abilities/DashAbility';
import ProjectileAbility from './abilities/ProjectileAbility';
import StrikeAbility from './abilities/StrikeAbility';

/** Catalogue des techniques. */
export const ALL_TECHNIQUES: readonly Technique[] = [
  new Technique(
    TechniqueId.DASH, 'Dash', new Sequence().cardinals().same().opposite(), 
    new DashAbility({
      range: 256, ignoreWalls: true,
      tween: { duration: 160, ease: 'Cubic.out' },
    }),
  ),
  new Technique(
    TechniqueId.SHURIKENS, 'Shurikens', new Sequence().cardinals().opposite().perpendicular().switch(), 
    new ProjectileAbility({
      skinId: ProjectileSkinId.SHURIKEN, speed: 1300, range: 512, damage: 7,
      hitboxes: [{ x: 0, y: 0, radius: 14 }],
      spreadAngles: [0, -Math.PI / 16, Math.PI / 16],
      animationId: AnimationId.SHURIKENS_THROW,
    }),
  ),
  new Technique(
    TechniqueId.KUNAI, 'Kunai', new Sequence().cardinals().same().switch(), new ProjectileAbility({
      skinId: ProjectileSkinId.KUNAI, speed: 2000, range: 704, damage: 10,
      hitboxes: [{ x: 14, y: 0, radius: 6 }, { x: 0, y: 0, radius: 8 }],
      animationId: AnimationId.KUNAI_THROW,
      crossBody: false
    }),
  ),
  new Technique(
    TechniqueId.SHOOT_SLASH, 'Shoot Slash', new Sequence().cardinals().perpendicular().opposite(2).attack(), 
    new ProjectileAbility({
      skinId: ProjectileSkinId.SLASH_ARC, speed: 960, range: 400, damage: 8, size: 192,
      hitboxes: [{ x: 36, y: 0, radius: 48 }, { x: 8, y: -60, radius: 36 }, { x: 8, y: 60, radius: 36 }],
      ease: 'Quint.out', animationId: AnimationId.SHOOT_SLASH,
    }),
  ),
  new Technique(
    TechniqueId.SPIN_SLASH, 'Spin Slash', new Sequence().cardinals().perpendicular().opposite(2).opposite(2), 
    new StrikeAbility({
      damage: 8, animationId: AnimationId.SPIN_SLASH, target: Enemy,
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
