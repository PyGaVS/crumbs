import type { Fighter } from '../../entities/Fighter';
import { Ability, type AbilityOptions } from '../../domain/Ability';
import { DASH_MAX_EXTENSION, DASH_STEP } from '../../utils/consts';
import { hasObstacle } from '../../utils/collision';
import { Cardinal, Direction } from '../../utils/orientation';
import { Inputs } from '../enums/Inputs';

type DashTweenConfig = Omit<Phaser.Types.Tweens.TweenBuilderConfig, 'targets' | 'x' | 'y'>;

type DashOptions = AbilityOptions & {
  range: number;
  ignoreWalls?: boolean;
  crossBody?: boolean;
  direction?: Direction;
  tween: DashTweenConfig;
};

export default class DashAbility extends Ability {
  private readonly range: number;
  private readonly ignoreWalls: boolean;
  private readonly crossBody: boolean;
  private readonly direction?: Direction;
  private readonly tweenConfig: DashTweenConfig;

  constructor(options: DashOptions) {
    super(options);
    this.range = options.range;
    this.ignoreWalls = options.ignoreWalls ?? false;
    this.crossBody = options.crossBody ?? true;
    this.direction = options.direction;
    this.tweenConfig = options.tween;
  }

  protected override action(fighter: Fighter): void {
    if (this.ignoreWalls) {
      fighter.ignoresWalls = true;
    }

    const [ux, uy]: [number, number] = (
      {
        [Inputs.RIGHT]: [1, 0],
        [Inputs.LEFT]: [-1, 0],
        [Inputs.UP]: [0, -1],
        [Inputs.DOWN]: [0, 1],
      } satisfies Record<Cardinal, [number, number]>
    )[this.direction ?? fighter.direction];

    const target = this.resolveDashTarget(fighter, ux, uy);
    const duration = this.resolveDashDuration(fighter, target);

    fighter.scene.tweens.add({
      ...this.tweenConfig,
      targets: fighter,
      duration,
      x: target.x,
      y: target.y,
      onComplete: (tween, targets, ...params) => {
        fighter.ignoresWalls = false;
        this.tweenConfig.onComplete?.(tween, targets, ...params);
      },
    });
  }

  private resolveDashDuration(fighter: Fighter, target: { x: number; y: number }): number {
    const traveled = Math.abs(target.x - fighter.x) + Math.abs(target.y - fighter.y);
    return (Number(this.tweenConfig.duration ?? 100) * traveled) / this.range;
  }

  /** Le point d'arrêt le plus loin jusqu'à range, prolongé si range tombe dans un obstacle. */
  private resolveDashTarget(fighter: Fighter, ux: number, uy: number): { x: number; y: number } {
    const reach = (d: number) => ({ x: fighter.x + ux * d, y: fighter.y + uy * d });
    let landing = 0;

    for (let d = DASH_STEP; d <= this.range + DASH_MAX_EXTENSION; d += DASH_STEP) {
      const { x, y } = reach(d);

      if (!this.canCross(fighter, x, y)) {
        break;
      }

      if (this.canLand(fighter, x, y)) {
        landing = d;

        if (d >= this.range) {
          break;
        }
      }
    }

    return reach(landing);
  }

  private canCross(fighter: Fighter, cx: number, cy: number): boolean {
    return !hasObstacle(fighter, cx, cy, { walls: !this.ignoreWalls, fighters: !this.crossBody });
  }

  private canLand(fighter: Fighter, cx: number, cy: number): boolean {
    return !hasObstacle(fighter, cx, cy, { walls: true, fighters: true });
  }
}
