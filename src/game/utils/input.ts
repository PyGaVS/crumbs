import { Inputs } from '../data/enums/Inputs';
import { Cardinal, CARDINALS, Diagonal } from './types';

export const OPPOSITES: Record<Cardinal, Cardinal> = {
  [Inputs.RIGHT]: Inputs.LEFT,
  [Inputs.LEFT]: Inputs.RIGHT,
  [Inputs.UP]: Inputs.DOWN,
  [Inputs.DOWN]: Inputs.UP,
};

export function isCardinal(input: string): input is Cardinal {
  return (CARDINALS as readonly string[]).includes(input);
}

export function getOpposite(input: Inputs): Inputs {
  if (isCardinal(input)) {
    return OPPOSITES[input];
  }

  return input;
}

export function getPerpendicularDirections(input: Inputs): Inputs[] {
  switch (input) {
    case Inputs.RIGHT:
    case Inputs.LEFT:
      return [Inputs.UP, Inputs.DOWN];
    case Inputs.UP:
    case Inputs.DOWN:
      return [Inputs.RIGHT, Inputs.LEFT];
    default:
      return [];
  }
}

const SYMBOLS: Record<Inputs, string> = {
  [Inputs.RIGHT]: '→',
  [Inputs.LEFT]: '←',
  [Inputs.UP]: '↑',
  [Inputs.DOWN]: '↓',
  [Inputs.HALT]: 'H',
  [Inputs.ATTACK]: 'x',
  [Inputs.NONE]: ' ',
};

export function getSymbol(input: Inputs): string {
  return SYMBOLS[input];
}

/**
 * Garde les dernières touches ; la détection des séquences est dans Technique.
 * (Nommé InputHistory car `input` est déjà une propriété des GameObjects Phaser.)
 */
export class InputHistory {
  history: Inputs[] = [Inputs.NONE, Inputs.NONE, Inputs.NONE, Inputs.NONE];

  addInput(input: Inputs, course?: Cardinal | Diagonal | Inputs.HALT): void {
    // Amorce : au début d'un enchaînement, la direction de course compte comme la frappe précédente
    if (
      input !== Inputs.NONE &&
      course !== undefined &&
      this.isChainStart() &&
      (isCardinal(course) || course === Inputs.HALT)
    ) {
      this.history.push(course);
    }

    this.history.push(input);
    this.history = this.history.slice(-4);
  }

  private isChainStart(): boolean {
    return this.history[this.history.length - 1] === Inputs.NONE;
  }

  getHistory(): string {
    return this.history.map(getSymbol).join(' ');
  }
}
