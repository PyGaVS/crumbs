import { SPRITE_SIZE } from '../core/settings';
import { MobControls } from '../controls/MobControls';
import { LifeBar } from '../ui/LifeBar';
import { nearestDirection } from '../utils/orientation';
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
    this.setImmovable(true).setPushable(false);
    new LifeBar(scene, this);

    if (kind.behavior) {
      new MobControls(scene, this, kind.behavior);
    }
  }

  walkTowards(x: number, y: number): void {
    this.walk(this.kind.skin, nearestDirection(Math.atan2(y - this.y, x - this.x)));
  }

  halt(): void {
    this.rest(this.kind.skin);
  }

  reaches(other: Fighter): boolean {
    return this.touches(other, this.speed / this.scene.physics.world.fps);
  }
}
