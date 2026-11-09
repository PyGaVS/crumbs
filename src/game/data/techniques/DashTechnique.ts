import { Player } from '../../entities/Player';
import { Technique, type TechniqueOptions } from '../../domain/Technique';
import { DASH_MAX_EXTENSION, DASH_STEP } from '../../utils/consts';
import { hasObstacle } from '../../utils/collision';
import { Cardinal, Direction } from '../../utils/types';
import Sequence from '../../utils/Sequence';
import { Inputs } from '../enums/Inputs';
import { TechniqueId } from '../enums/TechniqueId';

type DashTweenConfig = Omit<Phaser.Types.Tweens.TweenBuilderConfig, 'targets' | 'x' | 'y'>;

type DashOptions = TechniqueOptions & {
  range: number;
  ignoreWalls?: boolean;
  crossBody?: boolean;
  direction?: Direction;
  tween: DashTweenConfig;
};

export default class DashTechnique extends Technique {
  private readonly range: number;
  private readonly ignoreWalls: boolean;
  private readonly crossBody: boolean;
  private readonly direction?: Direction;
  private readonly tweenConfig: DashTweenConfig;

  constructor(id: TechniqueId, name: string, sequence: Sequence, options: DashOptions) {
    super(id, name, sequence, options);
    this.range = options.range;
    this.ignoreWalls = options.ignoreWalls ?? false;
    this.crossBody = options.crossBody ?? true;
    this.direction = options.direction;
    this.tweenConfig = options.tween;
  }

  protected override action(player: Player): void {
    if (this.ignoreWalls) {
      player.ignoresWalls = true;
    }

    const [ux, uy]: [number, number] = (
      {
        [Inputs.RIGHT]: [1, 0],
        [Inputs.LEFT]: [-1, 0],
        [Inputs.UP]: [0, -1],
        [Inputs.DOWN]: [0, 1],
      } satisfies Record<Cardinal, [number, number]>
    )[this.direction ?? player.direction];

    const target = this.resolveDashTarget(player, ux, uy);
    const duration = this.resolveDashDuration(player, target);

    player.scene.tweens.add({
      ...this.tweenConfig,
      targets: player,
      duration,
      x: target.x,
      y: target.y,
      onComplete: (tween, targets, ...params) => {
        player.ignoresWalls = false;
        this.tweenConfig.onComplete?.(tween, targets, ...params);
        this.afterEffect(player);
      },
    });
  }

  private resolveDashDuration(player: Player, target: { x: number; y: number }): number {
    const traveled = Math.abs(target.x - player.x) + Math.abs(target.y - player.y);
    return (Number(this.tweenConfig.duration ?? 100) * traveled) / this.range;
  }

  /** Le point d'arrêt le plus loin jusqu'à range, prolongé si range tombe dans un obstacle. */
  private resolveDashTarget(player: Player, ux: number, uy: number): { x: number; y: number } {
    const reach = (d: number) => ({ x: player.x + ux * d, y: player.y + uy * d });
    let landing = 0;

    for (let d = DASH_STEP; d <= this.range + DASH_MAX_EXTENSION; d += DASH_STEP) {
      const { x, y } = reach(d);

      if (!this.canCross(player, x, y)) {
        break;
      }

      if (this.canLand(player, x, y)) {
        landing = d;

        if (d >= this.range) {
          break;
        }
      }
    }

    return reach(landing);
  }

  private canCross(player: Player, cx: number, cy: number): boolean {
    return this.isFree(player, cx, cy, { walls: !this.ignoreWalls, mobs: !this.crossBody });
  }

  private canLand(player: Player, cx: number, cy: number): boolean {
    return this.isFree(player, cx, cy, { walls: true, mobs: true });
  }

  private isFree(player: Player, cx: number, cy: number, blockers: { walls: boolean; mobs: boolean }): boolean {
    const { width, height } = player.body || { width: 0, height: 0 };

    return !hasObstacle(player.scene, cx, cy, width, height, blockers);
  }
}
