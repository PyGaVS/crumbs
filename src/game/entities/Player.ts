import { SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_SIZE } from '../core/settings';
import { Inputs } from '../data/enums/Inputs';
import { InputHistory } from '../utils/input';
import { Cardinal, Direction } from '../utils/types';
import { CharClass } from './CharClass';
import { Entity } from './Entity';
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
  ignoresWalls = false;
  name = 'player';
  speed = 360;

  constructor(
    battleScene: BattleScene,
    private readonly charClass: CharClass,
  ) {
    super(battleScene, SCREEN_WIDTH / 10, SCREEN_HEIGHT - SCREEN_HEIGHT / 10, charClass.skin.textureKey);
    this.setScale(SPRITE_SIZE / this.width);
    this.halt();
  }

  onKeyPress(code: string): void {
    const course = this.moving ? this.direction : Inputs.HALT;

    if (code === 'Space') {
      if (this.moving) {
        this.halt();
      }
      this.inputHistory.addInput(Inputs.HALT, course);
      this.detectTechnique();

      return;
    }

    const input = KEYS[code];

    if (!input) {
      return;
    }

    this.setDirection(input);
    this.inputHistory.addInput(input, course);
    this.detectTechnique();
  }

  private detectTechnique(): void {
    const technique = this.charClass.techniques.find((t) => t.matches(this.inputHistory.history));

    technique?.execute(this);
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
