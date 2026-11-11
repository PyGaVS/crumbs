import { GameObjects, Scenes } from 'phaser';
import type { MobBehavior } from '../domain/MobBehavior';
import type { Mob } from '../entities/Mob';
import type { BattleScene } from '../scenes/BattleScene';

export class MobControls {
  private cooldown = 0;

  constructor(
    private readonly scene: BattleScene,
    private readonly mob: Mob,
    private readonly behavior: MobBehavior,
  ) {
    // Après la physique, sinon les positions ont une frame de retard
    scene.events.on(Scenes.Events.POST_UPDATE, this.update, this);
    mob.once(GameObjects.Events.DESTROY, this.destroy, this);
  }

  private update(_time: number, delta: number): void {
    if (this.behavior.shouldHalt(this.mob, this.scene)) {
      this.mob.halt();
      this.cooldown = 0;

      return;
    }

    this.cooldown -= delta;

    if (this.cooldown <= 0 || this.mob.blocked()) {
      const { x, y } = this.behavior.destination(this.mob, this.scene);

      this.cooldown = this.behavior.interval;
      this.mob.walkTowards(x, y, (this.mob.speed * this.behavior.interval) / 1000, this.behavior.disableUTurn);
    }
  }

  private destroy(): void {
    this.scene.events.off(Scenes.Events.POST_UPDATE, this.update, this);
  }
}
