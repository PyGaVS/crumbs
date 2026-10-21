import type { FxId } from '../data/enums/FxId';

/** Un effet visuel du pack, indépendant de l'usage qu'en font les animations. */
export class Fx {
  constructor(
    readonly id: FxId,
    readonly textureKey: string,
    readonly animation: string,
    /** Angle (radians) vers lequel pointe l'asset dans son image source. */
    readonly assetAngle: number,
  ) {}
}
