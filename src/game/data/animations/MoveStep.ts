import { Tweens } from 'phaser';
import { AnimationStep, type Ease, type StepOptions } from '../../domain/Animation';
import type { EaseFunction, Playback } from '../../entities/Playback';
import { landingDistance } from '../../utils/collision';
import { polar } from '../../utils/orientation';

export type MoveObstacles = { crossWalls?: boolean; crossFighters?: boolean };

type MoveOptions = StepOptions & {
  /** px vers le regard, négatif pour reculer. */
  distance: number;
  /** px au sommet de l'arc */
  height?: number;
  /** ms */
  duration: number;
  ease: Ease;
  /** Arrêt avant un obstacle infranchissable, jamais d'atterrissage dedans ; absent, le trajet les ignore. */
  obstacles?: MoveObstacles;
};

/** Un déplacement de l'entité le long du regard figé, en arc si height. */
export default class MoveStep extends AnimationStep {
  private readonly ease: EaseFunction;

  constructor(private readonly options: MoveOptions) {
    super(options);
    this.ease = Tweens.Builders.GetEaseFunction(options.ease) as EaseFunction;
  }

  override get duration(): number {
    return this.options.duration;
  }

  start(playback: Playback): void {
    const { entity, facing } = playback;
    const { distance, height = 0, duration, obstacles } = this.options;
    const angle = distance < 0 ? facing.angle + Math.PI : facing.angle;
    const landing = this.landing(playback, angle);
    const { x: fromX, y: fromY } = entity;
    const [toX, toY] = polar(fromX, fromY, angle, landing);

    if (obstacles?.crossWalls) {
      entity.ignoresWalls = true;
    }

    // Raccourci par un obstacle, le trajet finit plus tôt à la même vitesse
    const travel = landing < Math.abs(distance) ? (duration * landing) / Math.abs(distance) : duration;

    playback.during(travel, (_ms, progress) => {
      const t = this.ease(progress);

      entity.altitude = height * Math.sin(Math.PI * t);
      entity.setPosition(fromX + (toX - fromX) * t, fromY + (toY - fromY) * t);
    });
  }

  /** px jusqu'au point d'arrivée vers angle, toujours positifs. */
  private landing({ entity }: Playback, angle: number): number {
    const { distance, obstacles } = this.options;

    if (!obstacles) {
      return Math.abs(distance);
    }

    return landingDistance(entity, angle, Math.abs(distance), {
      walls: obstacles.crossWalls ?? false,
      fighters: obstacles.crossFighters ?? false,
    });
  }
}
