import { Scene } from 'phaser';
import { SPRITE_SIZE } from '../core/settings';
import { LifeBar } from '../ui/LifeBar';
import { Direction } from '../utils/types';
import { EnemyKind } from './EnemyKind';
import { Fighter } from './Fighter';

/** Un ennemi posé dans l'arène, décrit par son EnemyKind. */
export class Mob extends Fighter {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    readonly kind: EnemyKind,
    direction: Direction,
  ) {
    super(scene, x, y, kind.skin.idleTexture, kind.maxHealth, 0, kind.skin.idleFrame(direction));
    this.direction = direction;
    this.setScale(SPRITE_SIZE / this.width);
    this.setImmovable(true);
    new LifeBar(scene, this);
  }
}
