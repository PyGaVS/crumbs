import { Scene } from 'phaser';
import { FRAME_SIZE, PHANTOM_NAMES, SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';

/** Cadence des animations (Python : utils/animation.py, 10 FPS). */
const ANIMATION_FPS = 10;

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
    this.load.setPath('assets');

    const frameConfig = { frameWidth: FRAME_SIZE, frameHeight: FRAME_SIZE };

    //  pacman.png : 3 frames (bouche fermée → ouverte)
    this.load.spritesheet('pacman', 'pacman.png', frameConfig);

    //  <fantôme>.png : 6 frames = right x2, up x2, down x2 (gauche = droite retournée)
    for (const name of PHANTOM_NAMES) {
      this.load.spritesheet(name, `${name}.png`, frameConfig);
    }
  }

  create() {
    //  Animations globales, réutilisées par toutes les scènes
    this.anims.create({
      key: 'pacman',
      frames: this.anims.generateFrameNumbers('pacman', { frames: [2, 0, 1] }),
      frameRate: ANIMATION_FPS,
      repeat: -1,
    });

    for (const name of PHANTOM_NAMES) {
      this.anims.create({
        key: `${name}-right`,
        frames: this.anims.generateFrameNumbers(name, { start: 0, end: 1 }),
        frameRate: ANIMATION_FPS,
        repeat: -1,
      });
      this.anims.create({
        key: `${name}-up`,
        frames: this.anims.generateFrameNumbers(name, { start: 2, end: 3 }),
        frameRate: ANIMATION_FPS,
        repeat: -1,
      });
      this.anims.create({
        key: `${name}-down`,
        frames: this.anims.generateFrameNumbers(name, { start: 4, end: 5 }),
        frameRate: ANIMATION_FPS,
        repeat: -1,
      });
    }

    const graphics = this.add.graphics();

    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture('dot', 16, 16);
    graphics.destroy();

    this.scene.start('MainMenu');
  }
}
