import { Skin } from '../domain/Skin';
import { Inputs } from './enums/Inputs';
import { SkinId } from './enums/SkinId';

/** Catalogue des skins. */
export const ALL_SKINS: readonly Skin[] = [
  new Skin(SkinId.NINJA_GREEN, 'ninjaGreen', {
    idle: {
      [Inputs.DOWN]: [ [3, 14] ],
      [Inputs.UP]: [ [13, 14] ],
      [Inputs.LEFT]: [ [10, 15] ],
      [Inputs.RIGHT]: [ [6, 15] ],
    },
    walk: {
      [Inputs.DOWN]: [ [3, 14], [3, 15], [3, 14], [3, 15] ],
      [Inputs.UP]: [ [13, 14], [13, 13], [13, 14], [13, 13] ],
      [Inputs.LEFT]: [ [10, 15], [10, 16], [10, 15], [10, 16] ],
      [Inputs.RIGHT]: [ [6, 15], [6, 16], [6, 15], [6, 16] ],
    },
    attack: {
      [Inputs.DOWN]: [ [6, 14] ],
      [Inputs.UP]: [ [13, 16] ],
      [Inputs.LEFT]: [ [2, 12] ],
      [Inputs.RIGHT]: [ [14, 12] ],
    },
  }),
  new Skin(SkinId.SNAKE, 'snake'),
  new Skin(SkinId.MUSHROOM, 'mushroom'),
  new Skin(SkinId.REPTILE, 'reptile'),
];

export function getSkin(id: SkinId): Skin {
  const skin = ALL_SKINS.find((s) => s.id === id);

  if (!skin) {
    throw new Error(`Skin inconnu : ${id}`);
  }

  return skin;
}
