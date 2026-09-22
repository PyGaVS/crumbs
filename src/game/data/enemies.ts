import { EnemyKind } from './EnemyKind';
import { EnemyId } from './enums/EnemyId';

/** Catalogue des ennemis. Un seul pour l'instant, les vrais arrivent au jalon 0.5. */
export const ALL_ENEMY_KINDS: readonly EnemyKind[] = [new EnemyKind(EnemyId.CHASER, 'Traqueur', 30, 10)];

export function getEnemyKind(id: EnemyId): EnemyKind {
  const kind = ALL_ENEMY_KINDS.find((e) => e.id === id);

  if (!kind) {
    throw new Error(`Ennemi inconnu : ${id}`);
  }

  return kind;
}
