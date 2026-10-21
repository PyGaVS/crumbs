import { Animation, CueStep } from '../../entities/Animation';
import type { WeaponPose } from '../../entities/HeldWeapon';
import { AnimationId } from '../enums/AnimationId';
import { FxId } from '../enums/FxId';
import { SkinAction } from '../enums/SkinAction';
import SkinStep from './SkinStep';
import SlashStep from './SlashStep';
import SwingStep from './SwingStep';

const FALCHION_GUARD: WeaponPose = { angle: -Math.PI / 3, radius: 40, pivot: 0 };

/** Catalogue des animations. */
export const ALL_ANIMATIONS: readonly Animation[] = [
  new Animation(AnimationId.FALCHION_ATTACK, [
    new SkinStep({ action: SkinAction.ATTACK }),
    new CueStep(),
    new SlashStep({ fx: FxId.SLASH_02, reach: 30, size: 150, mirrored: true }),
    new SwingStep({ from: FALCHION_GUARD, to: { angle: Math.PI / 3 }, duration: 250, ease: 'Cubic.out' }),
  ]),
  new Animation(AnimationId.DOUBLE_SLASH, [
    new SkinStep({ action: SkinAction.ATTACK }),
    new SwingStep({ from: FALCHION_GUARD, to: { angle: Math.PI / 3 }, duration: 160, ease: 'Cubic.out' }),
    new SlashStep({ fx: FxId.SLASH_02, reach: 30, size: 150, duration: 160, mirrored: true }),
    new CueStep({ at: 33 }),
    new SwingStep({
      at: 240,
      to: { angle: -Math.PI / 2, radius: 46 },
      duration: 180,
      ease: 'Back.out',
      clockwise: false,
    }),
    new SlashStep({
      at: 240,
      fx: FxId.SLASH_02,
      reach: 36,
      size: 170,
      angle: -Math.PI / 12,
      duration: 180,
    }),
    new CueStep({ at: 258 }),
  ]),
  new Animation(AnimationId.THROW, [new SkinStep({ action: SkinAction.ATTACK }), new CueStep()]),
];

export function getAnimation(id: AnimationId): Animation {
  const animation = ALL_ANIMATIONS.find((a) => a.id === id);

  if (!animation) {
    throw new Error(`Animation inconnue : ${id}`);
  }

  return animation;
}
