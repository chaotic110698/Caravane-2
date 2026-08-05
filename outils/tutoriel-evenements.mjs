/* Engendre outils/TUTORIEL-EVENEMENTS.md depuis data/vocabulaire-evenements.json.
   Le tutoriel et les formulaires du générateur sortent ainsi de la même source :
   ils ne peuvent pas se contredire, et ajouter un effet au catalogue le fait
   apparaître dans les deux.

   À relancer après chaque modification du catalogue :  node outils/tutoriel-evenements.mjs  */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ICI = dirname(fileURLToPath(import.meta.url));
const V = JSON.parse(readFileSync(join(ICI, '..', 'data', 'vocabulaire-evenements.json'), 'utf8'));

const l = [];
const dit = (...t) => l.push(...t);

dit('# Écrire un événement — mode d\'emploi', '',
  '> Cette page est **engendrée** depuis [`data/vocabulaire-evenements.json`](../data/vocabulaire-evenements.json).',
  '> Ne la corrigez pas à la main : corrigez le catalogue et relancez',
  '> `node outils/tutoriel-evenements.mjs`. Le générateur d\'événements affiche exactement',
  '> les mêmes explications.', '',
  'Un événement, c\'est une situation qui surgit, un récit, et deux à quatre façons d\'en',
  'sortir. Tout s\'écrit en champs à remplir — jamais une ligne de code.', '',
  'La forme exacte du fichier est décrite dans',
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
  'Elles se combinent : *base 40, par étape 11, le tout × entre 0,8 et 1,6*.', '');

/* ── 6. les textes ── */
dit('## Les textes', '',
  'Le récit, la note sous un bouton et le texte de chaque issue acceptent des **trous**',
  'entre accolades — le nom qu\'un effet a retenu, ou un mot du contexte.', '',
  '> On ne laisse que **{perdu}**. **{blesses.noms}** y laissent des plumes.', '',
  'Les nombres sortent à la française — *1 240*, pas *1240*. Un trou inconnu reste visible',
  'à l\'écran : une faute de frappe se voit au lieu de disparaître.', '',
  'Un texte peut aussi proposer **plusieurs variantes**, et le jeu en tire une au hasard.', '');

/* ── 7. ajouter au vocabulaire ── */
dit('## Il manque un effet ?', '',
  'Le vocabulaire est un catalogue ouvert, pas une liste figée. Décrivez l\'effet que vous',
  'voulez — *révéler un lieu sur la carte*, *faire monter un prix durablement*, *ouvrir une',
  'route* — il sera ajouté au catalogue et apparaîtra aussitôt dans le générateur, dans',
  'cette page et dans les vérifications.', '',
  'Même chose pour les paliers d\'un jet : ils sont une liste ouverte. Six degrés de',
  'réussite au lieu de trois, ce sont six paliers.', '');

const sortie = join(ICI, 'TUTORIEL-EVENEMENTS.md');
writeFileSync(sortie, l.join('\n').replace(/\n{3,}/g, '\n\n') + '\n', 'utf8');
console.log('écrit  outils/TUTORIEL-EVENEMENTS.md — %d effets, %d interrogations, %d formes',
  Object.keys(V.effets).length, Object.keys(V.interrogations).length, Object.keys(V.formes).length);
