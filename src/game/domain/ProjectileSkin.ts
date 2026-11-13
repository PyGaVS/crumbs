import type { ProjectileSkinId } from '../data/enums/ProjectileSkinId';
import { SpritePlayback } from '../data/enums/SpritePlayback';
import type { Point } from '../utils/orientation';

export type ProjectileSkinOptions = {
  assetAngle?: number;
  animation?: string;
  playback?: SpritePlayback;
  /** en degrés par seconde. */
  spin?: number;
  /** Opacité de l'ombre, de 0 à 1. */
  shadowAlpha?: number;
  /** Multiplicateurs [largeur, hauteur] de l'image source. */
  scale?: Point;
};

/** L'apparence d'un projectile : son sprite, son orientation et son animation en vol. */
export class ProjectileSkin {
  readonly assetAngle?: number;
  readonly animation?: string;
  readonly playback: SpritePlayback;
  readonly spin?: number;
  readonly shadowAlpha: number;
  readonly scale: Point;

  constructor(
    readonly id: ProjectileSkinId,
    readonly textureKey: string,
    options: ProjectileSkinOptions = {},
  ) {
    this.assetAngle = options.assetAngle;
    this.animation = options.animation;
    this.playback = options.playback ?? SpritePlayback.LOOP;
    this.spin = options.spin;
    this.shadowAlpha = options.shadowAlpha ?? 0.15;
    this.scale = options.scale ?? [1, 1];
  }
}
