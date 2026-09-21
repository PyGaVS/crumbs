import { Scene } from 'phaser';
import { ASSET_PACK, SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT);

    //  Barre de progression : contour + remplissage
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;

    this.add.rectangle(centerX, centerY, 468, 32).setStrokeStyle(1, 0xffffff);

    const bar = this.add.rectangle(centerX - 230, centerY, 4, 28, 0xffffff);

    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Tous les assets du jeu (spritesheets, animations) sont décrits dans public/assets/pack.json
    this.load.pack('game', ASSET_PACK, 'game');
  }

  create() {
    //  Texture de pac-gomme : dessinée, pas chargée, donc générée ici
    const graphics = this.add.graphics();

    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture('dot', 16, 16);
    graphics.destroy();

    this.scene.start('MainMenu');
  }
}
