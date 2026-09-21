import { Scene } from 'phaser';
import { ASSET_PACK } from '../core/settings';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    //  La sc�ne Boot charge uniquement ce dont le Preloader a besoin pour s'afficher (section "boot" du pack).
    this.load.pack('boot', ASSET_PACK, 'boot');
  }

  create() {
    this.scene.start('Preloader');
  }
}
