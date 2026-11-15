import { CueStep, type AnimationStep } from '../../domain/Animation';
import type { Point } from '../../utils/orientation';
import { FxId } from '../enums/FxId';
import { ProjectileSkinId } from '../enums/ProjectileSkinId';
import { SkinAction } from '../enums/SkinAction';
import FxStep from './FxStep';
import HurtboxStep from './HurtboxStep';
import MoveStep, { type MoveObstacles } from './MoveStep';
import ScaleStep from './ScaleStep';
import SkinStep from './SkinStep';
import SpriteStep from './SpriteStep';
import SwingStep from './SwingStep';
import WeaponFramesStep from './WeaponFramesStep';

type BowOptions = {
  frames: readonly number[];
  positions: readonly Point[];
};

type DashOptions = {
  distance?: number;
  duration?: number;
  obstacles?: MoveObstacles;
};

export function dash({
  distance = 256,
  duration = 160,
  obstacles = { crossWalls: true, crossFighters: true },
}: DashOptions = {}): AnimationStep[] {
  return [
    new SkinStep({ action: SkinAction.WALK }),
    new FxStep({ fx: FxId.SMOKE_CIRCULAR, reach: 0, upright: true, size: 48, duration: 200, offset: [0, 32] }),
    new MoveStep({ distance, duration, ease: 'Cubic.out', obstacles }),
    new ScaleStep({ scale: [1.2, 0.7], duration: 60, hold: 80, recover: 60, ease: 'Quad.out' }),
    new HurtboxStep({ scale: 0.7, duration: 60, hold: 80, recover: 60, ease: 'Quad.out' }),
  ];
}

export function bow({ frames, positions }: BowOptions): AnimationStep[] {
  return [
    new SkinStep({ action: SkinAction.ATTACK, duration: 800 }),
    new SwingStep({ from: { angle: -Math.PI / 2, radius: 0, frontShift: 28 }, to: {}, duration: 800, ease: 'Linear' }),
    new WeaponFramesStep({ frames, duration: 700 }),
    new SpriteStep({ skinId: ProjectileSkinId.ARROW, positions, duration: 525 }),
    new CueStep({ at: 525 }),
  ];
}
