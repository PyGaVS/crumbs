import type { AnimationId } from '../data/enums/AnimationId';
import type { Inputs } from '../data/enums/Inputs';
import { getSymbol } from '../utils/input';
import { Facing } from '../utils/orientation';
import type { TechniqueId } from '../data/enums/TechniqueId';
import type { Animation, Cue } from './Animation';
import type { Player } from './Player';
import type Sequence from '../utils/Sequence';
import { getAnimation } from '../data/animations';

export type TechniqueOptions = {
  beforeEffect?: (player: Player) => void;
  effect?: (player: Player) => void;
  afterEffect?: (player: Player) => void;
  afterLagEffect?: (player: Player) => void;
  animationId?: AnimationId;
  lag?: number;
};

export class Technique {
  /** Les suites d'inputs acceptées, aplaties depuis l'arbre à la construction. */
  private readonly paths: Inputs[][];
  protected readonly beforeEffect: (player: Player) => void;
  protected readonly effect: (player: Player) => void;
  protected readonly afterEffect: (player: Player) => void;
  protected readonly afterLagEffect: (player: Player) => void;
  readonly animationId?: AnimationId;
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
    this.animationId = options.animationId;
    this.lag = options.lag ?? 0;
    this.animation?.checkCuesBefore(this.lag, `Technique ${name}`);
  }

  get animation(): Animation | undefined {
    return this.animationId === undefined ? undefined : getAnimation(this.animationId);
  }

  /** Notation affichée au joueur, une par branche de l'arbre. */
  get notations(): string[] {
    return this.paths.map((path) => path.map(getSymbol).join(' '));
  }

  matches(history: readonly Inputs[]): boolean {
    return this.paths.some((path) => pathMatches(path, history));
  }

  execute(player: Player): void {
    const { animation } = this;

    this.beforeEffect(player);
    this.effect(player);

    if (animation) {
      animation.play(player, { onCue: (cue) => this.action(player, cue) });
    } else {
      this.action(player, { facing: new Facing(player.facingAngle), index: 0, last: true, hitboxes: [] });
    }

    if (this.lag > 0) {
      player.lock(this.lag, () => this.afterLagEffect(player));
    }
  }

  protected action(player: Player, cue: Cue): void {
    if (cue.last) {
      this.afterEffect(player);
    }
  }
}

/** La suite d'inputs correspond-elle aux dernières entrées de l'historique ? */
function pathMatches(path: readonly Inputs[], history: readonly Inputs[]): boolean {
  const start = history.length - path.length;

  return start >= 0 && path.every((input, i) => history[start + i] === input);
}
