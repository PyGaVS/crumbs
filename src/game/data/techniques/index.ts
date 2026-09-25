import { TechniqueId } from '../enums/TechniqueId';
import { Technique } from '../../entities/Technique';
import Sequence from '../../utils/Sequence';
import DashTechnique from './DashTechnique';

/** Catalogue des techniques. */
export const ALL_TECHNIQUES: readonly Technique[] = [
  new DashTechnique(
    TechniqueId.DASH,
    'Dash',
    new Sequence().same().same().opposite(),
    () => {},
    () => {},
    256,
    true,
    { duration: 160, ease: 'Cubic.out' },
  ),
];

export function getTechnique(id: TechniqueId): Technique {
  const technique = ALL_TECHNIQUES.find((t) => t.id === id);

  if (!technique) {
    throw new Error(`Technique inconnue : ${id}`);
  }

  return technique;
}
