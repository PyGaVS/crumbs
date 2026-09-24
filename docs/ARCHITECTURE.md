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
    entities/             Les entités : sprites Phaser (Player…) et entités métier
                          pures (Technique, CharClass, Weapon, EnemyKind, Composition)
    data/                 La donnée pure : catalogues d'instances et enums
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
scenes ──► sprites (Player…) ──► data (catalogues) ──► entités métier ──► (rien)
```

La règle n'est pas portée par les dossiers mais par la nature des fichiers : tout ce qui
décrit le gameplay (les entités métier et `data/`) n'importe jamais Phaser.
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

## La donnée de gameplay (`data/`)

- `enums/` : un fichier par enum de chaînes (`CharClassId.NINJA`…). Ce sont les identifiants
  uniques, utilisables comme clés de texture et sérialisables pour les sauvegardes.
- Un catalogue par concept (`techniques.ts`, `charClasses.ts`, `weapons.ts`, `enemies.ts`) :
  un tableau constant d'instances plus un accesseur `getX(id)` qui échoue bruyamment sur un
  id inconnu.
- Les liens entre concepts passent par les ids (`techniqueIds: TechniqueId[]`), jamais par
  des références directes : pas d'imports circulaires.

## Les entités (`entities/`)

Deux natures cohabitent, et seule la première a le droit d'importer Phaser.

Les sprites, qui vivent dans une scène :

- `Entity` : un sprite qui avance dans une direction, rebondit sur les bords et sait
  tester une collision en rectangle.
- `Player` : le ninja. Branché sur l'historique de touches, implémente `TechniqueUser` et
  recevra une `Composition` (roadmap 0.4).
- `Phantom` et ses quatre stratégies, `Dot` : hérités du prototype, plus chargés ni
  affichés, gardés comme base pour les ennemis du jalon 0.5.

Les entités métier, instanciées par les catalogues de `data/`, sans aucun Phaser :

- `Technique` : ses variantes de séquences (dont découle la notation affichée), la
  détection `matches(history)` et l'effet `execute(user)`. `TechniqueUser` y déclare ce
  qu'une technique peut faire ; les sprites l'implémentent, c'est le pont entre les deux
  natures.
- `CharClass`, `Weapon`, `EnemyKind` : les concepts du design et leurs chiffres.
- `Composition` : l'assemblage d'un run (1 classe + 2 armes). `techniquesWith(armeActive)`
  donne le répertoire du moment.

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
