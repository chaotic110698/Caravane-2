# Atelier de carte

`atelier-carte.html` sert à dessiner le monde de Caravane : poser les lieux sur une
carte, les relier, délimiter les contrées, et fixer l'échelle des distances.

## L'ouvrir

**Depuis le web, sans rien installer.** GitHub Pages sert tout le dépôt, donc l'atelier
est en ligne avec le jeu :

    https://chaotic110698.github.io/Caravane-2/outils/atelier-carte.html

C'est la façon la plus simple, et elle suit les mises à jour toutes seule.

**Ou par double-clic.** Sur GitHub, ouvrez `outils/atelier-carte.html` et cliquez
« Download raw file » (l'icône ⤓ en haut à droite du fichier) — ou clonez le dépôt.
Puis double-cliquez le fichier téléchargé.

Contrairement au jeu, l'atelier **fonctionne parfaitement en `file://`** : il ne va
chercher aucun fichier, donc rien à servir. La sauvegarde du travail, la persistance de
l'image de fond et l'export sont vérifiés dans ce mode.

Aucune dépendance, aucune installation, aucun compte. **Rien ne sort de votre
machine** : l'image de fond et le travail en cours restent dans le navigateur.

> **Le jeu ne lit pas encore ce fichier.** L'atelier définit le monde que le moteur
> consommera ; l'adaptation du moteur est un chantier séparé, décrit en fin de page.

## En bref

| | |
|---|---|
| **Se déplacer** | le **clic molette** maintenu, <kbd>Espace</kbd> tenue avec le clic gauche, ou deux doigts |
| **Zoomer** | la molette |
| **Poser un lieu** | outil <kbd>L</kbd>, puis cliquer |
| **Relier deux lieux** | outil <kbd>R</kbd>, cliquer l'un puis l'autre |
| **Délimiter une contrée** | outil <kbd>F</kbd>, cliquer les sommets, <kbd>Entrée</kbd> pour fermer |
| **Fixer l'échelle** | outil <kbd>E</kbd>, deux points, puis saisir la distance réelle |
| **Défaire / refaire** | <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd>, 80 pas en arrière |
| **Tout voir** | <kbd>0</kbd> |

**Le clic gauche ne déplace jamais la carte** : il sélectionne, il pose, il trace — et
sur le vide il désélectionne. Le déplacement de la vue est au clic molette, qui marche
quel que soit l'outil et quoi qu'il y ait sous le curseur. La barre d'espace tenue fait
la même chose, pour les machines sans bouton du milieu.

Le travail est sauvegardé tout seul dans le navigateur, et l'image de fond avec lui :
rouvrez la page, tout est là. Fermer l'onglet en plein travail ne coûte rien non plus,
l'écriture est forcée au moment où la page part. **Exportez** quand même régulièrement —
un navigateur qu'on nettoie emporte sa mémoire.

## L'étalon, à poser en premier

Sans lui, aucune distance n'est calculable et l'atelier ne peut rien vous dire des
trajets. Tracez un trait entre deux points dont vous connaissez l'écart — une échelle
déjà dessinée sur votre carte, ou deux villes dont vous décidez qu'elles sont à
tant de lieues — puis saisissez la distance. Tout le reste en découle.

Une lieue vaut 4,82 km, et le convoi de départ avance de 15 km par jour : c'est avec
ces deux nombres que l'atelier convertit les pixels en étapes de voyage.

## Les cinq rangs de lieu

| rang | marqueur | rôle attendu dans le jeu |
|---|---|---|
| **Capitale** | grand disque à noyau | le plus gros marché, les pièces exclusives, l'arme de légende |
| **Ville** | disque | marché complet |
| **Village** | petit disque | marché réduit |
| **Hameau** | point | halte, peu ou pas de commerce |
| **Poste frontière** | losange bleu | le seul endroit par où l'on change de contrée |

Un lieu prend la couleur de sa contrée ; le poste frontière garde la sienne pour se
repérer d'un coup d'œil.

## Les voies et le terrain

Une voie est un trait droit entre deux lieux. Elle porte un **terrain**, et le terrain
décide de tout le reste : à partir de la distance à vol d'oiseau, l'atelier calcule les
trois façons de faire le trajet.

| terrain | détour | rudesse | risque |
|---|---|---|---|
| Plaine | ×1,00 | ×1,00 | ×1,00 |
| Forestier | ×1,08 | ×1,15 | ×1,25 |
| Montagneux | ×1,28 | ×1,45 | ×1,15 |
| Marécageux | ×1,18 | ×1,35 | ×1,30 |

Ces facteurs multiplient les trois profils de route repris du jeu :

| profil | détour | risque | rudesse |
|---|---|---|---|
| Sécurisé | ×1,30 | ×0,50 | ×0,72 |
| Normal | ×1,00 | ×1,00 | ×1,00 |
| Dangereux | ×0,78 | ×1,60 | ×1,35 |

Sélectionnez une voie : l'atelier affiche les trois chemins en lieues et en étapes.
C'est là qu'on équilibre un monde — un trajet de plus de dix étapes est très long pour
une partie, un trajet de deux est presque gratuit.

**Une traversée de frontière est simplement une voie entre deux postes de contrées
différentes.** Vous décidez donc vous-même quelles contrées communiquent, et l'atelier
vous avertit si une voie franchit une frontière sans passer par deux postes.

## Les contrôles

Le panneau signale au fil de l'eau ce qui empêcherait le monde de tourner : une contrée
sans poste frontière où l'on ne pourrait jamais entrer, un lieu qu'aucune voie ne
dessert, une région coupée du reste du monde, une voie qui passe sur une ville tierce,
deux noms qui se chevauchent. Les avertissements en rouge bloquent, ceux en or sont
cosmétiques.

## Le fichier exporté

`monde.json`. Coordonnées en pixels de l'image de fond ; changer d'image pour une autre
résolution rééchelonne tout automatiquement.

```json
{
  "format": "caravane.carte.v1",
  "carte":  { "fichier": "monde.png", "largeur": 4000, "hauteur": 3000 },
  "etalon": { "a": {"x":100,"y":100}, "b": {"x":900,"y":100},
              "distance": 100, "unite": "lieues" },

  "contrees": [
    { "cle": "humain", "nom": "Terres humaines", "gentile": "humaine",
      "teinte": "#C9A227",
      "frontiere": [ {"x":60,"y":60}, {"x":760,"y":60}, {"x":760,"y":520} ] }
  ],

  "lieux": [
    { "cle": "aurelium", "nom": "Aurelium", "contree": "humain",
      "rang": "capitale", "x": 260, "y": 200,
      "etiq": { "pos": "dessus" } }
  ],

  "voies": [
    { "cle": "aurelium--bas-ferrant", "de": "aurelium", "vers": "bas-ferrant",
      "terrain": "plaine",
      "calcul": [ { "cle": "securise", "nom": "Sécurisé", "detour": 1.3,
                    "risque": 0.5, "rudesse": 0.72,
                    "lieues": 42, "km": 202, "etapes": 14 } ] }
  ],

  "rangs":   { "capitale": { "nom": "Capitale", "r": 9, "teinte": "#C9A227" } },
  "terrains":{ "plaine":   { "nom": "Plaine", "detour": 1, "rudesse": 1, "risque": 1 } },
  "profils": [ { "cle": "normal", "nom": "Normal", "detour": 1, "risque": 1, "rudesse": 1 } ],
  "mesures": { "kmParLieue": 4.82, "kmParJour": 15, "lieuesParPixel": 0.125 }
}
```

| clé | rôle |
|---|---|
| `carte` | nom et dimensions de l'image sous laquelle les coordonnées ont un sens |
| `etalon` | deux points et leur écart réel — la seule source de l'échelle |
| `contrees[].cle` | identifiant, référencé par `lieux[].contree` |
| `contrees[].frontiere` | sommets du polygone de délimitation, vide si non tracée |
| `lieux[].cle` | identifiant, référencé par `voies[].de` et `voies[].vers` |
| `lieux[].rang` | `capitale`, `ville`, `village`, `hameau` ou `poste` |
| `lieux[].etiq.pos` | où poser le nom : `dessus`, `dessous`, `gauche`, `droite` |
| `voies[].terrain` | `plaine`, `forestier`, `montagneux` ou `marecageux` |
| `voies[].calcul` | les trois profils déjà calculés — pratique à relire, recalculable à volonté |
| `rangs`, `terrains`, `profils`, `mesures` | les tables de référence, embarquées pour que le moteur lise exactement les mêmes chiffres |

`calcul` est une commodité, pas une source : il se recalcule depuis `etalon`, `terrains`
et `profils`. Si vous éditez le JSON à la main, corrigez le terrain et laissez l'atelier
recalculer.

## Ce qu'il reste à faire côté moteur

Le monde que produit l'atelier est plus riche que celui que `index.html` sait lire
aujourd'hui. L'adaptation demandera :

- **abandonner `PAR_CONTREE`** — le moteur suppose 3 contrées de 6 lieux exactement,
  et le vérifie à l'ouverture d'une sauvegarde ; les parties en cours ne survivront pas ;
- **remplacer le graphe complet par le réseau de voies** — aujourd'hui `relies()` déclare
  toute paire de cités d'une même contrée reliée, et `distance()` mesure à vol d'oiseau ;
  avec un vrai réseau il faut un plus court chemin, et les trajets peuvent demander
  plusieurs tronçons ;
- **cinq rangs au lieu de deux** — capitale et poste existent, ville, village et hameau
  sont neufs et doivent moduler la taille des marchés ;
- **le terrain** — inconnu du moteur, il remplacera les trois profils fixes de
  `data/routes.json` ;
- **le monde fixe** — `creerMonde()` invente aujourd'hui les noms et tire les types au
  sort à chaque partie ; il lira désormais le fichier.

C'est le gros du chantier, et il vient après : l'atelier peut servir dès maintenant, et
c'est lui qui définit la cible.
