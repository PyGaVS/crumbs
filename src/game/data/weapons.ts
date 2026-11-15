import { FxId } from './enums/FxId';
import { ProjectileSkinId } from './enums/ProjectileSkinId';
import { SkinAction } from './enums/SkinAction';
import { TechniqueId } from './enums/TechniqueId';
import { WeaponId } from './enums/WeaponId';
import { WeaponSkinId } from './enums/WeaponSkinId';
import { Animation, CueStep } from '../domain/Animation';
import { Weapon } from '../domain/Weapon';
import { Enemy } from '../entities/Enemy';
import ProjectileAbility from './abilities/ProjectileAbility';
import StrikeAbility from './abilities/StrikeAbility';
import FxStep from './animations/FxStep';
import { bow } from './animations/presets';
import SkinStep from './animations/SkinStep';
import SwingStep from './animations/SwingStep';

/** Catalogue des armes. */
export const ALL_WEAPONS: readonly Weapon[] = [
  new Weapon( WeaponId.FALCHION, 'Fauchon', WeaponSkinId.FALCHION,
    new StrikeAbility({
      damage: 5, target: Enemy,
      animation: new Animation([
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
    }),
    [TechniqueId.SHOOT_SLASH, TechniqueId.SPIN_SLASH],
  ),
  new Weapon( WeaponId.BOW, 'Arc', WeaponSkinId.BOW,
    new ProjectileAbility({
      skinId: ProjectileSkinId.ARROW, speed: 2300, range: 900, damage: 10, target: Enemy, size: 48,
      hitboxes: [{ x: 18, y: 0, radius: 8 }],
      crossBody: false,
      animation: new Animation(bow({ frames: [0, 1, 2, 0], positions: [[38, 0], [30, 0], [26, 0]] })),
    }),
    [TechniqueId.POWER_SHOT],
  ),
];

export function getWeapon(id: WeaponId): Weapon {
  const weapon = ALL_WEAPONS.find((w) => w.id === id);

  if (!weapon) {
    throw new Error(`Arme inconnue : ${id}`);
  }

  return weapon;
}
