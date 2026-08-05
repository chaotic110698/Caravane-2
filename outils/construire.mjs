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

writeFileSync(join(ICI, 'TUTORIEL-EVENEMENTS.md'),
  l.join('\n').replace(/\n{3,}/g, '\n\n') + '\n', 'utf8');

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
  `${Object.keys(VP.roles).length} rôles, et la liste est ouverte : il en manque un, il est ajouté.`, '',
  '| rôle | ce que ça vous donne |', '|---|---|');
Object.entries(VP.roles).forEach(([k, d]) => ecrit(`| **${d.nom}** | ${d.explique} |`));
ecrit('');

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

writeFileSync(join(ICI, 'TUTORIEL-PERSONNAGES.md'),
  q.join('\n').replace(/\n{3,}/g, '\n\n') + '\n', 'utf8');

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
const icones = litJson('data', 'icones.json');
const pnj = litJson('data', 'pnj.json');

const noms = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.nom]));

const reference = {
  vocabulaire: V,
  vocabulairePersonnages: VP,
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
const ATELIERS = ['atelier-evenements.html', 'atelier-personnages.html'];

const injecte = (html, id, contenu, quoi) => {
  const balise = new RegExp(`(<script id="${id}"[^>]*>)[\\s\\S]*?(</script>)`);
  if (!balise.test(html)) throw new Error(`Balise <script id="${id}"> introuvable dans ${quoi}`);
  return html.replace(balise, (_, a, b) => a + '\n' + contenu + '\n' + b);
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

/* ════════════════════ 5. le compte rendu ════════════════════ */

const compte = (o) => Object.keys(o).length;
console.log(
  'TUTORIEL-EVENEMENTS.md  %d effets · %d interrogations · %d formes · %d moments\n' +
  'référence               %d biens · %d armes · %d métiers · %d dessins · %d teintes · %d exemples\n' +
  'injecté dans            %s\n' +
  'poids embarqué          %s de catalogue, %s de machinerie',
  compte(V.effets), compte(V.interrogations), compte(V.formes), compte(V.moments),
  compte(reference.biens), compte(reference.armes), compte(reference.metiers),
  compte(reference.glyphes), compte(reference.natures), exemples.length,
  poses.join(', ') || '(aucun atelier trouvé)',
  (JSON.stringify(reference).length / 1024).toFixed(0) + ' ko',
  (commun.length / 1024).toFixed(0) + ' ko');
