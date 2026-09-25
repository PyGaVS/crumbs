export const CARDINALS = ['R', 'L', 'U', 'D'] as const;

export type Cardinal = (typeof CARDINALS)[number];
export type Diagonal = 'RU' | 'LU' | 'LD' | 'RD';

/** 'H' = halt, un input du joueur. 'N' = aucune touche pendant 250 ms, sépare les combos. */
export type InputKey = Cardinal | 'H' | 'A' | 'N';

export const OPPOSITES: Record<Cardinal, Cardinal> = { R: 'L', L: 'R', U: 'D', D: 'U' };

export function isCardinal(input: string): input is Cardinal {
  return (CARDINALS as readonly string[]).includes(input);
}

export function getOpposite(input: InputKey): InputKey {
  if (isCardinal(input)) {
    return OPPOSITES[input];
  }

  return input;
}

export function getPerpendicularDirections(input: InputKey): InputKey[] {
  switch (input) {
    case 'R':
    case 'L':
      return ['U', 'D'];
    case 'U':
    case 'D':
      return ['R', 'L'];
    default:
      return [];
  }
}

const SYMBOLS: Record<InputKey, string> = { R: '→', L: '←', U: '↑', D: '↓', H: 'H', A: 'x', N: ' ' };

export function getSymbol(input: InputKey): string {
  return SYMBOLS[input];
}

/**
 * Garde les dernières touches ; la détection des séquences est dans data/Technique.
 * (Nommé InputHistory car `input` est déjà une propriété des GameObjects Phaser.)
 */
export class InputHistory {
  history: InputKey[] = ['N', 'N', 'N', 'N'];

  addInput(input: InputKey, course?: Cardinal | Diagonal | 'H'): void {
    // Amorce : au début d'un enchaînement, la direction de course compte comme la frappe précédente
    if (input !== 'N' && course !== undefined && this.isChainStart() && (isCardinal(course) || course === 'H')) {
      this.history.push(course);
    }

    this.history.push(input);
    this.history = this.history.slice(-4);
  }

  private isChainStart(): boolean {
    return this.history[this.history.length - 1] === 'N';
  }

  getHistory(): string {
    return this.history.map((input) => SYMBOLS[input]).join(' ');
  }
}
