/* Fabrique ce qui se déduit du catalogue.

   Une seule source — data/vocabulaire-evenements.json — alimente deux sorties :

     outils/TUTORIEL-EVENEMENTS.md   le mode d'emploi, en français
     outils/atelier-evenements.html  les listes de référence embarquées dans l'outil

   L'outil doit marcher par simple double-clic, donc en file:// : il ne peut aller
   chercher aucun fichier, et le catalogue voyage à l'intérieur de la page. C'est ce
   script qui l'y met, entre les balises <script id="reference">.

   À relancer après chaque modification du catalogue ou des données du jeu :

       node outils/construire.mjs                                             */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..');
const lit = (...p) => readFileSync(join(RACINE, ...p), 'utf8');
const litJson = (...p) => JSON.parse(lit(...p));

const V = litJson('data', 'vocabulaire-evenements.json');
const VP = litJson('data', 'vocabulaire-personnages.json');
const VO = litJson('data', 'vocabulaire-objets.json');
const VM = litJson('data', 'vocabulaire-missions.json');
const VD = litJson('data', 'vocabulaire-dialogues.json');

/* Les six modes d'emploi, retenus au passage : ils partent dans les fichiers
   .md **et** dans outils/tutoriels.html, qui les met en page. Une seule source,
   deux sorties — comme les catalogues et les formulaires. */
const TUTOS = {};

/* ════════════════════ 1. le tutoriel ════════════════════ */

const l = [];
const dit = (...t) => l.push(...t);

dit('# Écrire un événement — mode d\'emploi', '',
  '> Cette page est **engendrée** depuis [`data/vocabulaire-evenements.json`](../data/vocabulaire-evenements.json).',
  '> Ne la corrigez pas à la main : corrigez le catalogue et relancez',
  '> `node outils/construire.mjs`. L\'atelier d\'événements affiche exactement les mêmes',
  '> explications, tirées du même fichier.', '',
  'Un événement, c\'est une situation qui surgit, un récit, et deux à quatre façons d\'en',
  'sortir. Tout s\'écrit en champs à remplir — jamais une ligne de code.', '',
  'L\'outil qui les remplit est [`atelier-evenements.html`](atelier-evenements.html) : ouvrez-le',
  'd\'un double-clic. La forme exacte du fichier produit est décrite dans',
  '[`data/FORMAT-EVENEMENTS.md`](../data/FORMAT-EVENEMENTS.md). Cette page-ci explique',
  '**ce que chaque chose fait**.', '');

/* ── 1. les moments ── */
dit('## Quand l\'événement peut-il survenir', '');
dit('| moment | quand |', '|---|---|');
Object.entries(V.moments).forEach(([k, m]) =>
  dit(`| **${m.nom}** (\`${k}\`) | ${m.explique} |`));
dit('', 'S\'y ajoute la **localisation** : carte, lieu, contrée, rang, nature, terrain,',
  'itinéraire. Chaque critère rempli resserre ; un critère absent n\'exclut rien.', '');

/* ── 2. les formes de choix ── */
dit('## Les quatre façons de résoudre un choix', '',
  'Chaque option proposée au joueur prend **une** de ces formes.', '');
Object.entries(V.formes).forEach(([k, f]) => {
  dit(`### ${f.nom}`, '', f.explique, '');
  if (f.quand) dit(`*Quand s'en servir :* ${f.quand}`, '');
  if (f.variante) dit(`**${f.variante.nom}.** ${f.variante.explique}`, '');
});

/* ── 3. les effets ── */
dit('## Ce qu\'un choix peut faire', '',
  `${Object.keys(V.effets).length} effets, qu'on empile dans l'ordre qu'on veut. Chacun peut **retenir son**`,
  '**résultat** sous un nom, pour que le texte le cite ensuite entre accolades.', '');

const TYPES = V.typesDeChamp;
Object.entries(V.effets).forEach(([k, e]) => {
  dit(`### ${e.nom}`, '', e.explique, '');
  const params = Object.entries(e.parametres || {});
  if (params.length) {
    dit('| réglage | ce que c\'est | à savoir |', '|---|---|---|');
    params.forEach(([p, d]) => {
      const t = TYPES[d.type] ? TYPES[d.type].explique : '';
      const defaut = d.defaut !== undefined ? ` Par défaut : ${String(d.defaut).replace('.', ',')}.` : '';
      const requis = d.requis ? ' **Obligatoire.**' : '';
      dit(`| **${d.nom}** | ${t} | ${(d.aide || '') + defaut + requis} |`);
    });
    dit('');
  } else dit('*Aucun réglage.*', '');
  if (e.nomme) {
    dit(`**Ce qu'il retient** — ${e.nomme.explique}`, '');
    if (e.nomme.exemple) dit(`> ${e.nomme.exemple}`, '');
  }
});

/* ── 4. les interrogations ── */
dit('## Ce qu\'on peut demander à l\'état du convoi', '',
  'Ces mots servent aux conditions d\'apparition, aux choix grisés, aux seuils de dé et',
  'aux montants calculés.', '');
dit('| on demande | ce que ça vaut | |', '|---|---|---|');
Object.entries(V.interrogations).forEach(([k, q]) =>
  dit(`| **${q.nom}** | ${q.unite || ''} | ${q.explique || ''}${q.demande ? ` *Demande une précision : ${q.demande}.*` : ''} |`));
dit('');

/* ── 5. les valeurs ── */
dit('## Écrire un montant', '',
  'Partout où un nombre est attendu, quatre écritures sont possibles.', '',
  '| écriture | exemple | ce que ça donne |', '|---|---|---|',
  '| un nombre | `40` | 40, toujours |',
  '| une fourchette | `[18, 38]` | un tirage entre les deux |',
  '| une formule | `base 18, par étape 4` | 18 au départ, 98 à la vingtième étape |',
  '| une référence | `la mise × 0,8` | 80 % de la mise courante |', '',
  'Elles se combinent : *base 40, par étape 11, le tout × entre 0,8 et 1,6*.', '',
  'Dans l\'atelier ces quatre écritures sont un menu déroulant, et le montant obtenu',
  's\'affiche juste en dessous, calculé pour le convoi d\'essai. On n\'écrit jamais la',
  'formule à la main.', '');

/* ── 6. les textes ── */
dit('## Les textes', '',
  'Le récit, la note sous un bouton et le texte de chaque issue acceptent des **trous**',
  'entre accolades — le nom qu\'un effet a retenu, ou un mot du contexte.', '',
  '> On ne laisse que **{perdu}**. **{blesses.noms}** y laissent des plumes.', '',
  'Les nombres sortent à la française — *1 240*, pas *1240*. Un trou inconnu reste visible',
  'à l\'écran : une faute de frappe se voit au lieu de disparaître, et l\'atelier la signale',
  'avant que le joueur ne la découvre.', '',
  'Un texte peut aussi proposer **plusieurs variantes**, et le jeu en tire une au hasard :',
  'dans l\'atelier, séparez-les par une ligne vide.', '');

/* ── 7. ajouter au vocabulaire ── */
dit('## Il manque un effet ?', '',
  'Le vocabulaire est un catalogue ouvert, pas une liste figée. Décrivez l\'effet que vous',
  'voulez — *révéler un lieu sur la carte*, *faire monter un prix durablement*, *ouvrir une',
  'route* — il sera ajouté au catalogue et apparaîtra aussitôt dans l\'atelier, dans cette',
  'page et dans les vérifications.', '',
  'Même chose pour les paliers d\'un jet : ils sont une liste ouverte. Six degrés de',
  'réussite au lieu de trois, ce sont six paliers — le bouton *Ajouter un palier* ne',
  'compte pas jusqu\'à quatre.', '');

TUTOS['evenements'] = l.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
writeFileSync(join(ICI, 'TUTORIEL-EVENEMENTS.md'), TUTOS['evenements'], 'utf8');

/* ════════════════════ 1 bis. le tutoriel des personnages ════════════════════ */

const q = [];
const ecrit = (...t) => q.push(...t);

ecrit('# Écrire un personnage — mode d\'emploi', '',
  '> Cette page est **engendrée** depuis [`data/vocabulaire-personnages.json`](../data/vocabulaire-personnages.json).',
  '> Ne la corrigez pas à la main : corrigez le catalogue et relancez',
  '> `node outils/construire.mjs`.', '',
  'Un personnage, c\'est quelqu\'un à qui parler quelque part, ce qu\'on sait de lui tout de',
  'suite, et ce qu\'on n\'apprend qu\'à force. Il s\'écrit avec',
  '[`atelier-personnages.html`](atelier-personnages.html), en champs à remplir.', '',
  '## La règle qui ne bouge pas', '',
  'La **première description est toujours relisible**. Elle n\'est jamais scellée, jamais',
  'remplacée : c\'est ce qu\'on lit au premier contact et ce qu\'on retrouve dans l\'index dix',
  'heures plus tard. Tout le reste — les **couches** — se mérite et vient s\'ajouter en',
  'dessous, sans jamais rien recouvrir.', '');

ecrit('## Les rôles', '',
  `${Object.keys(VP.roles).length} rôles arrivent avec le jeu, et **la liste est ouverte**.`,
  'Deux façons d\'en ajouter, selon le moment.', '',
  'La **pile des rôles** — la bascule *Personnages / Rôles*, en haut de la liste de',
  'gauche — les tient à part. On y écrit un rôle **d\'avance**, avant qu\'aucun',
  'personnage ne le porte, et on lui donne un **dessin**.', '',
  'Le bouton **+ Nouveau rôle**, sous la liste déroulante d\'une fiche, en ajoute un',
  'sans quitter le personnage qu\'on est en train d\'écrire. Le rôle lui est attribué',
  'aussitôt — c\'est pour lui qu\'on l\'a fait.', '',
  '### Le dessin d\'un rôle sert de recours', '',
  'Un personnage qui n\'a pas de pictogramme à lui prend **celui de son rôle**, champ',
  'par champ : son glyphe et la teinte du rôle, ou l\'inverse. Dessiner *batelier*',
  'une fois pourvoit donc tous les bateliers d\'un coup, et celui qui a son propre',
  'dessin le garde.', '',
  '| rôle | ce que ça vous donne | au féminin |', '|---|---|---|');
Object.entries(VP.roles).forEach(([k, d]) =>
  ecrit(`| **${d.nom}** | ${d.explique} | ${d.feminin || '*le même*'} |`));
ecrit('');

ecrit('### Ce qu\'un rôle demande', '',
  'Trois champs, dont un seul est obligatoire.', '',
  '| champ | ce qu\'on y met | obligatoire |', '|---|---|---|',
  '| **Nom** | `Maître de poste` — tel qu\'on le lira. ' +
    '**Accents, espaces et majuscules sont les bienvenus.** | oui |',
  '| **Au féminin** | `Maîtresse de poste`. **À laisser vide si le mot ne change pas.** | non |',
  '| **Ce qu\'il fait** | une phrase, pour vous y retrouver dans six mois. | non |', '',
  'La **clé** ne se tape jamais : elle se fabrique toute seule à partir du nom, en',
  'minuscules, sans accent, les espaces devenus des tirets — *Maître de poste* donne',
  '`maitre-de-poste`. C\'est elle que les fichiers portent, et c\'est pour ça qu\'elle',
  'reste simple. Deux conséquences :', '',
  '- deux noms qui donnent la même clé ne peuvent pas coexister, et l\'atelier vous le',
  '  dit **avant** d\'ajouter, en nommant celui qui occupe la place ;',
  '- renommer un rôle change sa clé, et les personnages qui le portaient **suivent**',
  '  tout seuls. Rien à recoller.', '');

ecrit('### Le féminin est déclaré, jamais deviné', '',
  'Écrivez **{role}** dans un texte : il sort accordé sur l\'**accord** du personnage.',
  'Le texte s\'écrit une fois et sert aux deux.', '',
  '> Le convoi trouve **{le} {role}** devant la porte close.', '',
  'Aucune règle ne devine le féminin d\'un mot français : *échevin* fait *échevine*,',
  'mais *guide* ne prend pas de e et *veneur* fait *veneuse*. Le rôle porte donc le sien,',
  'écrit à la main — et les rôles épicènes laissent le champ vide, ce qui est le cas',
  /* « de aubergiste » ne se dit pas, et ce paragraphe parle justement d'élision */
  (() => {
    const e = Object.entries(VP.roles).filter(([, d]) => !d.feminin)
      .map(([, d]) => `*${d.nom.toLowerCase()}*`);
    const premier = e[0].replace(/^\*/, '');
    return (/^[aeiouyéèêh]/.test(premier) ? "d'" : 'de ') + e.join(', ') + '.';
  })(), '',
  'Si un personnage est **féminin** et que son rôle n\'a pas de féminin déclaré alors que',
  'sa terminaison en appellerait un, l\'atelier vous le signale en or. Ce n\'est pas une',
  'faute : c\'est peut-être voulu.', '',
  '> **Attention à l\'élision.** `{le} {role}` donne « le échevin ». Devant une voyelle,',
  '> écrivez l\'article vous-même : `L\'{role} ne dit rien.`', '');

ecrit('### Où ils vivent', '',
  'Les rôles que vous ajoutez sont rangés à part des personnages, parce qu\'un rôle',
  'survit au personnage qui l\'a fait naître. On les retrouve dans le **codex** du hub,',
  'sous *Les rôles*, avec le nombre de personnages qui les portent, et un bouton pour',
  'les rouvrir.', '',
  'Ils n\'ont **pas de fichier à eux** : ils voyagent dans `personnages.json`, sous une',
  'clé `roles`, et l\'atelier n\'y met que ceux dont vos personnages se servent. C\'est ce',
  'qui permet au jeu d\'écrire `{role}` sans qu\'on lui porte un second fichier — et une',
  'occasion de moins de l\'oublier.', '');

ecrit('## À quelles conditions il se tient là', '',
  'Un personnage peut porter un **si**. Tant qu\'il n\'est pas rempli, il **n\'est pas',
  'là** : ni grisé, ni annoncé, absent — et la mission dont il est le commanditaire',
  'ne s\'offre pas non plus. C\'est ainsi qu\'on fait paraître quelqu\'un au milieu',
  'd\'une partie, après une mission, un objet trouvé, une réputation gagnée.', '',
  'Le champ est sous *Où on le trouve*. Il parle le même vocabulaire que les',
  'conditions d\'un dialogue ou d\'une offre de mission : il n\'y a rien de neuf à',
  'apprendre pour l\'écrire.', '',
  '| ce qu\'on regarde | à quoi ça sert |', '|---|---|',
  '| **Une mission en est là** | il paraît quand une mission est *accomplie*, et pas avant |',
  '| **On porte cet objet** | il ne se montre qu\'à qui tient tel objet |',
  '| **On a déjà vu quelqu\'un** | lui-même, à la troisième visite — ou quelqu\'un d\'autre |',
  '| **On a retenu quelque chose** | un souvenir laissé par un dialogue |',
  '| **L\'état du convoi** | l\'or, la réputation, le karma, les étapes… |', '',
  'Une fois **rencontré**, il reste à l\'index du carnet quoi qu\'il arrive : ce qu\'on a',
  'appris de quelqu\'un ne se referme pas parce qu\'il a quitté sa place. Laissez le',
  'champ vide et il se tient là dès le premier jour.', '');

ecrit('## Ce qui fait mériter une couche', '',
  'Une couche s\'ouvre quand **toutes** ses conditions sont vraies. Trois d\'entre elles',
  'parlent de la relation avec ce personnage :', '',
  '| on regarde | unité | |', '|---|---|---|');
Object.entries(VP.interrogations).forEach(([k, d]) =>
  ecrit(`| **${d.nom}** | ${d.unite || ''} | ${d.explique || ''} |`));
ecrit('', 'S\'y ajoute tout ce qu\'on peut demander à l\'état du convoi — l\'or, la réputation,',
  'le karma, les étapes parcourues : le même vocabulaire que les événements, décrit dans',
  '[`TUTORIEL-EVENEMENTS.md`](TUTORIEL-EVENEMENTS.md).', '',
  'Les couches se comptent **dans l\'ordre où vous les rangez**. La troisième peut donc',
  'demander d\'avoir déjà les deux premières, et l\'atelier vous prévient si vous en demandez',
  'plus qu\'il n\'y en a au-dessus — une couche qui ne s\'ouvrirait jamais.', '');

ecrit('## Les trous dans les textes', '',
  'La première description et le texte de chaque couche acceptent des trous entre accolades.',
  'Ils évitent d\'écrire deux fois le même personnage au masculin et au féminin.', '',
  '| trou | ce que ça donne | exemple |', '|---|---|---|');
Object.entries(VP.trous).forEach(([k, d]) =>
  ecrit(`| \`{${k}}\` | ${d.explique} | ${d.exemple || ''} |`));
ecrit('', 'L\'**accord** choisi sur la fiche décide de tout : `{il}` devient *elle*, `{le}`',
  'devient *la*, et `arrivé{e}` devient *arrivée*. Un trou inconnu reste visible à l\'écran,',
  'et l\'atelier le signale.', '');

ecrit('## Ce que l\'atelier vérifie', '',
  '- une clé unique, un nom, et surtout **une première description** ;',
  '- le lieu existe vraiment dans le `monde.json` chargé ;',
  '- chaque couche a un texte, et des conditions qui la font mériter ;',
  '- aucune couche n\'exige plus de couches connues qu\'il n\'y en a avant elle ;',
  '- les trous des textes correspondent à quelque chose ;',
  '- la couverture : quels lieux ont quelqu\'un à qui parler, lesquels sont déserts.', '',
  'Et l\'onglet **Où en est-on** relit la fiche à n\'importe quel moment de la relation :',
  'c\'est là qu\'on voit ce qui reste scellé au bout de trois rencontres, et ce qui s\'ouvre',
  'à la dixième.', '');

TUTOS['personnages'] = q.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
writeFileSync(join(ICI, 'TUTORIEL-PERSONNAGES.md'), TUTOS['personnages'], 'utf8');

/* ════════════════════ 1 ter. le tutoriel des objets ════════════════════ */

const s = [];
const note = (...t) => s.push(...t);

note('# Écrire un objet unique — mode d\'emploi', '',
  '> Cette page est **engendrée** depuis [`data/vocabulaire-objets.json`](../data/vocabulaire-objets.json).',
  '> Ne la corrigez pas à la main : corrigez le catalogue et relancez',
  '> `node outils/construire.mjs`.', '',
  'Le jeu connaît déjà quatre familles de choses : les marchandises, les armes, les',
  'chariots et leurs pièces. Ce sont des choses qu\'on **achète**. Voici la cinquième :',
  'l\'objet qui n\'existe qu\'en un exemplaire, qu\'on ne trouve qu\'une fois, et dont on',
  'apprend l\'histoire à force de l\'avoir sous les yeux.', '',
  'Il s\'écrit avec [`atelier-objets.html`](atelier-objets.html), en champs à remplir.', '',
  '## La règle qui ne bouge pas', '',
  'Comme pour les personnages : **la première description reste toujours lisible**. Les',
  '**couches** se méritent et s\'ajoutent en dessous, sans jamais rien recouvrir.', '');

note('## Les genres', '',
  `${Object.keys(VO.genres).length} genres, et la liste est ouverte.`, '',
  '| genre | ce que c\'est |', '|---|---|');
Object.entries(VO.genres).forEach(([k, d]) => note(`| **${d.nom}** | ${d.explique} |`));
note('');

note('## Ce qu\'un objet peut faire', '',
  `${Object.keys(VO.pouvoirs).length} pouvoirs, qu'on empile. Un objet sans aucun pouvoir est`,
  'parfaitement valable : une relique n\'a pas à être utile.', '');
Object.entries(VO.pouvoirs).forEach(([k, d]) => {
  note(`### ${d.nom}`, '', d.explique, '');
  const params = Object.entries(d.parametres || {});
  if (params.length) {
    note('| réglage | à savoir |', '|---|---|');
    params.forEach(([p, dd]) => {
      const defaut = dd.defaut !== undefined ? ` Par défaut : ${String(dd.defaut).replace('.', ',')}.` : '';
      const requis = dd.requis ? ' **Obligatoire.**' : '';
      note(`| **${dd.nom}** | ${(dd.aide || '') + defaut + requis} |`);
    });
    note('');
  }
});

note('## D\'où il vient', '',
  'Sans provenance, un objet **n\'entre jamais dans la partie**. C\'est le seul champ que',
  'l\'atelier refuse de laisser vide, avec le nom et la première description.', '');
Object.entries(VO.provenances).forEach(([k, d]) => {
  note(`### ${d.nom}`, '', d.explique, '');
  Object.entries(d.parametres || {}).forEach(([p, dd]) =>
    note(`- **${dd.nom}**${dd.requis ? ' *(obligatoire)*' : ''}${dd.aide ? ' — ' + dd.aide : ''}`));
  if (Object.keys(d.parametres || {}).length) note('');
});
note('> **Au bout d\'une mission** est la provenance la plus solide : il a fallu aller',
  '> quelque part et le rapporter. L\'atelier note les clés de mission attendues, pour que',
  '> vous les écriviez avec exactement les mêmes dans l\'atelier de missions.', '');

note('## Ce qui fait mériter une couche', '',
  '| on regarde | unité | |', '|---|---|---|');
Object.entries(VO.interrogations).forEach(([k, d]) =>
  note(`| **${d.nom}** | ${d.unite || ''} | ${d.explique || ''} |`));
note('', 'S\'y ajoute l\'état du convoi — l\'or, la réputation, le karma, les étapes.',
  'Les couches se comptent dans l\'ordre : la troisième peut demander d\'avoir déjà les',
  'deux premières, et l\'atelier refuse celle qui en exigerait plus qu\'il n\'y en a',
  'au-dessus d\'elle.', '');

note('## Les trous dans les textes', '',
  '| trou | ce que ça donne | exemple |', '|---|---|---|');
Object.entries(VO.trous).forEach(([k, d]) =>
  note(`| \`{${k}}\` | ${d.explique} | ${d.exemple || ''} |`));
note('', 'L\'**accord** choisi décide de tout : `{il}`, `{le}`, `{un}`, et `retrouvé{e}`',
  'qui donne *retrouvée*. On écrit le texte une fois.', '');

note('## L\'onglet « Ce que ça pèse »', '',
  'C\'est là qu\'on juge un objet, parce qu\'un objet unique ne se juge que par comparaison.',
  'L\'atelier situe sa frappe parmi les armes qui existent déjà — les trois mythiques',
  'comprises —, traduit un bonus de karma en points de dé, chiffre ce qu\'un rabais fait',
  'sur mille pièces, et dit quelle part d\'un chariot son poids occupe.', '',
  'Un objet trop fort ne se voit pas quand on l\'écrit seul dans son coin. Il se voit là.', '');

TUTOS['objets'] = s.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
writeFileSync(join(ICI, 'TUTORIEL-OBJETS.md'), TUTOS['objets'], 'utf8');

/* ════════════════════ 1 quater. le tutoriel des missions ════════════════════ */

const r = [];
const dis = (...t) => r.push(...t);

dis('# Écrire une mission — mode d\'emploi', '',
  '> Cette page est **engendrée** depuis [`data/vocabulaire-missions.json`](../data/vocabulaire-missions.json).',
  '> Ne la corrigez pas à la main : corrigez le catalogue et relancez',
  '> `node outils/construire.mjs`.', '',
  'Le jeu propose déjà des contrats à chaque marché : il les tire au sort à partir de la',
  'carte des raretés, et ils ne se répètent jamais tout à fait. **Ces missions-ci sont',
  'autre chose** — elles s\'écrivent une par une, elles ne surviennent qu\'une fois, et',
  'elles sont données par quelqu\'un qui existe.', '',
  'Elles s\'écrivent avec [`atelier-missions.html`](atelier-missions.html), et cohabitent',
  'avec les offres tirées au sort sans les remplacer.', '');

dis('## Le lien avec le personnage vit dans la mission', '',
  VM.principe, '',
  'C\'est le point qui compte à l\'usage. L\'onglet **Personnages** de l\'atelier montre qui',
  'se tient dans la zone que vous choisissez — tout le monde, une contrée, ou un lieu — avec',
  'pour chacun le début de sa description et le nombre de missions qu\'il donne déjà. Un',
  'bouton **Confier** attache la mission courante à cette personne.', '',
  'La liste indique aussi qui n\'a encore **aucune** mission. Ce n\'est pas un défaut à',
  'corriger : c\'est la façon normale de travailler.', '');

dis('## Les jalons', '',
  `${Object.keys(VM.jalons).length} genres de jalon, dans l'ordre où vous les rangez.`, '');
Object.entries(VM.jalons).forEach(([k, d]) => {
  dis(`### ${d.nom}`, '', d.explique, '');
  Object.entries(d.parametres || {}).forEach(([p, dd]) =>
    dis(`- **${dd.nom}**${dd.requis ? ' *(obligatoire)*' : ''}${dd.aide ? ' — ' + dd.aide : ''}`));
  dis('');
});
dis('L\'onglet **Le fil** déroule le chemin que la mission fait parcourir, et calcule ce',
  'qu\'il coûte en étapes — le plus court chemin sur le réseau de voies de votre',
  '`monde.json`. Si le délai que vous accordez ne suffit pas, l\'atelier refuse la mission :',
  'elle serait impossible à tenir.', '');

dis('## Ce qu\'elle rapporte', '',
  `${Object.keys(VM.recompenses).length} récompenses, empilables, à la réussite comme à l'échec`,
  '(avec des montants négatifs, pour l\'échec).', '');
Object.entries(VM.recompenses).forEach(([k, d]) => {
  dis(`### ${d.nom}`, '', d.explique, '');
  Object.entries(d.parametres || {}).forEach(([p, dd]) =>
    dis(`- **${dd.nom}**${dd.requis ? ' *(obligatoire)*' : ''}${dd.aide ? ' — ' + dd.aide : ''}`));
  dis('');
});
dis('> **Un objet unique** doit être d\'accord des deux côtés : la mission dit qu\'elle le',
  '> donne, et l\'objet dit qu\'il vient de cette mission. Chargez votre `objets.json` et',
  '> l\'atelier vérifie les deux sens, clé par clé.', '');

dis('## Les trous dans les textes', '',
  '| trou | ce que ça donne | exemple |', '|---|---|---|');
Object.entries(VM.trous).forEach(([k, d]) =>
  dis(`| \`{${k}}\` | ${d.explique} | ${d.exemple || ''} |`));
dis('', '`{il}` s\'accorde sur l\'**accord** du commanditaire, celui que vous avez choisi dans',
  'l\'atelier de personnages. Vous écrivez le texte une fois.', '');

dis('## Ce que l\'atelier vérifie', '',
  '- une clé unique, un titre, un texte d\'offre, un texte de réussite, au moins un jalon ;',
  '- les lieux, les personnages et les objets cités existent dans les fichiers chargés ;',
  '- le délai suffit pour le trajet — et vous prévient quand la marge tient à une étape ;',
  '- aucun jalon n\'est posé dans un lieu qu\'aucune voie ne relie au reste du trajet ;',
  '- un personnage à rencontrer a bien un lieu où le trouver ;',
  '- un objet promis pointe bien vers cette mission, et réciproquement ;',
  '- les trous des textes correspondent à quelque chose.', '',
  'Une mission **sans commanditaire** n\'est pas une faute : elle est simplement en attente.',
  'L\'atelier le signale en or, pas en rouge.', '');

TUTOS['missions'] = r.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
writeFileSync(join(ICI, 'TUTORIEL-MISSIONS.md'), TUTOS['missions'], 'utf8');

/* ════════════════════ 1 quinquies. le tutoriel des icônes ════════════════════
   Celui-ci n'a pas de vocabulaire à lui : ses formes vivent dans l'atelier, et
   ses teintes dans data/icones.json. On relit donc les deux, pour qu'une forme
   ajoutée à l'outil apparaisse ici sans qu'on y pense. */

const ICO = litJson('data', 'icones.json');
const pageIcones = (() => { try { return lit('outils', 'atelier-icones.html'); }
                            catch (e) { return ''; } })();

const formesDeclarees = [...pageIcones.matchAll(/^ {2}(\w+):\{nom:'([^']+)'/gm)]
  .map(([, cle, nom]) => ({ cle, nom }));

const reglagesDeclares = (() => {
  const bloc = /const REGLAGES=\{([\s\S]*?)\n\};/.exec(pageIcones);
  if (!bloc) return {};
  const par = {};
  let courant = null;
  for (const m of bloc[1].matchAll(/(\w+):\[|\['(\w+)','([^']+)',(-?[\d.]+),(-?[\d.]+)/g)) {
    if (m[1]) { courant = m[1]; par[courant] = []; }
    else if (courant) par[courant].push({ cle: m[2], nom: m[3], min: m[4], max: m[5] });
  }
  return par;
})();

const t = [];
const trace = (...x) => t.push(...x);
/* 0.4 se dit « 0,4 » en français, et .4 ne se dit pas du tout */
const chiffre = (v) => (Math.abs(Number(v)) < 1 && Number(v) !== 0
  ? String(Number(v)).replace(/^(-?)\./, '$10.') : String(v)).replace('.', ',');

trace('# Dessiner une icône — mode d\'emploi', '',
  '> Cette page est **engendrée** depuis [`data/icones.json`](../data/icones.json) et',
  '> depuis l\'atelier lui-même. Ne la corrigez pas à la main : corrigez la source et',
  '> relancez `node outils/construire.mjs`.', '');

trace('Le jeu dessine tout en **SVG**, dans un carré de 24 sur 24, et ne pose jamais de',
  'couleur dans le dessin : il écrit `currentColor`, et c\'est la **teinte** qui décide de',
  'la couleur au moment de l\'affichage. Une icône se réutilise donc telle quelle en rouge',
  'de danger ou en vert de rencontre — vous ne la dessinez qu\'une fois.', '',
  'L\'atelier est [`atelier-icones.html`](atelier-icones.html). Ce que vous y dessinez',
  'rejoint le dépôt commun, et apparaît aussitôt dans les listes de dessins des autres',
  'ateliers, à la suite des ' + Object.keys(ICO.glyphesEvenement).length + ' dessins livrés avec le jeu.', '');

trace('## La planche', '',
  'La planche est ce carré de 24 sur 24, agrandi. Les repères tous les 4 carreaux vous',
  'aident à viser le centre, qui tombe sur 12, 12.', '',
  '- **Ajouter** une forme la pose au milieu, et la sélectionne.',
  '- **Glisser** une forme la déplace. Le pas est le quart de carreau : on ne peut pas',
  '  poser une forme à un endroit qui ne se raconte pas.',
  '- La **poignée d\'or**, en bas à droite de la forme choisie, la redimensionne.',
  '- Les réglages fins — épaisseur, arrondi, nombre de branches — se font aux curseurs,',
  '  sous la liste des formes.', '',
  '> Une icône dépasse rarement du cadre sans que ce soit une erreur : l\'atelier vous',
  '> prévient dès qu\'une forme sort des 24 carreaux, parce qu\'elle serait rognée en jeu.', '');

trace('## Les formes', '',
  `${formesDeclarees.length} formes, qui se superposent dans l'ordre où vous les empilez —`,
  'la dernière de la liste est celle qui se dessine par-dessus.', '');
trace('| forme | ce qu\'elle règle |', '|---|---|');
formesDeclarees.forEach(({ cle, nom }) => {
  const p = (reglagesDeclares[cle] || [])
    .map((d) => `**${d.nom}** (${chiffre(d.min)} à ${chiffre(d.max)})`);
  trace(`| ${nom} | ${p.join(', ') || '—'} |`);
});
trace('', 'Chaque forme se dit **pleine** ou **creuse**, sauf le trait et l\'arc, qui n\'ont',
  'que leur épaisseur. Une forme creuse ne montre que son contour : c\'est ce qui donne',
  'aux dessins du jeu leur air gravé.', '');

trace('## La teinte', '',
  `Les ${Object.keys(ICO.teintesEvenement).length} teintes du jeu portent un nom, parce qu'elles`,
  'veulent dire quelque chose — un événement de danger est rouge partout, sans qu\'on ait à',
  'le décider deux fois.', '');
trace('| teinte | couleur | ce qu\'elle annonce |', '|---|---|---|');
const ANNONCE = {
  danger: 'un péril, une menace, du sang', meteo: 'le ciel, le vent, le froid',
  tracas: 'un ennui matériel, une avarie', rencontre: 'quelqu\'un sur la route',
  halte: 'un répit, un abri, de l\'eau', trouvaille: 'une aubaine, un gain',
  ruines: 'de la pierre ancienne, l\'oubli', pari: 'le hasard, le jeu, le risque choisi',
  flanerie: 'une lenteur, un détour sans enjeu', charite: 'un geste donné ou reçu'
};
Object.entries(ICO.teintesEvenement).forEach(([k, c]) =>
  trace(`| \`${k}\` | \`${c}\` | ${ANNONCE[k] || ''} |`));
trace('', 'Vous n\'y êtes pas tenu : le bouton **Couleur libre**, à côté de la liste, ouvre un',
  'sélecteur et accepte n\'importe quelle couleur. Une teinte libre est retenue avec',
  'l\'élément, et suit le même chemin qu\'une teinte nommée.', '',
  'La règle de priorité est simple, et vaut dans tous les ateliers : **la teinte posée sur',
  'l\'élément l\'emporte**, sinon on prend celle de la nature choisie, sinon l\'or du jeu.', '');

trace('## Aux vraies tailles', '',
  'Un dessin juste sur la planche peut être illisible à 16 pixels : deux traits qui se',
  'frôlent deviennent une tache. Cet onglet montre l\'icône aux quatre tailles où le jeu',
  's\'en sert — 16, 24, 32 et 48 — sur les deux fonds, le vélin clair et le bois sombre, et',
  'dans chacune des teintes nommées.', '',
  'C\'est le seul juge. Si le dessin ne tient pas à 16, épaississez plutôt que d\'ajouter.', '');

trace('## La source', '',
  'L\'onglet **La source** montre le SVG produit, tel qu\'il partira dans le jeu. Il est en',
  'lecture seule : on ne corrige pas le dessin par son texte.', '',
  'Le champ **SVG collé**, lui, est une porte de sortie. Si vous avez un dessin fait',
  'ailleurs, collez-le : il remplace entièrement les formes de la planche. Deux conditions,',
  'que l\'atelier vérifie —', '',
  '- le dessin doit être écrit pour un cadre de 24 sur 24, sans balise `<svg>` autour ;',
  '- il doit dire `currentColor` au moins une fois, sinon la teinte ne le touchera pas.', '',
  'Le contenu d\'un `<script>` est refusé.', '');

trace('## Ce que l\'atelier vérifie', '',
  '- une clé unique, en minuscules sans accent, et un nom ;',
  '- que la clé n\'écrase pas un des dessins livrés avec le jeu ;',
  '- qu\'il y a au moins une forme, ou du SVG collé ;',
  '- qu\'aucune forme ne sort du cadre ;',
  '- que le SVG collé est du dessin, et qu\'il obéit à la teinte.', '');

trace('## Où vos icônes servent', '',
  'Rien à exporter à la main : le dépôt du hub suffit. Une icône dessinée ici apparaît',
  'dans la liste des dessins de l\'atelier d\'événements, de personnages, d\'objets et de',
  'missions, en dessous des dessins du jeu, et se choisit comme les autres.', '');

TUTOS['icones'] = t.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
writeFileSync(join(ICI, 'TUTORIEL-ICONES.md'), TUTOS['icones'], 'utf8');

/* ════════════════════ 1 quinquies bis. le tutoriel du calendrier ════════════════════
   Il se lit dans data/calendrier.json : changer l'horloge livrée change le
   mode d'emploi, sans qu'on ait à y penser. */

const CAL = litJson('data', 'calendrier.json');
const kal = [];
const horloge = (...x) => kal.push(...x);
const romainCal = (n) => {
  const t = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
             [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let r = '', v = Math.max(1, Math.round(n || 1));
  t.forEach(([p, s]) => { while (v >= p) { r += s; v -= p; } });
  return r;
};
const jpa = CAL.joursParMois * CAL.mois.length;

horloge('# Le calendrier — mode d\'emploi', '',
  '> Cette page est **engendrée** depuis [`data/calendrier.json`](../data/calendrier.json).',
  '> Ne la corrigez pas à la main : corrigez le fichier — ou l\'atelier — et relancez',
  '> `node outils/construire.mjs`.', '');

horloge('## Où le trouver', '',
  'L\'atelier est [`atelier-calendrier.html`](atelier-calendrier.html), depuis le hub ou',
  'depuis le bandeau de n\'importe quel atelier. Il tient dans une page : la forme du',
  'temps, les mois, les moments du jour, et le premier jour du monde.', '');

horloge('## Ce que le temps fait dans le jeu', '',
  '**Une étape de voyage vaut une journée.** Le jour tourne à chaque pas de la route, pas',
  'à l\'arrivée : une traite de cinq étapes coûte cinq jours. La date se lit en haut de',
  'l\'écran du marché, et en entier sur l\'écran de fin.', '',
  'L\'**heure**, elle, n\'a qu\'un pouvoir pour l\'instant : elle décide de la lumière sur la',
  'cité où l\'on débouche. Une longue traite arrive au couchant, une courte au matin. Tout',
  'le reste — les cols qui se ferment, les relevés du comptable qui se périment, une',
  'créature qui ne sort que certains mois — viendra s\'accrocher là, et ne coûtera alors',
  'qu\'une condition de plus.', '');

const jps = Array.isArray(CAL.jours) ? CAL.jours.length : 0;
horloge('## La forme du temps', '', '| | |', '|---|---|',
  `| Heures dans une journée | **${CAL.heuresParJour}** |`,
  `| Jours dans un mois | **${CAL.joursParMois}** |`,
  `| Mois dans une année | **${CAL.mois.length}** |`,
  `| Jours dans une semaine | **${jps || 'aucune semaine'}** |`,
  `| Jours dans une année | **${jpa}** — donc ${jpa} étapes de voyage |`, '');

horloge('Les trois premiers se règlent dans l\'atelier ; le quatrième s\'en déduit. Changer la',
  'longueur d\'un jour ramène les moments dans la nouvelle journée : rien ne peut sortir',
  'des bornes.', '');

horloge('## Les mois', '');
if (CAL.mois.some((m) => m.saison)) {
  horloge('| Rang | Nom | Saison |', '|---|---|---|');
  CAL.mois.forEach((m, i) => horloge(`| ${i + 1} | **${m.nom}** | ${m.saison || '—'} |`));
} else {
  horloge('| Rang | Nom |', '|---|---|');
  CAL.mois.forEach((m, i) => horloge(`| ${i + 1} | **${m.nom}** |`));
}
horloge('', 'Le **nom** paraît partout dans le jeu. La **saison** ne sert encore à rien et attend',
  'les cols qui s\'ouvrent et se ferment ; posez-la quand même, elle sera lue le jour venu.', '',
  'Chaque mois garde une **clé** invisible et stable : renommer un mois ne casse rien de',
  'ce qui s\'y accroche. Les flèches le déplacent, la croix l\'ôte — il en faut au moins un.', '');

horloge('## La semaine', '');
if (jps) {
  horloge('| Rang | Nom |', '|---|---|');
  CAL.jours.forEach((j, i) => horloge(`| ${i + 1} | **${j.nom}** |`));
  horloge('', 'Sa longueur **est la longueur de cette liste** : elle n\'est pas déclarée à côté,',
    'pour qu\'aucun des deux nombres ne puisse démentir l\'autre. Le champ *Jours dans une',
    'semaine* allonge ou raccourcit la liste, et garde les noms déjà écrits.', '',
    'Elle **court sans s\'interrompre** : elle ne repart pas au premier de chaque mois, pas',
    'plus que notre lundi ne le fait. Le jour ' + (jpa % jps === 0
      ? `tombe donc toujours au même rang d'un mois à l'autre, puisque ${jps} divise ${jpa}.`
      : `ne tombe donc pas au même rang d'un mois à l'autre, puisque ${jps} ne divise pas ${jpa}.`),
    '', 'Le nom du jour paraît dans la **date entière** — celle de l\'écran de fin et de',
    'l\'aperçu de l\'atelier. Les mentions au fil d\'une phrase — « reçu le 17ᵉ jour du',
    `${CAL.mois[0].nom} » — gardent le quantième seul, pour rester courtes.`, '');
} else {
  horloge('Aucune semaine dans ce calendrier : la liste `jours` est vide. Les jours ne portent',
    'que leur quantième, et rien n\'ira chercher de nom de jour. Mettez un nombre dans',
    '*Jours dans une semaine* pour en avoir une.', '');
}

horloge('## Les moments du jour', '');
horloge('| Moment | De | À |', '|---|---|---|');
const NOM_MOMENT = { aube: 'Le petit matin', midi: 'Le plein midi',
                     couchant: 'Le soleil couchant', nuit: 'La nuit tombée' };
CAL.moments.forEach((m) => horloge(`| ${NOM_MOMENT[m.cle] || m.cle} | ${m.de}ʰ | ${m.a}ʰ |`));
horloge('', 'Un moment peut **enjamber minuit** : la nuit va de ' + CAL.moments[3].de + ' à ' +
  CAL.moments[3].a + ', et l\'atelier le comprend sans qu\'on ait rien à dire.', '',
  'Le ruban coloré sous les champs montre la journée entière, heure par heure. Une case',
  '**grise** est une heure que personne ne réclame — ce n\'est pas une panne, elle retombe',
  'sur le premier moment, mais c\'est presque toujours un oubli. Une heure réclamée par',
  'deux moments revient au premier de la liste ; l\'atelier vous le dit aussi.', '');

const d0 = CAL.debut;
horloge('## Le premier jour du monde', '',
  `La première étape d'une partie tombe le **${d0.jour}${d0.jour === 1 ? 'ᵉʳ' : 'ᵉ'} jour du ` +
  `${CAL.mois[d0.mois].nom}, an ${romainCal(d0.annee)}**, à ${d0.heure} heures.`, '',
  'Tout le reste se compte à partir de là. Décaler ce jour décale l\'histoire entière —',
  'utile quand on veut qu\'une partie commence juste avant la fermeture d\'un col.', '');

horloge('## Les trois boutons de la barre', '', '| | |', '|---|---|',
  '| **Tirer au sort** | Des nombres plausibles, et rien d\'autre : il ne nomme jamais un mois autrement que « Mois I ». C\'est un banc d\'essai, pas un générateur de récit. |',
  '| **Repartir de l\'horloge nue** | Rétablit le calendrier livré, celui qui ne dit rien. |',
  '| **Exporter calendrier.json** | Le fichier que le jeu lit. Posez-le dans `data/`. |', '');

horloge('## Où poser le vôtre', '',
  'Deux endroits, au choix :', '',
  '- **`data/calendrier.json`** — le fichier livré. Le remplacer suffit.',
  '- **`data/<votre dossier>/calendrier.json`** — un calendrier d\'auteur, qui l\'emporte',
  '  sur le premier quand il existe. C\'est la voie à prendre si vous voulez garder vos',
  '  noms hors d\'un dépôt public : le jeu tourne sans, avec l\'horloge nue.', '',
  'Dans les deux cas le jeu se charge du reste : il n\'y a rien à déclarer ailleurs.', '');

horloge('## Ce que l\'atelier vous dit', '',
  'La colonne de droite montre trois choses en permanence : le **premier mois** jour par',
  'jour, **un jour au hasard** traduit en date — tapez 137 et il vous dit où cela tombe —',
  'et **ce qui cloche** : un mois sans nom, deux mois du même nom, une heure orpheline,',
  'une heure réclamée deux fois.', '',
  'Il vous signale aussi, en vert, quand vos mois portent **vos** noms plutôt que « Mois I ».',
  'Ce n\'est pas un reproche : c\'est un rappel que ce fichier-là n\'a plus rien de jetable.', '');

TUTOS['calendrier'] = kal.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
writeFileSync(join(ICI, 'TUTORIEL-CALENDRIER.md'), TUTOS['calendrier'], 'utf8');

/* ════════════════════ 1 sexies. le tutoriel des dialogues ════════════════════ */

const u = [];
const conte = (...x) => u.push(...x);
/* « par défaut : false » ne se lit pas — un catalogue en français le dit en français */
const motDefaut = (v) => v === true ? 'oui' : v === false ? 'non'
  : String(v).replace('.', ',');
const table = (o, titre) => {
  conte(`| ${titre} | ce que c'est | |`, '|---|---|---|');
  Object.entries(o).forEach(([k, d]) => conte(
    `| **${d.nom}** \`${k}\` | ${d.explique || d.aide || ''} | ` +
    `${d.requis ? '**obligatoire**' : (d.defaut !== undefined ? 'par défaut : ' +
      motDefaut(d.defaut) : '')} |`));
  conte('');
};

conte('# Écrire un dialogue — mode d\'emploi', '',
  '> Cette page est **engendrée** depuis [`data/vocabulaire-dialogues.json`](../data/vocabulaire-dialogues.json).',
  '> Ne la corrigez pas à la main : corrigez le catalogue et relancez',
  '> `node outils/construire.mjs`.', '',
  VD.apropos, '', '## Le principe', '', VD.principe, '',
  'En jeu, un onglet **Les gens** paraît dans une ville où quelqu\'un se tient. On y',
  'voit qui est là, ce qu\'on sait de lui, et un bouton par conversation qu\'il a à',
  'offrir. Une pastille compte celles qu\'on n\'a pas encore eues.', '');

conte('## Un dialogue', '');
table(VD.champs, 'champ');
conte('> Un dialogue **ne se joue qu\'une fois** par défaut, et il n\'est compté comme',
  '> mené que lorsqu\'on en sort par une réponse. Fermer la feuille en cours de route le',
  '> laisse offert : on n\'est pas puni d\'avoir touché l\'écran au mauvais endroit.', '');

conte('## Une réplique', '',
  'Ce que le personnage dit, et les réponses qu\'on peut lui faire.', '');
table(VD.replique, 'champ');

conte('## Une réponse', '');
table(VD.reponse, 'champ');
conte('> Une réponse dont la condition n\'est pas remplie se montre **grisée** quand vous',
  '> avez écrit un *pourquoi*, et se **cache** sinon. Voir une porte fermée vaut mieux que',
  '> ne pas la voir — mais pas si l\'on ne dit pas ce qui la ferme.', '');

conte('## Ce qu\'on peut demander', '',
  'Toutes les interrogations des événements — l\'or, la réputation, le karma, la place,',
  'l\'état du convoi — plus celles-ci, qui n\'ont de sens qu\'en conversation.', '');
conte('| on demande | ce que ça vaut | il faut préciser |', '|---|---|---|');
Object.entries(VD.interrogations).forEach(([k, d]) =>
  conte(`| **${d.nom}** \`${k}\` | ${d.unite || ''} — ${d.explique} | \`${d.demande}\` |`));
conte('');

conte('## Ce qu\'un dialogue peut faire', '',
  `Les ${Object.keys(V.effets).length} effets des événements, sans exception : donner de l'or, blesser,`,
  'charger, recruter, lancer une rumeur. Un dialogue ne peut donc rien faire qu\'un',
  'événement ne sache déjà faire, et les deux s\'équilibrent pareil.', '',
  'S\'y ajoutent ces trois-là.', '');
Object.entries(VD.effets).forEach(([k, e]) => {
  conte(`### ${e.nom} — \`${k}\``, '', e.explique, '');
  const ps = Object.entries(e.parametres || {});
  if (ps.length) {
    conte('| réglage | ce que c\'est | |', '|---|---|---|');
    ps.forEach(([, d]) => conte(`| **${d.nom}** | ${d.aide || ''} | ` +
      `${d.requis ? '**obligatoire**' : (d.defaut !== undefined ? 'par défaut : ' + motDefaut(d.defaut) : '')} |`));
    conte('');
  }
});

conte('## Les trous des textes', '',
  'Le texte d\'une réplique, celui d\'une réponse et le *pourquoi* d\'une réponse fermée',
  'acceptent tous les mêmes trous, accordés sur le personnage à qui l\'on parle.', '',
  '| trou | ce que ça donne | exemple |', '|---|---|---|');
Object.entries(VD.trous).forEach(([k, d]) =>
  conte(`| \`{${k}}\` | ${d.explique} | ${d.exemple || ''} |`));
conte('', 'Un texte peut proposer **plusieurs variantes**, et le jeu en tire une : dans le',
  'fichier, c\'est un tableau de textes.', '');

conte('## Un exemple complet', '',
  'Le monde livré dans [`data/`](../data/) porte de quoi voir chaque cas à l\'œuvre :',
  'cinq conversations, deux missions et un objet unique. Ouvrez le jeu, il est là —',
  'et [`data/dialogues.json`](../data/dialogues.json) se lit à côté pour comparer ce',
  'qu\'on voit à l\'écran et ce qui l\'a écrit.', '',
  'On y trouve, dans l\'ordre où l\'on s\'en sert :', '',
  '- **donner une mission en conversation** — Orlanne, avec une branche de marchandage',
  '  qui ne s\'ouvre qu\'à quarante-cinq de réputation ;',
  '- **en reparler pendant qu\'elle court** — la même, rejouable, qui ne propose de lui',
  '  rendre compte que si l\'on a vu la batelière ;',
  '- **délier une langue** — Sylve, qui ne dit ce qu\'elle sait qu\'à qui a payé le',
  '  passage, et dont la couche de lore rejoint le carnet pour toujours ;',
  '- **la conversation où l\'on repasse** — Gaubert, qui sert à boire, vend des nouvelles',
  '  et propose une course ;',
  '- **une porte qu\'un objet ouvre** — Harn, qui ne parle du péage qu\'à qui porte le',
  '  registre gagné chez Orlanne.', '');

conte('## Ce que la partie retient', '',
  '| dans `S` | quoi |', '|---|---|',
  '| `S.dits[cle]` | combien de fois chaque conversation a été menée |',
  '| `S.souvenirs[nom]` | ce que le monde retient de ce qu\'on s\'est dit |', '',
  'Les deux voyagent dans la sauvegarde. Un souvenir posé ne s\'efface que si un',
  'dialogue le repose à *faux*.', '');

TUTOS['dialogues'] = u.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
writeFileSync(join(ICI, 'TUTORIEL-DIALOGUES.md'), TUTOS['dialogues'], 'utf8');

/* ════════════════════ 2. les exemples ════════════════════
   Découpés dans la spécification, pour qu'un exemple corrigé là-bas le soit dans
   l'outil sans qu'on ait à y penser. */

const spec = lit('data', 'FORMAT-EVENEMENTS.md');
const coupe = spec.indexOf('## Quatre de vos événements, convertis');
const exemples = [];
if (coupe >= 0) {
  const re = /```json\n([\s\S]*?)```/g;
  const zone = spec.slice(coupe);
  let m;
  while ((m = re.exec(zone))) {
    let o;
    try { o = JSON.parse(m[1]); }
    catch (e) {
      throw new Error('Un exemple de FORMAT-EVENEMENTS.md n\'est pas du JSON valide :\n' +
        m[1].slice(0, 200));
    }
    if (o && o.cle && o.choix) exemples.push(o);
  }
}

/* ════════════════════ 3. les listes de référence ════════════════════ */

const biens = litJson('data', 'biens.json');
const armes = litJson('data', 'armes.json');
const arch = litJson('data', 'archetypes.json');
const icones = ICO;
const pnj = litJson('data', 'pnj.json');

const noms = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.nom]));

const reference = {
  vocabulaire: V,
  vocabulairePersonnages: VP,
  vocabulaireObjets: VO,
  vocabulaireMissions: VM,
  vocabulaireDialogues: VD,
  /* les chiffres bruts des armes : l'atelier d'objets en a besoin pour situer
     une arme de légende parmi celles qui existent déjà */
  armesChiffres: Object.fromEntries(Object.entries(armes.armes).map(
    ([k, a]) => [k, { frappe: a.frappe, poids: a.poids, garde: a.garde,
                      prix: a.prix, mythique: a.mythique || null }])),
  biens: noms(biens.biens),
  armes: noms(armes.armes),
  familles: noms(armes.familles),
  metiers: noms(arch.metiers),
  glyphes: icones.glyphesEvenement,
  natures: icones.teintesEvenement,
  nomsGardes: pnj.nomsGardes,
  nomsChiens: pnj.nomsChiens,
  exemples
};

/* ════════════════════ 4. l'injection dans les ateliers ════════════════════
   Chaque atelier reçoit la machinerie partagée puis ses listes de référence.
   Il reste ainsi un fichier unique, qu'on ouvre d'un double-clic, sans que le
   code existe en trois exemplaires. */

const commun = lit('outils', 'commun.js');
const ATELIERS = ['atelier-carte.html',
                  'atelier-evenements.html', 'atelier-personnages.html',
                  'atelier-objets.html', 'atelier-missions.html',
                  'atelier-icones.html', 'atelier-dialogues.html',
                  'atelier-calendrier.html'];

/* Le contenu injecté est recopié depuis sa source à chaque construction : une
   correction faite ici, dans la page, est perdue au prochain `node
   outils/construire.mjs`. Le bandeau le dit aux deux bouts, parce qu'on arrive
   rarement dans un fichier par sa première ligne — on y tombe par une recherche,
   au milieu, là où le commentaire d'en-tête ne se voit plus. */
const bandeau = (id) =>
  `/* ══ RECOPIÉ — NE PAS CORRIGER ICI ══ Ce bloc « ${id} » est réécrit par\n`+
  `   outils/construire.mjs. Corrigez la source, puis reconstruisez. ══ */`;
const injecte = (html, id, contenu, quoi) => {
  const balise = new RegExp(`(<script id="${id}"[^>]*>)[\\s\\S]*?(</script>)`);
  if (!balise.test(html)) throw new Error(`Balise <script id="${id}"> introuvable dans ${quoi}`);
  const bande = /json/.test(id) || id === 'reference' || id === 'tutoriels'
    ? '' : bandeau(id) + '\n';
  return html.replace(balise, (_, a, b) =>
    a + '\n' + bande + contenu + '\n' + (bande ? bandeau(id) + '\n' : '') + b);
};

const poses = [];
for (const nom of ATELIERS) {
  const page = join(ICI, nom);
  let html;
  try { html = readFileSync(page, 'utf8'); }
  catch (e) { continue; }                       /* atelier pas encore écrit */
  html = injecte(html, 'commun', commun, nom);
  html = injecte(html, 'reference', JSON.stringify(reference), nom);
  writeFileSync(page, html, 'utf8');
  poses.push(nom);
}

/* Le hub et ses deux pages dédiées reçoivent la même machinerie, mais pas le
   vocabulaire : leur codex ne montre que des noms et des dessins, ils n'ont
   besoin d'aucun formulaire. La page des modes d'emploi reçoit en plus les six
   tutoriels, pour les mettre en page sans aller chercher de fichier — elle doit
   marcher hors ligne comme les ateliers. */
const PAGES = ['index.html', 'sauvegarde.html', 'tutoriels.html'];
for (const nom of PAGES) {
  const page = join(ICI, nom);
  let html;
  try { html = readFileSync(page, 'utf8'); }
  catch (e) { continue; }
  html = injecte(html, 'commun', commun, nom);
  html = injecte(html, 'reference',
    JSON.stringify({ glyphes: reference.glyphes, natures: reference.natures }), nom);
  if (/<script id="tutoriels"/.test(html))
    html = injecte(html, 'tutoriels', JSON.stringify(
      Object.fromEntries(Object.entries(TUTOS).map(([k, md]) => [k, { md }]))), nom);
  writeFileSync(page, html, 'utf8');
  poses.push(nom);
}

/* ════════════════════ 5. le compte rendu ════════════════════ */

const compte = (o) => Object.keys(o).length;
console.log(
  'TUTORIEL-EVENEMENTS.md   %d effets · %d interrogations · %d formes · %d moments · %d exemples\n' +
  'TUTORIEL-PERSONNAGES.md  %d rôles · %d interrogations de relation · %d trous\n' +
  'TUTORIEL-OBJETS.md       %d genres · %d pouvoirs · %d provenances\n' +
  'TUTORIEL-MISSIONS.md     %d jalons · %d récompenses · %d trous\n' +
  'TUTORIEL-ICONES.md       %d formes · %d teintes nommées\n' +
  'TUTORIEL-DIALOGUES.md    %d interrogations · %d effets propres · %d trous\n' +
  'référence                %d biens · %d armes · %d métiers · %d dessins · %d teintes\n' +
  'injecté dans             %s\n' +
  'poids embarqué           %s de catalogue, %s de machinerie',
  compte(V.effets), compte(V.interrogations), compte(V.formes), compte(V.moments),
  exemples.length,
  compte(VP.roles), compte(VP.interrogations), compte(VP.trous),
  compte(VO.genres), compte(VO.pouvoirs), compte(VO.provenances),
  compte(VM.jalons), compte(VM.recompenses), compte(VM.trous),
  formesDeclarees.length, compte(ICO.teintesEvenement),
  compte(VD.interrogations), compte(VD.effets), compte(VD.trous),
  compte(reference.biens), compte(reference.armes), compte(reference.metiers),
  compte(reference.glyphes), compte(reference.natures),
  poses.join(', ') || '(aucun atelier trouvé)',
  (JSON.stringify(reference).length / 1024).toFixed(0) + ' ko',
  (commun.length / 1024).toFixed(0) + ' ko');
