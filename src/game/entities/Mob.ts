import type { Physics } from 'phaser';
import { SPRITE_SIZE } from '../core/settings';
import { MobControls } from '../controls/MobControls';
import { LifeBar } from '../ui/LifeBar';
import { mobsInCircle } from '../utils/collision';
import { directionsTowards, FACING_ANGLES, opposite, polar } from '../utils/orientation';
import { Direction } from '../utils/types';
import { EnemyKind } from '../domain/EnemyKind';
import type { BattleScene } from '../scenes/BattleScene';
import { Fighter } from './Fighter';

/** Un ennemi posé dans l'arène, décrit par son EnemyKind. */
export class Mob extends Fighter {
  constructor(
    scene: BattleScene,
    x: number,
    y: number,
    readonly kind: EnemyKind,
    direction: Direction,
  ) {
    super(scene, x, y, kind.skin.idleTexture, kind.maxHealth, 0, kind.skin.idleFrame(direction));
    this.direction = direction;
    this.speed = kind.speed;
    this.setScale(SPRITE_SIZE / this.width);
    this.setPushable(false);
    new LifeBar(scene, this);

    if (kind.behavior) {
      new MobControls(scene, this, kind.behavior);
    }
  }

  walkTowards(x: number, y: number, lookahead: number, disableUTurn = false): void {
    let directions = directionsTowards(x - this.x, y - this.y);

    if (disableUTurn && this.walking) {
      const back = opposite(this.direction);

      directions = [...directions.filter((d) => d !== back), back];
    }

    const direction = directions.find((d) => !this.blocked(d) && !this.blocked(d, lookahead));

    if (direction) {
      this.walk(this.kind.skin, direction);
    } else {
      this.halt();
    }
  }

  halt(): void {
    this.rest(this.kind.skin);
  }

  reaches(other: Fighter): boolean {
    return this.touches(other, this.stride);
  }

  blocked(direction = this.direction, distance = this.stride): boolean {
    const [x, y] = polar(this.x, this.y, FACING_ANGLES[direction], distance);

    return mobsInCircle(this.scene, x, y, this.hurtboxRadius).some((mob) => mob !== this);
  }

  private get walking(): boolean {
    return (this.body as Physics.Arcade.Body).speed > 0;
  }

  private get stride(): number {
    return this.speed / this.scene.physics.world.fps;
  }
}
