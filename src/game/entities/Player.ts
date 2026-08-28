import { Scene } from 'phaser';
import { SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_SIZE } from '../core/settings';
import { Cardinal, InputHistory, Special } from '../utils/input';
import { Direction, Entity } from './Entity';

/** Rotation du sprite (en degrés, sens horaire) pour chaque direction. */
const ANGLES: Record<Direction, number> = {
  R: 0,
  L: 180,
  U: -90,
  D: 90,
  RU: -45,
  LU: -135,
  LD: 135,
  RD: 45,
};

/** Touches clavier (KeyboardEvent.code) → direction. */
const KEYS: Partial<Record<string, Cardinal>> = {
  ArrowRight: 'R',
  ArrowLeft: 'L',
  ArrowUp: 'U',
  ArrowDown: 'D',
};

/** Équivalent de entities/player.py */
export class Player extends Entity {
  score = 0;
  inputHistory = new InputHistory();
  speedBoost = 0;

  constructor(scene: Scene) {
    super(scene, SCREEN_WIDTH / 10, SCREEN_HEIGHT - SCREEN_HEIGHT / 10, 'pacman', 2);

    this.name = 'player';
    this.speed = 6;
    this.setScale(SPRITE_SIZE / this.width);
    this.play('pacman');
  }

  onKeyPress(code: string): void {
    const input = KEYS[code];

    if (!input) {
      return;
    }

    this.setDirection(input);

    const special = this.inputHistory.addInput(input);

    this.applySpecial(special);
  }

  override setDirection(direction: Direction): void {
    this.direction = direction;
    this.angle = ANGLES[direction];
    this.speedBoost = 0;
  }

  move(delta: number): void {
    this.checkBorder();
    this.forward(delta, this.speedBoost);
  }

  applySpecial(special: Special): void {
    if (special === 'speed') {
      this.speedBoost = this.speed / 2 + 1;
    } else if (special !== '') {
      this.setDirection(special);
    }
  }
}
