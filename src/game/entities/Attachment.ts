import { GameObjects, Scenes } from 'phaser';

/** Une image accrochée à un sprite : recalée après la physique à chaque frame, détruite avec lui. */
export abstract class Attachment<T extends GameObjects.Sprite = GameObjects.Sprite> extends GameObjects.Image {
  constructor(
    protected readonly target: T,
    texture: string,
  ) {
    super(target.scene, target.x, target.y, texture);
    const { scene } = target;

    scene.add.existing(this);

    target.once(GameObjects.Events.DESTROY, () => this.destroy());
    scene.events.on(Scenes.Events.POST_UPDATE, this.sync, this);
    this.once(GameObjects.Events.DESTROY, () => scene.events.off(Scenes.Events.POST_UPDATE, this.sync, this));
  }

  private sync(): void {
    this.setScale(this.target.scaleX, this.target.scaleY);
    this.follow();
  }

  protected abstract follow(): void;
}
