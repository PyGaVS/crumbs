import type { Enemy } from '../entities/Enemy';
import type { BattleScene } from '../scenes/BattleScene';

export type MobBehavior = {
  destination: (mob: Enemy, scene: BattleScene) => { x: number; y: number };
  interval: number;
  shouldHalt: (mob: Enemy, scene: BattleScene) => boolean;
  disableUTurn?: boolean;
};
