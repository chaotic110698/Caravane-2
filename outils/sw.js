/* Le cache des ateliers.
   Chaque atelier est un fichier unique et autonome : le mettre en cache suffit à
   le rendre utilisable sans réseau, sans qu'aucune dépendance ne manque. C'est ce
   qui rend l'ensemble tenable hors connexion.

   Stratégie : réseau d'abord, cache en secours. On voit donc toujours la dernière
   version quand il y a du réseau, et on garde la précédente quand il n'y en a
   plus. Changer VERSION purge l'ancien cache.                                  */
const VERSION='caravane-ateliers-v1';
const PAGES=[
  './','./index.html','./manifest.webmanifest',
  './atelier-carte.html','./atelier-personnages.html','./atelier-objets.html',
  './atelier-missions.html','./atelier-evenements.html',
  './TUTORIEL-EVENEMENTS.md','./TUTORIEL-PERSONNAGES.md',
  './TUTORIEL-OBJETS.md','./TUTORIEL-MISSIONS.md','./README.md'
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
    fetch(e.request).then(r=>{
      if(r&&r.ok)caches.open(VERSION).then(c=>c.put(e.request,r.clone()));
      return r;
    }).catch(()=>caches.match(e.request,{ignoreSearch:true})
      .then(r=>r||caches.match('./index.html')))
  );
});
