/* La machinerie partagée des ateliers de Caravane.

   Ce fichier n'est jamais chargé par une page : outils/construire.mjs le recopie
   à l'intérieur de chaque atelier, entre les balises <script id="commun">. Les
   ateliers doivent en effet s'ouvrir d'un simple double-clic, donc en file://,
   où aucune page ne peut aller chercher un fichier voisin.

   Il tient trois choses :
     — les petites fonctions dont tout le monde se sert ;
     — la lecture et l'écriture du modèle par chemin, sur quoi reposent tous les
       formulaires engendrés ;
     — la sauvegarde dans le navigateur, avec son échéance dure.

   Chaque atelier déclare d'où il lit avec racineEst(), et ce qu'il sauve avec
   sauvegardeEst().                                                          */

/* ═══════════════ le menu fretin ═══════════════ */
const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>Array.prototype.slice.call(p.querySelectorAll(s));
const ech=s=>String(s==null?'':s).replace(/[&<>"]/g,
  c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const fmt=n=>Math.round(n).toLocaleString('fr-FR');
const dec=n=>(Math.round(n*1000)/1000).toString().replace('.',',');
const slug=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase()
  .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48);

/* ═══════════════ lecture et écriture par chemin ═══════════════
   Les formulaires sont engendrés : chaque champ porte le chemin de la donnée
   qu'il édite, « couches.2.texte » ou « choix.0.reussi.effets.1.part ». Écrire
   une valeur vide efface la clé, pour que le fichier exporté ne porte que ce
   qui a été rempli. */
let RACINE=()=>null;
function racineEst(f){RACINE=f;}
function lire(ch){
  return String(ch).split('.').reduce((o,k)=>(o==null?undefined:o[k]),RACINE());
}
function ecrire(ch,v){
  const p=String(ch).split('.'), der=p.pop();
  let o=RACINE();
  if(o==null)return;
  for(const k of p){
    if(o[k]==null)o[k]=/^\d+$/.test(k)?[]:{};
    o=o[k];
  }
  if(v===''||v===undefined||v===null)delete o[der];
  else o[der]=v;
}
function nettoyer(o){                      /* enlève les objets et listes vides */
  if(Array.isArray(o)){o.forEach(nettoyer);return o;}
  if(o&&typeof o==='object'){
    for(const k of Object.keys(o)){
      nettoyer(o[k]);
      const v=o[k];
      if(v===''||v===undefined||v===null||
         (Array.isArray(v)&&!v.length)||
         (v&&typeof v==='object'&&!Array.isArray(v)&&!Object.keys(v).length))delete o[k];
    }
  }
  return o;
}
function bouger(l,i,d){
  if(!l||i+d<0||i+d>=l.length)return;
  const x=l[i];l[i]=l[i+d];l[i+d]=x;
}

/* ═══════════════ sauvegarde ═══════════════
   Une échéance dure : le report d'écriture ne peut pas glisser indéfiniment,
   et la page qui part écrit avant de partir. Sans les deux, une séance entière
   de travail peut ne jamais toucher le disque. */
let CLE_SAUVE='caravane.atelier', PAQUET=()=>({});
let tSauve=null, echeance=0;
function sauvegardeEst(cle,paquet){CLE_SAUVE=cle;PAQUET=paquet;}
function ecrireSauve(){
  clearTimeout(tSauve);tSauve=null;echeance=0;
  try{localStorage.setItem(CLE_SAUVE,JSON.stringify(PAQUET()));}
  catch(e){/* quota, mode privé : on continue sans */}
}
function sauver(){
  const t=Date.now();
  if(!echeance)echeance=t+2000;
  clearTimeout(tSauve);
  tSauve=setTimeout(ecrireSauve,Math.max(0,Math.min(400,echeance-t)));
}
function relireSauve(){
  try{return JSON.parse(localStorage.getItem(CLE_SAUVE)||'null');}catch(e){return null;}
}
addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')ecrireSauve();});
addEventListener('pagehide',ecrireSauve);

/* ═══════════════ le monde, quand il est chargé ═══════════════ */
let MONDE=null;
function mondeEst(d){MONDE=d;}
function listeMonde(quoi){
  if(!MONDE)return null;
  if(quoi==='lieux')return (MONDE.lieux||[]).map(l=>[l.cle,l.nom]);
  if(quoi==='contrees')return (MONDE.contrees||[]).map(c=>[c.cle,c.nom]);
  if(quoi==='rangs')return Object.entries(MONDE.rangs||{}).map(([k,v])=>[k,v.nom||k]);
  if(quoi==='traits')return Object.entries(MONDE.traits||{}).map(([k,v])=>[k,v.nom||k]);
  if(quoi==='terrains')return Object.entries(MONDE.terrains||{}).map(([k,v])=>[k,v.nom||k]);
  if(quoi==='profils')return (MONDE.profils||[]).map(p=>[p.cle,p.nom||p.cle]);
  if(quoi==='cartes')return (MONDE.cartes||[{cle:(MONDE.carte&&MONDE.carte.fichier)||'monde',
    nom:'La carte du monde'}]).map(c=>[c.cle,c.nom||c.cle]);
  return null;
}
const REPLI={
  rangs:[['capitale','Capitale'],['ville','Ville'],['village','Village'],
         ['hameau','Hameau'],['poste','Poste frontière']],
  traits:[['port','Port'],['souterrain','Ville souterraine']],
  terrains:[['plaine','Plaine'],['forestier','Forestier'],['montagneux','Montagneux'],
            ['marecageux','Marécageux']],
  profils:[['securise','Sécurisé'],['normal','Normal'],['dangereux','Dangereux']],
  lieux:[],contrees:[],cartes:[]
};
const listeOu=q=>listeMonde(q)||REPLI[q]||[];
const estMonde=d=>d&&(d.format==='caravane.carte.v1'||
  (d.lieux!==undefined&&d.contrees!==undefined));

/* ═══════════════ les champs engendrés ═══════════════ */
function champ(label,corps,aide,large){
  return `<div class="champ${large?' large':''}"><label>${ech(label)}</label><div>${corps}`+
    (aide?`<div class="aide">${aide}</div>`:'')+`</div></div>`;
}
function texte(ch,ph,lignes){
  const v=lire(ch);
  if(lignes)return `<textarea rows="${lignes}" data-ch="${ech(ch)}" data-t="txt" `+
    `placeholder="${ech(ph||'')}">${ech(Array.isArray(v)?v.join('\n\n'):v||'')}</textarea>`;
  return `<input data-ch="${ech(ch)}" data-t="txt" placeholder="${ech(ph||'')}" `+
    `value="${ech(v||'')}" autocomplete="off" spellcheck="false">`;
}
function nombre(ch,ph,pas){
  const v=lire(ch);
  return `<input type="number" step="${pas||'any'}" data-ch="${ech(ch)}" data-t="num" `+
    `placeholder="${ech(ph||'')}" value="${v===undefined||v===null?'':v}">`;
}
function choixListe(ch,options,vide){
  const v=lire(ch);
  return `<select data-ch="${ech(ch)}" data-t="txt">`+
    (vide?`<option value="">${ech(vide)}</option>`:'')+
    options.map(o=>{const[k,n]=Array.isArray(o)?o:[o,o];
      return `<option value="${ech(k)}"${k===v?' selected':''}>${ech(n)}</option>`;}).join('')+
    `</select>`;
}
function coche(ch,label){
  const v=lire(ch);
  return `<label class="chip${v?' actif':''}"><input type="checkbox" data-ch="${ech(ch)}" `+
    `data-t="bool"${v?' checked':''}>${ech(label)}</label>`;
}
function multi(ch,options,rien){
  const v=lire(ch)||[];
  if(!options.length)return `<p class="vide">${rien}</p>`;
  return `<div class="chips">`+options.map(o=>{
    const[k,n]=Array.isArray(o)?o:[o,o];
    return `<label class="chip${v.indexOf(k)>=0?' actif':''}"><input type="checkbox" `+
      `data-ch="${ech(ch)}" data-t="multi" value="${ech(k)}"${v.indexOf(k)>=0?' checked':''}>`+
      `${ech(n)}</label>`;}).join('')+`</div>`;
}
/* Les textes à trous : {ceci} entre accolades, remplacé par ce qu'on a sous la main. */
function trous(txt){
  const out=[], l=Array.isArray(txt)?txt:[txt];
  l.forEach(t=>{const re=/\{([a-zA-Z0-9_.]+)\}/g;let m;
    while((m=re.exec(String(t||''))))out.push(m[1]);});
  return out;
}
function boucher(txt,sac){
  const t=Array.isArray(txt)?pick(txt):txt;
  return String(t==null?'':t).replace(/\{([a-zA-Z0-9_.]+)\}/g,
    (m,k)=>sac[k]!==undefined?sac[k]:m);
}
/* Une valeur de texte : plusieurs paragraphes séparés par une ligne vide font
   plusieurs variantes, dont le jeu tire une au hasard. */
function texteSaisi(v){
  if(v.indexOf('\n\n')<0)return v;
  const l=v.split(/\n{2,}/).map(s=>s.trim()).filter(Boolean);
  return l.length>1?l:(l[0]||'');
}

/* ═══════════════ ouvrir et exporter ═══════════════ */
function telecharger(nom,donnees){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(donnees,null,2)],
    {type:'application/json'}));
  a.download=nom;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000);
}
/* Le dépôt de fichier, commun aux trois ateliers : on lit, on rend l'objet. */
function accueillirFichiers(surJson){
  let survol=0;
  const voile=$('#toile-depot');
  const lire1=f=>{const r=new FileReader();
    r.onload=()=>{let d;
      try{d=JSON.parse(r.result);}
      catch(e){alert('Ce fichier n\'est pas du JSON lisible.');return;}
      surJson(d);};
    r.readAsText(f);};
  addEventListener('dragenter',e=>{e.preventDefault();survol++;
    if(voile)voile.classList.add('on');});
  addEventListener('dragover',e=>e.preventDefault());
  addEventListener('dragleave',()=>{if(--survol<=0&&voile)voile.classList.remove('on');});
  addEventListener('drop',e=>{e.preventDefault();survol=0;
    if(voile)voile.classList.remove('on');
    if(e.dataTransfer.files[0])lire1(e.dataTransfer.files[0]);});
  const champFichier=$('#fichier');
  if(champFichier)champFichier.onchange=e=>{
    if(e.target.files[0])lire1(e.target.files[0]);
    e.target.value='';
  };
  return ()=>{if(champFichier)champFichier.click();};
}

/* ═══════════════ la disposition sur téléphone ═══════════════
   Sur un écran de 390 pixels, les trois colonnes empilées ne laissent que
   180 pixels au formulaire : on ne peut rien y écrire. Ici, on donne l'écran
   entier à **une** zone à la fois, et une barre en bas sert à passer de l'une à
   l'autre. Les boutons de la barre du haut se rangent dans un tiroir.

   Les quatre ateliers partagent la même ossature — #scene > aside, main, aside —
   donc ce code les sert tous les quatre sans qu'aucun n'ait à s'en occuper.

   Rien de tout cela ne s'active au-dessus de 860 pixels : sur un ordinateur,
   les trois colonnes restent côte à côte comme avant.                        */
const CSS_MOBILE=`
@media (max-width:860px){
  body{overflow:hidden}
  /* — la barre du haut, réduite à un titre et un tiroir — */
  #barre{flex-wrap:nowrap;gap:8px;padding:8px 10px;align-items:center}
  #barre h1{font-size:15px;flex:1;min-width:0;overflow:hidden;
    text-overflow:ellipsis;white-space:nowrap;margin:0}
  #tiroir{position:fixed;left:0;right:0;top:0;z-index:20;
    background:var(--fond-clair);border-bottom:1px solid var(--bord);
    padding:10px;display:none;grid-template-columns:1fr 1fr;gap:8px;
    box-shadow:0 14px 30px #0009;max-height:78vh;overflow-y:auto}
  #tiroir.ouvert{display:grid}
  #tiroir .outil{justify-content:center;padding:11px 10px;font-size:13.5px}
  #tiroir .sep,#tiroir .pousse{display:none}
  #tiroir .plein{grid-column:1/-1}
  #voile-tiroir{position:fixed;inset:0;background:#0009;z-index:19;display:none}
  #voile-tiroir.ouvert{display:block}
  #b-tiroir{flex:none;display:inline-flex;align-items:center;gap:7px;
    padding:8px 12px;border:1px solid var(--bord);border-radius:var(--r);
    background:var(--fond);font-size:13px}
  #b-tiroir b{color:var(--or)}

  /* — une seule zone à l'écran — */
  #scene{flex-direction:column;position:relative}
  #scene>aside,#scene>main{display:none;width:auto;max-height:none;flex:1;
    min-height:0;border:none}
  #scene.vue-liste>aside:first-of-type{display:flex}
  #scene.vue-feuille>main{display:flex}
  #scene.vue-cote>aside:last-of-type{display:flex}
  #scene>main{padding:12px 12px 24px}

  /* — la barre du bas — */
  #vues{flex:none;display:flex;background:var(--fond-clair);
    border-top:1px solid var(--bord);padding-bottom:env(safe-area-inset-bottom,0)}
  #vues button{flex:1;padding:11px 4px 12px;font-size:11.5px;color:var(--encre-pale);
    border-top:2px solid transparent;display:flex;flex-direction:column;
    align-items:center;gap:3px;line-height:1.15}
  #vues button.actif{color:var(--or);border-top-color:var(--or)}
  #vues .pastille{font-size:16px;line-height:1}

  /* — l'état, sur une ligne qu'on peut faire défiler — */
  #etat{flex-wrap:nowrap;overflow-x:auto;gap:12px;font-size:11.5px;padding:5px 10px}
  #etat>span{white-space:nowrap;flex:none}
  #etat>span:last-child{display:none}

  /* — les champs, au doigt — */
  .champ{grid-template-columns:1fr;gap:4px}
  .champ>label{padding-top:0;font-size:12px}
  input,select,textarea{padding:9px 10px;font-size:15px}   /* 15px : pas de zoom iOS */
  .chip{padding:7px 12px;font-size:13px}
  .ajout{padding:9px 12px;width:100%;text-align:center}
  .glyphes{grid-template-columns:repeat(auto-fill,minmax(46px,1fr));max-height:210px}
  #onglets button{padding:10px 2px;font-size:11px}
  #volet{padding:12px 12px 24px}
  .bloc>h2 button{padding:5px 10px;font-size:12px}
  .piece>header button,.couche>header button,.effet>header button{padding:5px 9px;font-size:12px}
}`;
/* Les trois zones, dans l'ordre où la barre du bas les propose. Chaque atelier
   nomme la sienne : « le recueil », « le répertoire », « le coffre »… */
function installerMobile(noms){
  const scene=$('#scene');
  if(!scene)return;
  const barre=$('#barre');
  /* on range les boutons de la barre dans un tiroir, sans toucher au HTML */
  if(barre&&!$('#tiroir')){
    const tiroir=document.createElement('div');
    tiroir.id='tiroir';
    const voile=document.createElement('div');
    voile.id='voile-tiroir';
    Array.prototype.slice.call(barre.children).forEach(el=>{
      if(el.tagName==='H1')return;
      tiroir.appendChild(el);
    });
    /* Un retour au hub, en tête du tiroir : sur un téléphone, le bouton « page
       précédente » du navigateur n'est pas toujours à portée de pouce. */
    const retour=document.createElement('a');
    retour.className='outil plein';
    retour.href='index.html';
    retour.innerHTML='◂ Tous les ateliers';
    tiroir.insertBefore(retour,tiroir.firstChild);
    const b=document.createElement('button');
    b.id='b-tiroir';b.innerHTML='<b>☰</b> Outils';
    barre.appendChild(b);
    document.body.appendChild(voile);
    document.body.appendChild(tiroir);
    const fermer=()=>{tiroir.classList.remove('ouvert');voile.classList.remove('ouvert');};
    b.onclick=()=>{const o=tiroir.classList.toggle('ouvert');
      voile.classList.toggle('ouvert',o);};
    voile.onclick=fermer;
    /* refermer dès qu'on a choisi quelque chose, sauf pour un menu déroulant */
    tiroir.addEventListener('click',e=>{
      if(e.target.closest('.outil'))setTimeout(fermer,60);});
  }
  /* la barre du bas */
  if(!$('#vues')){
    const zones=[['liste',noms&&noms[0]||'La liste','☰'],
                 ['feuille',noms&&noms[1]||'La fiche','✎'],
                 ['cote',noms&&noms[2]||'L\'aperçu','◫']];
    const v=document.createElement('div');
    v.id='vues';
    v.innerHTML=zones.map(([k,n,p])=>
      `<button data-vue="${k}"><span class="pastille">${p}</span>${ech(n)}</button>`).join('');
    const etat=$('#etat');
    if(etat)etat.parentNode.insertBefore(v,etat);
    else document.body.appendChild(v);
    v.addEventListener('click',e=>{
      const b=e.target.closest('[data-vue]');
      if(b)montrerVue(b.dataset.vue);
    });
  }
  montrerVue(localStorage.getItem('caravane.vue')||'feuille');
}
function montrerVue(quoi){
  const scene=$('#scene');
  if(!scene)return;
  scene.classList.remove('vue-liste','vue-feuille','vue-cote');
  scene.classList.add('vue-'+quoi);
  $$('#vues [data-vue]').forEach(b=>b.classList.toggle('actif',b.dataset.vue===quoi));
  try{localStorage.setItem('caravane.vue',quoi);}catch(e){}
  /* on repart du haut : arriver au milieu d'un formulaire désoriente */
  const z=quoi==='feuille'?$('#scene>main'):
    (quoi==='cote'?$('#volet'):$('#scene>aside'));
  if(z)z.scrollTop=0;
}
/* Choisir un élément dans la liste passe naturellement à la fiche. */
function suivreChoix(){
  const scene=$('#scene');
  if(!scene)return;
  scene.addEventListener('click',e=>{
    if(!matchMedia('(max-width:860px)').matches)return;
    const b=e.target.closest('[data-sel]');
    if(b&&b.closest('aside'))setTimeout(()=>montrerVue('feuille'),40);
  });
}
/* À appeler une fois, à la fin de chaque atelier. */
function habillerMobile(noms){
  const st=document.createElement('style');
  st.textContent=CSS_MOBILE;
  document.head.appendChild(st);
  installerMobile(noms);
  suivreChoix();
}

/* ═══════════════ la saisie, en délégation ═══════════════
   Un seul écouteur pour tous les champs de tous les formulaires : ils portent
   leur chemin, le reste suit. L'atelier fournit ce qu'il faut refaire ensuite. */
function ecouterSaisie(apres){
  document.addEventListener('input',ev=>{
    const t=ev.target;
    if(t.dataset.ch===undefined)return;
    const ch=t.dataset.ch, k=t.dataset.t;
    if(/\.__/.test(ch))return;                    /* champs de travail, pas de données */
    if(k==='txt'){
      const v=t.tagName==='TEXTAREA'?texteSaisi(t.value):t.value;
      if(/\.vaut$/.test(ch))ecrire(ch,v==='oui');
      else ecrire(ch,v);
    }
    else if(k==='num')ecrire(ch,t.value===''?undefined:Number(t.value));
    else if(k==='bool'){
      ecrire(ch,t.checked||undefined);
      t.closest('.chip').classList.toggle('actif',t.checked);
    }
    else if(k==='multi'){
      const cur=lire(ch)||[], i=cur.indexOf(t.value);
      if(t.checked&&i<0)cur.push(t.value);
      if(!t.checked&&i>=0)cur.splice(i,1);
      ecrire(ch,cur.length?cur:undefined);
      t.closest('.chip').classList.toggle('actif',t.checked);
    }
    apres(t,ch,k);
  });
}
