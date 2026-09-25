import type { Player } from '../entities/Player';
import { TechniqueId } from './enums/TechniqueId';
import { Technique } from '../entities/Technique';
import Sequence from '../utils/Sequence';
import { Inputs } from './enums/Inputs';
import { Cardinal } from '../utils/input';

/** Accélération brutale et brève dans la direction courante. */
export function dash(player: Player): void {

  const [dx, dy]: [number, number] = ({
    [Inputs.RIGHT]: [256, 0],
    [Inputs.LEFT]: [-256, 0],
    [Inputs.UP]: [0, -256],
    [Inputs.DOWN]: [0, 256],
  } satisfies Record<Cardinal, [number, number]>)[player.direction];

  player.scene.tweens.add({
    targets: player,
    duration: 100,
    x: `+= ${dx}`,
    y: `+= ${dy}`,
    ease: 'Quad.out',
  })
}

/** Catalogue des techniques. */
export const ALL_TECHNIQUES: readonly Technique[] = [
  new Technique(TechniqueId.DASH, 'Dash', new Sequence().same().same().opposite(), dash),
];

export function getTechnique(id: TechniqueId): Technique {
  const technique = ALL_TECHNIQUES.find((t) => t.id === id);

  if (!technique) {
    throw new Error(`Technique inconnue : ${id}`);
  }

  return technique;
}
