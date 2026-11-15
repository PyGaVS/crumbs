import { Animation, CueStep } from '../domain/Animation';
import { EnemyKind } from '../domain/EnemyKind';
import { Player } from '../entities/Player';
import { hitboxRing } from '../utils/hitboxes';
import { EnemyId } from './enums/EnemyId';
import { FxId } from './enums/FxId';
import { SkinAction } from './enums/SkinAction';
import { SkinId } from './enums/SkinId';
import StrikeAbility from './abilities/StrikeAbility';
import FxStep from './animations/FxStep';
import MoveStep from './animations/MoveStep';
import SkinStep from './animations/SkinStep';

/** Catalogue des ennemis. */
export const ALL_ENEMY_KINDS: readonly EnemyKind[] = [
  new EnemyKind(
    EnemyId.MUSHROOM,
    'Champignon',
    SkinId.MUSHROOM,
    30, 50,
    [
      {
        ability: new StrikeAbility({
          damage: 10, target: Player,
          animation: new Animation([
            new SkinStep({ action: SkinAction.MUSHROOM_CHARGE }),
            new SkinStep({ at: 600, action: SkinAction.MUSHROOM_RELEASE, duration: 500 }),
            new FxStep({ at: 600, fx: FxId.SMOKE, reach: 96, count: 8, upright: true, size: 160, tint: 0xba56f5 }),
            new CueStep({ at: 600, hitboxes: hitboxRing(8, 96, 64) }),
          ]),
        }),
        triggers: [
          (mob, scene) => mob.isWithin(110, scene.player), 
          (mob, scene) => mob.reachesDestination(scene)],
      },
    ],
    {
      destination: (mob, scene) => mob.ambush(scene.player, 200, 1),
      interval: 250,
      shouldHalt: (mob, scene) => mob.reaches(scene.player),
      disableUTurn: false,
    },
  ),
  new EnemyKind(
    EnemyId.REPTILE,
    'Reptile',
    SkinId.REPTILE,
    50, 150,
    [{ ability: new StrikeAbility({
        damage: 10, target: Player,
        animation: new Animation([
          new SkinStep({ action: SkinAction.WALK, reverse: true }),
          new MoveStep({ distance: -96, duration: 2000, ease: 'Cubic.out' }),
          new SkinStep({ at: 450, action: SkinAction.WALK }),
          new MoveStep({ at: 450, distance: 144, height: 24, duration: 500, ease: 'Quad.out' }),
          new FxStep({ at: 950, fx: FxId.ROCK_BURST, reach: 0, upright: true, size: 96 }),
          new FxStep({ at: 950, fx: FxId.SMOKE_CIRCULAR, reach: 0, upright: true, size: 160 }),
          new CueStep({ at: 950, hitboxes: [{ x: 0, y: 0, radius: 64 }] }),
        ]),
      }),
      triggers: [
        (mob, scene) => mob.isWithin(80, scene.player)
      ] }],
    {
      destination: (_mob, scene) => scene.player,
      interval: 250,
      shouldHalt: (mob, scene) => mob.reaches(scene.player),
    },
  ),
];

export function getEnemyKind(id: EnemyId): EnemyKind {
  const kind = ALL_ENEMY_KINDS.find((e) => e.id === id);

  if (!kind) {
    throw new Error(`Ennemi inconnu : ${id}`);
  }

  return kind;
}
