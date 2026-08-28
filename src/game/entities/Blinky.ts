import { Scene } from 'phaser';
import { SCREEN_WIDTH } from '../core/settings';
import { Phantom } from './Phantom';
import type { Player } from './Player';

/** Blinky suit directement le joueur, et décide deux fois plus souvent que les autres. */
export class Blinky extends Phantom
{
    constructor (scene: Scene){
        super(scene, SCREEN_WIDTH - 140, 70, 'blinky');
        this.chaseInterval = 250;
    }

    protected chase (player: Player): void {
        this.aim(player.x, player.y);
    }
}
