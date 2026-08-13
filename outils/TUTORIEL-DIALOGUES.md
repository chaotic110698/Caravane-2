# Écrire un dialogue — mode d'emploi

> Cette page est **engendrée** depuis [`data/vocabulaire-dialogues.json`](../data/vocabulaire-dialogues.json).
> Ne la corrigez pas à la main : corrigez le catalogue et relancez
> `node outils/construire.mjs`.

Le catalogue de ce qu'un dialogue peut dire, demander et faire. Un dialogue est une conversation écrite d'avance : le personnage parle, on lui répond, et selon la réponse la conversation continue ailleurs. Il réutilise en entier le vocabulaire des événements — les dix-huit effets, les interrogations, les quatre écritures d'un montant — et n'ajoute que ce qui n'a de sens qu'en conversation : la mémoire de ce qu'on s'est dit, et le fait de confier une mission.

## Le principe

Un dialogue appartient à un personnage et se joue quand on lui parle en ville. Il se compose de répliques nommées : chacune est ce que le personnage dit, suivi des réponses qu'on peut lui faire. Une réponse mène à une autre réplique, ou clôt la conversation. Rien n'est écrit en code : les conditions et les effets sont ceux du catalogue.

En jeu, un onglet **Les gens** paraît dans une ville où quelqu'un se tient. On y
voit qui est là, ce qu'on sait de lui, et un bouton par conversation qu'il a à
offrir. Une pastille compte celles qu'on n'a pas encore eues.

## Un dialogue

| champ | ce que c'est | |
|---|---|---|
| **La clé** `cle` | Le nom technique du dialogue, unique dans tout le fichier. Minuscules, chiffres et tirets. | **obligatoire** |
| **Qui parle** `personnage` | La clé du personnage à qui ce dialogue appartient. Il se joue quand on lui parle, là où il se tient. | **obligatoire** |
| **Le titre** `titre` | Ce qu'on lit sur le bouton, dans l'onglet des gens. Une poignée de mots, du point de vue du joueur. | **obligatoire** |
| **Quand il se propose** `si` | Des conditions, toutes vraies pour que le dialogue apparaisse. Vide, il se propose toujours. |  |
| **La priorité** `priorite` | Quand plusieurs dialogues d'un même personnage sont ouverts en même temps, le plus haut se propose en premier. Par défaut zéro. | par défaut : 0 |
| **On peut le rejouer** `rejouable` | Par défaut un dialogue ne se joue qu'une fois : une conversation qu'on a eue, on l'a eue. Coché, il reste offert — c'est ce qu'il faut pour un marchand chez qui l'on repasse. | par défaut : non |
| **Par où l'on commence** `entree` | Le nom de la première réplique. À défaut, la première de la liste. | par défaut : accueil |
| **Les répliques** `repliques` | La conversation elle-même, une réplique par nom. Chacune porte ce que le personnage dit et les réponses qu'on peut lui faire. | **obligatoire** |

> Un dialogue **ne se joue qu'une fois** par défaut, et il n'est compté comme
> mené que lorsqu'on en sort par une réponse. Fermer la feuille en cours de route le
> laisse offert : on n'est pas puni d'avoir touché l'écran au mauvais endroit.

## Une réplique

Ce que le personnage dit, et les réponses qu'on peut lui faire.

| champ | ce que c'est | |
|---|---|---|
| **Ce qu'il dit** `dit` | Le texte du personnage. Accepte les trous entre accolades. Pour plusieurs variantes dont le jeu tire une au hasard, écrivez un tableau de textes — dans l'atelier, une ligne vide entre chacune suffit. | **obligatoire** |
| **La didascalie** `oeil` | Une ligne en petites capitales au-dessus du texte : où l'on est, ce qu'il fait pendant qu'il parle. Facultative. |  |
| **Ce qui arrive en y entrant** `effets` | Des effets joués une fois, au moment où la réplique s'affiche. Sert à donner ce qu'on vient de promettre, plutôt que de l'accrocher à la réponse. |  |
| **Ce qu'on peut répondre** `reponses` | Les boutons offerts au joueur, dans l'ordre. Une réplique sans réponse clôt la conversation. |  |

## Une réponse

| champ | ce que c'est | |
|---|---|---|
| **La réponse** `txt` | Ce que le joueur dit, écrit à la première personne. Court : c'est un bouton. | **obligatoire** |
| **Quand elle est possible** `si` | Des conditions. Non remplies, la réponse s'affiche grisée plutôt que de disparaître : voir qu'une porte existe et qu'elle est fermée vaut mieux que ne pas la voir. |  |
| **Pourquoi elle est fermée** `sinon` | La raison montrée sous une réponse grisée. Sans elle, la réponse est simplement cachée. |  |
| **Ce qu'elle fait** `effets` | Les effets joués quand on la choisit, avant d'aller à la réplique suivante. |  |
| **La suite** `vers` | Le nom de la réplique où l'on va. Absent, la conversation se termine. |  |
| **Elle clôt** `fin` | Ferme la conversation explicitement, même si une suite est indiquée. Sert à en sortir d'un mot. |  |

> Une réponse dont la condition n'est pas remplie se montre **grisée** quand vous
> avez écrit un *pourquoi*, et se **cache** sinon. Voir une porte fermée vaut mieux que
> ne pas la voir — mais pas si l'on ne dit pas ce qui la ferme.

## Ce qu'on peut demander

Toutes les interrogations des événements — l'or, la réputation, le karma, la place,
l'état du convoi — plus celles-ci, qui n'ont de sens qu'en conversation.

| on demande | ce que ça vaut | il faut préciser |
|---|---|---|
| **Ce qu'on s'est dit** `souvenir` | oui ou non — Un souvenir posé par un dialogue précédent. C'est ce qui fait qu'une conversation se rappelle la précédente. | `nom` |
| **Un dialogue déjà joué** `dialogueVu` | fois — Combien de fois cette conversation a été menée jusqu'au bout. Zéro si jamais. | `dialogue` |
| **Les fois où on lui a parlé** `rencontres` | fois — Le compteur de rencontres d'un personnage. Sans précision, celui à qui l'on parle. | `personnage` |
| **Où en est une mission** `missionEtat` | offerte, cours, faite, ratee — L'état d'une mission écrite. « offerte » tant qu'elle n'a pas été acceptée, « aucune » si le fichier des missions ne la contient pas. | `mission` |
| **Un objet unique en soute** `objetPorte` | oui ou non — Le convoi transporte-t-il cet objet unique en ce moment. | `objet` |
| **Une couche de lore déliée** `coucheOuverte` | oui ou non — Cette couche du personnage a-t-elle déjà été méritée. | `couche` |

## Ce qu'un dialogue peut faire

Les 19 effets des événements, sans exception : donner de l'or, blesser,
charger, recruter, lancer une rumeur. Un dialogue ne peut donc rien faire qu'un
événement ne sache déjà faire, et les deux s'équilibrent pareil.

S'y ajoutent ces trois-là.

### Retenir quelque chose — `souvenir`

Pose un souvenir que les dialogues suivants pourront interroger. C'est la mémoire du monde : une promesse faite, un nom lâché, une porte qu'on a refusée.

| réglage | ce que c'est | |
|---|---|---|
| **Sous quel nom** | Minuscules et tirets, comme une clé. | **obligatoire** |
| **Vrai ou faux** | Faux efface le souvenir. | par défaut : oui |

### Confier une mission — `mission`

Le personnage confie une mission écrite, et l'échéance part de cette étape. Le jeu refuse en silence si elle est déjà en cours ou finie : une mission ne se donne pas deux fois.

| réglage | ce que c'est | |
|---|---|---|
| **Laquelle** | La clé d'une mission de missions-ecrites.json. | **obligatoire** |

### Délier une langue — `ouvrirCouche`

Ouvre une couche de lore chez quelqu'un, sans qu'elle ait à être méritée par un compteur. Ce qu'on apprend en conversation reste relisible dans le carnet, pour toujours.

| réglage | ce que c'est | |
|---|---|---|
| **Chez qui** | À défaut, celui à qui l'on parle. |  |
| **Laquelle** | La clé de la couche, ou son rang à partir de zéro. | **obligatoire** |

## Les trous des textes

Le texte d'une réplique, celui d'une réponse et le *pourquoi* d'une réponse fermée
acceptent tous les mêmes trous, accordés sur le personnage à qui l'on parle.

| trou | ce que ça donne | exemple |
|---|---|---|
| `{nom}` | Le nom du personnage. | Orlanne |
| `{appellation}` | Son titre et son nom. | Dame Orlanne |
| `{role}` | Ce qu'il fait, accordé. | échevine |
| `{il}` | « il » ou « elle », selon l'accord. | elle |
| `{le}` | « le » ou « la ». | la |
| `{e}` | Le e du féminin : arrivé{e}. | e |
| `{ici}` | Le nom du lieu où l'on se tient. | Vaulmier |
| `{contree}` | La contrée de ce lieu. | Le Val |
| `{or}` | Ce qu'on a en bourse, à la française. | 1 240 |
| `{marchand}` | Le nom du marchand qu'on joue. | Aldric |

Un texte peut proposer **plusieurs variantes**, et le jeu en tire une : dans le
fichier, c'est un tableau de textes.

## Un exemple complet

Le dossier [`data/exemples/`](../data/exemples/) contient un petit monde tout prêt —
cinq lieux, quatre personnages, cinq conversations, deux missions et un objet unique.
Il se charge depuis **Paramètres › Le jeu d'exemple**, et ne touche pas à vos
fichiers de `data/`.

On y trouve, dans l'ordre où l'on s'en sert :

- **donner une mission en conversation** — Orlanne, avec une branche de marchandage
  qui ne s'ouvre qu'à quarante-cinq de réputation ;
- **en reparler pendant qu'elle court** — la même, rejouable, qui ne propose de lui
  rendre compte que si l'on a vu la batelière ;
- **délier une langue** — Sylve, qui ne dit ce qu'elle sait qu'à qui a payé le
  passage, et dont la couche de lore rejoint le carnet pour toujours ;
- **la conversation où l'on repasse** — Gaubert, qui sert à boire, vend des nouvelles
  et propose une course ;
- **une porte qu'un objet ouvre** — Harn, qui ne parle du péage qu'à qui porte le
  registre gagné chez Orlanne.

## Ce que la partie retient

| dans `S` | quoi |
|---|---|
| `S.dits[cle]` | combien de fois chaque conversation a été menée |
| `S.souvenirs[nom]` | ce que le monde retient de ce qu'on s'est dit |

Les deux voyagent dans la sauvegarde. Un souvenir posé ne s'efface que si un
dialogue le repose à *faux*.

