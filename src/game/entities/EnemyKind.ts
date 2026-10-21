import type { EnemyId } from '../data/enums/EnemyId';
import type { SkinId } from '../data/enums/SkinId';
import type { Skin } from './Skin';
import { getSkin } from '../data/skins';

export class EnemyKind {
  constructor(
    readonly id: EnemyId,
    readonly name: string,
    readonly skinId: SkinId,
    readonly maxHealth: number,
    readonly damage: number,
  ) {}

  get skin(): Skin {
    return getSkin(this.skinId);
  }
}
