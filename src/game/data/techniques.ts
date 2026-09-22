import { TechniqueId } from './enums/TechniqueId';
import { Technique } from './Technique';

/** Catalogue des techniques. Combos du prototype en placeholder (jalon 0.2). */
export const ALL_TECHNIQUES: readonly Technique[] = [
  new Technique(
    TechniqueId.SPEED_BOOST,
    'Sprint',
    [
      { kind: 'dir', dir: 'L' },
      { kind: 'dir', dir: 'L' },
      { kind: 'dir', dir: 'R' },
    ],
    (user) => user.applySpeedBoost(),
  ),
  new Technique(
    TechniqueId.DIAGONAL,
    'Pas de côté',
    [
      { kind: 'dir', dir: 'R' },
      { kind: 'dir', dir: 'U' },
      { kind: 'dir', dir: 'R' },
      { kind: 'dir', dir: 'U' },
    ],
    (user) => user.setDirection('RU'),
  ),
];

export function getTechnique(id: TechniqueId): Technique {
  const technique = ALL_TECHNIQUES.find((t) => t.id === id);

  if (!technique) {
    throw new Error(`Technique inconnue : ${id}`);
  }

  return technique;
}
