import { GameObjects, Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';
import { Blinky } from '../entities/Blinky';
import { Clyde } from '../entities/Clyde';
import { Dot } from '../entities/Dot';
import { Inky } from '../entities/Inky';
import { Phantom } from '../entities/Phantom';
import { Pinky } from '../entities/Pinky';
import { Player } from '../entities/Player';

/** Sans touche pressée pendant ce délai, un "N" est ajouté à l'historique (coupe les combos). */
const INPUT_TIMEOUT = 250;

const TEXT_STYLE = { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' };

/** Équivalent de views/game_view.py : la scène principale du jeu. */
export class Game extends Scene {
  private player: Player;
  private phantoms: Phantom[];
  private dots: Dot[];
  private scoreText: GameObjects.Text;
  private historyText: GameObjects.Text;
  private inputTime: number;

  constructor() {
    super('Game');
  }

  create() {
    //  Tout est (ré)initialisé ici : la scène est réutilisée à chaque nouvelle partie.
    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT);

    //  Ordre de création = ordre d'affichage : joueur, pac-gommes, puis fantômes au-dessus
    this.player = new Player(this);
    this.dots = [new Dot(this, 'dot1'), new Dot(this, 'dot2')];
    this.phantoms = [new Blinky(this), new Pinky(this), new Inky(this), new Clyde(this)];

    this.scoreText = this.add.text(50, 30, 'Score 0', TEXT_STYLE);
    this.historyText = this.add.text(50, 80, '', TEXT_STYLE);

    this.inputTime = 0;

    this.input.keyboard?.on('keydown', this.onKeyDown, this);
  }

  update(_time: number, delta: number) {
    this.inputTime += delta;

    if (this.inputTime >= INPUT_TIMEOUT) {
      this.inputTime = 0;
      this.player.inputHistory.addInput('N');
    }

    for (const dot of this.dots) {
      dot.animate(delta);
      dot.spawn(delta);
    }

    this.player.move(delta);

    for (const phantom of this.phantoms) {
      phantom.move(delta, this.player, this.phantoms);
    }

    for (const phantom of this.phantoms) {
      if (this.player.collidesWith(phantom)) {
        this.gameOver();
        return;
      }
    }

    for (const dot of this.dots) {
      if (dot.visible && this.player.collidesWith(dot)) {
        this.setScore(this.player.score + 1);
        dot.despawn();
      }
    }

    this.historyText.setText(this.player.inputHistory.getHistory());
  }

  /** Chaque pac-gomme accélère les fantômes ; toutes les 4, le joueur accélère aussi. */
  setScore(score: number) {
    this.player.score = score;
    this.scoreText.setText(`Score ${score}`);

    for (const phantom of this.phantoms) {
      phantom.speed += 0.1;
    }

    if (score % 4 === 0) {
      this.player.speed += 0.4;

      for (const phantom of this.phantoms) {
        phantom.speed += 0.1;
      }
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    this.inputTime = 0;
    this.player.onKeyPress(event.code);
  }

  private gameOver() {
    this.scene.start('GameOver', { score: this.player.score });
  }
}
