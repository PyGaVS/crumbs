import { Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';

export class GameOver extends Scene
{
    private score = 0;

    constructor ()
    {
        super('GameOver');
    }

    init (data: { score?: number })
    {
        this.score = data.score ?? 0;
    }

    create ()
    {
        this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT).setAlpha(0.5);

        this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 60, 'GAME OVER', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ff3333',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 20, `Score ${this.score}`, {
            fontFamily: 'Arial', fontSize: 32, color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 80, 'Appuyez sur une touche pour rejouer', {
            fontFamily: 'Arial', fontSize: 20, color: '#d3d3d3'
        }).setOrigin(0.5);

        //  `repeat` : ignore une touche restée enfoncée depuis la fin de la partie
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) =>
        {
            if (!event.repeat)
            {
                this.scene.start('Game');
            }
        });
    }
}
