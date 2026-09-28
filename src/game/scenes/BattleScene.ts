import { Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';
import { getCharClass } from '../data/charClasses';
import { getEnemyKind } from '../data/enemies';
import { CharClassId } from '../data/enums/CharClassId';
import { EnemyId } from '../data/enums/EnemyId';
import { Inputs } from '../data/enums/Inputs';
import { Mob } from '../entities/Mob';
import { Player } from '../entities/Player';
import { Hud } from '../ui/Hud';

/** Sans touche pressée pendant ce délai, un "N" est ajouté à l'historique (coupe les combos). */
const INPUT_TIMEOUT = 250;

/** L'arène d'entraînement du jalon 0 : le joueur et un mannequin. */
export class BattleScene extends Scene {
  private player!: Player;
  private inputTime!: number;

  constructor() {
    super('BattleScene');
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT);

    // En attendant la sélection de perso (roadmap 0.4), la classe ninja
    this.player = new Player(this, getCharClass(CharClassId.NINJA));
    new Hud(this, this.player);

    const dummy = new Mob(this, SCREEN_WIDTH * 0.65, SCREEN_HEIGHT / 2, getEnemyKind(EnemyId.DUMMY), Inputs.LEFT);

    this.physics.add.collider(this.player, dummy, undefined, () => !this.player.ignoresWalls);

    this.inputTime = 0;
    this.input.keyboard?.on('keydown', this.onKeyDown, this);
  }

  update(_time: number, delta: number) {
    this.inputTime += delta;

    if (this.inputTime >= INPUT_TIMEOUT) {
      this.inputTime = 0;
      this.player.inputHistory.addInput(Inputs.NONE);
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    this.inputTime = 0;
    this.player.onKeyPress(event.code);
  }
}
