import { EnemyKind } from '../entities/EnemyKind';
import { Skin } from '../entities/Skin';
import { EnemyId } from './enums/EnemyId';

/** Catalogue des ennemis. Le mannequin d'entraînement seulement, les vrais arrivent au jalon 0.5. */
export const ALL_ENEMY_KINDS: readonly EnemyKind[] = [
  new EnemyKind(EnemyId.DUMMY, 'Mannequin', new Skin('snake'), 30, 0),
];

export function getEnemyKind(id: EnemyId): EnemyKind {
  const kind = ALL_ENEMY_KINDS.find((e) => e.id === id);

  if (!kind) {
    throw new Error(`Ennemi inconnu : ${id}`);
  }

  return kind;
}
