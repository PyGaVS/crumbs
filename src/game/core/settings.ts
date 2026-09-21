// Équivalent de core/settings.py
export const SCREEN_WIDTH = 1440;
export const SCREEN_HEIGHT = 768;
export const SCREEN_TITLE = 'Crumbs';

/**
 * Durée d'une frame à 60 FPS, en millisecondes.
 * Les vitesses sont exprimées en pixels par frame (comme dans la version Python, où Arcade
 * tourne à 60 FPS fixes). On multiplie par `delta / FRAME_MS` pour garder la même vitesse
 * quel que soit le taux de rafraîchissement de l'écran.
 */
export const FRAME_MS = 1000 / 60;

/** Taille d'affichage des sprites en pixels (Python : `scale = 64 / sprite.width`). */
export const SPRITE_SIZE = 64;

/** Asset Pack Phaser décrivant tous les fichiers à charger (images, spritesheets, animations). */
export const ASSET_PACK = 'assets/pack.json';

export const PHANTOM_NAMES = ['blinky', 'pinky', 'inky', 'clyde'] as const;
