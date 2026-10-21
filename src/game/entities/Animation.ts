import type { AnimationId } from '../data/enums/AnimationId';
import type { Facing } from '../utils/orientation';
import type { Entity } from './Entity';
import type { Playback } from './Playback';

/** Une faute de frappe dans un nom d'ease retomberait en silence sur Power0. */
export type Ease = 'Cubic.out' | 'Back.out';

export type Cue = { readonly facing: Facing; readonly index: number; readonly last: boolean };

export type PlayOptions = {
  onCue?: (cue: Cue) => void;
  angle?: number;
};

export type StepOptions = {
  at?: number;
};

/** Partagé par les steps d'une animation pendant sa validation, dans l'ordre chronologique. */
export type StepCheck = { readonly id: AnimationId; holdsWeapon: boolean };

export abstract class AnimationStep {
  readonly at: number;

  constructor(options: StepOptions = {}) {
    this.at = options.at ?? 0;
  }

  /** ms pendant lesquelles le step anime encore après at. */
  get duration(): number {
    return 0;
  }

  check(_state: StepCheck): void {}

  abstract start(playback: Playback): void;
}

/** L'instant où le gameplay agit : le seul step que les techniques et les armes connaissent. */
export class CueStep extends AnimationStep {
  start(playback: Playback): void {
    playback.cue();
  }
}

/** Une animation : des steps datés, sans état, jouables par plusieurs entités à la fois. */
export class Animation {
  readonly steps: readonly AnimationStep[];
  readonly cueTimes: readonly number[];
  readonly duration: number;

  constructor(
    readonly id: AnimationId,
    steps: readonly AnimationStep[],
  ) {
    // Tri stable : à at égal, l'ordre du tableau fait foi
    this.steps = [...steps].sort((a, b) => a.at - b.at);
    this.cueTimes = this.steps.filter((s) => s instanceof CueStep).map((s) => s.at);
    this.duration = Math.max(0, ...this.steps.map((s) => s.at + s.duration));

    const state: StepCheck = { id, holdsWeapon: false };

    this.steps.forEach((s) => s.check(state));
  }

  /**
   * Joue l'animation sur entity en coupant sa lecture en cours ; les steps à 0 ms partent pendant l'appel.
   * @returns la lecture, pour l'arrêter avant sa fin
   */
  play(entity: Entity, options: PlayOptions = {}): Playback {
    return entity.perform(this, options);
  }

  /** L'input rejoué à la fin du lag couperait la lecture avant un repère tardif. */
  checkCuesBefore(lag: number, owner: string): void {
    const last = this.cueTimes[this.cueTimes.length - 1];

    if (last === undefined || (last > 0 && last >= lag)) {
      throw new Error(`${owner} : animation ${this.id} sans repère ou repère après le lag`);
    }
  }
}
