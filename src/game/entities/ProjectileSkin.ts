import type { ProjectileSkinId } from '../data/enums/ProjectileSkinId';
import { SpritePlayback } from '../data/enums/SpritePlayback';

export type ProjectileSkinOptions = {
  assetAngle?: number;
  animation?: string;
  playback?: SpritePlayback;
  /** en degrés par seconde. */
  spin?: number;
};

/** L'apparence d'un projectile : son sprite, son orientation et son animation en vol. */
export class ProjectileSkin {
  readonly assetAngle?: number;
  readonly animation?: string;
  readonly playback: SpritePlayback;
  readonly spin?: number;

  constructor(
    readonly id: ProjectileSkinId,
    readonly textureKey: string,
    options: ProjectileSkinOptions = {},
  ) {
    this.assetAngle = options.assetAngle;
    this.animation = options.animation;
    this.playback = options.playback ?? SpritePlayback.LOOP;
    this.spin = options.spin;
  }
}
