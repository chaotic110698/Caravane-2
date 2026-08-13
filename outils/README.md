# Les outils d'auteur

| | |
|---|---|
| [`atelier-carte.html`](atelier-carte.html) | dessiner le monde : les lieux, les voies, les contrées, l'échelle |
| [`atelier-evenements.html`](atelier-evenements.html) | écrire les événements : la situation, les choix, ce qu'ils font |
| [`atelier-personnages.html`](atelier-personnages.html) | écrire les gens : qui ils sont, et ce qu'on apprend d'eux à force |
| [`atelier-objets.html`](atelier-objets.html) | écrire les objets uniques : ce qu'ils font, d'où ils viennent, ce qu'ils cachent |
| [`atelier-missions.html`](atelier-missions.html) | écrire les missions : qui les donne, ce qu'il faut faire, ce qu'elles rapportent |
| [`atelier-dialogues.html`](atelier-dialogues.html) | écrire les conversations : répliques, réponses branchées, conditions |
| [`atelier-icones.html`](atelier-icones.html) | dessiner les icônes : six formes, une teinte, et le SVG qui en sort |
| [`index.html`](index.html) | le hub : les sept ateliers, et deux boutons vers le reste |
| [`sauvegarde.html`](sauvegarde.html) | emporter son travail d'un appareil à l'autre, et livrer les fichiers au jeu |
| [`tutoriels.html`](tutoriels.html) | les modes d'emploi, en cinq onglets, avec les six pages engendrées mises en page |
| [`TUTORIEL-EVENEMENTS.md`](TUTORIEL-EVENEMENTS.md) | ce que fait chaque effet, en français — engendré, jamais écrit à la main |
| [`TUTORIEL-PERSONNAGES.md`](TUTORIEL-PERSONNAGES.md) | les rôles, ce qui fait mériter une couche de lore — engendré aussi |
| [`TUTORIEL-OBJETS.md`](TUTORIEL-OBJETS.md) | les genres, les pouvoirs, les provenances — engendré aussi |
| [`TUTORIEL-MISSIONS.md`](TUTORIEL-MISSIONS.md) | les jalons, les récompenses, le lien avec les gens — engendré aussi |
| [`TUTORIEL-ICONES.md`](TUTORIEL-ICONES.md) | les six formes, les dix teintes, ce qui se voit à seize pixels — engendré aussi |
| [`TUTORIEL-DIALOGUES.md`](TUTORIEL-DIALOGUES.md) | écrire une conversation : répliques, réponses, souvenirs — engendré aussi |
| `commun.js` | la machinerie partagée, recopiée dans chaque atelier |
| `construire.mjs` | refabrique les tutoriels, les catalogues et la machinerie embarqués |
| `exporter-ateliers.mjs` | recopie les fichiers construits vers le dépôt `Caravane-Tool` |

Les six ateliers s'ouvrent **d'un double-clic**. Aucune installation, aucun compte,
aucune dépendance, et **rien ne sort de votre machine** : tout reste dans le navigateur
jusqu'à ce que vous exportiez.

> Chaque atelier est un fichier unique et autonome, mais le code n'existe qu'en un
> exemplaire : `construire.mjs` recopie `commun.js` et les catalogues dans chacun. C'est
> pour ça qu'il faut le relancer après avoir touché à l'un ou à l'autre.

## Le bandeau, sur le bord droit

Les dix pages portent le même tiroir, posé par `commun.js` : une poignée sur le bord
droit, qui annonce au passage combien d'éléments le dépôt contient. Il ouvre **ce que
vous avez écrit** — le codex et la charpente, avec la recherche et le bouton *Ouvrir*
qui rouvre chaque élément dans l'atelier qui l'a fait — et une rangée de pastilles qui
**passe d'un outil à l'autre** sans repasser par le hub.

C'est ce qui permet de vérifier une clé de lieu depuis l'atelier de dialogues, ou de
relire le nom d'un personnage en écrivant une mission, sans quitter ce qu'on fait.
<kbd>Échap</kbd> le referme.

Le hub n'en tient donc plus copie : il montre les sept ateliers, et deux boutons — la
**sauvegarde** et les **modes d'emploi** — chacun sur sa page.

## Le dépôt partagé

Servis depuis la même adresse, les six ateliers partagent un même `localStorage`, et
l'on y tient **une seule réserve** — le monde, les personnages, les objets, les
missions, les événements, les icônes. La distinction qui fait tout marcher : le
**contenu** est commun, et l'**état de travail** — quel élément est ouvert, le filtre,
le convoi d'essai — reste privé à chaque atelier.

Un personnage écrit dans son atelier est donc aussitôt proposé par celui des missions,
sans qu'on exporte ni recharge quoi que ce soit. Les anciennes sauvegardes, une par
atelier, sont reprises au premier chargement.

Le hub porte deux vues du même dépôt. Le **codex** range tout par catégorie, avec pour
chaque élément un lien `atelier-X.html#cle=…` qui le rouvre là où il a été écrit. La
**charpente** montre ce qui ouvre quoi.

## La charpente

Les missions et les conversations forment déjà un réseau sans qu'on ait rien ajouté au
format. `depotCharpente()` le relit et en tire un arbre : ce qui n'attend rien est en
haut, et l'on descend vers ce que cela ouvre.

Les arêtes viennent d'ici, et de nulle part ailleurs :

| ce qui relie | d'où ça se lit |
|---|---|
| une conversation **confie** une mission | un effet `mission` dans une réplique ou une réponse |
| une mission **accomplie** ouvre une conversation | `si: missionEtat` valant `faite`, `ratee` ou `cours` |
| un **souvenir** relie deux conversations | l'une le pose par un effet `souvenir`, l'autre l'attend dans son `si` |
| **porter un objet** ouvre une conversation | `si: objetPorte`, remonté jusqu'à la mission qui donne l'objet |
| une **couche déliée** en ouvre une | `si: coucheOuverte`, remonté à ce qui la délie |
| une conversation **après** une autre | `si: dialogueVu` |

`si: missionEtat` valant `offerte` ne crée **pas** d'arête : cette conversation vient
*avant* la mission, elle ne l'attend pas. C'est dit sur la ligne.

Les objets, les lieux et les couches ne sont pas des nœuds — ils restent en mention.
Un objet sert quand même de fil, et son nom s'écrit sur l'arête.

Ce n'est pas un arbre au sens strict : deux chemins peuvent converger, et rien
n'interdit une boucle. On le rend lisible en ne développant chaque nœud qu'une fois ;
ailleurs il paraît en renvoi. Les boucles sont dites plutôt que suivies.

Les trous que la charpente signale : une mission que personne ne peut donner, un
souvenir attendu que rien ne pose, un personnage sans lieu qui porte pourtant des
conversations, une clé qui pointe dans le vide, et un cycle fermé.

Côté code, tout passe par cinq fonctions de `commun.js` : `depotLire`, `depotEcrire`,
`sectionEst` (l'atelier déclare la section qu'il tient), `suivreDepot` (un autre onglet
a écrit) et `depotCodex` (la liste plate que le hub affiche). Ajouter une catégorie au
codex, c'est ajouter une ligne au tableau `CATEGORIES`.

## Les rôles sont une liste ouverte

Quinze rôles arrivent avec le jeu, dans `data/vocabulaire-personnages.json`. On en
ajoute autant qu'on veut depuis la fiche d'un personnage, sans quitter l'atelier : les
vôtres tiennent leur propre section du dépôt, `roles`, parce qu'un rôle survit au
personnage qui l'a fait naître.

Un rôle porte un **nom**, un **féminin** et une phrase d'**explication**. Le féminin est
déclaré, jamais deviné : *échevin* fait *échevine*, mais *guide* ne prend pas de e — un
champ vide veut dire « le même des deux côtés ». C'est ce qui permet d'écrire `{role}`
une fois dans un texte et de le voir s'accorder sur l'accord du personnage.

La clé se fabrique depuis le nom (`slug()` : minuscules, sans accent, tirets). Renommer
un rôle change sa clé, et les personnages qui le portaient suivent.

Les rôles n'ont **pas de fichier à eux** : `contenuDuJeu('personnages', …)` glisse dans
`personnages.json` une carte `roles` limitée à ceux dont les personnages se servent. Le
jeu la lit dans `ROLES` et s'en sert pour `{role}` — auparavant `sacGens()` renvoyait
`role:''`, et le trou sortait vide.

## L'atelier de dialogues

Une conversation appartient à quelqu'un, se compose de répliques nommées, et chaque
réponse mène ailleurs ou clôt l'échange. Trois choses demandent du soin, et ce sont les
trois que l'atelier surveille :

- **le personnage** se choisit dans une liste qui vient du dépôt, avec son lieu à côté ;
  l'onglet *Personnages* les montre tous, avec le nombre de conversations qu'ils portent
  et un bouton *Confier* ;
- **les réponses** se branchent par une liste des répliques existantes, et *+ Nouvelle*
  en crée une et y mène d'un coup — c'est ainsi qu'on écrit une conversation, de proche
  en proche. Renommer une réplique emmène avec elle tout ce qui y menait ;
- **les conditions** se disent en français. Pour « quand la mission est accomplie »,
  on prend *Où en est une mission*, on choisit la mission dans le carnet, et l'état dans
  une liste — *pas encore acceptée*, *en cours*, *accomplie*, *échouée*. Le résumé
  s'écrit en tête de bloc : « Le registre raturé » est accomplie.

L'onglet **Le fil** montre toute la conversation d'un coup d'œil, la réplique de départ
bordée d'or et les injoignables en rouge. L'onglet **Aperçu** la joue pour de faux : on
suit les branches sans rien appliquer, et une réponse conditionnée dit ce qui la ferme.

Les contrôles refusent une réponse qui mène nulle part, une réplique que personne
n'atteint, une mission absente du carnet, une couche de lore qui n'existe pas, un trou
de texte inconnu, et signalent une condition sans raison — elle serait *cachée* plutôt
que grisée, et le joueur ne saurait jamais qu'elle existait.

## Les propriétés se posent sur la carte

L'outil **Propriété** de l'atelier de carte pose un terrain là où l'on clique, et le
rattache au lieu le plus proche — c'est de cette ville qu'on le gérera en jeu. L'encart
de droite règle tout ce qui sert à équilibrer : le tarif du terrain nu, puis pour chacun
des quatre bâtiments son or, ses matériaux à apporter et sa capacité. Décocher un
bâtiment le rend impossible sur ce terrain-là.

Les propriétés vivent dans leur propre section du dépôt, `proprietes`, à part du monde :
elles ont leur fichier de jeu, `proprietes.json`, même si c'est sur la carte qu'on les
pose. Le réseau des voies les ignore — un terrain n'est pas une étape.

## Les deux sortes de sauvegarde

Elles ne servent pas à la même chose, et les confondre coûte du travail.

**La sauvegarde d'atelier** — `caravane-atelier-AAAA-MM-JJ.json`, tout le dépôt dans un
fichier, plus l'état de travail de chaque outil. C'est le fichier qui voyage : on le
prend sur l'ordinateur, on le reprend sur le téléphone, et l'on continue où l'on s'était
arrêté. Elle **ne se dépose pas** dans `data/`. À la reprise, le hub montre d'abord ce
que le fichier contient, puis propose deux gestes :

- **fusionner** — à clé égale la sauvegarde l'emporte, et ce qu'elle ignore reste ; c'est
  ce qu'il faut quand on a travaillé les missions dans le train et la carte à la maison ;
- **remplacer** — ce que le navigateur contient est jeté, y compris les sections absentes
  du fichier.

L'image de fond de la carte n'y est pas : trop lourde pour un JSON. On la redépose à la
main sur l'autre appareil, et les lieux retombent dessus.

**Les fichiers du jeu** — une section à la fois, sous le nom exact qu'attend `data/` :
`monde.json`, `personnages.json`, `objets.json`, `missions-ecrites.json`,
`evenements.json`, `icones.json`. Le tableau `FICHIERS_JEU` de `commun.js` en est la
seule source, et l'atelier de missions s'en sert aussi pour son propre bouton
*Exporter* — sans quoi il écrirait `missions.json`, qui est déjà pris dans `data/` par
ce qui habille les contrats tirés au sort.

---

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

> **Le jeu lit ce fichier.** Déposez votre `monde.json` dans `data/` et la partie s'y
> déroule : les lieux, les voies, les distances, les cinq rangs. S'il est absent, le moteur
> invente son monde comme avant — rien ne casse.

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

## La nature d'un lieu, à côté de son rang

Le rang dit la **taille**, la nature dit **ce que c'est** — et les deux se cumulent :

| nature | pastille |
|---|---|
| **Port** | disque bleu, deux vagues |
| **Ville souterraine** | disque gris, bouche de tunnel |

Un lieu peut en porter plusieurs, ou aucune. C'est volontairement un second axe :
une capitale portuaire, un hameau de pêcheurs et une cité naine creusée sous la
montagne sont trois choses différentes, et les enfermer dans la même liste que
capitale/ville/village aurait interdit d'écrire « capitale portuaire ».

Les pastilles se cochent dans le panneau, sous **Nature**.

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
      "rang": "capitale", "traits": ["port"], "x": 260, "y": 200,
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
  "traits":  { "port": { "nom": "Port", "teinte": "#4A7BC8" } },
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
| `lieux[].rang` | la taille : `capitale`, `ville`, `village`, `hameau` ou `poste` |
| `lieux[].traits` | la nature, cumulable : `port`, `souterrain` — liste vide si rien |
| `lieux[].etiq.pos` | où poser le nom : `dessus`, `dessous`, `gauche`, `droite` |
| `voies[].terrain` | `plaine`, `forestier`, `montagneux` ou `marecageux` |
| `voies[].calcul` | les trois profils déjà calculés — pratique à relire, recalculable à volonté |
| `rangs`, `traits`, `terrains`, `profils`, `mesures` | les tables de référence, embarquées pour que le moteur lise exactement les mêmes chiffres |

`calcul` est une commodité, pas une source : il se recalcule depuis `etalon`, `terrains`
et `profils`. Si vous éditez le JSON à la main, corrigez le terrain et laissez l'atelier
recalculer.

## Plusieurs cartes qui communiquent

L'atelier travaille sur **autant de cartes qu'on veut** : le monde d'un côté, l'intérieur
d'une cité de l'autre, chacune avec son fond, son étalon et son allure. Les onglets sous
la barre d'outils passent de l'une à l'autre (<kbd>Tab</kbd> aussi), **+ Carte** en ajoute
une, et l'outil **Passage** les relie. C'est le format `v2`, et c'est ce que l'atelier
exporte désormais.

**Poser un passage** — choisissez l'outil Passage, cliquez le lieu de départ, changez
d'onglet (les autres cartes se signalent en pointillé), cliquez le lieu d'en face. Un
passage n'a pas de longueur mesurable — ses deux bouts sont sur deux images sans rapport —
alors on la **déclare**, en lieues, dans le panneau de sélection. Donnez le rang **poste
frontière** à au moins un des deux bouts : c'est ainsi que le jeu le dessine en porte.

### Ce qu'on sait d'un lieu

Dans le panneau d'un lieu, **Ce qu'on en sait** décide de trois états.

| | |
|---|---|
| **Connu, sans plus** | le lieu ordinaire : accessible dès qu'une voie connue y mène |
| **Connu dès le départ** | une des cités que le marchand connaît en commençant. Marquez-en cinq environ ; sans aucune marque, le jeu prend les capitales |
| **Caché — à trouver au cap** | le lieu n'est ni sur la carte, ni dans les itinéraires. Il n'existe pour le joueur qu'une fois trouvé |

Un lieu caché ne se trouve qu'en donnant, sur l'onglet **Boussole** du jeu, le cap exact
qui y mène depuis la cité où l'on se tient. **Ce cap n'est écrit nulle part** : c'est
l'angle réel entre les deux points — zéro au nord, quatre-vingt-dix à l'est, dans le sens
des aiguilles. Poser le lieu sur la carte suffit donc à décider du chiffre, et l'atelier
vous le donne sous le menu : *« Vaulmier → 143° »*. C'est ce nombre-là que vous mettez
dans la bouche d'un personnage.

**Aucune tolérance** : 143 ouvre la piste, 142 ne dit rien — et le jeu ne prévient pas
qu'on est passé à un degré près. Si deux lieux cachés se présentent au même degré depuis
la même cité, l'atelier vous le signale en rouge : déplacez-en un.

**Le premier voyage** se fait à vol d'oiseau, par une piste sans chemin au choix, avec
deux fois plus d'agressions qu'ailleurs. Ensuite, tout dépend de qui tient la plume :

- **sans cartographe** dans la troupe, rien n'est noté. La piste s'efface dès qu'on
  repart, et il faut redonner le cap la fois suivante.
- **avec un cartographe**, arriver là-bas l'inscrit sur la carte pour de bon, et les trois
  itinéraires ordinaires s'ouvrent.

Le **cartographe** et le **comptable** sont deux métiers d'escorte comme les autres : on
les embauche à la Troupe, ils touchent leur solde à chaque arrivée. Ils se battent mal, et
on ne les touche qu'une fois le dernier homme d'armes tombé — perdre son comptable dans
une embuscade est donc le prix de n'avoir gardé personne pour le défendre.

### Faire parler quelqu'un d'un cap

Personne ne connaît un cap en entier. Dans l'atelier d'événements ou de dialogues, l'effet
**Dire un morceau de savoir** livre un bout de ce que quelqu'un sait — et le bout se
calcule à l'instant où la phrase se dit, depuis la carte réelle. **Vous n'écrivez jamais
un chiffre** : déplacer le lieu change ce qu'on en dit, sans que rien ne se désaccorde.

Un cap se lit sur trois chiffres — 045, 130, 287 — et se coupe en trois morceaux :

| morceau | pour 130 | ce qu'on peut en faire dire |
|---|---|---|
| **début** | `1` | « Je crois que ça commence par 1. » |
| **milieu** | `3` | « Il y a un 3 dedans, ça j'en suis sûr. » |
| **fin** | `30` | « La fin, c'est 30. Enfin, je crois. » |

Le **début** plus la **fin** refont le cap entier : il faut donc au moins deux bouches, et
l'on peut en mettre trois. Vous écrivez la phrase avec un trou — `{bout}` — et le jeu y
glisse le chiffre.

Cochez **C'est un mensonge** et le morceau donné sera faux : même longueur, même place,
impossible à distinguer d'un vrai. Le joueur ne l'apprendra qu'en suivant le cap et en ne
trouvant rien.

Le jeu ne retient rien de tout cela. Il ne note pas la rumeur, ne dit pas si elle était
vraie, ne recoupe pas les morceaux. C'est au joueur de tenir ses pages — le carnet a
quarante pages pour ça.

> À ne pas confondre avec **Lancer une rumeur de prix**, qui existait déjà : celle-là fait
> réellement monter le prix à l'arrivée. Celle-ci ne fait que parler.

### Ce qu'une voie exige

Sous les mesures, le bloc **Ce que la voie exige** ajoute des conditions à n'importe
quelle voie — passage ou route ordinaire. Sans condition, on passe librement ; sur un
passage sans condition, le jeu demande la **douane** d'autrefois, un droit en or qui monte
avec le voyage. Dès qu'une condition est posée, c'est elle qui décide.

| condition | ce qu'elle demande |
|---|---|
| **Un droit en or** | une somme, prélevée au départ |
| **Un objet à montrer** | la clé d'un objet de votre atelier d'objets ; il reste en soute |
| **Un laissez-passer** | un papier délivré par un personnage — la clé doit être la même des deux côtés |
| **Une réputation** | un karma minimum, maximum, ou les deux |
| **Un convoi assez grand** | un nombre de chariots |
| **Une escorte assez nombreuse** | un nombre de gardes |
| **Une saison** | les mois du calendrier pendant lesquels la voie est praticable |

Elles s'empilent : **toutes** doivent être tenues. Le champ du bas, **ce qu'on vous
répond quand on vous refuse**, est la phrase que le joueur lira sur la carte du chemin —
« Le sergent secoue la tête sans lever les yeux. » Ce qui manque s'affiche à côté, et le
bouton reste éteint : on ne s'engage jamais sans savoir.

Un **laissez-passer** ou un objet à ce pouvoir dispense de ce qui s'achète ou se montre —
jamais de ce que la saison ou la taille du convoi imposent. Un papier n'ouvre pas un col
enneigé.

**Délivrer un laissez-passer** se fait ailleurs : dans l'atelier d'événements ou de
dialogues, l'effet *Délivrer un laissez-passer* remet le papier au marchand, avec la même
clé que la frontière réclame. Il s'inscrit au carnet du joueur, avec le jour et le lieu où
il a été délivré, et ne se perd pas.

Un **quartier fermé** (l'idée 8) est un passage avec un laissez-passer ou du karma pour
condition ; une **contrée où l'on ne va pas seul** (l'idée 14) est un passage avec un
nombre de chariots. C'est la même case à remplir.

```json
{
  "format": "caravane.carte.v2",
  "cartes": [
    { "cle": "monde",   "nom": "Les Terres connues",     "fichier": "monde.png",
      "largeur": 4000, "hauteur": 3000, "kmParJour": 15,
      "etalon": { "a": {"x":100,"y":100}, "b": {"x":900,"y":100},
                  "distance": 100, "unite": "lieues" } },
    { "cle": "la-cite", "nom": "La Cité aux mille portes", "fichier": "cite.png",
      "largeur": 3000, "hauteur": 2000, "kmParJour": 6,
      "etalon": { "a": {"x":0,"y":0}, "b": {"x":600,"y":0},
                  "distance": 26, "unite": "lieues" } }
  ],
  "contrees": [
    { "cle": "quartiers", "nom": "Quartiers de la Cité", "carte": "la-cite" }
  ],
  "lieux": [
    { "cle": "aurelium", "carte": "monde",   "rang": "capitale", "traits": ["port"] },
    { "cle": "bas-port", "carte": "la-cite", "rang": "poste" }
  ],
  "voies": [ { "de": "aurelium", "vers": "bas-port", "terrain": "plaine" } ]
}
```

Trois choses seulement changent par rapport à `v1` :

| | |
|---|---|
| `cartes` | une liste au lieu d'un seul objet `carte`, chacune avec son échelle et son `kmParJour` |
| `lieux[].carte` | à quelle carte le lieu appartient |
| `contrees[].carte` | idem — une contrée vit sur une carte |

Le reste suit tout seul. **Une voie entre deux lieux de cartes différentes est un
passage** : le moteur le traite comme une frontière, avec sa douane, et l'écran de carte
ne dessine que la carte où l'on se trouve.

Et le `kmParJour` fait son office : dans le monde d'essai, **neuf lieues de ruelles
coûtent huit étapes là où douze lieues de piste en coûtent quatre**. Traverser la cité
entière revient donc aussi cher qu'aller d'une contrée à l'autre — ce qui était voulu.

Rien ne vous oblige à vous en servir : un fichier `v1` — une seule carte, sans clé — se
rouvre tel quel. L'atelier en fait sa première carte, lui donne son image, son étalon et
son allure, et le réexporte en `v2` sans que vous ayez rien à refaire.

## Ce que le moteur en fait

Déposez `monde.json` dans `data/` : la partie se déroule dans votre monde.

- **le réseau de voies remplace le graphe complet** — les distances suivent le plus court
  chemin, et non plus le vol d'oiseau ;
- **les cinq rangs servent** — la taille du marché suit le rang : un hameau ne tient pas
  l'étal d'une capitale ;
- **plusieurs cartes cohabitent** (format `v2`) — chacune avec sa vitesse de marche, et
  l'on passe de l'une à l'autre par une voie déclarée. Traverser une cité coûte plus
  d'étapes que la même distance en rase campagne, ce qui était le but ;
- **les passages** s'ouvrent depuis n'importe quel lieu d'où part une voie franchissable,
  pas seulement depuis un poste frontière : une capitale portuaire peut donner sur une
  cité.

Le format `v1` — une seule carte, ce que l'atelier exporte aujourd'hui — est lu tel quel.

Deux limites à connaître : une contrée que `data/raretes.json` ne connaît pas **emprunte**
la table de rareté d'une autre (la console le dit), et une sauvegarde faite dans un autre
monde est refusée à l'ouverture plutôt que reprise de travers.

---

# Atelier d'événements

`atelier-evenements.html` sert à écrire les événements du voyage : la situation qui
surgit, les deux à quatre façons d'en sortir, et ce que chacune fait au convoi.

## L'ouvrir

    https://chaotic110698.github.io/Caravane-2/outils/atelier-evenements.html

Ou par double-clic sur le fichier téléchargé — comme l'atelier de carte, il fonctionne
en `file://` et ne va chercher aucun fichier.

## Vous n'écrirez jamais de code

C'est le principe de l'outil, et il tient à une chose : **tout ce qu'un événement peut
dire vit dans un catalogue**, [`data/vocabulaire-evenements.json`](../data/vocabulaire-evenements.json).
Chaque effet y porte son nom en français, sa phrase d'explication et la description de
chacun de ses réglages. L'atelier n'affiche que ça.

Vous verrez donc « Larguer de la cargaison — *on jette une part du chargement, pour fuir
plus vite ou parce qu'on vous la prend* », jamais `delester`. Et le mode d'emploi
[`TUTORIEL-EVENEMENTS.md`](TUTORIEL-EVENEMENTS.md) sort du **même** fichier que les
formulaires : les deux ne peuvent pas se contredire.

**Il manque un effet ?** C'est prévu. Décrivez celui que vous voulez — *révéler un lieu
sur la carte*, *faire monter un prix durablement*, *ouvrir une route* — il est ajouté au
catalogue et apparaît aussitôt dans l'atelier, dans le tutoriel et dans les contrôles.
Même chose pour les **paliers d'un jet** : ce sont une liste ouverte, pas quatre cases
figées. Six degrés de réussite, ce sont six paliers.

## Les quatre volets de droite

| | |
|---|---|
| **Aperçu** | l'événement tel que le joueur le verra — et **jouable** : cliquez un choix, le dé roule pour de bon |
| **Contrôles** | ce qui bloque, ce qui mérite un coup d'œil, et quels lieux du monde n'ont aucun événement |
| **Tirage à blanc** | chaque choix joué 200 fois : la dispersion des issues et ce que ça coûte en médiane |
| **Convoi** | le convoi contre lequel tout est mesuré. Bougez-le pour voir l'événement au début puis à la fin d'une partie |

Le **tirage à blanc** est ce qui sert le plus. Un bluff qui rate 74 % du temps et coûte
71 po en médiane, ça se voit là — pas après, dans une partie.

## Par où commencer

1. **Exemples** charge quatre événements du jeu déjà convertis, du plus simple au plus
   riche. Ouvrez *Embuscade* et regardez comment ses quatre choix sont faits.
2. **Charger monde.json** — le fichier de l'atelier de carte. Les listes de lieux, de
   contrées et de terrains deviennent alors de vraies cases à cocher, et l'onglet
   *Contrôles* peut dire quels lieux n'ont encore rien.
3. **+ Événement**, et remplissez de haut en bas.

Le travail est sauvegardé tout seul dans le navigateur, y compris si vous fermez
l'onglet en plein milieu. **Exportez** quand même régulièrement.

## Ce que les contrôles attrapent

Une clé en double, un titre ou un récit manquant, moins de deux choix, une issue sans
texte, un choix qui mélange deux façons de se résoudre, une marchandise ou un dessin qui
n'existe pas, un palier qu'un autre recouvre entièrement, un bouton grisé sans raison
affichée — et surtout **les accolades qui ne correspondent à rien**, celles que le joueur
lirait telles quelles à l'écran.

Les avertissements rouges bloquent, ceux en or sont des remarques.

## Le fichier exporté

`evenements.json`, dont le format est décrit dans
[`data/FORMAT-EVENEMENTS.md`](../data/FORMAT-EVENEMENTS.md). Un aller-retour est sans
perte : ce qu'on importe ressort identique.

## Après avoir touché au catalogue

    node outils/construire.mjs

Ça refait le tutoriel et réinjecte le catalogue dans la page — l'atelier devant marcher
sans serveur, le catalogue voyage à l'intérieur du fichier.

## Ce que le moteur en fait

Déposez `evenements.json` dans `data/` et vos événements tombent en jeu, mêlés aux 51
écrits en JavaScript. Le joueur ne peut pas distinguer les deux réservoirs : chaque
événement du fichier est **compilé** vers exactement la forme des anciens, et les dix-huit
effets délèguent aux fonctions que le jeu utilisait déjà. Un effet en données fait donc
rigoureusement ce que fait son équivalent en code, et s'équilibre pareil.

Tout ce que l'atelier écrit est joué : les quatre formes de choix, le jet gradué, les
vingt-deux interrogations, la localisation par carte, lieu, contrée, rang, nature, terrain
et itinéraire, les textes à trous et leurs variantes, la raison affichée sur un bouton
grisé.

---

# Atelier de personnages

`atelier-personnages.html` sert à écrire les gens : qui ils sont, où on les trouve, ce
qu'on sait d'eux au premier regard, et ce qu'on ne leur arrache qu'à force.

C'est le socle des deux ateliers qui viennent. Une mission écrite est donnée par
quelqu'un ; un objet unique a appartenu à quelqu'un ; l'index de lore répertorie des
lieux **et** des personnages. Autant que ce quelqu'un existe pour de bon.

## La règle qui ne bouge pas

**La première description reste toujours lisible.** Elle n'est jamais scellée, jamais
remplacée : c'est ce qu'on lit au premier contact, et ce qu'on retrouve dans l'index dix
heures de jeu plus tard.

Tout le reste, ce sont des **couches**, et chacune se mérite. Une couche acquise vient
s'ajouter en dessous des précédentes — rien ne recouvre jamais rien.

## Ce qui fait mériter une couche

Trois choses parlent de la relation elle-même : **combien de fois on l'a croisé**,
**combien de missions on a faites pour lui**, et **combien de couches on a déjà**. Cette
dernière est ce qui permet d'enchaîner : la troisième révélation n'a de sens qu'après les
deux premières, et l'atelier refuse une couche qui en exigerait plus qu'il n'y en a
au-dessus d'elle.

S'y ajoute tout ce qu'on peut demander à l'état du convoi — l'or, la réputation, le
karma, les étapes — le même vocabulaire que les événements.

L'onglet **Où en est-on** relit la fiche à n'importe quel moment de la relation. C'est là
qu'on voit ce qui reste scellé au bout de trois rencontres et ce qui s'ouvre à la
dixième.

## L'accord, une fois pour toutes

Un personnage porte son **accord grammatical**, et les textes s'en servent : `{il}` donne
*elle*, `{le}` donne *la*, `arrivé{e}` donne *arrivée*. On écrit le texte une fois, pas
deux. `{appellation}` colle le titre au nom avec l'élision qui convient — *La guilde de*
suivi d'*Orlanne* donne *La guilde d'Orlanne*.

L'atelier ne devine pas l'accord : il vous le demande.

## Sa voix

Un champ qui ne s'affiche jamais au joueur : **comment il parle**, en deux mots. C'est
votre pense-bête pour le jour où vous écrirez le lore à plusieurs voix — chaque voix
garde alors son grain.

## Le fichier exporté

`personnages.json`.

```json
{
  "format": "caravane.personnages.v1",
  "personnages": [
    {
      "cle": "orlanne",
      "nom": "Orlanne",
      "titre": "Dame",
      "accord": "f",
      "role": "echevin",
      "lieu": "aurelium",
      "ico": { "glyphe": "sceau", "nature": "rencontre" },
      "premiere": "Elle tient le registre des péages depuis onze ans…",
      "voix": "sèche ; elle ne répète jamais",
      "couches": [
        { "titre": "Le registre",
          "gagne": [ { "quoi": "rencontres", "min": 3 } ],
          "texte": "Au troisième passage, {il} tourne le registre vers vous…" }
      ]
    }
  ]
}
```

| clé | rôle |
|---|---|
| `cle` | identifiant, unique dans le répertoire |
| `titre` | ce qui précède le nom, avec élision automatique |
| `accord` | `f` ou `m` — décide de tous les accords des textes |
| `role` | une clé de `vocabulaire-personnages.json` |
| `lieu` | une clé de `monde.json` : c'est là qu'on peut lui parler |
| `premiere` | **jamais scellée**, toujours relisible |
| `voix` | pense-bête d'auteur, jamais montré au joueur |
| `couches[].gagne` | les conditions à remplir, toutes |
| `couches[].texte` | ce qu'on apprend, une fois mérité |

## Ce que le moteur en fait

Déposez `personnages.json` dans `data/` et un onglet **Carnet** apparaît dans le menu du
marché. On y trouve qui se tient dans le lieu où l'on est, avec un bouton pour aller lui
parler, et **l'index** : tout ce qu'on a appris, relisible pour toujours.

Le moteur tient les compteurs — les rencontres, les missions rendues, les couches
acquises — et les emporte dans la sauvegarde. La règle est respectée à la lettre : la
première description ne se scelle jamais, les couches méritées s'ajoutent en dessous, et
ce qui reste fermé annonce ce qu'il faudrait pour l'ouvrir.

---

# Atelier d'objets

`atelier-objets.html` sert à écrire la **cinquième famille** : l'objet qui n'existe qu'en
un exemplaire.

Le jeu en connaît déjà quatre — les marchandises, les armes, les chariots et leurs pièces.
Ce sont des choses qu'on **achète**. Celle-ci est faite de choses qu'on **trouve une fois**,
et dont on apprend l'histoire à force de les avoir sous les yeux.

Le mécanisme existe déjà en miniature : les trois armes mythiques du jeu ne se vendent
qu'à la capitale de leur contrée, et si leur porteur tombe, *« le monde n'en reverra pas
d'autre »*. C'est cela qu'on généralise.

## D'où il vient — le seul champ qu'on ne peut pas laisser vide

Un objet sans provenance **n'entre jamais dans la partie**. Cinq façons de l'obtenir, et
la plus solide est **au bout d'une mission** : il a fallu aller quelque part et le
rapporter. L'onglet *Contrôles* récapitule alors les clés de mission attendues, pour que
vous les écriviez avec exactement les mêmes dans l'atelier de missions.

Les autres : dans un événement, détenu par quelqu'un, trouvable quelque part, ou dans les
bagages au départ — celle-ci étant excellente pour un objet dont le marchand ne sait même
pas ce qu'il est.

## Ce qu'il fait

Six pouvoirs, qu'on empile — et **aucun** est une réponse valable : une relique n'a pas à
être utile.

| pouvoir | ce que ça donne |
|---|---|
| **Améliorer une aptitude** | vigilance, agilité, négoce ou endurance, tant qu'on l'a |
| **Porter chance** | du karma, donc tous les jets de dé |
| **Être une arme** | il se porte et il frappe, comme les mythiques |
| **Révéler du lore** | il ouvre une couche chez un personnage — le document qui dit ce qu'il n'aurait jamais raconté |
| **Ouvrir un passage** | là où l'on serait refoulé |
| **Peser sur les prix** | à l'achat, à la vente, ou les deux |

**Révéler du lore** est celui qui lie les objets aux gens. Chargez votre `personnages.json`
et l'atelier vous propose les couches de chacun — et refuse d'en viser une qui n'existe
pas.

## L'onglet « Ce que ça pèse »

Un objet unique ne se juge que par comparaison, et on ne l'a jamais sous les yeux quand on
l'invente seul dans son coin. Cet onglet la fournit :

- la frappe d'une arme **située parmi les 21 du jeu**, les trois mythiques comprises, et
  un avertissement franc si c'est devenu la plus forte du monde ;
- un bonus de karma **traduit en points de dé** — le karma en donne un tous les 17 points ;
- ce qu'un rabais fait sur mille pièces ;
- quelle part d'un chariot bâché son poids occupe.

## La règle qui ne bouge pas

La même que pour les personnages : **la première description reste toujours lisible**. Les
couches se méritent — à force de le porter, à force de le montrer — et s'ajoutent en
dessous sans jamais rien recouvrir.

## Le fichier exporté

`objets.json`.

```json
{
  "format": "caravane.objets.v1",
  "objets": [
    {
      "cle": "registre-des-peages",
      "nom": "Le registre des péages",
      "accord": "m",
      "genre": "document",
      "poids": 2,
      "valeur": 0,
      "perdable": true,
      "ico": { "glyphe": "sceau", "nature": "ruines" },
      "provenance": { "genre": "mission", "mission": "le-registre-rature",
                      "quand": "à la fin" },
      "pouvoirs": [ { "faire": "prix", "sens": "les deux", "part": 0.06 } ],
      "premiere": "Un in-folio relié de peau, gonflé d'humidité…",
      "couches": [
        { "titre": "La main qui a raturé",
          "gagne": [ { "quoi": "etapesPorte", "min": 6 } ],
          "texte": "À force de le feuilleter le soir…" }
      ]
    }
  ]
}
```

| clé | rôle |
|---|---|
| `accord` | `f` ou `m` — décide de `{il}`, `{le}`, `{un}`, `retrouvé{e}` |
| `genre` | une clé de `vocabulaire-objets.json` : ce à quoi il ressemble |
| `valeur` | `0` = il ne se vend à aucun prix |
| `perdable` | il disparaît à jamais si on le perd |
| `provenance` | **obligatoire** : sans elle il n'entre jamais dans la partie |
| `pouvoirs` | ce qu'il fait, empilable — une liste vide est valable |
| `premiere` | **jamais scellée**, toujours relisible |
| `couches[].gagne` | ce qu'il faut pour l'apprendre |

## Ce que le moteur en fait

Déposez `objets.json` dans `data/`. Chaque objet a son état — dans le monde, en soute,
perdu à jamais — suivi et sauvegardé, et les six pouvoirs agissent :

| pouvoir | où ça se voit |
|---|---|
| **Améliorer une aptitude** | dans `vigilanceTroupe()`, `agiliteTroupe()`, `negoceCaravane()`, donc dans tous les jets qui s'en servent |
| **Porter chance** | dans le bonus de karma au dé |
| **Être une arme** | l'objet se range dans la réserve d'armes |
| **Révéler du lore** | la couche s'ouvre chez le personnage visé dès que l'objet est en soute |
| **Ouvrir un passage** | la douane n'est plus demandée sur ce passage |
| **Peser sur les prix** | à l'achat, à la vente, ou les deux, dans `calculerPrix()` |

Un objet dont la provenance est *dans les bagages au départ* est là dès la première étape.
Les trois armes mythiques gardent leur mécanisme d'origine : c'est de lui que celui-ci est
tiré.

---

# Atelier de missions

`atelier-missions.html` sert à écrire les missions **scénarisées** : celles qu'on compose
une par une, qui ne surviennent qu'une fois, et qui sont données par quelqu'un qui existe.

Le jeu propose déjà des contrats à chaque marché — il les tire au sort à partir de la carte
des raretés. **Ceux-là ne bougent pas.** Les missions écrites viennent à côté, pas à la
place.

## Le lien vers le personnage vit dans la mission

C'est le point qui compte à l'usage, et c'est délibéré.

Écrivez vos personnages tranquillement, **sans leur attribuer quoi que ce soit**. Revenez
un mois plus tard, chargez le répertoire, et confiez-leur une mission : `personnages.json`
n'est **jamais** rouvert ni modifié. Le nombre de missions qu'une personne donne est
*déduit* du carnet, pas stocké chez elle.

Conséquence agréable : vous pouvez refaire un répertoire de personnages sans rien casser
côté missions, et déplacer une mission d'un commanditaire à l'autre d'un clic.

## L'onglet Personnages

Il montre **qui se tient dans la zone** — tout le monde, une contrée, ou un lieu précis —
et pour chacun :

- son nom, son lieu, et le début de sa description ;
- combien de missions il donne déjà dans ce carnet, **ou qu'il n'en a aucune** ;
- la liste de ses missions, cliquable pour y sauter ;
- un bouton **Confier** — ou **Détacher**, si c'est déjà le sien.

En bas, le compte de ceux qui n'ont encore rien. Ce n'est pas un défaut à corriger : c'est
la façon normale de travailler.

## Les jalons, et le fil

Trois genres de jalon : **arriver quelque part**, **livrer de la marchandise**, **parler à
quelqu'un**. Ils s'enchaînent dans l'ordre où vous les rangez.

L'onglet **Le fil** déroule le chemin, étape par étape, et calcule ce qu'il coûte : le plus
court chemin sur le réseau de voies de votre `monde.json`, profil normal. Si le délai que
vous accordez ne suffit pas, l'atelier **refuse la mission** — elle serait impossible. Si
la marge tient à une étape, il vous le dit en or : un seul détour et c'est raté.

Il refuse aussi un jalon posé dans un lieu qu'aucune voie ne relie au reste du trajet, et
une rencontre avec quelqu'un qui n'a pas de lieu où être trouvé.

## Ce qu'elle rapporte

De l'or, de la réputation, du karma, **un objet unique**, ou **une couche de lore**.

L'objet doit être d'accord des deux côtés : la mission dit qu'elle le donne, l'objet dit
qu'il vient de cette mission. Chargez votre `objets.json` et l'atelier vérifie les deux
sens, clé par clé, avec un tableau récapitulatif.

La couche de lore est ce qui rend un service payant autrement qu'en pièces : on apprend
quelque chose sur quelqu'un. L'atelier propose les couches du personnage visé et refuse
d'en inventer une.

L'échec accepte les mêmes récompenses, en négatif.

## Le fichier exporté

`missions.json`.

```json
{
  "format": "caravane.missions.v1",
  "missions": [
    {
      "cle": "le-registre-rature",
      "titre": "Le registre raturé",
      "oeil": "Un service",
      "commanditaire": "orlanne",
      "ico": { "glyphe": "sceau", "nature": "tracas" },
      "offre": {
        "recit": "{commanditaire} vous retient au moment où vous quittez la halle…",
        "delai": 14,
        "si": [ { "quoi": "reputation", "min": 35 } ]
      },
      "jalons": [
        { "faire": "atteindre", "lieu": "gue-sec", "texte": "Le bourg est petit." },
        { "faire": "rencontrer", "personnage": "sorn", "texte": "Il ne nie rien." }
      ],
      "reussite": {
        "texte": "{commanditaire} écoute jusqu'au bout. Puis {il} vous tend le registre.",
        "recompenses": [ { "donne": "or", "de": 420 },
                         { "donne": "objet", "objet": "registre-des-peages" } ]
      },
      "echec": { "texte": "Le registre n'est plus sur le pupitre.",
                 "recompenses": [ { "donne": "reputation", "de": -6 } ] }
    }
  ]
}
```

| clé | rôle |
|---|---|
| `cle` | l'identifiant qu'un objet cite pour dire qu'il vient de cette mission |
| `commanditaire` | une clé de `personnages.json` — **le lien, stocké ici** |
| `lieu` | où on la reçoit ; à défaut, le lieu du commanditaire |
| `offre.delai` | les étapes accordées ; l'atelier vérifie qu'elles suffisent |
| `offre.si` | ce qu'il faut pour qu'elle soit proposée |
| `jalons[].faire` | `atteindre`, `livrer` ou `rencontrer` |
| `reussite.recompenses` | or, réputation, karma, objet, couche de lore |
| `echec` | facultatif ; les mêmes récompenses, en négatif |

## Ce que le moteur en fait

Déposez `missions-ecrites.json` dans `data/`. Vos missions apparaissent dans le **Carnet**,
là où se tient leur commanditaire, quand leurs conditions sont remplies. Une fois
acceptée, le carnet dit toujours quel est le prochain pas et combien d'étapes il reste.

Les jalons tombent tout seuls : *arriver* en entrant dans le lieu, *livrer* quand la
marchandise y est déposée — elle quitte alors la soute —, *parler à quelqu'un* quand on lui
parle. Le dernier jalon achève la mission et verse les récompenses, l'objet et la couche de
lore comprises. Une échéance passée applique ce que l'échec prévoit.

Les contrats tirés au sort à chaque marché n'ont pas bougé : les deux cohabitent.
