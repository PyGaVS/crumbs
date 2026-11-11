import { Fx } from '../domain/Fx';
import { FxId } from './enums/FxId';

/** Catalogue des effets visuels. */
export const ALL_FX: readonly Fx[] = [
  new Fx(FxId.SLASH_02, 'slash02', 'slash02-strike', Math.PI / 2),
  new Fx(FxId.SLASH_CIRCULAR, 'slashCircular', 'slashCircular-strike', Math.PI),
  new Fx(FxId.SMOKE, 'smoke', 'smoke-puff', 0),
  new Fx(FxId.ROCK_BURST, 'rockBurst', 'rockBurst-burst', 0),
  new Fx(FxId.SMOKE_CIRCULAR, 'smokeCircular', 'smokeCircular-puff', 0),
];

export function getFx(id: FxId): Fx {
  const fx = ALL_FX.find((f) => f.id === id);

  if (!fx) {
    throw new Error(`Effet inconnu : ${id}`);
  }

  return fx;
}
