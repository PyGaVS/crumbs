import type { Ability } from './Ability';
import type { Enemy } from '../entities/Enemy';
import type { BattleScene } from '../scenes/BattleScene';

export type MobCondition = (mob: Enemy, scene: BattleScene) => boolean;

/** Une condition, ou une condition à valider after ms d'affilée depuis la dernière attaque du mob. */
export type MobTrigger = MobCondition | { when: MobCondition; after: number };

export type MobAttack = {
  ability: Ability;
  triggers: readonly MobTrigger[];
  /** Angle (radians) des tirs, calculé au lancement de l'attaque. */
  customAngle?: (mob: Enemy, scene: BattleScene) => number;
};
