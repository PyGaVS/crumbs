import { Math as PhaserMath, Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';
import { Entity } from './Entity';

/** Couleurs de l'arc-en-ciel (valeurs d'arcade.color), cyclées toutes les 100 ms. */
const COLORS = [ 0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x6f00ff, 0x8f00ff ];

const COLOR_INTERVAL = 100;
const SPAWN_DELAY = 1000;
const MARGIN = 20;

/** Équivalent de entities/dot.py : une pac-gomme qui réapparaît à un endroit aléatoire 1 s après avoir été mangée. */
export class Dot extends Entity
{
    private spawnTimer = 0;
    private colorTimer = 0;
    private colorIndex = 0;

    constructor (scene: Scene, name: string)
    {
        super(scene, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'dot');

        this.name = name;
        this.setVisible(false);
    }

    /** Python : Animation de textures colorées → ici une simple teinte sur un cercle blanc. */
    animate (delta: number): void
    {
        this.colorTimer += delta;

        if (this.colorTimer >= COLOR_INTERVAL)
        {
            this.colorTimer = 0;
            this.colorIndex = (this.colorIndex + 1) % COLORS.length;
            this.setTint(COLORS[this.colorIndex]);
        }
    }

    spawn (delta: number): void
    {
        if (this.visible)
        {
            return;
        }

        this.spawnTimer += delta;

        if (this.spawnTimer < SPAWN_DELAY)
        {
            return;
        }

        this.setPosition(
            PhaserMath.Between(MARGIN, SCREEN_WIDTH - MARGIN),
            PhaserMath.Between(MARGIN, SCREEN_HEIGHT - MARGIN)
        );
        this.spawnTimer = 0;
        this.setVisible(true);
    }

    despawn (): void
    {
        this.setVisible(false);
    }
}
