(function(){
"use strict";
/* ===== شغلي | تحليل المشاكل: A3 (مشاكل كبيرة) و 3C (مشاكل صغيرة) ===== */
/* globals from index.html: S, save, toast, $, $$, esc, today, fmt, machines, AI, catAr, CATS, showSuggest */

const ISSUE_CATS=["Breakdown Fixed","Safety","GMP / Quality","Energy & Utilities","Spare Parts Needed","Warehouse Issue","Changeover"];
const isIssue=e=>!!e&&ISSUE_CATS.includes(e.category);
const suggestType=e=>((+e.dt||0)>=4||(+e.sav||0)>=20000)?"A3":"3C";
const A3_IMPACT=[["Q","جودة"],["C","تكلفة"],["D","تسليم"],["S","سلامة"],["CSR","CSR"],["E","بيئة"]];
const FISH=[["materials","MATERIALS","خامات"],["methods","METHODS (PROCESSES)","طرق"],["man","MAN (PEOPLE)","ناس"],["machines","MACHINES (EQUIPMENT)","ماكينات"],["nature","MOTHER NATURE (ENV.)","بيئة"],["measurement","MEASUREMENTS","قياس"]];
const TYPICAL={
 materials:["جودة الخامة أو المواصفات","باتش أو مورد مختلف","قطعة غيار مش أصلية","تأخر توريد القطعة"],
 methods:["مفيش SOP أو مش واضح","خطوات الضبط مش متتبعة","تشينج أوفر بدون checklist","الـPM مش بيغطي النقطة دي"],
 man:["تدريب غير كافي","اختلاف بين الورديات","ضغط وقت","المسؤولية مش واضحة"],
 machines:["تآكل","نقص تزييت","ضبط غير صحيح","اهتزاز أو خلوص","سخان أو حساس متدهور"],
 nature:["حرارة أو رطوبة","تراب أو تلوث","تذبذب كهرباء","ضغط هواء أو بخار غير ثابت"],
 measurement:["معايرة منتهية","حساس مش دقيق","مفيش مؤشر يكشف بدري","طريقة قياس مختلفة"]
};
const STD_Q=["std","إيه المفروض يكون عليه الوضع؟ (المعيار أو المتوقع)","مثال: الخط يشتغل 40 بلستر/دقيقة من غير توقف"];
const QSETS={
 "Breakdown Fixed":[STD_Q,["dur","العطل وقّف الماكينة قد إيه؟ (ساعات)","مثال: 3"],["rep","ده اتكرر قبل كده؟ كام مرة في آخر 3 شهور؟","مثال: 4 مرات"],["chg","إيه اللي اتغير قبل العطل؟ (قطعة، منتج، صيانة، وردية، ضبط)",""],["sym","إيه العرض أو الإنذار اللي ظهر؟ وإزاي عرفت؟",""],["fix","اتصلّح إزاي دلوقتي؟ وإيه القطعة اللي اتغيرت؟",""],["cost","التكلفة التقريبية (قطع وإنتاج ضايع) بالجنيه؟","مثال: 12000"]],
 "Changeover":[["std","الوقت المعياري للتشينج أوفر؟ (ساعات)","مثال: 3"],["dur","الوقت الفعلي؟ (ساعات)","مثال: 5"],["late","إيه اللي اتأخر؟ (أجزاء ناقصة، تنضيف، فحص جودة، ضبط)",""],["rep","ده بيتكرر في كل تشينج أوفر؟","مثال: آخر 3 مرات"],["fix","عملتوا إيه عشان تلحقوا؟",""],["cost","الخسارة التقريبية بالجنيه؟","مثال: 8000"]],
 "GMP / Quality":[STD_Q,["dev","إيه الانحراف بالظبط؟ وكام % أو كام وحدة خارج المعيار؟",""],["lot","المنتج والباتش؟",""],["rep","ظهر قبل كده؟ كام مرة؟",""],["chg","إيه اللي اتغير قبل ما يظهر؟",""],["fix","اتعمل إيه فوراً؟ (حجز، فحص، إعادة)",""],["cost","التكلفة أو الكمية المرفوضة؟",""]],
 "Safety":[["std","إيه إجراء الأمان المفروض يتتبع؟","مثال: LOTO قبل أي تدخل"],["inj","كان فيه إصابة أو قرب إصابة؟ إيه الخطر؟",""],["bar","إيه حاجز الحماية اللي فشل أو ما كانش موجود؟",""],["rep","شفته قبل كده؟",""],["fix","اتعمل إيه فوراً؟",""]],
 "Energy & Utilities":[["std","الاستهلاك الطبيعي؟","مثال: 120 kWh لكل ساعة"],["dur","الاستهلاك الفعلي، ومن إمتى؟",""],["loc","فين التسريب أو الهدر؟",""],["fix","اتعمل إيه مؤقتاً؟",""],["cost","التكلفة التقريبية في الشهر؟","مثال: 15000"]],
 "Spare Parts Needed":[["part","القطعة وكودها وعددها؟",""],["stock","المتاح في المخزن؟ ومدة التوريد؟",""],["imp","لو القطعة مش موجودة إيه اللي هيقف؟",""],["rep","القطعة دي خلصت قبل كده؟",""],["fix","بديل مؤقت؟",""],["cost","سعر القطعة وتكلفة التوقف؟",""]],
 "Warehouse Issue":[["part","القطعة وكودها؟",""],["what","إيه اللي حصل في الصرف أو المخزن؟ (قطعة غلط، ناقص، تأخير)",""],["rep","ده بيتكرر؟",""],["imp","إيه الأثر على الشغل؟",""],["fix","اتعمل إيه فوراً؟",""]],
 "default":[STD_Q,["dur","المشكلة أثرت على الشغل قد إيه؟ (ساعات)",""],["rep","اتكررت قبل كده؟ كام مرة؟",""],["chg","إيه اللي اتغير قبلها؟",""],["fix","اتعمل إيه فوراً؟",""],["cost","التكلفة التقريبية بالجنيه؟",""]]
};
const qsetOf=c=>QSETS[c]||QSETS.default;
const uid=()=>"AN-"+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const getP=(o,p)=>p.split(".").reduce((a,k)=>a==null?a:a[k],o);
function setP(o,p,v){const ks=p.split(".");let a=o;for(let i=0;i<ks.length-1;i++){const k=ks[i];if(a[k]==null)a[k]=/^\d+$/.test(ks[i+1])?[]:{};a=a[k]}a[ks[ks.length-1]]=v}
const arr=(n,f)=>Array.from({length:n},f);
const blankRows=n=>arr(n,()=>({activity:"",who:"",start:"",due:"",status:""}));
const dmy=s=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||"");return m?`${m[3]}/${m[2]}/${m[1]}`:(s||"")};

function blankData(type){
  if(type==="3C")return{c3:{initials:"",date:today(),concern:"",cause:"",containment:"",countermeasure:"",observations:""}};
  return{a3:{originator:"",scope:"",process:"",opened:today(),closed:"",impact:[],what:"",who:"",where:"",when_date:"",when_time:"",how_know:"",how_much:"",redefined:"",
    fishbone:{materials:[],methods:[],man:[],machines:[],nature:[],measurement:[]},plausible:"",whys:["","","","",""],root_cause:"",ideas:arr(9,()=>({text:"",impact:"",effort:""})),solution:"",
    actions:blankRows(8),metrics:arr(3,()=>({name:"",baseline:"",goal:"",current:""})),comments:"",followups:blankRows(4)}};
}
function initials(n){return String(n||"").trim().split(/\s+/).map(w=>w[0]||"").join("").toUpperCase().slice(0,3)}

/* ---------- storage ---------- */
const ANS=()=>(S.analyses=S.analyses||[]);
function anSave(){const i=ANS().findIndex(x=>x.id===AD.id);AD.updated=new Date().toISOString();if(i>=0)ANS()[i]=AD;else ANS().push(AD);save()}
function anOf(entryId){return ANS().filter(a=>a.entryId===entryId)}
function cleanAnalysis(a){
  if(!a||typeof a!=="object"||!/^AN-/.test(String(a.id||""))||!["A3","3C"].includes(a.type))return null;
  const b=blankData(a.type),d=a.data||{};
  const merge=(t,s)=>{if(Array.isArray(t)){if(!Array.isArray(s))return t;return t.map((x,i)=>i in s?merge(x,s[i]):x).concat(s.length>t.length&&typeof t[0]!=="object"?s.slice(t.length).map(String).slice(0,8):[])}
    if(t&&typeof t==="object"){const o={};for(const k in t)o[k]=merge(t[k],s&&typeof s==="object"?s[k]:undefined);return o}
    return typeof s==="string"||typeof s==="number"?String(s).slice(0,1500):t};
  return{id:String(a.id),entryId:a.entryId?String(a.entryId):null,type:a.type,title:String(a.title||"").slice(0,120),machine:String(a.machine||"").slice(0,80),date:/^\d{4}-\d{2}-\d{2}$/.test(a.date)?a.date:today(),
    data:merge(b,d),qa:a.qa&&typeof a.qa==="object"?Object.fromEntries(Object.entries(a.qa).slice(0,20).map(([k,v])=>[k.slice(0,20),String(v).slice(0,500)])):{},updated:String(a.updated||""),status:a.status==="done"?"done":"draft"};
}

/* ---------- start / wizard ---------- */
let AD=null,anStep=0,anFrom=null;
function startAnalysis(type,entry){
  const e=entry||null,ex=e&&anOf(e.id).find(a=>a.type===type);
  if(ex){openWizard(ex,0);return}
  AD={id:uid(),entryId:e?e.id:null,type,title:e?e.title:"",machine:e?e.machine:"",date:e?e.date:today(),data:blankData(type),qa:{},updated:"",status:"draft"};
  const p=S.profile||{};
  if(type==="3C")AD.data.c3.initials=initials(p.name);else AD.data.a3.originator=p.name||"";
  openWizard(AD,0);
}
function openWizard(a,step){AD=a;anStep=step||0;$("#anWiz").classList.add("show");renderStep()}
function stepsOf(){return AD.type==="3C"?
  [["أسئلة سريعة",stepQA],["1. المشكلة (Concern)",()=>fieldsStep([["c3.concern","إيه المشكلة أو الانحراف؟ وإيه المعيار المتوقع؟","ta",6]])],
   ["2. السبب (Cause)",stepCause],["3A. احتواء",()=>fieldsStep([["c3.containment","حل مؤقت يوقف الأعراض دلوقتي. هل بيمنع المشكلة تنتشر؟","ta",6]])],
   ["3B. حل دائم",()=>fieldsStep([["c3.countermeasure","حل دائم يشيل السبب الجذري. اكتب كل إجراء ومين هيعمله وإمتى","ta",7]])],
   ["ملاحظات وتأكيد",()=>fieldsStep([["c3.observations","فحوصات اتعملت، ملاحظات، معلومات جديدة","ta",4],["c3.initials","الحروف الأولى","in"],["c3.date","التاريخ","date"]])]]
  :[["أسئلة سريعة",stepQA],["البيانات الأساسية",stepHead],["وصف المشكلة 4W2H",stepProb],["أسباب محتملة (Fishbone)",stepFish],["5 Whys",stepWhys],["أفكار الحلول",stepIdeas],["خطة التنفيذ",()=>rowsStep("a3.actions","خطة التنفيذ (Action Plan)",8)],["التقييم والمتابعة",stepAssess]];
}
function renderStep(){
  const st=stepsOf();anStep=Math.max(0,Math.min(anStep,st.length-1));
  $("#anWizTitle").textContent=(AD.type==="3C"?"3C | ":"A3 | ")+(AD.title||"تحليل جديد");
  $("#anProg").innerHTML=st.map((s,i)=>`<i class="${i<anStep?"d":i===anStep?"c":""}"></i>`).join("");
  $("#anStepName").textContent=`خطوة ${anStep+1} من ${st.length}: ${st[anStep][0]}`;
  $("#anBody").innerHTML=st[anStep][1]();bindBody();
  $("#anBack").style.visibility=anStep?"visible":"hidden";
  $("#anNext").textContent=anStep===st.length-1?"خلّص وشوف الشيت":"التالي";
  $("#anBody").scrollTop=0;
}
function bindBody(){
  $$("#anBody [data-p]").forEach(el=>{el.oninput=()=>{setP(AD.data,el.dataset.p,el.value)}});
  $$("#anBody [data-q]").forEach(el=>{el.oninput=()=>{AD.qa[el.dataset.q]=el.value}});
  $$("#anBody [data-chip]").forEach(b=>b.onclick=()=>{const [k,t]=b.dataset.chip.split("|"),a=AD.data.a3.fishbone[k];if(!a.includes(t)&&a.length<6){a.push(t);renderStep()}});
  $$("#anBody [data-imp]").forEach(b=>b.onclick=()=>{const l=AD.data.a3.impact,k=b.dataset.imp,i=l.indexOf(k);if(i<0)l.push(k);else l.splice(i,1);b.classList.toggle("on")});
  $$("#anBody [data-fish]").forEach(el=>{el.oninput=()=>{AD.data.a3.fishbone[el.dataset.fish]=el.value.split("\n").map(x=>x.trim()).filter(Boolean).slice(0,6)}});
  const ai=$("#anAi");if(ai)ai.onclick=aiDraft;
  const sg=$("#anSolSug");if(sg)sg.onclick=()=>{const l=AD.data.a3.ideas.map((x,i)=>[x,i+1]).filter(([x])=>x.text&&x.impact==="H"&&x.effort==="L");AD.data.a3.solution=l.length?"Quick win(s): "+l.map(([x,i])=>i+". "+x.text).join("; "):AD.data.a3.solution;renderStep()};
}
const val=p=>esc(getP(AD.data,p)||"");
function fieldsStep(list){return list.map(([p,l,t,r])=>`<label>${l}</label>`+(t==="ta"?`<textarea data-p="${p}" dir="auto" rows="${r||3}" style="min-height:${(r||3)*26}px">${val(p)}</textarea>`:`<input data-p="${p}" dir="auto" ${t==="date"?'type="date"':""} value="${val(p)}">`)).join("")}
function stepQA(){
  const qs=qsetOf(entryCat()),e=entryOf();
  const hdr=e?`<div class="hint" style="background:#E8EEFB;color:#242269">المشكلة: <b>${esc(e.title)}</b> · ${esc(e.machine)} · ${esc(e.date)}</div>`:`<label>عنوان المشكلة</label><input id="anTitle" dir="auto" value="${esc(AD.title)}" placeholder="مثال: ارتفاع الرفض في فيته 3"><label>الماكينة</label><select id="anMach"><option value="">اختار</option>${machines().map(m=>`<option${m.name===AD.machine?" selected":""}>${esc(m.name)}</option>`).join("")}</select>`;
  return hdr+'<div class="muted" style="margin:6px 0">جاوب بسرعة بكلامك. اللي مش عارفه سيبه فاضي، وأنا برتّب الإجابات في الخانات.</div>'+qs.map(q=>`<label>${esc(q[1])}</label><input data-q="${q[0]}" dir="auto" placeholder="${esc(q[2]||"")}" value="${esc(AD.qa[q[0]]||"")}">`).join("")
   +(AI.on?'<button class="btn navy block" id="anAi" style="margin-top:12px">اقترح مسودة كاملة بالذكاء الاصطناعي (أونلاين)</button>':'<div class="muted" style="margin-top:10px">لو فعّلت الوضع الأونلاين من الإعدادات هتلاقي هنا زرار يكتب مسودة كاملة من إجاباتك.</div>');
}
function entryOf(){return AD.entryId?S.entries.find(x=>x.id===AD.entryId)||null:null}
function entryCat(){const e=entryOf();return e?e.category:"default"}
function stepHead(){const l=A3_IMPACT.map(([k,n])=>`<button type="button" data-imp="${k}" class="${AD.data.a3.impact.includes(k)?"on":""}">${k} <small>${n}</small></button>`).join("");
  return fieldsStep([["a3.originator","Originator (صاحب التحليل)","in"],["a3.scope","Scope (المنطقة، الخط، القسم)","in"],["a3.process","Process Name","in"],["a3.opened","تاريخ الفتح","date"],["a3.closed","تاريخ الإغلاق (لو اتقفل)","date"]])+`<label>6D impact (اتأثر إيه؟)</label><div class="chips">${l}</div>`}
function stepProb(){return fieldsStep([["a3.what","What happened? إيه اللي حصل","ta",3],["a3.who","Who? مين اكتشفها","in"],["a3.where","Where? حصلت فين","in"],["a3.when_date","When? التاريخ","date"],["a3.when_time","Time / Shift","in"],["a3.how_know","How do we know? إزاي عرفنا","in"],["a3.how_much","How much? (KPI، خسائر، وقت، جنيه)","ta",2],["a3.redefined","Redefine problem statement: المعيار، الفعلي، الفجوة بالأرقام","ta",2]])}
function stepFish(){
  return '<div class="muted" style="margin-bottom:8px">اكتب كل سبب محتمل في سطر (حد أقصى 6). اضغط على اقتراح عشان يتضاف.</div>'+FISH.map(([k,en,ar])=>{const cur=AD.data.a3.fishbone[k]||[];
    return `<label>${en} <small class="muted">${ar}</small></label><textarea data-fish="${k}" dir="auto" rows="2">${esc(cur.join("\n"))}</textarea><div class="chips" style="margin-top:4px">${TYPICAL[k].filter(t=>!cur.includes(t)).map(t=>`<button type="button" class="gl" data-chip="${k}|${esc(t)}">+ ${esc(t)}</button>`).join("")}</div>`}).join("")
   +fieldsStep([["a3.plausible","أرجح سبب أساسي (More plausible primary cause)","ta",2]]);
}
function stepWhys(){
  const w=AD.data.a3.whys,pre=["ليه حصلت المشكلة؟","ليه الإجابة اللي فاتت حصلت؟","ليه؟","ليه؟","ليه؟ (المفروض توصل لسبب في النظام مش في شخص)"];
  return '<div class="muted" style="margin-bottom:8px">كل إجابة هي سبب اللي قبلها. ما توقفش عند "الفني غلط": اسأل ليه النظام سمح بكده.</div>'+w.map((x,i)=>`<label>Why ${i+1}? ${pre[i]}</label><input data-p="a3.whys.${i}" dir="auto" value="${esc(x)}">`).join("")+fieldsStep([["a3.root_cause","Selected Root Cause: السبب الجذري المختار","ta",2]]);
}
function stepIdeas(){
  const ideas=AD.data.a3.ideas;
  return '<div class="muted" style="margin-bottom:8px">اكتب كل الأفكار من غير حكم (حد أقصى 9)، وبعدين حدد لكل فكرة الأثر (Impact) والمجهود (Effort).</div>'+ideas.map((x,i)=>`<div class="idea"><b>${i+1}.</b><input data-p="a3.ideas.${i}.text" dir="auto" placeholder="فكرة" value="${esc(x.text)}"><select data-p="a3.ideas.${i}.impact"><option value="">أثر</option><option value="H"${x.impact==="H"?" selected":""}>أثر عالي</option><option value="L"${x.impact==="L"?" selected":""}>أثر قليل</option></select><select data-p="a3.ideas.${i}.effort"><option value="">مجهود</option><option value="H"${x.effort==="H"?" selected":""}>مجهود عالي</option><option value="L"${x.effort==="L"?" selected":""}>مجهود قليل</option></select></div>`).join("")
   +'<button type="button" class="btn ghost block" id="anSolSug" style="margin:8px 0">اقترح الحل (أثر عالي ومجهود قليل)</button>'+fieldsStep([["a3.solution","وصف الحل المختار بعد المصفوفة","ta",3]]);
}
function rowsStep(path,title,n){
  const rows=getP(AD.data,path);
  return `<div class="muted" style="margin-bottom:8px">${title}: النشاط، مين، البداية، الموعد، الحالة.</div>`+rows.map((r,i)=>`<div class="rowbox"><b>${i+1}</b><input data-p="${path}.${i}.activity" dir="auto" placeholder="النشاط" value="${esc(r.activity)}"><div class="row2"><input data-p="${path}.${i}.who" dir="auto" placeholder="مين" value="${esc(r.who)}"><select data-p="${path}.${i}.status"><option value="">الحالة</option>${["Planned","In progress","Done"].map(s=>`<option${r.status===s?" selected":""}>${s}</option>`).join("")}</select></div><div class="row2"><input type="date" data-p="${path}.${i}.start" value="${esc(r.start)}"><input type="date" data-p="${path}.${i}.due" value="${esc(r.due)}"></div></div>`).join("");
}
function stepAssess(){
  const m=AD.data.a3.metrics;
  return '<div class="muted" style="margin-bottom:6px">Metrics: مؤشرات تقيس نجاح الحل.</div>'+m.map((x,i)=>`<div class="rowbox"><b>${i+1}</b><input data-p="a3.metrics.${i}.name" dir="auto" placeholder="المؤشر (مثال: رفض %)" value="${esc(x.name)}"><div class="row3"><input data-p="a3.metrics.${i}.baseline" dir="auto" placeholder="Baseline" value="${esc(x.baseline)}"><input data-p="a3.metrics.${i}.goal" dir="auto" placeholder="Goal" value="${esc(x.goal)}"><input data-p="a3.metrics.${i}.current" dir="auto" placeholder="Current" value="${esc(x.current)}"></div></div>`).join("")
   +fieldsStep([["a3.comments","تعليق على كفاءة الحلول","ta",3]])+'<div class="muted" style="margin:10px 0 6px">Follow-up: إجراءات للاستدامة، وضع ضوابط، وتعميم على ماكينات تانية.</div>'+rowsStep("a3.followups","Follow-up Actions",4);
}
function stepCause(){
  return `<div class="hint" style="background:#E8EEFB;color:#242269">Go and see: روح مكان المشكلة وشوف بنفسك. اكتب مين، إيه، فين، ليه، إمتى، إزاي، كام.</div>`+fieldsStep([["c3.cause","السبب الجذري وإزاي وصلنا له","ta",9]])+`<div class="muted" style="margin-top:6px">نصيحة: اسأل "ليه" 3 مرات على الأقل واكتبها: Why1 → Why2 → Why3 → Root cause.</div>`;
}

/* turn quick answers into field text (fills only empty fields) */
function seedFromQA(){
  const q=AD.qa,e=entryOf(),d=AD.data,set=(p,v)=>{if(v&&!getP(d,p))setP(d,p,v)};
  if(!AD.entryId){const t=($("#anTitle")||{}).value,m=($("#anMach")||{}).value;if(t!=null)AD.title=t.trim();if(m!=null)AD.machine=m}
  const mach=AD.machine||"",mm=machines().find(x=>x.name===mach)||{building:"",area:""};
  const lines=[["dur","Duration"],["late","Delayed"],["rep","Repeats"],["chg","Changed before"],["sym","Symptom / how detected"],["dev","Deviation"],["lot","Product / lot"],["inj","Hazard"],["bar","Failed barrier"],["loc","Where"],["part","Part"],["stock","Stock / lead time"],["what","What happened"],["imp","Impact"],["cost","Cost"]]
    .filter(([k])=>q[k]).map(([k,l])=>`${l}: ${q[k]}`);
  if(AD.type==="3C"){
    set("c3.concern",[`Problem: ${AD.title}${e&&e.desc&&e.desc!==AD.title?"\n"+e.desc:""}`,q.std?`Standard / expectation: ${q.std}`:""].filter(Boolean).join("\n"));
    set("c3.cause",`Where: ${mach}   When: ${dmy(AD.date)}\n`+lines.join("\n"));
    set("c3.containment",q.fix||"");
    if(e&&!d.c3.initials)d.c3.initials=initials((S.profile||{}).name);
  }else{
    const a=d.a3;
    set("a3.scope",[mm.building,mm.area].filter(Boolean).join(" / "));set("a3.process",mm.area||mach);
    set("a3.what",`${AD.title}${e&&e.desc&&e.desc!==AD.title?". "+e.desc:""}`);set("a3.who",(S.profile||{}).name||"");set("a3.where",[mach,mm.area].filter(Boolean).join(", "));
    set("a3.when_date",AD.date);set("a3.how_know",q.sym||(e?e.evidence:"")||"");
    set("a3.how_much",[q.dur?`Duration ${q.dur} h`:"",q.rep?`Repeats ${q.rep}`:"",q.cost?`Cost ${q.cost} EGP`:"",e&&e.dt?`Downtime ${e.dt} h`:"",e&&e.sav?`Savings/Loss ${e.sav} EGP`:""].filter(Boolean).join("; "));
    set("a3.redefined",q.std?`Standard: ${q.std}. Actual: ${AD.title}.`:"");
    if(!a.impact.length){const c=AD.entryId?entryCat():"";const imp=new Set();if(+q.dur||(e&&+e.dt))imp.add("D");if(+q.cost||(e&&+e.sav))imp.add("C");if(c==="Safety")imp.add("S");if(c==="GMP / Quality")imp.add("Q");if(c==="Energy & Utilities"){imp.add("E");imp.add("C")}a.impact=[...imp]}
    if(q.fix)a.actions[0]=Object.assign(a.actions[0],a.actions[0].activity?{}:{activity:"Containment: "+q.fix,who:"Maintenance",status:"Done",start:AD.date,due:AD.date});
  }
}
async function aiDraft(){
  seedFromQA();
  const btn=$("#anAi");btn.disabled=true;btn.textContent="بكتب المسودة...";
  try{
    const e=entryOf(),schema=AD.type==="3C"?'{"concern":"","cause":"","containment":"","countermeasure":"","observations":""}':'{"scope":"","process":"","what":"","who":"","where":"","how_know":"","how_much":"","redefined":"","fishbone":{"materials":[],"methods":[],"man":[],"machines":[],"nature":[],"measurement":[]},"plausible":"","whys":["","","","",""],"root_cause":"","ideas":[{"text":"","impact":"H|L","effort":"H|L"}],"solution":"","actions":[{"activity":"","who":"","due":"YYYY-MM-DD","status":"Planned"}],"metrics":[{"name":"","baseline":"","goal":"","current":""}],"comments":"","followups":[{"activity":"","who":"","due":"","status":"Planned"}]}';
    const sys=`You are an Operational Excellence coach for pharma manufacturing. Draft a ${AD.type==="3C"?"3C card (minor problem)":"A3 problem solving sheet"} from the facts given. Rules: use ONLY facts given; where something is unknown write a short question in square brackets instead of inventing numbers; 5 whys must be a valid causal chain ending in a system cause, never a person; actions address the root cause; ideas 6-9 mixing impact and effort. Write in the same language mix as the input (English technical terms allowed). Reply with JSON only, shaped exactly like: ${schema}`;
    const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+AI.cfg.key,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4o-mini",temperature:0.2,response_format:{type:"json_object"},messages:[{role:"system",content:sys},{role:"user",content:JSON.stringify({title:AD.title,machine:AD.machine,date:AD.date,category:e?e.category:"",description:e?e.desc:"",quickAnswers:AD.qa})}]})});
    if(!r.ok)throw new Error("http "+r.status);
    const j=JSON.parse((await r.json()).choices[0].message.content);fillFromAI(j);toast("المسودة اتكتبت. راجع كل خطوة وصحح");anStep=1;renderStep();
  }catch(err){toast("الذكاء الاصطناعي مش متاح دلوقتي. كمّل بإيدك");btn.disabled=false;btn.textContent="اقترح مسودة كاملة بالذكاء الاصطناعي (أونلاين)"}
}
function fillFromAI(j){
  const s=(v,n)=>typeof v==="string"?v.slice(0,n||600):"",d=AD.data,put=(p,v)=>{if(v&&!getP(d,p))setP(d,p,v)};
  if(AD.type==="3C"){for(const k of["concern","cause","containment","countermeasure","observations"])put("c3."+k,s(j[k]));return}
  for(const k of["scope","process","what","who","where","how_know","how_much","redefined","plausible","root_cause","solution","comments"])put("a3."+k,s(j[k]));
  if(j.fishbone&&typeof j.fishbone==="object")for(const [k] of FISH){if(!d.a3.fishbone[k].length&&Array.isArray(j.fishbone[k]))d.a3.fishbone[k]=j.fishbone[k].map(x=>s(x,70)).filter(Boolean).slice(0,6)}
  if(Array.isArray(j.whys)&&!d.a3.whys.some(Boolean))d.a3.whys=arr(5,(_,i)=>s(j.whys[i],200));
  if(Array.isArray(j.ideas)&&!d.a3.ideas.some(x=>x.text))d.a3.ideas=arr(9,(_,i)=>{const x=j.ideas[i]||{};return{text:s(x.text,90),impact:x.impact==="H"||x.impact==="L"?x.impact:"",effort:x.effort==="H"||x.effort==="L"?x.effort:""}});
  const rows=(src,n)=>arr(n,(_,i)=>{const x=(Array.isArray(src)?src[i]:null)||{};return{activity:s(x.activity,160),who:s(x.who,40),start:/^\d{4}-\d{2}-\d{2}$/.test(x.start)?x.start:"",due:/^\d{4}-\d{2}-\d{2}$/.test(x.due)?x.due:"",status:["Planned","In progress","Done"].includes(x.status)?x.status:"Planned"}});
  if(!d.a3.actions.some(x=>x.activity))d.a3.actions=rows(j.actions,8).map(x=>x.activity?x:blankRows(1)[0]);
  if(!d.a3.followups.some(x=>x.activity))d.a3.followups=rows(j.followups,4).map(x=>x.activity?x:blankRows(1)[0]);
  if(Array.isArray(j.metrics)&&!d.a3.metrics.some(x=>x.name))d.a3.metrics=arr(3,(_,i)=>{const x=j.metrics[i]||{};return{name:s(x.name,60),baseline:s(x.baseline,40),goal:s(x.goal,40),current:s(x.current,40)}});
}
function wizNext(){
  if(anStep===0)seedFromQA();
  const st=stepsOf();
  if(!AD.title)AD.title=(AD.data.a3&&AD.data.a3.what||AD.data.c3&&AD.data.c3.concern||"").split(/[.\n]/)[0].slice(0,80)||"تحليل";
  anSave();
  if(anStep>=st.length-1){$("#anWiz").classList.remove("show");AD.status="done";anSave();openView(AD);renderAn();return}
  anStep++;renderStep();
}
$("#anNext").onclick=wizNext;
$("#anBack").onclick=()=>{if(anStep===0)return;anStep--;renderStep()};
$("#anWizClose").onclick=()=>{if(AD&&(AD.title||Object.keys(AD.qa).length)){if(anStep===0)seedFromQA();anSave();toast("اتحفظت كمسودة")}$("#anWiz").classList.remove("show");renderAn()};

/* ---------- sheet renderers (look like the Servier templates) ---------- */
const nl=s=>esc(s||"").replace(/\n/g,"<br>");
function fishSvg(a){
  const W=540,H=330,top=[[60,"materials"],[200,"methods"],[340,"man"]],bot=[[60,"machines"],[200,"nature"],[340,"measurement"]];
  const nm=Object.fromEntries(FISH.map(f=>[f[0],f[1]])),trunc=(t,n)=>t.length>n?t.slice(0,n-1)+"…":t;
  let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:Century Gothic,Arial,sans-serif"><rect width="${W}" height="${H}" fill="#fff"/><line x1="12" y1="165" x2="440" y2="165" stroke="#95B3D7" stroke-width="4"/>`;
  const bone=(x,k,up)=>{const y0=up?44:286,x2=x+95,xs=x+38,L=(a.fishbone[k]||[]);
    let o=`<line x1="${x+10}" y1="${y0}" x2="${x2}" y2="165" stroke="#95B3D7" stroke-width="3"/><rect x="${x-14}" y="${up?8:292}" width="118" height="30" rx="7" fill="#DCE6F2" stroke="#95B3D7"/><text x="${x+45}" y="${up?27:311}" font-size="8.5" font-weight="700" fill="#17375E" text-anchor="middle">${esc(nm[k])}</text>`;
    L.slice(0,5).forEach((t,i)=>{const yy=up?66+i*17:274-i*17,bx=up?x+10+(yy-44)*(85/121):x+10+(286-yy)*(85/121);o+=`<line x1="${bx.toFixed(1)}" y1="${yy}" x2="${(bx-24).toFixed(1)}" y2="${yy}" stroke="#95B3D7" stroke-width="1"/><text x="${(bx-27).toFixed(1)}" y="${yy+3}" font-size="8.2" text-anchor="end" fill="#222">${esc(trunc(t,26))}</text>`});return o};
  top.forEach(([x,k])=>s+=bone(x+60,k,true));bot.forEach(([x,k])=>s+=bone(x+60,k,false));
  const eff=a.redefined||a.what||"";
  s+=`<rect x="440" y="125" width="96" height="80" rx="8" fill="#fff" stroke="#95B3D7" stroke-width="1.5"/>`;
  esc(trunc(eff,90)).match(/.{1,17}(\s|$)|\S+/g)?.slice(0,5).forEach((ln,i)=>{s+=`<text x="488" y="${142+i*13}" font-size="8" text-anchor="middle" fill="#222">${ln.trim()}</text>`});
  return s+"</svg>";
}
function matrixHtml(a){
  const q={HL:[],HH:[],LL:[],LH:[]};a.ideas.forEach((x,i)=>{if(x.text&&x.impact&&x.effort)q[x.impact+x.effort].push(i+1)});
  const cell=(k,bg)=>`<div class="mq" style="background:${bg}">${q[k].join(", ")}</div>`;
  return `<div class="mx"><div class="my">Impact</div><div class="mg">${cell("HL","#EBF1DE")}${cell("HH","#F5F8EE")}${cell("LL","#F5F8EE")}${cell("LH","#F5F8EE")}</div><div class="ml"><span>High</span><span>Low</span></div><div class="mb"><span>Low</span><b>Effort</b><span>High</span></div></div>`;
}
function tbl(rows){return `<table class="at"><tr><th>Activity</th><th>Who</th><th>Start</th><th>Due</th><th>Status</th></tr>${rows.map(r=>`<tr><td dir="auto">${esc(r.activity)}</td><td>${esc(r.who)}</td><td>${esc(dmy(r.start))}</td><td>${esc(dmy(r.due))}</td><td>${esc(r.status)}</td></tr>`).join("")}</table>`}
function a3Html(A){
  const a=A.data.a3,lab=(t,v,cls)=>`<div class="r ${cls||""}"><div class="l">${t}</div><div class="v" dir="auto">${v}</div></div>`;
  const imp=A3_IMPACT.map(([k])=>`<td class="${a.impact.includes(k)?"on":""}">${k}</td>`).join("");
  const idea=a.ideas.map((x,i)=>`<div>${i+1}. ${esc(x.text)}${x.text&&x.impact?` <small>[${x.impact==="H"?"High":"Low"} impact / ${x.effort==="H"?"High":"Low"} effort]</small>`:""}</div>`).join("");
  const w=a.whys.map(x=>`<div class="r"><div class="l w">Why?</div><div class="v" dir="auto">${esc(x)}</div></div>`).join("");
  const pad=(l,n)=>l.concat(blankRows(Math.max(0,n-l.length)));
  return `<div class="a3 shx"><div class="top"><div class="tt"><b>A3</b> Problem Solving</div><table class="hd"><tr><th>Originator</th><td>${esc(a.originator)}</td><th>Scope</th><td colspan="7" dir="auto">${esc(a.scope)}</td></tr><tr><th>Opening Date</th><td>${esc(dmy(a.opened))}</td><th>Process Name</th><td colspan="7" dir="auto">${esc(a.process)}</td></tr><tr><th>Closing Date</th><td>${esc(dmy(a.closed))}</td><th>6D impact</th><td></td>${imp}</tr></table></div>
  <div class="cols"><div class="col"><div class="sbar b1">IDENTIFY</div><div class="sub s1">Problem description - 4W2H</div>
  ${lab("What happened?",nl(a.what))}<div class="r2">${lab("Who? (detect it)",esc(a.who))}${lab("Where did it occur?",esc(a.where))}</div><div class="r2">${lab("When?",esc(dmy(a.when_date))+" "+esc(a.when_time))}${lab("How do we know?",esc(a.how_know))}</div>${lab("How much? (KPI, Losses, Time, EGP)",nl(a.how_much))}${lab("Redefine problem statement",nl(a.redefined))}
  <div class="sub s1">Potential primary causes analysis - Fishbone Diagram</div>${fishSvg(a)}${lab("More plausible primary cause",nl(a.plausible))}<div class="sub s1">Root Cause Analysis - 5 Why's</div>${w}${lab("Selected Root Cause",nl(a.root_cause))}</div>
  <div class="col"><div class="sbar b2">DEVELOP</div><div class="sub s2">Divergent Thinking - Brainstorming, Reverse Brainstorming</div><div class="pills"><span>Maximize <b>QUANTITY</b></span><span>No <b>JUDGMENT</b></span><span>Be <b>CREATIVE</b></span><span>Be <b>ORIGINAL</b></span><span>Be <b>INNOVATIVE</b></span><span>Think <b>OUTSIDE</b> the BOX</span></div><div class="sub s2">Convergent Thinking - Prioritization Matrix</div><div class="pills"><span><b>COMBINE</b> ideas</span><span><b>ENRICH</b> ideas</span><span>Make ideas <b>REALISTIC</b></span><span>Judge <b>OBJECTIVELY</b></span><span><b>CHOOSE</b> 1 solution</span></div>
  <div class="mrow">${matrixHtml(a)}<div class="ideas"><div class="sub s2" style="text-align:start">Ideas for solutions prioritization</div>${idea}<div class="sub s2" style="text-align:start">Description of the solution selected after Prioritization Matrix</div><div class="sol" dir="auto">${nl(a.solution)}</div></div></div>
  <div class="sbar b3">EXECUTE</div><div class="sub s3">Action Plan</div>${tbl(pad(a.actions,8))}
  <div class="sbar b4">ASSESS</div><div class="asm"><div><div class="sub s4">Solutions efficiency assessment</div><table class="at m"><tr><th>Metrics / Indicators</th><th>Baseline</th><th>Goal</th><th>Current</th></tr>${a.metrics.map(m=>`<tr><td dir="auto">${esc(m.name)}</td><td>${esc(m.baseline)}</td><td>${esc(m.goal)}</td><td>${esc(m.current)}</td></tr>`).join("")}</table></div><div><div class="sub s4">Comments</div><div class="cm" dir="auto">${nl(a.comments)}</div></div></div>
  <div class="sub s4">Follow-up Actions (sustaining actions, controls, generalization)</div>${tbl(pad(a.followups,4))}</div></div></div>`;
}
function c3Html(A){
  const c=A.data.c3;
  return `<div class="c3 shx"><div class="c3h"><div class="c3i"><div>Initials: <u>${esc(c.initials)}</u></div><div>Date: <u>${esc(dmy(c.date))}</u></div></div><div class="c3t">3C Card</div><img src="logo.png" alt="Servier" class="c3l"></div>
  <div class="c3g"><div class="c3b"><div class="c3bar">1. Concern</div><div class="c3q">What is the problem/deviation?<br>What is the standard/expectation?</div><div class="c3v" dir="auto">${nl(c.concern)}</div></div>
  <div class="c3b"><div class="c3bar">2. Cause</div><div class="c3q">Go and see to understand the problem.<br>Who, What, Where, Why, When, How, How much?</div><div class="c3v" dir="auto">${nl(c.cause)}</div></div>
  <div class="c3b"><div class="c3bar">3A. Containment</div><div class="c3q">Temporary solution to fix the symptom.<br>Would the actions prevent the problem from spreading/escalating?</div><div class="c3v half" dir="auto">${nl(c.containment)}</div><div class="c3bar">3B. Countermeasure</div><div class="c3q">Permanent solution to fix the root cause.<br>Would the actions prevent the problem from reocurring?</div><div class="c3v half" dir="auto">${nl(c.countermeasure)}</div></div></div>
  <div class="c3o"><b>Observations, checks, new insights:</b><div dir="auto">${nl(c.observations)}</div></div></div>`;
}
const sheetHtml=A=>A.type==="3C"?c3Html(A):a3Html(A);

/* ---------- viewer ---------- */
let VA=null,vz=1;
function openView(A,readonly){VA=A;vz=Math.min(1,(window.innerWidth-16)/1000);const meta=A.example?`<div class="hint" style="margin:0;font-size:12px;padding:6px 10px">${esc(A.note||"")}</div>`:"";
  $("#anVTitle").textContent=(A.type==="3C"?"3C | ":"A3 | ")+(A.title||"");$("#anVMeta").innerHTML=meta;
  $("#anVEdit").style.display=A.example?"none":"";$("#anVCopy").style.display=A.example?"":"none";$("#anVDel").style.display=A.example?"none":"";
  $("#anSheet").innerHTML=sheetHtml(A);applyZoom();$("#anView").classList.add("show")}
function applyZoom(){const s=$("#anSheet");s.style.zoom=vz;}
$("#anZin").onclick=()=>{vz=Math.min(1.6,vz+0.15);applyZoom()};$("#anZout").onclick=()=>{vz=Math.max(0.25,vz-0.15);applyZoom()};
$("#anVClose").onclick=()=>$("#anView").classList.remove("show");
$("#anVPrint").onclick=()=>{const z=$("#anSheet").style.zoom;$("#anSheet").style.zoom=1;window.print();$("#anSheet").style.zoom=z};
$("#anVEdit").onclick=()=>{$("#anView").classList.remove("show");openWizard(VA,AD&&AD.id===VA.id?anStep:1)};
$("#anVDel").onclick=()=>{if(!confirm("تمسح التحليل ده؟"))return;S.analyses=ANS().filter(x=>x.id!==VA.id);save();$("#anView").classList.remove("show");renderAn();toast("اتمسح")};
$("#anVCopy").onclick=()=>{const c=JSON.parse(JSON.stringify(VA));delete c.example;c.id=uid();c.entryId=null;c.status="draft";c.note=undefined;c.title=VA.title+" (copy)";const k=cleanAnalysis(c);if(!k)return toast("تعذّر النسخ");AD=k;anSave();$("#anView").classList.remove("show");openWizard(AD,1);toast("اتنسخ لتحليلاتي. عدّل عليه")};
$("#anVXlsx").onclick=async()=>{try{toast("بجهز الإكسل...");const b=await exportAnalysisXlsx(VA);await shareBlob(b,`${VA.type}_${(VA.title||"analysis").replace(/[^\w؀-ۿ]+/g,"_").slice(0,30)}_${today()}.xlsx`,"تحليل "+VA.type)}catch(e){console.error(e);toast("الإكسل ماطلعش. ممكن تعمل طباعة PDF بدله")}};

/* ---------- Excel export: patch the ORIGINAL Servier templates ---------- */
const b64u8=b=>Uint8Array.from(atob(b),c=>c.charCodeAt(0));
async function inflateRaw(u8){const ds=new DecompressionStream("deflate-raw"),w=ds.writable.getWriter();w.write(u8);w.close();return new Uint8Array(await new Response(ds.readable).arrayBuffer())}
async function unzipAll(buf){
  const u=new Uint8Array(buf),dv=new DataView(u.buffer);let e=u.length-22;while(e>=0&&dv.getUint32(e,true)!==0x06054b50)e--;
  if(e<0)throw new Error("zip");const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const out=[];
  for(let i=0;i<n;i++){const meth=dv.getUint16(p+10,true),cs=dv.getUint32(p+20,true),nl2=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),off=dv.getUint32(p+42,true),name=new TextDecoder().decode(u.subarray(p+46,p+46+nl2));
    const lnl=dv.getUint16(off+26,true),lxl=dv.getUint16(off+28,true),ds=off+30+lnl+lxl,raw=u.subarray(ds,ds+cs);
    out.push({name,data:meth===0?raw.slice():await inflateRaw(raw)});p+=46+nl2+xl+cl}
  return out;
}
const xesc2=s=>String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const colN=r=>{let n=0;for(const ch of r.replace(/\d/g,""))n=n*26+ch.charCodeAt(0)-64;return n};
function attr(s,k){const m=new RegExp("\\s"+k+'="([^"]*)"').exec(s);return m?m[1]:null}
const splitRef=r=>{const m=/^([A-Z]+)(\d+)$/.exec(r);return[colN(m[1]),+m[2]]};
function geom(xml){
  const fm=/<sheetFormatPr[^>]*>/.exec(xml),fmt=fm?fm[0]:"",dcw=+attr(fmt,"defaultColWidth")||8.43,drh=+attr(fmt,"defaultRowHeight")||15,cw={},rh={},merges={};
  for(const m of xml.matchAll(/<col\b[^>]*>/g)){const a=m[0],mn=+attr(a,"min"),mx=Math.min(+attr(a,"max"),60),w=+attr(a,"width");if(w)for(let i=mn;i<=mx;i++)cw[i]=w}
  for(const m of xml.matchAll(/<row\b[^>]*>/g)){const a=m[0],h=attr(a,"ht");if(h)rh[+attr(a,"r")]=+h}
  for(const m of xml.matchAll(/<mergeCell ref="([A-Z]+\d+):([A-Z]+\d+)"/g))merges[m[1]]=m[2];
  return{dcw,drh,cw,rh,merges};
}
function areaOf(g,ref){const end=g.merges[ref]||ref,[c1,r1]=splitRef(ref),[c2,r2]=splitRef(end);let w=0,h=0;for(let c=c1;c<=c2;c++)w+=g.cw[c]||g.dcw;for(let r=r1;r<=r2;r++)h+=g.rh[r]||g.drh;return{w,h}}
function pickSize(text,ar,max){
  for(const sz of[11,10,9,8,7.5,7,6.5,6,5.5,5]){if(sz>max)continue;const cpl=Math.max(4,Math.floor(ar.w*11/sz*1.0)),lines=Math.floor((ar.h-1)/(sz*1.3));let need=0;for(const p of String(text).split("\n"))need+=Math.max(1,Math.ceil(p.length*1.1/cpl));if(need<=lines)return sz}
  return 5;
}
function styleCtx(x){
  const fm=/<fonts\b[^>]*>([\s\S]*?)<\/fonts>/.exec(x),xm=/<cellXfs\b[^>]*>([\s\S]*?)<\/cellXfs>/.exec(x);if(!fm||!xm)return null;
  return{x,fonts:[...fm[1].matchAll(/<font\b[^>]*\/>|<font\b[^>]*>[\s\S]*?<\/font>/g)].map(m=>m[0]),xfs:[...xm[1].matchAll(/<xf\b[^>]*\/>|<xf\b[^>]*>[\s\S]*?<\/xf>/g)].map(m=>m[0]),cache:{}};
}
function styleFor(ctx,s,sz,horiz,vert){
  const key=[s,sz,horiz,vert].join("|");if(ctx.cache[key]!=null)return ctx.cache[key];
  const xf=ctx.xfs[s]||ctx.xfs[0]||"<xf/>",fid=+((/fontId="(\d+)"/.exec(xf)||[0,0])[1]);
  let font=ctx.fonts[fid]||"<font/>";
  font=/<sz /.test(font)?font.replace(/<sz val="[^"]*"\/>/,'<sz val="'+sz+'"/>'):/\/>$/.test(font)&&!/<\/font>/.test(font)?'<font><sz val="'+sz+'"/></font>':font.replace(/<font\b([^>]*)>/,'<font$1><sz val="'+sz+'"/>');
  ctx.fonts.push(font);const nf=ctx.fonts.length-1;
  const al='<alignment horizontal="'+horiz+'" vertical="'+vert+'" wrapText="1"/>',setA=(t,k,v)=>t.replace(/^<xf\b([^>]*?)(\/?)>/,(m,a,sl)=>"<xf"+a.replace(new RegExp("\\s"+k+'="[^"]*"'),"")+" "+k+'="'+v+'"'+sl+">");
  let n=xf.replace(/^<xf\b([^>]*?)\/>$/,"<xf$1></xf>");
  n=/<alignment[^>]*\/>/.test(n)?n.replace(/<alignment[^>]*\/>/,al):n.replace("</xf>",al+"</xf>");
  n=setA(setA(setA(n,"fontId",nf),"applyFont","1"),"applyAlignment","1");
  ctx.xfs.push(n);return ctx.cache[key]=ctx.xfs.length-1;
}
function flushStyles(ctx){
  let x=ctx.x;x=x.replace(/(<fonts\b[^>]*?)count="\d+"([^>]*>)[\s\S]*?(<\/fonts>)/,(m,a,b,c)=>a+'count="'+ctx.fonts.length+'"'+b+ctx.fonts.join("")+c);
  return x.replace(/(<cellXfs\b[^>]*?)count="\d+"([^>]*>)[\s\S]*?(<\/cellXfs>)/,(m,a,b,c)=>a+'count="'+ctx.xfs.length+'"'+b+ctx.xfs.join("")+c);
}
/* put text into a cell (template style kept, or restyled by styleFn(oldStyleIndex)) */
function setCell(xml,ref,text,styleFn){
  if(text==null||text==="")return xml;
  const body='<is><t xml:space="preserve">'+xesc2(text)+"</t></is>",re=new RegExp('<c r="'+ref+'"([^>]*?)(?:/>|>[\\s\\S]*?</c>)'),m=re.exec(xml);
  const stAttr=old=>{const o=old==null?1:+old,s=styleFn?styleFn(o):o;return s?' s="'+s+'"':""};
  if(m){const at=m[1].replace(/\s+t="[^"]*"/,""),so=(/\ss="(\d+)"/.exec(at)||[])[1],at2=styleFn?at.replace(/\s+s="\d+"/,"")+stAttr(so):at;return xml.replace(re,()=>'<c r="'+ref+'"'+at2+' t="inlineStr">'+body+"</c>")}
  const rn=ref.match(/\d+/)[0],rre=new RegExp('(<row r="'+rn+'"[^>]*?)(/>|>([\\s\\S]*?)</row>)'),rm=rre.exec(xml);if(!rm)return xml;
  const cell='<c r="'+ref+'"'+stAttr(null)+' t="inlineStr">'+body+"</c>";
  if(rm[2]==="/>")return xml.replace(rre,()=>rm[1]+">"+cell+"</row>");
  const inner=rm[3],cells=[...inner.matchAll(/<c r="([A-Z]+)\d+"/g)];let idx=inner.length;
  for(const c of cells){if(colN(c[1])>colN(ref)){idx=c.index;break}}
  return xml.replace(rre,()=>rm[1]+">"+inner.slice(0,idx)+cell+inner.slice(idx)+"</row>");
}
function addMerges(xml,list){
  list=list.filter(r=>!new RegExp('<mergeCell ref="'+r.split(":")[0]+'[:"]').test(xml));if(!list.length)return xml;
  const add=list.map(r=>'<mergeCell ref="'+r+'"/>').join("");
  if(/<mergeCells\b/.test(xml))return xml.replace(/<mergeCells count="(\d+)"/,(m,n)=>'<mergeCells count="'+(+n+list.length)+'"').replace("</mergeCells>",add+"</mergeCells>");
  return xml.replace("</sheetData>","</sheetData><mergeCells count=\""+list.length+'">'+add+"</mergeCells>");
}
/* fill many cells, auto-fitting font size and wrap to each (merged) cell area */
function fillCells(sheetXml,stylesXml,cells,extraMerges){
  let xml=addMerges(sheetXml,extraMerges||[]);const g=geom(xml),ctx=styleCtx(stylesXml);
  for(const ref in cells){
    const t=String(cells[ref]);
    let fn=null;
    if(ctx&&t.length>6){const ar=areaOf(g,ref);
      fn=old=>{const xf=ctx.xfs[old]||"",fid=+((/fontId="(\d+)"/.exec(xf)||[0,0])[1]),mx=+((/<sz val="([\d.]+)"/.exec(ctx.fonts[fid]||"")||[0,11])[1])||11,sz=pickSize(t,ar,Object.values(FISH_SPOT).includes(ref)?Math.min(mx,7):mx),long=t.length>40||t.includes("\n"),hz=long?"left":((/horizontal="(\w+)"/.exec(xf)||[0,"center"])[1]);return styleFor(ctx,old,sz,hz,long?"top":"center")};
    }
    xml=setCell(xml,ref,t,fn);
  }
  return{sheet:xml,styles:ctx?flushStyles(ctx):stylesXml};
}
function setShapeText(xml,shapeName,text){
  const i=xml.indexOf('name="'+shapeName+'"');if(i<0||!text)return xml;const j=xml.indexOf("<a:endParaRPr",i);if(j<0)return xml;
  return xml.slice(0,j)+'<a:r><a:rPr lang="en-US" sz="1000" b="1"><a:solidFill><a:srgbClr val="4F6228"/></a:solidFill></a:rPr><a:t>'+xesc2(text)+"</a:t></a:r>"+xml.slice(j);
}
async function loadTpl(){
  if(!window.TPL)await new Promise((ok,no)=>{const s=document.createElement("script");s.src="templates.js";s.onload=ok;s.onerror=()=>no(new Error("templates.js missing"));document.head.appendChild(s)});
  return window.TPL;
}
const FISH_SPOT={materials:"A32",methods:"D36",man:"E32",machines:"A43",nature:"D43",measurement:"E46"};
const A3_MERGES=["A32:B40","D36:D40","E32:E36","A43:B49","D43:D47","E46:E50"].concat([22,23,24,25,26,27,28,29].map(r=>"M"+r+":T"+r));
function a3Cells(A){
  const a=A.data.a3,c={},put=(r,v)=>{if(v!=null&&v!=="")c[r]=v};
  put("K1",a.originator);put("O1",a.scope);put("K2",dmy(a.opened));put("O2",a.process);put("K3",dmy(a.closed));put("N3",A3_IMPACT.filter(([k])=>a.impact.includes(k)).map(x=>x[0]).join(", "));
  put("C9",a.what);put("C13",a.who);put("F13",a.where);put("C16",dmy(a.when_date));put("D16",a.when_time);put("F15",a.how_know);put("C18",a.how_much);put("C21",a.redefined);
  put("C59",a.plausible);["B64","B67","B70","B73","B76"].forEach((r,i)=>put(r,a.whys[i]));put("C79",a.root_cause);
  a.ideas.forEach((x,i)=>{if(x.text)put("M"+(21+i),`${i+1}. ${x.text}${x.impact?`  [${x.impact==="H"?"High":"Low"} impact / ${x.effort==="H"?"High":"Low"} effort]`:""}`)});
  put("M32",a.solution);
  a.actions.slice(0,9).forEach((r,i)=>{const n=41+i*2;put("I"+n,r.activity);put("N"+n,r.who);put("O"+n,dmy(r.start));put("Q"+n,dmy(r.due));put("S"+n,r.status)});
  a.metrics.forEach((m,i)=>{const n=64+i*2;put("I"+n,m.name);put("K"+n,m.baseline);put("L"+n,m.goal);put("M"+n,m.current)});put("N62",a.comments);
  a.followups.forEach((r,i)=>{const n=74+i*2;put("I"+n,r.activity);put("N"+n,r.who);put("O"+n,dmy(r.start));put("Q"+n,dmy(r.due));put("S"+n,r.status)});
  /* fishbone causes go in cells beside each bone (the bones themselves are drawing shapes) */
  for(const [k,ref] of Object.entries(FISH_SPOT)){const l=(a.fishbone[k]||[]).slice(0,6);if(l.length)put(ref,l.map(t=>"• "+t).join("\n"))}
  return c;
}
async function exportAnalysisXlsx(A){
  const T=await loadTpl(),parts=await unzipAll(b64u8(A.type==="3C"?T.c3:T.a3).buffer),dec=new TextDecoder(),enc=new TextEncoder();
  const find=n=>parts.find(p=>p.name===n);
  const sh=find("xl/worksheets/sheet1.xml");let xml=dec.decode(sh.data);
  if(A.type==="3C"){
    const c=A.data.c3;
    const lab={A7:"What is the problem/deviation?\nWhat is the standard/expectation?",E7:"Go and see to understand the problem.\nWho, What, Where, Why, When, How, How much?",I7:"Temprorary solution to fix the symptom.\nWould the actions prevent the problem from spreading/escalating?",I20:"Permanent solution to fix the root cause\nWould the actions prevent the problem from reocurring?",A31:"Observations, checks, new insights:"};
    const m={A7:c.concern,E7:c.cause,I7:c.containment,I20:c.countermeasure,A31:c.observations};
    const cells={};for(const k in m)if(m[k])cells[k]=lab[k]+"\n\n"+m[k];if(c.initials)cells.B3=c.initials;if(c.date)cells.B4=dmy(c.date);
    const r=fillCells(xml,dec.decode(find("xl/styles.xml").data),cells);xml=r.sheet;find("xl/styles.xml").data=enc.encode(r.styles);
    xml=xml.replace(/^(<\?xml[^>]*\?>\s*<worksheet\b[^>]*>)/,"$1<sheetPr><pageSetUpPr fitToPage=\"1\"/></sheetPr>").replace(/<pageMargins[^>]*\/>/,x=>x+'<pageSetup orientation="landscape" fitToWidth="1" fitToHeight="1"/>');
  }else{
    const r=fillCells(xml,dec.decode(find("xl/styles.xml").data),a3Cells(A),A3_MERGES);xml=r.sheet;find("xl/styles.xml").data=enc.encode(r.styles);
    const dr=find("xl/drawings/drawing1.xml");if(dr){let dx=dec.decode(dr.data);const q={HL:[],HH:[],LL:[],LH:[]};A.data.a3.ideas.forEach((x,i)=>{if(x.text&&x.impact&&x.effort)q[x.impact+x.effort].push(i+1)});
      dx=setShapeText(dx,"Rectángulo 4",q.HL.join(", "));dx=setShapeText(dx,"Rectángulo 15",q.HH.join(", "));dx=setShapeText(dx,"Rectángulo 13",q.LL.join(", "));dx=setShapeText(dx,"Rectángulo 14",q.LH.join(", "));dr.data=enc.encode(dx)}
  }
  sh.data=enc.encode(xml);
  return makeZip(parts.map(p=>({name:p.name,data:p.data})));
}

/* ---------- list tab ---------- */
function anCard(a){
  return `<div class="item" data-an="${esc(a.id)}" style="border-right-color:${a.type==="3C"?"#47BFD9":"#F55B41"}"><div class="top"><span>${esc(a.date||"")}</span><span><b>${a.type}</b>${a.example?" · مثال":""}${a.status==="draft"?" · مسودة":""}</span></div><div class="ti" dir="auto">${esc(a.title_ar||a.title||"")}</div><div><span class="chip">${esc(a.machine||"")}</span>${a.title_ar?`<span class="chip" style="background:#eee" dir="auto">${esc(a.title||"")}</span>`:""}</div></div>`;
}
function renderAn(){
  const mine=ANS().slice().sort((x,y)=>String(y.updated).localeCompare(String(x.updated)));
  const ex=(window.AN_EX||[]);
  if(!$("#anMine"))return;
  $("#anMine").innerHTML=mine.map(anCard).join("")||'<div class="card center muted">لسه معملتش تحليل. اضغط على "تحليل جديد" أو سجّل عطل وهيعرض عليك.</div>';
  $("#anEx").innerHTML=ex.length?ex.map(anCard).join(""):'<div class="muted">الأمثلة مش متحمّلة (examples.js)</div>';
  $$("#anMine .item").forEach(el=>el.onclick=()=>{const a=ANS().find(x=>x.id===el.dataset.an);if(a)openView(a)});
  $$("#anEx .item").forEach(el=>el.onclick=()=>{const a=ex.find(x=>x.id===el.dataset.an);if(a)openView(a)});
}
function chooseType(entry){
  const sug=entry?suggestType(entry):"3C";
  $("#anChooseBody").innerHTML=(entry?`<div class="hint" style="background:#E8EEFB;color:#242269">${esc(entry.title)} · ${esc(entry.machine)}</div>`:"")
   +`<div class="muted" style="margin-bottom:8px">اختار نوع التحليل:</div>
   <button class="btn ${sug==="3C"?"main":"ghost"} block" data-t="3C">3C: مشكلة صغيرة أو عطل بسيط${sug==="3C"?" (مقترح)":""}</button><div class="muted" style="margin:4px 0 10px">كارت واحد: مشكلة، سبب، احتواء، حل دائم. بياخد 5 دقايق.</div>
   <button class="btn ${sug==="A3"?"main":"ghost"} block" data-t="A3">A3: مشكلة كبيرة أو متكررة${sug==="A3"?" (مقترح)":""}</button><div class="muted" style="margin:4px 0 10px">تحليل كامل: 4W2H، Fishbone، 5 Whys، أفكار، خطة تنفيذ، قياس. للأعطال الطويلة أو المتكررة أو اللي تكلفتها عالية.</div>`;
  $$("#anChooseBody [data-t]").forEach(b=>b.onclick=()=>{$("#anChoose").classList.remove("show");startAnalysis(b.dataset.t,entry)});
  $("#anChoose").classList.add("show");
}
$("#anChooseClose").onclick=()=>$("#anChoose").classList.remove("show");
$("#anNew").onclick=()=>chooseType(null);
/* hooks used by index.html */
window.anAfterSave=function(entry){if(isIssue(entry)&&!anOf(entry.id).length){$("#toast").classList.remove("show");$("#anAsk").dataset.id=entry.id;$("#anAskTxt").textContent=`اتسجّل. تحب نحلل "${entry.title}"؟ ${suggestType(entry)==="A3"?"المشكلة كبيرة، يفضّل A3.":"3C سريع يكفي."}`;$("#anAsk").classList.add("show")}};
$("#anAskYes").onclick=()=>{const e=S.entries.find(x=>x.id===$("#anAsk").dataset.id);$("#anAsk").classList.remove("show");if(e)chooseType(e)};
$("#anAskNo").onclick=()=>$("#anAsk").classList.remove("show");
window.anForEntry=function(id){const e=S.entries.find(x=>x.id===id);if(!e)return;const ex=anOf(id);if(ex.length)openView(ex[0]);else chooseType(e)};
window.renderAnalyses=renderAn;
window.anRestore=function(list){let n=0;if(!Array.isArray(list))return 0;for(const x of list){const c=cleanAnalysis(x);if(!c)continue;const i=ANS().findIndex(y=>y.id===c.id);if(i<0){ANS().push(c);n++}else if(String(c.updated)>String(ANS()[i].updated)){ANS()[i]=c;n++}}return n};
S.analyses=ANS().map(cleanAnalysis).filter(Boolean);
renderAn();
})();
