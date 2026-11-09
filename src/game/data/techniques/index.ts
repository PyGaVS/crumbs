import { AnimationId } from '../enums/AnimationId';
import { ProjectileSkinId } from '../enums/ProjectileSkinId';
import { TechniqueId } from '../enums/TechniqueId';
import { Technique } from '../../entities/Technique';
import Sequence from '../../utils/Sequence';
import DashTechnique from './DashTechnique';
import ProjectileTechnique from './ProjectileTechnique';

/** Catalogue des techniques. */
export const ALL_TECHNIQUES: readonly Technique[] = [
  new DashTechnique(
    TechniqueId.DASH, 'Dash', new Sequence().cardinals().same().opposite(), {
      range: 256, ignoreWalls: true,
      tween: { duration: 160, ease: 'Cubic.out' },
    }
  ),
  new ProjectileTechnique(
    TechniqueId.SHURIKENS, 'Shurikens', new Sequence().cardinals().opposite().perpendicular().switch(), {
      skinId: ProjectileSkinId.SHURIKEN, speed: 1300, range: 512, damage: 7,
      hitboxes: [{ x: 0, y: 0, radius: 14 }],
      spreadAngles: [0, -Math.PI / 16, Math.PI / 16],
      animationId: AnimationId.THROW,
      lag: 250,
    },
  ),
  new ProjectileTechnique(
    TechniqueId.KUNAI, 'Kunai', new Sequence().cardinals().same().switch(), {
      skinId: ProjectileSkinId.KUNAI, speed: 2000, range: 704, damage: 10,
      hitboxes: [{ x: 14, y: 0, radius: 6 }, { x: 0, y: 0, radius: 8 }],
      animationId: AnimationId.THROW,
      lag: 200, crossBody: false
    }
  ),
  new ProjectileTechnique(
    TechniqueId.SHOOT_SLASH, 'Shoot Slash', new Sequence().cardinals().perpendicular().opposite(2).attack(), {
      skinId: ProjectileSkinId.SLASH_ARC, speed: 960, range: 400, damage: 8, size: 192,
      hitboxes: [{ x: 36, y: 0, radius: 48 }, { x: 8, y: -60, radius: 36 }, { x: 8, y: 60, radius: 36 }],
      ease: 'Quint.out', animationId: AnimationId.SHOOT_SLASH,
      lag: 320,
    }
  ),
  // ^ TODO: lag a supprimer, utiliser l'animation
];

export function getTechnique(id: TechniqueId): Technique {
  const technique = ALL_TECHNIQUES.find((t) => t.id === id);

  if (!technique) {
    throw new Error(`Technique inconnue : ${id}`);
  }

  return technique;
}
