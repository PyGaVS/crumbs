import { GameObjects, Scene, Scenes } from 'phaser';
import { SCREEN_WIDTH } from '../core/settings';
import { InputHistory } from '../utils/input';

/** Marge en px entre le bord de l'écran et le texte. */
const MARGIN = 30;
const STYLE = { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' };

/** L'historique d'inputs du joueur, ancré en haut à droite. */
export class InputHistoryText extends GameObjects.Text {
  constructor(
    scene: Scene,
    private readonly history: InputHistory,
  ) {
    super(scene, SCREEN_WIDTH - MARGIN, MARGIN, '', STYLE);
    this.setOrigin(1, 0);
    this.setDepth(1);
    scene.add.existing(this);

    scene.events.on(Scenes.Events.POST_UPDATE, this.refresh, this);
    this.once(GameObjects.Events.DESTROY, () => scene.events.off(Scenes.Events.POST_UPDATE, this.refresh, this));
  }

  private refresh(): void {
    this.setText(this.history.getHistory());
  }
}
