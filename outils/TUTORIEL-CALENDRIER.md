# Le calendrier — mode d'emploi

> Cette page est **engendrée** depuis [`data/calendrier.json`](../data/calendrier.json).
> Ne la corrigez pas à la main : corrigez le fichier — ou l'atelier — et relancez
> `node outils/construire.mjs`.

## Où le trouver

L'atelier est [`atelier-calendrier.html`](atelier-calendrier.html), depuis le hub ou
depuis le bandeau de n'importe quel atelier. Il tient dans une page : la forme du
temps, les mois, les moments du jour, et le premier jour du monde.

## Ce que le temps fait dans le jeu

**Une étape de voyage vaut une journée.** Le jour tourne à chaque pas de la route, pas
à l'arrivée : une traite de cinq étapes coûte cinq jours. La date se lit en haut de
l'écran du marché, et en entier sur l'écran de fin.

L'**heure**, elle, n'a qu'un pouvoir pour l'instant : elle décide de la lumière sur la
cité où l'on débouche. Une longue traite arrive au couchant, une courte au matin. Tout
le reste — les cols qui se ferment, les relevés du comptable qui se périment, une
créature qui ne sort que certains mois — viendra s'accrocher là, et ne coûtera alors
qu'une condition de plus.

## La forme du temps

| | |
|---|---|
| Heures dans une journée | **25** |
| Jours dans un mois | **50** |
| Mois dans une année | **4** |
| Jours dans une semaine | **5** |
| Jours dans une année | **200** — donc 200 étapes de voyage |

Les trois premiers se règlent dans l'atelier ; le quatrième s'en déduit. Changer la
longueur d'un jour ramène les moments dans la nouvelle journée : rien ne peut sortir
des bornes.

## Les mois

| Rang | Nom | Saison |
|---|---|---|
| 1 | **Mois I** | saison A |
| 2 | **Mois II** | saison B |
| 3 | **Mois III** | saison C |
| 4 | **Mois IV** | saison D |

Le **nom** paraît partout dans le jeu. La **saison** ne sert encore à rien et attend
les cols qui s'ouvrent et se ferment ; posez-la quand même, elle sera lue le jour venu.

Chaque mois garde une **clé** invisible et stable : renommer un mois ne casse rien de
ce qui s'y accroche. Les flèches le déplacent, la croix l'ôte — il en faut au moins un.

## La semaine

| Rang | Nom |
|---|---|
| 1 | **Jour I** |
| 2 | **Jour II** |
| 3 | **Jour III** |
| 4 | **Jour IV** |
| 5 | **Jour V** |

Sa longueur **est la longueur de cette liste** : elle n'est pas déclarée à côté,
pour qu'aucun des deux nombres ne puisse démentir l'autre. Le champ *Jours dans une
semaine* allonge ou raccourcit la liste, et garde les noms déjà écrits.

Elle **court sans s'interrompre** : elle ne repart pas au premier de chaque mois, pas
plus que notre lundi ne le fait. Le jour tombe donc toujours au même rang d'un mois à l'autre, puisque 5 divise 200.

Le nom du jour paraît dans la **date entière** — celle de l'écran de fin et de
l'aperçu de l'atelier. Les mentions au fil d'une phrase — « reçu le 17ᵉ jour du
Mois I » — gardent le quantième seul, pour rester courtes.

## Les moments du jour

| Moment | De | À |
|---|---|---|
| Le petit matin | 4ʰ | 9ʰ |
| Le plein midi | 10ʰ | 15ʰ |
| Le soleil couchant | 16ʰ | 20ʰ |
| La nuit tombée | 21ʰ | 3ʰ |

Un moment peut **enjamber minuit** : la nuit va de 21 à 3, et l'atelier le comprend sans qu'on ait rien à dire.

Le ruban coloré sous les champs montre la journée entière, heure par heure. Une case
**grise** est une heure que personne ne réclame — ce n'est pas une panne, elle retombe
sur le premier moment, mais c'est presque toujours un oubli. Une heure réclamée par
deux moments revient au premier de la liste ; l'atelier vous le dit aussi.

## Le premier jour du monde

La première étape d'une partie tombe le **1ᵉʳ jour du Mois I, an I**, à 8 heures.

Tout le reste se compte à partir de là. Décaler ce jour décale l'histoire entière —
utile quand on veut qu'une partie commence juste avant la fermeture d'un col.

## Les trois boutons de la barre

| | |
|---|---|
| **Tirer au sort** | Des nombres plausibles, et rien d'autre : il ne nomme jamais un mois autrement que « Mois I ». C'est un banc d'essai, pas un générateur de récit. |
| **Repartir de l'horloge nue** | Rétablit le calendrier livré, celui qui ne dit rien. |
| **Exporter calendrier.json** | Le fichier que le jeu lit. Posez-le dans `data/`. |

## Où poser le vôtre

Deux endroits, au choix :

- **`data/calendrier.json`** — le fichier livré. Le remplacer suffit.
- **`data/<votre dossier>/calendrier.json`** — un calendrier d'auteur, qui l'emporte
  sur le premier quand il existe. C'est la voie à prendre si vous voulez garder vos
  noms hors d'un dépôt public : le jeu tourne sans, avec l'horloge nue.

Dans les deux cas le jeu se charge du reste : il n'y a rien à déclarer ailleurs.

## Ce que l'atelier vous dit

La colonne de droite montre trois choses en permanence : le **premier mois** jour par
jour, **un jour au hasard** traduit en date — tapez 137 et il vous dit où cela tombe —
et **ce qui cloche** : un mois sans nom, deux mois du même nom, une heure orpheline,
une heure réclamée deux fois.

Il vous signale aussi, en vert, quand vos mois portent **vos** noms plutôt que « Mois I ».
Ce n'est pas un reproche : c'est un rappel que ce fichier-là n'a plus rien de jetable.

