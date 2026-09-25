import { Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_SIZE } from '../core/settings';
import { CharClassId } from '../data/enums/CharClassId';
import { getCharClass } from '../data/charClasses';
import { Cardinal, InputHistory } from '../utils/input';
import { Direction, Entity } from './Entity';

/** Animation jouée pour chaque direction (les diagonales utilisent la composante horizontale). */
const ANIMATIONS: Record<Direction, string> = {
  R: 'ninja-right',
  L: 'ninja-left',
  U: 'ninja-up',
  D: 'ninja-down',
  RU: 'ninja-right',
  LU: 'ninja-left',
  LD: 'ninja-left',
  RD: 'ninja-right',
};

/** Frame de la feuille Idle par direction (mêmes colonnes que la feuille Walk). */
const IDLE_FRAMES: Record<Direction, number> = {
  R: 3,
  L: 2,
  U: 1,
  D: 0,
  RU: 3,
  LU: 2,
  LD: 2,
  RD: 3,
};

/** Touches clavier (KeyboardEvent.code) → direction. */
const KEYS: Partial<Record<string, Cardinal>> = {
  ArrowRight: 'R',
  ArrowLeft: 'L',
  ArrowUp: 'U',
  ArrowDown: 'D',
};

export class Player extends Entity {
  score = 0;
  inputHistory = new InputHistory();
  /** En attendant la Composition (roadmap 0.4), le joueur est la classe ninja. */
  private readonly techniques = getCharClass(CharClassId.NINJA).techniques;
  private boostAmount = 0;
  private boostTimer = 0;
  private moving = false;
  name = 'player';
  speed = 6;

  constructor(scene: Scene) {
    super(scene, SCREEN_WIDTH / 10, SCREEN_HEIGHT - SCREEN_HEIGHT / 10, 'ninjaGreen', 3);
    this.setScale(SPRITE_SIZE / this.width);
    this.halt();
  }

  onKeyPress(code: string): void {
    const course = this.moving ? this.direction : 'H';

    if (code === 'Space') {
      if (this.moving) {
        this.halt();
      }
      this.inputHistory.addInput('H', course);
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

  /** Surcroît de vitesse temporaire, en px par frame pendant `duration` ms. */
  applyBoost(amount: number, duration: number): void {
    this.boostAmount = amount;
    this.boostTimer = duration;
  }

  override setDirection(direction: Direction): void {
    this.direction = direction;
    this.moving = true;
    this.play(ANIMATIONS[direction], true);
  }

  /** Immobilise le perso : il garde sa direction mais passe sur sa frame d'attente. */
  halt(): void {
    this.moving = false;
    this.stop();
    this.setTexture('ninjaGreen-idle', IDLE_FRAMES[this.direction]);
  }

  move(delta: number): void {
    if (!this.moving) {
      return;
    }

    this.boostTimer = Math.max(0, this.boostTimer - delta);
    this.checkBorder();
    this.forward(delta, this.boostTimer > 0 ? this.boostAmount : 0);
  }
}
