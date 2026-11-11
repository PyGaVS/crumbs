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
    30,
    50,
    [
      {
        damage: 10,
        animationId: AnimationId.POISON_CLOUD,
        trigger: (mob, scene) => mob.isWithin(110, scene.player),
      },
    ],
    {
      destination: (mob, scene) => mob.ambush(scene.player, 200, 0.8),
      interval: 250,
      shouldHalt: (mob, scene) => mob.reaches(scene.player),
      disableUTurn: false,
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
