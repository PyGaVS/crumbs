import { Inputs } from '../data/enums/Inputs';
import { Cardinal, CARDINALS } from './orientation';

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
  [Inputs.SWITCH]: 'S',
  [Inputs.ATTACK]: 'x',
  [Inputs.NONE]: ' ',
};

export function getSymbol(input: Inputs): string {
  return SYMBOLS[input];
}

/** Sans nouvel input pendant ce délai en ms, un NONE est ajouté à l'historique (coupe les combos). */
const INPUT_TIMEOUT = 250;

/**
 * Garde les dernières touches ; la détection des séquences est dans Technique.
 * (Nommé InputHistory car `input` est déjà une propriété des GameObjects Phaser.)
 */
export class InputHistory {
  history: Inputs[] = [Inputs.NONE, Inputs.NONE, Inputs.NONE, Inputs.NONE];
  private idleTime = 0;

  update(delta: number): void {
    this.idleTime += delta;

    if (this.idleTime >= INPUT_TIMEOUT) {
      this.addInput(Inputs.NONE);
    }
  }

  addInput(input: Inputs): void {
    this.history.push(input);
    this.history = this.history.slice(-4);
    this.idleTime = 0;
  }

  getHistory(): string {
    return this.history.map(getSymbol).join(' ');
  }
}
