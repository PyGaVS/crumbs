import type { AnimationId } from '../data/enums/AnimationId';
import type { Enemy } from '../entities/Enemy';
import type { BattleScene } from '../scenes/BattleScene';

export type Attack = {
  damage: number;
  animationId: AnimationId;
};

export type MobAttack = Attack & {
  trigger: (mob: Enemy, scene: BattleScene) => boolean;
};
