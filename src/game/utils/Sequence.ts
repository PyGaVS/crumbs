import { Inputs } from '../data/enums/Inputs';
import { getOpposite, getPerpendicularDirections } from './input';
import { CARDINALS } from './orientation';

/**
 * L'input requis d'une technique : un arbre de possibilités construit en fluent
 * (`new Sequence().same().same().opposite()`). Chaque nœud est un input, chaque
 * branche une suite acceptée.
 */
export default class Sequence {
  child: Sequence[] = [];
  input: Inputs = Inputs.NONE;

  private addLeaves(inputs: (path: readonly Inputs[]) => readonly Inputs[], path: readonly Inputs[] = []): this {
    if (this.child.length === 0) {
      for (const input of inputs(path)) {
        const leaf = new Sequence();

        leaf.setInput(input);
        this.child.push(leaf);
      }
    } else {
      for (const c of this.child) {
        c.addLeaves(inputs, [...path, c.input]);
      }
    }

    return this;
  }

  private addRelative(stepsBack: number, inputs: (reference: Inputs) => readonly Inputs[]): this {
    return this.addLeaves((path) => inputs(path[path.length - stepsBack] ?? Inputs.NONE));
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

  switch(): this {
    return this.addLeaves(() => [Inputs.SWITCH]);
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

  same(stepsBack = 1): this {
    return this.addRelative(stepsBack, (reference) => [reference]);
  }

  opposite(stepsBack = 1): this {
    return this.addRelative(stepsBack, (reference) => [getOpposite(reference)]);
  }

  perpendicular(stepsBack = 1): this {
    return this.addRelative(stepsBack, getPerpendicularDirections);
  }

  paths(): Inputs[][] {
    if (this.child.length === 0) {
      return [[]];
    }

    return this.child.flatMap((c) => c.paths().map((path) => [c.input, ...path]));
  }
}
