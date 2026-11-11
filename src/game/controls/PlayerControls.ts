import { GameObjects, Input, Scene, Scenes } from 'phaser';
import { Inputs } from '../data/enums/Inputs';
import { Player } from '../entities/Player';

const { KeyCodes } = Input.Keyboard;

export type KeyBinding = readonly [keyCode: number, input: Inputs];

export const DEFAULT_KEY_BINDINGS: readonly KeyBinding[] = [
  [KeyCodes.RIGHT, Inputs.RIGHT],
  [KeyCodes.LEFT, Inputs.LEFT],
  [KeyCodes.UP, Inputs.UP],
  [KeyCodes.DOWN, Inputs.DOWN],
  [KeyCodes.S, Inputs.SWITCH],
  [KeyCodes.A, Inputs.ATTACK],
];

export class PlayerControls {
  private readonly keyboard: Input.Keyboard.KeyboardPlugin;
  private readonly keys = new Map<Inputs, Input.Keyboard.Key>();

  constructor(
    private readonly scene: Scene,
    private readonly player: Player,
    bindings: readonly KeyBinding[] = DEFAULT_KEY_BINDINGS,
  ) {
    this.keyboard = scene.input.keyboard!;

    for (const [keyCode, input] of bindings) {
      const key = this.keyboard.addKey(keyCode);

      key.on(Input.Keyboard.Events.DOWN, () => player.press(input));
      this.keys.set(input, key);
    }

    scene.events.on(Scenes.Events.UPDATE, this.update, this);
    player.once(GameObjects.Events.DESTROY, this.destroy, this);
  }

  private update(): void {
    // Tué plus tôt dans cette même frame, il est détruit mais l'émission en cours l'appelle encore
    if (!this.player.active) {
      return;
    }

    if (this.keys.get(this.player.direction)?.isDown) {
      this.player.move();
    } else {
      this.player.halt();
    }
  }

  private destroy(): void {
    this.scene.events.off(Scenes.Events.UPDATE, this.update, this);
    this.keys.forEach((key) => this.keyboard.removeKey(key, true));
  }
}
