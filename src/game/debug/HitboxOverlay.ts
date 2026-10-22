import { GameObjects, Geom, Input, Scene, Scenes } from 'phaser';
import { CombatEvent } from '../utils/combat';

/** ms d'affichage d'une frappe : pleine sur sa frame active, puis en contour. */
const DISPLAY_TIME = 400;
const COLOR = 0xff3030;

type Shown = { readonly circles: readonly Geom.Circle[]; readonly end: number; active: boolean };

/** Outil de dev : H affiche les hitboxs de chaque frappe et les corps physiques. */
export class HitboxOverlay extends GameObjects.Graphics {
  private enabled = false;
  private shown: Shown[] = [];

  constructor(scene: Scene) {
    super(scene);
    scene.add.existing(this);
    this.setDepth(Number.MAX_VALUE);

    const keyboard = scene.input.keyboard!;
    const key = keyboard.addKey(Input.Keyboard.KeyCodes.H);

    key.on(Input.Keyboard.Events.DOWN, this.toggle, this);
    scene.events.on(CombatEvent.STRIKE, this.show, this);
    scene.events.on(Scenes.Events.PRE_RENDER, this.draw, this);
    this.once(GameObjects.Events.DESTROY, () => {
      keyboard.removeKey(key, true);
      scene.events.off(CombatEvent.STRIKE, this.show, this);
      scene.events.off(Scenes.Events.PRE_RENDER, this.draw, this);
    });
  }

  private toggle(): void {
    const { world } = this.scene.physics;

    this.enabled = !this.enabled;
    this.shown = [];

    if (this.enabled && !world.debugGraphic) {
      world.createDebugGraphic();
    }

    world.drawDebug = this.enabled;
    world.debugGraphic?.clear();
  }

  private show(circles: readonly Geom.Circle[]): void {
    if (this.enabled) {
      this.shown.push({ circles, end: this.scene.time.now + DISPLAY_TIME, active: true });
    }
  }

  /** Une frappe est active sur le premier rendu qui suit, même si DISPLAY_TIME est écoulé. */
  private draw(): void {
    const { now } = this.scene.time;

    this.clear();
    this.shown = this.shown.filter(({ active, end }) => active || end > now);

    for (const shown of this.shown) {
      if (shown.active) {
        this.fillStyle(COLOR, 0.3).lineStyle(2, COLOR);
        shown.circles.forEach((circle) => this.fillCircleShape(circle).strokeCircleShape(circle));
      } else {
        this.lineStyle(1, COLOR, 0.5);
        shown.circles.forEach((circle) => this.strokeCircleShape(circle));
      }

      shown.active = false;
    }
  }
}
