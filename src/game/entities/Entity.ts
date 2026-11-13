import { GameObjects, Physics, Scene, Scenes } from 'phaser';
import { Inputs } from '../data/enums/Inputs';
import type { SkinAction } from '../data/enums/SkinAction';
import { Direction, DirectionFacing, FACING_ANGLES, orient, polar } from '../utils/orientation';
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
  /** Multiplicateurs de l'échelle, ancrés aux pieds, appliqués au seul rendu : corps, hurtbox et attaches ne les voient pas. */
  readonly renderScale = { x: 1, y: 1 };
  ignoresWalls = false;
  private playback?: Playback;
  private _altitude = 0;
  private unscaled?: { scaleX: number; scaleY: number; y: number };

  constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.shadow = new Shadow(this);
    scene.events.on(Scenes.Events.PRE_RENDER, this.applyRenderScale, this);
    scene.events.on(Scenes.Events.RENDER, this.removeRenderScale, this);
    this.once(GameObjects.Events.DESTROY, () => {
      this.playback?.stop();
      scene.events.off(Scenes.Events.PRE_RENDER, this.applyRenderScale, this);
      scene.events.off(Scenes.Events.RENDER, this.removeRenderScale, this);
    });
  }

  /** px au-dessus du sol. */
  get altitude(): number {
    return this._altitude;
  }

  /** Ne décale que le rendu : position, corps et hurtbox restent au sol. */
  set altitude(value: number) {
    const shift = (value - this._altitude) / this.scaleY;

    this._altitude = value;
    this.setDisplayOrigin(this.displayOriginX, this.displayOriginY + shift);
    (this.body as Physics.Arcade.Body).offset.y += shift;
  }

  get performing(): boolean {
    return this.playback?.playing ?? false;
  }

  /** Juste avant le rendu : l'échelle déformée, et la position décalée pour garder le bas de la frame en place. */
  private applyRenderScale(): void {
    const { x, y } = this.renderScale;

    if (x === 1 && y === 1) {
      return;
    }

    const { scaleX, scaleY } = this;

    this.unscaled = { scaleX, scaleY, y: this.y };
    this.y += (this.height - this.displayOriginY) * scaleY * (1 - y);
    this.setScale(scaleX * x, scaleY * y);
  }

  /** Juste après le rendu : l'échelle et la position d'avant. */
  private removeRenderScale(): void {
    if (!this.unscaled) {
      return;
    }

    const { scaleX, scaleY, y } = this.unscaled;

    this.setScale(scaleX, scaleY);
    this.y = y;
    this.unscaled = undefined;
  }

  /** Joue une action du skin ; seules les entités au skin animé la définissent. */
  playAction?(action: SkinAction, direction: Direction): void;

  scaleHurtbox?(scale: number): void;

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

  ahead(distance: number): { x: number; y: number } {
    const [x, y] = polar(this.x, this.y, FACING_ANGLES[this.direction], distance);

    return { x, y };
  }

  isCloseTo(pos: { x: number; y: number }, range = 150): boolean {
    return Math.abs(this.x - pos.x) < range && Math.abs(this.y - pos.y) < range;
  }
}
