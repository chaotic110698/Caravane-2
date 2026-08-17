# Écrire un personnage — mode d'emploi

> Cette page est **engendrée** depuis [`data/vocabulaire-personnages.json`](../data/vocabulaire-personnages.json).
> Ne la corrigez pas à la main : corrigez le catalogue et relancez
> `node outils/construire.mjs`.

Un personnage, c'est quelqu'un à qui parler quelque part, ce qu'on sait de lui tout de
suite, et ce qu'on n'apprend qu'à force. Il s'écrit avec
[`atelier-personnages.html`](atelier-personnages.html), en champs à remplir.

## La règle qui ne bouge pas

La **première description est toujours relisible**. Elle n'est jamais scellée, jamais
remplacée : c'est ce qu'on lit au premier contact et ce qu'on retrouve dans l'index dix
heures plus tard. Tout le reste — les **couches** — se mérite et vient s'ajouter en
dessous, sans jamais rien recouvrir.

## Les rôles

15 rôles arrivent avec le jeu, et **la liste est ouverte**.
Deux façons d'en ajouter, selon le moment.

La **pile des rôles** — la bascule *Personnages / Rôles*, en haut de la liste de
gauche — les tient à part. On y écrit un rôle **d'avance**, avant qu'aucun
personnage ne le porte, et on lui donne un **dessin**.

Le bouton **+ Nouveau rôle**, sous la liste déroulante d'une fiche, en ajoute un
sans quitter le personnage qu'on est en train d'écrire. Le rôle lui est attribué
aussitôt — c'est pour lui qu'on l'a fait.

### Le dessin d'un rôle sert de recours

Un personnage qui n'a pas de pictogramme à lui prend **celui de son rôle**, champ
par champ : son glyphe et la teinte du rôle, ou l'inverse. Dessiner *batelier*
une fois pourvoit donc tous les bateliers d'un coup, et celui qui a son propre
dessin le garde.

| rôle | ce que ça vous donne | au féminin |
|---|---|---|
| **Échevin** | Il tient un registre, une charge, un sceau. Il donne des autorisations et des ennuis. | Échevine |
| **Marchand** | Il achète, il vend, il sait qui a besoin de quoi. Le commanditaire le plus naturel. | Marchande |
| **Forgeron** | Il fait et répare les armes et les essieux. Il connaît le métal, donc les mines. | Forgeronne |
| **Aubergiste** | Tout passe par sa salle. C'est par lui qu'on apprend les choses avant les autres. | *le même* |
| **Capitaine de garde** | Il tient la porte et les hommes. Il décide qui entre et qui attend. | *le même* |
| **Clerc** | Il écrit, il archive, il se souvient. Le lore ancien passe par lui. | *le même* |
| **Contrebandier** | Il connaît les chemins que personne ne relève, et le prix du silence. | Contrebandière |
| **Guide** | Il a fait la route cent fois. Il sait où l'eau est bonne et où l'on ne campe pas. | *le même* |
| **Ermite** | Il vit à l'écart et sait ce que la ville a oublié. Rarement bavard d'emblée. | *le même* |
| **Artisan** | Verrier, tisserand, enlumineur : celui qui fait ce que la caravane transporte. | Artisane |
| **Prieur** | Il tient un temple, une règle, une mémoire. Le lore religieux est chez lui. | Prieure |
| **Noble** | Il a des terres, une dette d'honneur et le bras long. On ne lui refuse pas facilement. | *le même* |
| **Mineur** | Il descend. Il sait ce qu'il y a en dessous, et ce qu'on n'en remonte pas. | Mineuse |
| **Batelier** | Il tient un bac, une barque, un quai. Indispensable aux ports. | Batelière |
| **Veneur** | Il chasse et suit les traces. Il voit passer ce que les routes ne montrent pas. | Veneuse |

### Ce qu'un rôle demande

Trois champs, dont un seul est obligatoire.

| champ | ce qu'on y met | obligatoire |
|---|---|---|
| **Nom** | `Maître de poste` — tel qu'on le lira. **Accents, espaces et majuscules sont les bienvenus.** | oui |
| **Au féminin** | `Maîtresse de poste`. **À laisser vide si le mot ne change pas.** | non |
| **Ce qu'il fait** | une phrase, pour vous y retrouver dans six mois. | non |

La **clé** ne se tape jamais : elle se fabrique toute seule à partir du nom, en
minuscules, sans accent, les espaces devenus des tirets — *Maître de poste* donne
`maitre-de-poste`. C'est elle que les fichiers portent, et c'est pour ça qu'elle
reste simple. Deux conséquences :

- deux noms qui donnent la même clé ne peuvent pas coexister, et l'atelier vous le
  dit **avant** d'ajouter, en nommant celui qui occupe la place ;
- renommer un rôle change sa clé, et les personnages qui le portaient **suivent**
  tout seuls. Rien à recoller.

### Le féminin est déclaré, jamais deviné

Écrivez **{role}** dans un texte : il sort accordé sur l'**accord** du personnage.
Le texte s'écrit une fois et sert aux deux.

> Le convoi trouve **{le} {role}** devant la porte close.

Aucune règle ne devine le féminin d'un mot français : *échevin* fait *échevine*,
mais *guide* ne prend pas de e et *veneur* fait *veneuse*. Le rôle porte donc le sien,
écrit à la main — et les rôles épicènes laissent le champ vide, ce qui est le cas
d'*aubergiste*, *capitaine de garde*, *clerc*, *guide*, *ermite*, *noble*.

Si un personnage est **féminin** et que son rôle n'a pas de féminin déclaré alors que
sa terminaison en appellerait un, l'atelier vous le signale en or. Ce n'est pas une
faute : c'est peut-être voulu.

> **Attention à l'élision.** `{le} {role}` donne « le échevin ». Devant une voyelle,
> écrivez l'article vous-même : `L'{role} ne dit rien.`

### Où ils vivent

Les rôles que vous ajoutez sont rangés à part des personnages, parce qu'un rôle
survit au personnage qui l'a fait naître. On les retrouve dans le **codex** du hub,
sous *Les rôles*, avec le nombre de personnages qui les portent, et un bouton pour
les rouvrir.

Ils n'ont **pas de fichier à eux** : ils voyagent dans `personnages.json`, sous une
clé `roles`, et l'atelier n'y met que ceux dont vos personnages se servent. C'est ce
qui permet au jeu d'écrire `{role}` sans qu'on lui porte un second fichier — et une
occasion de moins de l'oublier.

## À quelles conditions il se tient là

Un personnage peut porter un **si**. Tant qu'il n'est pas rempli, il **n'est pas
là** : ni grisé, ni annoncé, absent — et la mission dont il est le commanditaire
ne s'offre pas non plus. C'est ainsi qu'on fait paraître quelqu'un au milieu
d'une partie, après une mission, un objet trouvé, une réputation gagnée.

Le champ est sous *Où on le trouve*. Il parle le même vocabulaire que les
conditions d'un dialogue ou d'une offre de mission : il n'y a rien de neuf à
apprendre pour l'écrire.

| ce qu'on regarde | à quoi ça sert |
|---|---|
| **Une mission en est là** | il paraît quand une mission est *accomplie*, et pas avant |
| **On porte cet objet** | il ne se montre qu'à qui tient tel objet |
| **On a déjà vu quelqu'un** | lui-même, à la troisième visite — ou quelqu'un d'autre |
| **On a retenu quelque chose** | un souvenir laissé par un dialogue |
| **L'état du convoi** | l'or, la réputation, le karma, les étapes… |

Une fois **rencontré**, il reste à l'index du carnet quoi qu'il arrive : ce qu'on a
appris de quelqu'un ne se referme pas parce qu'il a quitté sa place. Laissez le
champ vide et il se tient là dès le premier jour.

## Ce qui fait mériter une couche

Une couche s'ouvre quand **toutes** ses conditions sont vraies. Trois d'entre elles
parlent de la relation avec ce personnage :

| on regarde | unité | |
|---|---|---|
| **Combien de fois on l'a croisé** | rencontres | Monte d'un à chaque fois qu'on lui parle. La façon la plus simple de faire mériter une couche : on ne se confie pas à un inconnu. |
| **Missions accomplies pour lui** | missions | Ce qu'on a fait pour lui, et non ce qu'on lui a dit. Le lore le plus profond devrait coûter ça. |
| **Couches déjà découvertes** | couches | Pour enchaîner : la troisième révélation n'a de sens qu'après les deux premières. |

S'y ajoute tout ce qu'on peut demander à l'état du convoi — l'or, la réputation,
le karma, les étapes parcourues : le même vocabulaire que les événements, décrit dans
[`TUTORIEL-EVENEMENTS.md`](TUTORIEL-EVENEMENTS.md).

Les couches se comptent **dans l'ordre où vous les rangez**. La troisième peut donc
demander d'avoir déjà les deux premières, et l'atelier vous prévient si vous en demandez
plus qu'il n'y en a au-dessus — une couche qui ne s'ouvrirait jamais.

## Les trous dans les textes

La première description et le texte de chaque couche acceptent des trous entre accolades.
Ils évitent d'écrire deux fois le même personnage au masculin et au féminin.

| trou | ce que ça donne | exemple |
|---|---|---|
| `{nom}` | Son nom seul. | Orlanne |
| `{titre}` | Son titre, s'il en a un. | Dame |
| `{appellation}` | Titre et nom ensemble, avec l'élision qui convient. | Dame Orlanne |
| `{role}` | Ce qu'il fait, en toutes lettres. | échevine |
| `{lieu}` | Le lieu où on le trouve. | Aurelium |
| `{contree}` | La contrée de ce lieu. | les Terres humaines |
| `{il}` | Le pronom accordé. | elle |
| `{le}` | L'article défini accordé. | la |
| `{e}` | La marque d'accord à coller à un participe. | arrivé{e} donne « arrivée » |

L'**accord** choisi sur la fiche décide de tout : `{il}` devient *elle*, `{le}`
devient *la*, et `arrivé{e}` devient *arrivée*. Un trou inconnu reste visible à l'écran,
et l'atelier le signale.

## Ce que l'atelier vérifie

- une clé unique, un nom, et surtout **une première description** ;
- le lieu existe vraiment dans le `monde.json` chargé ;
- chaque couche a un texte, et des conditions qui la font mériter ;
- aucune couche n'exige plus de couches connues qu'il n'y en a avant elle ;
- les trous des textes correspondent à quelque chose ;
- la couverture : quels lieux ont quelqu'un à qui parler, lesquels sont déserts.

Et l'onglet **Où en est-on** relit la fiche à n'importe quel moment de la relation :
c'est là qu'on voit ce qui reste scellé au bout de trois rencontres, et ce qui s'ouvre
à la dixième.

