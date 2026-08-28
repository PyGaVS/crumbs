import { Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';
import { Phantom } from './Phantom';
import type { Player } from './Player';

/** Clyde erre au hasard (avec une tendance à revenir au centre) et n'attaque que de près. */
export class Clyde extends Phantom
{
    constructor (scene: Scene)
    {
        super(scene, SCREEN_WIDTH - 290, 70, 'clyde');
    }

    protected chase (player: Player): void {
        const random = Math.floor(Math.random() * 5);

        if (random === 0)
        {
            this.setDirection('U');
        }
        else if (random === 1)
        {
            this.setDirection('D');
        }
        else if (random === 2)
        {
            this.setDirection('R');
        }
        else if (random === 3)
        {
            this.setDirection('L');
        }
        else
        {
            this.aim(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        }

        if (this.isCloseTo(player, 100))
        {
            this.aim(player.x, player.y);
        }
    }
}
