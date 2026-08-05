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

15 rôles, et la liste est ouverte : il en manque un, il est ajouté.

| rôle | ce que ça vous donne |
|---|---|
| **Échevin** | Il tient un registre, une charge, un sceau. Il donne des autorisations et des ennuis. |
| **Marchand** | Il achète, il vend, il sait qui a besoin de quoi. Le commanditaire le plus naturel. |
| **Forgeron** | Il fait et répare les armes et les essieux. Il connaît le métal, donc les mines. |
| **Aubergiste** | Tout passe par sa salle. C'est par lui qu'on apprend les choses avant les autres. |
| **Capitaine de garde** | Il tient la porte et les hommes. Il décide qui entre et qui attend. |
| **Clerc** | Il écrit, il archive, il se souvient. Le lore ancien passe par lui. |
| **Contrebandier** | Il connaît les chemins que personne ne relève, et le prix du silence. |
| **Guide** | Il a fait la route cent fois. Il sait où l'eau est bonne et où l'on ne campe pas. |
| **Ermite** | Il vit à l'écart et sait ce que la ville a oublié. Rarement bavard d'emblée. |
| **Artisan** | Verrier, tisserand, enlumineur : celui qui fait ce que la caravane transporte. |
| **Prieur** | Il tient un temple, une règle, une mémoire. Le lore religieux est chez lui. |
| **Noble** | Il a des terres, une dette d'honneur et le bras long. On ne lui refuse pas facilement. |
| **Mineur** | Il descend. Il sait ce qu'il y a en dessous, et ce qu'on n'en remonte pas. |
| **Batelier** | Il tient un bac, une barque, un quai. Indispensable aux ports. |
| **Veneur** | Il chasse et suit les traces. Il voit passer ce que les routes ne montrent pas. |

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

