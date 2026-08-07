# Caravane

Un jeu de navigateur en français. Vous menez une caravane marchande à travers
trois contrées — les Terres humaines, naines et elfiques —, vous achetez là où
c'est commun, vous revendez là où c'est rare, et vous essayez d'arriver.

Il n'y a rien à installer : une page, du JavaScript, aucune dépendance.

## Jouer

Le jeu se sert depuis n'importe quel serveur statique. **Il ne fonctionne pas
par un double-clic sur `index.html`** : les données se chargent par `fetch()`,
que le protocole `file://` refuse.

```sh
python3 -m http.server
# puis http://localhost:8000/
```

La partie en cours se sauvegarde toute seule dans le navigateur, à chaque
arrivée en ville. L'onglet *Sauvegarde* permet aussi de l'exporter en fichier
et de la reprendre ailleurs.

## Organisation du dépôt

```
index.html        le moteur : HTML, CSS, règles, calculs, rendu, dés, combat
data/*.json       le contenu : biens, raretés, contrées, armes, chariots…
data/FORMAT.md    le format de chaque fichier de données, clé par clé
data/exemples/    un petit monde tout prêt, pour éprouver ce qu'on écrit
outils/           les outils d'auteur, qui ne partent pas avec le jeu
```

## Ce que vous pouvez écrire

Six fichiers **facultatifs et indépendants** viennent se poser dans `data/`. Posez-en
un, le jeu s'en sert ; n'en posez aucun, il tourne comme avant, avec son monde tiré
au sort.

| fichier | ce qu'il ajoute |
|---|---|
| `monde.json` | votre carte : les lieux, les voies, les contrées, l'échelle |
| `personnages.json` | des gens à qui parler, et ce qu'on n'apprend d'eux qu'à force |
| `objets.json` | des objets uniques, avec leurs six pouvoirs |
| `missions-ecrites.json` | des missions données par quelqu'un, qui ne surviennent qu'une fois |
| `evenements.json` | vos propres événements de route |
| `dialogues.json` | des conversations écrites d'avance, avec choix et conséquences |

Les cinq premiers s'écrivent dans les [ateliers](outils/) ; les dialogues encore à la
main, en suivant [`outils/TUTORIEL-DIALOGUES.md`](outils/TUTORIEL-DIALOGUES.md).

**Pour tout essayer sans rien écrire :** *Paramètres › Le jeu d'exemple › Charger
l'exemple*. Cinq lieux, quatre personnages, leurs conversations, deux missions et un
objet unique se chargent depuis `data/exemples/`, sans toucher à vos fichiers.

Le moteur ne contient aucun contenu, et les fichiers de données aucune logique.
Au démarrage, `chargerDonnees()` va chercher les onze fichiers `data/*.json` en
chemin relatif, remplit les variables du moteur, puis lance le jeu — rien ne
s'exécute avant.

Pour ajouter une marchandise, une arme, un type de cité, un pictogramme ou un
événement, **lisez [`data/FORMAT.md`](data/FORMAT.md)** : il décrit chaque
fichier, chaque clé, et ce qui casse si on s'en écarte.

Pour dessiner le monde — poser les villes sur une carte, tracer les routes, délimiter
les contrées, fixer l'échelle des distances — il y a l'**atelier de carte**, servi avec
le jeu :

    https://chaotic110698.github.io/Caravane-2/outils/atelier-carte.html

Il marche aussi par simple double-clic sur
[`outils/atelier-carte.html`](outils/atelier-carte.html) une fois téléchargé : il ne
charge aucun fichier, donc pas besoin de le servir. Son mode d'emploi et le format qu'il
exporte sont dans [`outils/README.md`](outils/README.md).

Les événements de route sont la seule exception : ils sont restés dans
`index.html`, parce que chaque choix y est une fonction qui manipule l'état du
jeu et non une donnée. `FORMAT.md` explique comment en ajouter.
