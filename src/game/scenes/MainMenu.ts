import { Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';

/** Équivalent de views/main_menu_view.py */
export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        //  arcade.color.DARK_BLUE_GRAY
        this.cameras.main.setBackgroundColor(0x666699);

        this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 50, 'MENU PRINCIPAL', {
            fontFamily: 'Arial', fontSize: 40, color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'Appuyez sur ESPACE pour commencer', {
            fontFamily: 'Arial', fontSize: 20, color: '#d3d3d3'
        }).setOrigin(0.5);

        this.input.keyboard?.once('keydown-SPACE', () =>
        {
            this.scene.start('Game');
        });
    }
}
