import { Attachment } from './Attachment';
import type { Entity } from './Entity';

export class Shadow extends Attachment {
  constructor(entity: Entity) {
    super(entity, 'shadow');
    this.scene.children.moveBelow(this, entity);
  }

  protected follow(): void {
    this.setPosition(this.target.x, this.target.y + this.target.displayHeight / 2);
  }
}
