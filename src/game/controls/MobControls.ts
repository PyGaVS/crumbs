import { GameObjects, Scenes } from 'phaser';
import type { MobAttack, MobTrigger } from '../domain/MobAttack';
import type { MobBehavior } from '../domain/MobBehavior';
import type { Enemy } from '../entities/Enemy';
import type { BattleScene } from '../scenes/BattleScene';

export class MobControls {
  private cooldown = 0;
  /** ms d'affilée où chaque trigger à délai est vrai. */
  private readonly held = new Map<MobTrigger, number>();

  constructor(
    private readonly scene: BattleScene,
    private readonly mob: Enemy,
    private readonly behavior: MobBehavior,
  ) {
    // Après la physique, sinon les positions ont une frame de retard
    scene.events.on(Scenes.Events.POST_UPDATE, this.update, this);
    mob.once(GameObjects.Events.DESTROY, this.destroy, this);
  }

  private update(_time: number, delta: number): void {
    if (this.mob.performing) {
      return;
    }

    const attack = this.scene.player.active ? this.triggeredAttack(delta) : undefined;

    if (attack) {
      this.mob.attack(attack, this.scene.player, attack.customAngle?.(this.mob, this.scene));
      this.held.clear();
      this.cooldown = 0;

      return;
    }

    if (this.behavior.shouldHalt(this.mob, this.scene)) {
      this.mob.halt();
      this.cooldown = 0;

      return;
    }

    this.cooldown -= delta;

    if (this.cooldown <= 0 || this.mob.blocked()) {
      const { x, y } = this.behavior.destination(this.mob, this.scene);

      this.cooldown = this.behavior.interval;
      this.mob.walkTowards(x, y, this.mob.lookahead, this.behavior.disableUTurn);
    }
  }

  /**
   * Avance de delta ms les triggers à délai, puis cherche l'attaque à lancer.
   * @returns la première attaque dont un trigger est vrai
   */
  private triggeredAttack(delta: number): MobAttack | undefined {
    const { attacks } = this.mob.kind;

    for (const trigger of attacks.flatMap((a) => a.triggers)) {
      if (typeof trigger !== 'function') {
        this.held.set(trigger, trigger.when(this.mob, this.scene) ? (this.held.get(trigger) ?? 0) + delta : 0);
      }
    }

    return attacks.find((a) =>
      a.triggers.some((t) => (typeof t === 'function' ? t(this.mob, this.scene) : (this.held.get(t) ?? 0) >= t.after)),
    );
  }

  private destroy(): void {
    this.scene.events.off(Scenes.Events.POST_UPDATE, this.update, this);
  }
}
