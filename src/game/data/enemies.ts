import { EnemyKind } from '../domain/EnemyKind';
import { EnemyId } from './enums/EnemyId';
import { SkinId } from './enums/SkinId';

/** Catalogue des ennemis. Le mannequin d'entraînement seulement, les vrais arrivent au jalon 0.5. */
export const ALL_ENEMY_KINDS: readonly EnemyKind[] = [new EnemyKind(EnemyId.DUMMY, 'Mannequin', SkinId.SNAKE, 30, 0)];

export function getEnemyKind(id: EnemyId): EnemyKind {
  const kind = ALL_ENEMY_KINDS.find((e) => e.id === id);

  if (!kind) {
    throw new Error(`Ennemi inconnu : ${id}`);
  }

  return kind;
}
