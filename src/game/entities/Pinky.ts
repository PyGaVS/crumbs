import { Scene } from 'phaser';
import { SCREEN_WIDTH } from '../core/settings';
import { Direction } from './Entity';
import { Phantom } from './Phantom';
import type { Player } from './Player';

/** Pinky vise un point devant le joueur pour lui couper la route. */
export class Pinky extends Phantom
{
    constructor (scene: Scene)
    {
        super(scene, SCREEN_WIDTH - 290, 220, 'pinky');
    }

    protected chase (player: Player): void
    {
        const range = this.getTargetRange(player.x, player.y, 400);

        const targets: Partial<Record<Direction, [number, number]>> = {
            R: [ player.x + range, player.y ],
            L: [ player.x - range, player.y ],
            U: [ player.x, player.y - range ],
            D: [ player.x, player.y + range ]
        };

        const [ targetX, targetY ] = targets[player.direction] ?? [ player.x, player.y ];

        this.aim(targetX, targetY);
    }

    /** Réduit la distance d'anticipation (jusqu'à 2 fois) quand le joueur est proche. */
    private getTargetRange (playerX: number, playerY: number, maxRange: number, counter = 0): number
    {
        const close = Math.abs(playerX - this.x) < maxRange && Math.abs(playerY - this.y) < maxRange;

        if (close && counter < 2)
        {
            return this.getTargetRange(playerX, playerY, maxRange * 0.8, counter + 1);
        }

        return maxRange;
    }
}
