# Écrire un événement — mode d'emploi

> Cette page est **engendrée** depuis [`data/vocabulaire-evenements.json`](../data/vocabulaire-evenements.json).
> Ne la corrigez pas à la main : corrigez le catalogue et relancez
> `node outils/construire.mjs`. L'atelier d'événements affiche exactement les mêmes
> explications, tirées du même fichier.

Un événement, c'est une situation qui surgit, un récit, et deux à quatre façons d'en
sortir. Tout s'écrit en champs à remplir — jamais une ligne de code.

L'outil qui les remplit est [`atelier-evenements.html`](atelier-evenements.html) : ouvrez-le
d'un double-clic. La forme exacte du fichier produit est décrite dans
[`data/FORMAT-EVENEMENTS.md`](../data/FORMAT-EVENEMENTS.md). Cette page-ci explique
**ce que chaque chose fait**.

## Quand l'événement peut-il survenir

| moment | quand |
|---|---|
| **En chemin** (`route`) | Pendant un trajet, entre deux lieux. |
| **À l'arrivée** (`arrivee`) | En entrant dans un lieu, avant le marché. |
| **Pendant le séjour** (`sejour`) | Pendant qu'on est en ville, entre deux actions. |

S'y ajoute la **localisation** : carte, lieu, contrée, rang, nature, terrain,
itinéraire. Chaque critère rempli resserre ; un critère absent n'exclut rien.

## Les quatre façons de résoudre un choix

Chaque option proposée au joueur prend **une** de ces formes.

### Issue certaine

Le choix a une seule fin, connue d'avance. On paie, on attend, on repart : pas de dé, pas de surprise.

*Quand s'en servir :* La plupart des choix prudents, et tous les choix qui ne font que raconter.

### Jet de dé

On lance un dé à cent faces, auquel s'ajoutent l'aptitude choisie, le karma et l'état du convoi. Selon le total, l'issue change. Tout se compte en centièmes : un seuil de 75 demande un total de 75.

*Quand s'en servir :* Dès que le résultat doit dépendre de la chance et de la valeur de la troupe.

**Jet gradué.** Au lieu de deux issues, on découpe le résultat en paliers : un coup de maître, un résultat honnête, un échec, un désastre. Le premier palier dont les bornes conviennent l'emporte, et le dernier sans bornes ramasse le reste.

### Pari

On mise une somme. Si l'on gagne, on la double ; si l'on perd, elle disparaît. La difficulté se calcule toute seule à partir de la chance annoncée.

*Quand s'en servir :* Les jeux de hasard, les défis, les paris de taverne.

### Selon l'état du convoi

L'issue ne dépend pas du sort mais de ce que vous avez : assez d'or, assez de place, un chien, un garde. Deux fins, l'une pour oui, l'autre pour non.

*Quand s'en servir :* Quand vouloir ne suffit pas — payer un droit qu'on n'a peut-être pas les moyens de payer.

## Ce qu'un choix peut faire

19 effets, qu'on empile dans l'ordre qu'on veut. Chacun peut **retenir son**
**résultat** sous un nom, pour que le texte le cite ensuite entre accolades.

### Gagner ou perdre de l'or

Ajoute ou retire des pièces à la bourse. Un montant négatif retire ; la bourse ne descend jamais sous zéro.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Combien** | Un nombre, une fourchette, une formule ou une référence — voir la documentation des valeurs. | Négatif pour une perte. « -40 » retire 40 pièces ; « {selon: or, fois: -0.15} » en retire 15 %. **Obligatoire.** |

**Ce qu'il retient** — Le montant réellement bougé — utile quand la bourse était trop maigre.

> 240

### Faire monter ou tomber la réputation

Ce que le monde marchand pense de vous. Elle ouvre des portes, fait baisser les prix, et permet de parlementer avec des gens peu recommandables. Elle reste entre 0 et 100.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Combien** | Un nombre simple. | Négatif pour une perte. Comptez 2 à 6 pour un geste ordinaire, 9 ou plus pour une infamie. **Obligatoire.** |

### Faire monter ou tomber le karma

La chance du convoi. Un karma haut ajoute un bonus à tous les jets de dé ; un karma bas les plombe. C'est la récompense discrète des bonnes actions. Entre 0 et 100.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Combien** | Un nombre simple. | Négatif pour une perte. 3 à 5 pour un bon geste, 7 pour une mesquinerie. **Obligatoire.** |

### Rallonger le voyage

Ajoute des étapes au trajet en cours. Chaque étape coûte la solde des gardes, use les chariots et peut amener un autre événement. Quatre étapes au maximum par voyage, quoi qu'on empile.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Étapes en plus** | Un nombre simple. | 1 pour une halte, 2 pour un détour sérieux. Par défaut : 1. **Obligatoire.** |

**Ce qu'il retient** — Les étapes réellement ajoutées, une fois le plafond appliqué.

> 2

### Abîmer les chariots

Use les essieux, les caisses et les bêtes. Un chariot pris pour cible souffre plus que les autres. Un essieu ou un cheval à zéro immobilise le chariot.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Usure infligée** | Un nombre, une fourchette, une formule ou une référence — voir la documentation des valeurs. | 3 pour une secousse, 8 à 15 pour un mauvais passage, 20 pour un accident. **Obligatoire.** |

### Larguer de la cargaison

On jette une part du chargement — pour fuir plus vite, ou parce qu'on vous la prend. Les chariots les plus chargés perdent le plus.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Quelle fraction** | Une part, entre 0 et 1. 0,25 vaut un quart. | 0,25 largue un quart de la soute. Au-delà de 0,5 c'est une catastrophe. Par défaut : 0,2. **Obligatoire.** |
| **Seulement** | Une valeur parmi une liste fermée. | « fragile » ne casse que le verre et les enluminures. Par défaut : tout. |

**Ce qu'il retient** — La liste de ce qui a été perdu, prête à citer dans le texte.

> 34 kg de blé et 12 kg de sel

### Casser ce qui est fragile

Une secousse, une tempête, un versement : seul ce qui se brise se brise. Le reste de la cargaison ne bouge pas.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Quelle fraction du fragile** | Une part, entre 0 et 1. 0,25 vaut un quart. |  Par défaut : 0,3. **Obligatoire.** |

**Ce qu'il retient** — La liste de la casse.

> 18 kg de verrerie

### Soigner la troupe

Rend de la santé au marchand et à ses gardes. Une bonne nuit, une source claire, des herbes trouvées au bord du chemin.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Quelle fraction rendue** | Une part, entre 0 et 1. 0,25 vaut un quart. | 0,07 pour une gorgée d'eau, 0,25 pour une vraie nuit. Par défaut : 0,15. **Obligatoire.** |

### Blesser la troupe

Répartit des dégâts sur un ou plusieurs hommes. Les gardes encaissent plus souvent que le marchand. Un homme à zéro meurt ; si c'est le marchand, la partie s'arrête.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Dégâts à répartir** | Un nombre, une fourchette, une formule ou une référence — voir la documentation des valeurs. | 14 à 30 pour une échauffourée, 40 et plus pour une vraie bataille. **Obligatoire.** |
| **Combien d'hommes touchés** | Un nombre simple. |  Par défaut : 1. |

**Ce qu'il retient** — Qui a souffert.

> {blesses.noms} donne « Corvin et Naya », {blesses.morts} donne les morts

### Livrer bataille

La troupe se bat. L'issue dépend de la force des hommes, de leurs armes et de la menace du moment. On gagne du butin, ou on perd de la cargaison et des hommes.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Avantage** | Un nombre simple. | 1 pour un combat franc, 0,85 si l'on est pris au dépourvu, 1,3 si l'on tend l'embuscade. Par défaut : 1. |

**Ce qu'il retient** — Le récit de la mêlée, déjà écrit. Citez-le tel quel.

> {melee} donne toute la phrase, {melee.butin} le seul montant

### Charger de la marchandise

Met des kilos dans les chariots. S'il n'y a pas la place, on charge ce qu'on peut. Avec un prix au kilo, la marchandise s'achète ; sans prix, elle est offerte.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Quelle marchandise** | Une marchandise de biens.json, ou « au hasard ». | Une marchandise précise, ou « au hasard ». **Obligatoire.** |
| **Combien de kilos** | Un nombre, une fourchette, une formule ou une référence — voir la documentation des valeurs. |  **Obligatoire.** |
| **Prix au kilo** | Un nombre, une fourchette, une formule ou une référence — voir la documentation des valeurs. | Laissez vide pour un cadeau. « {selon: base, fois: 0.55} » pour une bonne affaire. |

**Ce qu'il retient** — Ce qui a été chargé.

> {charge.kg} kg de {charge.bien}

### Céder de la marchandise

Retire des kilos de la soute. Avec un prix au kilo, elle se vend ; sans prix, elle est perdue ou donnée.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Quelle marchandise** | Une marchandise de biens.json, ou « au hasard ». |  **Obligatoire.** |
| **Combien de kilos** | Un nombre, une fourchette, une formule ou une référence — voir la documentation des valeurs. |  **Obligatoire.** |
| **Prix au kilo** | Un nombre, une fourchette, une formule ou une référence — voir la documentation des valeurs. |  |

**Ce qu'il retient** — Ce qui est parti et ce que ça a rapporté.

> {cede.kg} kg pour {cede.gain} po

### Trouver une arme

Une arme ordinaire, tirée au hasard parmi les légères. Jamais une arme de légende — celles-là n'existent qu'en un exemplaire et ne se ramassent pas dans un fossé.

*Aucun réglage.*

**Ce qu'il retient** — Le nom de l'arme trouvée.

> une hache légère

### Donner une arme précise

Range une arme nommée dans la réserve. C'est par là que passent les armes de légende, quand le récit le justifie.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Laquelle** | Une arme de armes.json. |  **Obligatoire.** |

**Ce qu'il retient** — Le nom de l'arme.

> Excalibur

### Adopter un chien

Un errant se laisse apprivoiser. Il flaire les mauvaises rencontres avant les hommes et se bat un peu aux côtés du marchand. Sans effet si le convoi en a déjà un.

*Aucun réglage.*

**Ce qu'il retient** — Le nom du chien.

> Ronce

### Recruter un garde

Un homme rejoint l'escorte, avec son métier et son arme. Il touchera une solde à chaque étape.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Quel métier** | Un métier de garde, ou « au hasard ». |  Par défaut : auHasard. |
| **Avec quelle arme** | Une arme de armes.json. | Laissez vide pour une arme de son métier, tirée au hasard. |

**Ce qu'il retient** — Le nom de la recrue.

> Maren

### Lancer une rumeur de prix

On vous glisse qu'une marchandise vaut cher là où vous allez. Le prix y sera réellement plus haut à l'arrivée.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Quelle marchandise** | Une marchandise de biens.json, ou « au hasard ». |  Par défaut : auHasard. |
| **Multiplicateur de prix** | Un nombre simple. | 1,45 pour une rumeur vague, 1,9 pour un tuyau payé. Par défaut : 1,45. |

**Ce qu'il retient** — Le nom de la marchandise concernée.

> les épices

### Faire escorter le convoi

Des compagnons de route protègent la caravane pendant quelques étapes. Les mauvaises rencontres se font plus rares.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Combien d'étapes** | Un nombre simple. |  Par défaut : 2. **Obligatoire.** |

### Délivrer un laissez-passer

Remet au marchand un papier qui ouvre les frontières le réclamant. Il s'inscrit au carnet, avec le jour et le lieu où il a été délivré, et ne se perd pas. Sans lieu précisé, il vaut partout ; avec un lieu, il n'ouvre que celui-là.

| réglage | ce que c'est | à savoir |
|---|---|---|
| **Clé du laissez-passer** | Du texte, qui accepte les trous entre accolades. | Le même mot que la frontière réclame, dans l'atelier de carte. Sans accents ni espaces. **Obligatoire.** |
| **Comment on l'appelle** | Du texte, qui accepte les trous entre accolades. | Ce que le carnet affiche — « sauf-conduit du bailli ». |
| **Pour quel lieu** | La clé d'un lieu du monde, telle que l'atelier de carte la donne. Laissé vide, l'effet vaut partout. | Laissé vide, il ouvre partout où sa clé est réclamée. |
| **Qui l'a délivré** | Du texte, qui accepte les trous entre accolades. | Pour le carnet, et pour s'en souvenir. |
| **Le retirer** | Oui ou non. | Mettre « non » reprend le papier au lieu de le donner. Par défaut : true. |

**Ce qu'il retient** — Retient le nom du laissez-passer, pour le citer dans le texte.

> On vous glisse {papier} dans la main sans un mot.

## Ce qu'on peut demander à l'état du convoi

Ces mots servent aux conditions d'apparition, aux choix grisés, aux seuils de dé et
aux montants calculés.

| on demande | ce que ça vaut | |
|---|---|---|
| **L'or en bourse** | pièces |  |
| **Les étapes parcourues** | étapes | Sert à mesurer l'avancement de la partie : tout devient plus cher et plus dangereux avec le temps. |
| **Les lieues au compteur** | lieues |  |
| **La réputation** | 0 à 100 |  |
| **Le karma** | 0 à 100 |  |
| **Le nombre de gardes** | hommes |  |
| **Le marchand et ses gardes** | hommes |  |
| **La place libre dans les chariots** | kg |  |
| **Les kilos chargés** | kg |  |
| **Les kilos d'une marchandise** | kg |  *Demande une précision : bien.* |
| **La valeur marchande de la cargaison** | pièces |  |
| **La santé du convoi** | 0 à 100 | La moyenne des chariots et des hommes. |
| **Un chien suit le convoi** | oui ou non |  |
| **La vigilance de la troupe** | 0 à 100 | Ce qui permet de voir venir une embuscade. |
| **L'agilité de la troupe** | 0 à 100 | Ce qui permet de décrocher et de fuir. |
| **Le talent de négoce** | 0 à 100 | Le meilleur de la caravane l'emporte. |
| **La force du marchand** | 0 à 3 |  |
| **Quelqu'un porte une arme de cette famille** | oui ou non |  *Demande une précision : famille.* |
| **La mise de jeu courante** | pièces | Ce qu'on parie à ce stade de la partie. Croît avec les étapes. |
| **Le prix d'un garde** | pièces |  |
| **Ce qu'exigerait un pillard** | pièces | Calculé sur l'or et la valeur de la cargaison. |
| **Le coût des soins** | pièces |  |

## Écrire un montant

Partout où un nombre est attendu, quatre écritures sont possibles.

| écriture | exemple | ce que ça donne |
|---|---|---|
| un nombre | `40` | 40, toujours |
| une fourchette | `[18, 38]` | un tirage entre les deux |
| une formule | `base 18, par étape 4` | 18 au départ, 98 à la vingtième étape |
| une référence | `la mise × 0,8` | 80 % de la mise courante |

Elles se combinent : *base 40, par étape 11, le tout × entre 0,8 et 1,6*.

Dans l'atelier ces quatre écritures sont un menu déroulant, et le montant obtenu
s'affiche juste en dessous, calculé pour le convoi d'essai. On n'écrit jamais la
formule à la main.

## Les textes

Le récit, la note sous un bouton et le texte de chaque issue acceptent des **trous**
entre accolades — le nom qu'un effet a retenu, ou un mot du contexte.

> On ne laisse que **{perdu}**. **{blesses.noms}** y laissent des plumes.

Les nombres sortent à la française — *1 240*, pas *1240*. Un trou inconnu reste visible
à l'écran : une faute de frappe se voit au lieu de disparaître, et l'atelier la signale
avant que le joueur ne la découvre.

Un texte peut aussi proposer **plusieurs variantes**, et le jeu en tire une au hasard :
dans l'atelier, séparez-les par une ligne vide.

## Il manque un effet ?

Le vocabulaire est un catalogue ouvert, pas une liste figée. Décrivez l'effet que vous
voulez — *révéler un lieu sur la carte*, *faire monter un prix durablement*, *ouvrir une
route* — il sera ajouté au catalogue et apparaîtra aussitôt dans l'atelier, dans cette
page et dans les vérifications.

Même chose pour les paliers d'un jet : ils sont une liste ouverte. Six degrés de
réussite au lieu de trois, ce sont six paliers — le bouton *Ajouter un palier* ne
compte pas jusqu'à quatre.

