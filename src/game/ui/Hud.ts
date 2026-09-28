import { Scene } from 'phaser';
import { Fighter, FighterEvent } from '../entities/Fighter';
import { Gauge } from './Gauge';

/** Marge en px entre le bord de l'écran et le HUD. */
const MARGIN = 30;
const GAP = 8;
const SCALE = 8;
const ARMOR_COLOR = 0xc0cbd6;

export class Hud {
  private readonly health: Gauge;
  private readonly armor: Gauge;

  constructor(
    scene: Scene,
    private readonly fighter: Fighter,
  ) {
    this.health = new Gauge(scene, MARGIN, MARGIN, SCALE);
    this.armor = new Gauge(scene, MARGIN, MARGIN + this.health.barHeight + GAP, SCALE, ARMOR_COLOR);
    fighter.on(FighterEvent.DAMAGED, this.refresh, this);
  }

  private refresh(): void {
    this.health.setRatio(this.fighter.health / this.fighter.maxHealth);
    this.armor.setRatio(this.fighter.armor / this.fighter.maxArmor);
  }
}
