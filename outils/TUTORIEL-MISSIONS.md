# Écrire une mission — mode d'emploi

> Cette page est **engendrée** depuis [`data/vocabulaire-missions.json`](../data/vocabulaire-missions.json).
> Ne la corrigez pas à la main : corrigez le catalogue et relancez
> `node outils/construire.mjs`.

Le jeu propose déjà des contrats à chaque marché : il les tire au sort à partir de la
carte des raretés, et ils ne se répètent jamais tout à fait. **Ces missions-ci sont
autre chose** — elles s'écrivent une par une, elles ne surviennent qu'une fois, et
elles sont données par quelqu'un qui existe.

Elles s'écrivent avec [`atelier-missions.html`](atelier-missions.html), et cohabitent
avec les offres tirées au sort sans les remplacer.

## Le lien avec le personnage vit dans la mission

Le lien entre une mission et son commanditaire est stocké dans la mission, jamais dans le personnage. On écrit donc ses personnages tranquillement, sans leur attribuer quoi que ce soit, et on revient plus tard leur confier une mission sans jamais rouvrir personnages.json.

C'est le point qui compte à l'usage. L'onglet **Personnages** de l'atelier montre qui
se tient dans la zone que vous choisissez — tout le monde, une contrée, ou un lieu — avec
pour chacun le début de sa description et le nombre de missions qu'il donne déjà. Un
bouton **Confier** attache la mission courante à cette personne.

La liste indique aussi qui n'a encore **aucune** mission. Ce n'est pas un défaut à
corriger : c'est la façon normale de travailler.

## Les jalons

3 genres de jalon, dans l'ordre où vous les rangez.

### Arriver quelque part

Le jalon tombe quand le convoi entre dans le lieu. C'est le jalon le plus simple, et souvent le premier : il faut bien aller là-bas.

- **Où** *(obligatoire)*

### Livrer de la marchandise

Il faut arriver quelque part avec les kilos demandés dans les chariots. La marchandise part au moment de la livraison — elle ne se revend pas au marché du coin.

- **Quelle marchandise** *(obligatoire)*
- **Combien de kilos** *(obligatoire)*
- **Où** *(obligatoire)*

### Parler à quelqu'un

Il faut trouver la personne là où elle se tient et lui parler. Le jalon compte une rencontre de plus à son compteur — celui qui fait mériter son lore.

- **Qui** *(obligatoire)*

L'onglet **Le fil** déroule le chemin que la mission fait parcourir, et calcule ce
qu'il coûte en étapes — le plus court chemin sur le réseau de voies de votre
`monde.json`. Si le délai que vous accordez ne suffit pas, l'atelier refuse la mission :
elle serait impossible à tenir.

## Ce qu'elle rapporte

5 récompenses, empilables, à la réussite comme à l'échec
(avec des montants négatifs, pour l'échec).

### De l'or

La prime. Rien n'oblige une mission écrite à en donner, mais c'est ce que le joueur attend d'abord.

- **Combien** *(obligatoire)* — Les offres tirées au sort donnent 150 à 900 po selon l'avancement. Une mission écrite peut se permettre davantage : elle ne revient pas.

### De la réputation

Ce que le monde marchand pense de vous. Entre 0 et 100.

- **Combien** *(obligatoire)* — Négatif pour une perte. Les contrats ordinaires donnent 4 à 6.

### Du karma

La chance du convoi, donc tous les jets de dé. La récompense discrète de ce qui n'était pas obligé.

- **Combien** *(obligatoire)*

### Un objet unique

L'objet passe dans les chariots. C'est la façon la plus sûre de faire mériter un objet — il a fallu aller quelque part et le rapporter. L'objet doit déclarer de son côté qu'il vient de cette mission.

- **Lequel** *(obligatoire)* — Chargez votre objets.json pour choisir. L'atelier vérifie que l'objet pointe bien vers cette mission.

### Une couche de lore

Accomplir la mission ouvre une couche chez un personnage. C'est ce qui rend un service payant autrement qu'en pièces : on apprend quelque chose.

- **Chez qui** *(obligatoire)*
- **Laquelle** *(obligatoire)*

> **Un objet unique** doit être d'accord des deux côtés : la mission dit qu'elle le
> donne, et l'objet dit qu'il vient de cette mission. Chargez votre `objets.json` et
> l'atelier vérifie les deux sens, clé par clé.

## Les trous dans les textes

| trou | ce que ça donne | exemple |
|---|---|---|
| `{commanditaire}` | Le nom de celui qui donne la mission, titre compris. | Dame Orlanne |
| `{il}` | Son pronom, accordé. | elle |
| `{ici}` | Le lieu où la mission est proposée. | Aurelium |
| `{la}` | Le lieu du dernier jalon — là où ça se termine. | Bas-Ferrant |
| `{delai}` | Le nombre d'étapes accordé. | 14 |
| `{prime}` | L'or promis, s'il y en a. | 400 |
| `{objet}` | Le nom de l'objet promis, s'il y en a un. | Le registre des péages |

`{il}` s'accorde sur l'**accord** du commanditaire, celui que vous avez choisi dans
l'atelier de personnages. Vous écrivez le texte une fois.

## Ce que l'atelier vérifie

- une clé unique, un titre, un texte d'offre, un texte de réussite, au moins un jalon ;
- les lieux, les personnages et les objets cités existent dans les fichiers chargés ;
- le délai suffit pour le trajet — et vous prévient quand la marge tient à une étape ;
- aucun jalon n'est posé dans un lieu qu'aucune voie ne relie au reste du trajet ;
- un personnage à rencontrer a bien un lieu où le trouver ;
- un objet promis pointe bien vers cette mission, et réciproquement ;
- les trous des textes correspondent à quelque chose.

Une mission **sans commanditaire** n'est pas une faute : elle est simplement en attente.
L'atelier le signale en or, pas en rouge.

