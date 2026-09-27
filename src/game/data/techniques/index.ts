import { TechniqueId } from '../enums/TechniqueId';
import { Technique } from '../../entities/Technique';
import Sequence from '../../utils/Sequence';
import DashTechnique from './DashTechnique';
import ProjectileTechnique from './ProjectileTechnique';

/** Catalogue des techniques. */
export const ALL_TECHNIQUES: readonly Technique[] = [
  new DashTechnique(TechniqueId.DASH, 'Dash', new Sequence().cardinals().same().opposite(), {
    range: 256, ignoreWalls: true,
    tween: { duration: 160, ease: 'Cubic.out' },
  }),
  new ProjectileTechnique(
    TechniqueId.SHURIKENS,
    'Shurikens',
    new Sequence().cardinals().opposite().perpendicular().halt(),
    {
      texture: 'shuriken', speed: 1300, range: 512,
      spreadAngles: [0, -Math.PI / 16, Math.PI / 16],
      animation: { spin: 1440 }, playerAnimation: 'attack',
      lag: 250,
    },
  ),
  new ProjectileTechnique(TechniqueId.KUNAI, 'Kunai', new Sequence().cardinals().same().halt(), {
    texture: 'kunai', speed: 2000, range: 704, 
    assetAngle: (-1 * Math.PI) / 4, playerAnimation: 'attack',
    lag: 200,
  }),
];

export function getTechnique(id: TechniqueId): Technique {
  const technique = ALL_TECHNIQUES.find((t) => t.id === id);

  if (!technique) {
    throw new Error(`Technique inconnue : ${id}`);
  }

  return technique;
}
