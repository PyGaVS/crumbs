import { Inputs } from "../data/enums/Inputs";

export const CARDINALS = [Inputs.RIGHT, Inputs.LEFT, Inputs.UP, Inputs.DOWN] as const;

export type Cardinal = (typeof CARDINALS)[number];
export type Diagonal = 'RU' | 'LU' | 'LD' | 'RD';
export type Direction = Cardinal;