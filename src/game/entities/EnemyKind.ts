import type { EnemyId } from '../data/enums/EnemyId';
import type { Skin } from './Skin';

export class EnemyKind {
  constructor(
    readonly id: EnemyId,
    readonly name: string,
    readonly skin: Skin,
    readonly maxHealth: number,
    readonly damage: number,
  ) {}
}
