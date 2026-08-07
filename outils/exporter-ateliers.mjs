/* Recopie les ateliers construits vers le dépôt Caravane-Tool.

   Les cinq ateliers sont des fichiers uniques et autonomes — c'est tout le
   principe : construire.mjs y a déjà recopié la machinerie et les catalogues.
   Les publier ailleurs est donc une simple copie, pas un empaquetage.

   Caravane-2 reste la source : on modifie ici, on relance construire.mjs, puis
   ce script, et on pousse le dépôt d'à côté.

       node outils/construire.mjs
       node outils/exporter-ateliers.mjs ../Caravane-Tool
       cd ../Caravane-Tool && git commit -am "Mise à jour des ateliers" && git push

   Le chemin de destination peut aussi venir de la variable ATELIERS_DEST.      */

import { copyFileSync, existsSync, statSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ICI = dirname(fileURLToPath(import.meta.url));
const dest = resolve(process.argv[2] || process.env.ATELIERS_DEST || '');

if (!process.argv[2] && !process.env.ATELIERS_DEST) {
  console.error('Où faut-il copier ? Donnez le chemin du dépôt Caravane-Tool :\n' +
    '  node outils/exporter-ateliers.mjs ../Caravane-Tool');
  process.exit(1);
}
if (!existsSync(dest) || !statSync(dest).isDirectory()) {
  console.error('Ce dossier n\'existe pas : ' + dest);
  process.exit(1);
}

const A_COPIER = [
  'index.html',                      /* le hub */
  'manifest.webmanifest', 'sw.js', 'icone.png',   /* ce qui le rend installable */
  'atelier-carte.html', 'atelier-personnages.html', 'atelier-objets.html',
  'atelier-missions.html', 'atelier-evenements.html', 'atelier-icones.html',
  'atelier-dialogues.html',
  'TUTORIEL-EVENEMENTS.md', 'TUTORIEL-PERSONNAGES.md',
  'TUTORIEL-OBJETS.md', 'TUTORIEL-MISSIONS.md', 'TUTORIEL-ICONES.md',
  'TUTORIEL-DIALOGUES.md'
];

/* Un atelier qui n'a pas reçu sa machinerie serait vide sur le dépôt d'en face :
   on refuse de publier avant que construire.mjs soit passé. */
const manquent = [];
/* les cinq ateliers d'écriture reçoivent la machinerie et un catalogue ;
   l'atelier de carte n'a besoin ni de l'une ni de l'autre */
A_COPIER.filter(n => /^atelier-(personnages|objets|missions|evenements|icones|dialogues)\.html$/.test(n))
  .forEach(n => {
    const h = readFileSync(join(ICI, n), 'utf8');
    if (!/function racineEst/.test(h)) manquent.push(n + ' (sans machinerie)');
    if (/<script id="reference" type="application\/json">\s*\{\s*"vocabulaire"\s*:\s*\{\}/.test(h))
      manquent.push(n + ' (catalogue vide)');
  });
/* le hub, lui, porte le codex : sans la machinerie il ne montrerait rien */
{
  const h = readFileSync(join(ICI, 'index.html'), 'utf8');
  if (!/function depotCodex/.test(h)) manquent.push('index.html (sans machinerie)');
  if (/<script id="reference" type="application\/json">\s*\{\s*"glyphes"\s*:\s*\{\}/.test(h))
    manquent.push('index.html (sans les dessins)');
}
if (manquent.length) {
  console.error('Relancez d\'abord « node outils/construire.mjs » : ' + manquent.join(', '));
  process.exit(1);
}

let n = 0, poids = 0;
A_COPIER.forEach(nom => {
  const src = join(ICI, nom);
  if (!existsSync(src)) { console.warn('absent, ignoré : ' + nom); return; }
  copyFileSync(src, join(dest, nom));
  poids += statSync(src).size;
  n++;
});

console.log('%d fichiers copiés vers %s (%s ko)\n' +
  'Seul le README du dépôt d\'en face lui appartient : il n\'est pas touché.',
  n, dest, (poids / 1024).toFixed(0));
