import type { Inputs } from '../data/enums/Inputs';
import { getSymbol } from '../utils/input';
import type { TechniqueId } from '../data/enums/TechniqueId';
import type { Player } from './Player';
import type Sequence from '../utils/Sequence';

export type TechniqueOptions = {
  beforeEffect?: (player: Player) => void;
  effect?: (player: Player) => void;
  afterEffect?: (player: Player) => void;
  afterLagEffect?: (player: Player) => void;
  playerAnimation?: string;
  lag?: number;
};

export class Technique {
  /** Les suites d'inputs acceptées, aplaties depuis l'arbre à la construction. */
  private readonly paths: Inputs[][];
  protected readonly beforeEffect: (player: Player) => void;
  protected readonly effect: (player: Player) => void;
  protected readonly afterEffect: (player: Player) => void;
  protected readonly afterLagEffect: (player: Player) => void;
  readonly playerAnimation?: string;
  readonly lag: number;

  constructor(
    readonly id: TechniqueId,
    readonly name: string,
    readonly sequence: Sequence,
    options: TechniqueOptions = {},
  ) {
    this.paths = sequence.paths();
    this.beforeEffect = options.beforeEffect ?? (() => {});
    this.effect = options.effect ?? (() => {});
    this.afterEffect = options.afterEffect ?? (() => {});
    this.afterLagEffect = options.afterLagEffect ?? (() => {});
    this.playerAnimation = options.playerAnimation;
    this.lag = options.lag ?? 0;
  }

  /** Notation affichée au joueur, une par branche de l'arbre. */
  get notations(): string[] {
    return this.paths.map((path) => path.map(getSymbol).join(' '));
  }

  matches(history: readonly Inputs[]): boolean {
    return this.paths.some((path) => pathMatches(path, history));
  }

  execute(player: Player): void {
    this.beforeEffect(player);
    this.effect(player);
    this.action(player);

    if (this.lag > 0) {
      player.lock(this.lag, () => this.afterLagEffect(player));
    }
  }

  /** L'action principale ; la sous-classe déclenche afterEffect quand elle se termine. */
  protected action(player: Player): void {
    this.afterEffect(player);
  }
}

/** La suite d'inputs correspond-elle aux dernières entrées de l'historique ? */
function pathMatches(path: readonly Inputs[], history: readonly Inputs[]): boolean {
  const start = history.length - path.length;

  return start >= 0 && path.every((input, i) => history[start + i] === input);
}
