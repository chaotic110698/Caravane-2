# Format des données de Caravane

`index.html` contient le **moteur** : le HTML, le CSS, les règles, les calculs,
le rendu, les dés, le combat, l'économie. Il ne contient aucun contenu.

Ce dossier contient le **contenu** : onze fichiers JSON chargés au démarrage par
`chargerDonnees()` (tout en bas de `index.html`), en chemin relatif
`fetch('data/…json')`. Rien du jeu ne s'exécute avant que les onze soient là.

Toutes les clés sont en français et reprennent le vocabulaire du code. Les
fichiers sont en UTF-8, sans commentaires (le JSON n'en accepte pas) : ce
document en tient lieu.

**Deux règles à ne jamais enfreindre :**

1. Ajouter un fichier JSON impose d'ajouter son nom dans `FICHIERS_DONNEES`
   et de l'assigner dans `assigner()`, dans `index.html`.
2. Les clés (`ble`, `hache-legere`, `essieu`…) sont des identifiants : elles
   apparaissent dans les sauvegardes des joueurs. On peut en **ajouter**
   librement ; en **renommer** ou en **supprimer** casse les parties en cours.

| Fichier | Contenu | Variables du moteur |
|---|---|---|
| `biens.json` | catégories et marchandises | `CATEGORIES`, `ORDRE_CAT`, `G` |
| `raretes.json` | cinq niveaux de rareté, rareté de base par contrée | `RARETES`, `RARETE_BASE` |
| `contrees.json` | contrées, types de cités, toponymie | `CONTREES`, `TYPES_*`, `TYPE_CAP_*`, `NOMS_LIEUX` |
| `archetypes.json` | archétypes du marchand, métiers des gardes | `ARCHETYPES`, `METIERS` |
| `armes.json` | familles d'armes, armes, armes de légende | `FAMILLES`, `ORDRE_FAMILLES`, `ARMES`, `MAITRISE` |
| `chariots.json` | types de chariots, organes et leurs qualités | `CHARIOTS`, `ORGANES`, `PIECES`, `VERBE_PIECE` |
| `ambiance.json` | heures, silhouettes, phrases d'ambiance | `HEURES`, `PROFILS_VILLE`, `OUVERTURES`, `ODEURS`, `FOULES` |
| `pnj.json` | noms de gardes, noms de chiens | `NOMS_GARDES`, `NOMS_CHIENS` |
| `routes.json` | profils d'itinéraire, fins de partie par ruine | `PROFILS`, `FINS_CHARIOT` |
| `missions.json` | clients et récits des offres de contrat | `TITRES_CLIENT_RICHES`, `TWISTS_MISSION`, `RECITS_*` |
| `icones.json` | pictogrammes SVG liés à une entrée de données | `ICONES`, `ICONES_ARMES`, `GLYPHES_EV`… |

---

## `biens.json`

Ce qu'on achète et ce qu'on vend. Tout se compte en kilos : le prix est au kilo,
l'étal est en kilos, la soute est en kilos.

```json
{
  "categories": {
    "nourriture": { "nom": "Nourriture", "trait": "Lourde, périssable, mais tout le monde en veut." }
  },
  "ordreCategories": ["nourriture", "minerais", "joyaux", "art", "materiaux"],
  "biens": {
    "vin":    { "nom": "Vin",    "cat": "nourriture", "base": 8,  "fragile": 1, "genre": "m" },
    "epices": { "nom": "Épices", "cat": "nourriture", "base": 74, "perissable": 1, "genre": "f", "pluriel": 1 }
  }
}
```

**`categories`** — objet, une entrée par famille de marchandise. La clé sert
partout ailleurs (`cat` d'un bien, `produit`/`demande` d'un type de cité).

| clé | type | rôle |
|---|---|---|
| `nom` | texte | affiché en tête de rayon au marché |
| `trait` | texte | une phrase de caractérisation, affichée sous le nom |

**`ordreCategories`** — liste des clés de `categories`, dans l'ordre où les
rayons s'affichent au marché. Toute catégorie absente de cette liste
n'apparaîtra jamais.

**`biens`** — objet, une entrée par marchandise. La clé est l'identifiant du
bien dans tout le jeu (soute, contrats, sauvegardes, `icones.json`).

| clé | type | rôle |
|---|---|---|
| `nom` | texte | nom affiché |
| `cat` | clé de `categories` | rayon du marché |
| `base` | nombre | prix de référence au kilo, avant rareté, ville et négoce |
| `perissable` | `1` ou absent | se gâte en chemin : une part du stock se perd à l'arrivée, proportionnelle à la longueur du trajet |
| `fragile` | `1` ou absent | se casse lors des tempêtes, versements et fuites |
| `genre` | `"m"` ou `"f"` | genre grammatical du `nom` |
| `pluriel` | `1` ou absent | le `nom` est un pluriel (« Épices », « Peaux ») |

`genre` et `pluriel` ne servent qu'à écrire du français correct quand la
marchandise est citée dans une phrase — les récits de mission, notamment.
`duBien()` en tire *du blé*, *de la pierre*, *de l'ambre*, *des peaux* ;
`deBien()` en tire *de blé*, *d'épices*. Un bien sans `genre` est traité au
masculin singulier.

> Un bien ajouté ici **doit** recevoir une entrée dans `icones.json → biens` et
> une note de rareté dans `raretes.json → rareteBase` pour chacune des trois
> contrées, sinon il n'apparaît nulle part.

---

## `raretes.json`

```json
{
  "niveaux": [
    null,
    { "nom": "Commun", "court": "commun", "mult": 0.55, "lot": [150, 300], "teinte": "bas" }
  ],
  "rareteBase": {
    "humain": { "ble": 1, "sel": 1, "vin": 2 },
    "nain":   { "ble": 4, "sel": 2, "vin": 3 },
    "elfe":   { "ble": 2, "sel": 3, "vin": 1 }
  }
}
```

**`niveaux`** — liste indexée de 1 à 5. **Le premier élément est `null` et doit
le rester** : le moteur adresse ce tableau par le niveau de rareté (1 à 5), pas
par un index à partir de zéro.

| clé | type | rôle |
|---|---|---|
| `nom` | texte | libellé du badge |
| `court` | texte | même chose en minuscules, pour les phrases |
| `mult` | nombre | multiplie le prix de base — un très rare vaut ~6× un commun |
| `lot` | `[min, max]` | kilos réapprovisionnés à l'étal à chaque visite |
| `teinte` | `"bas"`, `""` ou `"haut"` | couleur du badge |

**`rareteBase`** — une entrée par `cle` de contrée, contenant le niveau de
départ (1 à 5) de **chaque** bien de `biens.json`. C'est la carte économique du
monde : ce que les nains n'ont pas, les humains le vendent. La spécialité de la
cité décale ensuite ce niveau d'un cran, et chaque cité tire son propre écart.

---

## `contrees.json`

```json
{
  "contrees": [{
    "cle": "humain",
    "nom": "Terres humaines",
    "gentile": "humaine",
    "article": "les Terres humaines",
    "forge": 1,
    "capitale": 2,
    "nomsCapitale": ["Aurelium", "Val-Royal"],
    "vers": "les Terres naines",
    "portes": ["La Porte de Fer"],
    "positions": [{ "x": 30, "y": 26, "lx": 16, "ly": -11, "ancre": "start" }]
  }],
  "typesVilles": { "humain": [{ "nom": "bourg agricole", "produit": ["nourriture"], "demande": ["minerais", "materiaux"] }] },
  "typesCapitale": { "humain": { "nom": "cité royale", "produit": ["art"], "demande": ["joyaux", "nourriture"] } },
  "typeFrontiere": { "nom": "poste de douane", "produit": [], "demande": [] },
  "nomsLieux": {
    "humain": {
      "pref": ["Tell", "Kesh"],
      "suff": ["Amara", "Roq"],
      "lien": "-",
      "simple": ["Les Trois Puits"]
    }
  }
}
```

**`contrees`** — liste de trois contrées, dans l'ordre de l'anneau : chacune
mène à la suivante par son poste frontière, et la dernière revient à la
première. Chaque contrée compte exactement **six** lieux (cinq cités et un poste
frontière) : c'est la constante `PAR_CONTREE` du moteur, et `positions` doit
donc contenir six entrées.

| clé | type | rôle |
|---|---|---|
| `cle` | `"humain"`, `"nain"`, `"elfe"` | identifiant, relie cette contrée à `typesVilles`, `typesCapitale`, `rareteBase`, `nomsLieux` et aux pièces `exclusif` |
| `nom` | texte | nom affiché |
| `gentile` | texte | adjectif (« naine ») |
| `article` | texte | forme avec article (« les Terres naines ») |
| `forge` | nombre | multiplie le prix des armes vendues sur place |
| `capitale` | 0–4 | position de la capitale dans `positions` (jamais 5 : c'est la frontière) |
| `nomsCapitale` | liste de textes | un nom est tiré au sort à la création du monde |
| `vers` | texte | nom de la contrée suivante, pour les phrases de passage |
| `portes` | liste de textes | noms possibles du poste frontière |
| `positions` | six objets | coordonnées sur la carte, dans une largeur de 180 |

Une `position` : `x`/`y` la cité, `lx`/`ly` son étiquette, `ancre` l'alignement
du texte (`start`, `middle`, `end`). **Les distances du jeu se calculent depuis
ces coordonnées** — déplacer une cité change les durées de trajet.

À l'affichage, `rendreCarte()` écarte les `y` autour de l'axe médian d'un
facteur `ETIREMENT_CARTE` (1,6) et calcule le cadre pour épouser le dessin :
ces coordonnées décrivent une contrée large et plate, un écran de poche est
haut et étroit. L'étirement ne touche que le dessin — `GEO`, `distance()` et
`lieuesEntre()` travaillent toujours sur les `y` d'origine. Gardez donc les
`x` dans 0–180 et les `y` dans 20–82 environ : au-delà, le cadre s'étire et
la carte rétrécit d'autant.

**`typesVilles`** — pour chaque contrée, les types de cités qu'on peut y
rencontrer. Le monde en tire cinq sans remise à chaque partie : il en faut donc
**au moins cinq** par contrée.

| clé | type | rôle |
|---|---|---|
| `nom` | texte | le type, affiché tel quel — sert aussi de clé dans `ambiance.json` |
| `produit` | liste de clés de catégorie | ce que la cité fabrique : plus abondant, moins cher |
| `demande` | liste de clés de catégorie | ce qui lui manque : plus rare, mieux payé |

**`typesCapitale`** — le type unique de la capitale de chaque contrée.
**`typeFrontiere`** — le type du poste de douane, commun aux trois.

> Tout type ajouté ici **doit** recevoir une silhouette dans
> `ambiance.json → profilsVille` et, de préférence, deux phrases d'ouverture
> dans `ambiance.json → ouvertures` (sans quoi le jeu retombe sur la phrase
> générique de la contrée).

**`nomsLieux`** — le vocabulaire de génération des noms de cités, par contrée.
Un nom sur quatre environ est pris tel quel dans `simple` ; les autres sont
composés `pref + lien + suff` (`lien` vaut `"-"` chez les humains, `""` ailleurs).

---

## `archetypes.json`

Sept statistiques par combattant : `pvMax` (ce qu'il encaisse), `force` (ce
qu'il rend), `garde` (la part des coups amortie), `agilite` (esquive et
décrochage, rabotée par le poids de l'arme), `endurance` (ce qu'il récupère en
chemin, et ce que coûtent ses soins), `vigilance` (les mauvaises rencontres
qu'il voit venir), `negoce` (ce qu'il obtient au marché — le meilleur de la
caravane l'emporte).

```json
{
  "archetypes": {
    "guerrier": {
      "nom": "Guerrier", "pvMax": 170, "force": 1, "garde": 0.26,
      "agilite": 46, "endurance": 62, "vigilance": 45, "negoce": 42,
      "affinite": "hache", "malhabile": "arc", "maitrise": [1.5, 1, 0.68],
      "resume": "Encaisse ce qui abattrait les autres.",
      "texte": "Le plus de souffle du convoi et une bonne cotte de mailles…"
    }
  },
  "metiers": {
    "routier": {
      "nom": "Routier", "pvMax": 80, "force": 0.75, "garde": 0.06, "prix": 0.6,
      "agilite": 74, "endurance": 64, "vigilance": 60, "negoce": 66,
      "affinite": "epee", "malhabile": "masse"
    }
  }
}
```

**`archetypes`** — ce que le joueur choisit au départ. Tous apparaissent sur
l'écran de création, dans l'ordre du fichier.

**`metiers`** — ce que sont les gardes recrutés en ville. Mêmes champs, plus
`prix`, et sans `resume` ni `texte`.

| clé | type | rôle |
|---|---|---|
| `nom` | texte | nom affiché |
| `pvMax` | nombre | vigueur |
| `force` | nombre | frappe de base, avant l'arme |
| `garde` | 0–1 | part des coups amortie |
| `agilite` | 0–100 | esquive, moins 3,4 par kilo d'arme |
| `endurance` | 0–100 | récupération entre deux villes, et remise sur les soins |
| `vigilance` | 0–100 | embuscades évitées |
| `negoce` | 0–100 | prix obtenus au marché |
| `affinite` | clé de famille d'arme | son arme : `maitrise[0]` |
| `malhabile` | clé de famille, ou `null` | ce qu'il ne sait pas tenir : `maitrise[2]` |
| `maitrise` | `[affinité, neutre, malhabile]` | facultatif ; à défaut, `maitriseDefaut` de `armes.json` |
| `prix` | nombre | *métiers seulement* : multiplie la solde et le prix d'embauche |
| `resume` | texte | *archétypes seulement* : une ligne sur l'écran de choix |
| `texte` | texte | *archétypes seulement* : le paragraphe de présentation |

---

## `armes.json`

```json
{
  "familles": { "hache": { "nom": "Hache", "trait": "Tout dans la frappe, rien dans la parade." } },
  "ordreFamilles": ["hache", "epee", "lance", "masse", "arc", "dague"],
  "armes": {
    "hache-moyenne": { "nom": "Hache moyenne", "surnom": "hache de guerre", "famille": "hache",
                       "frappe": 0.48, "poids": 6, "garde": 0, "prix": 215 },
    "excalibur": { "nom": "Excalibur", "famille": "epee", "frappe": 0.95, "poids": 4, "garde": 0.18,
                   "prix": 6200, "mythique": "humain", "surnom": "l'épée des rois humains",
                   "texte": "Une lame qui n'a pas pris une entaille en trois siècles…" }
  },
  "maitriseDefaut": [1.5, 1, 0.65]
}
```

**`familles`** — les six familles. La clé sert d'`affinite`/`malhabile` dans
`archetypes.json` et de clé de pictogramme dans `icones.json → famillesArmes`.

**`ordreFamilles`** — l'ordre d'affichage à l'armurerie. Sert aussi à classer
les armes par rang à l'intérieur de chaque famille (le rang détermine la teinte
du pictogramme : acier, bronze, azur).

**`armes`** — une entrée par arme.

| clé | type | rôle |
|---|---|---|
| `nom` | texte | nom affiché |
| `surnom` | texte | second nom, en gris |
| `famille` | clé de `familles` | décide de la maîtrise et du pictogramme |
| `frappe` | nombre | dégâts ajoutés à la `force` du porteur, × sa maîtrise |
| `poids` | kilos | retire 3,4 d'agilité par kilo |
| `garde` | nombre | ajouté à la garde du porteur (négatif pour les masses) |
| `prix` | nombre | prix de base, multiplié par la `forge` de la contrée |
| `mythique` | `cle` de contrée, ou absent | arme de légende |
| `texte` | texte | *armes mythiques* : leur légende |

Les armes **mythiques** n'existent qu'en un exemplaire : elles n'apparaissent
jamais chez les recrues, ni dans les ruines, ni à l'étal ordinaire. Elles ne se
trouvent qu'à la capitale de la contrée nommée par `mythique`. Le moteur en
attend une par contrée.

**`maitriseDefaut`** — `[affinité, neutre, malhabile]`, appliqué aux
combattants qui n'ont pas leur propre tableau `maitrise`.

---

## `chariots.json`

Un chariot n'a pas une santé mais trois : l'essieu souffre de la route, la
caisse encaisse les avaries et porte le volume, le cheval fatigue d'autant plus
qu'on le charge. Chacun se remplace chez le charron, en trois qualités.

```json
{
  "chariots": {
    "bache": { "nom": "Chariot bâché", "cap": 58, "usure": 1, "resist": 1, "prix": 275,
               "texte": "Le chariot de tout le monde…" }
  },
  "organes": ["essieu", "caisse", "cheval"],
  "pieces": {
    "essieu": {
      "nom": "Essieu", "cle": "essieu",
      "niveaux": [
        { "cle": "bois",  "nom": "Essieu de bois",  "usure": 1,    "prix": 120, "texte": "…" },
        { "cle": "acier", "nom": "Essieu d'acier",  "usure": 0.44, "prix": 680, "exclusif": "nain", "texte": "…" }
      ]
    }
  },
  "verbePiece": { "essieu": "Ne se forge qu'à", "caisse": "Ne s'assemble qu'à", "cheval": "Ne s'élève qu'à" }
}
```

**`chariots`** — les modèles vendus chez le charron.

| clé | type | rôle |
|---|---|---|
| `nom` | texte | nom affiché |
| `cap` | kilos | capacité de base, modulée par la caisse et son état |
| `usure` | nombre | multiplie l'usure de la route (< 1 : robuste) |
| `resist` | nombre | multiplie les dégâts encaissés lors des avaries (< 1 : encaisse bien) |
| `prix` | nombre | prix de base, majoré au fil des étapes |
| `texte` | texte | la ligne de présentation |

> Le moteur retombe sur la clé `bache` quand le type d'un chariot est inconnu :
> cette clé doit exister.

**`organes`** — les trois pièces, dans l'ordre d'affichage. Ces clés sont
structurelles : les changer suppose de toucher au moteur.

**`pieces`** — pour chaque organe, ses trois `niveaux`, du plus commun au plus
rare. `cle` identifie le niveau dans les sauvegardes ; `prix` est son prix de
base ; `exclusif` (facultatif) restreint la vente à la capitale de la contrée
nommée. Champs propres à chaque organe :

| organe | champs | rôle |
|---|---|---|
| essieu | `usure` | multiplie l'usure de la route |
| caisse | `cap`, `resist` | multiplie la capacité ; multiplie les dégâts encaissés |
| cheval | `traction`, `km`, `fatigue` | kilos tirés sans peine ; kilomètres par jour ; usure du cheval |

**`verbePiece`** — la formule affichée quand une pièce n'est pas vendue ici
(« Ne se forge qu'à Karak-Dûm »).

---

## `ambiance.json`

Chaque cité garde le même profil, la même heure et le même parfum d'une visite à
l'autre : on finit par la reconnaître avant d'avoir lu son nom.

```json
{
  "heures": [
    { "cle": "aube", "c1": "#6E7BA8", "c2": "#D9A87A", "astre": "#F6E0A8",
      "ax": 22, "ay": 34, "nuit": 0, "mot": "au petit matin" }
  ],
  "profilsVille": { "bourg agricole": "<path d=\"M18 46V30l14-9 14 9v16z\"/>" },
  "ouvertures": { "bourg agricole": ["Les charrettes de gerbes encombrent la place jusqu'au parvis."] },
  "ouverturesDefaut": { "nain": ["Les halles sont taillées dans le roc…"] },
  "odeurs": ["Ça sent la poussière chaude et le cuir."],
  "foules": ["Le marché est bondé : on avance à l'épaule."]
}
```

**`heures`** — les quatre moments de la journée. `c1`/`c2` : le dégradé du ciel ;
`astre` : la couleur du soleil ou de la lune ; `ax`/`ay` : sa position dans la
vignette (180 × 54) ; `nuit` : `1` allume les fenêtres ; `mot` : la formule
insérée dans la phrase d'ambiance.

**`profilsVille`** — la silhouette de la ville, en fragments SVG dessinés sur
**180 × 54, le sol à y = 46**. La clé est le `nom` d'un type de cité. Les clés
`nain` et `elfe` servent de repli pour les types sans silhouette propre — et
`nain` est le dernier recours, il doit exister. Classes utilisables :
`creux` (ouvertures sombres), `trait` (lignes fines), `tronc`, `colline`.

**`ouvertures`** — deux phrases par type de cité ; la ville en garde une pour
toujours. **`ouverturesDefaut`** — le repli par contrée, quand le type n'a pas
d'entrée.

**`odeurs`**, **`foules`** — deux listes libres. La phrase d'ambiance est
toujours *ouverture + odeur + foule*, et chaque ville tire ses trois index à sa
création.

---

## `pnj.json`

```json
{
  "nomsGardes": ["Sadr", "Ivar", "Lume"],
  "nomsChiens": ["Ronce", "Suif", "Braise"]
}
```

Deux listes de prénoms. **`nomsGardes`** sert aux gardes comme aux recrues ; le
moteur évite les doublons dans une même partie et, s'il n'y arrive pas en
quarante tirages, ajoute « le Second » au nom — mieux vaut en garder une
vingtaine. **`nomsChiens`** sert quand un errant se laisse adopter.

---

## `routes.json`

```json
{
  "profils": [
    { "nom": "La piste des dunes", "tag": "au plus court, par les sables",
      "risque": 1.6, "rudesse": 1.35, "detour": 0.78 }
  ],
  "finsChariot": ["Le dernier chariot s'ouvre en deux au milieu de la piste…"]
}
```

**`profils`** — les trois itinéraires proposés entre deux cités, dans l'ordre
d'affichage. `risque` multiplie la menace des rencontres, `rudesse` l'usure des
chariots, `detour` la distance (< 1 : raccourci). Le moteur en attend trois.

**`finsChariot`** — les phrases de fin de partie quand le convoi n'a plus un
seul chariot en état. Une est tirée au hasard.

---

## `missions.json`

L'habillage des offres de contrat. Rien ici ne touche à la mécanique : la
prime, l'échéance et les conditions d'acceptation se calculent dans
`index.html` et ne lisent aucune de ces valeurs. Chaque offre tire un titre, un
nom, un gabarit de récit et parfois une complication, ce qui donne quelques
milliers de formulations possibles — deux offres identiques n'arrivent
pratiquement jamais.

```json
{
  "titresClient": ["Maître", "Dame", "L'intendant de"],
  "twists": [null, null, "avant que la lune ne soit pleine"],
  "recitsCommande": [
    "{client} manque cruellement {deBien}. On dit qu'on en trouve {aCible}{twist}."
  ],
  "recitsConvoyage": [
    "{client} a besoin qu'on porte {duBien} jusqu'{aCible}{twist}."
  ]
}
```

**`titresClient`** — les titres possibles du commanditaire. Le nom qui suit est
tiré dans `pnj.json → nomsGardes` : « Dame Corvin », « Le comptoir de Naya ».
Un titre qui se termine par ` de` (`La guilde de`, `L'intendant de`,
`Le comptoir de`) est élidé devant une voyelle — « La guilde d'Ivar ».

**`twists`** — la complication, facultative, ajoutée en fin de phrase après une
virgule. **Les `null` sont significatifs** : ils règlent la proportion d'offres
sans complication. Deux `null` sur neuf entrées, c'est environ une offre sur
cinq qui reste sobre. Écrivez la complication sans majuscule ni point final.

**`recitsCommande`**, **`recitsConvoyage`** — les gabarits, tirés au sort selon
le genre de l'offre. Ce sont des textes à trous :

| trou | remplacé par |
|---|---|
| `{client}` | le commanditaire, titre compris |
| `{cible}` | le nom nu de la ville où va (convoyage) ou d'où vient (commande) la marchandise |
| `{aCible}` | la même ville précédée de sa préposition : *à Tell-Oria*, *au Marteau-Bas*, *aux Cimes Basses* |
| `{duBien}` | *du blé*, *de la pierre*, *de l'ambre*, *des peaux* — voir `genre` et `pluriel` dans `biens.json` |
| `{deBien}` | *de blé*, *d'épices* — après « manque de », « un lot de », « livraison de » |
| `{twist}` | *, avant que la lune ne soit pleine* — ou **rien du tout** si l'offre n'a pas de complication |

Un trou inconnu est laissé tel quel dans le texte, ce qui rend une faute de
frappe visible à l'écran plutôt que silencieuse.

> **Le français demande ses articles.** Écrire `du {bien}` donnerait « du
> épices » et « du peaux » ; écrire `à {cible}` donnerait « à Le Marteau-Bas ».
> Utilisez toujours `{duBien}`, `{deBien}` et `{aCible}` — jamais le nom nu.
> `{aCible}` se colle aussi après une élision : `jusqu'{aCible}` donne
> *jusqu'à Tell-Oria* comme *jusqu'au Marteau-Bas*.
>
> Attention aussi aux **accords** : une marchandise peut être un pluriel, donc
> pas de « {duBien} doit partir » (« des peaux doit partir »). Faites porter la
> phrase par un mot à vous — *ce chargement*, *ce lot*, *cette livraison*.
>
> Enfin, placez `{client}` en **début de phrase**. Plusieurs titres commencent
> par une majuscule d'article (`L'intendant de`, `Le comptoir de`) : « c'est
> L'intendant de Melik » détonne au milieu d'une phrase, « L'intendant de Melik
> attend… » se lit tout seul.

Les gabarits sont interchangeables entre commande et convoyage sur la forme,
mais pas sur le sens : dans une **commande**, le client est ici et la
marchandise est là-bas ; dans un **convoyage**, la marchandise est ici et doit
partir là-bas. `{cible}` désigne l'autre ville dans les deux cas.

Ajouter des entrées à n'importe laquelle de ces quatre listes suffit : le
moteur n'en attend aucun nombre précis.

---

## `icones.json`

Tous les pictogrammes **liés à une entrée de données**. Les icônes purement
d'interface (menu, boutons, carte) sont restées dans `index.html`.

Chaque tracé est un fragment SVG destiné à une `viewBox` de **24 × 24**, sans
balise `<svg>` englobante. Deux couleurs conventionnelles :
`fill="currentColor"` pour la matière (le moteur y injecte la teinte) et
`var(--velin)` pour les creux, qui suit le thème clair ou sombre.

```json
{
  "biens": { "vin": { "c": "#A8485F", "d": "<path d=\"M9.5 2h5v2.4…\" fill=\"currentColor\"/>" },
             "fer": { "c": "#9BA2AC", "d": "MINERAI" } },
  "minerai": "<path d=\"M3.6 13.8l3.1-7.2…\" fill=\"currentColor\"/>",
  "gemme": "<path d=\"M7 3h10l4.2 6.2…\" fill=\"currentColor\"/>",
  "famillesArmes": { "epee": "<path d=\"M12 1.6l2.1 3.4…\" fill=\"currentColor\"/>" },
  "etoiles": "<path d=\"M4.2 3.6l.7 1.9…\" fill=\"currentColor\"/>",
  "teintesRang": ["#8A8F98", "#5F8A5A", "#3E6FA8"],
  "chariot": "<path d=\"M2.8 9h14l3.2 5.8H2.8z\" fill=\"currentColor\"/>",
  "teintesChariots": { "bache": "#9A7343" },
  "chien": "<path d=\"M5.4 9.2l2-4.2…\" fill=\"currentColor\"/>",
  "pieces": { "essieu": "<circle cx=\"6\" cy=\"12\" r=\"3.9\"…/>" },
  "teintesPiece": ["#8A8F98", "#5F8A5A", "#C6A24C"],
  "glyphesEvenement": { "lames": "<path d=\"M4.6 2.6l2.2-1.5…\" fill=\"currentColor\"/>" },
  "teintesEvenement": { "danger": "#B84636", "meteo": "#7C8AA0" },
  "evenements": { "Embuscade": ["lames", "danger"] }
}
```

| clé | rôle |
|---|---|
| `biens` | une entrée par bien de `biens.json`, même clé. `c` : la teinte ; `d` : le tracé |
| `minerai`, `gemme` | tracés partagés. Un bien dont `d` vaut exactement `"MINERAI"` ou `"GEMME"` reçoit ce tracé au chargement — c'est ainsi que les quatre métaux et les trois pierres partagent une silhouette et ne diffèrent que par la teinte |
| `famillesArmes` | un tracé par famille de `armes.json`. Toutes les armes d'une famille partagent le dessin ; leur teinte vient de `teintesRang`, selon leur rang de frappe |
| `etoiles` | ajouté au tracé des armes mythiques, qui sont dorées |
| `teintesRang` | trois teintes, de l'arme la plus légère à la plus lourde de sa famille |
| `chariot`, `teintesChariots` | un seul tracé, une teinte par clé de `chariots.json` |
| `chien` | le chien du convoi |
| `pieces`, `teintesPiece` | un tracé par organe ; trois teintes, du niveau commun au niveau rare |
| `glyphesEvenement` | la bibliothèque de dessins des situations, nommés librement |
| `teintesEvenement` | une teinte par nature d'événement (`danger`, `meteo`, `tracas`, `rencontre`, `halte`, `trouvaille`, `ruines`, `pari`, `flanerie`, `charite`) |
| `evenements` | pour chaque **titre** d'événement : `[clé de glyphe, nature]`. Le titre doit correspondre **exactement** à celui de l'événement dans `index.html`, accents et apostrophes compris ; sinon l'événement s'affiche sans pictogramme |

---

## Les événements de route

Ils s'écrivent avec **[`../outils/atelier-evenements.html`](../outils/atelier-evenements.html)**,
en champs à remplir, sans une ligne de code. Deux pages l'accompagnent :

- **[`FORMAT-EVENEMENTS.md`](FORMAT-EVENEMENTS.md)** — la forme exacte du fichier :
  localisation, conditions, jets de dé, effets et textes à trous ;
- **[`../outils/TUTORIEL-EVENEMENTS.md`](../outils/TUTORIEL-EVENEMENTS.md)** — ce que
  fait chaque effet, en français, engendré depuis
  [`vocabulaire-evenements.json`](vocabulaire-evenements.json).

Ce dernier fichier est le **catalogue** : les effets, leurs réglages, les interrogations,
les formes de choix. L'atelier en tire ses formulaires, la documentation son tutoriel et
les contrôles leurs règles. Y ajouter une entrée la fait apparaître partout —
`node outils/construire.mjs` refabrique le tutoriel et réinjecte le catalogue dans la page.

---

## Les personnages

`data/personnages.json`, écrit avec
**[`../outils/atelier-personnages.html`](../outils/atelier-personnages.html)** et décrit
dans [`../outils/README.md`](../outils/README.md). Son catalogue est
[`vocabulaire-personnages.json`](vocabulaire-personnages.json) — les rôles, les accords
grammaticaux, et ce qui fait mériter une couche de lore.

Chaque personnage porte une **première description qui reste toujours lisible**, puis des
couches qui s'ouvrent à mesure qu'on le fréquente. C'est le socle du lore : les missions
écrites et les objets uniques s'y rattacheront.

Le moteur ne les lit pas encore.

Les deux réservoirs cohabitent : les 51 événements d'origine restent en JavaScript dans
`index.html` (voir ci-dessous), les nouveaux s'écrivent dans `data/evenements.json`, et
le tirage puise dans les deux.

## Les événements écrits en code

`EVENEMENTS` (les seize situations majeures) et `PETITS` (les sept familles de
situations mineures) sont restés dans `index.html`. Ce ne sont pas des données :
chaque choix est une fonction qui manipule l'état du jeu — `delester()`,
`blesserTroupe()`, `jet()`, `combat()`, `karmaBon()`. Les sortir en JSON aurait
voulu dire couper chaque événement en deux, un texte ici et un comportement
là-bas, reliés par leur titre — un couplage fragile pour aucun gain.

Seule leur part réellement statique est sortie : leur pictogramme et leur
nature, dans `icones.json → evenements`.

### Ajouter un événement majeur

Dans `index.html`, une entrée dans le tableau `EVENEMENTS` :

```js
{titre:'Pont effondré',oeil:'Le ciel change',poids:()=>1+S.etapes*.04,si:()=>S.etapes>=4,
 recit:'La crue a emporté le tablier…',
 choix:[
  {txt:'Remonter la rive',note:'Deux étapes de plus',
   act:()=>{allonger(2);return 'On remonte jusqu\'au gué…';}},
  {txt:'Traverser à gué',de:'agilité',note:()=>`agilité ${Math.round(agiliteTroupe())}`,ton:'mauvais',
   act:()=>{const j=jet({carac:Math.round(agiliteTroupe()/20),nom:'agilité',seuil:15,titre:'Passage'});
     return j.reussi?'Le convoi passe…':'Un chariot verse…';}}
 ]}
```

| clé | rôle |
|---|---|
| `titre` | sert de clé dans `icones.json → evenements` |
| `oeil` | la petite ligne au-dessus du récit |
| `recit` | texte, ou fonction qui renvoie un texte |
| `poids` | nombre ou fonction : sa fréquence relative au tirage (1 par défaut) |
| `si` | fonction facultative : l'événement ne peut sortir que si elle renvoie vrai |
| `choix` | de deux à quatre options |

Un choix : `txt` le libellé ; `note` texte ou fonction, la conséquence annoncée ;
`de` nom de la caractéristique jetée (affiche le dé), texte ou fonction ;
`ton:'mauvais'` teinte le bouton ; `si` masque l'option ; `bloque` la grise ;
`act` **doit renvoyer un texte**, c'est le récit de ce qui arrive.

### Ajouter un événement mineur

Dans `PETITS`, à l'intérieur d'une famille (`flanerie`, `trouvaille`, `tracas`,
`secours`, `charite`, `ruines`, `pari`) : même forme, dans `variantes`. Le
`poids` se règle sur la famille, pas sur la variante.

Dans les deux cas, **ajoutez le titre à `icones.json → evenements`** avec un
glyphe existant ou un nouveau tracé dans `glyphesEvenement`.
