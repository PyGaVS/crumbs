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
    new CueStep({
      hitboxes: [
        { x: 36, y: -50, radius: 30 }, { x: 60, y: 0, radius: 30 }, { x: 36, y: 50, radius: 30 },
      ],
    }),
    new SlashStep({ fx: FxId.SLASH_02, reach: 30, size: 150, mirrored: true }),
    new SwingStep({ from: FALCHION_GUARD, to: { angle: Math.PI / 3 }, duration: 250, ease: 'Cubic.out' }),
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
