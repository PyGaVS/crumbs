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
import { Composition } from '../domain/Composition';
import { Enemy } from '../entities/Enemy';
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

    // En attendant la sélection de perso (roadmap 0.4), la classe ninja et deux fauchons
    const falchion = getWeapon(WeaponId.FALCHION);

    this.player = new Player(this, new Composition(getCharClass(CharClassId.NINJA), [falchion, falchion]));
    new PlayerControls(this, this.player);
    new Hud(this, this.player);
    new InputHistoryText(this, this.player.inputHistory);

    if (import.meta.env.DEV) {
      new HitboxOverlay(this);
    }

    const mushroom = new Enemy(this, SCREEN_WIDTH * 0.9, SCREEN_HEIGHT / 4, getEnemyKind(EnemyId.MUSHROOM), Inputs.LEFT);
    const reptile = new Enemy(this, SCREEN_WIDTH * 0.9, SCREEN_HEIGHT * 0.75, getEnemyKind(EnemyId.REPTILE), Inputs.LEFT);

    const mobs = this.add.group([mushroom, reptile]);

    this.physics.add.collider(this.player, [mushroom, reptile], undefined, () => !this.player.ignoresWalls);
    this.physics.add.collider(mobs, mobs, undefined, (a, b) => a !== b);
  }

  update(_time: number, delta: number) {
    this.player.inputHistory.update(delta);
  }
}
