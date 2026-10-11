import { Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';
import { getCharClass } from '../data/charClasses';
import { getEnemyKind } from '../data/enemies';
import { PlayerControls } from '../controls/PlayerControls';
import { CharClassId } from '../data/enums/CharClassId';
import { EnemyId } from '../data/enums/EnemyId';
import { Inputs } from '../data/enums/Inputs';
import { Mob } from '../entities/Mob';
import { Player } from '../entities/Player';
import { Hud } from '../ui/Hud';
import { InputHistoryText } from '../ui/InputHistoryText';

/** L'arène d'entraînement du jalon 0 : le joueur et un mannequin. */
export class BattleScene extends Scene {
  private player!: Player;

  constructor() {
    super('BattleScene');
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT);

    // En attendant la sélection de perso (roadmap 0.4), la classe ninja
    this.player = new Player(this, getCharClass(CharClassId.NINJA));
    new PlayerControls(this, this.player);
    new Hud(this, this.player);
    new InputHistoryText(this, this.player.inputHistory);

    const dummy = new Mob(this, SCREEN_WIDTH * 0.65, SCREEN_HEIGHT / 2, getEnemyKind(EnemyId.DUMMY), Inputs.LEFT);

    this.physics.add.collider(this.player, dummy, undefined, () => !this.player.ignoresWalls);
  }

  update(_time: number, delta: number) {
    this.player.inputHistory.update(delta);
  }
}
