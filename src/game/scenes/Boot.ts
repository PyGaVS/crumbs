import { Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';

const BACKGROUND_COLOR = 0x1c1c22;
const GRID_COLOR = 0x2a2a33;
const GRID_STEP = 64;

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  create() {
    // Fond provisoire : aplat sombre quadrillé, en attendant la direction artistique
    const graphics = this.add.graphics();

    graphics.fillStyle(BACKGROUND_COLOR, 1);
    graphics.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    graphics.lineStyle(1, GRID_COLOR, 1);

    for (let x = GRID_STEP; x < SCREEN_WIDTH; x += GRID_STEP) {
      graphics.lineBetween(x, 0, x, SCREEN_HEIGHT);
    }

    for (let y = GRID_STEP; y < SCREEN_HEIGHT; y += GRID_STEP) {
      graphics.lineBetween(0, y, SCREEN_WIDTH, y);
    }

    graphics.generateTexture('background', SCREEN_WIDTH, SCREEN_HEIGHT);
    graphics.destroy();

    this.scene.start('Preloader');
  }
}
