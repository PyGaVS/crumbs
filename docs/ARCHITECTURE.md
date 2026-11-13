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
    controls/             Les sources d'inputs : PlayerControls pilote le joueur au clavier,
                          MobControls pilote un mob selon son MobBehavior
    ui/                   L'habillage en jeu : Gauge, LifeBar des mobs, Hud du joueur,
                          InputHistoryText (historique d'inputs)
    debug/                Les outils de dev, créés seulement par `npm run dev` :
                          HitboxOverlay (touche H)
    entities/             Les sprites Phaser qui vivent dans une scène (Entity, Player…)
    domain/               Les classes métier, sans Phaser (Ability, Technique, CharClass, Weapon,
                          EnemyKind, MobAttack, MobBehavior, Skin, WeaponSkin, ProjectileSkin,
                          Fx, Animation, Composition)
    data/                 La donnée pure : catalogues d'instances et enums
    utils/input.ts        Historique de touches et détection des séquences
    utils/orientation.ts  Directions (Cardinal, Direction), angles du regard, miroir, Facing
    utils/combat.ts       touchedFighters : les fighters d'une classe sous des hitboxs ;
                          strike : la frappe d'un repère
    utils/hitboxes.ts     Les formes de hitboxs toutes faites (hitboxRing…)
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
scenes ──► sprites (Player, FxSprite…) ──► entités métier ◄──► data (catalogues, getX)
                  ▲                                              │
                  └───────────── sous-classes de data/<concept>/ ◄┘
```

La règle n'est pas portée par les dossiers mais par la nature des fichiers : les entités
métier et les catalogues de `data/` n'importent Phaser qu'en type. Les sous-classes rangées
dans `data/<concept>/` pilotent le moteur : `ProjectileAbility` crée des `Projectile`,
`FxStep` des `FxSprite`. Elles reçoivent l'entité (`Player`, `Playback`) en import de type
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
- Un catalogue par concept (`techniques.ts`, `animations/`, `charClasses.ts`, `weapons.ts`,
  `enemies.ts`, `skins.ts`, `weaponSkins.ts`, `projectileSkins.ts`, `fx.ts`) :
  un tableau constant d'instances plus un accesseur `getX(id)` qui échoue bruyamment sur un
  id inconnu.
- Les liens entre concepts passent par les ids (`techniqueIds: TechniqueId[]`), jamais par
  des références directes : pas d'imports circulaires.

## Les entités (`entities/`)

Les sprites, qui vivent dans une scène :

- `Entity` : un sprite qui avance dans une direction et qui sait
  tester une collision en rectangle. Il joue une animation à la fois (`perform`), qu'il
  avance dans son `preUpdate` et arrête à sa destruction. Comme `altitude`, son `renderScale`
  (multiplicateurs de l'échelle) ne touche que le rendu. `ignoresWalls` coupe ses collisions
  avec les fighters pendant un `MoveStep` qui traverse ; la fin d'une lecture le remet à faux.
- `Fighter` : une `Entity` avec PV et armure, l'ordre des dégâts et la mort à zéro PV. Son
  corps physique, sa hurtbox, est un cercle inscrit dans sa frame, que `scaleHurtbox` agrandit
  ou réduit autour de son centre ; la fin d'une lecture la rend à sa taille. Il ne connaît pas l'UI : il émet `FighterEvent.DAMAGED`, que `ui/LifeBar` et `ui/Hud` écoutent.
- `Player` : le ninja. Il ignore d'où viennent ses ordres : `press(input)` inscrit un appui
  dans l'historique de touches, `move()` et `halt()` le font marcher ou l'arrêtent. Un appui
  sur l'attaque qui ne conclut aucune technique déclenche l'attaque de base de son arme, une
  `Ability`, figé jusqu'à la fin de son animation. Aujourd'hui c'est `controls/PlayerControls` qui les appelle
  depuis le clavier. Il expose aussi les primitives que les techniques utilisent (`lock`,
  `playAction`…). Il reçoit une `Composition` et ne reconnaît que les techniques de sa classe
  et de son arme active. Un appui sur le switch passe à l'autre arme, après la technique
  qu'il conclut éventuellement : il ne fige pas le joueur.
- `Attachment` : une image accrochée à un sprite, recalée sur lui après la physique à chaque
  frame et détruite avec lui. Deux déclinaisons :
  - `Shadow` : l'ombre portée que chaque `Entity` crée à sa construction, dessinée juste
    sous elle.
  - `HeldWeapon` : l'arme en main du joueur, placée sur la main que montre la frame en cours
    (positions décrites par le `Skin`) et tournée vers son regard. Elle est dessinée derrière
    le joueur quand il regarde vers le haut, devant sinon. Quand une animation la
    tient (`hold`), elle suit la pose que la lecture anime, et revient à sa première frame
    quand la lecture la rend. Le point de prise de l'arme
    (`handPosition`) sert de pivot au sprite. `wield` prend une arme en main : son sprite
    entier tourne jusqu'à la pose de la main puis laisse place à sa version en main, sur
    l'horloge de la scène et sans verrou. `sheathe` la cache jusqu'à la prochaine prise en
    main, le temps de la technique conclue par le switch.
- `FxSprite` : un effet purement visuel (`Fx`), posé par un `FxStep` et détruit à la fin de
  son animation. Orienté ou droit, teinté ou non.
- `Enemy` : un ennemi instancié depuis son `EnemyKind`, piloté par `controls/MobControls` s'il
  a un `MobBehavior`. Ses attaques passent avant ses déplacements, et il ne décide rien tant
  que son animation joue. Une attaque le tourne vers sa cible puis lance son `Ability`. Il joue
  les actions de son skin (`playAction`), donc les `SkinStep`.
  `ambush` donne une destination qui coupe la route d'une cible : le point devant elle
  (`Entity.ahead`), à une avance proportionnelle à la distance (`leadRatio`) jusqu'à un plafond
  (`maxLead`).

## Le domaine (`domain/`)

Les classes métier, instanciées par les catalogues de `data/`. Aucune n'importe Phaser :

- `Ability` : ce que fait un fighter. `execute(fighter)` joue son animation, obligatoire, et appelle
  `action` à chaque repère, sans effet par défaut : une `Ability` nue n'est que son animation,
  comme le dash. Les sous-classes de `data/abilities/` surchargent `action` : `StrikeAbility`
  frappe les hitboxs du repère (`strike`) sur la classe de fighters qu'elle vise (`target`),
  `ProjectileAbility` lance des `Projectile` qui touchent cette classe. Le déclencheur est
  porté par qui la possède :
  - `Technique` : ses variantes de séquences (dont découle la notation affichée) et la
    détection `matches(history)` ;
  - l'attaque de base d'une `Weapon`, lancée par un appui sur l'attaque qui ne conclut
    aucune technique ;
  - `MobAttack` : une attaque d'`EnemyKind`, lancée dès qu'un de ses `triggers` est vrai, la
    première de la liste l'emportant.
- `CharClass`, `Weapon`, `EnemyKind` : les concepts du design et leurs chiffres. Leur rendu
  vit à part et se référence par id :
  - `Skin` : textures, clés d'animation et position de la main sur chaque frame, pour une
    classe ou un ennemi.
  - `WeaponSkin` : le sprite d'une arme et sa version en main (`<texture>-inHand` dans le
    pack), avec pour chacun son point de prise et l'angle vers lequel il pointe. Sans version
    en main, l'arme est tenue par son sprite.
  - `ProjectileSkin` : le sprite d'un projectile, son orientation, sa rotation (`spin`), son
    animation en vol, en boucle ou étirée sur toute la course (`SpritePlayback`), et
    l'opacité de son ombre (`shadowAlpha`, 0.15 par défaut). Une
    `ProjectileAbility` le référence par id et garde l'usage : taille, course, hitboxs.
  - `Animation` : voir plus bas ; une `Ability` référence la sienne.
- `MobBehavior` : le comportement d'un `EnemyKind`.
  - `destination` : le point vers lequel il marche, calculé depuis la scène.
  - `interval` : le délai en ms entre deux calculs de destination.
  - `shouldHalt` : la condition qui l'arrête.
  - `disableUTurn` : en marche, il ne fait demi-tour qu'en cul-de-sac.
- `Composition` : l'assemblage d'un run (1 classe + 2 armes). `techniquesWith(armeActive)`
  donne le répertoire du moment.

## Les animations

La donnée est partagée et sans état, l'état vit
dans la lecture.

- `Animation` : une liste de steps datés (`at` en ms), dans `data/animations/index.ts`.
  `animation.play(entity, { onCue, direction })` la joue sur n'importe quelle `Entity` et coupe
  sa lecture en cours. Ajouter une animation ne demande que de la donnée.
- `AnimationStep` : la classe de base des steps, comme `Ability` pour les abilities. Ses
  enfants, dans `data/animations/`, surchargent `start(playback)` :
  - `SwingStep` : un geste de l'arme tenue, d'une pose (angle local, rayon, pivot) à une autre,
    dans le sens de rotation `clockwise`, arme miroitée ou non (`mirror`), puis figée sur sa
    pose d'arrivée pendant `hold` ms ;
  - `FxStep` : des effets (`Fx`) posés à `reach` px de l'entité, un seul devant elle ou
    `count` en cercle, tournés vers le regard ou droits (`upright`), teintés ou non, décalés
    à l'écran de `offset` quel que soit le regard ;
  - `SkinStep` : une action du skin (`SkinAction`), tenue `duration` ms. Elle suit le regard
    si la config la décline par direction (`<skin>-<action>-<direction>`), sinon elle est
    jouée telle quelle (`<skin>-<action>`) ;
  - `MoveStep` : un déplacement de `distance` px le long du regard en `duration` ms, en arc si
    `height`. Avec `obstacles`, il s'arrête avant un obstacle infranchissable et ne se pose
    jamais dedans (`landingDistance`), finit plus tôt si le trajet raccourcit, et coupe les
    collisions avec les fighters s'il traverse les murs (`crossWalls`) ;
  - `WeaponFramesStep` : des frames de la feuille de l'arme tenue, réparties à parts égales
    sur `duration` ms, sur l'horloge de la lecture (la charge de l'arc) ;
  - `PulseStep` : la base des effets qui montent à leur plus fort en `duration` ms, y restent
    `hold` ms, puis reviennent en `recover` ms. Ses enfants disent ce que l'effet touche :
    - `ScaleStep` : le skin aplati, étiré ou grossi (`scale`, multiplicateurs [le long du regard, en travers], qui suit le regard sauf `upright`) ;
    - `HurtboxStep` : le rayon de la hurtbox multiplié par `scale`, autour de son centre.

  `CueStep`, dans `domain/Animation.ts`, est le repère où le gameplay agit : le seul step
  que les abilities connaissent, via `onCue`. Il porte les hitboxs de la
  frappe : des cercles décrits regard à droite (x vers l'avant, y vers le bas), que
  `Facing.place` pose dans le monde ; `utils/hitboxes.ts` en fournit des formes toutes faites.
  Une ability qui frappe ces hitboxs est une `StrikeAbility`. Un `Projectile` porte aussi les siennes, tournées vers
  sa trajectoire et testées à chaque frame. `touchedFighters` compte une seule fois chaque fighter de la classe visée,
  quel que soit le nombre de cercles qu'il chevauche, et émet `CombatEvent.STRIKE` : en dev,
  `debug/HitboxOverlay` affiche alors les cercles, pleins sur la frame où ils frappent puis en
  contour jusqu'à `DISPLAY_TIME`, et les corps physiques (touche H).
- `Playback` : une lecture, avancée par l'entité à chaque frame, sans import Phaser. C'est l'unique horloge des
  steps et des gestes, sans minuterie ni tween Phaser : `stop()` suffit à tout arrêter.
  `animate` fait varier les nombres d'un objet (la pose de l'arme), `during` appelle une
  fonction à chaque frame avec le temps écoulé (déplacement, frames d'arme, échelle de rendu).
- `Facing` : le regard figé au lancement, seul endroit qui décide du miroir. L'arme,
  l'entaille, le skin et le gameplay lisent le même. Deux enfants :
  - `DirectionFacing` : un cardinal, le regard des animations, miroité vers la gauche
    seulement. `rotate` donne la direction à un nombre de quarts de tour ;
  - `AngleFacing` : un angle libre, le regard d'un projectile.

  Les animations sont décrites vers la droite et symétriques : le `clockwise` et le `mirror`
  d'un geste, comme le `mirrored` d'une entaille ou le `clockwise` de `rotate`, valent vers
  la droite, le haut et le bas, et s'inversent vers la gauche.
- Validation au chargement : un premier geste sans pose de départ lève une erreur, comme des
  frames d'arme sans geste qui la tient. Le
  Preloader vérifie que chaque `Fx` a son animation.

## Les assets

- Tout ce qui se charge est décrit dans `public/assets/pack.json`, jamais en dur dans les
  scènes. Ajouter un sprite = une entrée dans le JSON.
- Les animations sont générées : `vite/animations.config.json` décrit les spritesheets
  (disposition en colonnes, en séquence, ou frames listées une à une), le plugin
  `vite/plugins/animations.ts` produit
  `public/assets/animations.json` à chaque démarrage de Vite, et `pack.json` le référence.
  Le fichier généré est gitignoré.

## Conventions

- TypeScript strict, `npm run typecheck` doit passer avant de livrer.
- Formatage Prettier (`.prettierrc`), indentation gérée par l'éditeur via
  `.vscode/settings.json`.
- Commentaires courts, en français, sans tiret cadratin. Le détail des règles est dans
  `CLAUDE.md` à la racine.
