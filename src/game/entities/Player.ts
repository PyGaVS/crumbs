import { SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_SIZE } from '../core/settings';
import { Inputs } from '../data/enums/Inputs';
import { InputHistory, isCardinal } from '../utils/input';
import { CharClass } from './CharClass';
import { Fighter } from './Fighter';
import type { Technique } from './Technique';
import { BattleScene } from '../scenes/BattleScene';

const MAX_HEALTH = 100;
const MAX_ARMOR = 30;

export class Player extends Fighter {
  score = 0;
  inputHistory = new InputHistory();
  private idle = false;
  private locked = false;
  private inputBuffer: Inputs[] = [];
  ignoresWalls = false;
  name = 'player';
  speed = 360;

  constructor(
    battleScene: BattleScene,
    private readonly charClass: CharClass,
  ) {
    super(
      battleScene,
      SCREEN_WIDTH / 10,
      SCREEN_HEIGHT - SCREEN_HEIGHT / 10,
      charClass.skin.walkTexture,
      MAX_HEALTH,
      MAX_ARMOR,
    );
    this.setScale(SPRITE_SIZE / this.width);
    this.halt();
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

    const technique = this.charClass.techniques.find((t) => t.matches(this.inputHistory.history));

    if (technique) {
      this.castTechnique(technique);
    }
  }

  private castTechnique(technique: Technique): void {
    if (technique.playerAnimation) {
      this.idle = false;
      this.setVelocity(0, 0);
      this.play(this.charClass.skin.animation(technique.playerAnimation, this.direction));
    }

    technique.execute(this);
  }

  /** Fige le perso pendant duration ms, les inputs sont mis en tampon puis rejoués. */
  lock(duration: number, onEnd?: () => void): void {
    this.locked = true;
    this.scene.time.delayedCall(duration, () => this.endLag(onEnd));
  }

  private endLag(onEnd?: () => void): void {
    this.locked = false;
    onEnd?.();

    const buffered = this.inputBuffer;
    this.inputBuffer = [];
    buffered.forEach((input) => this.press(input));
  }

  /** Avance vers sa direction, sans effet pendant le lag. */
  walk(): void {
    if (this.locked) {
      return;
    }

    this.idle = false;
    this.setDirection(this.direction);
    this.play(this.charClass.skin.walkAnimation(this.direction), true);
  }

  /** Immobilise le perso sur sa frame d'attente en gardant sa direction, sans effet pendant le lag. */
  halt(): void {
    if (this.locked || this.idle) {
      return;
    }

    this.idle = true;
    this.setVelocity(0, 0);
    this.stop();
    this.setTexture(this.charClass.skin.idleTexture, this.charClass.skin.idleFrame(this.direction));
  }
}
