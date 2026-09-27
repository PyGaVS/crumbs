import { Player } from '../../entities/Player';
import { Projectile, type ProjectileConfig } from '../../entities/Projectile';
import { Technique, type TechniqueOptions } from '../../entities/Technique';
import { Cardinal } from '../../utils/types';
import Sequence from '../../utils/Sequence';
import { Inputs } from '../enums/Inputs';
import { TechniqueId } from '../enums/TechniqueId';

/** Angle (radians) du regard du joueur. Rappel : l'axe Y de Phaser pointe vers le bas. */
const FACING_ANGLES: Record<Cardinal, number> = {
  [Inputs.RIGHT]: 0,
  [Inputs.DOWN]: Math.PI / 2,
  [Inputs.LEFT]: Math.PI,
  [Inputs.UP]: -Math.PI / 2,
};

type ProjectileOptions = TechniqueOptions &
  Omit<ProjectileConfig, 'angle'> & {
    texture: string;
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

  protected override action(player: Player): void {
    const facing = FACING_ANGLES[player.direction];

    for (const spread of this.options.spreadAngles ?? [0]) {
      new Projectile(player.scene, player.x, player.y, this.options.texture, {
        ...this.options,
        angle: facing + spread,
      });
    }

    this.afterEffect(player);
  }
}
