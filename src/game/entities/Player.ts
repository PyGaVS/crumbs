import { SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_SIZE } from '../core/settings';
import { Inputs } from '../data/enums/Inputs';
import type { SkinAction } from '../data/enums/SkinAction';
import type { Ability } from '../domain/Ability';
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
  /** Déclenchée pendant l'animation, lancée à sa fin avec l'arme d'alors ; `switched` si le switch l'a conclue. */
  private queued?: { ability: Ability; weapon: Weapon; switched: boolean };
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

    this.inputHistory.addInput(input);

    const technique = this.composition
      .techniquesWith(this.activeWeapon)
      .find((t) => t.matches(this.inputHistory.history));
    const ability = technique?.ability ?? (input === Inputs.ATTACK ? this.weapon.attack : undefined);
    const switched = input === Inputs.SWITCH;
    const weapon = this.weapon;

    if (switched) {
      this.activeWeapon = this.activeWeapon === 0 ? 1 : 0;
    }

    if (!this.locked) {
      this.launch(ability, switched);
    } else if (ability) {
      this.queued ??= { ability, weapon, switched };
    }
  }

  /** Lance ability puis, après un switch, prend l'arme active en main, ou la cache jusqu'à la fin de l'animation. */
  private launch(ability: Ability | undefined, switched: boolean): void {
    ability?.execute(this);

    if (!switched) {
      return;
    }

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

    const queued = this.queued;
    const weapon = queued?.weapon ?? this.weapon;

    this.queued = undefined;

    if (!this.heldWeapon.holds(weapon.skin)) {
      this.heldWeapon.wield(weapon.skin);
    }

    if (queued) {
      this.launch(queued.ability, queued.switched);
    }
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
