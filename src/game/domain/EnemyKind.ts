import type { EnemyId } from '../data/enums/EnemyId';
import type { SkinId } from '../data/enums/SkinId';
import type { Mob } from '../entities/Mob';
import type { BattleScene } from '../scenes/BattleScene';
import type { Attack } from './Attack';
import type { MobBehavior } from './MobBehavior';
import type { Skin } from './Skin';
import { getSkin } from '../data/skins';

export type MobAttack = Attack & {
  trigger: (mob: Mob, scene: BattleScene) => boolean;
};

export class EnemyKind {
  constructor(
    readonly id: EnemyId,
    readonly name: string,
    readonly skinId: SkinId,
    readonly maxHealth: number,
    readonly attacks: readonly MobAttack[],
    readonly speed: number,
    readonly behavior?: MobBehavior,
  ) {}

  get skin(): Skin {
    return getSkin(this.skinId);
  }
}
