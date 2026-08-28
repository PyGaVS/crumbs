# 👾 Pac-man space

Portage web en **TypeScript + Phaser 4** du jeu [pac-man-space-python](../pac-man-space-python) (Python / Arcade), réalisé dans le cadre d'un apprentissage en CDA.

Le joueur contrôle Pac-man pour éviter les fantômes et récupérer un maximum de pac-gommes, avec une difficulté croissante.

## 🚀 Fonctionnalités

- Chaque fantôme possède son propre comportement :
    - **Blinky :** suit le joueur
    - **Pinky :** essaie de bloquer la route au joueur
    - **Inky :** suit le joueur mais évite les autres fantômes
    - **Clyde :** bouge aléatoirement et tend à aller vers le centre
- Chaque pac-gomme augmente le score et légèrement la vitesse des fantômes (et du joueur toutes les 4)
- Animation des fantômes et de Pac-man, yeux orientés selon la direction
- Le joueur se déplace avec les flèches du clavier et peut réaliser des inputs spéciaux :
    - **→ ↑ → ↑ (ou autre diagonale) :** déplacement en diagonale avec un léger boost de vitesse
    - **← ← → (ou autre séquence) :** déplacement plus rapide

## 🛠️ Commandes

| Commande            | Description                                              |
|---------------------|----------------------------------------------------------|
| `npm install`       | Installe les dépendances                                 |
| `npm run dev`       | Serveur de développement sur http://localhost:8080       |
| `npm run build`     | Build de production dans `dist/`                         |
| `npm run preview`   | Sert le build de production en local                     |
| `npm run typecheck` | Vérifie les types sans compiler                          |

## 📁 Structure

| Chemin                    | Rôle                                                        |
|---------------------------|-------------------------------------------------------------|
| `src/game/main.ts`        | Configuration et démarrage de Phaser                        |
| `src/game/core/`          | Constantes du jeu (`settings.ts`)                           |
| `src/game/entities/`      | `Entity`, `Player`, `Phantom` et les 4 fantômes, `Dot`      |
| `src/game/utils/`         | Historique des touches et détection des combos (`input.ts`) |
| `src/game/scenes/`        | Scènes Phaser (équivalent des `views/` Python)              |
| `public/assets/`          | Spritesheets et fond                                        |

## 🔮 Améliorations possibles

- Ajouter une vue d'aide affichant les contrôles et les combinaisons spéciales.
- Intégrer un système d'attaque permettant de vaincre les fantômes.
- Créer un téléporteur pour traverser les bords de l'écran.
- Ajouter des items bonus donnant des avantages temporaires.
- Sauvegarder en ligne le score du joueur, un leaderboard et des statistiques globales.

## ⚖️ Licence

Le code source est sous licence MIT (voir `LICENSE`).
Projet de fan non officiel, sans but lucratif — Pac-Man est une marque de Bandai Namco Entertainment.
