import { EnemyKind } from '../domain/EnemyKind';
import { AnimationId } from './enums/AnimationId';
import { EnemyId } from './enums/EnemyId';
import { SkinId } from './enums/SkinId';

/** Catalogue des ennemis. */
export const ALL_ENEMY_KINDS: readonly EnemyKind[] = [
  new EnemyKind(EnemyId.DUMMY, 'Mannequin', SkinId.SNAKE, 30, 10, []),
  new EnemyKind(
    EnemyId.MUSHROOM,
    'Champignon',
    SkinId.MUSHROOM,
    30, 50,
    [
      {
        damage: 10,
        animationId: AnimationId.POISON_CLOUD,
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
    [{ damage: 10, animationId: AnimationId.REPTILE_LEAP, 
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
