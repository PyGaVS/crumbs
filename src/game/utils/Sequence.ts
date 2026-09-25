import { CARDINALS, getOpposite, getPerpendicularDirections, InputKey } from './input';

/**
 * L'input requis d'une technique : un arbre de possibilités construit en fluent
 * (`new Sequence().same().same().opposite()`). Chaque nœud est un input, chaque
 * branche une suite acceptée.
 */
export default class Sequence {
  child: Sequence[] = [];
  input: InputKey = 'N';

  private addLeaves(inputs: (leaf: Sequence) => readonly InputKey[]): this {
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

  setInput(input: InputKey): this {
    this.input = input;

    return this;
  }

  up(): this {
    return this.addLeaves(() => ['U']);
  }

  down(): this {
    return this.addLeaves(() => ['D']);
  }

  left(): this {
    return this.addLeaves(() => ['L']);
  }

  right(): this {
    return this.addLeaves(() => ['R']);
  }

  halt(): this {
    return this.addLeaves(() => ['H']);
  }

  attack(): this {
    return this.addLeaves(() => ['A']);
  }

  among(inputs: InputKey[]): this {
    return this.addLeaves(() => inputs);
  }

  cardinals(): this {
    return this.addLeaves(() => CARDINALS);
  }

  same(): this {
    return this.addLeaves((leaf) => (leaf.input === 'N' ? CARDINALS : [leaf.input]));
  }

  opposite(): this {
    return this.addLeaves((leaf) => [getOpposite(leaf.input)]);
  }

  perpendicular(): this {
    return this.addLeaves((leaf) => getPerpendicularDirections(leaf.input));
  }

  paths(): InputKey[][] {
    if (this.child.length === 0) {
      return [[]];
    }

    return this.child.flatMap((c) => c.paths().map((path) => [c.input, ...path]));
  }
}
