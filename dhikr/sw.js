const CACHE='dhikr-23339809';
const SHELL=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.indexOf('dhikr-')===0&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||e.request.headers.has('range'))return;
  const page=e.request.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname);
  if(page){ // network first, so a new version shows on the next open when online
    e.respondWith(caches.open(CACHE).then(c=>new Promise(res=>{
      let done=false;const fin=r=>{if(!done&&r){done=true;res(r)}};
      const tm=setTimeout(()=>c.match('index.html').then(h=>h&&fin(h)),4000);
      fetch(e.request,{cache:'no-cache'}).then(r=>{if(r&&r.ok){c.put('index.html',r.clone());clearTimeout(tm);fin(r)}else return c.match('index.html').then(h=>fin(h||r))})
        .catch(()=>c.match('index.html').then(h=>{clearTimeout(tm);fin(h||Response.error())}));
    })));
    return;
  }
  e.respondWith(caches.open(CACHE).then(c=>c.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit||c.match('index.html'));
    return hit||net;
  })));
});
