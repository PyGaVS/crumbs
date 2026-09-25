import { Inputs } from '../data/enums/Inputs';
import { getOpposite, getPerpendicularDirections } from './input';
import { CARDINALS } from './types';

/**
 * L'input requis d'une technique : un arbre de possibilités construit en fluent
 * (`new Sequence().same().same().opposite()`). Chaque nœud est un input, chaque
 * branche une suite acceptée.
 */
export default class Sequence {
  child: Sequence[] = [];
  input: Inputs = Inputs.NONE;

  private addLeaves(inputs: (leaf: Sequence) => readonly Inputs[]): this {
    if (this.child.length === 0) {
      for (const input of inputs(this)) {
        const leaf = new Sequence();

        leaf.setInput(input);
        this.child.push(leaf);
      }
    } else {
      for (const c of this.child) {
        c.addLeaves(inputs);
      }
    }

    return this;
  }

  setInput(input: Inputs): this {
    this.input = input;

    return this;
  }

  up(): this {
    return this.addLeaves(() => [Inputs.UP]);
  }

  down(): this {
    return this.addLeaves(() => [Inputs.DOWN]);
  }

  left(): this {
    return this.addLeaves(() => [Inputs.LEFT]);
  }

  right(): this {
    return this.addLeaves(() => [Inputs.RIGHT]);
  }

  halt(): this {
    return this.addLeaves(() => [Inputs.HALT]);
  }

  attack(): this {
    return this.addLeaves(() => [Inputs.ATTACK]);
  }

  among(inputs: Inputs[]): this {
    return this.addLeaves(() => inputs);
  }

  cardinals(): this {
    return this.addLeaves(() => CARDINALS);
  }

  same(): this {
    return this.addLeaves((leaf) => (leaf.input === Inputs.NONE ? CARDINALS : [leaf.input]));
  }

  opposite(): this {
    return this.addLeaves((leaf) => [getOpposite(leaf.input)]);
  }

  perpendicular(): this {
    return this.addLeaves((leaf) => getPerpendicularDirections(leaf.input));
  }

  paths(): Inputs[][] {
    if (this.child.length === 0) {
      return [[]];
    }

    return this.child.flatMap((c) => c.paths().map((path) => [c.input, ...path]));
  }
}
