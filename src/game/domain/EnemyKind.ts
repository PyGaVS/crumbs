import type { EnemyId } from '../data/enums/EnemyId';
import type { SkinId } from '../data/enums/SkinId';
import type { MobAttack } from './Attack';
import type { MobBehavior } from './MobBehavior';
import type { Skin } from './Skin';
import { getSkin } from '../data/skins';

export class EnemyKind {
  constructor(
    readonly id: EnemyId,
    readonly name: string,
    readonly skinId: SkinId,
    readonly maxHealth: number,
    readonly speed: number,
    readonly attacks: readonly MobAttack[],
    readonly behavior?: MobBehavior,
  ) {}

  get skin(): Skin {
    return getSkin(this.skinId);
  }
}
