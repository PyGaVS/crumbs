export type Cardinal = 'R' | 'L' | 'U' | 'D';
export type Diagonal = 'RU' | 'LU' | 'LD' | 'RD';

/** 'N' = aucune touche pressée pendant 250 ms, sert à séparer les combos. */
export type InputKey = Cardinal | 'N';

export type Special = 'speed' | Diagonal | '';

const OPPOSITES: Record<Cardinal, Cardinal> = { R: 'L', L: 'R', U: 'D', D: 'U' };

const SYMBOLS: Record<Cardinal, string> = { R: '→', L: '←', U: '↑', D: '↓' };

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

  addInput(input: InputKey): Special {
    this.history.push(input);
    this.history = this.history.slice(-4);

    return this.checkSpecial();
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
    return input === 'N' ? undefined : OPPOSITES[input];
  }

  getHistory(): string {
    return this.history.map((input) => (input === 'N' ? ' ' : SYMBOLS[input])).join(' ');
  }

  getDiagonal(): Diagonal | '' {
    const [, , second, last] = this.history;

    return DIAGONALS[last + second] ?? '';
  }
}
