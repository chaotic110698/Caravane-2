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
