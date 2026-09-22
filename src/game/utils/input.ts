export const CARDINALS = ['R', 'L', 'U', 'D'] as const;

export type Cardinal = (typeof CARDINALS)[number];
export type Diagonal = 'RU' | 'LU' | 'LD' | 'RD';

/** 'H' = halt, un input du joueur. 'N' = aucune touche pendant 250 ms, sépare les combos. */
export type InputKey = Cardinal | 'H' | 'N';

export type Special = 'speed' | Diagonal | '';

const OPPOSITES: Record<Cardinal, Cardinal> = { R: 'L', L: 'R', U: 'D', D: 'U' };

export function isCardinal(input: string): input is Cardinal {
  return (CARDINALS as readonly string[]).includes(input);
}

const SYMBOLS: Record<InputKey, string> = { R: '→', L: '←', U: '↑', D: '↓', H: 'H', N: ' ' };

/** Paire (dernière touche + avant-dernière) → diagonale. */
const DIAGONALS: Partial<Record<string, Diagonal>> = {
  RU: 'RU',
  UR: 'RU',
  LU: 'LU',
  UL: 'LU',
  LD: 'LD',
  DL: 'LD',
  RD: 'RD',
  DR: 'RD',
};

/**
 * Équivalent de utils/input.py : garde les 4 dernières touches et détecte les combos.
 * (Nommé InputHistory car `input` est déjà une propriété des GameObjects Phaser.)
 */
export class InputHistory {
  history: InputKey[] = ['N', 'N', 'N', 'N'];

  addInput(input: InputKey, course?: Cardinal | Diagonal | 'H'): Special {
    // Amorce : au début d'un enchaînement, la direction de course compte comme la frappe précédente
    if (input !== 'N' && course !== undefined && this.isChainStart() && (isCardinal(course) || course === 'H')) {
      this.history.push(course);
    }

    this.history.push(input);
    this.history = this.history.slice(-4);

    return this.checkSpecial();
  }

  private isChainStart(): boolean {
    return this.history[this.history.length - 1] === 'N';
  }

  checkSpecial(): Special {
    const [fourth, third, second, last] = this.history;
    let special: Special = '';

    // Ex. ← ← → : boost de vitesse
    if (third === second && second === this.opposite(last)) {
      special = 'speed';
    }

    // Ex. → ↑ → ↑ : déplacement en diagonale
    if (fourth === second && third === last && last !== this.opposite(third) && last !== 'N') {
      special = this.getDiagonal();
    }

    return special;
  }

  opposite(input: InputKey): Cardinal | undefined {
    return isCardinal(input) ? OPPOSITES[input] : undefined;
  }

  getHistory(): string {
    return this.history.map((input) => SYMBOLS[input]).join(' ');
  }

  getDiagonal(): Diagonal | '' {
    const [, , second, last] = this.history;

    return DIAGONALS[last + second] ?? '';
  }
}
