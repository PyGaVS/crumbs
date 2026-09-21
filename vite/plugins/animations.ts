import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

/**
 * Génère public/assets/animations.json (format Phaser `load.animation`) à partir de
 * vite/animations.config.json, pour ne pas écrire chaque frame à la main.
 *
 * Deux dispositions de spritesheet sont supportées :
 *   - "column"   : une colonne par animation, une ligne par frame (frame = row * columns + column)
 *   - "sequence" : les animations se suivent, `framesPerAnimation` frames chacune
 */

interface SheetBase {
  /** Textures partageant cette disposition (clés du pack.json). */
  keys: string[];
  /** Préfixe des clés d'animation (`<prefix>-<name>`) ; par défaut la clé de la texture. */
  prefix?: string;
  /** Noms des animations, dans l'ordre de la feuille. */
  animations: string[];
  frameRate?: number;
  repeat?: number;
}

interface ColumnSheet extends SheetBase {
  layout: 'column';
  columns: number;
  rows: number;
}

interface SequenceSheet extends SheetBase {
  layout: 'sequence';
  framesPerAnimation: number;
}

type Sheet = ColumnSheet | SequenceSheet;

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

function frameIndexes(sheet: Sheet, index: number): number[] {
  switch (sheet.layout) {
    case 'column':
      return Array.from({ length: sheet.rows }, (_, row) => row * sheet.columns + index);
    case 'sequence':
      return Array.from({ length: sheet.framesPerAnimation }, (_, i) => index * sheet.framesPerAnimation + i);
    default:
      throw new Error(`Disposition inconnue "${(sheet as Sheet).layout}" (attendu : column, sequence)`);
  }
}

export function buildAnimations(config: AnimationsConfig): PhaserAnimation[] {
  const anims: PhaserAnimation[] = [];

  for (const sheet of config.sheets) {
    for (const key of sheet.keys) {
      const prefix = sheet.prefix ?? key;

      sheet.animations.forEach((name, index) => {
        anims.push({
          key: `${prefix}-${name}`,
          frames: frameIndexes(sheet, index).map((frame) => ({ key, frame })),
          frameRate: sheet.frameRate ?? config.frameRate,
          repeat: sheet.repeat ?? config.repeat,
        });
      });
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
