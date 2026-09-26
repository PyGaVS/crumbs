import { CharClass } from '../entities/CharClass';
import { Skin } from '../entities/Skin';
import { CharClassId } from './enums/CharClassId';
import { TechniqueId } from './enums/TechniqueId';

/** Catalogue des classes. Répartition des techniques et skin du robot provisoires (jalon 0.4). */
export const ALL_CHAR_CLASSES: readonly CharClass[] = [
  new CharClass(CharClassId.NINJA, 'Ninja', new Skin('ninjaGreen'), [TechniqueId.DASH]),
];

export function getCharClass(id: CharClassId): CharClass {
  const charClass = ALL_CHAR_CLASSES.find((c) => c.id === id);

  if (!charClass) {
    throw new Error(`Classe inconnue : ${id}`);
  }

  return charClass;
}
