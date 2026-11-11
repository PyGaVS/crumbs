import type { Mob } from '../entities/Mob';
import type { BattleScene } from '../scenes/BattleScene';

export type MobBehavior = {
  destination: (mob: Mob, scene: BattleScene) => { x: number; y: number };
  interval: number;
  shouldHalt: (mob: Mob, scene: BattleScene) => boolean;
  disableUTurn?: boolean;
};
