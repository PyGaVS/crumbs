import { SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_SIZE } from '../core/settings';
import { CharClassId } from '../data/enums/CharClassId';
import { getCharClass } from '../data/charClasses';
import { Inputs } from '../data/enums/Inputs';
import { InputHistory } from '../utils/input';
import { Cardinal, Direction } from '../utils/types';
import { Entity } from './Entity';
import { BattleScene } from '../scenes/BattleScene';

/** Animation jouée pour chaque direction (les diagonales utilisent la composante horizontale). */
const ANIMATIONS: Record<Direction, string> = {
  [Inputs.RIGHT]: 'ninja-right',
  [Inputs.LEFT]: 'ninja-left',
  [Inputs.UP]: 'ninja-up',
  [Inputs.DOWN]: 'ninja-down',
};

/** Frame de la feuille Idle par direction (mêmes colonnes que la feuille Walk). */
const IDLE_FRAMES: Record<Direction, number> = {
  [Inputs.RIGHT]: 3,
  [Inputs.LEFT]: 2,
  [Inputs.UP]: 1,
  [Inputs.DOWN]: 0,
};

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
  /** En attendant la Composition (roadmap 0.4), le joueur est la classe ninja. */
  private readonly techniques = getCharClass(CharClassId.NINJA).techniques;
  private moving = false;
  ignoresWalls = false;
  name = 'player';
  speed = 360;

  constructor(battleScene: BattleScene) {
    super(battleScene, SCREEN_WIDTH / 10, SCREEN_HEIGHT - SCREEN_HEIGHT / 10, 'ninjaGreen', 3);
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
    const technique = this.techniques.find((t) => t.matches(this.inputHistory.history));

    technique?.execute(this);
  }

  override setDirection(direction: Direction): void {
    super.setDirection(direction);
    this.moving = true;
    this.play(ANIMATIONS[direction], true);
  }

  /** Immobilise le perso : il garde sa direction mais passe sur sa frame d'attente. */
  halt(): void {
    this.moving = false;
    this.setVelocity(0, 0);
    this.stop();
    this.setTexture('ninjaGreen-idle', IDLE_FRAMES[this.direction]);
  }
}
