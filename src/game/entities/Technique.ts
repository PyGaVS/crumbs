import type { Inputs } from '../data/enums/Inputs';
import { getSymbol } from '../utils/input';
import type { TechniqueId } from '../data/enums/TechniqueId';
import type { Player } from './Player';
import type Sequence from '../utils/Sequence';

export class Technique {
  /** Les suites d'inputs acceptées, aplaties depuis l'arbre à la construction. */
  private readonly paths: Inputs[][];

  constructor(
    readonly id: TechniqueId,
    readonly name: string,
    readonly sequence: Sequence,
    readonly execute: (player: Player) => void,
  ) {
    this.paths = sequence.paths();
  }

  /** Notation affichée au joueur, une par branche de l'arbre. */
  get notations(): string[] {
    return this.paths.map((path) => path.map(getSymbol).join(' '));
  }

  matches(history: readonly Inputs[]): boolean {
    return this.paths.some((path) => pathMatches(path, history));
  }
}

/** La suite d'inputs correspond-elle aux dernières entrées de l'historique ? */
function pathMatches(path: readonly Inputs[], history: readonly Inputs[]): boolean {
  const start = history.length - path.length;

  return start >= 0 && path.every((input, i) => history[start + i] === input);
}
