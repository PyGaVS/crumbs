import { GameObjects, Scenes } from 'phaser';
import type { Entity } from './Entity';

export class Shadow extends GameObjects.Image {
  constructor(private readonly entity: Entity) {
    super(entity.scene, entity.x, entity.y, 'shadow');
    const { scene } = entity;

    scene.add.existing(this);
    scene.children.moveBelow(this, entity);

    entity.once(GameObjects.Events.DESTROY, () => this.destroy());
    scene.events.on(Scenes.Events.POST_UPDATE, this.follow, this);
    this.once(GameObjects.Events.DESTROY, () => scene.events.off(Scenes.Events.POST_UPDATE, this.follow, this));
  }

  /** Recopie aussi l'échelle : les sous-classes la fixent après la construction d'Entity. */
  private follow(): void {
    this.setScale(this.entity.scaleX, this.entity.scaleY);
    this.setPosition(this.entity.x, this.entity.y + this.entity.displayHeight / 2);
  }
}
