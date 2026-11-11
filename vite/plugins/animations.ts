import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

/**
 * Génère public/assets/animations.json (format Phaser `load.animation`) à partir de
 * vite/animations.config.json, pour ne pas écrire chaque frame à la main.
 *
 * Trois dispositions de spritesheet sont supportées :
 *   - "column"   : une colonne par animation, une ligne par frame (frame = row * columns + column)
 *   - "sequence" : les animations se suivent, `framesPerAnimation` frames chacune
 *   - "frames"   : les frames de chaque animation listées une à une
 */

interface SheetBase {
  /** Textures partageant cette disposition (clés du pack.json). */
  keys: string[];
  /** Préfixe des clés d'animation (`<prefix>-<name>`) ; par défaut la clé de la texture. */
  prefix?: string;
  frameRate?: number;
  repeat?: number;
}

interface ColumnSheet extends SheetBase {
  layout: 'column';
  columns: number;
  rows: number;
  /** Noms des animations, dans l'ordre des colonnes. */
  animations: string[];
}

interface SequenceSheet extends SheetBase {
  layout: 'sequence';
  framesPerAnimation: number;
  /** Noms des animations, dans l'ordre de la feuille. */
  animations: string[];
}

interface FramesSheet extends SheetBase {
  layout: 'frames';
  /** Frames de chaque animation, dans l'ordre de lecture. */
  animations: Record<string, number[]>;
}

type Sheet = ColumnSheet | SequenceSheet | FramesSheet;

interface AnimationsConfig {
  output: string;
  frameRate: number;
  repeat: number;
  sheets: Sheet[];
}

/** Format attendu par Phaser (`Phaser.Types.Animations.JSONAnimation`). */
interface PhaserAnimation {
  key: string;
  frames: { key: string; frame: number }[];
  frameRate: number;
  repeat: number;
}

function animationFrames(sheet: Sheet): [name: string, frames: number[]][] {
  switch (sheet.layout) {
    case 'column':
      return sheet.animations.map((name, column) => [
        name,
        Array.from({ length: sheet.rows }, (_, row) => row * sheet.columns + column),
      ]);
    case 'sequence':
      return sheet.animations.map((name, index) => [
        name,
        Array.from({ length: sheet.framesPerAnimation }, (_, i) => index * sheet.framesPerAnimation + i),
      ]);
    case 'frames':
      return Object.entries(sheet.animations);
    default:
      throw new Error(`Disposition inconnue "${(sheet as Sheet).layout}" (attendu : column, sequence, frames)`);
  }
}

export function buildAnimations(config: AnimationsConfig): PhaserAnimation[] {
  const anims: PhaserAnimation[] = [];

  for (const sheet of config.sheets) {
    for (const key of sheet.keys) {
      const prefix = sheet.prefix ?? key;

      for (const [name, frames] of animationFrames(sheet)) {
        anims.push({
          key: `${prefix}-${name}`,
          frames: frames.map((frame) => ({ key, frame })),
          frameRate: sheet.frameRate ?? config.frameRate,
          repeat: sheet.repeat ?? config.repeat,
        });
      }
    }
  }

  return anims;
}

export function animations(configPath = 'vite/animations.config.json'): Plugin {
  return {
    name: 'animations',
    buildStart() {
      const root = process.cwd();
      const config: AnimationsConfig = JSON.parse(readFileSync(resolve(root, configPath), 'utf8'));
      const anims = buildAnimations(config);

      writeFileSync(resolve(root, config.output), JSON.stringify({ anims }, null, 2) + '\n');
      this.info(`${anims.length} animations écrites dans ${config.output}`);
    },
  };
}
