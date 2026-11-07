import { Tweens } from 'phaser';
import { AnimationStep, type Ease, type StepCheck, type StepOptions } from '../../entities/Animation';
import type { WeaponPose } from '../../entities/HeldWeapon';
import type { EaseFunction, Playback } from '../../entities/Playback';

type SwingOptions = StepOptions & {
  /** Obligatoire au premier geste ; absente, l'arme part de la pose laissée par le geste précédent. */
  from?: WeaponPose;
  to: Partial<WeaponPose>;
  /** ms */
  duration: number;
  ease: Ease;
  clockwise?: boolean;
  mirror?: boolean;
  hold?: number;
};

/** Un geste de l'arme tenue, d'une pose à une autre. */
export default class SwingStep extends AnimationStep {
  private readonly ease: EaseFunction;

  constructor(private readonly options: SwingOptions) {
    super(options);
    this.ease = Tweens.Builders.GetEaseFunction(options.ease) as EaseFunction;
  }

  override get duration(): number {
    return this.options.duration + (this.options.hold ?? 0);
  }

  override check(state: StepCheck): void {
    if (!this.options.from && !state.holdsWeapon) {
      throw new Error(`Animation ${state.id} : premier geste sans pose de départ`);
    }

    state.holdsWeapon = true;
  }

  start(playback: Playback): void {
    const { from, to, duration, clockwise = true, mirror = false } = this.options;
    const pose = playback.holdWeapon(mirror, from);
    const end = to.angle === undefined ? to : { ...to, angle: sweep(from?.angle ?? pose.angle, to.angle, clockwise) };

    playback.animate(pose, end, duration, this.ease, from);
  }
}

/** to décalé de tours entiers pour être atteint depuis from dans le sens voulu, horaire étant l'angle croissant. */
function sweep(from: number, to: number, clockwise: boolean): number {
  const turn = 2 * Math.PI;

  if (clockwise) {
    return to >= from ? to : to + turn * Math.ceil((from - to) / turn);
  }

  return to <= from ? to : to - turn * Math.ceil((to - from) / turn);
}
