# CLAUDE.md

Instructions pour Claude Code sur ce projet.

## Style de code

- Commentaires au plus simple : une ligne courte quand elle apporte quelque chose, jamais de pavé. Le code doit se lire sans.
- Commentaires et documentation en français, sans tiret cadratin.
- Formatage Prettier, vérification `npm run typecheck` avant de livrer.

## Projet

- Jeu Phaser 4 + Vite + TypeScript. Design dans docs/DESIGN.md, jalons dans docs/ROADMAP.md, architecture dans docs/ARCHITECTURE.md.
- `src/game/data/` : la donnée pure, catalogues d'instances et enums. Les classes métier (Technique, CharClass, Weapon, EnemyKind, Composition) vivent dans `src/game/entities/` à côté des sprites mais n'importent jamais Phaser . Les effets des techniques sont des fonctions exportées par data/techniques.ts, qui reçoivent l'entité Player (import de type uniquement).
- Assets décrits dans public/assets/pack.json ; animations générées par vite/plugins/animations.ts depuis vite/animations.config.json.
- `npm run dev` : serveur sur http://localhost:8080. Ne jamais arrêter un serveur lancé par l'utilisateur sans lui demander.

## REGLES D'OR

- Ne rien commit sans autorisations explicites de l'utilisateur
- Respect des conventions concernant le style de code
- Pas de duplication de code
- Respect de l'architecture
