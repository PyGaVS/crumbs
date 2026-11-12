import { Animation, CueStep } from '../../domain/Animation';
import { hitboxRing } from '../../utils/hitboxes';
import { AnimationId } from '../enums/AnimationId';
import { FxId } from '../enums/FxId';
import { SkinAction } from '../enums/SkinAction';
import FxStep from './FxStep';
import MoveStep from './MoveStep';
import SkinStep from './SkinStep';
import SwingStep from './SwingStep';
import WeaponFramesStep from './WeaponFramesStep';

/** Catalogue des animations. */
export const ALL_ANIMATIONS: readonly Animation[] = [
  new Animation(AnimationId.FALCHION_ATTACK, [
    new SkinStep({ action: SkinAction.ATTACK }),
    new CueStep({
      hitboxes: [
        { x: 36, y: -50, radius: 30 }, { x: 60, y: 0, radius: 30 }, { x: 36, y: 50, radius: 30 },
      ],
    }),
    new FxStep({ fx: FxId.SLASH_02, reach: 30, size: 150, mirrored: true }),
    new SwingStep({
      from: { angle: -Math.PI / 3, radius: 40, pivot: 0 },
      to: { angle: Math.PI / 3 },
      duration: 250, ease: 'Cubic.out', hold: 70,
    }),
  ]),
  new Animation(AnimationId.BOW_SHOT, [
    new SkinStep({ action: SkinAction.ATTACK, duration: 500 }),
    new SwingStep({ from: { angle: -Math.PI / 2, radius: 0, pivot: 28 }, to: {}, duration: 600, ease: 'Linear' }),
    new WeaponFramesStep({ frames: [0, 1, 2, 0], duration: 500 }),
    new CueStep({ at: 300 }),
  ]),
  new Animation(AnimationId.DASH, [new CueStep()]),
  new Animation(AnimationId.SHURIKENS_THROW, [
    new SkinStep({ action: SkinAction.ATTACK, duration: 250 }), 
    new CueStep()
  ]),
  new Animation(AnimationId.KUNAI_THROW, [
    new SkinStep({ action: SkinAction.ATTACK, duration: 200 }), 
    new CueStep()
  ]),
  new Animation(AnimationId.SHOOT_SLASH, [
    new SkinStep({ action: SkinAction.ATTACK }),
    new SwingStep({
      from: { angle: -Math.PI*2 / 5, radius: 40, pivot: 0 },
      to: { angle: Math.PI*2 / 5 },
      duration: 220, ease: 'Cubic.out', hold: 120,
    }),
    new CueStep({ at: 50 }),
  ]),
  new Animation(AnimationId.SPIN_SLASH, [
    new SkinStep({ action: SkinAction.SPIN, duration: 250 }),
    new FxStep({ fx: FxId.SLASH_CIRCULAR, reach: 0, size: 192, mirrored: true, duration: 300 }),
    new CueStep({ at: 100, hitboxes: hitboxRing(8, 64, 36) }),
  ]),
  new Animation(AnimationId.POISON_CLOUD, [
    new SkinStep({ action: SkinAction.MUSHROOM_CHARGE }),
    new SkinStep({ at: 600, action: SkinAction.MUSHROOM_RELEASE, duration: 500 }),
    new FxStep({ at: 600, fx: FxId.SMOKE, reach: 96, count: 8, upright: true, size: 160, tint: 0xba56f5 }),
    new CueStep({ at: 600, hitboxes: hitboxRing(8, 96, 64) }),
  ]),
  new Animation(AnimationId.REPTILE_LEAP, [
    new SkinStep({ action: SkinAction.WALK, reverse: true }),
    new MoveStep({ distance: -96, duration: 2000, ease: 'Cubic.out' }),
    new SkinStep({ at: 450, action: SkinAction.WALK }),
    new MoveStep({ at: 450, distance: 144, height: 24, duration: 500, ease: 'Quad.out' }),
    new FxStep({ at: 950, fx: FxId.ROCK_BURST, reach: 0, upright: true, size: 96 }),
    new FxStep({ at: 950, fx: FxId.SMOKE_CIRCULAR, reach: 0, upright: true, size: 160 }),
    new CueStep({ at: 950, hitboxes: [{ x: 0, y: 0, radius: 64 }] }),
  ]),
];

export function getAnimation(id: AnimationId): Animation {
  const animation = ALL_ANIMATIONS.find((a) => a.id === id);

  if (!animation) {
    throw new Error(`Animation inconnue : ${id}`);
  }

  return animation;
}
