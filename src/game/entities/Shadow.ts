import { Attachment } from './Attachment';
import type { Entity } from './Entity';

const SHRINK_PER_PX = 0.005;

export class Shadow extends Attachment<Entity> {
  constructor(entity: Entity) {
    super(entity, 'shadow');
    this.scene.children.moveBelow(this, entity);
  }

  protected follow(): void {
    const { x, y, displayHeight, altitude } = this.target;

    this.setScale(this.scaleX * (1 - altitude * 0.005), this.scaleY * (1 - altitude * SHRINK_PER_PX));
    this.setPosition(x, y + displayHeight / 2);
  }
}
