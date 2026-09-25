import { Scene } from 'phaser';
import { SPRITE_SIZE } from '../../core/settings';
import { Inputs } from '../../data/enums/Inputs';
import { Direction, Entity } from '../Entity';
import type { Player } from '../Player';

/** Équivalent de entities/phantom.py : classe de base des 4 fantômes. */
export abstract class Phantom extends Entity {
  /** Intervalle entre deux décisions de l'IA, en ms (Python : `frame % 30` à 60 FPS = 500 ms). */
  protected chaseInterval = 500;
  private chaseTimer = 0;

  constructor(scene: Scene, x: number, y: number, name: string) {
    super(scene, x, y, name, 1);

    this.name = name;
    this.speed = 2;
    this.setScale(SPRITE_SIZE / this.width);
    this.setDirection(Inputs.LEFT);
  }

  /** Les fantômes n'ont que 4 directions ; "gauche" réutilise les frames "droite" retournées horizontalement. */
  override setDirection(direction: Direction): void {
    const animation = direction === Inputs.UP ? 'up' : direction === Inputs.DOWN ? 'down' : 'right';

    this.setFlipX(direction === Inputs.LEFT);
    this.play(`${this.name}-${animation}`, true);
    this.direction = direction;
  }

  move(delta: number, player: Player, phantoms: Phantom[]): void {
    this.chaseTimer += delta;

    if (this.chaseTimer >= this.chaseInterval) {
      this.chaseTimer -= this.chaseInterval;
      this.chase(player, phantoms);
    }

    this.checkBorder();
    this.forward(delta);
  }

  /** Stratégie propre à chaque fantôme, appelée toutes les `chaseInterval` ms. */
  protected abstract chase(player: Player, phantoms: Phantom[]): void;

  /** Se dirige vers (x, y) selon l'axe dominant. */
  aim(x: number, y: number): void {
    const dx = x - this.x;
    const dy = y - this.y;

    if (Math.abs(dx) >= Math.abs(dy)) {
      this.setDirection(dx < 0 ? Inputs.LEFT : Inputs.RIGHT);
    } else {
      this.setDirection(dy < 0 ? Inputs.UP : Inputs.DOWN);
    }
  }

  /** S'éloigne de (x, y) en fuyant sur l'axe le moins dominant. */
  aimAway(x: number, y: number): void {
    const dx = x - this.x;
    const dy = y - this.y;

    if (Math.abs(dx) <= Math.abs(dy)) {
      this.setDirection(dx > 0 ? Inputs.LEFT : Inputs.RIGHT);
    } else {
      this.setDirection(dy < 0 ? Inputs.DOWN : Inputs.UP);
    }
  }
}
