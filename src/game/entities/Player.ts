import { SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_SIZE } from '../core/settings';
import { Inputs } from '../data/enums/Inputs';
import type { SkinAction } from '../data/enums/SkinAction';
import type { Animation, PlayOptions } from '../domain/Animation';
import { InputHistory, isCardinal } from '../utils/input';
import type { Direction } from '../utils/orientation';
import type { Composition } from '../domain/Composition';
import { Fighter } from './Fighter';
import { HeldWeapon } from './HeldWeapon';
import type { Playback } from './Playback';
import type { Weapon } from '../domain/Weapon';
import type { BattleScene } from '../scenes/BattleScene';

// TODO: move to CharClass
const MAX_HEALTH = 100;
const MAX_ARMOR = 30;

export class Player extends Fighter {
  score = 0;
  inputHistory = new InputHistory();
  private idle = false;
  private locked = false;
  private inputBuffer: Inputs[] = [];
  private activeWeapon: 0 | 1 = 0;
  declare readonly heldWeapon: HeldWeapon;
  name = 'player';
  speed = 360;

  constructor(
    battleScene: BattleScene,
    private readonly composition: Composition,
  ) {
    super( battleScene, SCREEN_WIDTH / 10, SCREEN_HEIGHT - SCREEN_HEIGHT / 10,
      composition.charClass.skin.walkTexture, MAX_HEALTH, MAX_ARMOR );
    this.setScale(SPRITE_SIZE / this.width);
    this.heldWeapon = new HeldWeapon(this, composition.charClass.skin, this.weapon.skin);
    this.halt();
  }

  private get weapon(): Weapon {
    return this.composition.weapons[this.activeWeapon];
  }

  press(input: Inputs): void {
    if (isCardinal(input)) {
      this.direction = input;
    }

    if (this.locked) {
      this.inputBuffer.push(input);

      return;
    }

    this.inputHistory.addInput(input);

    const technique = this.composition
      .techniquesWith(this.activeWeapon)
      .find((t) => t.matches(this.inputHistory.history));

    if (technique) {
      technique.ability.execute(this);
    } else if (input === Inputs.ATTACK) {
      this.weapon.attack.execute(this);
    }

    if (input === Inputs.SWITCH) {
      this.switchWeapon();
    }
  }

  /** Passe à l'autre arme, prise en main à la fin de l'animation en cours. */
  private switchWeapon(): void {
    this.activeWeapon = this.activeWeapon === 0 ? 1 : 0;

    if (this.locked) {
      this.heldWeapon.sheathe();
    } else {
      this.heldWeapon.wield(this.weapon.skin);
    }
  }

  override perform(animation: Animation, options: PlayOptions): Playback {
    const playback = super.perform(animation, options);

    if (animation.duration > 0) {
      this.locked = true;
      this.scene.time.delayedCall(animation.duration, () => this.unlock());
    }

    return playback;
  }

  override playAction(action: SkinAction, direction: Direction = this.direction): void {
    this.idle = false;
    this.setVelocity(0, 0);
    this.act(this.composition.charClass.skin, action, direction);
  }

  private unlock(): void {
    // Le délai survit à la destruction : mort pendant l'animation, il ne rejoue rien
    if (!this.active) {
      return;
    }

    this.locked = false;

    if (this.heldWeapon.sheathed) {
      this.heldWeapon.wield(this.weapon.skin);
    }

    const buffered = this.inputBuffer;
    this.inputBuffer = [];
    buffered.forEach((input) => this.press(input));
  }

  /** Avance vers sa direction, sans effet pendant une animation. */
  move(): void {
    if (this.locked) {
      return;
    }

    this.idle = false;
    this.walk(this.composition.charClass.skin, this.direction);
  }

  /** Immobilise le perso sur sa frame d'attente en gardant sa direction, sans effet pendant une animation. */
  halt(): void {
    if (this.locked || this.idle) {
      return;
    }

    this.idle = true;
    this.rest(this.composition.charClass.skin);
  }
}
