import { Scene } from 'phaser';
import { SCREEN_WIDTH } from '../core/settings';
import { Phantom } from './Phantom';
import type { Player } from './Player';

/** Inky suit le joueur mais s'écarte des autres fantômes quand ils sont trop proches. */
export class Inky extends Phantom
{
    constructor (scene: Scene)
    {
        super(scene, SCREEN_WIDTH - 140, 220, 'inky');
    }

    protected chase (player: Player, phantoms: Phantom[]): void
    {
        for (const phantom of phantoms)
        {
            if (phantom.name !== 'inky' && this.isCloseTo(phantom))
            {
                this.aimAway(phantom.x, phantom.y);

                return;
            }
        }

        this.aim(player.x, player.y);
    }
}
