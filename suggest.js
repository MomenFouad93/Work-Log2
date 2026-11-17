(function(){
"use strict";
/* ===== Suggestion box (صندوق الاقتراحات): separate from faults / achievements / analysis =====
   Content: window.KB_SUGG (sugg_kb.js). Stored in S.sg. Leaves the phone only when the user shares it. */
const K=()=>window.KB_SUGG;
const LG=()=>window.I18N&&I18N.lang?I18N.lang():(isEN()?"en":"ar");
const L=o=>o?(o[LG()]||o.en||o.ar||""):"";
const T3=(ar,en,fr)=>({ar,en,fr})[LG()]||en;
const uid=()=>"SG-"+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase();
const nrm=s=>String(s||"").toLowerCase().replace(/[إأآا]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/[ًٌٍَُِّْـ]/g,"");
const num=v=>{const n=parseFloat(String(v==null?"":v).replace(/,/g,""));return isFinite(n)?n:null};
const BULB='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="vertical-align:-3px"><path fill="currentColor" d="M9 21h6v-1.5H9V21zm3-19a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2zm2.6 11.5-.6.42V16h-4v-2.08l-.6-.42A5 5 0 1 1 14.6 13.5z"/></svg>';
window.SG_BULB=BULB;

/* ---------- data ---------- */
const SG=()=>(S.sg=Array.isArray(S.sg)?S.sg:[]);
const STS=()=>((K()&&K().statuses)||[]).map(s=>s.id);
function clean(x){
  if(!x||typeof x!=="object"||Array.isArray(x)||!x.a||typeof x.a!=="object")return null;const s=(v,n)=>typeof v==="string"?v.slice(0,n):"";
  const o={id:/^SG-[A-Z0-9]{4,20}$/.test(x.id)?x.id:uid(),date:/^\d{4}-\d{2}-\d{2}$/.test(x.date)?x.date:today(),status:STS().includes(x.status)?x.status:"draft",
    a:{},voice:s(x.voice,3000),note:s(x.note,600),updated:s(x.updated,40)};
  if(x.a&&typeof x.a==="object")for(const [k,v] of Object.entries(x.a).slice(0,30)){if(!/^[a-z0-9_]{1,24}$/.test(k)||/^(__proto__|constructor|prototype)$/.test(k)||!v||typeof v!=="object")continue;const y={};
    if(Array.isArray(v.v))y.v=v.v.filter(z=>typeof z==="string").slice(0,20).map(z=>z.slice(0,40));else if(typeof v.v==="string"||typeof v.v==="number")y.v=String(v.v).slice(0,40);
    if(typeof v.t==="string")y.t=v.t.slice(0,1500);o.a[k]=y}
  if(!Object.keys(o.a).length&&!o.voice)return null;
  return o;
}
function load(){S.sg=SG().map(clean).filter(Boolean)}
window.sgRestore=function(list){if(!Array.isArray(list))return 0;const have=new Set(SG().map(x=>x.id));let n=0;for(const x of list){const c=clean(x);if(!c||have.has(c.id))continue;SG().push(c);have.add(c.id);n++}return n};

/* ---------- questions ---------- */
const Q=()=>(K()&&K().questions)||[];
const optsOf=q=>q.id==="cat"&&!(q.options||[]).length?(K().categories||[]):(q.options||[]);
const isMulti=q=>q.type==="multi";
let CUR=null;
const ans=id=>(CUR.a[id]=CUR.a[id]||{});
const selIds=id=>{const v=(CUR.a[id]||{}).v;return Array.isArray(v)?v:(v!=null&&v!==""?[String(v)]:[])};
function label(x,id){const q=Q().find(q=>q.id===id);if(!q)return "";const a=x.a[id]||{},v=a.v;let parts=[];
  if(q.type==="number"){if(num(v)!=null)parts.push(num(v).toLocaleString("en-US")+(q.unit?" "+q.unit:""))}
  else if(q.type!=="text"){const ids=Array.isArray(v)?v:(v?[v]:[]);parts=optsOf(q).filter(o=>ids.includes(o.id)).map(L)}
  if(a.t&&a.t.trim())parts.push(a.t.trim());return parts.join(", ")}
const title=x=>((x.a.title||{}).t||"").trim()||((x.a.idea||{}).t||"").trim().slice(0,70)||T3("اقتراح بدون عنوان","Untitled suggestion","Suggestion sans titre");
const stat=id=>(K().statuses||[]).find(s=>s.id===id)||{id,ar:id,en:id,fr:id,color:"#999"};

function qCard(q){
  const a=CUR.a[q.id]||{},ids=selIds(q.id);let body="";
  if(q.type==="number")body=`<div class="nrow"><input type="number" inputmode="decimal" data-sn="${q.id}" value="${esc(a.v==null?"":a.v)}" placeholder="0">${q.unit?`<span class="unit">${esc(q.unit)}</span>`:""}</div>`+((q.quick||[]).length?`<div class="chips qk">${q.quick.map(n=>`<button type="button" data-sq="${q.id}|${n}" class="${String(a.v)===String(n)?"on":""}">${Number(n).toLocaleString("en-US")}</button>`).join("")}</div>`:"");
  else if(q.type==="text")body=`<div class="mf"><textarea data-st="${q.id}" dir="auto" rows="${q.id==="title"?1:3}" placeholder="${esc(T3("اكتب أو اضغط المايك واتكلم","Type or tap the mic and speak","Écrivez ou touchez le micro et parlez"))}">${esc(a.t||"")}</textarea></div>`;
  else body=`<div class="chips qo">${optsOf(q).map(o=>`<button type="button" data-so="${q.id}|${esc(o.id)}" class="${ids.includes(o.id)?"on":""}">${esc(L(o))}</button>`).join("")}</div>`+(q.mic!==false?`<div class="mf oth"><input data-st="${q.id}" dir="auto" value="${esc(a.t||"")}" placeholder="${esc(T3("حاجة تانية / تفاصيل","Other / details","Autre / précisions"))}"></div>`:"");
  const done=(ids.length||(a.v!=null&&a.v!=="")||(a.t&&a.t.trim()))?" done":"";
  return `<div class="qcard${done}" data-sc="${q.id}"><div class="qh">${esc(L(q))}${q.required?' <span style="color:var(--coral)">*</span>':""}${isMulti(q)?` <small>${T3("(أكتر من اختيار)","(pick any)","(plusieurs choix)")}</small>`:""}</div>${q.hint?`<div class="qhint">${esc(L(q.hint))}</div>`:""}${body}</div>`;
}
function formHtml(){
  const k=K();
  return `<div class="hint" style="background:#FFF7E0;color:#5a4500">${esc(L(k.intro))}</div>
  <div class="cbox"><div class="ch">${T3("1. قول اقتراحك مرة واحدة","1. Say your idea in one go","1. Dites votre idée d'un coup")}</div><div class="muted">${esc(L(k.voiceHint))}</div>
  <div class="mf"><textarea id="sgVoice" dir="auto" rows="4" placeholder="${esc(T3("اضغط المايك واتكلم، أو اكتب","Tap the mic and speak, or type","Touchez le micro et parlez, ou écrivez"))}">${esc(CUR.voice||"")}</textarea></div>
  <button type="button" class="btn navy block" id="sgFill" style="margin-top:8px">${T3("املا الخانات من كلامي","Fill the form from my words","Remplir le formulaire avec mes mots")}</button></div>
  <div class="ch" style="margin:12px 2px 4px">${T3("2. راجع وكمّل (اختيارات بالضغط)","2. Review and complete (tap options)","2. Vérifiez et complétez (touchez les choix)")}</div>
  ${Q().map(qCard).join("")}
  <details class="guide"><summary>${T3("نصايح لاقتراح كويس","Tips for a good suggestion","Conseils pour une bonne idée")}</summary><div class="gt" style="white-space:pre-line">${esc(L(k.tips))}</div></details>
  <div class="row2" style="margin-top:10px"><button type="button" class="btn ghost" id="sgDraft">${T3("حفظ كمسودة","Save draft","Enregistrer le brouillon")}</button><button type="button" class="btn main" id="sgSubmit">${T3("حفظ وجاهز للإرسال","Save, ready to send","Enregistrer, prêt à envoyer")}</button></div>`;
}
function bindForm(root){
  const mark=id=>{const c=root.querySelector(`[data-sc="${id}"]`),a=CUR.a[id]||{};if(c)c.classList.toggle("done",!!(selIds(id).length||(a.t&&a.t.trim())||(a.v!=null&&a.v!=="")))};
  root.querySelectorAll("[data-so]").forEach(b=>b.onclick=()=>{const [id,o]=b.dataset.so.split("|"),q=Q().find(x=>x.id===id),a=ans(id);
    if(isMulti(q)){const l=Array.isArray(a.v)?a.v:[];const i=l.indexOf(o);if(i<0)l.push(o);else l.splice(i,1);a.v=l;b.classList.toggle("on")}
    else{a.v=a.v===o?"":o;root.querySelectorAll(`[data-so^="${id}|"]`).forEach(x=>x.classList.toggle("on",x.dataset.so===id+"|"+a.v))}mark(id)});
  root.querySelectorAll("[data-sn]").forEach(el=>el.oninput=()=>{const id=el.dataset.sn;ans(id).v=el.value;root.querySelectorAll(`[data-sq^="${id}|"]`).forEach(x=>x.classList.toggle("on",x.dataset.sq===id+"|"+el.value));mark(id)});
  root.querySelectorAll("[data-sq]").forEach(b=>b.onclick=()=>{const [id,n]=b.dataset.sq.split("|");ans(id).v=n;const el=root.querySelector(`[data-sn="${id}"]`);if(el)el.value=n;root.querySelectorAll(`[data-sq^="${id}|"]`).forEach(x=>x.classList.toggle("on",x===b));mark(id)});
  root.querySelectorAll("[data-st]").forEach(el=>el.oninput=()=>{ans(el.dataset.st).t=el.value;mark(el.dataset.st)});
  const v=root.querySelector("#sgVoice");v.oninput=()=>{CUR.voice=v.value};
  root.querySelector("#sgFill").onclick=async()=>{const t=v.value.trim();if(!t)return toast(T3("قول أو اكتب اقتراحك الأول","Say or type your idea first","Dites ou écrivez d'abord votre idée"));
    const b=root.querySelector("#sgFill");b.disabled=true;let used="rules";
    const tgt=CUR;
    if(AI&&AI.on&&navigator.onLine){b.textContent=T3("بفهم كلامك...","Understanding...","Analyse en cours...");try{await aiFill(t,tgt);used="ai"}catch(e){if(CUR===tgt)fillRules(t)}}else fillRules(t);
    b.disabled=false;if(CUR!==tgt||!$("#sgModal").classList.contains("show"))return;render();toast(used==="ai"?T3("الخانات اتملت بالذكاء الاصطناعي. راجعها","Form filled by AI. Review it","Formulaire rempli par l'IA. Vérifiez-le"):T3("الخانات اتملت من كلامك. راجع الاختيارات","Form filled from your words. Check the options","Formulaire rempli. Vérifiez les choix"))};
  root.querySelector("#sgDraft").onclick=()=>commit(CUR.status&&CUR.status!=="draft"?CUR.status:"draft");
  root.querySelector("#sgSubmit").onclick=()=>{const miss=Q().filter(q=>q.required&&!label(CUR,q.id));if(miss.length)return toast(T3("ناقص: ","Missing: ","Manquant : ")+miss.map(L).join(", "));commit(CUR.status==="draft"||!CUR.status?"submitted":CUR.status)};
  if(window.COACH)COACH.addMics(root);
}
function fillRules(text){
  const t=" "+nrm(text).replace(/[.,،؛;:!?؟()"«»\n]/g," ").replace(/\s+/g," ")+" ";
  const has=w=>{w=nrm(w).trim();if(!w)return false;return w.length<=4?(t.includes(" "+w+" ")||t.includes(" ال"+w+" ")||t.includes(" و"+w+" ")):t.includes(w)};
  const hit=kw=>{if(!kw)return 0;let n=0;for(const l of Object.values(kw))for(const w of l||[])if(has(w))n++;return n};
  const set=(id,v)=>{const a=ans(id);if(a.v==null||a.v===""||(Array.isArray(a.v)&&!a.v.length))a.v=v};
  const cats=(K().categories||[]).map(c=>[c.id,hit(c.kw)]).filter(x=>x[1]).sort((a,b)=>b[1]-a[1]);if(cats.length)set("cat",cats[0][0]);
  for(const q of Q()){if(q.id==="cat"||!(q.options||[]).some(o=>o.kw))continue;const m=q.options.filter(o=>hit(o.kw));if(!m.length)continue;set(q.id,isMulti(q)?m.map(o=>o.id):m[0].id)}
  const money=/(\d[\d,.]*)\s*(?:k\s*)?(?:الف|ألف)?\s*(?:جنيه|ج\.م|egp|pounds?|livres?|le\b)/i.exec(text);if(money){let n=num(money[1]);if(/الف|ألف|\dk/i.test(money[0]))n*=1000;const a=ans("saving");if(!a.v&&n!=null)a.v=String(n)}
  const parts=text.split(/(?:اقتراحي|بقترح|اقترح|أقترح|الاقتراح|my suggestion|i suggest|i propose|we could|je propose|ma suggestion|on pourrait)/i);
  const at=(id,v)=>{const a=ans(id);if(!(a.t&&a.t.trim())&&v&&v.trim())a.t=v.trim()};
  const tidy=x=>x.replace(/^\s*(?:is to|est de|is|was|to|that)\s+/i,"").replace(/^\s*(?:إن|ان|انه|إنه|بإن|بان)\s+/,"").replace(/^\s*(?:d'|qu'|de |que )/i,"").trim();
  const idea=parts.length>1?tidy(parts.slice(1).join(" ")):text;
  if(parts.length>1)at("now",parts[0]);at("idea",idea);
  at("title",idea.split(/[.؟?!\n،,]/)[0].slice(0,70));
}
async function aiFill(text,tgt){
  const qs=Q().map(q=>({id:q.id,type:q.type,label:q.en,options:optsOf(q).map(o=>({id:o.id,label:o.en}))}));
  const sys='You fill a workplace suggestion-box form from what an employee said (Egyptian Arabic, English or French). Use only what was said; never invent numbers. Return JSON {"answers":{"<question id>":{"v":"<option id>"|["<option ids>"]|"<number>","t":"<free text in the speaker\'s language>"}}}. Keep the speaker\'s wording for title, now and idea; title max 70 characters. Only use option ids that exist.';
  const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),15000);
  const r=await fetch("https://api.openai.com/v1/chat/completions",{signal:ac.signal,method:"POST",headers:{Authorization:"Bearer "+AI.cfg.key,"Content-Type":"application/json"},body:JSON.stringify({model:AI.cfg.model||"gpt-4o-mini",temperature:0,response_format:{type:"json_object"},messages:[{role:"system",content:sys},{role:"user",content:JSON.stringify({form:qs,said:text})}]})});
  clearTimeout(tm);if(!r.ok)throw new Error("http "+r.status);
  const j=JSON.parse((await r.json()).choices[0].message.content),A=(j&&typeof j.answers==="object"&&!Array.isArray(j.answers)&&j.answers)||{};let n=0;
  for(const q of Q()){const x=A[q.id];if(!x||typeof x!=="object")continue;const ok=new Set(optsOf(q).map(o=>o.id)),a=(tgt.a[q.id]=tgt.a[q.id]||{}),empty=a.v==null||a.v===""||(Array.isArray(a.v)&&!a.v.length);
    if(q.type==="number"){const v=num(x.v);if(v!=null&&empty){a.v=String(v);n++}}
    else if(q.type==="multi"){const l=(Array.isArray(x.v)?x.v:[x.v]).filter(v=>ok.has(v));if(l.length&&empty){a.v=l;n++}}
    else if(q.type==="single"){if(ok.has(x.v)&&empty){a.v=x.v;n++}}
    if(typeof x.t==="string"&&x.t.trim()&&!(a.t&&a.t.trim())){a.t=x.t.slice(0,1500);n++}}
  if(!n)throw new Error("empty");
}
function commit(status){
  CUR.status=status;CUR.updated=new Date().toISOString();const l=SG(),i=l.findIndex(x=>x.id===CUR.id);if(i<0)l.unshift(CUR);else l[i]=CUR;
  if(save()){$("#sgModal").classList.remove("show");if(window.COACH)COACH.stopMic();toast(status==="draft"?T3("اتحفظ كمسودة","Saved as draft","Brouillon enregistré"):T3("اتحفظ. ابعته من (اقتراحاتي)","Saved. Send it from My suggestions","Enregistré. Envoyez-le depuis Mes idées"));renderSugg()}
}

/* ---------- modal ---------- */
function render(){if(window.COACH)COACH.stopMic();const b=$("#sgBody"),y=b.scrollTop;b.innerHTML=formHtml();bindForm(b);b.scrollTop=y}
function open(x){
  if(!K())return toast("sugg_kb.js missing");
  CUR=x?JSON.parse(JSON.stringify(x)):{id:uid(),date:today(),status:"draft",a:{},voice:"",note:""};
  $("#sgTitle").textContent=T3("صندوق الاقتراحات","Suggestion box","Boîte à idées");
  $("#sgModal").classList.add("show");$("#sgBody").scrollTop=0;render();
}
window.sgOpen=open;

/* ---------- list + detail ---------- */
function shareText(x){
  const rows=Q().map(q=>{const v=label(x,q.id);return v?`${L(q)}: ${v}`:""}).filter(Boolean);
  const anon=((x.a.anon||{}).v||"");const who=anon==="anonymous"?"":(S.profile&&S.profile.name?S.profile.name:"");
  return [T3("اقتراح","Suggestion","Suggestion")+" "+x.id+" | "+x.date+(who?" | "+who:""),"",...rows].join("\n");
}
function sgCard(x){const st=stat(x.status),c=K().categories.find(c=>c.id===((x.a.cat||{}).v));
  return `<div class="item" data-sg="${x.id}" style="border-inline-start-color:${st.color||"#9B7DCD"}"><div class="top"><span>${esc(x.date)}</span><span class="chip" style="background:${st.color||"#999"};color:#fff">${esc(L(st))}</span></div><div class="ti" dir="auto">${esc(title(x))}</div>${c?`<span class="chip">${esc(L(c))}</span>`:""}</div>`}
function detail(x){if(window.COACH)COACH.stopMic();
  $("#sgVTitle").textContent=title(x);
  const rows=Q().map(q=>{const v=label(x,q.id);return v?`<dt>${esc(L(q))}</dt><dd dir="auto">${esc(v)}</dd>`:""}).join("");
  $("#sgVBody").innerHTML=`<dl class="kv">${rows}</dl>
   <label>${T3("الحالة (حدّثها لما الـHR أو مديرك يرد)","Status (update it when HR or your manager replies)","Statut (à mettre à jour après la réponse RH / responsable)")}</label>
   <div class="chips">${(K().statuses||[]).map(s=>`<button type="button" data-ss="${s.id}" class="${x.status===s.id?"on":""}">${esc(L(s))}</button>`).join("")}</div>
   <label>${T3("ملاحظة / رد","Note / reply","Note / réponse")}</label><div class="mf"><textarea id="sgNote" dir="auto" rows="2">${esc(x.note||"")}</textarea></div>
   <div class="row2" style="margin-top:10px"><button class="btn main" id="sgShare">${T3("ابعت (واتساب / إيميل)","Send (WhatsApp / email)","Envoyer (WhatsApp / e-mail)")}</button><button class="btn ghost" id="sgEdit">${T3("تعديل","Edit","Modifier")}</button></div>
   <button class="btn red block" id="sgDel" style="margin-top:8px">${T3("حذف","Delete","Supprimer")}</button>`;
  const b=$("#sgVBody");
  b.querySelectorAll("[data-ss]").forEach(e=>e.onclick=()=>{x.status=e.dataset.ss;x.updated=new Date().toISOString();save();detail(x);renderSugg()});
  b.querySelector("#sgNote").oninput=e=>{x.note=e.target.value.slice(0,600);save()};
  b.querySelector("#sgShare").onclick=async()=>{const miss=Q().filter(q=>q.required&&!label(x,q.id));if(miss.length)return toast(T3("ناقص: ","Missing: ","Manquant : ")+miss.map(L).join(", "));const t=shareText(x);try{if(navigator.share){await navigator.share({title:title(x),text:t});}else{await navigator.clipboard.writeText(t);toast(T3("اتنسخ، الصقه في الرسالة","Copied, paste it in your message","Copié, collez-le dans votre message"))}if(x.status==="draft"||x.status==="submitted"){x.status="submitted";save();detail(x);renderSugg()}}catch(e){}};
  b.querySelector("#sgEdit").onclick=()=>{$("#sgView").classList.remove("show");open(x)};
  b.querySelector("#sgDel").onclick=()=>{if(!confirm(T3("تمسح الاقتراح ده؟","Delete this suggestion?","Supprimer cette suggestion ?")))return;S.sg=SG().filter(y=>y.id!==x.id);save();$("#sgView").classList.remove("show");renderSugg()};
  if(window.COACH)COACH.addMics(b);
  $("#sgView").classList.add("show");
}
function renderSugg(){
  const box=$("#sgList");if(!box||!K())return;const l=SG();
  $("#sgCount").textContent=l.length?" ("+l.length+")":"";
  box.innerHTML=`<div class="card"><div class="row2"><button class="btn main" id="sgNew2">${BULB} ${T3("اقتراح جديد","New suggestion","Nouvelle idée")}</button><button class="btn ghost" id="sgXlsx">${T3("ابعت ملف Excel","Send Excel","Envoyer Excel")}</button></div><div class="muted" style="margin-top:6px">${esc(L(K().intro))}</div></div>`
   +(l.length?l.map(sgCard).join(""):`<div class="empty">${T3("لسه مفيش اقتراحات. أي فكرة تسهّل الشغل أو توفّر أو تفيد الناس، سجّلها.","No suggestions yet. Any idea that makes work easier, saves, or helps people: log it.","Aucune idée pour l'instant. Toute idée qui simplifie le travail, économise ou aide les gens : notez-la.")}</div>`)
   +((K().examples||[]).length?`<details class="guide"><summary>${T3("أمثلة اقتراحات","Example suggestions","Exemples d'idées")}</summary>${K().examples.map(e=>`<div class="gt"><b>${esc(L(e.title))}</b><div><small>${esc(L(e.idea))}</small></div></div>`).join("")}</details>`:"");
  box.querySelector("#sgNew2").onclick=()=>open();
  box.querySelector("#sgXlsx").onclick=exportXlsx;
  box.querySelectorAll("[data-sg]").forEach(e=>e.onclick=()=>{const x=SG().find(y=>y.id===e.dataset.sg);if(x)detail(x)});
}
window.renderSugg=renderSugg;

/* ---------- Excel export (Servier style) ---------- */
function exportXlsx(){
  const l=SG();if(!l.length)return toast(T3("مفيش اقتراحات","No suggestions","Aucune idée"));
  const x=s=>String(s==null?"":s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g,"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const col=i=>{let s="";i++;while(i){const m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26)}return s};
  const c=(r,i,v,s)=>typeof v==="number"?`<c r="${col(i)}${r}" s="${s}"><v>${v}</v></c>`:`<c r="${col(i)}${r}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${x(v)}</t></is></c>`;
  const qs=Q(),head=["ID","Date","Name","Status"].concat(qs.map(q=>q.en)).concat(["Note"]);
  const rows=[`<row r="1" ht="26" customHeight="1">${c(1,0,"Suggestion box | Servier Egypt | "+today(),2)}</row>`,`<row r="2" ht="30" customHeight="1">${head.map((h,i)=>c(2,i,h,1)).join("")}</row>`];
  l.forEach((s,k)=>{const r=3+k,anon=String((s.a.anon||{}).v||""),nm=anon==="anonymous"?"":((S.profile||{}).name||"");
    const save=q=>{if(q.type!=="number")return label(s,q.id);const n=num((s.a[q.id]||{}).v);return n==null?"":n};
    const vals=[s.id,s.date,nm,stat(s.status).en].concat(qs.map(save)).concat([s.note||""]);rows.push(`<row r="${r}">${vals.map((v,i)=>c(r,i,v,3)).join("")}</row>`)});
  const widths=[16,12,18,14].concat(qs.map(q=>q.type==="text"?44:20)).concat([30]);
  const sheet=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0" showGridLines="0"><pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${widths.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join("")}</cols><sheetData>${rows.join("")}</sheetData></worksheet>`;
  const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="3"><font><sz val="10"/><name val="Century Gothic"/></font><font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Century Gothic"/></font><font><b/><sz val="14"/><color rgb="FF242269"/><name val="Century Gothic"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF242269"/></patternFill></fill></fills><borders count="2"><border/><border><left style="thin"><color rgb="FFD3DEF2"/></left><right style="thin"><color rgb="FFD3DEF2"/></right><top style="thin"><color rgb="FFD3DEF2"/></top><bottom style="thin"><color rgb="FFD3DEF2"/></bottom></border></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="4"><xf/><xf fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/></xf><xf fontId="2" applyFont="1"/><xf fontId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf></cellXfs></styleSheet>`;
  const blob=makeZip([
    {name:"[Content_Types].xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`},
    {name:"_rels/.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`},
    {name:"xl/workbook.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Suggestions" sheetId="1" r:id="rId1"/></sheets></workbook>`},
    {name:"xl/_rels/workbook.xml.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`},
    {name:"xl/styles.xml",data:styles},{name:"xl/worksheets/sheet1.xml",data:sheet}]);
  shareBlob(blob,"Suggestions_"+today()+".xlsx",T3("اقتراحاتي","My suggestions","Mes idées"));
}

/* Rows for the one Master sheet (index.html buildXlsx). Anonymous suggestions carry no name or role. */
window.sgMasterRows=function(){return SG().map(s=>{const anon=String((s.a.anon||{}).v||"")==="anonymous";const sv=num((s.a.saving||{}).v);const idea=label(s,"idea");const now=label(s,"now"),ben=label(s,"benefit");
  return {id:s.id,date:s.date,anon:anon,building:label(s,"area"),area:"",machine:"",category:"Suggestion box",title:title(s),desc:[idea,now?"Today: "+now:"",ben?"Benefit: "+ben:""].filter(Boolean).join(" | "),impact:ben,dt:"",sav:sv==null?"":sv,evidence:"",status:stat(s.status).en,source:"Suggestion box",text:s.voice||"",loggedAt:s.updated||""}})};

/* ---------- wiring ---------- */
load();
$("#sgClose").onclick=()=>{if(window.COACH)COACH.stopMic();const old=CUR&&SG().find(x=>x.id===CUR.id);if(old&&JSON.stringify({a:old.a,v:old.voice})!==JSON.stringify({a:CUR.a,v:CUR.voice})&&confirm(T3("تحفظ التعديلات؟","Save your changes?","Enregistrer les modifications ?"))){commit(CUR.status||"draft");return}if(CUR&&(CUR.voice||Object.keys(CUR.a).length)&&!old&&confirm(T3("تحفظه كمسودة؟","Save it as a draft?","L'enregistrer en brouillon ?"))){commit("draft");return}$("#sgModal").classList.remove("show")};
$("#sgVClose").onclick=()=>{if(window.COACH)COACH.stopMic();$("#sgView").classList.remove("show")};
$$("[data-lv]").forEach(b=>b.onclick=()=>{const s=b.dataset.lv==="sg";$$("[data-lv]").forEach(x=>x.classList.toggle("on",x===b));$("#logView").style.display=s?"none":"";$("#sgList").style.display=s?"":"none";if(s)renderSugg()});
renderSugg();if(typeof renderChips==="function")renderChips();
})();
