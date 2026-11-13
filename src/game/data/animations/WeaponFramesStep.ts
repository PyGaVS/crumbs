import { AnimationStep, type StepCheck, type StepOptions } from '../../domain/Animation';
import type { Playback } from '../../entities/Playback';

type WeaponFramesOptions = StepOptions & {
  frames: readonly number[];
  duration: number;
};

/** Les frames de l'arme tenue, réparties à parts égales sur duration. */
export default class WeaponFramesStep extends AnimationStep {
  constructor(private readonly options: WeaponFramesOptions) {
    super(options);
  }

  override get duration(): number {
    return this.options.duration;
  }

  override check(state: StepCheck): void {
    if (!state.holdsWeapon) {
      throw new Error(`Animation ${state.id} : frames d'arme sans geste qui la tient`);
    }
  }

  start(playback: Playback): void {
    const weapon = playback.entity.heldWeapon;

    if (!weapon) {
      throw new Error(`Animation ${playback.animation.id} : frames d'arme sur une entité sans arme`);
    }

    const { frames, duration } = this.options;

    playback.during(duration, (_ms, progress) => {
      weapon.setFrame(frames[Math.min(frames.length - 1, Math.floor(progress * frames.length))]);
    });
  }
}
