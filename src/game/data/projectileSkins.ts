import { ProjectileSkin } from '../domain/ProjectileSkin';
import { ProjectileSkinId } from './enums/ProjectileSkinId';
import { SpritePlayback } from './enums/SpritePlayback';

/** Catalogue des apparences de projectiles. */
export const ALL_PROJECTILE_SKINS: readonly ProjectileSkin[] = [
  new ProjectileSkin(ProjectileSkinId.SHURIKEN, 'shuriken', { spin: 1440 }),
  new ProjectileSkin(ProjectileSkinId.KUNAI, 'kunai', { assetAngle: -Math.PI / 4 }),
  new ProjectileSkin(ProjectileSkinId.SLASH_ARC, 'slashArc', {
    assetAngle: Math.PI / 2, animation: 'slashArc-fly', playback: SpritePlayback.LIFETIME, shadowAlpha: 0
  }),
  new ProjectileSkin(ProjectileSkinId.ARROW, 'arrow', { assetAngle: 0 }),
];

export function getProjectileSkin(id: ProjectileSkinId): ProjectileSkin {
  const skin = ALL_PROJECTILE_SKINS.find((s) => s.id === id);

  if (!skin) {
    throw new Error(`Apparence de projectile inconnue : ${id}`);
  }

  return skin;
}
