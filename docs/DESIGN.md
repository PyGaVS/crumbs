# Crumbs : principes du jeu

> Document vivant : on y écrit les **décisions** et leur **pourquoi**, pas la description
> exhaustive du code. Si une section devient fausse, on la corrige au lieu d'empiler
> des paragraphes.

## 1. Pitch

Un roguelike d'action où l'on traverse des biomes de plus en plus hostiles, et où la seule
progression réelle est celle du joueur : on survit plus longtemps parce qu'on reconnaît les
situations et qu'on sort ses combos plus proprement, jamais parce qu'on a trouvé une arme
plus forte.

## 2. Intention

**Le joueur progresse, pas le personnage.** Ce qui s'améliore d'un run à l'autre, c'est
l'exécution, les réflexes et la lecture des situations déjà vues. Un joueur qui retombe sur
une configuration d'ennemis connue doit s'en sortir mieux qu'avant, avec exactement les
mêmes capacités.

**Le joueur doit se sentir fort.** C'est la récompense visée : finir un niveau avec le
sentiment d'avoir bien joué, pas d'avoir eu de la chance ou un bon objet. La puissance
ressentie doit être attribuable au joueur lui-même, c'est précisément pour ça qu'aucune
arme ne peut la fournir à sa place.

**L'erreur coûte, mais ne condamne pas.** Un système de vie laisse une seconde chance, et
une armure qui se régénère (là où la vie, elle, ne revient pas) rend chaque coup pris
punitif sans transformer une petite faute en run perdu. Référence : _Soul Knight_.

Ce que ça exclut, et c'est l'arbitre en cas de doute : pas d'arme surpuissante, pas de
montée en statistiques qui remplace la maîtrise.

## 3. Boucle de jeu

1. Entrer dans un niveau
2. Lire la situation : l'écran montre d'un coup tous les ennemis et leur placement
3. Esquiver et frapper : attaque de base en continu, combos pour les techniques
4. Enchaîner les niveaux, puis passer au biome suivant, plus dur
5. Mourir, relancer sur des niveaux différents, et mieux gérer les situations déjà croisées

## 4. Décisions prises

| Sujet              | Décision                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| Genre              | Roguelike d'action, progression par le skill du joueur                                               |
| Structure d'un run | Plusieurs biomes, chacun composé de plusieurs niveaux                                                |
| Biome              | A son propre jeu d'ennemis et son propre terrain                                                     |
| Niveaux            | Générés aléatoirement. Rien ne s'apprend par cœur                                                    |
| Combat             | Tient entièrement sur un écran : tous les ennemis sont visibles en permanence, aucun hors-champ      |
| Déplacement        | Continu, on ne dirige que la direction, rebond sur les bords (hérité du proto)                       |
| Attaque            | Une attaque simple toujours disponible, plus des techniques spéciales via les combos                 |
| Combos             | Enchaînements au clavier, lus dans l'historique des dernières touches                                |
| Ennemis            | Intelligents et variés : chacun sa stratégie, capables de coordination et de réagir au jeu du joueur |
| Encaissement       | 100 PV qui ne se régénèrent pas, 30 d'armure qui se régénère. Un coup ennemi ôte 10 en moyenne       |
| Ordre des dégâts   | L'armure encaisse tout. Les PV ne baissent qu'une fois l'armure tombée à 0                           |
| Régénération       | L'armure se recharge à la fin de chaque niveau, jamais pendant                                       |
| Récompenses en run | Aucune. On ne ramasse rien, seul le score monte                                                      |
| Personnage         | Aucun personnage fixe : le joueur compose une **classe** et emporte **deux armes**                   |
| Classe             | Apporte ses propres techniques (ninja, robot…)                                                       |
| Armes              | Deux par run, une touche pour passer de l'une à l'autre. Chaque arme apporte ses propres techniques  |
| Composition        | Choisie avant le run, dans un menu, parmi ce qui est débloqué                                        |
| Entre deux runs    | Déblocage de nouvelles classes et de nouvelles armes, jamais de puissance                            |

### Encaisser les coups

L'armure est un bouclier : tant qu'il en reste, les PV ne bougent pas. Il faut donc d'abord
la mettre à 0 pour commencer à entamer la vie du joueur.

Avec 30 d'armure, 100 PV et des coups à 10 en moyenne, ça donne 3 coups absorbés, puis 10 de
plus pour mourir.

L'armure se recharge à la fin de chaque niveau, jamais pendant. Chaque niveau offre donc
exactement la même franchise : trois erreurs sans conséquence, la quatrième se paie en PV, et
les PV ne reviennent pas. Le joueur qui traverse un niveau proprement repart intact, celui
qui force arrive au suivant avec une réserve entamée qu'il ne récupérera plus.

Le curseur de difficulté n'est donc pas un délai de régénération mais un rapport : le nombre
de niveaux d'un run face aux 100 PV. Dix coups encaissés au-delà de la franchise et le run
est fini, peu importe à quel moment ils ont été pris.

Ce découpage sert les deux intentions du §2 à la fois : trois coups absorbés avant toute
conséquence durable, c'est la marge qui évite la frustration ; la vie qui ne revient jamais,
c'est ce qui rend chaque erreur définitivement coûteuse à l'échelle du run.

### Le personnage est une composition

Il n'y a pas de héros. Le joueur assemble une classe et deux armes, et c'est cet assemblage
qui définit sa façon de jouer : Ninja avec marteau et katana ne se joue pas comme Robot avec
les deux mêmes armes. La classe apporte ses techniques, chaque arme apporte les siennes, et
le joueur dispose donc de trois sources de techniques par run.

C'est là que vit la variété promise au §2. Elle est multiplicative : ajouter une classe ou
une arme au jeu enrichit toutes les compositions existantes, sans jamais rendre personne
plus fort. Les déblocages entre les runs alimentent ce catalogue, jamais des statistiques.

Les deux armes sont portées en même temps et une touche permet de basculer de l'une à
l'autre. Le choix du moment où l'on change devient une partie du skill, au même titre que
l'exécution des combos : la bonne arme au bon moment, y compris au milieu d'un échange.

### Comment une technique s'écrit

Les techniques sont présentées au joueur avec une notation unique, la même partout : écran
de liste, menu de composition, aide en jeu.

| Notation         | Sens                                    |
| ---------------- | --------------------------------------- |
| `←` `→` `↑` `↓`  | Cette direction précise                 |
| `←/→`            | L'une ou l'autre, au choix du joueur    |
| `↕`              | Haut et bas, quel que soit l'ordre      |
| `↔`              | Gauche et droite, quel que soit l'ordre |
| Icône d'attaque  | À définir                               |
| Icône de bascule | À définir (changement d'arme)           |

Exemple : `↓ ↓ ←/→` se lit « bas, bas, puis gauche ou droite ».

Cette notation n'est pas un détail d'interface. C'est le vocabulaire dans lequel le joueur
mémorise ses techniques, donc il doit rester identique d'une classe et d'une arme à l'autre.

### La génération interdit la mémorisation

Les niveaux sont générés aléatoirement : aucun parcours ne se retient, aucune position
d'ennemi ne s'anticipe par cœur. Le joueur ne peut donc pas progresser en apprenant un
niveau, seulement en apprenant à lire ce qu'il a sous les yeux. C'est exactement le skill
visé au §2 : des réflexes, et la reconnaissance de situations déjà rencontrées ailleurs.

Ce qui se répète d'un run à l'autre n'est pas le terrain mais le vocabulaire : les
comportements d'ennemis, leurs combinaisons, les configurations dangereuses. Le joueur
apprend ce vocabulaire, pas une carte.

Contrainte qui vient avec : le générateur ne doit jamais produire une situation
ingagnable ou injuste. Une mort doit rester la faute du joueur, sinon toute l'intention du
§2 tombe.

### Le combat tient sur un écran

Aucun ennemi n'est hors-champ pendant un affrontement. Le joueur voit toute la situation,
tout le temps : les positions, les intentions, les trajectoires. C'est ce qui rend possible
la lecture demandée à l'étape 2 de la boucle, et surtout ce qui garantit qu'une mort soit
toujours imputable au joueur, jamais à un ennemi qu'il ne pouvait pas voir venir. Une mort
injuste détruit le sentiment de force visé au §2.

### Les ennemis sont le contenu du jeu

Puisqu'on ne ramasse rien pendant un run et que la puissance du joueur ne monte pas, c'est
l'adversité qui doit porter l'intérêt. Les ennemis ne sont donc pas des obstacles mobiles
mais le cœur du design : chacun a une intention lisible (traquer, intercepter, harceler à
distance, tenir une zone…), réagit à la façon de jouer du joueur, et se combine avec les
autres pour créer des situations que le prototype ne contient pas encore.

Contrainte qui vient avec : **intelligent ne veut pas dire imprévisible**. Le joueur doit
pouvoir apprendre un comportement, le reconnaître, puis le battre : c'est le mécanisme même
de sa progression. Un ennemi qui surprend une fois est intéressant ; un ennemi qu'on ne peut
pas anticiper empêche de progresser et casse le sentiment de force visé.

## 5. Ce que le prototype fournit déjà

Le code actuel est une migration d'un exercice Python ; ces briques sont réutilisables.

| Brique                | État                                                                            |
| --------------------- | ------------------------------------------------------------------------------- |
| Historique de touches | Retient les 4 dernières, `N` inséré après 250 ms d'inactivité pour couper       |
| Combos reconnus       | `← ← →` (aller-retour) donne un boost de vitesse ; `→ ↑ → ↑` donne la diagonale |
| Déplacement           | Avance en continu, rebondit sur les bords de l'écran                            |
| Ennemis               | 4 stratégies : fonceur, intercepteur, évite-ses-alliés, erratique               |
| Difficulté            | Chaque point accélère les ennemis ; tous les 4, le joueur accélère aussi        |
| Collision             | Rectangles, mort instantanée au contact                                         |

## 6. À décider

- [ ] **L'univers.** Rien n'est tranché : ni ninja, ni espace. À écrire une fois les
      mécaniques stabilisées.
- [ ] **La durée d'un run.** « Pas trop long, pas trop court » : combien de biomes, combien
      de niveaux par biome, combien de minutes visées pour un run réussi ? Comme l'armure se
      recharge à chaque niveau, ce nombre est aussi le réglage de difficulté du jeu : c'est
      lui qui dit combien d'erreurs le joueur peut se permettre en tout.
- [ ] **Ce que la génération fait varier.** Le terrain, la composition des groupes
      d'ennemis, leur nombre, leur placement de départ ? Et dans quelles limites, pour que
      ça reste toujours gagnable ?
- [ ] **Comment garantir l'équité du générateur.** Règles de placement, distance minimale
      au joueur au démarrage, vérification qu'une sortie existe ?
- [ ] **L'armure repart-elle à 30 ?** Recharge complète à chaque niveau, ou seulement
      partielle pour qu'un run long s'use aussi de ce côté ?
- [ ] **Le débordement des dégâts.** Armure à 5, coup à 10 : les 5 restants passent-ils sur
      les PV, ou le coup est-il entièrement absorbé ? Absorber récompense le joueur qui
      encaisse au bon moment, déborder rend l'armure moins confortable.
- [ ] **Se soigner.** Les PV ne remontent jamais de tout le run, ou existe-t-il un moment
      prévu pour en récupérer (fin de biome, par exemple) ?
- [ ] **Les techniques.** Lesquelles, combien par classe et par arme, et comment le joueur
      les apprend (tutoriel, découverte, écran de liste ?).
- [ ] **Les techniques de composition.** Est-ce qu'une paire classe plus arme débloque des
      techniques qui n'existent pour aucune des deux séparément ? L'idée est gardée de côté,
      pas tranchée.
- [ ] **Le coût du changement d'arme.** Instantané, ou avec un temps d'animation qui rend
      le changement punissable ? Un changement gratuit devient une évidence, un changement
      coûteux devient une décision.
- [ ] **Les paires d'armes.** Peut-on emporter deux fois la même arme ? Certaines paires
      sont-elles interdites, ou tout est-il libre ?
- [ ] **Les séquences de touches.** Une même technique garde-t-elle la même entrée d'une
      classe à l'autre ? Si chaque classe a ses propres séquences, le joueur repart de zéro
      à chaque déblocage, ce qui va contre la progression par le skill.
- [ ] **Les icônes de la notation.** Quel symbole pour l'attaque et pour le changement
      d'arme ? Le reste de la notation est fixé, ces deux-là restent à dessiner.
- [ ] **La taille du catalogue au lancement.** Combien de classes et combien d'armes pour
      une première version jouable ?
- [ ] **La lisibilité des ennemis.** Comment un ennemi annonce-t-il ce qu'il va faire :
      animation d'attaque, son, marqueur au sol ? Sans ce signal, « intelligent » devient
      « injuste ».
- [ ] **Les boss.** Fin de biome, fin de niveau, ou pas de boss du tout ?
- [ ] **À quoi sert le score** : classement, condition de déblocage, ou simple fierté ?
- [ ] **Les commandes.** Attaque de base sur une touche dédiée ? Souris ou tout clavier ?

## 7. Périmètre

**Hors périmètre, par principe** (découle de l'intention, §2)

- Armes ou objets qui rendent significativement plus fort
- Améliorations permanentes de statistiques entre les runs
- Tout système qui laisse passer un niveau sans le jouer correctement
- Ennemis hors-champ pendant un combat
- Niveaux fixes, qui se franchiraient en les apprenant par cœur

**Hors périmètre, pour l'instant** (à rouvrir plus tard si besoin)

- Multijoueur
- Histoire, dialogues, cinématiques

## 8. Direction artistique et son

Non décidée, puisqu'elle dépend de l'univers (§6). Le pixel art du pack _Ninja Adventure_ et
le fond spatial du prototype sont des placeholders, pas un choix.

## 9. Journal des décisions

| Date       | Décision                                                       | Pourquoi                                                                               |
| ---------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 2026-08-29 | Assets et animations décrits en JSON, pas en dur dans le code  | Ajouter un personnage ne doit pas demander de toucher au code                          |
| 2026-09-21 | Roguelike où l'on progresse par le skill, pas par la puissance | C'est l'intention qui arbitre tout le reste                                            |
| 2026-09-21 | Vie non régénérable et armure régénérable                      | Rendre l'erreur punitive sans la rendre définitive (_Soul Knight_)                     |
| 2026-09-21 | Aucun ramassage pendant un run                                 | Le seul levier du joueur doit être sa propre exécution                                 |
| 2026-09-21 | Les déblocages apportent de la variété, jamais de la puissance | Sinon on progresse en jouant beaucoup, pas en jouant mieux                             |
| 2026-09-21 | Les ennemis sont intelligents, variés et coordonnés            | Sans ramassage ni montée en puissance, c'est eux qui portent l'intérêt du jeu          |
| 2026-09-21 | Le joueur doit se sentir fort                                  | C'est la récompense du skill, et la raison pour laquelle aucune arme ne doit la donner |
| 2026-09-21 | Le run est découpé en biomes, eux-mêmes découpés en niveaux    | Remplace l'idée d'étages successifs                                                    |
| 2026-09-21 | Tout le combat tient sur un écran, aucun ennemi hors-champ     | Le joueur doit pouvoir lire toute la situation pour qu'une mort soit sa faute          |
| 2026-09-21 | Un biome a son propre jeu d'ennemis et son propre terrain      | Sinon le changement de biome n'est qu'un changement de décor                           |
| 2026-09-21 | Les niveaux sont générés aléatoirement                         | Interdire la mémorisation, pour que seule la lecture de situation fasse progresser     |
| 2026-09-21 | Pas de personnage fixe : une classe plus deux armes            | La variété devient multiplicative sans qu'aucune composition soit plus forte           |
| 2026-09-21 | Les techniques viennent de la classe et de chaque arme         | Ajouter une brique enrichit toutes les compositions existantes                         |
| 2026-09-21 | Deux armes portées en même temps, avec une touche de bascule   | Choisir le bon moment pour changer d'arme devient une composante du skill              |
| 2026-09-21 | La composition se choisit avant le run, dans un menu           | Cohérent avec l'absence de ramassage pendant un run                                    |
| 2026-09-21 | 100 PV, 30 d'armure, environ 10 dégâts par coup ennemi         | Trois coups absorbés avant toute conséquence durable, treize avant la mort             |
| 2026-09-21 | L'armure encaisse tout tant qu'elle n'est pas à 0              | Rend la marge lisible : le joueur sait exactement quand il commence à payer vraiment   |
| 2026-09-21 | L'armure se recharge à la fin d'un niveau, jamais pendant      | Chaque niveau devient une épreuve à part, avec la même franchise de trois erreurs      |
| 2026-09-22 | Notation unique pour écrire les techniques au joueur           | C'est le vocabulaire dans lequel il les mémorise, il doit être stable partout          |
