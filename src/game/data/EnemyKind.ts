import type { EnemyId } from './ids';

export class EnemyKind {
  constructor(
    readonly id: EnemyId,
    readonly name: string,
    readonly maxHealth: number,
    readonly damage: number,
  ) {}
}
