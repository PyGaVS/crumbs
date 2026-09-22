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
    entities/             Les objets Phaser qui vivent dans une scène
    data/                 Les définitions de gameplay, sans aucun Phaser
    utils/input.ts        Historique de touches et détection des séquences
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
scenes ──► entities ──► data ──► (rien)
```

Chaque couche n'importe que celle d'en dessous, et `data/` n'importe jamais Phaser.
Le pont se fait par des interfaces : une technique agit sur un `TechniqueUser`
(déclaré dans `data/`), et c'est `Player`, sprite Phaser, qui implémente ce contrat.
Conséquences : les définitions se testent sans lancer le jeu, et changer de moteur ou de
scène ne touche pas au gameplay décrit dans `data/`.

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

## Les données de gameplay (`data/`)

- `enums/` : un fichier par enum de chaînes (`CharClassId.NINJA`…). Ce sont les identifiants
  uniques, utilisables comme clés de texture et sérialisables pour les sauvegardes.
- Un fichier par concept (`Technique.ts`, `CharClass.ts`, `Weapon.ts`, `EnemyKind.ts`) et
  un catalogue par concept (`techniques.ts`, `charClasses.ts`…) : un tableau constant
  d'instances plus un accesseur `getX(id)` qui échoue bruyamment sur un id inconnu.
- Les liens entre concepts passent par les ids (`techniqueIds: TechniqueId[]`), jamais par
  des références directes : pas d'imports circulaires.
- `Composition.ts` : l'assemblage d'un run (1 classe + 2 armes).
  `techniquesWith(armeActive)` donne le répertoire du moment.
- Une `Technique` porte sa séquence de touches (dont découle sa notation affichée) et son
  effet `execute(user)`.

## Les entités (`entities/`)

- `Entity` : un sprite qui avance dans une direction, rebondit sur les bords et sait
  tester une collision en rectangle.
- `Player` : le ninja. Branché sur l'historique de touches ; implémentera `TechniqueUser`
  et recevra une `Composition` (roadmap 0.2).
- `Phantom` et ses quatre stratégies, `Dot` : hérités du prototype, plus chargés ni
  affichés, gardés comme base pour les ennemis du jalon 0.5.

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
