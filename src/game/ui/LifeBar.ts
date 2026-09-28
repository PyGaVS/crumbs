import { GameObjects, Scene, Scenes } from 'phaser';
import { SPRITE_SIZE } from '../core/settings';
import { Fighter, FighterEvent } from '../entities/Fighter';
import { Gauge } from './Gauge';

/** Marge en px entre le haut du sprite suivi et la barre. */
const MARGIN = 10;

export class LifeBar extends Gauge {
  constructor(
    scene: Scene,
    private readonly fighter: Fighter,
  ) {
    super(scene, 0, 0, SPRITE_SIZE / 16);
    fighter.on(FighterEvent.DAMAGED, () => this.setRatio(fighter.health / fighter.maxHealth));
    fighter.once(GameObjects.Events.DESTROY, () => this.destroy());

    // Après la physique et les tweens, sinon la barre a une frame de retard sur sa cible
    scene.events.on(Scenes.Events.POST_UPDATE, this.follow, this);
    this.once(GameObjects.Events.DESTROY, () => scene.events.off(Scenes.Events.POST_UPDATE, this.follow, this));
  }

  private follow(): void {
    const top = this.fighter.y - this.fighter.displayHeight / 2 - MARGIN - this.barHeight;
    this.setPosition(this.fighter.x - this.barWidth / 2, Math.max(top, 0));
  }
}
