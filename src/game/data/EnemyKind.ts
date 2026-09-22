import type { EnemyId } from './enums/EnemyId';

export class EnemyKind {
  constructor(
    readonly id: EnemyId,
    readonly name: string,
    readonly maxHealth: number,
    readonly damage: number,
  ) {}
}
