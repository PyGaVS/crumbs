import { GameObjects, Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_SIZE } from '../core/settings';
import { Player } from '../entities/Player';

/** Sans touche pressée pendant ce délai, un "N" est ajouté à l'historique (coupe les combos). */
const INPUT_TIMEOUT = 250;

const TEXT_STYLE = { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' };

/** L'arène d'entraînement du jalon 0 : le joueur et un mannequin. */
export class Game extends Scene {
  private player: Player;
  private historyText: GameObjects.Text;
  private inputTime: number;

  constructor() {
    super('Game');
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT);

    this.player = new Player(this);

    // Mannequin provisoire (roadmap 0.1), remplacé quand il saura encaisser
    const dummy = this.add.image(SCREEN_WIDTH * 0.65, SCREEN_HEIGHT / 2, 'rock');
    dummy.setScale(SPRITE_SIZE / dummy.width);

    this.historyText = this.add.text(50, 30, '', TEXT_STYLE);
    this.inputTime = 0;

    this.input.keyboard?.on('keydown', this.onKeyDown, this);
  }

  update(_time: number, delta: number) {
    this.inputTime += delta;

    if (this.inputTime >= INPUT_TIMEOUT) {
      this.inputTime = 0;
      this.player.inputHistory.addInput('N');
    }

    this.player.move(delta);
    this.historyText.setText(this.player.inputHistory.getHistory());
  }

  private onKeyDown(event: KeyboardEvent) {
    this.inputTime = 0;
    this.player.onKeyPress(event.code);
  }
}
