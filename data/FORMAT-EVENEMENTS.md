# Format des événements

Un événement, c'est une situation qui surgit en chemin, un récit, et deux à quatre
façons d'en sortir. Ce document décrit comment en écrire un **sans une ligne de code** :
tout est en champs à remplir.

## Deux réservoirs qui cohabitent

Les 51 événements d'origine sont écrits en JavaScript dans `index.html`. Les nouveaux
s'écrivent en données, dans `data/evenements.json`. **Le tirage puise dans les deux**,
sans distinction pour le joueur.

Vous pouvez donc écrire des événements dès aujourd'hui, et les anciens seront convertis
au fil de l'eau — ou jamais. Rien ne vous attend.

---

## Le squelette

```json
{
  "cle": "quai-des-brumes",
  "titre": "Le quai des brumes",
  "oeil": "Sur le port",
  "genre": "majeur",
  "poids": { "base": 1, "parEtape": 0.05 },
  "quand": "route",
  "ou": { "traits": ["port"] },
  "si": [ { "quoi": "etapes", "min": 7 } ],
  "ico": { "glyphe": "goutte", "nature": "rencontre" },
  "recit": "La brume monte du bassin et avale les mâts un par un.",
  "choix": [ … ]
}
```

| champ | obligatoire | rôle |
|---|---|---|
| `cle` | oui | identifiant unique, en minuscules et tirets |
| `titre` | oui | le titre affiché |
| `oeil` | oui | la petite ligne au-dessus du titre — *Sur la route*, *Rencontre*, *Un instant* |
| `genre` | oui | `majeur` (une vraie décision) ou `mineur` (une saynète) |
| `poids` | non | sa fréquence relative au tirage — voir plus bas. À défaut : 1 |
| `quand` | non | `route`, `arrivee` ou `sejour`. À défaut : `route` |
| `ou` | non | où il peut survenir — voir plus bas. Absent : partout |
| `si` | non | conditions d'apparition — voir plus bas |
| `ico` | non | pictogramme et teinte, puisés dans `icones.json` |
| `recit` | oui | le texte de la situation. Accepte les trous (voir *Les textes*) |
| `choix` | oui | de deux à quatre options |

### Le poids

```json
"poids": { "base": 1, "parEtape": 0.09 }
```

La fréquence de tirage, relative aux autres événements du même genre. Un événement de
poids 3 sort trois fois plus souvent qu'un de poids 1.

`parEtape` le fait croître avec l'avancement de la partie : les embuscades se multiplient
à mesure qu'on s'éloigne. `base: 1, parEtape: 0.09` donne 1 au départ, 2,8 à la
vingtième étape.

Un nombre seul (`"poids": 2.3`) vaut `{ "base": 2.3 }`.

### `quand` — le moment

| valeur | quand l'événement se déclenche |
|---|---|
| `route` | pendant un trajet, entre deux lieux. C'est le cas de tous les événements actuels |
| `arrivee` | en arrivant dans un lieu, avant le marché |
| `sejour` | pendant qu'on est en ville, entre deux actions |

### `ou` — la localisation

Chaque critère rempli **restreint** ; un critère absent n'exclut rien. Les valeurs d'une
même liste sont alternatives (l'une **ou** l'autre), les critères entre eux se cumulent
(l'un **et** l'autre).

```json
"ou": {
  "cartes":   ["la-cite"],
  "lieux":    ["bas-port", "vieille-darse"],
  "contrees": ["humain"],
  "rangs":    ["capitale", "ville"],
  "traits":   ["port"],
  "terrains": ["ruelles", "canaux"],
  "profils":  ["dangereux"]
}
```

| critère | se rapporte à |
|---|---|
| `cartes` | la carte courante — le monde, la cité… |
| `lieux` | des lieux précis, par leur `cle` dans `monde.json` |
| `contrees` | les contrées, ou les quartiers d'une cité |
| `rangs` | `capitale`, `ville`, `village`, `hameau`, `poste` |
| `traits` | `port`, `souterrain` |
| `terrains` | le terrain de la voie empruntée |
| `profils` | l'itinéraire choisi : `securise`, `normal`, `dangereux` |

Pour un événement de route, `lieux`, `rangs` et `traits` se lisent sur **la destination**.
Pour un événement d'arrivée ou de séjour, sur **le lieu où l'on est**.

> Un événement sans `ou` peut sortir n'importe où. C'est le bon réglage pour les
> situations universelles — une tempête, une roue cassée. Réservez la localisation à ce
> qui n'a de sens qu'à un endroit.

---

## Les valeurs

Partout où un nombre est attendu — un montant, un seuil, des dégâts — vous pouvez écrire
quatre choses. C'est le même vocabulaire dans toute la spécification.

| forme | exemple | ce que ça donne |
|---|---|---|
| **un nombre** | `40` | 40, toujours |
| **une fourchette** | `[18, 38]` | un tirage entre 18 et 38 |
| **une formule** | `{ "base": 18, "parEtape": 4 }` | 18 au départ, 98 à la vingtième étape |
| **une référence** | `{ "selon": "mise", "fois": 0.8 }` | 80 % de la mise courante |

Les formes se combinent : `{ "base": 40, "parEtape": 11, "fois": [0.8, 1.6] }` donne
`(40 + 11 × étapes)` multiplié par un tirage entre 0,8 et 1,6.

**Termes de formule** : `base`, `parEtape`, `parGarde`, `parLieue`, `fois`.

**Références** : `mise` (la mise de jeu courante), `coutGarde`, `tribut`, `or`,
`valeurSoute`, `charge`, `soin`.

---

## Les interrogations

De quoi parler de l'état du convoi, dans les conditions comme dans les seuils.

| nom | vaut |
|---|---|
| `or` | la bourse |
| `etapes` | le nombre d'étapes déjà parcourues |
| `lieues` | les lieues au compteur |
| `reputation`, `karma` | de 0 à 100 |
| `gardes` | le nombre de gardes |
| `troupe` | le marchand plus les gardes |
| `place` | les kilos libres dans les chariots |
| `charge` | les kilos chargés |
| `stock` | les kilos d'un bien — demande `bien` |
| `valeurSoute` | la valeur marchande de la cargaison |
| `etatConvoi` | la santé moyenne, chariots et hommes, de 0 à 100 |
| `chien` | vrai si un chien suit le convoi |
| `vigilance`, `agilite`, `negoce` | la moyenne de la troupe |
| `puissance` | la force du marchand |
| `armeFamille` | vrai si quelqu'un porte une arme de cette famille — demande `famille` |

---

## Les conditions

Deux endroits les utilisent, avec la même écriture :

- **`si`** sur l'événement : il ne peut pas sortir tant que ce n'est pas vrai ;
- **`si`** sur un choix : le choix n'apparaît pas du tout ;
- **`bloque`** sur un choix : le choix apparaît mais grisé, avec sa raison.

```json
"si": [
  { "quoi": "etapes", "min": 7 },
  { "quoi": "or", "min": { "selon": "mise" } }
]
```

Une liste de conditions doit être **entièrement** vraie. Chaque condition :

| clé | rôle |
|---|---|
| `quoi` | le nom d'une interrogation |
| `min` / `max` | bornes, incluses. Acceptent toutes les formes de valeur |
| `vaut` | `true` ou `false`, pour les interrogations qui répondent par oui ou non |
| `bien`, `famille` | précise l'interrogation quand elle en a besoin |
| `sinon` | le texte affiché sur un choix grisé — *« Il vous manque 40 po »* |

---

## Un choix

```json
{
  "txt": "Payer le tribut",
  "note": "environ {tribut} po de valeur",
  "ton": "mauvais",
  "de": "aplomb",
  …la suite dépend de la forme…
}
```

| champ | rôle |
|---|---|
| `txt` | le libellé du bouton |
| `note` | la conséquence annoncée, sous le libellé. Accepte les trous |
| `ton` | `mauvais` teinte le bouton en rouge. Absent : neutre |
| `de` | le nom de la caractéristique jetée, affiché sur le dé |
| `si`, `bloque` | voir *Les conditions* |

Puis **une** des quatre formes suivantes.

### Forme 1 — direct

Rien à tirer, l'issue est certaine.

```json
{
  "txt": "S'abriter et attendre",
  "note": "Deux étapes de plus, aucun dégât",
  "effets": [ { "faire": "allonger", "de": 2 } ],
  "texte": "On dresse les bâches contre le vent. La tempête coûte deux jours, rien d'autre."
}
```

### Forme 2 — un jet de dé

Un d20, plus les modificateurs du convoi. Deux écritures :

**Simple** — réussi ou raté.

```json
{
  "txt": "Fuir vers les dunes",
  "de": "agilité",
  "jet": { "carac": { "selon": "agilite", "divise": 20 }, "seuil": 15, "titre": "Décrocher" },
  "reussi": {
    "effets": [ { "faire": "delester", "part": [0.09, 0.18], "nomme": "perdu" },
                { "faire": "abimer", "combien": 3 } ],
    "texte": "Les chariots filent par un ravin qu'eux seuls connaissent : on ne laisse que {perdu}."
  },
  "rate": {
    "effets": [ { "faire": "delester", "part": [0.26, 0.40], "nomme": "perdu" },
                { "faire": "abimer", "combien": 8 } ],
    "texte": "La fuite est brouillonne, les caisses volent : {perdu}. Les essieux ont souffert."
  }
}
```

**Graduée** — plusieurs paliers, du meilleur au pire. Le premier palier dont les bornes
sont satisfaites l'emporte ; le dernier sans bornes sert de repli.

```json
"jet": {
  "titre": "Fouille",
  "paliers": [
    { "min": 20, "verdict": "Magot !", "classe": "crit",
      "effets": [ { "faire": "or", "de": { "base": 40, "parEtape": 11, "fois": [0.8, 1.6] }, "nomme": "trouve" } ],
      "texte": "Sous une pierre plate, une bourse de cuir : {trouve} po." },
    { "max": 7, "verdict": "Piège", "classe": "rate",
      "effets": [ { "faire": "combat", "bonus": 0.85, "nomme": "melee" } ],
      "texte": "C'était un appât. {melee}" },
    { "verdict": "Rien du tout", "classe": "rate",
      "texte": "De la terre, des cailloux, et le sentiment d'avoir perdu une heure." }
  ]
}
```

Le `carac` du jet accepte un nombre, ou `{ "selon": "<interrogation>", "divise": 20 }`.
`verdict` est le mot affiché sur le dé ; `classe` vaut `crit`, `reussi` ou `rate` et
décide de sa couleur.

### Forme 3 — un pari

Vous misez, vous doublez ou vous perdez. Le seuil se calcule tout seul depuis la chance
annoncée.

```json
{
  "txt": "Jouer une main",
  "de": "hasard",
  "note": "{mise} po de mise",
  "bloque": [ { "quoi": "or", "min": { "selon": "mise" }, "sinon": "La bourse ne suit pas" } ],
  "pari": { "mise": { "selon": "mise" }, "chance": 0.48, "carac": 0, "nom": "hasard" },
  "gagne": { "texte": "Les dés tombent bien trois fois de suite. {mise} po de plus, et des regards en coin." },
  "perd":  { "texte": "Les dés tombent mal, et une main de pèlerin ramasse vos {mise} po sans commentaire." }
}
```

`gagne` et `perd` acceptent aussi des `effets`, en plus du gain ou de la perte de la mise
que le jeu applique lui-même.

### Forme 4 — selon une condition

Quand l'issue ne dépend pas du sort mais de l'état du convoi.

```json
{
  "txt": "Payer le droit",
  "note": "{droit} po",
  "selon": [ { "quoi": "or", "min": { "base": 18, "parEtape": 4 } } ],
  "oui": {
    "effets": [ { "faire": "or", "de": { "base": -18, "parEtape": -4 }, "nomme": "droit" } ],
    "texte": "Droit acquitté, {droit} po, sceau apposé sur le registre."
  },
  "non": {
    "effets": [ { "faire": "reputation", "de": -4 },
                { "faire": "delester", "part": 0.12, "nomme": "confisque" } ],
    "texte": "La bourse ne suit pas : le clerc se sert dans les chariots. Confisqué : {confisque}."
  }
}
```

---

## Les effets

Une liste, appliquée dans l'ordre. Chaque effet peut porter un `nomme` : le résultat
devient alors citable dans le texte, entre accolades.

| `faire` | paramètres | ce que `nomme` retient |
|---|---|---|
| `or` | `de` — signé | le montant réellement bougé |
| `reputation` | `de` — signé, borné 0–100 | — |
| `karma` | `de` — signé, borné 0–100 | — |
| `allonger` | `de` — étapes en plus, 4 au maximum par voyage | les étapes réellement ajoutées |
| `abimer` | `combien` — l'usure infligée aux chariots | — |
| `delester` | `part` — la fraction larguée. `seulement`: `fragile` ou `perissable` | *« 34 kg de blé et 12 kg de sel »* |
| `briserFragile` | `part` | la description de la casse |
| `reposer` | `part` — la fraction de santé rendue à la troupe | — |
| `blesserTroupe` | `total` — les dégâts. `cibles` — combien d'hommes | `.noms` les blessés, `.morts` les morts |
| `combat` | `bonus` — multiplie la force de la troupe | le récit de la mêlée, `.gagne`, `.butin` |
| `charger` | `bien` — une clé ou `auHasard`. `kg`. `prixAuKilo` si ça s'achète | `.kg`, `.bien`, `.paye` |
| `decharger` | `bien`, `kg`, `prixAuKilo` si ça se vend | `.kg`, `.bien`, `.gain` |
| `armeTrouvee` | — | le nom de l'arme trouvée |
| `donnerArme` | `arme` — une clé de `armes.json` | le nom de l'arme |
| `chien` | — | le nom du chien adopté |
| `recruter` | `metier` — une clé ou `auHasard`. `arme` | le nom de la recrue |
| `rumeur` | `bien` — une clé ou `auHasard`. `mult` — le multiplicateur de prix | le nom du bien |
| `escorte` | `de` | — |

> `charger` échoue en silence s'il n'y a pas la place, et `decharger` s'il n'y a pas le
> stock. Mettez une condition `bloque` si le choix n'a pas de sens sans ça.

---

## Les textes

`recit`, `note`, et le `texte` de chaque issue acceptent des trous entre accolades.

**Les résultats nommés** : `{perdu}`, `{blesses.noms}`, `{melee.butin}` — tout ce qu'un
effet a retenu par son `nomme`.

**Le contexte**, toujours disponible :

| trou | vaut |
|---|---|
| `{ville}` | le lieu où l'on est |
| `{destination}` | le lieu vers lequel on va |
| `{contree}` | la contrée courante |
| `{etapes}`, `{or}`, `{gardes}`, `{lieues}` | l'état du convoi |
| `{chien}` | le nom du chien, s'il y en a un |
| `{garde}` | le nom d'un garde au hasard |
| `{bien}` | le nom d'un bien au hasard de la cargaison |
| `{mise}`, `{tribut}`, `{coutGarde}` | les montants de référence |

Les nombres sont mis en forme à la française — `1 240`, pas `1240`. Un trou inconnu
reste visible tel quel à l'écran : une faute de frappe se voit, elle ne disparaît pas.

**Un texte peut proposer des variantes** — le jeu en tire une au hasard :

```json
"texte": [
  "Vous dégagez la borne et la calez droite.",
  "C'est un nom de roi, suivi d'une date. Vous la redressez quand même.",
  "Sous la poussière : « moi aussi je suis passé ». Vous ajoutez votre marque."
]
```

---

## Le pictogramme

```json
"ico": { "glyphe": "lames", "nature": "danger" }
```

`glyphe` puise dans `icones.json → glyphesEvenement`, `nature` dans
`teintesEvenement` — `danger`, `meteo`, `tracas`, `rencontre`, `halte`, `trouvaille`,
`ruines`, `pari`, `flanerie`, `charite`.

Sans `ico`, l'événement s'affiche sans image. Le générateur proposera les glyphes
existants et vous préviendra si vous en inventez un qui n'existe pas.

---

## Quatre de vos événements, convertis

### Le plus simple — *Source claire*

```json
{
  "cle": "source-claire",
  "titre": "Source claire",
  "oeil": "Halte",
  "genre": "mineur",
  "ico": { "glyphe": "goutte", "nature": "halte" },
  "recit": "Entre deux rochers, un filet d'eau qui ne figure sur aucune carte. Elle est froide, et elle est bonne.",
  "choix": [
    {
      "txt": "Camper là pour la nuit",
      "note": "Une étape de plus, tout le monde récupère",
      "effets": [ { "faire": "allonger", "de": 1 }, { "faire": "reposer", "part": 0.22 } ],
      "texte": "On dort au bruit de l'eau. Au matin, chacun a le pas plus assuré."
    },
    {
      "txt": "Remplir et repartir",
      "effets": [ { "faire": "reposer", "part": 0.07 } ],
      "texte": "Les outres pleines, les bêtes abreuvées, et la piste reprend avant midi."
    }
  ]
}
```

### Avec un pari — *Dés avec des pèlerins*

```json
{
  "cle": "des-avec-des-pelerins",
  "titre": "Dés avec des pèlerins",
  "oeil": "Pari",
  "genre": "mineur",
  "ico": { "glyphe": "des", "nature": "pari" },
  "recit": "Un groupe de pèlerins campe au même point d'eau que vous. Les dés sortent avant même que le feu ne prenne, et on vous fait une place.",
  "choix": [
    {
      "txt": "Jouer une main",
      "de": "hasard",
      "note": "{mise} po de mise",
      "bloque": [ { "quoi": "or", "min": { "selon": "mise" }, "sinon": "La bourse ne suit pas" } ],
      "pari": { "mise": { "selon": "mise" }, "chance": 0.48, "carac": 0, "nom": "hasard" },
      "gagne": { "texte": "Les dés tombent bien trois fois de suite. {mise} po de plus, et des regards en coin." },
      "perd":  { "texte": "Les dés tombent mal, et une main de pèlerin ramasse vos {mise} po sans commentaire." }
    },
    {
      "txt": "Regarder",
      "texte": "Vous suivez trois parties sans miser. Le plus dévot d'entre eux est aussi le plus mauvais perdant."
    }
  ]
}
```

### Avec une branche conditionnelle et un jet — *Péage seigneurial*

```json
{
  "cle": "peage-seigneurial",
  "titre": "Péage seigneurial",
  "oeil": "Barrière",
  "genre": "majeur",
  "ico": { "glyphe": "barriere", "nature": "tracas" },
  "recit": "Une chaîne en travers de la piste, deux hommes d'armes qui s'ennuient, et un clerc muni d'un registre. Le droit de passage est affiché sur une planche.",
  "choix": [
    {
      "txt": "Payer le droit",
      "note": "{droit} po",
      "selon": [ { "quoi": "or", "min": { "base": 18, "parEtape": 4 } } ],
      "oui": {
        "effets": [ { "faire": "or", "de": { "base": -18, "parEtape": -4 }, "nomme": "droit" } ],
        "texte": "Droit acquitté, {droit} po, sceau apposé sur le registre."
      },
      "non": {
        "effets": [ { "faire": "reputation", "de": -4 },
                    { "faire": "delester", "part": 0.12, "nomme": "confisque" } ],
        "texte": "La bourse ne suit pas : le clerc se sert dans les chariots. Confisqué : {confisque}."
      }
    },
    {
      "txt": "Contourner par les marais",
      "note": "Personne ne perçoit rien dans la boue",
      "ton": "mauvais",
      "effets": [ { "faire": "abimer", "combien": [8, 15] }, { "faire": "allonger", "de": 1 } ],
      "texte": "Une journée à patauger, les roues jusqu'aux moyeux. Rien payé, mais les chariots s'en souviendront."
    },
    {
      "txt": "Montrer un sauf-conduit douteux",
      "de": "aplomb",
      "note": "Un faux passe rarement",
      "jet": { "carac": { "selon": "reputation", "divise": 22 }, "seuil": 18, "titre": "Bluff" },
      "reussi": { "texte": "Le clerc plisse les yeux, compare, puis lève la chaîne sans un mot." },
      "rate": {
        "effets": [ { "faire": "or", "de": { "base": -35, "parEtape": -6 }, "nomme": "amende" },
                    { "faire": "reputation", "de": -9 } ],
        "texte": "Le faux est repéré. Amende de {amende} po et votre nom noté dans le registre."
      }
    }
  ]
}
```

### Le plus riche — *Embuscade*

```json
{
  "cle": "embuscade",
  "titre": "Embuscade",
  "oeil": "Sur la route",
  "genre": "majeur",
  "poids": { "base": 1, "parEtape": 0.09 },
  "ico": { "glyphe": "lames", "nature": "danger" },
  "recit": "Des silhouettes se lèvent derrière les rochers. Une dizaine, le visage couvert, la main sur le manche. Le chef s'avance sans se presser.",
  "choix": [
    {
      "txt": "Combattre",
      "de": "force",
      "note": "{gardes} garde(s) contre eux",
      "ton": "mauvais",
      "effets": [ { "faire": "combat", "bonus": 1, "nomme": "melee" } ],
      "texte": "{melee}"
    },
    {
      "txt": "Payer le tribut",
      "note": "environ {tribut} po de valeur",
      "selon": [ { "quoi": "or", "min": { "selon": "tribut" } } ],
      "oui": {
        "effets": [ { "faire": "or", "de": { "selon": "tribut", "fois": -1 }, "nomme": "paye" } ],
        "texte": "Le chef soupèse la bourse, hoche la tête, et le convoi repart. {paye} po de moins."
      },
      "non": {
        "effets": [ { "faire": "or", "de": { "selon": "or", "fois": -1 } },
                    { "faire": "delester", "part": [0.12, 0.6], "nomme": "pris" } ],
        "texte": "La bourse n'y suffit pas : ils prennent le reste dans les chariots — {pris}."
      }
    },
    {
      "txt": "Fuir vers les dunes",
      "de": "agilité",
      "note": "Décrocher · agilité {agilite}",
      "ton": "mauvais",
      "jet": { "carac": { "selon": "agilite", "divise": 20 }, "seuil": 15, "titre": "Décrocher" },
      "reussi": {
        "effets": [ { "faire": "delester", "part": [0.09, 0.18], "nomme": "perdu" },
                    { "faire": "abimer", "combien": 3 } ],
        "texte": "Les chariots filent par un ravin qu'eux seuls connaissent : on ne laisse que {perdu}."
      },
      "rate": {
        "effets": [ { "faire": "delester", "part": [0.26, 0.40], "nomme": "perdu" },
                    { "faire": "abimer", "combien": 8 } ],
        "texte": "La fuite est brouillonne, les caisses volent : {perdu}. Les essieux ont souffert."
      }
    },
    {
      "txt": "Négocier un droit de passage",
      "note": "Votre réputation vous précède",
      "si": [ { "quoi": "reputation", "min": 62 } ],
      "jet": { "carac": { "selon": "reputation", "divise": 24 }, "seuil": 12, "titre": "Parlementer" },
      "reussi": {
        "effets": [ { "faire": "reputation", "de": 2 } ],
        "texte": "Votre nom circule jusque dans les mauvaises compagnies. On vous laisse passer, presque poliment."
      },
      "rate": {
        "effets": [ { "faire": "or", "de": { "selon": "or", "fois": -0.15 }, "nomme": "coute" } ],
        "texte": "La discussion s'éternise et finit par coûter {coute} po tout de même."
      }
    }
  ]
}
```

---

## Ce que le générateur vérifiera

- une clé unique, un titre, un récit, au moins deux choix ;
- chaque choix a exactement une des quatre formes, et chaque issue a un texte ;
- les clés citées existent vraiment : les lieux dans `monde.json`, les biens dans
  `biens.json`, les armes dans `armes.json`, les glyphes dans `icones.json` ;
- tous les trous d'un texte correspondent à un résultat nommé ou à un mot du contexte ;
- les paliers d'un jet gradué ne se recouvrent pas et se terminent par un repli ;
- un choix `bloque` porte un `sinon`, sinon le joueur voit un bouton gris sans raison ;
- la couverture : quels lieux ont des événements, lesquels n'en ont aucun.

Il montrera aussi **le tirage à blanc** — l'événement joué cent fois contre un convoi
type, avec la dispersion des issues. C'est là qu'on voit qu'un choix est trop punitif
avant que le joueur ne le découvre.
