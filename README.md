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
```

Le moteur ne contient aucun contenu, et les fichiers de données aucune logique.
Au démarrage, `chargerDonnees()` va chercher les onze fichiers `data/*.json` en
chemin relatif, remplit les variables du moteur, puis lance le jeu — rien ne
s'exécute avant.

Pour ajouter une marchandise, une arme, un type de cité, un pictogramme ou un
événement, **lisez [`data/FORMAT.md`](data/FORMAT.md)** : il décrit chaque
fichier, chaque clé, et ce qui casse si on s'en écarte.

Les événements de route sont la seule exception : ils sont restés dans
`index.html`, parce que chaque choix y est une fonction qui manipule l'état du
jeu et non une donnée. `FORMAT.md` explique comment en ajouter.
