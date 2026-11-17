(function(){
"use strict";
/* ===== Analysis coach: guided interview (tap options + mic), offline expert engine, optional online AI expert =====
   Knowledge base: kb.js (engineering + OpEx). Globals used from index.html: S, $, $$, esc, today, toast, machines, AI, whisper, isEN */

/* ---------- helpers ---------- */
const FR=()=>!!(window.I18N&&I18N.isFR&&I18N.isFR()),fr=s=>window.I18N&&I18N.fr?I18N.fr(s):s
const L=o=>o?(isEN()?(FR()?(o.fr||fr(o.en||"")||o.ar):(o.en||o.ar||"")):(o.ar||o.en||"")):"";
const T2=(ar,en)=>isEN()?(FR()?fr(en):en):ar;
let SLANG="en";const SL=o=>o?(SLANG==="ar"?(o.ar||o.en||""):SLANG==="fr"?(o.fr||frF(o.en||"")||o.ar||""):(o.en||o.ar||"")):"";const ST=(ar,en)=>SLANG==="ar"?ar:SLANG==="fr"?frF(en):en;
const frF=s=>window.I18N&&I18N.frForce?I18N.frForce(s):s;
const uiLang=()=>FR()?"fr":isEN()?"en":"ar";
const num=v=>{const n=parseFloat(String(v==null?"":v).replace(/,/g,""));return isFinite(n)?n:null};
const fmtN=n=>n==null?"":(Math.round(n*100)/100).toLocaleString("en-US");
const addDays=(d,n)=>{const x=new Date((d||today())+"T00:00:00");x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
const KIND_ORDER=["eliminate","design","poka_yoke","pm","standard","inspection","training","temporary"];
const KIND_LBL={eliminate:["إلغاء السبب","Eliminate"],design:["تعديل تصميم","Design change"],poka_yoke:["Poka-yoke","Poka-yoke"],pm:["PM","PM"],standard:["Standard / SOP","Standard / SOP"],inspection:["فحص","Inspection"],training:["تدريب","Training"],temporary:["مؤقت","Temporary"]};
const FISH_LBL={materials:["خامات","Materials"],methods:["طرق","Methods"],man:["ناس","Man"],machines:["ماكينات","Machines"],nature:["بيئة","Environment"],measurement:["قياس","Measurement"]};
const DUE={temporary:0,inspection:7,training:14,standard:14,pm:14,poka_yoke:30,design:45,eliminate:45};
const PERSON_RX=/operator error|human error|careless|negligen|not focus|forgot|mistake by|غلط(ة)? (الفني|العامل|المشغل|الأوبريتور|الاوبريتور)|إهمال|اهمال|نسي|مش مركز|مهمل|خطأ بشري|خطا بشري|سهو/i;

/* ---------- knowledge base ---------- */
let KBc=null;
function kb(){
  if(KBc)return KBc;const A=window.KB_ENG_A||{},B=window.KB_ENG_B||{},O=window.KB_OPEX;if(!O)return null;
  KBc={fam:Object.assign({},A.families||{},B.families||{}),causes:Object.assign({},A.causes,B.causes,O.causes),cms:Object.assign({},A.cms,B.cms,O.cms),kpis:Object.assign({},A.kpis,B.kpis,O.kpis),O};
  return KBc;
}
const FAM_RX=[["gran",/gea|granul|fbd|pma|pharmaconnect/i],["blend",/bohle|blend/i],["air",/compressed air|compressor/i],["press",/fette|sviac|\btablet press\b/i],["caps",/mg2|planeta|capsul/i],["coat",/manesty|accelacota|gs ht|effecta|coat/i],["count",/pharmacount|pps|count/i],["blister",/blister/i],["carton",/carton/i],["hvac",/hvac|ahu/i],["pw",/purified water|\bpw\b/i],["air",/compressed air|compressor/i],["boiler",/boiler|steam/i],["elec",/electrical|panel|mdb/i],["bms",/bms|ems/i]];
function famOf(name){for(const [f,rx] of FAM_RX)if(rx.test(name||""))return f;return "general"}
function ctxOf(AD){
  const e=AD.entryId?(S.entries||[]).find(x=>x.id===AD.entryId)||null:null;
  const cat=AD.type==="Kaizen"?"Kaizen":(AD.cat||(e&&e.category)||"default");
  const m=(machines().find(x=>x.name===AD.machine))||{name:AD.machine||"",building:"",area:""};
  return{e,cat,fam:famOf(AD.machine),m,date:AD.date||today()};
}
const ISSUE=["Breakdown Fixed","Changeover","GMP / Quality","Safety","Energy & Utilities","Spare Parts Needed","Warehouse Issue"];
const flowCat=c=>ISSUE.includes(c)?c:"default";
function flowOf(AD,cx){const O=kb().O,f=O.flows[AD.type]||{};return (AD.type==="Kaizen"?f.default:(f[flowCat(cx.cat)]||f.default))||[]}
function symptomsOf(cx){
  const K=kb(),fam=K.fam[cx.fam],cs=K.O.catSymptoms||{};
  if(cx.cat==="Breakdown Fixed")return (fam?fam.symptoms:[]).concat(fam?[]:(cs.default||[]));
  if(cx.cat==="GMP / Quality")return (cs["GMP / Quality"]||[]).concat(fam?fam.symptoms:[]);
  if(cx.cat==="Kaizen")return [];
  if(flowCat(cx.cat)==="default")return (fam?fam.symptoms:[]).concat(cs.default||[]);
  return (cs[flowCat(cx.cat)]||cs.default||[]).concat(fam&&cx.fam!=="general"?fam.symptoms:[]);
}
function optsOf(q,cx){
  if(q.id==="sym")return symptomsOf(cx);
  if(q.id==="part"){const f=kb().fam[cx.fam];return f?f.parts.map((p,i)=>Object.assign({id:"p"+i},p)):[]}
  if(q.id==="kz_loss"&&!(q.options||[]).length)return (kb().O.kaizen||{}).losses||[];
  return (q.byCat&&q.byCat[flowCat(cx.cat)])||q.options||[];
}
const Q=id=>{const q=kb().O.questions[id];if(q)q.id=id;return q};
const isMulti=q=>q.type==="multi"&&q.id!=="sym";

/* ---------- answers ---------- */
const IV=AD=>(AD.iv=AD.iv||{});
const CZ=AD=>(AD.cz=AD.cz||{});
const ans=(AD,id)=>IV(AD)[id]||{};
function selIds(AD,id){const v=ans(AD,id).v;return Array.isArray(v)?v:(v!=null&&v!==""?[String(v)]:[])}
function selOpts(AD,id,cx){const q=Q(id);if(!q)return[];const ids=selIds(AD,id);return optsOf(q,cx).filter(o=>ids.includes(o.id))}
function ansText(AD,id,cx,lang){ // labels of selected options + details, in sheet language
  const q=Q(id);if(!q)return "";const a=ans(AD,id),pick=lang==="ui"?L:SL;let parts=[];
  if(q.type==="number"){if(num(a.v)!=null)parts.push(fmtN(num(a.v))+(q.unit?" "+q.unit:""))}
  else if(q.type==="text"){}
  else parts=selOpts(AD,id,cx).map(pick);
  if(a.t&&a.t.trim())parts.push(a.t.trim());
  return parts.join(SLANG==="ar"&&lang!=="ui"?"، ":", ");
}
function tagSet(AD,cx){
  const T=new Set(),NEG=new Set();
  const CHG=new Set();
  for(const id of Object.keys(IV(AD))){const q=Q(id);if(!q||q.type==="number"||q.type==="text")continue;
    for(const o of selOpts(AD,id,cx))(o.tags||[]).forEach(t=>{(id==="checked"?NEG:T).add(t);if(id==="chg")CHG.add(t)})}
  return{T,NEG,CHG};
}

/* ---------- engine: rank causes ---------- */
function rank(AD,cx){
  const K=kb(),{T,NEG,CHG}=tagSet(AD,cx),st=CZ(AD).st||{},pool=new Map(),linked=new Set(),add=(id,s)=>{if(K.causes[id])pool.set(id,Math.max(pool.get(id)||-99,s))};
  const syms=selOpts(AD,"sym",cx);
  syms.forEach(s=>(s.causes||[]).forEach((id,i)=>{add(id,10-i*1.5);linked.add(id)}));
  symptomsOf(cx).forEach(s=>(s.causes||[]).forEach(id=>add(id,0)));
  if(AD.type==="Kaizen"||!pool.size){ // improvement: match by loss tags across the family + OpEx causes
    const fam=K.fam[cx.fam];(fam?fam.symptoms:[]).forEach(s=>(s.causes||[]).forEach(id=>add(id,0)));
    Object.keys(K.causes).filter(id=>id.startsWith("o_")).forEach(id=>add(id,-1));
  }
  const out=[];
  const anyCtx=syms.length>0||T.size>0;
  for(const [id,base] of pool){const c=K.causes[id],tg=c.tags||[],hit=tg.filter(t=>T.has(t)).length;let s=base+hit*2.5+tg.filter(t=>CHG.has(t)).length*1.5-tg.filter(t=>NEG.has(t)).length*1.5;
    const status=st[id]||"";
    if(anyCtx&&!linked.has(id)&&!hit&&!status)continue; /* not related to anything the user said */
    if(status==="ok")s+=100;if(status==="no")s-=100;out.push({id,c,score:s,status})}
  out.sort((a,b)=>b.score-a.score);
  if(AD.type==="Kaizen"&&!T.size)return out.slice(0,0);
  return out;
}
const custom=AD=>(CZ(AD).cc=CZ(AD).cc||[]);
function chosenCauses(AD,cx){const r=rank(AD,cx),ok=r.filter(x=>x.status==="ok");return ok.length?{list:ok,verified:true}:{list:r.filter(x=>x.status!=="no").slice(0,2),verified:false}}
function cmPool(AD,cx){
  const K=kb(),{list}=chosenCauses(AD,cx),cont=[],perm=[],kp=[];
  list.forEach(x=>{(x.c.cont||[]).forEach(id=>{if(K.cms[id]&&!cont.includes(id))cont.push(id)});(x.c.cm||[]).forEach(id=>{if(K.cms[id]&&!perm.includes(id))perm.push(id)});(x.c.kpi||[]).forEach(id=>{if(K.kpis[id]&&!kp.includes(id))kp.push(id)})});
  const ko=id=>KIND_ORDER.indexOf(K.cms[id].kind);perm.sort((a,b)=>ko(a)-ko(b));
  const pc=prodCont(AD,cx);if(pc&&!cont.includes(pc))cont.unshift(pc);
  return{cont,perm,kp};
}
const PROD_RX=/segregat|quarantin|hold product|hold \/ quarantine|100% (inspect|sort)/i;
function defectSym(AD,cx){return selOpts(AD,"sym",cx).some(s=>(s.tags||[]).includes("defects"))||cx.cat==="GMP / Quality"}
function prodCont(AD,cx){if(!defectSym(AD,cx))return null;const K=kb();const pref=["a_","b_"].includes(String((selOpts(AD,"sym",cx)[0]||{}).id||"").slice(0,2))?(String(selOpts(AD,"sym",cx)[0].id).slice(0,2)==="a_"?"a_cm_t_segregate":"b_cm_qa"):(cx.fam&&["count","blister","carton"].includes(cx.fam)?"b_cm_qa":"a_cm_t_segregate");return K.cms[pref]?pref:null}
function picks(AD,cx){ // default picks the first time
  const z=CZ(AD),p=cmPool(AD,cx);
  if(!z.pc){z.pc=[].concat(p.cont.slice(0,1),p.perm.slice(0,2))}
  const pc=prodCont(AD,cx);if(pc&&!z.pcAuto){z.pcAuto=1;if(!z.pc.includes(pc))z.pc.unshift(pc)}
  if(!z.pk){z.pk=p.kp.slice(0,2)}
  return z;
}
function chainOf(AD,cx){ // returns {sym, whys[], root}
  const syms=selOpts(AD,"sym",cx),sym=AD.type==="Kaizen"?((ans(AD,"kz_before").t||"").split(/(?<!\d)\.(?!\d)|\n/)[0].trim()||AD.title||""):syms.length?SL(syms[0]):(ans(AD,"sym").t||AD.title||"");
  const ch=chosenCauses(AD,cx),cc=custom(AD).filter(x=>x.st==="ok");
  if(ch.verified||!cc.length){const c=ch.list[0];if(c){const w=(c.c.why||[]).map(SL);return{sym,whys:w,root:w[w.length-1]||SL(c.c),cause:SL(c.c),verified:ch.verified}}}
  if(cc.length)return{sym,whys:[cc[0].text],root:cc[0].text,cause:cc[0].text,verified:true};
  return{sym,whys:[],root:"",cause:"",verified:false};
}

/* ---------- problem statement ---------- */
function problemStatement(AD,cx){
  const a=k=>ansText(AD,k,cx),mach=AD.machine||"",d=num(ans(AD,"dur").v),c=num(ans(AD,"cost").v),rep=selOpts(AD,"rep",cx).map(SL)[0]||"";
  if(AD.type==="Kaizen"){
    const bt=(ans(AD,"kz_before").t||AD.title||"").trim().replace(/[.\s]*$/,""),loss=a("kz_loss");
    return [mach?mach+":":"",bt?bt+".":"",loss?ST("نوع الهدر: ","Loss / waste: ")+loss+".":""].filter(Boolean).join(" ");
  }
  const sym=(selOpts(AD,"sym",cx).map(SL)[0]||ans(AD,"sym").t||AD.title||"").trim(),std=a("std"),det=a("det"),act=actualText(AD,cx);
  const imp=[d!=null?fmtN(d)+ST(" ساعة توقف"," h downtime"):"",c!=null?fmtN(c)+ST(" جنيه"," EGP"):"",rep?(SLANG==="ar"?rep:ST("","repeats: ")+rep):""].filter(Boolean).join(ST("، ",", "));
  const fin=x=>x&&!/[.!?؟]$/.test(x)?x+".":x;
  return [mach?mach+":":"",fin(sym),std?fin(ST("المعيار: ","Standard: ")+std):"",act?fin(ST("الفعلي: ","Actual: ")+act):"",imp?fin(ST("الأثر: ","Impact: ")+imp):"",det?fin(ST("اتكشفت عن طريق ","Detected by ")+det+ST(" يوم "," on ")+dmy(cx.date)):""].filter(Boolean).join(" ");
}
function actualText(AD,cx){
  const a=ans(AD,"act").t||"",co=num(ans(AD,"co_min").v),sp=num(ans(AD,"sp_days").v),sd=ans(AD,"sym").t||"";
  return [a.trim(),co!=null?ST("تغيير المنتج خد ","changeover took ")+fmtN(co)+" min":"",sp!=null?ST("مستنيين القطعة "," waiting ")+fmtN(sp)+ST(" يوم"," days for the part"):"",!a&&sd&&sd!==AD.title?sd.trim():""].filter(Boolean).join(ST("، ","; "));
}
const dmy=s=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||"");return m?`${m[3]}/${m[2]}/${m[1]}`:(s||"")};

/* ---------- tool recommendation ---------- */
function recommend(AD,cx){
  const rep=selIds(AD,"rep")[0]||"",d=num(ans(AD,"dur").v)||0,c=num(ans(AD,"cost").v)||0,known=selIds(AD,"known")[0]||"";
  const why=[];
  if(AD.type==="Kaizen")return{tool:"Kaizen",why:[]};
  const tri=AD.tri||{};if(tri.tr_size==="big")why.push(T2("اخترت إن المشكلة كبيرة","You rated the problem as big"));if(tri.tr_crit&&tri.tr_crit!=="none"&&tri.tr_known!=="confirmed")why.push(T2("فيه أثر سلامة/GMP والسبب مش مؤكد","Safety/GMP impact with an unconfirmed cause"));
  if(rep==="r4plus")why.push(T2("المشكلة اتكررت 4 مرات أو أكتر في 3 شهور","Repeated 4+ times in 3 months"));
  if(d>=4)why.push(T2("التوقف 4 ساعات أو أكتر","Downtime 4 h or more"));
  if(c>=20000)why.push(T2("التكلفة 20,000 جنيه أو أكتر","Cost 20,000 EGP or more"));
  if(cx.cat==="Safety"&&selIds(AD,"impact6").includes("S")&&(d>=1||rep&&rep!=="first"))why.push(T2("موضوع سلامة متكرر","Recurring safety issue"));
  if(known==="unknown"&&(rep==="r2_3"||d>=2))why.push(T2("السبب مش معروف والمشكلة مش بسيطة","Cause unknown and problem not trivial"));
  return{tool:why.length?"A3":"3C",why};
}
function triageRec(tr){ // tr: {tr_kind, tr_size, tr_rep, tr_known, tr_crit}
  if(tr.tr_kind==="improve")return "Kaizen";
  const unconf=tr.tr_known&&tr.tr_known!=="confirmed";
  if(tr.tr_rep==="r4plus"||tr.tr_size==="big"||(tr.tr_rep==="r2_3"&&unconf)||(tr.tr_crit&&tr.tr_crit!=="none"&&unconf))return "A3";
  return Object.keys(tr).length?"3C":"";
}
/* ---------- coaching rules ---------- */
function evalRules(AD,cx){
  if(!Object.keys(IV(AD)).length&&JSON.stringify(AD.data).replace(/"(date|opened|start|kind)":"[^"]*"/g,"").match(/"[^"]{12,}"/))return[{id:"_legacy",sev:"low",ar:"التحليل ده اتعمل قبل الأسئلة الجديدة. جاوب الأسئلة لو عايز المساعد يراجعه، أو عدّل النموذج على طول.",en:"This analysis was made before the guided questions. Answer them if you want the coach to review it, or edit the sheet directly.",fix:null}];
  const O=kb().O,z=picks(AD,cx),K=kb(),out=[];
  const allText=()=>[CZ(AD).ps||"",...Object.values(IV(AD)).map(a=>a.t||""),...custom(AD).map(x=>x.text)].join(" ");
  const has=(id)=>{const a=ans(AD,id);return (Array.isArray(a.v)?a.v.length:(a.v!=null&&a.v!==""))||(a.t&&a.t.trim())};
  const permPicked=(z.pc||[]).filter(id=>K.cms[id]&&K.cms[id].kind!=="temporary"&&!(cmPool(AD,cx).cont.includes(id)));
  const inFlow=new Set(flowOf(AD,cx));
  const test=cl=>{
    if((cl.q&&!inFlow.has(cl.q))||(cl.empty&&!inFlow.has(cl.empty)))return false;
    if(cl.q){const q=Q(cl.q);if(!q)return false;if(cl.in)return selIds(AD,cl.q).some(x=>cl.in.includes(x));const n=num(ans(AD,cl.q).v);if(n==null)return false;if(cl.gte!=null)return n>=cl.gte;if(cl.lt!=null)return n<cl.lt;return false}
    if(cl.empty)return !has(cl.empty);
    if(cl.tool)return AD.type===cl.tool;
    if(cl.notTool)return AD.type!==cl.notTool;
    if(cl.notCat)return cx.cat!==cl.notCat;
    if(cl.symTag)return selOpts(AD,"sym",cx).some(o=>(o.tags||[]).includes(cl.symTag));
    if(cl.noProductCont)return !(z.pc||[]).some(id=>K.cms[id]&&PROD_RX.test(K.cms[id].en))&&!PROD_RX.test(ans(AD,"fix").t||"")&&!selIds(AD,"gmp_imp").some(x=>x==="held")&&!selOpts(AD,"fix",cx).some(o=>PROD_RX.test(o.en||""));
    if(cl.stdNoValue)return inFlow.has("std")&&selIds(AD,"std").length>0&&!selIds(AD,"std").includes("none")&&!/\d/.test(ans(AD,"std").t||"");
    if(cl.noEvidence){const ev=CZ(AD).ev||{};return Object.entries(CZ(AD).st||{}).some(([id,v])=>v==="ok"&&!(ev[id]&&(ev[id].k||ev[id].t)))}
    if(cl.cat)return cx.cat===cl.cat;
    if(cl.weakCm)return permPicked.length>0&&permPicked.every(id=>["training","inspection","temporary"].includes(K.cms[id].kind));
    if(cl.personCause)return PERSON_RX.test(allText());
    if(cl.noCheck)return !rank(AD,cx).some(x=>x.status==="ok")&&!custom(AD).some(x=>x.st==="ok");
    if(cl.noNumbers)return !/\d/.test([ansText(AD,"std",cx),ans(AD,"sym").t,ans(AD,"act").t,ans(AD,"co_min").v,ans(AD,"sp_days").v,ans(AD,"dur").v,ans(AD,"cost").v,ans(AD,"kz_bval").v,ans(AD,"kz_before").t].join(" "));
    if(cl.noContainment)return !has("fix")&&!(z.pc||[]).some(id=>cmPool(AD,cx).cont.includes(id));
    if(cl.noKpi)return !(z.pk||[]).length;
    return false};
  for(const r of O.rules||[]){try{if((r.when||[]).every(test))out.push(r)}catch(e){}}
  if(AD.type!=="Kaizen"&&!permPicked.length&&!(CZ(AD).cm||[]).length)out.push({id:"_noperm",sev:"high",ar:"مفيش حل دائم مختار. الاحتواء بيوقف العرض بس، والمشكلة هترجع.",en:"No permanent countermeasure selected. Containment only stops the symptom; the problem will come back.",fix:{ar:"اختار حل دائم واحد على الأقل من القايمة تحت، ويفضّل من النوع الأقوى (إلغاء، تصميم، Poka-yoke، PM).",en:"Pick at least one permanent countermeasure below, preferably a strong kind (eliminate, design, poka-yoke, PM)."}});
  const rec=recommend(AD,cx);
  if(rec.tool!==AD.type&&AD.type!=="Kaizen"&&(rec.tool==="A3"||!AD.tri||!Object.keys(AD.tri).length)&&rec.tool==="A3"&&!out.some(r=>r.action==="switch_"+rec.tool))out.unshift({id:"_tool",sev:rec.tool==="A3"?"high":"low",ar:(rec.tool==="A3"?"المشكلة دي أكبر من 3C: ":"المشكلة بسيطة و3C يكفي: ")+rec.why.join("، "),en:(rec.tool==="A3"?"This is bigger than a 3C: ":"A 3C is enough here: ")+rec.why.join(", "),fix:{ar:rec.tool==="A3"?"حوّل لـA3 عشان تحلل بعمق وتشارك الفريق.":"ممكن تكمل 3C وتوفر وقت.",en:rec.tool==="A3"?"Switch to A3 for a full analysis with the team.":"You can continue with a 3C and save time."},action:"switch_"+rec.tool});
  const sv={high:0,med:1,low:2};return out.sort((a,b)=>(sv[a.sev]||1)-(sv[b.sev]||1));
}

/* ---------- build the sheet data from interview + engine ---------- */
function sameFamily(AD){const f=famOf(AD.machine);return machines().filter(m=>m.name!==AD.machine&&famOf(m.name)===f&&f!=="general").map(m=>m.name)}
function build(AD,overwrite){
  const cx=ctxOf(AD),K=kb();if(!K)return;SLANG=CZ(AD).lang||uiLang();
  const z=picks(AD,cx),d=AD.data,set=(o,k,v)=>{if(v==null||v==="")return;if(overwrite||!o[k]||(Array.isArray(o[k])&&!o[k].length))o[k]=v};
  const J=l=>l.filter(Boolean).join(SLANG==="ar"?"، ":", ");
  const ps=(CZ(AD).ps&&CZ(AD).ps.trim())||problemStatement(AD,cx),ch=chainOf(AD,cx),pool=cmPool(AD,cx);
  const contSel=(z.pc||[]).filter(id=>pool.cont.includes(id)&&K.cms[id]),permSel=(z.pc||[]).filter(id=>K.cms[id]&&!pool.cont.includes(id));
  const cust=custom(AD),cc=(CZ(AD).cm||[]),ev=CZ(AD).ev||{};
  const fixDone=ansText(AD,"fix",cx),parts=ansText(AD,"part",cx),checked=ansText(AD,"checked",cx),det=ansText(AD,"det",cx),who=ansText(AD,"who",cx),chg=ansText(AD,"chg",cx),act=actualText(AD,cx);
  const r=rank(AD,cx),ver=r.filter(x=>x.status==="ok"),ruled=r.filter(x=>x.status==="no"),top=r.filter(x=>x.status!=="no").slice(0,2);
  const EVK={measured:ST("اتقاس","Measured"),seen:ST("اتشاف","Seen"),trend:ST("Trend / بيانات","Trend / data"),swap:ST("swap test","Swap test")};
  const evLine=x=>{const e=ev[x.id]||{};return SL(x.c)+(e.k||e.t?" — "+[EVK[e.k]||"",e.t||""].filter(Boolean).join(": "):ST(" — (مفيش دليل مكتوب)"," — (no evidence recorded)"))};
  const facts=J([ansText(AD,"gmp_imp",cx)?ST("أثر على المنتج: ","Product: ")+ansText(AD,"gmp_imp",cx):"",ansText(AD,"qa_note",cx)?"QA: "+ansText(AD,"qa_note",cx):"",ansText(AD,"loto",cx)?"LOTO: "+ansText(AD,"loto",cx):"",ansText(AD,"saf_rep",cx)?ST("بلاغ HSE: ","HSE report: ")+ansText(AD,"saf_rep",cx):""]);
  const unv=!ch.verified,root=ch.root?(unv?ST("لسه محتاج تأكيد: ","To verify: "):"")+ch.root:"";
  const prof=(S.profile||{}).name||"";
  const horizSel=selIds(AD,"kz_horiz")[0]||"",fam=sameFamily(AD),horizTxt=(ans(AD,"kz_horiz").t||"").trim()||(horizSel==="yes"?ST("أيوه: ","Yes: ")+(fam.length?fam.join(", "):ST("الماكينات المشابهة","similar machines")):horizSel==="later"?ST("بعد ما النتايج تتأكد: ","Later, after results are confirmed: ")+fam.join(", "):horizSel==="no"?ST("لا","No"):"");
  if(AD.type==="3C"){const c=d.c3;
    set(c,"concern",ps+(chg?"\n"+ST("بدأت بعد: ","Started after: ")+chg:""));
    const chain=[ch.sym,...ch.whys].filter(Boolean).join(" → ");
    set(c,"cause",[ST("فين: ","Where: ")+(AD.machine||"")+(cx.m.area?" ("+cx.m.area+")":"")+"   "+ST("إمتى: ","When: ")+dmy(cx.date),det?ST("اتكشفت: ","Detected: ")+det:"",ch.cause?(ch.verified?ST("السبب المؤكد: ","Verified cause: "):ST("السبب الأرجح (لسه محتاج تأكيد): ","Most likely cause (to verify): "))+ch.cause:"",ver.length?ST("الدليل: ","Evidence: ")+ver.map(evLine).join("; "):"",chain?ST("ليه-ليه: ","Why-why: ")+chain:"",root?ST("السبب الجذري: ","Root cause: ")+root:""].filter(Boolean).join("\n"));
    set(c,"containment",[fixDone?ST("اتعمل: ","Done: ")+fixDone:"",parts?ST("قطع اتغيرت: ","Parts replaced: ")+parts:"",facts,...contSel.map(id=>"- "+SL(K.cms[id]))].filter(Boolean).join("\n"));
    const cmL=permSel.map((id,i)=>`${i+1}. ${SL(K.cms[id])} (${SL(K.cms[id].owner)})`).concat(cc.map((x,i)=>`${permSel.length+i+1}. ${x}`));
    set(c,"countermeasure",(unv&&cmL.length?ST("مقترح، بعد تأكيد السبب:","Proposed, after the cause is confirmed:")+"\n"+(top.length?top.map(x=>"- "+ST("اتأكد: ","Verify: ")+SL(x.c.check)).join("\n")+"\n":""):"")+cmL.join("\n"));
    set(c,"observations",[ruled.length?ST("أسباب اتستبعدت: ","Ruled out: ")+ruled.map(x=>SL(x.c)).join(", "):"",checked?ST("اتفحص قبل كده: ","Already checked: ")+checked:"",(z.pk||[]).length?ST("هنتابع: ","Follow KPI: ")+(z.pk||[]).filter(id=>K.kpis[id]).map(id=>SL(K.kpis[id])).join(", "):""].filter(Boolean).join("\n"));
    if(!c.initials&&prof)c.initials=prof.split(/\s+/).map(w=>w[0]).join("").toUpperCase().slice(0,3);
  }else if(AD.type==="A3"){const a=d.a3;
    set(a,"originator",prof);set(a,"scope",[cx.m.building,cx.m.area].filter(Boolean).join(" / "));set(a,"process",cx.m.area||AD.machine);
    const imp=selIds(AD,"impact6");if(imp.length)set(a,"impact",imp.filter(x=>["Q","C","D","S","CSR","E"].includes(x)));
    const symL=(selOpts(AD,"sym",cx).map(SL)[0]||AD.title||"");
    set(a,"what",symL+(act?" — "+act:"")+(chg?". "+ST("بدأت بعد: ","Started after: ")+chg:""));set(a,"who",who||prof);set(a,"where",[AD.machine,cx.m.area].filter(Boolean).join(", "));set(a,"when_date",cx.date);
    set(a,"how_know",J([det,ansText(AD,"qa_note",cx)?"QA: "+ansText(AD,"qa_note",cx):""]));
    const dd=num(ans(AD,"dur").v),cc2=num(ans(AD,"cost").v),rep=ansText(AD,"rep",cx),co=num(ans(AD,"co_min").v),sp=num(ans(AD,"sp_days").v);
    set(a,"how_much",[dd!=null?ST("توقف ","Downtime ")+fmtN(dd)+" h":"",cc2!=null?ST("تكلفة ","Cost ")+fmtN(cc2)+" EGP":"",co!=null?ST("تغيير المنتج ","Changeover ")+fmtN(co)+" min":"",sp!=null?ST("انتظار قطعة ","Waiting for part ")+fmtN(sp)+ST(" يوم"," days"):"",rep?ST("تكرار: ","Repeats: ")+rep:"",ansText(AD,"gmp_imp",cx)?ST("أثر على المنتج: ","Product impact: ")+ansText(AD,"gmp_imp",cx):""].filter(Boolean).join("; "));
    set(a,"redefined",ps);
    const fb={materials:[],methods:[],man:[],machines:[],nature:[],measurement:[]};let gen=0;
    r.filter(x=>x.status!=="no").slice(0,10).forEach(x=>{const l=fb[x.c.fish];if(!l||l.length>=6)return;if(x.id.startsWith("o_")&&x.status!=="ok"){if(gen>=2)return;gen++}l.push(SL(x.c))});
    cust.forEach(x=>{const l=fb[x.fish||"methods"];if(l&&l.length<6&&!l.includes(x.text))l.push(x.text)});
    if(overwrite||!Object.values(a.fishbone).some(l=>l.length))a.fishbone=fb;
    set(a,"plausible",ch.cause+(ch.verified?"":ST(" (لسه محتاج تأكيد)"," (to be verified)")));
    if(overwrite||!a.whys.some(Boolean))a.whys=[0,1,2,3,4].map(i=>ch.whys[i]||"");
    set(a,"root_cause",root);
    const ideas=[].concat(contSel,permSel,pool.perm.filter(id=>!permSel.includes(id))).slice(0,9).map(id=>{const m=K.cms[id];return{text:SL(m),impact:m.impact,effort:m.effort}});
    cc.forEach(t=>{if(ideas.length<9)ideas.push({text:t,impact:"",effort:""})});
    if(overwrite||!a.ideas.some(x=>x.text))a.ideas=Array.from({length:9},(_,i)=>ideas[i]||{text:"",impact:"",effort:""});
    set(a,"solution",(unv?ST("مقترح بعد تأكيد السبب: ","Proposed once the cause is confirmed: "):"")+permSel.map(id=>SL(K.cms[id])).concat(cc).join("; "));
    const acts=[];
    contSel.forEach(id=>{const m=K.cms[id];acts.push({activity:SL(m),who:SL(m.owner),start:cx.date,due:cx.date,status:fixDone?"Done":"In progress"})});
    if(unv)top.forEach(x=>acts.push({activity:ST("اتأكد من السبب: ","Verify cause: ")+SL(x.c.check),who:ST("الصيانة","Maintenance"),start:today(),due:addDays(today(),3),status:"Planned"}));
    permSel.forEach(id=>{const m=K.cms[id];acts.push({activity:(unv?ST("(بعد تأكيد السبب) ","(after cause confirmed) "):"")+SL(m),who:SL(m.owner),start:today(),due:addDays(today(),(DUE[m.kind]||14)+(unv?3:0)),status:"Planned"})});
    cc.forEach(t=>acts.push({activity:t,who:"",start:today(),due:addDays(today(),14),status:"Planned"}));
    if(overwrite||!a.actions.some(x=>x.activity))a.actions=Array.from({length:8},(_,i)=>acts[i]||{activity:"",who:"",start:"",due:"",status:""});
    const firstNum=(act.match(/\d+(?:[.,]\d+)?\s*%?/)||[""])[0].trim();
    const kp=(z.pk||[]).filter(id=>K.kpis[id]).slice(0,3).map((id,i)=>{const k=K.kpis[id],u=k.unit;let base="";if(/^h/.test(u)&&dd!=null)base=fmtN(dd)+" h";else if(/EGP/i.test(u)&&cc2!=null)base=fmtN(cc2)+" EGP";else if(/min/.test(u)&&co!=null)base=fmtN(co)+" min";else if(i===0&&firstNum)base=firstNum;return{name:SL(k)+(u?" ("+u+")":""),baseline:base,goal:"",current:""}});
    if(overwrite||!a.metrics.some(x=>x.name))a.metrics=Array.from({length:3},(_,i)=>kp[i]||{name:"",baseline:"",goal:"",current:""});
    set(a,"comments",J([ver.length?ST("الدليل: ","Evidence: ")+ver.map(evLine).join("; "):"",checked?ST("اتفحص/اتستبعد قبل كده: ","Already checked / ruled out: ")+checked:"",ruled.length?ST("أسباب اتستبعدت: ","Ruled out: ")+ruled.map(x=>SL(x.c)).join(", "):"",facts]));
    const fu=[{activity:ST("تأكيد فعالية الحل بعد 3 شهور (مفيش تكرار)","Verify effectiveness after 3 months (no recurrence)"),who:prof,start:"",due:addDays(today(),90),status:"Planned"},{activity:ST("تحديث الـSOP / خطة الـPM / OPL","Update SOP / PM plan / OPL"),who:ST("الصيانة","Maintenance"),start:"",due:addDays(today(),30),status:"Planned"}];
    if(horizSel!=="no")fu.push({activity:ST("تعميم الحل على: ","Roll out to: ")+(fam.length?fam.join(", "):ST("الماكينات المشابهة","similar machines")),who:ST("الهندسة","Engineering"),start:"",due:addDays(today(),horizSel==="later"?120:60),status:"Planned"});
    if(overwrite||!a.followups.some(x=>x.activity))a.followups=Array.from({length:4},(_,i)=>fu[i]||{activity:"",who:"",start:"",due:"",status:""});
  }else if(AD.type==="Kaizen"){const k=d.kz;
    set(k,"title",AD.title);set(k,"machine",AD.machine);set(k,"area",cx.m.area||"");set(k,"leader",prof);set(k,"team",who);set(k,"start",cx.date);
    const kind=selIds(AD,"kz_kind")[0];if(kind)k.kind=/event/.test(kind)?"event":/stand/.test(kind)?"standard":"quick";
    set(k,"loss",selOpts(AD,"kz_loss",cx).map(SL));const imp=selIds(AD,"impact6");if(imp.length)set(k,"impact",imp.filter(x=>["Q","C","D","S","CSR","E"].includes(x)));
    const bt=(ans(AD,"kz_before").t||"").trim(),loss=ansText(AD,"kz_loss",cx),met=ansText(AD,"kz_metric",cx),b=num(ans(AD,"kz_bval").v),t=num(ans(AD,"kz_target").v),gain=num(ans(AD,"kz_gain").v);
    const unit=((met.match(/\(([^)]+)\)/)||[])[1]||"").trim(),metN=met.replace(/\s*\([^)]*\)/,"").trim();
    set(k,"before",[bt?bt.replace(/[.\s]*$/,"."):"",metN&&b!=null?ST("الوضع الحالي: ","Now: ")+metN+" = "+fmtN(b)+(unit?" "+unit:"")+".":"",loss?ST("نوع الهدر: ","Loss: ")+loss+".":""].filter(Boolean).join(" "));
    set(k,"target",metN&&t!=null?`${metN}: ${b!=null?fmtN(b)+" → ":""}${fmtN(t)}${unit?" "+unit:""}`:"");
    if(overwrite||!k.whys.some(Boolean))k.whys=[0,1,2,3].map(i=>ch.whys[i]||"");
    set(k,"root_cause",root);
    set(k,"improvement",[(ans(AD,"kz_idea").t||"").trim(),...permSel.map(id=>"- "+SL(K.cms[id])),...cc.map(x=>"- "+x)].filter(Boolean).join("\n"));
    if(metN&&(overwrite||!k.results.some(x=>x.kpi)))k.results[0]={kpi:metN,unit,before:b!=null?fmtN(b):"",after:""};
    if(gain!=null)set(k,"benefit_egp",fmtN(gain));
    const stds=selIds(AD,"kz_std").map(id=>/sop/i.test(id)?"sop":/opl|one/i.test(id)?"opl":/pm|cil/i.test(id)?"pm":/train/i.test(id)?"training":/visual|vis/i.test(id)?"visual":null).filter(Boolean);
    if(stds.length)set(k,"std",[...new Set(stds)]);
    set(k,"horizontal",horizTxt);set(k,"prepared",prof);
  }
  if(!AD.title)AD.title=(selOpts(AD,"sym",cx).map(SL)[0]||ans(AD,"kz_before").t||"").slice(0,80);
}

/* ---------- UI: interview ---------- */
function qCard(AD,q,cx){
  const a=ans(AD,q.id),opts=optsOf(q,cx),ids=selIds(AD,q.id);
  let body="";
  if(q.type==="number"){body=`<div class="nrow"><input type="number" inputmode="decimal" data-qn="${q.id}" value="${esc(a.v==null?"":a.v)}" placeholder="0">${q.unit?`<span class="unit">${esc(q.unit)}</span>`:""}</div>`+((q.quick||[]).length?`<div class="chips qk">${q.quick.map(n=>`<button type="button" data-qq="${q.id}|${n}" class="${String(a.v)===String(n)?"on":""}">${n}</button>`).join("")}</div>`:"")}
  else if(q.type==="text"){body=`<div class="mf"><textarea data-qt="${q.id}" dir="auto" rows="3" placeholder="${esc(T2("اكتب أو اضغط الميكروفون واتكلم","Type or tap the mic and speak"))}">${esc(a.t||"")}</textarea></div>`}
  else{body=opts.length?`<div class="chips qo">${opts.map(o=>`<button type="button" data-qo="${q.id}|${esc(o.id)}" class="${ids.includes(o.id)?"on":""}">${esc(L(o))}</button>`).join("")}</div>`:""}
  const oth=q.type!=="text"&&(q.other!==false)?`<div class="mf oth"><input data-qt="${q.id}" dir="auto" value="${esc(a.t||"")}" placeholder="${esc(opts.length?T2("حاجة تانية / تفاصيل","Other / details"):T2("اكتب أو اتكلم","Type or speak"))}"></div>`:"";
  const done=(ids.length||(a.v!=null&&a.v!=="")||(a.t&&a.t.trim()))?" done":"";
  return `<div class="qcard${done}" data-qc="${q.id}"><div class="qh">${esc(L(q))}${isMulti(q)?` <small>${T2("(أكتر من اختيار)","(pick any)")}</small>`:""}</div>${q.hint?`<div class="qhint">${esc(L(q.hint))}</div>`:""}${body}${oth}</div>`;
}
function interviewHtml(AD){
  const K=kb();if(!K)return `<div class="hint">${T2("ملف المعرفة (kb.js) مش متحمّل","Knowledge base (kb.js) not loaded")}</div>`;
  const cx=ctxOf(AD),e=cx.e;
  let hdr="";
  if(e)hdr=`<div class="hint" style="background:#E8EEFB;color:#242269">${T2("المشكلة","Problem")}: <b dir="auto">${esc(e.title)}</b> · ${esc(e.machine)} · ${esc(e.date)}</div>`;
  else{
    const cats=AD.type==="Kaizen"?"":`<label>${T2("نوع المشكلة","Problem type")}</label><div class="chips" id="cxCat">${ISSUE.map(c=>`<button type="button" data-cat="${c}" class="${AD.cat===c?"on":""}">${esc(catAr(c))}</button>`).join("")}</div>`;
    hdr=`<label>${AD.type==="Kaizen"?T2("عنوان التحسين","Improvement title"):T2("عنوان المشكلة","Problem title")}</label><div class="mf"><input id="anTitle" dir="auto" value="${esc(AD.title)}" placeholder="${esc(AD.type==="Kaizen"?T2("مثال: تقليل وقت تغيير المنتج في بلستر خط 3","Example: cut changeover time on blister line 3"):T2("مثال: ارتفاع الرفض في فيته 3","Example: high rejects on Fette 3"))}"></div>
    <label>${T2("الماكينة","Machine")}</label><select id="anMach"><option value="">${T2("اختار","Choose")}</option>${machines().map(m=>`<option class="noTr" value="${esc(m.name)}"${m.name===AD.machine?" selected":""}>${esc(m.name)}</option>`).join("")}</select>${cats}`;
  }
  const fl=flowOf(AD,cx).map(Q).filter(Boolean);
  const n=fl.filter(q=>{const a=ans(AD,q.id);return selIds(AD,q.id).length||(a.t&&a.t.trim())||(a.v!=null&&a.v!=="")}).length;
  if(AD.type==="Kaizen"&&K.O.kaizen&&K.O.kaizen.guide)hdr+=`<details class="guide"><summary>${T2("يعني إيه Kaizen وإزاي نعمله؟","What is a Kaizen and how to run it?")}</summary><div class="gt" style="white-space:pre-line">${esc(L(K.O.kaizen.guide))}</div></details>`;
  return hdr+`<div class="qprog">${T2("اضغط على الاختيارات. اللي مش عارفه سيبه. ","Tap the options. Skip what you don't know. ")}<b>${n}/${fl.length}</b></div>`+fl.map(q=>qCard(AD,q,cx)).join("");
}
function bindInterview(root,AD,rerender){
  const up=()=>{const p=root.querySelector(".qprog b");if(p){const cx=ctxOf(AD),fl=flowOf(AD,cx).map(Q).filter(Boolean);p.textContent=fl.filter(q=>{const a=ans(AD,q.id);return selIds(AD,q.id).length||(a.t&&a.t.trim())||(a.v!=null&&a.v!=="")}).length+"/"+fl.length}};
  const mark=id=>{const c=root.querySelector(`[data-qc="${id}"]`),a=ans(AD,id);if(c)c.classList.toggle("done",!!(selIds(AD,id).length||(a.t&&a.t.trim())||(a.v!=null&&a.v!=="")));up()};
  root.querySelectorAll("[data-qo]").forEach(b=>b.onclick=()=>{const [id,o]=b.dataset.qo.split("|"),q=Q(id),a=IV(AD)[id]=IV(AD)[id]||{};
    if(isMulti(q)){const l=Array.isArray(a.v)?a.v:[];const i=l.indexOf(o);if(i<0)l.push(o);else l.splice(i,1);a.v=l;b.classList.toggle("on")}
    else{a.v=a.v===o?"":o;root.querySelectorAll(`[data-qo^="${id}|"]`).forEach(x=>x.classList.toggle("on",x.dataset.qo===id+"|"+a.v))}
    if(id==="sym")delete CZ(AD).pc;mark(id)});
  root.querySelectorAll("[data-qn]").forEach(el=>el.oninput=()=>{const id=el.dataset.qn;(IV(AD)[id]=IV(AD)[id]||{}).v=el.value;root.querySelectorAll(`[data-qq^="${id}|"]`).forEach(x=>x.classList.toggle("on",x.dataset.qq===id+"|"+el.value));mark(id)});
  root.querySelectorAll("[data-qq]").forEach(b=>b.onclick=()=>{const [id,n]=b.dataset.qq.split("|");(IV(AD)[id]=IV(AD)[id]||{}).v=n;const el=root.querySelector(`[data-qn="${id}"]`);if(el)el.value=n;root.querySelectorAll(`[data-qq^="${id}|"]`).forEach(x=>x.classList.toggle("on",x===b));mark(id)});
  root.querySelectorAll("[data-qt]").forEach(el=>el.oninput=()=>{const id=el.dataset.qt;(IV(AD)[id]=IV(AD)[id]||{}).t=el.value;mark(id)});
  const t=root.querySelector("#anTitle");if(t)t.oninput=()=>{AD.title=t.value.trim()};
  const m=root.querySelector("#anMach");if(m)m.onchange=()=>{AD.machine=m.value;delete CZ(AD).pc;rerender()};
  root.querySelectorAll("#cxCat [data-cat]").forEach(b=>b.onclick=()=>{AD.cat=AD.cat===b.dataset.cat?"":b.dataset.cat;delete CZ(AD).pc;rerender()});
  addMics(root);
}

/* ---------- UI: coach review ---------- */
let showAll=false;const hl=v=>v==="H"?T2("عالي","High"):T2("قليل","Low");
function evHtml(AD,id){const e=(CZ(AD).ev||{})[id]||{},ks=[["measured",T2("اتقاس","Measured")],["seen",T2("اتشاف","Seen")],["trend",T2("Trend / بيانات","Trend / data")],["swap",T2("تجربة تبديل (Swap test)","Swap test")]];
  return `<div class="evb${e.k||e.t?"":" need"}"><div class="muted">${T2("الدليل إيه؟","What is the evidence?")}</div><div class="chips czs">${ks.map(([k,n])=>`<button type="button" data-evk="${id}|${k}" class="${e.k===k?"on":""}">${n}</button>`).join("")}</div><div class="mf"><input dir="auto" data-evt="${id}" value="${esc(e.t||"")}" placeholder="${esc(T2("مثلا: الـgap اتقاس 0.4 mm والمطلوب 0.1","e.g. gap measured 0.4 mm vs 0.1 mm required"))}"></div></div>`}
function coachHtml(AD){
  const K=kb();if(!K)return "";
  const cx=ctxOf(AD),z=CZ(AD);SLANG=z.lang||uiLang();picks(AD,cx);
  const ps=z.ps&&z.ps.trim()?z.ps:problemStatement(AD,cx);
  const rules=evalRules(AD,cx),r=rank(AD,cx),pool=cmPool(AD,cx),ch=chainOf(AD,cx);
  const sevC={high:"#D9534F",med:"#E8A33D",low:"#47BFD9"};
  const rc=rules.map(x=>`<div class="rule" style="border-inline-start-color:${sevC[x.sev]||"#999"}"><div>${esc(L(x))}</div>${x.fix?`<div class="rfix">${esc(L(x.fix))}</div>`:""}${x.action?`<button type="button" class="btn ghost" data-sw="${x.action.replace("switch_","")}">${T2("حوّل لـ","Switch to ")}${x.action.replace("switch_","")}</button>`:""}</div>`).join("")||`<div class="muted">${T2("مفيش ملاحظات كبيرة. راجع الأسباب والحلول تحت.","No major gaps. Review causes and actions below.")}</div>`;
  const vis=r.filter(x=>x.status!=="no").slice(0,showAll?14:6).concat(r.filter(x=>x.status==="no"));
  const cRow=x=>`<div class="cz${x.status==="ok"?" ok":x.status==="no"?" no":""}"><div class="czh"><b>${esc(L(x.c))}</b> <span class="chip">${esc(T2(...FISH_LBL[x.c.fish]||["",""]))}</span></div><div class="czc">${T2("إزاي تتأكد: ","How to check: ")}${esc(L(x.c.check))}</div><div class="chips czs"><button type="button" data-st="${x.id}|ok" class="${x.status==="ok"?"on":""}">${T2("اتأكد","Confirmed")}</button><button type="button" data-st="${x.id}|no" class="${x.status==="no"?"on":""}">${T2("مستبعد","Ruled out")}</button><button type="button" data-st="${x.id}|" class="${!x.status?"on":""}">${T2("لسه","Not checked")}</button></div>${x.status==="ok"?evHtml(AD,x.id):""}</div>`;
  const ccRows=custom(AD).map((x,i)=>`<div class="cz${x.st==="ok"?" ok":""}"><div class="czh"><b dir="auto">${esc(x.text)}</b> <span class="chip">${esc(T2(...FISH_LBL[x.fish||"methods"]))}</span> <button type="button" class="lnk" data-ccdel="${i}">${T2("مسح","Remove")}</button></div><div class="chips czs"><button type="button" data-ccst="${i}|ok" class="${x.st==="ok"?"on":""}">${T2("اتأكد","Confirmed")}</button><button type="button" data-ccst="${i}|" class="${x.st!=="ok"?"on":""}">${T2("لسه","Not checked")}</button></div></div>`).join("");
  const cmRow=id=>{const m=K.cms[id];return `<label class="ck"><input type="checkbox" data-pc="${id}"${(z.pc||[]).includes(id)?" checked":""}><span>${esc(L(m))}<small> · ${esc(T2(...KIND_LBL[m.kind]))} · ${T2("أثر","Impact")} ${hl(m.impact)} / ${T2("مجهود","Effort")} ${hl(m.effort)} · ${esc(L(m.owner))}</small></span></label>`};
  const kRow=id=>`<label class="ck"><input type="checkbox" data-pk="${id}"${(z.pk||[]).includes(id)?" checked":""}><span>${esc(L(K.kpis[id]))} <small>(${esc(K.kpis[id].unit)})</small></span></label>`;
  const chain=[ch.sym,...ch.whys].filter(Boolean);
  const ai=AI&&AI.on?aiHtml(AD):`<div class="muted" style="margin-top:6px">${T2("لو فعّلت وضع الإنترنت من الإعدادات، هيظهر هنا خبير ذكاء اصطناعي يراجع معاك ويسألك.","Enable online mode in Settings to get an AI expert here who reviews and asks you questions.")}</div>`;
  const rec=recommend(AD,cx);
  return `<div class="cbox"><div class="ch">${T2("1. صياغة المشكلة","1. Problem statement")}</div><div class="muted">${T2("المساعد كتبها من إجاباتك. عدّل لو محتاج.","Drafted from your answers. Edit if needed.")}</div><div class="mf"><textarea id="czPs" dir="auto" rows="4">${esc(ps)}</textarea></div><button type="button" class="lnk" id="czPsR">${T2("أعد الصياغة من الإجابات","Redraft from answers")}</button></div>
  <div class="cbox"><div class="ch">${T2("2. مراجعة المساعد","2. Coach review")} <small>${AD.type}${AD.type!=="Kaizen"?" · "+T2("المقترح: ","suggested: ")+rec.tool:""}</small></div>${rc}</div>
  ${AD.type==="Kaizen"&&!r.length?"":`<div class="cbox"><div class="ch">${T2("3. الأسباب المحتملة","3. Likely causes")}</div><div class="muted">${T2("مترتبة حسب إجاباتك. روح شوف بنفسك، وعلّم اللي اتأكد واللي اتستبعد.","Ranked from your answers. Go and see, then mark confirmed or ruled out.")}</div>${vis.map(cRow).join("")}${r.filter(x=>x.status!=="no").length>6?`<button type="button" class="lnk" id="czMore">${showAll?T2("أقل","Show less"):T2("أسباب تانية","More causes")}</button>`:""}${ccRows}
  <div class="addc"><div class="mf"><input id="czNew" dir="auto" placeholder="${esc(T2("سبب تاني شايفه (اكتب أو اتكلم)","Another cause you see (type or speak)"))}"></div><select id="czFish">${Object.keys(FISH_LBL).map(k=>`<option value="${k}">${T2(...FISH_LBL[k])}</option>`).join("")}</select><button type="button" class="btn ghost" id="czAdd">${T2("إضافة","Add")}</button></div></div>
  <div class="cbox"><div class="ch">${T2("4. ليه-ليه (لحد السبب الجذري)","4. Why-why (to the root cause)")}</div>${chain.length>1?`<ol class="chain">${chain.map((x,i)=>`<li${i===chain.length-1?' class="root"':""} dir="auto">${esc(x)}</li>`).join("")}</ol><div class="muted">${ch.verified?T2("مبني على السبب اللي أكدته.","Built from the cause you confirmed."):T2("مبني على أرجح سبب. أكّد السبب الأول قبل ما تعتمد عليه.","Built from the most likely cause. Confirm it before relying on it.")}</div>`:`<div class="muted">${T2("اختار العرض في الأسئلة أو أكّد سبب عشان تظهر السلسلة.","Choose the symptom or confirm a cause to see the chain.")}</div>`}</div>`}
  <div class="cbox"><div class="ch">${T2("5. الحلول","5. Actions")}</div>${pool.cont.length?`<div class="sub2">${T2("احتواء (مؤقت)","Containment (temporary)")}</div>${pool.cont.map(cmRow).join("")}`:""}${pool.perm.length?`<div class="sub2">${T2("حل دائم (الأقوى الأول)","Permanent (strongest first)")}</div>${pool.perm.map(cmRow).join("")}`:""}
  ${(z.cm||[]).map((t,i)=>`<div class="ck"><span dir="auto">${esc(t)}</span> <button type="button" class="lnk" data-cmdel="${i}">${T2("مسح","Remove")}</button></div>`).join("")}<div class="addc"><div class="mf"><input id="cmNew" dir="auto" placeholder="${esc(T2("حل تاني (اكتب أو اتكلم)","Another action (type or speak)"))}"></div><button type="button" class="btn ghost" id="cmAdd">${T2("إضافة","Add")}</button></div>
  ${pool.kp.length?`<div class="sub2">${T2("مؤشرات المتابعة","KPIs to follow")}</div>${pool.kp.map(kRow).join("")}`:""}</div>
  <div class="cbox"><div class="ch">${T2("6. لغة النموذج","6. Sheet language")}</div><div class="chips"><button type="button" data-sl="en" class="${SLANG==="en"?"on":""}">English</button><button type="button" data-sl="ar" class="${SLANG==="ar"?"on":""}">عربي</button><button type="button" data-sl="fr" class="${SLANG==="fr"?"on":""}">Français</button></div></div>
  <div class="cbox"><div class="ch">${T2("خبير الذكاء الاصطناعي","AI expert")}</div>${ai}</div>
  <div class="muted" style="margin-top:6px">${T2("زرار \"ارسم النموذج وكمّل\" تحت بيملا الخانات الفاضية بس. لو عايز يكتب فوق اللي موجود: ","\"Build sheet and continue\" below fills empty fields only. To overwrite existing text: ")}<button type="button" class="lnk" id="czRebuild">${T2("أعد الكتابة","Rewrite all")}</button></div>`;
}
function bindCoach(root,AD,rerender,onSwitch,onBuilt){
  const z=CZ(AD),cx=ctxOf(AD);
  const ps=root.querySelector("#czPs");if(ps)ps.oninput=()=>{z.ps=ps.value;z.psEd=1};
  const psr=root.querySelector("#czPsR");if(psr)psr.onclick=()=>{z.ps="";z.psEd=0;rerender()};
  root.querySelectorAll("[data-sw]").forEach(b=>b.onclick=()=>onSwitch(b.dataset.sw));
  root.querySelectorAll("[data-st]").forEach(b=>b.onclick=()=>{const [id,s]=b.dataset.st.split("|");z.st=z.st||{};if(s)z.st[id]=s;else delete z.st[id];if(!z.pcUser){delete z.pc;delete z.pk}rerender()});
  root.querySelectorAll("[data-evk]").forEach(b=>b.onclick=()=>{const [id,k]=b.dataset.evk.split("|");z.ev=z.ev||{};const e=z.ev[id]=z.ev[id]||{};e.k=e.k===k?"":k;rerender()});
  root.querySelectorAll("[data-evt]").forEach(el=>el.oninput=()=>{const id=el.dataset.evt;z.ev=z.ev||{};(z.ev[id]=z.ev[id]||{}).t=el.value.slice(0,300);const box=el.closest(".evb");if(box)box.classList.toggle("need",!(z.ev[id].k||z.ev[id].t))});
  root.querySelectorAll("[data-ccst]").forEach(b=>b.onclick=()=>{const [i,s]=b.dataset.ccst.split("|");custom(AD)[+i].st=s;rerender()});
  root.querySelectorAll("[data-ccdel]").forEach(b=>b.onclick=()=>{custom(AD).splice(+b.dataset.ccdel,1);rerender()});
  const more=root.querySelector("#czMore");if(more)more.onclick=()=>{showAll=!showAll;rerender()};
  const nw=root.querySelector("#czNew"),cmn=root.querySelector("#cmNew");
  if(nw){nw.value=z.dn||"";nw.oninput=()=>{z.dn=nw.value}}if(cmn){cmn.value=z.dm||"";cmn.oninput=()=>{z.dm=cmn.value}}
  const add=root.querySelector("#czAdd");if(add)add.onclick=()=>{const t=nw.value.trim();if(!t)return;custom(AD).push({text:t.slice(0,140),fish:root.querySelector("#czFish").value,st:""});z.dn="";rerender()};
  root.querySelectorAll("[data-pc]").forEach(c=>c.onchange=()=>{z.pcUser=1;const l=z.pc=z.pc||[],id=c.dataset.pc,i=l.indexOf(id);if(c.checked&&i<0)l.push(id);if(!c.checked&&i>=0)l.splice(i,1);rerender()});
  root.querySelectorAll("[data-pk]").forEach(c=>c.onchange=()=>{z.pcUser=1;const l=z.pk=z.pk||[],id=c.dataset.pk,i=l.indexOf(id);if(c.checked&&i<0)l.push(id);if(!c.checked&&i>=0)l.splice(i,1);rerender()});
  const ca=root.querySelector("#cmAdd");if(ca)ca.onclick=()=>{const t=cmn.value.trim();if(!t)return;(z.cm=z.cm||[]).push(t.slice(0,160));z.dm="";rerender()};
  root.querySelectorAll("[data-cmdel]").forEach(b=>b.onclick=()=>{z.cm.splice(+b.dataset.cmdel,1);rerender()});
  root.querySelectorAll("[data-sl]").forEach(b=>b.onclick=()=>{if(z.lang===b.dataset.sl)return;if(z.psEd&&!confirm(T2("الصياغة اللي عدلتها هتتكتب من جديد باللغة التانية. تمام؟","Your edited problem statement will be redrafted in the other language. OK?")))return;z.lang=b.dataset.sl;z.ps="";z.psEd=0;rerender()});
  const bb=root.querySelector("#czBuild");if(bb)bb.onclick=()=>{build(AD,false);onBuilt()};
  const rb=root.querySelector("#czRebuild");if(rb)rb.onclick=()=>{if(!confirm(T2("هيكتب فوق الخانات اللي اتملت قبل كده. متأكد؟","This overwrites fields already filled. Continue?")))return;build(AD,true);onBuilt()};
  bindAi(root,AD,rerender,onBuilt);
  addMics(root);
}

/* ---------- online AI expert (opt-in) ---------- */
function aiHtml(AD){
  const z=CZ(AD),r=z.ai;
  let h=`<div class="muted">${T2("بيبعت إجاباتك (من غير اسمك) لـOpenAI. استخدمه بس لو الـIT موافق.","Sends your answers (without your name) to OpenAI. Use only if IT approves.")}</div><button type="button" class="btn navy block" id="aiAsk" style="margin-top:8px">${r?T2("فكّر تاني بالإجابات الجديدة","Think again with my new answers"):T2("اسأل خبير الذكاء الاصطناعي","Ask the AI expert")}</button>`;
  if(r){
    h+=`<div class="aires"><div class="ch2">${T2("رأي الخبير","Expert view")}</div><div dir="auto">${esc(r.assessment||"")}</div>`;
    if(r.recommended_tool&&r.recommended_tool!==AD.type)h+=`<div class="rule" style="border-inline-start-color:#E8A33D"><div dir="auto">${esc(T2("الخبير شايف الأداة المناسبة: ","Expert recommends: ")+r.recommended_tool+". "+(r.tool_reason||""))}</div><button type="button" class="btn ghost" data-sw="${esc(r.recommended_tool)}">${T2("حوّل لـ","Switch to ")}${esc(r.recommended_tool)}</button></div>`;
    (r.challenges||[]).forEach(c=>{h+=`<div class="rule" style="border-inline-start-color:#D9534F"><div dir="auto"><b>${esc(c.issue||"")}</b> ${esc(c.why||"")}</div><div class="rfix" dir="auto">${esc(c.fix||"")}</div></div>`});
    if((r.questions||[]).length){h+=`<div class="ch2">${T2("الخبير بيسألك","The expert asks you")}</div>`;(r.questions||[]).forEach((q,i)=>{h+=`<label dir="auto">${esc(q)}</label><div class="mf"><input dir="auto" data-aiq="${i}" value="${esc(((z.aiqa||[])[i]||{}).a||"")}" placeholder="${esc(T2("جاوب أو اتكلم","Answer or speak"))}"></div>`})}
    h+=`<button type="button" class="btn main block" id="aiUse" style="margin-top:10px">${T2("استخدم مسودة الخبير في النموذج","Use the expert's draft in the sheet")}</button></div>`;
  }
  return h;
}
function bindAi(root,AD,rerender,onBuilt){
  const z=CZ(AD);
  root.querySelectorAll("[data-aiq]").forEach(el=>el.oninput=()=>{const r=z.ai||{},i=+el.dataset.aiq;z.aiqa=z.aiqa||[];z.aiqa[i]={q:(r.questions||[])[i]||"",a:el.value}});
  const b=root.querySelector("#aiAsk");if(b)b.onclick=async()=>{b.disabled=true;b.textContent=T2("الخبير بيفكر...","The expert is thinking...");try{z.ai=await aiCoach(AD);z.aiHist=(z.aiHist||[]).concat((z.aiqa||[]).filter(x=>x&&x.a)).slice(-12);z.aiqa=[];rerender()}catch(e){console.error(e);toast(T2("الذكاء الاصطناعي مش متاح دلوقتي. كمّل بالمساعد العادي","AI is not available now. Continue with the offline coach"));b.disabled=false;b.textContent=T2("اسأل خبير الذكاء الاصطناعي","Ask the AI expert")}};
  const u=root.querySelector("#aiUse");if(u)u.onclick=()=>{if(!confirm(T2("هيكتب مسودة الخبير في خانات النموذج (فوق اللي موجود). تمام؟","This writes the expert's draft into the sheet fields (overwriting). OK?")))return;applyAi(AD);onBuilt()};
}
async function aiCoach(AD){
  const cx=ctxOf(AD),z=CZ(AD),K=kb();SLANG=z.lang||uiLang();
  const answers={};for(const id of Object.keys(IV(AD))){const q=Q(id);if(!q)continue;const t=ansText(AD,id,cx);if(t)answers[q.en||id]=t}
  const top=rank(AD,cx).slice(0,8).map(x=>({cause:x.c.en,status:x.status==="ok"?"confirmed":x.status==="no"?"ruled out":"not checked",check:x.c.check.en}));
  const kz=AD.type==="Kaizen"?',"kaizen":{"before":"","target":"","improvement":"","after_expected":"","results":[{"kpi":"","unit":"","before":"","after":""}],"std":["sop|opl|pm|training|visual"],"horizontal":""}':"";
  const sys=`You are two experts reviewing a shop-floor problem together: (1) a senior pharmaceutical maintenance & reliability engineer (oral solid dose, GMP, TPM) and (2) an Operational Excellence coach (Lean, TPM focused improvement, A3/3C/Kaizen). The site is Servier Egypt, Cairo. Help the engineer think, do not just reformat. Rules: use only the facts given; never invent numbers (write [to measure] instead); challenge weak thinking (no standard, no numbers, person blamed, cause not verified, weak countermeasure, wrong tool, GMP product impact, safety LOTO/hierarchy of controls); 5 whys must be a causal chain ending in a SYSTEM cause, never a person; countermeasures address the root cause, strongest kind first (eliminate, design, poka_yoke, pm, standard, inspection, training). Ask at most 4 short questions that would change the conclusion. Write "assessment", "tool_reason", "challenges" and "questions" in ${{fr:"clear plant French",en:"clear plant English",ar:"Egyptian Arabic (English technical terms allowed)"}[uiLang()]}. Write every other field (sheet content) in ${{fr:"clear plant French",en:"clear plant English",ar:"Egyptian Arabic (English technical terms allowed)"}[SLANG]}. Reply with JSON only: {"assessment":"","recommended_tool":"3C|A3|Kaizen","tool_reason":"","challenges":[{"issue":"","why":"","fix":""}],"questions":[""],"problem_statement":"","causes":[{"cause":"","fish":"materials|methods|man|machines|nature|measurement","check":"","likelihood":"high|medium|low"}],"whys":["","","","",""],"root_cause":"","containment":[""],"countermeasures":[{"text":"","kind":"","impact":"H|L","effort":"H|L","owner":""}],"kpis":[{"name":"","baseline":"","goal":""}]${kz}}`;
  const user={tool:AD.type,category:cx.cat,machine:AD.machine,machine_area:cx.m.area,date:AD.date,title:AD.title,problem_statement_draft:(z.ps&&z.ps.trim())||problemStatement(AD,cx),answers,offline_engine_causes:top,engineer_own_causes:custom(AD).map(x=>({cause:x.text,status:x.st==="ok"?"confirmed":"not checked"})),engineer_answers_to_your_previous_questions:(z.aiHist||[]).concat((z.aiqa||[]).filter(x=>x&&x.a))};
  const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+AI.cfg.key,"Content-Type":"application/json"},body:JSON.stringify({model:AI.cfg.model||"gpt-4o-mini",temperature:0.2,response_format:{type:"json_object"},messages:[{role:"system",content:sys},{role:"user",content:JSON.stringify(user)}]})});
  if(!r.ok)throw new Error("http "+r.status);
  return normAi(JSON.parse((await r.json()).choices[0].message.content));
}
function normAi(j){if(!j||typeof j!=="object")return null;
  const s=(v,n)=>typeof v==="string"?v.slice(0,n||600):"",A=(v,n)=>Array.isArray(v)?v.filter(x=>x!=null).slice(0,n):[],O=x=>x&&typeof x==="object"?x:{};
  const kz=j.kaizen&&typeof j.kaizen==="object"?{before:s(j.kaizen.before,700),target:s(j.kaizen.target,300),improvement:s(j.kaizen.improvement,900),after_expected:s(j.kaizen.after_expected,500),results:A(j.kaizen.results,4).map(x=>({kpi:s(O(x).kpi,60),unit:s(O(x).unit,20),before:s(O(x).before,30),after:s(O(x).after,30)})),std:A(j.kaizen.std,5).filter(x=>typeof x==="string").map(x=>x.slice(0,20)),horizontal:s(j.kaizen.horizontal,300)}:null;
  return{assessment:s(j.assessment,900),recommended_tool:["3C","A3","Kaizen"].includes(j.recommended_tool)?j.recommended_tool:"",tool_reason:s(j.tool_reason,300),
    challenges:A(j.challenges,5).map(c=>({issue:s(c&&c.issue,200),why:s(c&&c.why,300),fix:s(c&&c.fix,300)})),questions:A(j.questions,4).map(q=>s(q,200)).filter(Boolean),
    problem_statement:s(j.problem_statement,700),causes:A(j.causes,6).map(c=>({cause:s(c&&c.cause,90),fish:FISH_LBL[c&&c.fish]?c.fish:"methods",check:s(c&&c.check,160)})),
    whys:A(j.whys,5).map(x=>s(x,200)),root_cause:s(j.root_cause,300),containment:A(j.containment,4).map(x=>s(x,160)).filter(Boolean),
    countermeasures:A(j.countermeasures,6).map(c=>({text:s(c&&c.text,160),kind:KIND_ORDER.includes(c&&c.kind)?c.kind:"standard",impact:c&&c.impact==="L"?"L":"H",effort:c&&c.effort==="H"?"H":"L",owner:s(c&&c.owner,40)})).filter(c=>c.text),
    kpis:A(j.kpis,3).map(k=>({name:s(k&&k.name,60),baseline:s(k&&k.baseline,40),goal:s(k&&k.goal,40)})),kaizen:kz};
}
function applyAi(AD){
  const r=CZ(AD).ai;if(!r)return;const d=AD.data,cx=ctxOf(AD),prof=(S.profile||{}).name||"";
  if(r.problem_statement)CZ(AD).ps=r.problem_statement;
  build(AD,false);
  const ps=r.problem_statement||CZ(AD).ps||"",cms=r.countermeasures||[];
  const perm=cms.filter(c=>c.kind!=="temporary");
  if(AD.type==="3C"){const c=d.c3;if(ps)c.concern=ps;
    c.cause=[r.causes&&r.causes[0]?r.causes[0].cause+(r.causes[0].check?" ("+r.causes[0].check+")":""):"",r.whys.filter(Boolean).join(" → "),r.root_cause?ST("السبب الجذري: ","Root cause: ")+r.root_cause:""].filter(Boolean).join("\n")||c.cause;
    if(r.containment.length)c.containment=r.containment.map(x=>"- "+x).join("\n");
    if(perm.length)c.countermeasure=perm.map((x,i)=>`${i+1}. ${x.text}${x.owner?" ("+x.owner+")":""}`).join("\n");
  }else if(AD.type==="A3"){const a=d.a3;if(ps)a.redefined=ps;
    if(r.causes.length){const fb={materials:[],methods:[],man:[],machines:[],nature:[],measurement:[]};r.causes.forEach(c=>{if(fb[c.fish].length<6)fb[c.fish].push(c.cause)});a.fishbone=fb;a.plausible=r.causes[0].cause}
    if(r.whys.some(Boolean))a.whys=[0,1,2,3,4].map(i=>r.whys[i]||"");if(r.root_cause)a.root_cause=r.root_cause;
    const ideas=r.containment.map(t=>({text:t,impact:"H",effort:"L"})).concat(cms.map(c=>({text:c.text,impact:c.impact,effort:c.effort}))).slice(0,9);
    if(ideas.length)a.ideas=Array.from({length:9},(_,i)=>ideas[i]||{text:"",impact:"",effort:""});
    if(perm.length){a.solution=perm.map(x=>x.text).join("; ");a.actions=Array.from({length:8},(_,i)=>{const x=perm[i];return x?{activity:x.text,who:x.owner,start:today(),due:addDays(today(),DUE[x.kind]||14),status:"Planned"}:{activity:"",who:"",start:"",due:"",status:""}})}
    if(r.kpis.length)a.metrics=Array.from({length:3},(_,i)=>{const k=r.kpis[i];return k?{name:k.name,baseline:k.baseline,goal:k.goal,current:""}:{name:"",baseline:"",goal:"",current:""}});
  }else if(AD.type==="Kaizen"){const k=d.kz,z=r.kaizen||{},s=v=>typeof v==="string"?v.slice(0,700):"";
    if(s(z.before)||ps)k.before=s(z.before)||ps;if(s(z.target))k.target=s(z.target);if(r.whys.some(Boolean))k.whys=[0,1,2,3].map(i=>r.whys[i]||"");if(r.root_cause)k.root_cause=r.root_cause;
    if(s(z.improvement))k.improvement=s(z.improvement);else if(perm.length)k.improvement=perm.map(x=>"- "+x.text).join("\n");
    if(Array.isArray(z.results)&&z.results.length)k.results=Array.from({length:4},(_,i)=>{const x=z.results[i]||{};return{kpi:s(x.kpi).slice(0,60),unit:s(x.unit).slice(0,20),before:s(x.before).slice(0,30),after:s(x.after).slice(0,30)}});
    if(Array.isArray(z.std))k.std=z.std.filter(x=>["sop","opl","pm","training","visual"].includes(x));if(s(z.horizontal))k.horizontal=s(z.horizontal);if(!k.prepared)k.prepared=prof;
  }
}

/* ---------- triage + tool guide (in the "choose" dialog) ---------- */
function toolsGuideHtml(){
  const O=(kb()||{}).O;if(!O)return "";
  return `<details class="guide"><summary>${T2("إمتى أستخدم 3C أو A3 أو Kaizen؟","When to use 3C, A3 or Kaizen?")}</summary>${["3C","A3","Kaizen"].map(t=>{const x=O.tools[t];return `<div class="gt"><b>${t}</b>: ${esc(L(x))}<div><small>${T2("إمتى: ","When: ")}${esc(L(x.when))}</small></div><div><small>${T2("مش لما: ","Not when: ")}${esc(L(x.notWhen))}</small></div><div><small>${T2("الوقت: ","Time: ")}${esc(L(x.time))}</small></div>${t==="Kaizen"&&O.kaizen&&O.kaizen.guide?`<div style="margin-top:4px;white-space:pre-line"><small>${esc(L(O.kaizen.guide))}</small></div>`:""}</div>`}).join("")}</details>`;
}
function triageHtml(tr){
  const O=(kb()||{}).O;if(!O)return "";
  return `<div class="tri"><div class="muted" style="margin-bottom:4px">${T2("مش متأكد تختار إيه؟ جاوب 5 أسئلة سريعة:","Not sure which one? Answer 5 quick taps:")}</div>${(O.triage||[]).map(q=>`<div class="qcard"><div class="qh">${esc(L(q))}</div><div class="chips">${(q.options||[]).map(o=>`<button type="button" data-tr="${q.id}|${esc(o.id)}" class="${tr[q.id]===o.id?"on":""}">${esc(L(o))}</button>`).join("")}</div></div>`).join("")}${tr.tr_crit==="gmp"?`<div class="hint">${T2("فيه أثر GMP: بلّغ الـQA وافتح deviation حسب الإجراء، أياً كانت الأداة.","GMP impact: notify QA and raise a deviation per procedure, whichever tool you use.")}</div>`:tr.tr_crit==="safety"?`<div class="hint">${T2("موضوع سلامة: أمّن المكان (LOTO) وبلّغ الـHSE الأول.","Safety issue: make it safe (LOTO) and report to HSE first.")}</div>`:""}</div>`;
}

/* ---------- mic on any field ---------- */
const SRc=window.SpeechRecognition||window.webkitSpeechRecognition,IOSd=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const D={el:null,btn:null,r:null,want:false,base:"",n:0,mr:null};
function dStop(){D.want=false;try{D.r&&D.r.stop()}catch(e){}try{if(D.mr&&D.mr.state==="recording")D.mr.stop()}catch(e){}if(D.btn)D.btn.classList.remove("rec");}
function put(el,txt){if(!el.isConnected){dStop();return}el.value=txt;el.dispatchEvent(new Event("input",{bubbles:true}))}
function dStartSR(){
  const r=new SRc();D.r=r;const sel=document.getElementById("lang");r.lang=sel?sel.value:"ar-EG";r.interimResults=true;r.continuous=!IOSd;
  const el=D.el,base=D.base;
  r.onresult=e=>{if(D.r!==r)return;let t="";for(let i=0;i<e.results.length;i++)t+=e.results[i][0].transcript+" ";put(el,(base+t).replace(/\s+/g," ").trim())};
  r.onerror=e=>{if(D.r!==r)return;if(/not-allowed|service-not-allowed|audio-capture/.test(e.error)){D.want=false;toast(T2("اسمح للميكروفون وفعّل Dictation من إعدادات الموبايل","Allow the microphone and enable Dictation in phone settings"))}else if(e.error==="network"){D.want=false;toast(T2("الصوت محتاج نت","Voice needs internet"))}};
  r.onend=()=>{if(D.r!==r)return;if(D.want&&D.n<12&&D.el===el){D.n++;D.base=el.value.trim()+" ";setTimeout(()=>{if(D.want&&D.el===el){try{dStartSR()}catch(e){dStop()}}},120);return}dStop()};
  r.start();
}
async function dStart(el,btn){
  if(D.el===el&&D.btn&&D.btn.classList.contains("rec")){dStop();D.el=null;return}
  dStop();D.el=el;D.btn=btn;D.base=el.value.trim()?el.value.trim()+" ":"";D.n=0;D.want=true;btn.classList.add("rec");
  if(AI&&AI.on&&navigator.onLine&&navigator.mediaDevices&&window.MediaRecorder&&typeof whisper==="function"){
    try{const stream=await navigator.mediaDevices.getUserMedia({audio:true}),mime=MediaRecorder.isTypeSupported("audio/mp4")?"audio/mp4":MediaRecorder.isTypeSupported("audio/webm")?"audio/webm":"";
      const mr=D.mr=new MediaRecorder(stream,mime?{mimeType:mime}:undefined),ch=[];mr.ondataavailable=e=>{if(e.data&&e.data.size)ch.push(e.data)};
      const base0=D.base;mr.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());btn.classList.remove("rec");btn.classList.add("busy");try{const t=await whisper(new Blob(ch,{type:mr.mimeType||"audio/webm"}));if(t)put(el,((el.value.trim()?el.value.trim()+" ":base0)+t).trim())}catch(e){toast(T2("التحويل عبر الإنترنت فشل. جرب تاني","Online transcription failed. Try again"))}btn.classList.remove("busy")};
      mr.start();return}catch(e){}
  }
  if(!SRc){dStop();toast(T2("المتصفح مش بيدعم الصوت. استخدم ميكروفون لوحة المفاتيح","Browser has no voice support. Use the keyboard mic"));el.focus();return}
  try{dStartSR()}catch(e){dStop();toast(T2("مقدرتش أشغل الميكروفون","Could not start the microphone"))}
}
const MIC_SVG='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"/></svg>';
function addMics(root){
  root.querySelectorAll('textarea,input:not([type]),input[type="text"]').forEach(el=>{
    if(el.dataset.nomic||el.closest(".nomic,.idea,.row2,.row3"))return;
    let w=el.parentElement;if(!w.classList.contains("mf")){w=document.createElement("div");w.className="mf";el.parentNode.insertBefore(w,el);w.appendChild(el)}
    if(w.querySelector(".micb"))return;
    const b=document.createElement("button");b.type="button";b.className="micb";b.setAttribute("aria-label","mic");b.innerHTML=MIC_SVG;b.onclick=()=>dStart(el,b);w.appendChild(b);
  });
}

window.COACH={normAi,kb,famOf,ctxOf,interviewHtml,bindInterview,coachHtml,bindCoach,build,toolsGuideHtml,triageHtml,triageRec,recommend,addMics,stopMic:dStop,problemStatement};
})();
