import type { AnimationId } from '../data/enums/AnimationId';
import type { Mob } from '../entities/Mob';
import type { BattleScene } from '../scenes/BattleScene';

export type Attack = {
  damage: number;
  animationId: AnimationId;
};

export type MobAttack = Attack & {
  trigger: (mob: Mob, scene: BattleScene) => boolean;
};
