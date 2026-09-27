import { SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_SIZE } from '../core/settings';
import { Inputs } from '../data/enums/Inputs';
import { InputHistory } from '../utils/input';
import { Cardinal, Direction } from '../utils/types';
import { CharClass } from './CharClass';
import { Entity } from './Entity';
import type { Technique } from './Technique';
import { BattleScene } from '../scenes/BattleScene';

/** Touches clavier (KeyboardEvent.code) → direction. */
const KEYS: Partial<Record<string, Cardinal>> = {
  ArrowRight: Inputs.RIGHT,
  ArrowLeft: Inputs.LEFT,
  ArrowUp: Inputs.UP,
  ArrowDown: Inputs.DOWN,
};

export class Player extends Entity {
  score = 0;
  inputHistory = new InputHistory();
  private moving = false;
  /** Récupération après une technique : inputs mis en tampon puis rejoués. */
  private locked = false;
  private inputBuffer: string[] = [];
  ignoresWalls = false;
  name = 'player';
  speed = 360;

  constructor(
    battleScene: BattleScene,
    private readonly charClass: CharClass,
  ) {
    super(battleScene, SCREEN_WIDTH / 10, SCREEN_HEIGHT - SCREEN_HEIGHT / 10, charClass.skin.walkTexture);
    this.setScale(SPRITE_SIZE / this.width);
    this.halt();
  }

  onKeyPress(code: string): void {
    if (this.locked) {
      if (code === 'Space' || KEYS[code]) {
        this.inputBuffer.push(code);
      }

      return;
    }

    if (code === 'Space') {
      if (this.moving) {
        this.halt();
      }
      this.inputHistory.addInput(Inputs.HALT);
      this.detectTechnique();

      return;
    }

    const input = KEYS[code];

    if (!input) {
      return;
    }

    this.setDirection(input);
    this.inputHistory.addInput(input);
    this.detectTechnique();
  }

  private detectTechnique(): void {
    const technique = this.charClass.techniques.find((t) => t.matches(this.inputHistory.history));

    if (technique) {
      this.castTechnique(technique);
    }
  }

  private castTechnique(technique: Technique): void {
    if (technique.playerAnimation) {
      this.moving = false;
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

  /** Fin de récupération : rejoue les inputs tamponnés comme s'ils venaient d'être pressés. */
  private endLag(onEnd?: () => void): void {
    this.locked = false;
    onEnd?.();

    const buffered = this.inputBuffer;
    this.inputBuffer = [];
    buffered.forEach((code) => this.onKeyPress(code));

    if (!this.locked && !this.moving) {
      this.halt();
    }
  }

  override setDirection(direction: Direction): void {
    super.setDirection(direction);
    this.moving = true;
    this.play(this.charClass.skin.walkAnimation(direction), true);
  }

  /** Immobilise le perso : il garde sa direction mais passe sur sa frame d'attente. */
  halt(): void {
    this.moving = false;
    this.setVelocity(0, 0);
    this.stop();
    this.setTexture(this.charClass.skin.idleTexture, this.charClass.skin.idleFrame(this.direction));
  }
}
