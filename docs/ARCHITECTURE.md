# Crumbs : architecture

> Complète [DESIGN.md](DESIGN.md) (ce que le jeu est) et [ROADMAP.md](ROADMAP.md) (dans
> quel ordre on le construit) : ici, comment le code est organisé et pourquoi.

## Vue d'ensemble

```
src/
  main.ts                 Point d'entrée : monte le jeu Phaser dans la page
  game/
    main.ts               Config Phaser (résolution, pixelArt, liste des scènes)
    core/settings.ts      Constantes globales (écran, SPRITE_SIZE, ASSET_PACK…)
    scenes/               Les écrans du jeu
    controls/             Les sources d'inputs : PlayerControls pilote le joueur au clavier
    ui/                   L'habillage en jeu : Gauge, LifeBar des mobs, Hud du joueur,
                          InputHistoryText (historique d'inputs)
    debug/                Les outils de dev, créés seulement par `npm run dev` :
                          HitboxOverlay (touche H)
    entities/             Les entités : sprites Phaser (Player…) et entités métier
                          pures (Technique, CharClass, Weapon, EnemyKind, Skin,
                          WeaponSkin, Fx, Animation, Composition)
    data/                 La donnée pure : catalogues d'instances et enums
    utils/input.ts        Historique de touches et détection des séquences
    utils/orientation.ts  Angles du regard, miroir, Facing
    utils/combat.ts       touchedMobs : les mobs sous des hitboxs ; strike : la frappe
                          d'un repère
vite/
  config.dev.ts / config.prod.ts
  plugins/animations.ts   Génère les animations à chaque démarrage de Vite
  animations.config.json  La source compacte de ces animations
public/assets/
  pack.json               L'Asset Pack Phaser : tout ce qui se charge
docs/                     DESIGN.md, ROADMAP.md, ce fichier
```

## La règle de dépendance

```
scenes ──► sprites (Player, Slash…) ──► entités métier ◄──► data (catalogues, getX)
                  ▲                                              │
                  └───────────── sous-classes de data/<concept>/ ◄┘
```

La règle n'est pas portée par les dossiers mais par la nature des fichiers : les entités
métier et les catalogues de `data/` n'importent Phaser qu'en type. Les sous-classes rangées
dans `data/<concept>/` pilotent le moteur : `ProjectileTechnique` crée des `Projectile`,
`SlashStep` des `Slash`. Elles reçoivent l'entité (`Player`, `Playback`) en import de type
et passent par ses méthodes publiques. Les accesseurs `getX(id)` relient les concepts et
chargent donc ces sous-classes.

## Les scènes

```
Boot ──► Preloader ──► MainMenu ──► Game ⇄ GameOver
```

- **Boot** : dessine le fond provisoire (quadrillage) et le fige en texture `background`.
- **Preloader** : affiche la barre de progression, charge la section `game` de
  `pack.json`, génère la texture `dot`.
- **MainMenu / GameOver** : écrans de texte, transitions au clavier.
- **Game** : l'arène du jalon 0. Recrée tout dans `create()` à chaque partie : les objets
  d'une scène meurent avec elle, seuls les textures et les animations sont globaux.

## La donnée de gameplay (`data/`)

- `enums/` : un fichier par enum (`CharClassId.NINJA`…). Ce sont les identifiants uniques
  qui relient les catalogues entre eux.
- Un catalogue par concept (`techniques/`, `animations/`, `charClasses.ts`, `weapons.ts`,
  `enemies.ts`, `skins.ts`, `weaponSkins.ts`, `fx.ts`) :
  un tableau constant d'instances plus un accesseur `getX(id)` qui échoue bruyamment sur un
  id inconnu.
- Les liens entre concepts passent par les ids (`techniqueIds: TechniqueId[]`), jamais par
  des références directes : pas d'imports circulaires.

## Les entités (`entities/`)

Deux natures cohabitent, et seule la première a le droit d'importer Phaser.

Les sprites, qui vivent dans une scène :

- `Entity` : un sprite qui avance dans une direction et qui sait
  tester une collision en rectangle. Il joue une animation à la fois (`perform`), qu'il
  avance dans son `preUpdate` et arrête à sa destruction.
- `Fighter` : une `Entity` avec PV et armure, l'ordre des dégâts et la mort à zéro PV. Il ne
  connaît pas l'UI : il émet `FighterEvent.DAMAGED`, que `ui/LifeBar` et `ui/Hud` écoutent.
- `Player` : le ninja. Il ignore d'où viennent ses ordres : `press(input)` inscrit un appui
  dans l'historique de touches, `walk()` et `halt()` le font marcher ou l'arrêtent. Un appui
  sur l'attaque qui ne conclut aucune technique déclenche l'attaque de base de son arme : il
  joue l'animation d'attaque de l'arme et frappe les hitboxs (`strike`) de chacun de ses
  repères. Aujourd'hui c'est `controls/PlayerControls` qui les appelle depuis le clavier. Il
  expose aussi les primitives que les techniques utilisent (`lock`, `playAction`…) et
  recevra une `Composition` (roadmap 0.4).
- `Attachment` : une image accrochée à un sprite, recalée sur lui après la physique à chaque
  frame et détruite avec lui. Deux déclinaisons :
  - `Shadow` : l'ombre portée que chaque `Entity` crée à sa construction, dessinée juste
    sous elle.
  - `HeldWeapon` : l'arme en main du joueur, placée sur la main que montre la frame en cours
    (positions décrites par le `Skin`) et tournée vers son regard. Quand une animation la
    tient (`hold`), elle suit la pose que la lecture anime. Le point de prise de l'arme
    (`handPosition`) sert de pivot au sprite.
- `Slash` : une entaille purement visuelle, posée par un `SlashStep` et détruite à la fin de
  son animation.
- `Mob` : un ennemi dans l'arène, instancié depuis son `EnemyKind` ; pour l'instant le
  mannequin d'entraînement du jalon 0.1.

Les entités métier, instanciées par les catalogues de `data/`, sans aucun Phaser :

- `Technique` : ses variantes de séquences (dont découle la notation affichée), la
  détection `matches(history)` et `execute(player)`, qui joue son animation et appelle
  `action` à chaque repère. Les sous-classes de `data/techniques/` surchargent `action`.
- `CharClass`, `Weapon`, `EnemyKind` : les concepts du design et leurs chiffres. Leur rendu
  vit à part et se référence par id :
  - `Skin` : textures, clés d'animation et position de la main sur chaque frame, pour une
    classe ou un ennemi.
  - `WeaponSkin` : le sprite d'une arme et sa version en main (`<texture>-inHand` dans le
    pack), son point de prise et l'angle de sa lame.
  - `Animation` : voir plus bas ; l'attaque de base d'une arme référence la sienne.
- `Composition` : l'assemblage d'un run (1 classe + 2 armes). `techniquesWith(armeActive)`
  donne le répertoire du moment.

## Les animations

La donnée est partagée et sans état, l'état vit
dans la lecture.

- `Animation` : une liste de steps datés (`at` en ms), dans `data/animations/index.ts`.
  `animation.play(entity, { onCue, angle })` la joue sur n'importe quelle `Entity` et coupe
  sa lecture en cours. Ajouter une animation ne demande que de la donnée.
- `AnimationStep` : la classe de base des steps, comme `Technique` pour les techniques. Ses
  enfants, dans `data/animations/`, surchargent `start(playback)` :
  - `SwingStep` : un geste de l'arme tenue, d'une pose (angle local, rayon, pivot) à une autre,
    horaire ou non (`clockwise`) ;
  - `SlashStep` : une entaille (`Fx`) posée devant l'entité ;
  - `SkinStep` : une action du skin (`SkinAction`).

  `CueStep`, dans `entities/Animation.ts`, est le repère où le gameplay agit : le seul step
  que les techniques et les armes connaissent, via `onCue`. Il porte les hitboxs de la
  frappe : des cercles décrits regard à droite (x vers l'avant, y vers le bas), que
  `Facing.place` pose dans le monde. Un `Projectile` porte aussi les siennes, tournées vers
  sa trajectoire et testées à chaque frame. `touchedMobs` compte une seule fois chaque mob,
  quel que soit le nombre de cercles qu'il chevauche, et émet `CombatEvent.STRIKE` : en dev,
  `debug/HitboxOverlay` affiche alors les cercles, pleins sur la frame où ils frappent puis en
  contour jusqu'à `DISPLAY_TIME`, et les corps physiques (touche H).
- `Playback` : une lecture, avancée par l'entité à chaque frame, sans import Phaser. C'est l'unique horloge des
  steps et des gestes, sans minuterie ni tween Phaser : `stop()` suffit à tout arrêter.
- `Facing` : le regard figé au lancement, seul endroit qui décide du miroir. L'arme,
  l'entaille, le skin et le gameplay lisent le même. Les animations sont décrites vers la
  droite et symétriques : le `clockwise` d'un geste et le `mirrored` d'une entaille valent
  vers la droite, le haut et le bas, et s'inversent vers la gauche.
- Validation au chargement : un premier geste sans pose de départ, un repère après la fin
  du lag de la technique ou de l'arme,
  lèvent une erreur. Le Preloader vérifie que chaque
  `Fx` a son animation.

## Les assets

- Tout ce qui se charge est décrit dans `public/assets/pack.json`, jamais en dur dans les
  scènes. Ajouter un sprite = une entrée dans le JSON.
- Les animations sont générées : `vite/animations.config.json` décrit les spritesheets
  (disposition en colonnes ou en séquence), le plugin `vite/plugins/animations.ts` produit
  `public/assets/animations.json` à chaque démarrage de Vite, et `pack.json` le référence.
  Le fichier généré est gitignoré.

## Conventions

- TypeScript strict, `npm run typecheck` doit passer avant de livrer.
- Formatage Prettier (`.prettierrc`), indentation gérée par l'éditeur via
  `.vscode/settings.json`.
- Commentaires courts, en français, sans tiret cadratin. Le détail des règles est dans
  `CLAUDE.md` à la racine.
