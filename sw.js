const V="wl-v9",CORE=["./","index.html","kb.js","coach.js","analysis.js","examples.js","templates.js","i18n.js","i18n_fr.js","sugg_kb.js","suggest.js","manifest.webmanifest","logo.png","logo-white.png"],EXTRA=["viewer.html","icon-192.png","icon-512.png","icon-180.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE).then(()=>Promise.allSettled(EXTRA.map(f=>c.add(f))))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(caches.open(V).then(c=>c.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request,{cache:"no-cache"}).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);
    return hit||net;
  })));
});
