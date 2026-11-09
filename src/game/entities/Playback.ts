import type { Facing } from '../utils/orientation';
import type { Animation, Hitbox, PlayOptions } from '../domain/Animation';
import type { Entity } from './Entity';
import type { WeaponGrip, WeaponPose } from './HeldWeapon';

export type EaseFunction = (v: number) => number;

type Values = Record<string, number>;

type Motion = { from: Values; to: Values; start: number; duration: number; ease: EaseFunction };

/** Une lecture d'animation, avancée par l'entité à chaque frame */
export class Playback {
  private readonly frame: number;
  private elapsed = 0;
  private now = 0;
  private next = 0;
  private cues = 0;
  private ended = false;
  private grip?: WeaponGrip;
  private readonly motions = new Map<Values, Motion>();

  constructor(
    readonly entity: Entity,
    readonly facing: Facing,
    readonly animation: Animation,
    private readonly options: PlayOptions,
  ) {
    this.frame = entity.scene.game.loop.frame;
  }

  start(): void {
    this.advance(0);
  }

  tick(delta: number): void {
    // Rien pendant la frame de création : un tween Phaser ne consomme aucun delta à sa première mise à jour
    if (!this.ended && this.entity.scene.game.loop.frame !== this.frame) {
      this.advance(this.elapsed + delta);
    }
  }

  cue(hitboxes: readonly Hitbox[]): void {
    const index = this.cues++;
    const last = index === this.animation.cues.length - 1;

    this.options.onCue?.({ facing: this.facing, index, last, hitboxes });
  }

  /**
   * Prend l'arme de l'entité, rendue à la main à la fin de la lecture.
   * @param from pose de départ, obligatoire au premier geste
   * @returns la pose à animer
   */
  holdWeapon(mirror: boolean, from?: WeaponPose): WeaponPose {
    const weapon = this.entity.heldWeapon;

    if (!weapon) {
      throw new Error(`Animation ${this.animation.id} : geste d'arme sur une entité sans arme`);
    }

    if (!this.grip) {
      if (!from) {
        throw new Error(`Animation ${this.animation.id} : premier geste sans pose`);
      }

      this.grip = { facing: this.facing, pose: { ...from }, mirror };
      weapon.hold(this.grip);
    }

    this.grip.mirror = mirror;

    return this.grip.pose;
  }

  /** Anime target sur l'horloge de la lecture, en coupant sa motion précédente. */
  animate<T extends Values>(target: T, to: Partial<T>, duration: number, ease: EaseFunction, from?: Partial<T>): void {
    const previous = this.motions.get(target);

    if (previous) {
      apply(target, previous, this.now);
    }

    Object.assign(target, from);
    this.motions.set(target, { from: { ...target }, to: to as Values, start: this.now, duration, ease });
  }

  /** Steps en attente abandonnés, arme rendue ; les FX lancés finissent seuls. */
  stop(): void {
    if (this.ended) {
      return;
    }

    this.ended = true;

    if (this.grip) {
      this.entity.heldWeapon?.hold();
    }
  }

  private advance(time: number): void {
    const { steps, duration } = this.animation;

    while (!this.ended && this.next < steps.length && steps[this.next].at <= time) {
      const step = steps[this.next++];

      this.now = step.at;
      step.start(this);
    }

    if (this.ended) {
      return;
    }

    this.elapsed = this.now = time;
    this.motions.forEach((motion, target) => apply(target, motion, time));

    if (time >= duration) {
      this.stop();
    }
  }
}

function apply(target: Values, { from, to, start, duration, ease }: Motion, time: number): void {
  const progress = duration > 0 ? ease(Math.min(1, (time - start) / duration)) : 1;

  for (const key in to) {
    target[key] = from[key] + (to[key] - from[key]) * progress;
  }
}
