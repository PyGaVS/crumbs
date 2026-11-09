import { Animation, CueStep } from '../../domain/Animation';
import { hitboxRing } from '../../utils/hitboxes';
import { AnimationId } from '../enums/AnimationId';
import { FxId } from '../enums/FxId';
import { SkinAction } from '../enums/SkinAction';
import SkinStep from './SkinStep';
import SlashStep from './SlashStep';
import SwingStep from './SwingStep';

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
    new SwingStep({
      from: { angle: -Math.PI / 3, radius: 40, pivot: 0 },
      to: { angle: Math.PI / 3 },
      duration: 250, ease: 'Cubic.out', hold: 70,
    }),
  ]),
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
    new SkinStep({ action: SkinAction.ATTACK }),
    new SkinStep({ at: 500, action: SkinAction.ATTACK, direction: (facing) => facing.rotate(1) }),
    new SkinStep({ at: 1000, action: SkinAction.ATTACK, direction: (facing) => facing.rotate(2) }),
    new SkinStep({ at: 1500, action: SkinAction.ATTACK, direction: (facing) => facing.rotate(3), duration: 100 }),
    new SlashStep({ fx: FxId.SLASH_CIRCULAR, reach: 0, size: 192, mirrored: true, duration: 300 }),
    new CueStep({ at: 100, hitboxes: hitboxRing(8, 64, 36) }),
  ]),
];

export function getAnimation(id: AnimationId): Animation {
  const animation = ALL_ANIMATIONS.find((a) => a.id === id);

  if (!animation) {
    throw new Error(`Animation inconnue : ${id}`);
  }

  return animation;
}
