import type { Physics } from 'phaser';
import { SPRITE_SIZE } from '../core/settings';
import { MobControls } from '../controls/MobControls';
import { getAnimation } from '../data/animations';
import type { SkinAction } from '../data/enums/SkinAction';
import { LifeBar } from '../ui/LifeBar';
import { fightersInCircle } from '../utils/collision';
import { strike } from '../utils/combat';
import { Direction, directionsTowards, FACING_ANGLES, opposite, polar } from '../utils/orientation';
import type { Attack } from '../domain/Attack';
import { EnemyKind } from '../domain/EnemyKind';
import type { BattleScene } from '../scenes/BattleScene';
import type { Entity } from './Entity';
import { Fighter } from './Fighter';
import { Player } from './Player';

/** Un ennemi posé dans l'arène, décrit par son EnemyKind. */
export class Enemy extends Fighter {
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

  override playAction(action: SkinAction, direction: Direction): void {
    this.act(this.kind.skin, action, direction);
  }

  attack(attack: Attack, target: Fighter): void {
    this.direction = directionsTowards(target.x - this.x, target.y - this.y)[0];
    this.halt();
    getAnimation(attack.animationId).play(this, { onCue: (cue) => strike(this, cue, attack.damage, Player) });
  }

  /**
   * Le point devant target pour lui couper la route, d'autant plus loin qu'elle est loin.
   * @param maxLead avance maximale en px
   * @param leadRatio avance par px de distance, sous 1 pour finir sur target : sinon le point visé peut tomber sur le mob
   */
  ambush(target: Entity, maxLead: number, leadRatio: number): { x: number; y: number } {
    return target.ahead(Math.min(maxLead, leadRatio * Math.hypot(target.x - this.x, target.y - this.y)));
  }

  reaches(other: Fighter): boolean {
    return this.isWithin(this.stride, other);
  }

  /**
   * Atteinte à un pas d'intervalle près, la destination étant recalculée à chaque intervalle.
   * @param distance px tolérés en plus de ce pas, 0 pour l'atteindre
   */
  reachesDestination(scene: BattleScene, distance = 0): boolean {
    const destination = this.kind.behavior?.destination(this, scene);

    return (
      destination !== undefined &&
      Math.hypot(destination.x - this.x, destination.y - this.y) <= this.lookahead + distance
    );
  }

  /** px parcourus entre deux calculs de destination. */
  get lookahead(): number {
    return (this.speed * (this.kind.behavior?.interval ?? 0)) / 1000;
  }

  blocked(direction = this.direction, distance = this.stride): boolean {
    const [x, y] = polar(this.x, this.y, FACING_ANGLES[direction], distance);

    return fightersInCircle(this.scene, x, y, this.hurtboxRadius, Enemy).some((mob) => mob !== this);
  }

  private get walking(): boolean {
    return (this.body as Physics.Arcade.Body).speed > 0;
  }

  private get stride(): number {
    return this.speed / this.scene.physics.world.fps;
  }
}
