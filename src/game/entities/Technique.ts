import type { Cardinal, Diagonal } from '../utils/input';
import type { TechniqueId } from '../data/enums/TechniqueId';

/** Une étape d'une séquence, selon la notation de DESIGN.md. */
export type TechniqueStep =
  | { kind: 'dir'; dir: Cardinal }
  | { kind: 'either'; dirs: [Cardinal, Cardinal] }
  | { kind: 'both'; axis: 'horizontal' | 'vertical' }
  | { kind: 'halt' }
  | { kind: 'attack' }
  | { kind: 'switch' };

/** Ce qu'une technique peut faire sur son exécutant. Implémentée par les entités Phaser. */
export interface TechniqueUser {
  setDirection(direction: Cardinal | Diagonal): void;
  applySpeedBoost(): void;
}

export class Technique {
  constructor(
    readonly id: TechniqueId,
    readonly name: string,
    readonly sequence: readonly TechniqueStep[],
    readonly execute: (user: TechniqueUser) => void,
  ) {}

  /** Notation affichée au joueur, par exemple `↓ ↓ ←/→`. */
  get notation(): string {
    return this.sequence.map(stepNotation).join(' ');
  }
}

const ARROWS: Record<Cardinal, string> = { R: '→', L: '←', U: '↑', D: '↓' };

function stepNotation(step: TechniqueStep): string {
  switch (step.kind) {
    case 'dir':
      return ARROWS[step.dir];
    case 'either':
      return `${ARROWS[step.dirs[0]]}/${ARROWS[step.dirs[1]]}`;
    case 'both':
      return step.axis === 'vertical' ? '↕' : '↔';
    case 'halt':
      return 'H';
    case 'attack':
      return 'ATK'; // icône à définir (DESIGN.md §6)
    case 'switch':
      return 'SWP'; // icône à définir (DESIGN.md §6)
  }
}
