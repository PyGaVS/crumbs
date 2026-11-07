# Crumbs

Roguelike d'action en **TypeScript + Phaser 4**. On traverse des biomes de plus en plus hostiles, et la seule progression est celle du joueur : aucune arme plus forte, aucune montée en statistiques, seulement l'exécution et la lecture des situations.

Le personnage n'existe pas : le joueur compose une **classe** et emporte **deux armes**, chacune apportant ses propres techniques, déclenchées par des combos au clavier.

## Lancer le jeu

```bash
npm i
npm run dev
```

## Contrôles

| Touche  | Action                                   |
| ------- | ---------------------------------------- |
| Flèches | Déplacement                              |
| `A`     | Attaque                                  |
| `S`     | Changement d'arme                        |
| `H`     | Affiche les hitboxs (`npm run dev` seul) |

## Documentation

| Document                                | Contenu                                      |
| --------------------------------------- | -------------------------------------------- |
| [DESIGN.md](docs/DESIGN.md)             | Ce que le jeu est : intentions et décisions  |
| [ROADMAP.md](docs/ROADMAP.md)           | Dans quel ordre on le construit : les jalons |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Comment le code est organisé et pourquoi     |

## Licence

MIT, voir [LICENSE](LICENSE).
