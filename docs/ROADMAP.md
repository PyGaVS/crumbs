# Crumbs : roadmap

> Complète [DESIGN.md](DESIGN.md) : le design dit ce que le jeu est, la roadmap dit dans
> quel ordre on le construit. Chaque jalon répond à une question précise, se termine par
> quelque chose de jouable, et possède un critère de fin vérifiable. On ne détaille un
> jalon qu'au moment de l'attaquer : détailler trop tôt, c'est planifier sur des
> hypothèses que le jalon précédent va invalider.

## Règles de travail

- Le jeu doit rester lançable et jouable à la fin de chaque étape, même moche, même vide.
- Quand une étape tranche une question du §6 de DESIGN.md, on met le design à jour dans la
  foulée (décision + journal).
- Une étape terminée est cochée ici, avec la date si elle a appris quelque chose.

## Jalon 0 : l'arène de combat (MVP)

**Question : est-ce que se battre est fun, et est-ce qu'on se sent fort ?**

C'est le pari central du design (§2) : le combat au clavier doit porter le jeu à lui seul,
sans loot ni montée en puissance. Tout le reste attend la réponse.

**Périmètre.** Un seul écran fixe, sans génération. 2 classes et 2 armes pour vérifier
qu'une composition change vraiment la façon de jouer. 2 ou 3 ennemis conçus dès le départ
pour le combat : attaques annoncées, lisibles, à environ 10 dégâts, pas de mort au contact.
Vie et armure du design (100 PV, 30 d'armure, l'armure encaisse tout). Art placeholder
assumé.

**Hors périmètre du jalon.** Génération, biomes, score, déblocages, menus, son, DA.

### Étapes

- [ ] **0.1 Le socle de combat.** Attaque de base, dégâts, PV et armure avec leur ordre,
      un mannequin d'entraînement immobile qui encaisse. Une touche pour réinitialiser
      l'arène. HUD minimal : PV, armure, arme active.
- [ ] **0.2 Les techniques.** Système de techniques décrites en données : des instances
      dans `src/game/data/`, reliées par des enums, jamais du code par technique dans les
      scènes. Détection des séquences au clavier, affichage avec la notation du design
      (`←/→`, `↕`…). Vérifier que l'historique de
      touches du prototype (4 entrées, coupure à 250 ms) tient le rythme d'un vrai combat,
      sinon le retravailler.
- [ ] **0.3 Les armes et la bascule.** 2 armes aux sensations franchement distinctes
      (par exemple une lente à grosse zone, une rapide et courte), chacune avec ses
      techniques, et la touche de changement d'arme.
- [ ] **0.4 Les classes.** 2 classes avec leurs techniques propres, et une sélection
      rudimentaire de la composition au lancement (des touches au menu suffisent, pas
      d'interface).
- [ ] **0.5 Les ennemis.** 2 ou 3 ennemis avec des rôles distincts et des attaques
      télégraphiées (animation ou marqueur avant le coup). Ils se placent, attaquent,
      laissent des ouvertures. Premier test des situations de groupe.
- [ ] **0.6 Les sensations.** Réglage fin : vitesses, portées, délais des télégraphes,
      retours de coup (recul, flash, micro-pause à l'impact). C'est l'étape qui décide de
      la réponse à la question du jalon.

**Critère de fin.** Une session de 10 minutes dans l'arène donne envie d'y retourner ;
toutes les techniques sortent de façon fiable ; chaque coup reçu est explicable après
coup. Si ce n'est pas le cas, on itère ici, on ne passe pas au jalon 1.

## Jalons suivants (esquisse, à détailler chacun à son tour)

### Jalon 1 : le niveau

**Question : la génération produit-elle des situations justes et variées ?**
Un vrai niveau généré aléatoirement, une sortie, la recharge d'armure en fin de niveau.
C'est ici qu'on affronte les garde-fous d'équité du générateur (§6 du design).

### Jalon 2 : le run

**Question : la boucle donne-t-elle envie de relancer ?**
Enchaînement des niveaux puis des biomes, montée de difficulté, score, mort et retour au
menu. Premier vrai run de bout en bout, premier réglage du rapport nombre de niveaux / 100 PV.

### Jalon 3 : le catalogue

**Question : la variété promise est-elle réelle ?**
Menu de composition, déblocages entre les runs, classes et armes supplémentaires.

### Jalon 4 : l'habillage

**Question : quel univers ?**
Direction artistique, son, écrans. La décision d'univers (§6 du design) se prend au plus
tard ici.
