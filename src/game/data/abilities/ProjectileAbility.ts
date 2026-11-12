import type { Fighter } from '../../entities/Fighter';
import { Projectile, type ProjectileConfig } from '../../entities/Projectile';
import type { ProjectileSkin } from '../../domain/ProjectileSkin';
import type { Cue } from '../../domain/Animation';
import { Ability, type AbilityOptions } from '../../domain/Ability';
import type { ProjectileSkinId } from '../enums/ProjectileSkinId';
import { getProjectileSkin } from '../projectileSkins';

type ProjectileOptions = AbilityOptions &
  Omit<ProjectileConfig, 'angle'> & {
    skinId: ProjectileSkinId;
    /** Écarts (radians) autour du regard du lanceur, un projectile par écart. */
    spreadAngles?: readonly number[];
  };

export default class ProjectileAbility extends Ability {
  constructor(private readonly options: ProjectileOptions) {
    super(options);
  }

  get skin(): ProjectileSkin {
    return getProjectileSkin(this.options.skinId);
  }

  protected override action(fighter: Fighter, cue: Cue): void {
    for (const spread of this.options.spreadAngles ?? [0]) {
      new Projectile(fighter.scene, fighter.x, fighter.y, this.skin, {
        ...this.options,
        angle: cue.facing.angle + spread,
      });
    }
  }
}
