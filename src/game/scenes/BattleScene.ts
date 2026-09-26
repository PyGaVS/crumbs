import { GameObjects, Physics, Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_SIZE } from '../core/settings';
import { getCharClass } from '../data/charClasses';
import { CharClassId } from '../data/enums/CharClassId';
import { Inputs } from '../data/enums/Inputs';
import { Player } from '../entities/Player';

/** Sans touche pressée pendant ce délai, un "N" est ajouté à l'historique (coupe les combos). */
const INPUT_TIMEOUT = 250;

const TEXT_STYLE = { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' };

/** L'arène d'entraînement du jalon 0 : le joueur et un mannequin. */
export class BattleScene extends Scene {
  private player!: Player;
  private walls!: Physics.Arcade.StaticGroup;
  private historyText!: GameObjects.Text;
  private inputTime!: number;

  constructor() {
    super('BattleScene');
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT);

    // En attendant la sélection de perso (roadmap 0.4), la classe ninja
    this.player = new Player(this, getCharClass(CharClassId.NINJA));
    this.walls = this.physics.add.staticGroup();

    // Mannequin provisoire (roadmap 0.1), remplacé quand il saura encaisser
    const dummy: Physics.Arcade.Sprite = this.walls.create(SCREEN_WIDTH * 0.65, SCREEN_HEIGHT / 2, 'rock');
    dummy.setScale(SPRITE_SIZE / dummy.width).refreshBody();

    this.physics.add.collider(this.player, this.walls, undefined, () => !this.player.ignoresWalls);

    this.historyText = this.add.text(50, 30, '', TEXT_STYLE);
    this.inputTime = 0;

    this.input.keyboard?.on('keydown', this.onKeyDown, this);
  }

  update(_time: number, delta: number) {
    this.inputTime += delta;

    if (this.inputTime >= INPUT_TIMEOUT) {
      this.inputTime = 0;
      this.player.inputHistory.addInput(Inputs.NONE);
    }

    this.historyText.setText(this.player.inputHistory.getHistory());
  }

  private onKeyDown(event: KeyboardEvent) {
    this.inputTime = 0;
    this.player.onKeyPress(event.code);
  }
}
