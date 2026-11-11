import { GameObjects, Physics, Scene } from 'phaser';
import { Inputs } from '../data/enums/Inputs';
import type { SkinAction } from '../data/enums/SkinAction';
import { Direction, DirectionFacing, orient } from '../utils/orientation';
import type { Animation, PlayOptions } from '../domain/Animation';
import type { HeldWeapon } from './HeldWeapon';
import { Playback } from './Playback';
import { Shadow } from './Shadow';

/** Déplacement unitaire par direction. Attention : dans Phaser l'axe Y pointe vers le BAS (inverse d'Arcade). */
const MOVES: Record<Direction, readonly [number, number]> = {
  [Inputs.RIGHT]: [1, 0],
  [Inputs.LEFT]: [-1, 0],
  [Inputs.UP]: [0, -1],
  [Inputs.DOWN]: [0, 1],
};

export class Entity extends Physics.Arcade.Sprite {
  direction: Direction = Inputs.RIGHT;
  /** px par seconde. */
  speed = 300;
  /** Angle (radians) vers lequel pointe l'asset dans son image source. */
  assetAngle?: number;
  readonly heldWeapon?: HeldWeapon;
  readonly shadow: Shadow;
  private playback?: Playback;

  constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.shadow = new Shadow(this);
    this.once(GameObjects.Events.DESTROY, () => this.playback?.stop());
  }

  get performing(): boolean {
    return this.playback?.playing ?? false;
  }

  /** Joue une action du skin ; seules les entités au skin animé la définissent. */
  playAction?(action: SkinAction, direction: Direction): void;

  /** Joue animation en coupant la lecture en cours : passer par Animation.play. */
  perform(animation: Animation, options: PlayOptions): Playback {
    const playback = new Playback(this, new DirectionFacing(options.direction ?? this.direction), animation, options);

    this.playback?.stop();

    this.playback = playback;
    playback.start();

    return playback;
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.playback?.tick(delta);
  }

  setDirection(direction: Direction): void {
    this.direction = direction;

    const [dx, dy] = MOVES[direction];

    this.setVelocity(dx * this.speed, dy * this.speed);
    this.orientTo(Math.atan2(dy, dx));
  }

  orientTo(angle: number): void {
    if (this.assetAngle === undefined) { return; }

    orient(this, angle, this.assetAngle);
  }

  isCloseTo(pos: { x: number; y: number }, range = 150): boolean {
    return Math.abs(this.x - pos.x) < range && Math.abs(this.y - pos.y) < range;
  }
}
