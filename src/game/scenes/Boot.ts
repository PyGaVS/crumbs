import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    //  La scène Boot charge uniquement ce dont le Preloader a besoin pour s'afficher (ici le fond).
    this.load.image('background', 'assets/space.jpeg');
  }

  create() {
    this.scene.start('Preloader');
  }
}
