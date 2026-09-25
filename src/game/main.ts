import { AUTO, Game, Scale } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_TITLE, SCREEN_WIDTH } from './core/settings';
import { Boot } from './scenes/Boot';
import { BattleScene as MainGame } from './scenes/BattleScene';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

//  Documentation de la config : https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  title: SCREEN_TITLE,
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#000000',
  //  Sprites 16 px agrandis x4 : désactive le lissage pour garder les pixels nets
  pixelArt: true,
  //  Arcade : vitesses en px/s, bords et murs gérés par le moteur
  physics: {
    default: 'arcade',
  },
  //  Le jeu garde sa résolution logique et s'adapte à la taille de la fenêtre
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
