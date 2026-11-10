import { Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../core/settings';
import { getCharClass } from '../data/charClasses';
import { getEnemyKind } from '../data/enemies';
import { getWeapon } from '../data/weapons';
import { PlayerControls } from '../controls/PlayerControls';
import { HitboxOverlay } from '../debug/HitboxOverlay';
import { CharClassId } from '../data/enums/CharClassId';
import { EnemyId } from '../data/enums/EnemyId';
import { Inputs } from '../data/enums/Inputs';
import { WeaponId } from '../data/enums/WeaponId';
import { Mob } from '../entities/Mob';
import { Player } from '../entities/Player';
import { Hud } from '../ui/Hud';
import { InputHistoryText } from '../ui/InputHistoryText';

/** L'arène d'entraînement du jalon 0 : le joueur, un mannequin et un champignon qui le poursuit. */
export class BattleScene extends Scene {
  player!: Player;

  constructor() {
    super('BattleScene');
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT);

    // En attendant la sélection de perso (roadmap 0.4), la classe ninja au fauchon
    this.player = new Player(this, getCharClass(CharClassId.NINJA), getWeapon(WeaponId.FALCHION));
    new PlayerControls(this, this.player);
    new Hud(this, this.player);
    new InputHistoryText(this, this.player.inputHistory);

    if (import.meta.env.DEV) {
      new HitboxOverlay(this);
    }

    const dummy = new Mob(this, SCREEN_WIDTH * 0.65, SCREEN_HEIGHT / 2, getEnemyKind(EnemyId.DUMMY), Inputs.LEFT);
    const mushroom = new Mob(this, SCREEN_WIDTH * 0.9, SCREEN_HEIGHT / 4, getEnemyKind(EnemyId.MUSHROOM), Inputs.LEFT);

    this.physics.add.collider(this.player, [dummy, mushroom], undefined, () => !this.player.ignoresWalls);
  }

  update(_time: number, delta: number) {
    this.player.inputHistory.update(delta);
  }
}
