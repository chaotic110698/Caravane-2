/* Le cache des ateliers.
   Chaque atelier est un fichier unique et autonome : le mettre en cache suffit à
   le rendre utilisable sans réseau, sans qu'aucune dépendance ne manque. C'est ce
   qui rend l'ensemble tenable hors connexion.

   Stratégie : réseau d'abord, cache en secours. On voit donc toujours la dernière
   version quand il y a du réseau, et on garde la précédente quand il n'y en a
   plus. Changer VERSION purge l'ancien cache.

   VERSION n'est pas écrite à la main : exporter-ateliers.mjs y pose l'empreinte
   de ce qui est publié. Tant qu'elle ne bougeait pas, un atelier republié
   pouvait rester invisible — le navigateur servait sa copie et personne ne lui
   disait qu'elle avait vieilli. Deux exports identiques gardent la même clé ;
   un seul octet changé en donne une neuve, et l'ancien cache est purgé.      */
const VERSION='caravane-ateliers-7cce39e61aa6';
const PAGES=[
  './','./index.html','./sauvegarde.html','./tutoriels.html','./manifest.webmanifest',
  './icone.png',
  './atelier-carte.html','./atelier-personnages.html','./atelier-objets.html',
  './atelier-missions.html','./atelier-evenements.html','./atelier-icones.html',
  './atelier-dialogues.html','./atelier-calendrier.html',
  './TUTORIEL-EVENEMENTS.md','./TUTORIEL-PERSONNAGES.md',
  './TUTORIEL-OBJETS.md','./TUTORIEL-MISSIONS.md','./TUTORIEL-ICONES.md',
  './TUTORIEL-DIALOGUES.md',
  './README.md'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VERSION)
    /* addAll échoue en bloc si un seul fichier manque : on les prend un par un */
    .then(c=>Promise.all(PAGES.map(p=>c.add(p).catch(()=>null))))
    .then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(l=>Promise.all(l.filter(k=>k!==VERSION).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    /* cache:'no-cache' — on demande au serveur si sa version a changé au lieu
       de croire le cache HTTP du navigateur sur parole. Réseau d'abord ne
       servait à rien tant que ce cache-là répondait à la place du réseau : un
       atelier republié restait invisible jusqu'à ce qu'il expire. Une page
       inchangée coûte un 304, une page changée arrive fraîche.
       On repart de l'URL et non de la requête : une requête de navigation ne
       se recopie pas telle quelle avec d'autres options. */
    fetch(e.request.url,{cache:'no-cache'}).then(r=>{
      if(r&&r.ok)caches.open(VERSION).then(c=>c.put(e.request,r.clone()));
      return r;
    }).catch(()=>caches.match(e.request,{ignoreSearch:true})
      .then(r=>r||caches.match('./index.html')))
  );
});
