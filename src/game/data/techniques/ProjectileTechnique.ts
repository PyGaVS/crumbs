import type { Player } from '../../entities/Player';
import { Projectile, type ProjectileConfig } from '../../entities/Projectile';
import type { ProjectileSkin } from '../../entities/ProjectileSkin';
import type { Cue } from '../../entities/Animation';
import { Technique, type TechniqueOptions } from '../../entities/Technique';
import Sequence from '../../utils/Sequence';
import type { ProjectileSkinId } from '../enums/ProjectileSkinId';
import { TechniqueId } from '../enums/TechniqueId';
import { getProjectileSkin } from '../projectileSkins';

type ProjectileOptions = TechniqueOptions &
  Omit<ProjectileConfig, 'angle'> & {
    skinId: ProjectileSkinId;
    /** Écarts (radians) autour du regard du joueur, un projectile par écart. */
    spreadAngles?: readonly number[];
  };

export default class ProjectileTechnique extends Technique {
  constructor(
    id: TechniqueId,
    name: string,
    sequence: Sequence,
    private readonly options: ProjectileOptions,
  ) {
    super(id, name, sequence, options);
  }

  get skin(): ProjectileSkin {
    return getProjectileSkin(this.options.skinId);
  }

  protected override action(player: Player, cue: Cue): void {
    for (const spread of this.options.spreadAngles ?? [0]) {
      new Projectile(player.scene, player.x, player.y, this.skin, {
        ...this.options,
        angle: cue.facing.angle + spread,
      });
    }

    super.action(player, cue);
  }
}
