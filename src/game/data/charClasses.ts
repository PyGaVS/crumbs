import { CharClass } from './CharClass';
import { CharClassId } from './enums/CharClassId';
import { TechniqueId } from './enums/TechniqueId';

/** Catalogue des classes. La répartition des techniques est provisoire (jalon 0.4). */
export const ALL_CHAR_CLASSES: readonly CharClass[] = [
  new CharClass(CharClassId.NINJA, 'Ninja', [TechniqueId.DIAGONAL]),
  new CharClass(CharClassId.ROBOT, 'Robot', [TechniqueId.SPEED_BOOST]),
];

export function getCharClass(id: CharClassId): CharClass {
  const charClass = ALL_CHAR_CLASSES.find((c) => c.id === id);

  if (!charClass) {
    throw new Error(`Classe inconnue : ${id}`);
  }

  return charClass;
}
