// Équivalent de core/settings.py
export const SCREEN_WIDTH = 1440;
export const SCREEN_HEIGHT = 768;
export const SCREEN_TITLE = 'Pac-man space';

/**
 * Durée d'une frame à 60 FPS, en millisecondes.
 * Les vitesses sont exprimées en pixels par frame (comme dans la version Python, où Arcade
 * tourne à 60 FPS fixes). On multiplie par `delta / FRAME_MS` pour garder la même vitesse
 * quel que soit le taux de rafraîchissement de l'écran.
 */
export const FRAME_MS = 1000 / 60;

/** Taille d'affichage des sprites en pixels (Python : `scale = 64 / sprite.width`). */
export const SPRITE_SIZE = 64;

/** Taille d'une frame dans les spritesheets de public/assets. */
export const FRAME_SIZE = 128;

export const PHANTOM_NAMES = ['blinky', 'pinky', 'inky', 'clyde'] as const;
