import type { EnemyId } from '../data/enums/EnemyId';

export class EnemyKind {
  constructor(
    readonly id: EnemyId,
    readonly name: string,
    readonly maxHealth: number,
    readonly damage: number,
  ) {}
}
