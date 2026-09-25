import { Player } from '../../entities/Player';
import { Technique } from '../../entities/Technique';
import { DASH_MAX_EXTENSION, DASH_STEP } from '../../utils/consts';
import { Cardinal, Direction } from '../../utils/types';
import Sequence from '../../utils/Sequence';
import { Inputs } from '../enums/Inputs';
import { TechniqueId } from '../enums/TechniqueId';

type DashTweenConfig = Omit<Phaser.Types.Tweens.TweenBuilderConfig, 'targets' | 'x' | 'y'>;

export default class DashTechnique extends Technique {
  constructor(
    readonly id: TechniqueId,
    readonly name: string,
    readonly sequence: Sequence,
    readonly effect: (player: Player) => void,
    readonly nextEffect: (player: Player) => void,
    readonly distance: number,
    readonly ignoreWalls: boolean,
    readonly tweenConfig: DashTweenConfig,
    readonly direction?: Direction,
  ) {
    super(id, name, sequence, effect);
  }

  override execute(player: Player): void {
    this.effect(player);
    this.dash(player);
    this.nextEffect(player);
  }

  dash(player: Player): void {
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
    )[player.direction];

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
      },
    });
  }

  resolveDashDuration(player: Player, target: { x: number; y: number }): number {
    const traveled = Math.abs(target.x - player.x) + Math.abs(target.y - player.y);
    return (Number(this.tweenConfig.duration ?? 100) * traveled) / this.distance;
  }

  resolveDashTarget(player: Player, ux: number, uy: number): { x: number; y: number } {
    const reach = (d: number) => ({ x: player.x + ux * d, y: player.y + uy * d });

    return this.ignoreWalls ? this.throughTarget(player, reach) : this.blockedTarget(player, reach);
  }

  private throughTarget(player: Player, reach: (d: number) => { x: number; y: number }): { x: number; y: number } {
    for (let d = this.distance; d <= this.distance + DASH_MAX_EXTENSION; d += DASH_STEP) {
      const target = reach(d);

      if (this.isFree(player, target.x, target.y)) {
        return target;
      }
    }

    for (let d = this.distance - DASH_STEP; d >= 0; d -= DASH_STEP) {
      const target = reach(d);

      if (this.isFree(player, target.x, target.y)) {
        return target;
      }
    }

    return reach(0);
  }

  /** Se cogne : dernière position libre avant le premier obstacle du trajet. */
  private blockedTarget(player: Player, reach: (d: number) => { x: number; y: number }): { x: number; y: number } {
    for (let d = DASH_STEP; d <= this.distance; d += DASH_STEP) {
      const target = reach(d);

      if (!this.isFree(player, target.x, target.y)) {
        return reach(d - DASH_STEP);
      }
    }

    return reach(this.distance);
  }

  isFree(player: Player, cx: number, cy: number): boolean {
    const { width, height } = player.body || { width: 0, height: 0 };

    return player.scene.physics.overlapRect(cx - width / 2, cy - height / 2, width, height, false, true).length === 0;
  }
}
