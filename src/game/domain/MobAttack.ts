import type { Ability } from './Ability';
import type { Enemy } from '../entities/Enemy';
import type { BattleScene } from '../scenes/BattleScene';

export type MobAttack = {
  ability: Ability<Enemy>;
  triggers: readonly ((mob: Enemy, scene: BattleScene) => boolean)[];
};
