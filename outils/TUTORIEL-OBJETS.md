# Écrire un objet unique — mode d'emploi

> Cette page est **engendrée** depuis [`data/vocabulaire-objets.json`](../data/vocabulaire-objets.json).
> Ne la corrigez pas à la main : corrigez le catalogue et relancez
> `node outils/construire.mjs`.

Le jeu connaît déjà quatre familles de choses : les marchandises, les armes, les
chariots et leurs pièces. Ce sont des choses qu'on **achète**. Voici la cinquième :
l'objet qui n'existe qu'en un exemplaire, qu'on ne trouve qu'une fois, et dont on
apprend l'histoire à force de l'avoir sous les yeux.

Il s'écrit avec [`atelier-objets.html`](atelier-objets.html), en champs à remplir.

## La règle qui ne bouge pas

Comme pour les personnages : **la première description reste toujours lisible**. Les
**couches** se méritent et s'ajoutent en dessous, sans jamais rien recouvrir.

## Les genres

7 genres, et la liste est ouverte.

| genre | ce que c'est |
|---|---|
| **Relique** | Un objet qu'on ne se procure pas : un fragment, une enseigne, un ossement monté sur socle. Sa valeur est ce qu'on raconte de lui. |
| **Arme de légende** | Elle se porte et elle frappe. C'est la seule famille qui touche au combat — les trois armes mythiques du jeu sont déjà de celles-là. |
| **Document** | Un registre, une lettre, une carte, un sauf-conduit. Le meilleur porteur de lore : il dit quelque chose sur quelqu'un ou sur un lieu. |
| **Bijou** | Léger, cher, et facile à faire changer de mains. Bon support pour ce qui se vole et se revend. |
| **Outil** | Une lunette, un astrolabe, un jeu de clés. Il fait quelque chose de concret pour la caravane. |
| **Insigne** | Un sceau, un anneau, une plaque. Il ne vaut rien et il ouvre des portes : c'est ce qu'on montre. |
| **Curiosité** | Une chose dont personne ne sait plus l'usage. Elle n'a d'autre pouvoir que d'intriguer — et c'est parfois assez. |

## Ce qu'un objet peut faire

7 pouvoirs, qu'on empile. Un objet sans aucun pouvoir est
parfaitement valable : une relique n'a pas à être utile.

### Améliorer une aptitude

Tant qu'on l'a dans les chariots, la troupe est meilleure à quelque chose. Le bonus s'ajoute à la moyenne de la troupe et se voit dans tous les jets qui s'en servent.

| réglage | à savoir |
|---|---|
| **Quelle aptitude** | Vigilance pour voir venir, agilité pour décrocher, négoce pour les prix, endurance pour encaisser. **Obligatoire.** |
| **De combien** | 3 est discret, 8 se sent, 15 change une partie. Les aptitudes vont de 0 à 100. Par défaut : 5. **Obligatoire.** |

### Porter chance

Un bonus permanent au karma, donc à tous les jets de dé. C'est le pouvoir le plus large et le plus difficile à équilibrer : n'allez pas loin.

| réglage | à savoir |
|---|---|
| **De combien** | Le karma va de 0 à 100 et donne +1 au dé tous les 17 points. 17 vaut donc un point de dé entier. Par défaut : 6. **Obligatoire.** |

### Être une arme

L'objet se porte et frappe. Il se range dans la réserve d'armes et s'équipe comme les autres — mais il n'existe qu'en un exemplaire, et il disparaît avec celui qui le portait.

| réglage | à savoir |
|---|---|
| **Quelle famille** |  **Obligatoire.** |
| **Force de frappe** | Les armes ordinaires vont de 0,26 à 0,95. Les trois armes mythiques du jeu sont à 0,82, 0,95 et 1,25. Par défaut : 0,9. **Obligatoire.** |
| **Parade** | Ce qui est encaissé au lieu d'être subi. 0 pour une hache, 0,22 pour une arme équilibrée. Par défaut : 0,1. |

### Révéler du lore

Le posséder ouvre une couche chez un personnage — le document qui dit ce qu'il n'aurait jamais raconté. C'est le pouvoir qui lie les objets aux gens.

| réglage | à savoir |
|---|---|
| **Chez qui** |  **Obligatoire.** |
| **Laquelle** | Une couche de ce personnage. Chargez le répertoire de personnages pour les voir. **Obligatoire.** |

### Ouvrir un passage

Le montrer suffit là où l'on serait refoulé : une frontière, un quartier fermé, une porte gardée.

| réglage | à savoir |
|---|---|
| **Où** | Chargez un monde.json pour choisir. Laissez vide pour un passe-partout. **Obligatoire.** |

### Peser sur les prix

On vous fait un meilleur prix, ou on vous en donne un meilleur. Le sceau d'une guilde, la recommandation d'un comptoir.

| réglage | à savoir |
|---|---|
| **Dans quel sens** |  Par défaut : les deux. **Obligatoire.** |
| **De combien** | 0,08 fait 8 % de mieux. Au-delà de 0,2 le commerce ne veut plus rien dire. Par défaut : 0,08. **Obligatoire.** |

### Révéler un lieu

Tenir cet objet en soute ouvre une piste vers un lieu caché, sans qu'on ait à en donner le cap sur la boussole. S'il est marqué comme fragment, il ne révèle rien tout seul : il faut réunir tous les fragments du même lieu. C'est de quoi faire d'une carte déchirée en trois morceaux la clef d'un endroit, à disperser dans les missions, les dialogues et les fouilles.

| réglage | à savoir |
|---|---|
| **Quel lieu** | Le lieu caché que l'objet révèle. Chargez un monde.json pour choisir. **Obligatoire.** |
| **Combien de morceaux en tout** | 1 pour un objet qui révèle à lui seul. 3 pour une carte déchirée en trois : il faudra tenir les trois morceaux, chacun déclarant le même lieu et le même total. Par défaut : 1. |

## D'où il vient

Sans provenance, un objet **n'entre jamais dans la partie**. C'est le seul champ que
l'atelier refuse de laisser vide, avec le nom et la première description.

### Au bout d'une mission

On l'obtient en accomplissant une mission écrite. C'est la façon la plus sûre de faire mériter un objet : il a fallu aller quelque part et le rapporter.

- **Quelle mission** *(obligatoire)* — La clé de la mission. L'atelier de missions les proposera ; d'ici là, écrivez-la et notez-la.
- **À quel moment**

### Dans un événement

On tombe dessus en chemin. Réservez-le aux objets qu'on peut trouver sans les chercher.

- **Quel événement** — La clé de l'événement, si vous en avez déjà écrit un.

### Détenu par quelqu'un

Quelqu'un l'a et pourrait s'en séparer. Il faudra le convaincre, l'acheter, ou le lui prendre.

- **Qui** *(obligatoire)*

### Se trouve quelque part

Il est là, dans une échoppe ou dans des ruines. Avec un prix, il s'achète ; sans prix, il faut une raison d'y avoir accès.

- **Où** *(obligatoire)*
- **Prix demandé** — Laissez vide s'il ne se vend pas — il faudra alors une autre façon de l'obtenir.

### Dans les bagages au départ

Le marchand l'a depuis toujours et ne sait peut-être pas ce que c'est. Excellent pour un objet dont le lore se découvre en cours de partie.

> **Au bout d'une mission** est la provenance la plus solide : il a fallu aller
> quelque part et le rapporter. L'atelier note les clés de mission attendues, pour que
> vous les écriviez avec exactement les mêmes dans l'atelier de missions.

## Ce qui fait mériter une couche

| on regarde | unité | |
|---|---|---|
| **Couches déjà découvertes** | couches | Pour enchaîner les révélations sur l'objet lui-même. |
| **Étapes depuis qu'on l'a** | étapes | Le temps passé avec l'objet. Ce qu'on ne comprend qu'à force de l'avoir sous les yeux. |
| **Fois qu'on l'a montré** | fois | Combien de fois on l'a sorti devant quelqu'un. Les objets parlent quand on les fait parler. |

S'y ajoute l'état du convoi — l'or, la réputation, le karma, les étapes.
Les couches se comptent dans l'ordre : la troisième peut demander d'avoir déjà les
deux premières, et l'atelier refuse celle qui en exigerait plus qu'il n'y en a
au-dessus d'elle.

## Les trous dans les textes

| trou | ce que ça donne | exemple |
|---|---|---|
| `{nom}` | Le nom de l'objet. | Le registre des péages |
| `{il}` | Le pronom accordé. | elle |
| `{le}` | L'article défini accordé. | la |
| `{un}` | L'article indéfini accordé. | une |
| `{e}` | La marque d'accord à coller à un participe. | retrouvé{e} |
| `{ancien}` | Le nom de son ancien propriétaire, s'il en a un. | Dame Orlanne |
| `{lieu}` | Le lieu d'où il vient. | Aurelium |
| `{poids}` | Son poids en kilos. | 2 |
| `{valeur}` | Ce qu'il vaut, s'il vaut quelque chose. | 6 200 |

L'**accord** choisi décide de tout : `{il}`, `{le}`, `{un}`, et `retrouvé{e}`
qui donne *retrouvée*. On écrit le texte une fois.

## L'onglet « Ce que ça pèse »

C'est là qu'on juge un objet, parce qu'un objet unique ne se juge que par comparaison.
L'atelier situe sa frappe parmi les armes qui existent déjà — les trois mythiques
comprises —, traduit un bonus de karma en points de dé, chiffre ce qu'un rabais fait
sur mille pièces, et dit quelle part d'un chariot son poids occupe.

Un objet trop fort ne se voit pas quand on l'écrit seul dans son coin. Il se voit là.

