import type { Player } from '../entities/Player';
import { TechniqueId } from './enums/TechniqueId';
import { Technique } from '../entities/Technique';
import Sequence from '../utils/Sequence';

/** Accélération brutale et brève dans la direction courante. */
export function dash(player: Player): void {
  const DASH_BOOST = 18;
  const DASH_DURATION = 150;
  player.applyBoost(DASH_BOOST, DASH_DURATION);
}

/** Catalogue des techniques. */
export const ALL_TECHNIQUES: readonly Technique[] = [
  new Technique(TechniqueId.DASH, 'Dash', new Sequence().same().same().opposite(), dash),
];

export function getTechnique(id: TechniqueId): Technique {
  const technique = ALL_TECHNIQUES.find((t) => t.id === id);

  if (!technique) {
    throw new Error(`Technique inconnue : ${id}`);
  }

  return technique;
}
