# Dessiner une icône — mode d'emploi

> Cette page est **engendrée** depuis [`data/icones.json`](../data/icones.json) et
> depuis l'atelier lui-même. Ne la corrigez pas à la main : corrigez la source et
> relancez `node outils/construire.mjs`.

Le jeu dessine tout en **SVG**, dans un carré de 24 sur 24, et ne pose jamais de
couleur dans le dessin : il écrit `currentColor`, et c'est la **teinte** qui décide de
la couleur au moment de l'affichage. Une icône se réutilise donc telle quelle en rouge
de danger ou en vert de rencontre — vous ne la dessinez qu'une fois.

L'atelier est [`atelier-icones.html`](atelier-icones.html). Ce que vous y dessinez
rejoint le dépôt commun, et apparaît aussitôt dans les listes de dessins des autres
ateliers, à la suite des 49 dessins livrés avec le jeu.

## La planche

La planche est ce carré de 24 sur 24, agrandi. Les repères tous les 4 carreaux vous
aident à viser le centre, qui tombe sur 12, 12.

- **Ajouter** une forme la pose au milieu, et la sélectionne.
- **Glisser** une forme la déplace. Le pas est le quart de carreau : on ne peut pas
  poser une forme à un endroit qui ne se raconte pas.
- La **poignée d'or**, en bas à droite de la forme choisie, la redimensionne.
- Les réglages fins — épaisseur, arrondi, nombre de branches — se font aux curseurs,
  sous la liste des formes.

> Une icône dépasse rarement du cadre sans que ce soit une erreur : l'atelier vous
> prévient dès qu'une forme sort des 24 carreaux, parce qu'elle serait rognée en jeu.

## Les formes

7 formes, qui se superposent dans l'ordre où vous les empilez —
la dernière de la liste est celle qui se dessine par-dessus.

| forme | ce qu'elle règle |
|---|---|
| Disque | **Rayon** (1 à 12), **Épaisseur du trait** (0,4 à 4) |
| Rectangle | **Largeur** (1 à 24), **Hauteur** (1 à 24), **Arrondi** (0 à 6), **Épaisseur du trait** (0,4 à 4) |
| Triangle | **Base** (1 à 24), **Hauteur** (1 à 24), **Épaisseur du trait** (0,4 à 4) |
| Trait | **Épaisseur** (0,4 à 6) |
| Étoile | **Rayon** (1 à 12), **Branches** (3 à 12), **Creux** (0,15 à 0,9), **Épaisseur du trait** (0,4 à 4) |
| Icône | **Échelle** (0,1 à 2), **Rotation (degrés)** (0 à 355) |
| Arc | **Rayon** (1 à 12), **Ouverture (degrés)** (20 à 340), **Épaisseur** (0,4 à 4) |

Chaque forme se dit **pleine** ou **creuse**, sauf le trait et l'arc, qui n'ont
que leur épaisseur. Une forme creuse ne montre que son contour : c'est ce qui donne
aux dessins du jeu leur air gravé.

## Une icône dans une autre

La forme **Icône** ne dessine pas : elle **reprend une autre icône**, entière. Dessinez
une roue une fois, et la carriole s'en sert deux fois, la charrette quatre. On choisit
la vôtre ou l'un des dessins livrés avec le jeu, puis on règle son **échelle** et sa
**rotation** comme pour n'importe quelle forme.

Ce n'est **pas une copie, c'est un renvoi** : corriger la roue corrige du même coup
toutes les carrioles qui s'en servent. C'est le seul moyen de ne pas refaire quatre
fois la même correction — et la seule façon d'assembler un dessin quand on ne sait
pas dessiner : on empile des morceaux qui existent déjà.

**Ce que l'atelier ne vous laissera pas faire :** une icône qui se reprend
elle-même, ou deux qui se citent l'une l'autre. Le dessin tournerait sans fin ; les
choix qui bouclent ne sont donc pas dans la liste.

**Renommer** l'icône reprise fait suivre les renvois tout seuls. La **supprimer**
demande confirmation en nommant ce qui s'en servait — sans quoi les carrioles se
videraient sans un mot. Et un renvoi qui ne mène plus nulle part est signalé dans les
contrôles, en dur.

> Le renvoi ne vit que dans l'atelier. Ce qui part vers le jeu est un **dessin
> entier** : la roue y est recopiée à chaque place qu'elle occupe, et le jeu n'a
> rien à savoir de la composition.

## La teinte

Les 10 teintes du jeu portent un nom, parce qu'elles
veulent dire quelque chose — un événement de danger est rouge partout, sans qu'on ait à
le décider deux fois.

| teinte | couleur | ce qu'elle annonce |
|---|---|---|
| `danger` | `#B84636` | un péril, une menace, du sang |
| `meteo` | `#7C8AA0` | le ciel, le vent, le froid |
| `tracas` | `#9A7343` | un ennui matériel, une avarie |
| `rencontre` | `#6E9B6A` | quelqu'un sur la route |
| `halte` | `#5CA79E` | un répit, un abri, de l'eau |
| `trouvaille` | `#C6A24C` | une aubaine, un gain |
| `ruines` | `#9A9488` | de la pierre ancienne, l'oubli |
| `pari` | `#A084C0` | le hasard, le jeu, le risque choisi |
| `flanerie` | `#7FA8C4` | une lenteur, un détour sans enjeu |
| `charite` | `#C08A6A` | un geste donné ou reçu |

Vous n'y êtes pas tenu : le bouton **Couleur libre**, à côté de la liste, ouvre un
sélecteur et accepte n'importe quelle couleur. Une teinte libre est retenue avec
l'élément, et suit le même chemin qu'une teinte nommée.

La règle de priorité est simple, et vaut dans tous les ateliers : **la teinte posée sur
l'élément l'emporte**, sinon on prend celle de la nature choisie, sinon l'or du jeu.

## Aux vraies tailles

Un dessin juste sur la planche peut être illisible à 16 pixels : deux traits qui se
frôlent deviennent une tache. Cet onglet montre l'icône aux quatre tailles où le jeu
s'en sert — 16, 24, 32 et 48 — sur les deux fonds, le vélin clair et le bois sombre, et
dans chacune des teintes nommées.

C'est le seul juge. Si le dessin ne tient pas à 16, épaississez plutôt que d'ajouter.

## La source

L'onglet **La source** montre le SVG produit, tel qu'il partira dans le jeu. Il est en
lecture seule : on ne corrige pas le dessin par son texte.

Le champ **SVG collé**, lui, est une porte de sortie. Si vous avez un dessin fait
ailleurs, collez-le : il remplace entièrement les formes de la planche. Deux conditions,
que l'atelier vérifie —

- le dessin doit être écrit pour un cadre de 24 sur 24, sans balise `<svg>` autour ;
- il doit dire `currentColor` au moins une fois, sinon la teinte ne le touchera pas.

Le contenu d'un `<script>` est refusé.

## Ce que l'atelier vérifie

- une clé unique, en minuscules sans accent, et un nom ;
- que la clé n'écrase pas un des dessins livrés avec le jeu ;
- qu'il y a au moins une forme, ou du SVG collé ;
- qu'aucune forme ne sort du cadre ;
- que le SVG collé est du dessin, et qu'il obéit à la teinte.

## Où vos icônes servent

Rien à exporter à la main : le dépôt du hub suffit. Une icône dessinée ici apparaît
dans la liste des dessins de l'atelier d'événements, de personnages, d'objets et de
missions, en dessous des dessins du jeu, et se choisit comme les autres.

