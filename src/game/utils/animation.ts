import type { Scene } from 'phaser';

/** frameRate qui étire l'animation key sur duration ms : Phaser ignore duration dès que l'animation a un frameRate. */
export function frameRateOver(scene: Scene, key: string, duration: number): number {
  return (scene.anims.get(key).getTotalFrames() * 1000) / duration;
}
