/* Digital Autonomous Maintenance – CILT
   Offline web app. Data: IndexedDB (lib.js). Machine content: data/machines.js (window.CILT_SEED), editable in Admin.
   Rules: no invented specs; unvalidated items are flagged; submitted executions and original observations are read-only. */
"use strict";
(() => {
const { esc, today, stamp, uid } = LIB;
const sb = d => `<bdi dir="ltr">${esc(stamp(d))}</bdi>`;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------------- language ---------------- */
let LANG = (() => { try { return localStorage.getItem("cilt.lang") || "en"; } catch (e) { return "en"; } })();
const T = s => (LANG === "ar" && window.CILT_AR && window.CILT_AR[s]) || s;
const L = o => { if (o == null) return ""; if (typeof o === "string") return o; return (LANG === "ar" ? (o.ar || o.en) : (o.en || o.ar)) || ""; };
const LB = o => { if (!o || typeof o === "string") return esc(o || ""); const a = L(o), b = LANG === "ar" ? o.en : o.ar; return esc(a) + (b && b !== a ? `<div class="alt" dir="auto">${esc(b)}</div>` : ""); };
function setLang(l) { LANG = l; try { localStorage.setItem("cilt.lang", l); } catch (e) {} document.documentElement.lang = l; document.documentElement.dir = l === "ar" ? "rtl" : "ltr"; render(); }

/* ---------------- constants ---------------- */
const CATS = {
  C: { name: "Cleaning", ar: "التنظيف", color: "var(--c)", icon: "M3 21h18v-2H3v2zm2-4h14l-1.5-9h-11L5 17zm4-11h6V3H9v3z" },
  I: { name: "Inspection", ar: "الفحص", color: "var(--i)", icon: "M10 4a6 6 0 104.47 10l5.27 5.27 1.41-1.41L15.9 12.6A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z" },
  L: { name: "Lubrication", ar: "التزييت والتشحيم", color: "var(--l)", icon: "M12 2s-6 7-6 11a6 6 0 0012 0c0-4-6-11-6-11zm0 15a3 3 0 01-3-3h2a1 1 0 001 1v2z" },
  T: { name: "Tightening", ar: "الربط", color: "var(--t)", icon: "M21.7 18.3l-7.6-7.6a5 5 0 00-6.4-6.4l3.3 3.3-2.8 2.8-3.3-3.3a5 5 0 006.4 6.4l7.6 7.6a1 1 0 001.4 0l1.4-1.4a1 1 0 000-1.4z" }
};
const ACT = {
  C: [["done", "Completed", "ok"], ["nc", "Not Completed", "bad"], ["na", "Not Applicable", "na"]],
  I: [["ok", "Normal", "ok"], ["abn", "Abnormality Detected", "abn"], ["na", "Not Applicable", "na"]],
  L: [["done", "Lubrication Completed", "ok"], ["nr", "Not Required", "na"], ["nc", "Not Completed", "bad"], ["abn", "Abnormality Detected", "abn"]],
  T: [["chk", "Checked – No Action Required", "ok"], ["tight", "Tightening Performed", "ok"], ["abn", "Abnormality Detected", "abn"], ["na", "Not Applicable", "na"]]
};
const ST_LABEL = {}; Object.values(ACT).forEach(l => l.forEach(([k, v]) => { ST_LABEL[k] = ST_LABEL[k] || v; }));
const stLabel = (cat, st) => { const a = (ACT[cat] || []).find(x => x[0] === st); return a ? a[1] : (st || "Pending"); };
const ABN_CATS = ["Mechanical", "Electrical", "Pneumatic", "Lubrication", "Cleaning", "Safety", "Instrumentation", "Operational", "Other"];
const SEV = ["Low", "Medium", "High", "Critical"];
const DEPTS = ["Maintenance", "Engineering", "Production", "None"];
const ABN_ST = ["Open", "Under Review", "Action Planned", "In Progress", "Resolved", "Closed"];
const ESC = ["Operator", "Production Supervisor", "Maintenance / Engineering"];
const TPM_TYPES = ["Minor flaw", "Unfulfilled basic condition", "Hard-to-reach place", "Unnecessary item", "Contamination source", "Quality / 5S defect source", "Unsafe or environmental condition"];
const URG = ["Fix during AM time (Δ)", "Stop and repair now (×)"];
const cardType = cat => cat === "Safety" ? "Safety / Health / Environment" : cat === "Cleaning" ? "Quality / 5S" : "Technical";
const ROLES = { operator: "Operator", supervisor: "Production Supervisor", engineer: "Engineer / Admin" };

/* ---------------- state ---------------- */
let CFG = null, EXECS = [], ABNS = [], VIEW = "dash", RUN = null, ROLE = "operator", UI = {};
try { ROLE = sessionStorage.getItem("cilt.role") || "operator"; } catch (e) {}
const machines = () => CFG.machines || [];
const M = id => machines().find(m => m.id === id);
const curMachine = () => M(CFG.curMachine) || machines()[0];
const pointsOf = m => (m.zones || []).flatMap(z => (z.points || []).map(p => Object.assign({ zoneId: z.id }, p)));
/* Routine buckets: the manual wording stays on each checkpoint; the operator picks routines. Admin can force p.routine. */
const ROUTINES = [
  ["Per shift / daily", /shift|every day|daily|each day|during operation|start of production|before production/i],
  ["Product / format changeover", /changeover|format change|product change|batch change/i],
  ["40 operating hours", /\b40\s*(h|hours)\b/i],
  ["160 operating hours", /\b160\s*(h|hours)\b/i],
  ["Weekly", /week/i],
  ["500 operating hours", /\b500\s*(h|hours)\b/i],
  ["Long interval (1000 h and more, yearly)", /\b(1[,.]?000|2[,.]?500|5[,.]?000|10[,.]?000|14[,.]?000|20[,.]?000)\s*(h|hours)\b|year|month/i],
  ["As required", /as required|when required|if necessary|as needed/i]
];
const ROUTINE_ORDER = ROUTINES.map(r => r[0]).concat("Other / not specified");
const freqKey = p => { if (p.routine) return p.routine; const f = (p.frequency || "").trim(); const r = ROUTINES.find(x => x[1].test(f)); return r ? r[0] : "Other / not specified"; };
const canEng = () => ROLE === "engineer";
const canSup = () => ROLE === "engineer" || ROLE === "supervisor";

async function saveCfg() { CFG.updated = new Date().toISOString(); await LIB.put("kv", { id: "cfg", v: CFG }); }
async function nextSeq(kind) {
  const y = String(new Date().getFullYear()), rec = (await LIB.get("kv", "seq")) || { id: "seq", v: {} }, k = kind + y;
  const re = new RegExp("^" + kind + "-" + y + "-(\\d+)$"), used = new Set(ABNS.map(a => a.id));
  let n = Math.max(rec.v[k] || 0, ...ABNS.map(a => { const m = re.exec(a.id || ""); return m ? +m[1] : 0; })), id;
  do { n++; id = `${kind}-${y}-${String(n).padStart(4, "0")}`; } while (used.has(id));
  rec.v[k] = n; await LIB.put("kv", rec); return id;
}
/* shape checks: keep corrupt or hostile records out of memory so one bad record cannot break the app */
const isObj = x => !!x && typeof x === "object" && !Array.isArray(x);
function validExec(x) {
  try {
    return isObj(x) && typeof x.id === "string" && typeof x.machineId === "string" && isObj(x.machine) && Array.isArray(x.zones) && x.zones.every(z => typeof z === "string")
      && Array.isArray(x.points) && x.points.every(p => isObj(p) && typeof p.id === "string" && CATS[p.cat] && typeof p.zoneId === "string" && x.zones.includes(p.zoneId))
      && isObj(x.results) && isObj(x.zoneDone) && isObj(x.zoneInfo) && x.zones.every(z => isObj(x.zoneInfo[z]))
      && isObj(x.cur) && Number.isInteger(x.cur.z) && Number.isInteger(x.cur.c) && (x.status === "open" || x.status === "submitted")
      && Array.isArray(x.freqs) && typeof x.date === "string" && typeof x.operator === "string" && Array.isArray(x.log || [])
      && Object.values(x.results).every(r => isObj(r) && (r.photos == null || (Array.isArray(r.photos) && r.photos.every(i => typeof i === "string"))) && (r.st == null || typeof r.st === "string") && (r.abn == null || isObj(r.abn)))
      && (x.signoff == null || (Array.isArray(x.signoff) && x.signoff.every(isObj))) && (x.zoneStart == null || isObj(x.zoneStart));
  } catch (e) { return false; }
}
function validAbn(a) {
  return isObj(a) && /^ABN-\d{4}-\d{1,6}$/.test(a.id || "") && typeof a.machineId === "string" && typeof a.at === "string" && typeof a.desc === "string"
    && SEV.includes(a.severity) && ABN_ST.includes(a.status) && Array.isArray(a.history) && a.history.every(isObj) && Array.isArray(a.photos || []);
}
function validMachine(m) {
  return isObj(m) && typeof m.id === "string" && m.id.trim() && typeof m.name === "string" && Array.isArray(m.zones)
    && m.zones.every(z => isObj(z) && typeof z.id === "string" && Array.isArray(z.points) && z.points.every(p => isObj(p) && typeof p.id === "string" && CATS[p.cat]));
}

/* ---------------- boot ---------------- */
async function boot() {
  const seed = window.CILT_SEED || { version: "0", machines: [] };
  const rec = await LIB.get("kv", "cfg");
  if (rec && rec.v) {
    CFG = rec.v;
    if (CFG.seedVersion !== seed.version) {
      if (!CFG.edited) { CFG.machines = JSON.parse(JSON.stringify(seed.machines)); CFG.seedVersion = seed.version; await saveCfg(); }
      else CFG.seedPending = seed.version;
    }
  } else {
    CFG = { machines: JSON.parse(JSON.stringify(seed.machines)), seedVersion: seed.version, edited: false,
      curMachine: (seed.machines[0] || {}).id, operators: [], shifts: ["Shift A", "Shift B", "Shift C"],
      area: "Packaging", initiative: "Servier Egypt – TPM Autonomous Maintenance (Pillar 2)",
      pins: { supervisor: "1111", engineer: "0000" },
      lists: [{ id: "L1", name: "CILT distribution", members: [
        { role: "Production Supervisor", email: "" }, { role: "Maintenance Manager", email: "" }, { role: "Engineering Manager", email: "" },
        { role: "Maintenance Team", email: "" }, { role: "Reliability Engineer", email: "" }] }] };
    await saveCfg();
  }
  EXECS = (await LIB.all("exec")).filter(validExec); ABNS = (await LIB.all("abn")).filter(validAbn);
  if (!Array.isArray(CFG.machines)) CFG.machines = []; CFG.machines = CFG.machines.filter(validMachine);
  RUN = EXECS.find(e => e.status === "open" && e.machineId === (curMachine() || {}).id) || null;
  document.documentElement.lang = LANG; document.documentElement.dir = LANG === "ar" ? "rtl" : "ltr";
  bindChrome(); armIdle(); render();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
}

/* ---------------- chrome ---------------- */
function bindChrome() {
  $("#langBtn").onclick = () => setLang(LANG === "ar" ? "en" : "ar");
  $$("[data-nav]").forEach(b => b.onclick = () => go(b.dataset.nav));
  $("#roleBtn").onclick = roleDialog;
  $("#modalClose").onclick = closeModal;
  $("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
}
function go(v) { if (v === "admin" && !canEng()) { roleDialog("engineer"); return; } VIEW = v; UI.scroll = 0; render(); window.scrollTo(0, 0); }
function toast(msg, kind) { const t = $("#toast"); t.textContent = T(msg); t.className = "show " + (kind || ""); clearTimeout(toast.h); toast.h = setTimeout(() => t.className = "", 2600); }
function modal(title, html, onBind, wide) {
  $("#modalTitle").textContent = title; $("#modalBody").innerHTML = html; $("#modalBox").classList.toggle("wide", !!wide);
  $("#modal").classList.add("show"); if (onBind) onBind($("#modalBody"));
}
function closeModal() { $("#modal").classList.remove("show"); $("#modalBody").innerHTML = ""; }
const icon = (c, s = 22) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true"><path fill="currentColor" d="${CATS[c].icon}"/></svg>`;
const catName = c => LANG === "ar" ? CATS[c].ar : CATS[c].name;

function roleDialog(want) {
  const opts = Object.entries(ROLES).map(([k, v]) => `<button class="btn ${k === ROLE ? "main" : "ghost"} block" data-role="${k}">${esc(T(v))}</button>`).join("");
  modal(T("Switch role"), `<p class="muted">${esc(T("Supervisor and Engineer roles need a PIN. This PIN is a local guard on this device only, not a security login."))}</p>${opts}
    <div id="pinBox" style="display:none;margin-top:12px"><label>${esc(T("PIN"))}<input id="pinIn" type="password" inputmode="numeric" autocomplete="off"></label><button class="btn main block" id="pinOk">${esc(T("Confirm"))}</button></div>`, b => {
    let target = null;
    const pick = k => { if (k === "operator") { setRole("operator"); closeModal(); return; } target = k; $("#pinBox", b).style.display = ""; $("#pinIn", b).focus(); };
    $$("[data-role]", b).forEach(x => x.onclick = () => pick(x.dataset.role));
    $("#pinOk", b).onclick = () => { if ($("#pinIn", b).value === (CFG.pins || {})[target]) { setRole(target); closeModal(); if (want === "engineer" && target === "engineer") go("admin"); } else toast("Wrong PIN", "bad"); };
    if (want) pick(want);
  });
}
let idleT = null;
function armIdle() { clearTimeout(idleT); if (ROLE !== "operator") idleT = setTimeout(() => { setRole("operator"); }, 10 * 60 * 1000); }
["pointerdown", "keydown"].forEach(ev => document.addEventListener(ev, armIdle, { passive: true }));
function setRole(r) { ROLE = r; armIdle(); try { sessionStorage.setItem("cilt.role", r); } catch (e) {} toast(T("Role: ") + T(ROLES[r])); render(); }

/* ---------------- render ---------------- */
function render() {
  $("#langBtn").textContent = LANG === "ar" ? "English" : "عربي";
  $("#roleBtn").textContent = T(ROLES[ROLE]);
  $("#appTitle").textContent = T("Digital Autonomous Maintenance – CILT");
  $$("[data-nav]").forEach(b => { b.classList.toggle("on", b.dataset.nav === VIEW); const l = b.querySelector("span"); if (l) { const k = "nav:" + b.dataset.label; l.textContent = T(k) !== k ? T(k) : T(b.dataset.label); } });
  const v = $("#view"); v.oninput = v.onchange = v.onclick = null;
  try { renderView(v); } catch (err) { console.error(err); v.innerHTML = `<div class="warn bad">${esc(T("This screen could not be shown:"))} ${esc(err && err.message || err)}</div><button class="btn main" onclick="location.reload()">${esc(T("Reload"))}</button>`; }
}
function renderView(v) {
  if (VIEW === "dash") v.innerHTML = dashHtml(), bindDash(v);
  else if (VIEW === "run") renderRun(v);
  else if (VIEW === "abn") renderAbn(v);
  else if (VIEW === "rep") renderReports(v);
  else if (VIEW === "admin") renderAdmin(v);
  else if (VIEW === "machines") renderMachines(v);
}

/* ---------------- dashboard ---------------- */
/* Completion = executed checkpoints. N/A with a reason leaves the denominator; Not Completed and pending stay in it. */
const EXEC_OK = { C: ["done"], I: ["ok", "abn"], L: ["done", "abn"], T: ["chk", "tight", "abn"] };
const isExecuted = (p, r) => !!r && (EXEC_OK[p.cat] || []).includes(r.st);
const isExcused = (p, r) => !!r && (r.st === "na" || r.st === "nr") && !!(r.note || "").trim();
function runStats(e) {
  if (!e) return null;
  const pts = e.points, R = p => e.results[p.id] || {};
  const done = pts.filter(p => isExecuted(p, R(p))).length;
  const na = pts.filter(p => R(p).st === "na" || R(p).st === "nr").length;
  const nc = pts.filter(p => R(p).st === "nc").length;
  const answered = pts.filter(p => R(p).st).length;
  const base = pts.length - pts.filter(p => isExcused(p, R(p))).length;
  const zones = e.zones.length, zdone = e.zones.filter(z => e.zoneDone[z]).length;
  return { pts: pts.length, done, na, nc, answered, pending: pts.length - answered, zones, zdone, pct: base ? Math.round(done / base * 100) : 0, prog: pts.length ? Math.round(answered / pts.length * 100) : 0 };
}
function dashHtml() {
  const m = curMachine();
  if (!m) return `<div class="empty">${esc(T("No machines configured. Open Admin to add one."))}</div>`;
  const e = EXECS.find(x => x.status === "open" && x.machineId === m.id);
  RUN = e || null;
  const s = runStats(e), allPts = pointsOf(m);
  const open = ABNS.filter(a => a.machineId === m.id && !/^(Resolved|Closed)$/.test(a.status));
  const eng = open.filter(a => a.dept === "Maintenance" || a.dept === "Engineering");
  const last = EXECS.filter(x => x.machineId === m.id && x.status === "submitted").sort((a, b) => (b.end || "").localeCompare(a.end || ""))[0];
  const unval = allPts.filter(p => p.validated === false).length, unappr = allPts.filter(p => !p.approved).length;
  const tile = (n, l, cls) => `<div class="kpi ${cls || ""}"><b>${n}</b><span>${esc(T(l))}</span></div>`;
  const pct = s ? s.pct : 0;
  return `
  <section class="hero">
    <div class="hero-l">
      <div class="tag">${esc(CFG.initiative || "")}</div>
      <h2>${esc(m.name)} <small>${esc(m.id)}</small></h2>
      <div class="meta">
        <span><i>${esc(T("Area"))}</i>${esc(m.area || CFG.area || "")}</span>
        <span><i>${esc(T("Type"))}</i>${esc(m.type || "")}</span>
        <span><i>${esc(T("Model"))}</i>${esc(m.model || "")}</span>
        <span><i>${esc(T("Serial"))}</i>${esc(m.serial || "")}</span>
        <span><i>${esc(T("Operator"))}</i>${esc(e ? e.operator : "—")}</span>
        <span><i>${esc(T("Shift"))}</i>${esc(e ? e.shift : "—")}</span>
        <span><i>${esc(T("Execution date"))}</i>${esc(e ? e.date : today())}</span>
        <span><i>${esc(T("CILT status"))}</i>${esc(e ? T("In progress") : last ? T("Last completed") + " " + last.date : T("Not started"))}</span>
      </div>
      <div class="row">
        <button class="btn main big" id="goRun">${esc(T(e ? "Continue CILT" : "Start CILT"))}</button>
        <button class="btn ghost" id="pickM">${esc(T("Change machine"))}</button>
        <button class="btn ghost" id="newAbn">${esc(T("Report abnormality"))}</button>
        <button class="btn ghost" id="docs">${esc(T("Manuals & documents"))}</button>
      </div>
    </div>
    <div class="ring" style="--p:${pct}"><div><b>${pct}%</b><span>${esc(T("Overall completion"))}</span></div></div>
  </section>
  ${unappr ? `<div class="warn"><b>${esc(T("DRAFT CILT standard"))}</b> – ${esc(T("content transcribed from the Körber manuals, pending Servier Engineering approval."))} ${esc(T("Approved:"))} ${allPts.length - unappr}/${allPts.length}. ${esc(T("Gaps where the manual gives no value:"))} <b>${unval}</b> (${esc(T("orange badge"))}).</div>` : ""}
  <section class="kpis">
    ${tile(s ? s.zones : (m.zones || []).length, "Total machine zones")}
    ${tile(s ? s.zdone : 0, "Completed zones", "ok")}
    ${tile(s ? s.zones - s.zdone : (m.zones || []).length, "Pending zones")}
    ${tile(s ? s.pts : allPts.length, "Total CILT checkpoints")}
    ${tile(s ? s.done : 0, "Completed checkpoints", "ok")}
    ${tile(open.length, "Open abnormalities", open.length ? "abn" : "")}
    ${tile(eng.length, "Need Engineering / Maintenance", eng.length ? "bad" : "")}
    ${tile(pct + "%", "Overall completion")}
  </section>
  ${s ? `<section class="card"><h3>${esc(T("Zone progress"))}</h3><div class="zbar">${e.zones.map((z, i) => { const zz = (m.zones || []).find(q => q.id === z); return `<div class="zcell ${e.zoneDone[z] ? "done" : i === e.cur.z ? "cur" : ""}" title="${esc(zz ? L(zz.name) : z)}"><b>${esc(z)}</b><span>${esc(zz ? L(zz.name) : "")}</span></div>`; }).join("")}</div></section>` : ""}
  <section class="card"><h3>${esc(T("CILT checkpoints by category"))}</h3><div class="catrow">${Object.keys(CATS).map(c => { const n = allPts.filter(p => p.cat === c).length; return `<div class="catc" style="--cc:${CATS[c].color}">${icon(c, 28)}<b>${n}</b><span>${esc(catName(c))}</span></div>`; }).join("")}</div></section>`;
}
function bindDash(v) {
  const b = $("#goRun", v); if (b) b.onclick = () => go("run");
  const p = $("#pickM", v); if (p) p.onclick = () => go("machines");
  const n = $("#newAbn", v); if (n) n.onclick = () => abnForm(null);
  const d = $("#docs", v); if (d) d.onclick = docsDialog;
}

async function sniffType(blob) {
  const b = new Uint8Array(await blob.slice(0, 12).arrayBuffer()), h = String.fromCharCode(...b);
  if (h.startsWith("%PDF")) return "application/pdf";
  if (b[0] === 0x89 && h.slice(1, 4) === "PNG") return "image/png";
  if (b[0] === 0xFF && b[1] === 0xD8) return "image/jpeg";
  if (h.startsWith("GIF8")) return "image/gif";
  if (h.startsWith("RIFF") && h.slice(8, 12) === "WEBP") return "image/webp";
  return "";
}
async function openDoc(id) {
  const f = await LIB.get("file", id); if (!f) return;
  const t = await sniffType(f.blob); if (!t) return toast("This file type cannot be opened here", "bad");
  const url = URL.createObjectURL(new Blob([f.blob], { type: t })); window.open(url, "_blank", "noopener"); setTimeout(() => URL.revokeObjectURL(url), 60000);
}
async function docsDialog() {
  const m = curMachine(), files = (await LIB.all("file")).filter(f => f.machineId === m.id);
  modal(T("Manuals & documents"), `<p class="muted">${esc(T("Read-only. Engineering uploads the files in Admin."))}</p>
    <div class="tw"><table class="tbl"><tbody>${files.map(f => `<tr><td>${esc(f.title)}</td><td>${esc(T(f.kind))}</td><td><button class="btn ghost sm" data-fo="${esc(f.id)}">${esc(T("Open"))}</button></td></tr>`).join("") || `<tr><td class="muted">${esc(T("No files uploaded yet."))}</td></tr>`}</tbody></table></div>
    <h4>${esc(T("Reference documents (site copies)"))}</h4><ul>${(m.manuals || []).map(x => `<li>${esc(x.title || x.file)} <small class="muted">${esc(x.file || "")}</small></li>`).join("")}</ul>`, b => {
    $$("[data-fo]", b).forEach(x => x.onclick = () => openDoc(x.dataset.fo));
  });
}
/* ---------------- machine selection (module B) ---------------- */
function renderMachines(v) {
  v.innerHTML = `<h2 class="vt">${esc(T("Select machine"))}</h2><div class="mgrid">${machines().map(m => {
    const z0 = (m.zones || [])[0], img = z0 ? zoneImg(z0) : "";
    const pts = pointsOf(m);
    return `<button class="mcard ${m.id === CFG.curMachine ? "on" : ""}" data-m="${esc(m.id)}">
      ${img ? `<img src="${esc(img)}" alt="">` : `<div class="noimg">${esc(m.model || "")}</div>`}
      <div><b>${esc(m.name)}</b><small>${esc(m.id)} · ${esc(T("Model"))} ${esc(m.model || "—")} · ${esc(T("Serial"))} ${esc(m.serial || "—")}</small>
      <small>${(m.zones || []).length} ${esc(T("zones"))} · ${pts.length} ${esc(T("checkpoints"))}</small></div></button>`;
  }).join("")}</div>`;
  $$("[data-m]", v).forEach(b => b.onclick = async () => {
    const open = EXECS.find(x => x.status === "open" && x.machineId === CFG.curMachine);
    CFG.curMachine = b.dataset.m; await saveCfg();
    if (open && open.machineId !== b.dataset.m) toast("The open CILT on the previous machine is kept. Switch back to continue it.");
    go("dash");
  });
}
let PHOTO_CACHE = {};
async function photoUrl(id) { if (!id) return ""; if (PHOTO_CACHE[id]) return PHOTO_CACHE[id]; const r = await LIB.get("photo", id); return (PHOTO_CACHE[id] = r ? r.data : ""); }
function zoneImg(z) { return z.sitePhoto ? (PHOTO_CACHE[z.sitePhoto] || "") : (z.image || ""); }
async function warmPhotos() { const ids = machines().flatMap(m => (m.zones || []).map(z => z.sitePhoto).filter(Boolean)); for (const i of ids) await photoUrl(i); }

/* ---------------- execution (module D) ---------------- */
function renderRun(v) {
  const m = curMachine();
  if (!m) { v.innerHTML = `<div class="empty">${esc(T("No machine selected."))}</div>`; return; }
  RUN = EXECS.find(x => x.status === "open" && x.machineId === m.id) || null;
  if (!RUN) return renderSetup(v, m);
  if (RUN.cur.z >= RUN.zones.length) return renderFinal(v, m);
  renderZone(v, m);
}
function renderSetup(v, m) {
  const pts = pointsOf(m), have = new Set(pts.map(freqKey)), freqs = ROUTINE_ORDER.filter(f => have.has(f)).concat([...have].filter(f => !ROUTINE_ORDER.includes(f)));
  const sel = UI.freqs && UI.freqM === m.id ? UI.freqs : freqs.filter(f => f === "Per shift / daily"); UI.freqM = m.id;
  UI.freqs = sel.length ? sel : freqs.slice();
  if (!canSup()) UI.inclMaint = false;
  const count = () => pts.filter(p => UI.freqs.includes(freqKey(p)) && (p.role !== "maintenance" || UI.inclMaint)).length;
  const gen = (m.safety || []);
  v.innerHTML = `
  <div class="steps"><span class="on">1 ${esc(T("Machine"))}</span><span class="on">2 ${esc(T("Operator"))}</span><span>3 ${esc(T("Zones"))}</span><span>4 ${esc(T("Finish"))}</span></div>
  <section class="card">
    <h3>${esc(m.name)} <small class="muted">${esc(m.id)}</small></h3>
    <div class="grid2">
      <label>${esc(T("Operator name"))}<input id="opName" list="opList" value="${esc(UI.op || "")}" autocomplete="off"><datalist id="opList">${(CFG.operators || []).map(o => `<option value="${esc(o)}">`).join("")}</datalist></label>
      <label>${esc(T("Shift"))}<select id="opShift">${(CFG.shifts || []).map(s => `<option ${s === UI.shift ? "selected" : ""}>${esc(s)}</option>`).join("")}</select></label>
      <label>${esc(T("Execution date"))}<input value="${esc(today())}" disabled></label>
      <label>${esc(T("Production area"))}<input value="${esc(m.area || CFG.area || "")}" disabled></label>
    </div>
    <h4>${esc(T("Which CILT routines are you doing now?"))}</h4>
    <p class="muted">${esc(T("Frequencies come from the machine documentation. Pick the routines that are due."))}</p>
    <div class="chips">${freqs.map(f => `<button class="chip ${UI.freqs.includes(f) ? "on" : ""}" data-f="${esc(f)}">${esc(T(f))} <small>${pts.filter(p => freqKey(p) === f && (p.role !== "maintenance" || UI.inclMaint)).length}</small></button>`).join("")}</div>
    ${freqs.some(f => /operating hours/.test(f)) ? `<p class="muted sm">${esc(T("Hour intervals are machine operating hours shown on the HMI. Example from the manual: 40 h is about weekly on one shift."))}</p>` : ""}
    ${canSup() ? `<label class="check"><input type="checkbox" id="inclM" ${UI.inclMaint ? "checked" : ""}> ${esc(T("Include maintenance-only tasks (technician run)"))}</label>` : ""}
    <p><b id="ptCount">${count()}</b> ${esc(T("checkpoints selected"))}</p>
  </section>
  <section class="card safety">
    <h3>${esc(T("Safety before you start"))}</h3>
    <ul>${gen.map(s => `<li>${LB(s)}${s.ref ? `<small class="ref">${esc(s.ref)}</small>` : ""}</li>`).join("") || `<li>${esc(T("No general safety text configured for this machine. Follow the site safety procedure."))}</li>`}</ul>
    <div class="note">${esc(T("This app does not replace LOTOTO or approved machine safety procedures. Put the machine in the safe state your site procedure requires before you open guards or reach into hazardous areas."))}</div>
    <label class="check"><input type="checkbox" id="safeOk"> ${esc(T("I have read the safety precautions and the machine is in the required safe state."))}</label>
  </section>
  <div class="row end"><button class="btn ghost" id="back">${esc(T("Back"))}</button><button class="btn main big" id="start">${esc(T("Start Zone 1"))}</button></div>`;
  $$("[data-f]", v).forEach(b => b.onclick = () => { const f = b.dataset.f; UI.freqs = UI.freqs.includes(f) ? UI.freqs.filter(x => x !== f) : UI.freqs.concat(f); b.classList.toggle("on"); $("#ptCount", v).textContent = count(); });
  const im = $("#inclM", v); if (im) im.onchange = () => { UI.inclMaint = im.checked; $("#ptCount", v).textContent = count(); };
  $("#opName", v).oninput = e => UI.op = e.target.value; $("#opShift", v).onchange = e => UI.shift = e.target.value;
  $("#back", v).onclick = () => go("dash");
  $("#start", v).onclick = async () => {
    const op = $("#opName", v).value.trim(), sh = $("#opShift", v).value;
    if (!op) return toast("Enter the operator name", "bad");
    if (!$("#safeOk", v).checked) return toast("Confirm the safety precautions first", "bad");
    const scope = pts.filter(p => UI.freqs.includes(freqKey(p)) && (p.role !== "maintenance" || UI.inclMaint));
    if (!scope.length) return toast("Select at least one routine with checkpoints", "bad");
    const zones = (m.zones || []).map(z => z.id).filter(z => scope.some(p => p.zoneId === z));
    if (!(CFG.operators || []).includes(op)) { CFG.operators = (CFG.operators || []).concat(op).slice(-50); await saveCfg(); }
    const e = {
      id: uid("CILT"), machineId: m.id, machine: { id: m.id, name: m.name, model: m.model, serial: m.serial, type: m.type, area: m.area || CFG.area || "" },
      operator: op, shift: sh, date: today(), start: new Date().toISOString(), end: null, freqs: UI.freqs.slice(), safetyAck: new Date().toISOString(),
      zones, zoneInfo: Object.fromEntries((m.zones || []).filter(z => zones.includes(z.id)).map(z => [z.id, { name: z.name, image: z.image || null, sitePhoto: z.sitePhoto || null }])),
      points: JSON.parse(JSON.stringify(scope)), results: {}, zoneDone: {}, cur: { z: 0, c: 0 }, status: "open", log: [{ at: new Date().toISOString(), by: op, a: "started" }]
    };
    EXECS.push(e); RUN = e; await LIB.put("exec", e); render();
  };
}
const catsIn = (e, z) => Object.keys(CATS).filter(c => e.points.some(p => p.zoneId === z && p.cat === c));
async function saveRun() { RUN.saved = new Date().toISOString(); await LIB.put("exec", RUN); }

function renderZone(v, m) {
  const e = RUN, zid = e.zones[e.cur.z], zone = (m.zones || []).find(z => z.id === zid) || { id: zid, name: e.zoneInfo[zid].name, points: [] };
  const cats = catsIn(e, zid), steps = cats.concat("R");
  if (e.cur.c >= steps.length) e.cur.c = steps.length - 1;
  const step = steps[e.cur.c];
  if (!(e.zoneStart = e.zoneStart || {})[zid]) { e.zoneStart[zid] = new Date().toISOString(); saveRun(); }
  const zpts = e.points.filter(p => p.zoneId === zid);
  const st = runStats(e);
  const head = `
  <div class="runhead">
    <div><small>${esc(T("Zone"))} ${e.cur.z + 1} / ${e.zones.length}</small><h2>${esc(zid)} – ${esc(L(zone.name))}</h2></div>
    <div class="pbar"><i style="width:${st.prog}%"></i><span>${st.answered}/${st.pts} ${esc(T("answered"))}</span></div>
  </div>
  <div class="zsteps">${e.zones.map((z, i) => `<span class="${e.zoneDone[z] ? "done" : i === e.cur.z ? "cur" : ""}">${esc(z)}</span>`).join("")}</div>
  <div class="tabs">${steps.map((c, i) => { const n = c === "R" ? "" : zpts.filter(p => p.cat === c).length, d = c === "R" ? "" : zpts.filter(p => p.cat === c && (e.results[p.id] || {}).st).length;
    return `<button class="tab ${i === e.cur.c ? "on" : ""} ${c !== "R" && d === n ? "full" : ""}" data-step="${i}" style="--cc:${c === "R" ? "var(--navy)" : CATS[c].color}">${c === "R" ? "✓" : icon(c, 18)} <span>${esc(c === "R" ? T("Review") : catName(c))}</span>${c === "R" ? "" : `<small>${d}/${n}</small>`}</button>`; }).join("")}</div>`;
  const img = e.zoneInfo[zid].sitePhoto ? (PHOTO_CACHE[e.zoneInfo[zid].sitePhoto] || "") : (e.zoneInfo[zid].image || "");
  const markers = zpts.filter(p => p.marker && (step === "R" || p.cat === step)).map((p, i) => `<a class="mk" href="#pt-${esc(p.id)}" style="left:${p.marker.x * 100}%;top:${p.marker.y * 100}%;--cc:${CATS[p.cat].color}" title="${esc(p.id)}">${esc(p.id.split("-").pop())}</a>`).join("");
  const zoneBox = `<section class="zone">
    <div><div class="zimg">${img ? `<img src="${esc(img)}" alt="${esc(L(zone.name))}">${markers}` : `<div class="noimg">${esc(T("No zone picture yet. Engineering can add one in Admin."))}</div>`}</div>
      ${zone.imageRef ? `<small class="ref">${esc(T("Picture:"))} ${esc(zone.imageRef)}</small>` : ""}</div>
    <div class="zinfo">${zone.desc ? `<p>${esc(L(zone.desc))}</p>` : ""}
      ${(zone.safety || []).length ? `<div class="safety mini"><b>${esc(T("Safety"))}</b><ul>${zone.safety.map(s => `<li>${LB(s)}</li>`).join("")}</ul></div>` : ""}
      ${(zone.tools || []).length ? `<div><b>${esc(T("Tools & materials"))}</b><ul>${zone.tools.map(s => `<li>${esc(L(s))}</li>`).join("")}</ul></div>` : ""}
    </div></section>`;
  let body;
  if (step === "R") body = reviewHtml(e, zid, zpts);
  else body = `<h3 class="cath" style="--cc:${CATS[step].color}">${icon(step)} ${esc(catName(step))}</h3>` + zpts.filter(p => p.cat === step).map(p => pointHtml(e, p)).join("");
  const isLastStep = e.cur.c === steps.length - 1;
  v.innerHTML = head + zoneBox + `<div id="pts">${body}</div>
    <div class="navbar">
      <button class="btn ghost" id="prev" ${e.cur.z === 0 && e.cur.c === 0 ? "disabled" : ""}>${esc(T("Previous"))}</button>
      ${isLastStep ? `<button class="btn main big" id="zoneOk">${esc(T(e.cur.z === e.zones.length - 1 ? "Confirm zone & finish" : "Confirm zone & go to next"))}</button>`
        : `<button class="btn main big" id="next">${esc(T("Next"))}: ${esc(steps[e.cur.c + 1] === "R" ? T("Review") : catName(steps[e.cur.c + 1]))}</button>`}
    </div>`;
  bindZone(v, m, e, zid, steps);
}
function pointHtml(e, p) {
  const r = e.results[p.id] || {}, c = p.cat;
  const rows = [];
  const add = (k, val) => { if (val && (typeof val === "string" ? val.trim() : L(val))) rows.push(`<div class="kv"><i>${esc(T(k))}</i><div>${esc(L(val))}</div></div>`); };
  add("Instruction", p.instruction);
  if (c === "C") { add("Cleaning material", p.material); }
  if (c === "I") { add("Expected normal condition", p.criteria); if ((p.abnormal || []).length) rows.push(`<div class="kv"><i>${esc(T("Look for"))}</i><div><ul class="abl">${p.abnormal.map(a => `<li>${esc(L(a))}</li>`).join("")}</ul></div></div>`); }
  if (c === "L") {
    const lub = (curMachine().lubricants || []).find(x => x.id === p.lubricantId);
    add("Lubricant", lub ? lub.name + (lub.spec ? " – " + lub.spec : "") : p.material);
    add("Method", p.method ? T(p.method) : ""); add("Quantity", p.quantity || (p.validated === false ? "" : ""));
  }
  if (c === "T") { add("Tool", p.material); add("Torque", p.torque || ""); }
  if (c !== "I") add("Acceptance criteria", p.criteria);
  add("Frequency", p.frequency);
  if (p.machineState) add("Machine state", T(p.machineState === "running" ? "Running" : "Stopped"));
  if (p.minutes) add("Planned time", p.minutes + " " + T("min"));
  add("Inform", p.inform);
  const missing = [];
  if (c === "L" && !p.quantity) missing.push(T("quantity"));
  if (c === "T" && !p.torque) missing.push(T("torque value"));
  const tightBlocked = c === "T" && !p.allowTighten;
  const acts = ACT[c].map(([k, lbl, cls]) => {
    const dis = k === "tight" && tightBlocked;
    return `<button class="act ${cls} ${r.st === k ? "on" : ""}" data-p="${esc(p.id)}" data-st="${k}" ${dis ? "disabled" : ""}>${esc(T(lbl))}</button>`;
  }).join("");
  const needAbn = r.st === "abn";
  return `<article class="pt ${r.st ? "set " + r.st : ""}" id="pt-${esc(p.id)}" style="--cc:${CATS[c].color}">
    <header><b>${esc(p.id)}</b><h4>${LB(p.title)}</h4>
      ${p.mandatory === false ? `<span class="badge">${esc(T("Optional"))}</span>` : ""}
      ${p.validated === false ? `<span class="badge warnb" title="${esc(p.note || "")}">${esc(T("Gap: value not in manual"))}</span>` : ""}
      ${p.role === "maintenance" ? `<span class="badge">${esc(T("Maintenance only – not operator AM"))}</span>` : ""}
      ${p.demo ? `<span class="badge demo">DEMO DATA</span>` : ""}</header>
    ${rows.join("")}
    ${p.caution ? `<div class="warn bad sm"><b>${esc(T("Caution"))}:</b> ${esc(L(p.caution))}</div>` : ""}
    ${missing.length ? `<div class="warn sm">${esc(T("Not in the manual:"))} ${esc(missing.join(", "))}. ${esc(T("Do not guess. Ask Engineering."))}</div>` : ""}
    ${tightBlocked ? `<div class="warn sm">${esc(T("Check only. Do not tighten this assembly unless an approved work instruction authorizes it. Report loose parts as an abnormality."))}</div>` : ""}
    ${p.note ? `<div class="muted sm">${esc(p.note)}</div>` : ""}
    ${p.ref ? `<small class="ref">${esc(T("Reference:"))} ${esc(p.ref)}</small>` : ""}
    ${p.reading ? readingHtml(p, r) : ""}
    <div class="acts">${acts}</div>
    ${r.st === "nc" || ((r.st === "na" || r.st === "nr") && p.mandatory !== false) ? `<label class="need">${esc(T(r.st === "nc" ? "Why was it not completed? (required)" : "Why is it not applicable / not required? (required)"))}<textarea data-note="${esc(p.id)}" rows="2">${esc(r.note || "")}</textarea></label>`
      : `<label>${esc(T("Comment"))}<textarea data-note="${esc(p.id)}" rows="1">${esc(r.note || "")}</textarea></label>`}
    <div class="photos">${(r.photos || []).map(id => `<img data-ph="${esc(id)}" src="${esc(PHOTO_CACHE[id] || "")}" alt="">`).join("")}
      <label class="btn ghost sm">${esc(T("Add photo"))}<input type="file" accept="image/*" capture="environment" data-photo="${esc(p.id)}" hidden></label>
      ${c === "C" && r.st !== "abn" ? `<button class="btn ghost sm" data-raise="${esc(p.id)}">${esc(T("Report abnormality"))}</button>` : ""}</div>
    ${needAbn || r.abn ? abnInline(p, r.abn || {}, r.abnRaised) : ""}
  </article>`;
}
function readingHtml(p, r) {
  const g = p.reading, v = r.value, n = parseFloat(v), out = v !== undefined && v !== "" && isFinite(n) && ((g.min != null && n < g.min) || (g.max != null && n > g.max));
  return `<label class="reading ${out ? "out" : ""}">${esc(T("Reading"))} (${esc(g.unit || "")}${g.min != null || g.max != null ? `, ${esc(T("limits"))} ${g.min ?? "—"} … ${g.max ?? "—"}` : ""})
    <input type="number" step="any" inputmode="decimal" data-val="${esc(p.id)}" value="${esc(v ?? "")}">${out ? `<b>${esc(T("Out of limits – report an abnormality"))}</b>` : ""}</label>`;
}
function abnInline(p, a, locked) {
  if (locked) return `<div class="abnbox"><h5>${esc(T("Abnormality recorded"))}: ${esc(locked)}</h5><p>${esc(a.desc || "")}</p><small class="muted">${esc(T("The original observation is read-only. Add updates in Abnormalities."))}</small></div>`;
  const o = (l, v, tr) => l.map(x => `<option value="${esc(x)}" ${x === v ? "selected" : ""}>${esc(tr ? T(x) : x)}</option>`).join("");
  return `<div class="abnbox" data-abn="${esc(p.id)}">
    <h5>${esc(T("Abnormality details"))}</h5>
    <div class="grid2">
      <label>${esc(T("Category"))}<select data-af="category">${o(ABN_CATS, a.category || (p.cat === "L" ? "Lubrication" : p.cat === "C" ? "Cleaning" : "Mechanical"), true)}</select></label>
      <label>${esc(T("Severity"))}<select data-af="severity">${o(SEV, a.severity || "Medium", true)}</select></label>
    </div>
    <div class="grid2"><label>${esc(T("Abnormality type (TPM)"))}<select data-af="tpmType">${o(TPM_TYPES, a.tpmType || "Minor flaw", true)}</select></label>
      <label>${esc(T("Urgency"))}<select data-af="urgency">${o(URG, a.urgency || URG[0], true)}</select></label></div>
    <label class="need">${esc(T("Description (required)"))}<textarea data-af="desc" rows="2">${esc(a.desc || "")}</textarea></label>
    <label>${esc(T("Immediate action taken"))}<textarea data-af="immediate" rows="1">${esc(a.immediate || "")}</textarea></label>
    <div class="grid2"><label>${esc(T("Support needed from"))}<select data-af="dept">${o(DEPTS, a.dept || "Maintenance", true)}</select></label>
    <label>${esc(T("Additional comments"))}<input data-af="comments" value="${esc(a.comments || "")}"></label></div>
    <small class="muted">${esc(T("Photos added to this checkpoint are attached to the abnormality."))}</small>
  </div>`;
}
function reviewHtml(e, zid, zpts) {
  const pend = zpts.filter(p => !(e.results[p.id] || {}).st);
  const bad = zpts.filter(p => problem(e, p));
  return `<h3>${esc(T("Zone review"))}</h3>
  <div class="tw"><table class="tbl"><thead><tr><th>${esc(T("ID"))}</th><th>${esc(T("Checkpoint"))}</th><th>${esc(T("Result"))}</th><th>${esc(T("Comment"))}</th></tr></thead><tbody>
  ${zpts.map(p => { const r = e.results[p.id] || {}; return `<tr class="${r.st || "pend"}"><td>${esc(p.id)}</td><td>${esc(catName(p.cat))}: ${esc(L(p.title))}</td><td>${esc(r.st ? T(stLabel(p.cat, r.st)) : T("Pending"))}</td><td>${esc(r.note || (r.abn ? r.abn.desc : ""))}</td></tr>`; }).join("")}
  </tbody></table></div>
  ${pend.length ? `<div class="warn">${esc(T("Pending checkpoints:"))} ${pend.length}. ${esc(T("Every mandatory checkpoint needs a result before the zone can be confirmed."))}</div>` : ""}
  ${bad.length ? `<div class="warn bad">${esc(T("Fix these first:"))} ${bad.map(p => esc(p.id)).join(", ")}</div>` : ""}`;
}
/* returns a problem string if the result is not acceptable for zone confirmation */
function problem(e, p) {
  const r = e.results[p.id] || {};
  if (!r.st) return p.mandatory === false ? "" : "pending";
  if (r.st === "nc" && !(r.note || "").trim()) return "reason";
  if ((r.st === "na" || r.st === "nr") && p.mandatory !== false && !(r.note || "").trim()) return "reason";
  if (r.st === "abn" && !((r.abn || {}).desc || "").trim()) return "abn";
  if (p.reading) { const n = parseFloat(r.value), g = p.reading, has = r.value !== undefined && r.value !== "" && isFinite(n);
    if (!has && r.st !== "abn" && r.st !== "na" && r.st !== "nr") return "reading";
    if (has && ((g.min != null && n < g.min) || (g.max != null && n > g.max)) && !(((r.abn || {}).desc || "").trim())) return "limits"; }
  return "";
}
function bindZone(v, m, e, zid, steps) {
  const setRes = async (pid, patch) => { e.results[pid] = Object.assign({}, e.results[pid] || {}, patch, { at: new Date().toISOString(), by: e.operator }); await saveRun(); };
  $$("[data-step]", v).forEach(b => b.onclick = () => { e.cur.c = +b.dataset.step; saveRun(); renderZone(v, m); });
  $$(".act", v).forEach(b => b.onclick = async () => {
    const pid = b.dataset.p, st = b.dataset.st, r = e.results[pid] || {};
    if (r.abnRaised && st !== r.st) return toast("An abnormality was already recorded for this checkpoint", "bad");
    const patch = { st };
    if (st !== "abn" && r.abn && !r.abnRaised && r.st === "abn") patch.abn = null;
    await setRes(pid, patch); rerenderPoint(v, e, pid);
  });
  v.oninput = async ev => {
    const t = ev.target;
    if (t.dataset.note) { (e.results[t.dataset.note] = e.results[t.dataset.note] || {}).note = t.value; debounceSave(); }
    if (t.dataset.val) { (e.results[t.dataset.val] = e.results[t.dataset.val] || {}).value = t.value; debounceSave(); }
    if (t.dataset.af) { const box = t.closest("[data-abn]"), pid = box.dataset.abn, r = e.results[pid] = e.results[pid] || {}; if (r.abnRaised) return; r.abn = r.abn || {}; r.abn[t.dataset.af] = t.value; debounceSave(); }
  };
  v.onchange = async ev => {
    const t = ev.target;
    if (t.dataset.af) { const pid = t.closest("[data-abn]").dataset.abn, r = e.results[pid] = e.results[pid] || {}; if (r.abnRaised) return; r.abn = r.abn || {}; r.abn[t.dataset.af] = t.value; await saveRun(); }
    if (t.dataset.val) { await saveRun(); rerenderPoint(v, e, t.dataset.val); }
    if (t.dataset.photo && t.files[0]) {
      try { const data = await LIB.resizeImage(t.files[0]); const id = uid("PH"); await LIB.put("photo", { id, data, at: new Date().toISOString() }); PHOTO_CACHE[id] = data;
        const r = e.results[t.dataset.photo] = e.results[t.dataset.photo] || {}; r.photos = (r.photos || []).concat(id); await saveRun(); rerenderPoint(v, e, t.dataset.photo); }
      catch (err) { toast("Could not read the photo", "bad"); }
    }
  };
  $$("[data-raise]", v).forEach(b => b.onclick = async () => { const pid = b.dataset.raise, r = e.results[pid] = e.results[pid] || {}; r.abn = r.abn || { category: "Cleaning", severity: "Low" }; await saveRun(); rerenderPoint(v, e, pid); });
  v.onclick = ev => { const im = ev.target.closest("[data-ph]"); if (im) viewPhoto(im.dataset.ph); };
  const prev = $("#prev", v); if (prev) prev.onclick = async () => { if (e.cur.c > 0) e.cur.c--; else if (e.cur.z > 0) { e.cur.z--; e.cur.c = catsIn(e, e.zones[e.cur.z]).length; } await saveRun(); renderRun(v); window.scrollTo(0, 0); };
  const next = $("#next", v); if (next) next.onclick = async () => { e.cur.c++; await saveRun(); renderZone(v, m); window.scrollTo(0, 0); };
  const ok = $("#zoneOk", v); if (ok) ok.onclick = () => confirmZone(v, m, e, zid);
}
let saveT = null; function debounceSave() { clearTimeout(saveT); saveT = setTimeout(() => saveRun(), 400); }
function rerenderPoint(v, e, pid) {
  const el = $("#pt-" + CSS.escape(pid), v), p = e.points.find(x => x.id === pid); if (!el || !p) return;
  el.outerHTML = pointHtml(e, p);
  const tabs = $(".tabs", v); if (tabs) { const zpts = e.points.filter(x => x.zoneId === e.zones[e.cur.z]); $$(".tab", tabs).forEach(t => { const c = catsIn(e, e.zones[e.cur.z]).concat("R")[+t.dataset.step]; if (c === "R") return; const n = zpts.filter(x => x.cat === c).length, d = zpts.filter(x => x.cat === c && (e.results[x.id] || {}).st).length; const s = t.querySelector("small"); if (s) s.textContent = d + "/" + n; t.classList.toggle("full", d === n); }); }
  const st = runStats(e), pb = $(".pbar", v); if (pb) { pb.querySelector("i").style.width = st.prog + "%"; pb.querySelector("span").textContent = `${st.answered}/${st.pts} ${T("answered")}`; }
  const nb = $("#pt-" + CSS.escape(pid), v); if (nb) $$(".act", nb).forEach(b => b.onclick = async () => { const st2 = b.dataset.st, r = e.results[pid] || {}; if (r.abnRaised && st2 !== r.st) return toast("An abnormality was already recorded for this checkpoint", "bad"); const patch = { st: st2 }; if (st2 !== "abn" && r.abn && !r.abnRaised && r.st === "abn") patch.abn = null; e.results[pid] = Object.assign({}, r, patch, { at: new Date().toISOString(), by: e.operator }); await saveRun(); rerenderPoint(v, e, pid); });
  if (nb) $$("[data-raise]", nb).forEach(b => b.onclick = async () => { const r = e.results[pid] = e.results[pid] || {}; r.abn = r.abn || { category: "Cleaning", severity: "Low" }; await saveRun(); rerenderPoint(v, e, pid); });
}
async function confirmZone(v, m, e, zid) {
  await saveRun();
  const zpts = e.points.filter(p => p.zoneId === zid);
  const probs = zpts.map(p => [p, problem(e, p)]).filter(x => x[1]);
  if (probs.length) {
    const first = probs[0][0], steps = catsIn(e, zid).concat("R");
    toast({ pending: "Some mandatory checkpoints have no result", reason: "Give a reason for every Not Completed or Not Applicable item", abn: "Describe every abnormality", reading: "Enter the reading value", limits: "A reading is out of limits: record it as Abnormality Detected" }[probs[0][1]] || "Check the highlighted checkpoint", "bad");
    e.cur.c = Math.max(0, steps.indexOf(first.cat)); await saveRun(); renderZone(v, m);
    const el = $("#pt-" + CSS.escape(first.id), v); if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.classList.add("flash"); }
    return;
  }
  /* commit abnormalities of this zone (original observation becomes read-only) */
  for (const p of zpts) {
    const r = e.results[p.id]; if (!r || !r.abn || r.abnRaised) continue;
    if (!(r.abn.desc || "").trim()) continue;
    const id = await nextSeq("ABN"), now = new Date().toISOString();
    const rec = { id, execId: e.id, machineId: e.machineId, machineName: e.machine.name, zoneId: zid, zoneName: L(e.zoneInfo[zid].name), pointId: p.id, pointTitle: L(p.title), cat: p.cat,
      at: now, operator: e.operator, shift: e.shift, category: r.abn.category || "Other", severity: r.abn.severity || "Medium", desc: r.abn.desc, immediate: r.abn.immediate || "",
      dept: r.abn.dept || "Maintenance", comments: r.abn.comments || "", photos: (r.photos || []).slice(), status: "Open",
      tpmType: r.abn.tpmType || TPM_TYPES[0], urgency: r.abn.urgency || URG[0], cardType: cardType(r.abn.category || "Other"), owner: "", due: "",
      escalation: (r.abn.severity === "High" || r.abn.severity === "Critical" || /×/.test(r.abn.urgency || "")) ? "Maintenance / Engineering" : "Production Supervisor",
      history: [{ at: now, by: e.operator, role: "Operator", action: "Raised", status: "Open", note: "" }] };
    await LIB.put("abn", rec); ABNS.push(rec); r.abnRaised = id;
  }
  e.zoneDone[zid] = new Date().toISOString(); e.log.push({ at: new Date().toISOString(), by: e.operator, a: "zone " + zid + " confirmed" });
  e.cur.z++; e.cur.c = 0; await saveRun();
  toast(e.cur.z < e.zones.length ? T("Zone confirmed. Next: ") + e.zones[e.cur.z] : "All zones done", "ok");
  renderRun(v); window.scrollTo(0, 0);
}
function outcome(e) {
  const pts = e.points, res = p => e.results[p.id] || {};
  const nc = pts.filter(p => res(p).st === "nc"), abn = pts.filter(p => res(p).st === "abn" || res(p).abnRaised);
  const pend = pts.filter(p => !res(p).st && p.mandatory !== false);
  const naNoReason = pts.filter(p => p.mandatory !== false && (res(p).st === "na" || res(p).st === "nr") && !(res(p).note || "").trim());
  const ok = !pend.length && !nc.filter(p => p.mandatory !== false).length && !naNoReason.length && e.zones.every(z => e.zoneDone[z]);
  return { ok, nc, abn, pend, na: pts.filter(p => res(p).st === "na" || res(p).st === "nr") };
}
function renderFinal(v, m) {
  const e = RUN, o = outcome(e), s = runStats(e);
  v.innerHTML = `<section class="final ${o.ok ? "good" : "part"}">
    ${o.ok ? `<h2>${esc(T("CONGRATULATIONS! CILT EXECUTION COMPLETED SUCCESSFULLY."))}</h2>` : `<h2>${esc(T("CILT finished with open items"))}</h2>`}
    <p>${esc(T("Completed"))}: <b>${s.done}</b> · ${esc(T("Not applicable"))}: <b>${s.na}</b> · ${esc(T("Not completed"))}: <b>${s.nc}</b> · ${esc(T("Pending"))}: <b>${s.pending}</b> · ${s.zdone}/${s.zones} ${esc(T("zones"))} · <b>${s.pct}%</b></p>
    ${o.nc.length ? `<p class="bad">${esc(T("Not completed:"))} ${o.nc.map(p => esc(p.id)).join(", ")}</p>` : ""}
    ${o.abn.length ? `<p class="abn">${esc(T("Abnormalities raised:"))} ${o.abn.length}</p>` : ""}
    <p class="muted">${esc(T("Submitting locks this record. After that nobody can change the results."))}</p>
    <div class="row center"><button class="btn ghost" id="backZ">${esc(T("Back to last zone"))}</button><button class="btn main big" id="submit">${esc(T("Submit & lock"))}</button></div>
  </section>`;
  $("#backZ", v).onclick = async () => { e.cur.z = e.zones.length - 1; e.cur.c = catsIn(e, e.zones[e.cur.z]).length; delete e.zoneDone[e.zones[e.cur.z]]; await saveRun(); renderRun(v); };
  $("#submit", v).onclick = async () => {
    if (!confirm(T("Submit and lock this CILT record?"))) return;
    e.status = "submitted"; e.end = new Date().toISOString(); e.success = o.ok; e.log.push({ at: e.end, by: e.operator, a: "submitted" });
    await LIB.put("exec", e); RUN = null; UI.freqs = null;
    toast("Submitted", "ok"); VIEW = "rep"; UI.rep = e.id; render();
  };
}
function viewPhoto(id) { modal(T("Photo"), `<img src="${esc(PHOTO_CACHE[id] || "")}" style="width:100%">`, null, true); }

/* ---------------- abnormalities (section 4) ---------------- */
function renderAbn(v) {
  const f = UI.af || (UI.af = { m: "", st: "open", sev: "" });
  let l = ABNS.slice().sort((a, b) => b.at.localeCompare(a.at));
  if (f.m) l = l.filter(a => a.machineId === f.m);
  if (f.st === "open") l = l.filter(a => !/^(Resolved|Closed)$/.test(a.status)); else if (f.st) l = l.filter(a => a.status === f.st);
  if (f.sev) l = l.filter(a => a.severity === f.sev);
  const open = ABNS.filter(a => !/^(Resolved|Closed)$/.test(a.status));
  const hc = open.filter(a => /High|Critical/.test(a.severity)).length;
  const closed = ABNS.filter(a => /^(Resolved|Closed)$/.test(a.status)).length;
  v.innerHTML = `<h2 class="vt">${esc(T("Abnormalities"))}</h2>
  <section class="kpis sm"><div class="kpi abn"><b>${open.length}</b><span>${esc(T("Open"))}</span></div><div class="kpi bad"><b>${hc}</b><span>${esc(T("High / Critical open"))}</span></div>
    <div class="kpi ok"><b>${closed}</b><span>${esc(T("Resolved / Closed"))}</span></div><div class="kpi"><b>${ABNS.length ? Math.round(closed / ABNS.length * 100) : 0}%</b><span>${esc(T("Closure rate"))}</span></div></section>
  <div class="filters">
    <select id="fM"><option value="">${esc(T("All machines"))}</option>${machines().map(m => `<option value="${esc(m.id)}" ${f.m === m.id ? "selected" : ""}>${esc(m.name)}</option>`).join("")}</select>
    <select id="fS"><option value="open" ${f.st === "open" ? "selected" : ""}>${esc(T("All open"))}</option><option value="" ${!f.st ? "selected" : ""}>${esc(T("All"))}</option>${ABN_ST.map(s => `<option value="${s}" ${f.st === s ? "selected" : ""}>${esc(T(s))}</option>`).join("")}</select>
    <select id="fV"><option value="">${esc(T("All severities"))}</option>${SEV.map(s => `<option value="${s}" ${f.sev === s ? "selected" : ""}>${esc(T(s))}</option>`).join("")}</select>
    <button class="btn main" id="newA">${esc(T("Report abnormality"))}</button>
  </div>
  <div class="alist">${l.map(a => `<button class="acard sev-${a.severity}" data-a="${esc(a.id)}"><div><b>${esc(a.id)}</b> <span class="sev">${esc(T(a.severity))}</span> <span class="st">${esc(T(a.status))}</span></div>
    <div>${esc(a.machineName)} · ${esc(a.zoneId || "")} ${esc(a.pointId || "")}</div><div class="d">${esc(a.desc)}</div>
    <small>${sb(a.at)} · ${esc(a.operator)} · ${esc(T("Support:"))} ${esc(T(a.dept))} · ${esc(T("Escalated to:"))} ${esc(T(a.escalation || ""))}</small></button>`).join("") || `<div class="empty">${esc(T("No abnormalities match the filter."))}</div>`}</div>`;
  $("#fM", v).onchange = e => { f.m = e.target.value; renderAbn(v); };
  $("#fS", v).onchange = e => { f.st = e.target.value; renderAbn(v); };
  $("#fV", v).onchange = e => { f.sev = e.target.value; renderAbn(v); };
  $("#newA", v).onclick = () => abnForm(null);
  $$("[data-a]", v).forEach(b => b.onclick = () => abnDetail(b.dataset.a));
}
/* stand-alone abnormality (outside a CILT run) */
function abnForm() {
  const m = curMachine(); if (!m) return;
  const o = (l, tr) => l.map(x => `<option value="${esc(x)}">${esc(tr ? T(x) : x)}</option>`).join("");
  modal(T("Report abnormality"), `<div class="grid2">
    <label>${esc(T("Machine"))}<select id="aM">${machines().map(x => `<option value="${esc(x.id)}" ${x.id === m.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></label>
    <label>${esc(T("Zone"))}<select id="aZ"></select></label>
    <label>${esc(T("Checkpoint (optional)"))}<select id="aP"></select></label>
    <label>${esc(T("Operator name"))}<input id="aO" value="${esc(UI.op || "")}"></label>
    <label>${esc(T("Category"))}<select id="aC">${o(ABN_CATS, true)}</select></label>
    <label>${esc(T("Severity"))}<select id="aS">${o(SEV, true)}</select></label>
    <label>${esc(T("Abnormality type (TPM)"))}<select id="aTt">${o(TPM_TYPES, true)}</select></label>
    <label>${esc(T("Urgency"))}<select id="aU">${o(URG, true)}</select></label></div>
    <label class="need">${esc(T("Description (required)"))}<textarea id="aD" rows="3"></textarea></label>
    <label>${esc(T("Immediate action taken"))}<textarea id="aI" rows="2"></textarea></label>
    <div class="grid2"><label>${esc(T("Support needed from"))}<select id="aDp">${o(DEPTS, true)}</select></label><label>${esc(T("Additional comments"))}<input id="aCm"></label></div>
    <label class="btn ghost">${esc(T("Add photo"))}<input type="file" id="aPh" accept="image/*" capture="environment" hidden></label><div class="photos" id="aPhs"></div>
    <button class="btn main block" id="aSave">${esc(T("Save abnormality"))}</button>`, b => {
    const photos = [];
    const fillZ = () => { const mm = M($("#aM", b).value); $("#aZ", b).innerHTML = (mm.zones || []).map(z => `<option value="${esc(z.id)}">${esc(z.id)} – ${esc(L(z.name))}</option>`).join(""); fillP(); };
    const fillP = () => { const mm = M($("#aM", b).value), z = (mm.zones || []).find(q => q.id === $("#aZ", b).value); $("#aP", b).innerHTML = `<option value="">—</option>` + ((z && z.points) || []).map(p => `<option value="${esc(p.id)}">${esc(p.id)} – ${esc(L(p.title))}</option>`).join(""); };
    $("#aM", b).onchange = fillZ; $("#aZ", b).onchange = fillP; fillZ();
    $("#aPh", b).onchange = async ev => { const f = ev.target.files[0]; if (!f) return; const data = await LIB.resizeImage(f), id = uid("PH"); await LIB.put("photo", { id, data, at: new Date().toISOString() }); PHOTO_CACHE[id] = data; photos.push(id); $("#aPhs", b).insertAdjacentHTML("beforeend", `<img src="${esc(data)}">`); ev.target.value = ""; };
    $("#aSave", b).onclick = async () => {
      const desc = $("#aD", b).value.trim(), op = $("#aO", b).value.trim();
      if (!desc) return toast("Describe the abnormality", "bad"); if (!op) return toast("Enter the operator name", "bad");
      const mm = M($("#aM", b).value), z = (mm.zones || []).find(q => q.id === $("#aZ", b).value), pid = $("#aP", b).value, p = z && (z.points || []).find(q => q.id === pid);
      const id = await nextSeq("ABN"), now = new Date().toISOString(), sev = $("#aS", b).value;
      const rec = { id, execId: null, machineId: mm.id, machineName: mm.name, zoneId: z ? z.id : "", zoneName: z ? L(z.name) : "", pointId: pid || "", pointTitle: p ? L(p.title) : "", cat: p ? p.cat : "",
        at: now, operator: op, shift: "", category: $("#aC", b).value, severity: sev, desc, immediate: $("#aI", b).value.trim(), dept: $("#aDp", b).value, comments: $("#aCm", b).value.trim(), photos,
        tpmType: $("#aTt", b).value, urgency: $("#aU", b).value, cardType: cardType($("#aC", b).value), owner: "", due: "",
        status: "Open", escalation: (/High|Critical/.test(sev) || /×/.test($("#aU", b).value)) ? "Maintenance / Engineering" : "Production Supervisor", history: [{ at: now, by: op, role: "Operator", action: "Raised", status: "Open", note: "" }] };
      await LIB.put("abn", rec); ABNS.push(rec); UI.op = op; closeModal(); toast(T("Saved as ") + id, "ok"); render();
    };
  });
}
function abnDetail(id) {
  const a = ABNS.find(x => x.id === id); if (!a) return;
  (async () => { for (const p of a.photos || []) await photoUrl(p);
  modal(a.id, `<div class="abnd sev-${a.severity}">
    <div class="grid2 ro">
      <div><i>${esc(T("Machine"))}</i>${esc(a.machineName)} (${esc(a.machineId)})</div><div><i>${esc(T("Zone"))}</i>${esc(a.zoneId)} ${esc(a.zoneName)}</div>
      <div><i>${esc(T("Checkpoint"))}</i>${esc(a.pointId)} ${esc(a.pointTitle)}</div><div><i>${esc(T("Date and time"))}</i>${sb(a.at)}</div>
      <div><i>${esc(T("Operator"))}</i>${esc(a.operator)}</div><div><i>${esc(T("Category"))}</i>${esc(T(a.category))}</div>
      <div><i>${esc(T("Severity"))}</i><b>${esc(T(a.severity))}</b></div><div><i>${esc(T("Support needed from"))}</i>${esc(T(a.dept))}</div>
      <div><i>${esc(T("Status"))}</i><b>${esc(T(a.status))}</b></div><div><i>${esc(T("Escalated to:"))}</i>${esc(T(a.escalation || ""))}</div>
      <div><i>${esc(T("Abnormality type (TPM)"))}</i>${esc(T(a.tpmType || ""))}</div><div><i>${esc(T("Card type"))}</i>${esc(T(a.cardType || cardType(a.category)))}</div>
      <div><i>${esc(T("Urgency"))}</i>${esc(T(a.urgency || ""))}</div><div><i>${esc(T("Owner / due date"))}</i>${esc(a.owner || "—")} ${a.due ? "· " + esc(a.due) : ""}</div>
    </div>
    <h5>${esc(T("Original observation (read-only)"))}</h5><p>${esc(a.desc)}</p>
    ${a.immediate ? `<p><i>${esc(T("Immediate action taken"))}:</i> ${esc(a.immediate)}</p>` : ""}${a.comments ? `<p><i>${esc(T("Additional comments"))}:</i> ${esc(a.comments)}</p>` : ""}
    <div class="photos">${(a.photos || []).map(p => `<img src="${esc(PHOTO_CACHE[p] || "")}">`).join("")}</div>
    <h5>${esc(T("History"))}</h5><ol class="hist">${a.history.map(h => `<li><b>${sb(h.at)}</b> ${esc(h.by)} (${esc(T(h.role))}) – ${esc(T(h.action))}${h.status ? " → " + esc(T(h.status)) : ""}${h.note ? `<div>${esc(h.note)}</div>` : ""}</li>`).join("")}</ol>
    <h5>${esc(T("Add update"))}</h5>
    <div class="grid2"><label>${esc(T("Your name"))}<input id="uBy" value="${esc(UI.op || "")}"></label>
      <label>${esc(T("New status"))}<select id="uSt" ${canSup() ? "" : "disabled"}><option value="">${esc(T("(no change)"))}</option>${ABN_ST.map(s => `<option>${esc(s)}</option>`).join("")}</select></label>
      <label>${esc(T("Escalate to"))}<select id="uEs"><option value="">${esc(T("(no change)"))}</option>${ESC.slice(Math.max(1, ESC.indexOf(a.escalation) + 1)).map(s => `<option value="${esc(s)}">${esc(T(s))}</option>`).join("")}</select></label>
      <label>${esc(T("Required action / note"))}<input id="uNote"></label>
      <label>${esc(T("Owner (named person)"))}<input id="uOw" value="${esc(a.owner || "")}" ${canSup() ? "" : "disabled"}></label>
      <label>${esc(T("Due date"))}<input id="uDu" type="date" value="${esc(a.due || "")}" ${canSup() ? "" : "disabled"}></label></div>
    ${canSup() ? "" : `<small class="muted">${esc(T("Status changes need the Production Supervisor or Engineer role. Operators can add notes and escalate."))}</small>`}
    <button class="btn main block" id="uSave">${esc(T("Save update"))}</button></div>`, b => {
    $("#uSave", b).onclick = async () => {
      const by = $("#uBy", b).value.trim(), st = $("#uSt", b).value, es = $("#uEs", b).value, note = $("#uNote", b).value.trim();
      const ow = $("#uOw", b).value.trim(), du = $("#uDu", b).value, owCh = canSup() && (ow !== (a.owner || "") || du !== (a.due || ""));
      if (!by) return toast("Enter your name", "bad"); if (!st && !es && !note && !owCh) return toast("Nothing to save", "bad");
      if (st && !canSup()) return toast("Your role cannot change the status", "bad");
      if (es && ESC.indexOf(es) <= ESC.indexOf(a.escalation)) return toast("Escalation can only move up", "bad");
      if ((st === "Resolved" || st === "Closed") && !note) return toast("Describe the action taken before closing", "bad");
      const h = { at: new Date().toISOString(), by, role: ROLES[ROLE], action: es ? "Escalated to " + es : st ? "Status update" : owCh ? "Owner / due date set" : "Note", status: st || "", note: [note, owCh ? `Owner: ${ow || "-"}, due: ${du || "-"}` : ""].filter(Boolean).join(" | ") };
      a.history.push(h); if (owCh) { a.owner = ow; a.due = du; } if (st) a.status = st; if (es) a.escalation = es; if (note && st) a.action = note;
      await LIB.put("abn", a); UI.op = by; closeModal(); toast("Saved", "ok"); render();
    };
  }, true); })();
}

/* ---------------- reports (section 5 + 6) ---------------- */
function renderReports(v) {
  const l = EXECS.slice().sort((a, b) => (b.start || "").localeCompare(a.start || ""));
  if (UI.rep && EXECS.find(e => e.id === UI.rep)) return renderReport(v, EXECS.find(e => e.id === UI.rep));
  v.innerHTML = `<h2 class="vt">${esc(T("CILT reports"))}</h2>
  <div class="row"><button class="btn ghost" id="abnX">${esc(T("Abnormality register (Excel)"))}</button></div>
  <div class="tw"><table class="tbl"><thead><tr><th>${esc(T("Date"))}</th><th>${esc(T("Machine"))}</th><th>${esc(T("Operator"))}</th><th>${esc(T("Shift"))}</th><th>${esc(T("Completion"))}</th><th>${esc(T("Status"))}</th></tr></thead><tbody>
  ${l.map(e => { const s = runStats(e); return `<tr class="click" data-r="${esc(e.id)}"><td>${esc(e.date)}</td><td>${esc(e.machine.name)}</td><td>${esc(e.operator)}</td><td>${esc(e.shift)}</td><td>${s.pct}%</td><td>${esc(T(e.status === "open" ? "In progress" : e.success ? "Completed" : "Completed with open items"))}</td></tr>`; }).join("") || `<tr><td colspan="6" class="empty">${esc(T("No CILT executions yet."))}</td></tr>`}
  </tbody></table></div>`;
  $$("[data-r]", v).forEach(r => r.onclick = () => { UI.rep = r.dataset.r; renderReports(v); window.scrollTo(0, 0); });
  $("#abnX", v).onclick = () => { const b = abnXlsx(ABNS); LIB.download(b, `Abnormality_Register_${today()}.xlsx`); };
}
function summaryOf(e) {
  const s = runStats(e), abns = ABNS.filter(a => a.execId === e.id), hc = abns.filter(a => /High|Critical/.test(a.severity));
  const eng = abns.filter(a => a.dept === "Maintenance" || a.dept === "Engineering");
  return { s, abns, hc, eng, o: outcome(e) };
}
function reportHtml(e) {
  const { s, abns, hc, eng, o } = summaryOf(e), m = M(e.machineId) || {};
  const unval = e.points.filter(p => p.validated === false), unappr = e.points.filter(p => !p.approved);
  const zoneSec = e.zones.map(z => {
    const zi = e.zoneInfo[z], img = zi.sitePhoto ? (PHOTO_CACHE[zi.sitePhoto] || "") : (zi.image || ""), zp = e.points.filter(p => p.zoneId === z);
    const byCat = Object.keys(CATS).filter(c => zp.some(p => p.cat === c)).map(c => `<tr class="cat"><td colspan="5" style="--cc:${CATS[c].color}">${esc(catName(c))}</td></tr>` + zp.filter(p => p.cat === c).map(p => { const r = e.results[p.id] || {};
      return `<tr class="${r.st || "pend"}"><td>${esc(p.id)}</td><td>${esc(L(p.title))}${p.validated === false ? " <em>*</em>" : ""}</td><td>${esc(r.st ? T(stLabel(p.cat, r.st)) : T("Pending"))}</td><td>${esc(r.note || "")}${r.abnRaised ? ` <b>${esc(r.abnRaised)}</b>` : ""}</td><td>${(r.photos || []).map(id => `<img class="th" src="${esc(PHOTO_CACHE[id] || "")}">`).join("")}</td></tr>`; }).join("")).join("");
    const done = zp.filter(p => (e.results[p.id] || {}).st).length;
    const zs = (e.zoneStart || {})[z], zd = e.zoneDone[z], mins = zs && zd ? Math.max(1, Math.round((new Date(zd) - new Date(zs)) / 60000)) : null;
    return `<div class="rz"><h4>${esc(z)} – ${esc(L(zi.name))} <small>${done}/${zp.length} ${esc(T("completed"))}, ${zp.length - done} ${esc(T("pending"))}${mins ? ` · ${mins} ${esc(T("min"))}` : ""}</small></h4>
      ${img ? `<img class="rzimg" src="${esc(img)}">` : ""}
      <div class="tw"><table class="tbl"><thead><tr><th>${esc(T("ID"))}</th><th>${esc(T("Checkpoint"))}</th><th>${esc(T("Result"))}</th><th>${esc(T("Operator comments"))}</th><th>${esc(T("Photos"))}</th></tr></thead><tbody>${byCat}</tbody></table></div></div>`;
  }).join("");
  const abnRows = abns.map(a => `<tr class="sev-${a.severity}"><td>${esc(a.id)}</td><td>${esc(a.zoneId)}</td><td>${esc(a.desc)}</td><td><b>${esc(T(a.severity))}</b></td><td>${esc(T(a.dept))}</td><td>${esc(T(a.status))}</td><td>${esc(a.action || a.immediate || "")}</td><td>${(a.photos || []).map(id => `<img class="th" src="${esc(PHOTO_CACHE[id] || "")}">`).join("")}</td></tr>`).join("");
  return `<div class="report">
  <header class="rh"><div><b>SERVIER</b><span>${esc(CFG.initiative || "")}</span></div><h1>${esc(T("Digital CILT Execution Report"))}</h1><div class="rid">${esc(e.id)}</div></header>
  <h3>A. ${esc(T("Execution summary"))}</h3>
  <div class="tw"><table class="kvt"><tr><th>${esc(T("Machine"))}</th><td>${esc(e.machine.name)} (${esc(e.machine.id)})</td><th>${esc(T("Model"))}</th><td>${esc(e.machine.model || "")} · ${esc(T("Serial"))} ${esc(e.machine.serial || "")}</td></tr>
    <tr><th>${esc(T("Operator"))}</th><td>${esc(e.operator)}</td><th>${esc(T("Shift"))}</th><td>${esc(e.shift)}</td></tr>
    <tr><th>${esc(T("Execution date"))}</th><td>${esc(e.date)}</td><th>${esc(T("Routines"))}</th><td>${esc(e.freqs.map(T).join(", "))}</td></tr>
    <tr><th>${esc(T("Start time"))}</th><td>${sb(e.start)}</td><th>${esc(T("Completion time"))}</th><td>${esc(e.end ? stamp(e.end) : T("In progress"))}</td></tr>
    <tr><th>${esc(T("Zones"))}</th><td>${s.zdone} / ${s.zones}</td><th>${esc(T("Checkpoints"))}</th><td>${esc(T("Completed"))} ${s.done} · ${esc(T("Not applicable"))} ${s.na} · ${esc(T("Not completed"))} ${s.nc} · ${esc(T("Pending"))} ${s.pending} / ${s.pts}</td></tr>
    <tr><th>${esc(T("Overall completion"))}</th><td><b>${s.pct}%</b></td><th>${esc(T("Final status"))}</th><td><b>${esc(T(e.status === "open" ? "In progress" : o.ok ? "Completed successfully" : "Completed with open items"))}</b></td></tr></table></div>
  ${unappr.length ? `<p class="warn sm"><b>${esc(T("DRAFT CILT standard"))}</b>: ${unappr.length}/${e.points.length} ${esc(T("checkpoints in this run are pending Servier Engineering approval."))}</p>` : ""}
  ${unval.length ? `<p class="warn sm">* ${unval.length} ${esc(T("checkpoints have a gap: the manual gives no value (quantity, torque or interval)."))}</p>` : ""}
  <h3>B. ${esc(T("Zone-by-zone report"))}</h3>${zoneSec}
  <h3>C. ${esc(T("Abnormality report"))}</h3>
  ${abns.length ? `<div class="tw"><table class="tbl"><thead><tr><th>${esc(T("ID"))}</th><th>${esc(T("Zone"))}</th><th>${esc(T("Description"))}</th><th>${esc(T("Severity"))}</th><th>${esc(T("Responsible department"))}</th><th>${esc(T("Status"))}</th><th>${esc(T("Required action"))}</th><th>${esc(T("Photos"))}</th></tr></thead><tbody>${abnRows}</tbody></table></div>` : `<p>${esc(T("No abnormalities were raised in this execution."))}</p>`}
  <h3>D. ${esc(T("Engineering support summary"))}</h3>
  ${eng.length ? `<ul class="eng">${eng.map(a => `<li class="sev-${a.severity}"><b>${esc(a.id)}</b> [${esc(T(a.severity))}] ${esc(a.zoneId)} ${esc(a.pointId)} – ${esc(a.desc)} → ${esc(T(a.dept))}</li>`).join("")}</ul>` : `<p>${esc(T("No Engineering or Maintenance intervention requested."))}</p>`}
  ${hc.length ? `<p class="bad"><b>${hc.length}</b> ${esc(T("high / critical abnormalities need attention."))}</p>` : ""}
  <h3>E. ${esc(T("Sign-off"))}</h3>
  <div class="tw"><table class="kvt"><tr><th>${esc(T("Operator"))}</th><td>${esc(e.operator)} · ${esc(e.end ? stamp(e.end) : "")}</td></tr>
  ${(e.signoff || []).map(s => `<tr><th>${esc(T(s.role))}</th><td>${esc(s.by)} · ${sb(s.at)}${s.note ? " – " + esc(s.note) : ""}</td></tr>`).join("") || `<tr><th>${esc(T("Production Supervisor"))}</th><td>${esc(T("Not signed yet"))}</td></tr>`}</table></div>
  <footer class="rf">${esc(T("Generated by Digital AM – CILT on"))} ${sb()}. ${esc(T("Technical values come from the machine documentation referenced in the app."))}</footer></div>`;
}
async function renderReport(v, e) {
  for (const z of e.zones) if (e.zoneInfo[z].sitePhoto) await photoUrl(e.zoneInfo[z].sitePhoto);
  for (const r of Object.values(e.results)) for (const p of (r.photos || [])) await photoUrl(p);
  for (const a of ABNS.filter(x => x.execId === e.id)) for (const p of a.photos || []) await photoUrl(p);
  v.innerHTML = `<div class="row noprint"><button class="btn ghost" id="rBack">${esc(T("All reports"))}</button>
    <button class="btn main" id="rPdf">${esc(T("PDF / Print"))}</button><button class="btn ghost" id="rX">${esc(T("Excel"))}</button>
    <button class="btn ghost" id="rCsv">${esc(T("CSV"))}</button><button class="btn ghost" id="rMail">${esc(T("Email"))}</button>
    ${e.status === "submitted" && canSup() && !(e.signoff || []).some(x => x.role === ROLES[ROLE]) ? `<button class="btn ghost" id="rSign">${esc(T("Sign off as"))} ${esc(T(ROLES[ROLE]))}</button>` : ""}</div>` + reportHtml(e);
  const sg = $("#rSign", v); if (sg) sg.onclick = async () => { const by = prompt(T("Your name")); if (!by || !by.trim()) return; const note = prompt(T("Comment (optional)")) || "";
    (e.signoff = e.signoff || []).push({ at: new Date().toISOString(), by: by.trim(), role: ROLES[ROLE], note: note.trim() }); await LIB.put("exec", e); toast("Signed", "ok"); renderReport(v, e); };
  $("#rBack", v).onclick = () => { UI.rep = null; renderReports(v); };
  $("#rPdf", v).onclick = () => { toast("Choose 'Save as PDF' in the print dialog"); setTimeout(() => window.print(), 300); };
  $("#rX", v).onclick = () => LIB.download(execXlsx(e), fileBase(e) + ".xlsx");
  $("#rCsv", v).onclick = () => { const x = execRows(e); LIB.download(LIB.csv(x.head, x.rows), fileBase(e) + ".csv"); };
  $("#rMail", v).onclick = () => emailDialog(e);
}
const fileBase = e => `CILT_${e.machine.id}_${e.date}_${e.id.slice(-4)}`;
function execRows(e) {
  const head = ["Execution ID", "Machine ID", "Machine", "Date", "Shift", "Operator", "Zone", "Zone name", "Checkpoint ID", "Category", "Checkpoint", "Frequency", "Result", "Comment", "Abnormality ID", "Reading", "Mandatory", "Sourced from manual (complete)", "Engineering approval", "Reference", "Recorded at"];
  const rows = e.points.map(p => { const r = e.results[p.id] || {}; return [e.id, e.machine.id, e.machine.name, e.date, e.shift, e.operator, p.zoneId, L(e.zoneInfo[p.zoneId].name), p.id, CATS[p.cat].name, L(p.title), p.frequency || "", r.st ? stLabel(p.cat, r.st) : "Pending", r.note || "", r.abnRaised || "", r.value ?? "", p.mandatory === false ? "No" : "Yes", p.validated === false ? "No – gap" : "Yes", p.approved ? p.approved.by + " " + stamp(p.approved.at) : "Pending", p.ref || "", r.at ? stamp(r.at) : ""]; });
  return { head, rows };
}
function abnSheet(list) {
  return { name: "Abnormalities", title: "Abnormality register", sub: "Original operator observations are kept unchanged; updates are in the History column.", sev: 8,
    head: ["Abnormality ID", "Date", "Machine", "Zone", "Checkpoint", "Operator", "Category", "Description", "Severity", "Immediate action", "Support department", "Escalated to", "Status", "Required action", "Photos", "TPM type", "Card type", "Urgency", "Owner", "Due date", "History"],
    widths: [16, 16, 22, 10, 12, 16, 14, 40, 10, 30, 16, 22, 14, 30, 8, 22, 18, 20, 16, 12, 50],
    rows: list.map(a => [a.id, stamp(a.at), a.machineName, a.zoneId, a.pointId, a.operator, a.category, a.desc, a.severity, a.immediate, a.dept, a.escalation || "", a.status, a.action || "", (a.photos || []).length, a.tpmType || "", a.cardType || cardType(a.category), a.urgency || "", a.owner || "", a.due || "", a.history.map(h => `${stamp(h.at)} ${h.by}: ${h.action}${h.status ? " → " + h.status : ""}${h.note ? " – " + h.note : ""}`).join("\n")]) };
}
function execXlsx(e) {
  const { s, abns, eng, o } = summaryOf(e), x = execRows(e);
  const sum = { name: "Summary", title: "Digital CILT Execution Report – " + e.machine.id + " – " + e.date, sub: CFG.initiative || "", head: ["Item", "Value"], widths: [32, 60],
    rows: [["Execution ID", e.id], ["Machine", e.machine.name + " (" + e.machine.id + ")"], ["Model / Serial", (e.machine.model || "") + " / " + (e.machine.serial || "")], ["Operator", e.operator], ["Shift", e.shift], ["Execution date", e.date], ["Routines", e.freqs.join(", ")],
      ["Start time", stamp(e.start)], ["Completion time", e.end ? stamp(e.end) : "In progress"], ["Total zones", s.zones], ["Completed zones", s.zdone], ["Total checkpoints", s.pts], ["Completed checkpoints", s.done], ["Not applicable / not required", s.na], ["Not completed", s.nc], ["Pending", s.pending],
      ["Overall completion %", s.pct], ["Abnormalities", abns.length], ["Engineering / Maintenance support", eng.length], ["Final status", e.status === "open" ? "In progress" : o.ok ? "Completed successfully" : "Completed with open items"]] };
  const pts = { name: "Checkpoints", title: "Zone-by-zone results", sub: "Sourced from manual = No means the manual gives no value for part of it. Engineering approval = Pending means DRAFT standard.", head: x.head, rows: x.rows, widths: [16, 12, 22, 11, 10, 16, 7, 22, 11, 11, 40, 14, 22, 30, 15, 10, 9, 13, 18, 26, 16] };
  return LIB.xlsx([sum, pts, abnSheet(abns)]);
}
const abnXlsx = list => LIB.xlsx([abnSheet(list.slice().sort((a, b) => a.at.localeCompare(b.at)))]);
function emailDialog(e) {
  const { s, abns, hc, eng, o } = summaryOf(e), lists = CFG.lists || [];
  const subject = `Digital CILT Execution Report – ${e.machine.id} – ${e.date}`;
  const body = () => [`Machine: ${e.machine.name} (${e.machine.id})`, `Operator: ${e.operator} – ${e.shift} – ${e.date}`,
    `CILT status: ${e.status === "open" ? "In progress" : o.ok ? "Completed successfully" : "Completed with open items"}`, `Overall completion: ${s.pct}% (completed ${s.done}, N/A ${s.na}, not completed ${s.nc}, pending ${s.pending} of ${s.pts}; ${s.zdone}/${s.zones} zones)`,
    `Abnormalities: ${abns.length} (high/critical: ${hc.length})`, `Engineering / Maintenance support required: ${eng.length ? eng.map(a => a.id + " " + a.severity).join(", ") : "None"}`,
    "", ($("#mMsg") && $("#mMsg").value) || "", "", "The full report is attached (Excel). Sent from Digital AM – CILT."].join("\n");
  modal(T("Email the report"), `<p class="muted">${esc(T("The app does not send email itself. It prepares the report file and opens your email app with the summary. Attach the downloaded file before you send."))}</p>
    <label>${esc(T("Distribution list"))}<select id="mL">${lists.map(l => `<option value="${esc(l.id)}">${esc(l.name)}</option>`).join("")}</select></label>
    <div id="mR"></div><label>${esc(T("Message"))}<textarea id="mMsg" rows="2"></textarea></label>
    <div class="kvt sm"><b>${esc(T("Subject"))}:</b> ${esc(subject)}</div>
    <div class="row"><button class="btn main" id="mShare">${esc(T("Share report file"))}</button><button class="btn ghost" id="mDraft">${esc(T("Download file + open email draft"))}</button></div>`, b => {
    const fillR = () => { const l = lists.find(x => x.id === $("#mL", b).value) || { members: [] };
      $("#mR", b).innerHTML = l.members.map((m, i) => `<label class="check"><input type="checkbox" data-em="${esc(m.email)}" ${m.email ? "checked" : "disabled"}> ${esc(m.role)} ${m.email ? "&lt;" + esc(m.email) + "&gt;" : `<small class="muted">(${esc(T("no email set — Admin"))})</small>`}</label>`).join("") || `<p class="muted">${esc(T("No recipients. Add them in Admin → Distribution lists."))}</p>`; };
    if (lists.length) { $("#mL", b).onchange = fillR; fillR(); }
    const to = () => $$("[data-em]:checked", b).map(x => x.dataset.em).filter(Boolean);
    $("#mShare", b).onclick = async () => { const r = await LIB.share(execXlsx(e), fileBase(e) + ".xlsx", subject); if (r === "downloaded") toast("Sharing files is not supported here. The file was downloaded."); };
    $("#mDraft", b).onclick = () => {
      const rc = to(); LIB.download(execXlsx(e), fileBase(e) + ".xlsx");
      const href = `mailto:${rc.map(x => encodeURIComponent(x).replace(/%40/g, "@")).join(",")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body())}`;
      setTimeout(() => { location.href = href; }, 600); e.log.push({ at: new Date().toISOString(), by: ROLES[ROLE], a: "email draft to " + (rc.join(", ") || "(none)") }); LIB.put("exec", e);
    };
  });
}

/* ---------------- admin (section 7) ---------------- */
function renderAdmin(v) {
  if (!canEng()) { v.innerHTML = `<div class="empty">${esc(T("Engineer role required."))}</div>`; return; }
  const tab = UI.at || (UI.at = "machines");
  const tabs = [["machines", "Machines & zones"], ["manuals", "Manuals & documents"], ["people", "Operators & shifts"], ["lists", "Distribution lists"], ["settings", "Settings & backup"]];
  const defPins = CFG.pins && (CFG.pins.engineer === "0000" || CFG.pins.supervisor === "1111");
  v.innerHTML = `<h2 class="vt">${esc(T("Administration"))}</h2>${defPins ? `<div class="warn bad">${esc(T("Default PINs are still active. Change them in Settings & backup before real use."))}</div>` : ""}${CFG.seedPending ? `<div class="warn">${esc(T("A newer machine data set is available in this app version. Your edited configuration was kept."))} <button class="btn ghost sm" id="seedNow">${esc(T("Load the new data set (replaces machine edits)"))}</button></div>` : ""}
  <div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${tab === k ? "on" : ""}" data-at="${k}"><span>${esc(T(l))}</span></button>`).join("")}</div><div id="adm"></div>`;
  $$("[data-at]", v).forEach(b => b.onclick = () => { UI.at = b.dataset.at; renderAdmin(v); });
  const sn = $("#seedNow", v); if (sn) sn.onclick = async () => { if (!confirm(T("Replace all machine configuration with the app's data set?"))) return; CFG.machines = JSON.parse(JSON.stringify(window.CILT_SEED.machines)); CFG.seedVersion = window.CILT_SEED.version; CFG.edited = false; delete CFG.seedPending; await saveCfg(); render(); };
  const a = $("#adm", v);
  ({ machines: admMachines, manuals: admManuals, people: admPeople, lists: admLists, settings: admSettings })[tab](a);
}
const lines = arr => (arr || []).map(x => typeof x === "string" ? x : (x.en || "") + (x.ar ? " | " + x.ar : "")).join("\n");
const unlines = s => s.split("\n").map(x => x.trim()).filter(Boolean).map(x => { const [en, ar] = x.split("|").map(y => y.trim()); return { en, ar: ar || "" }; });
const bi = (o, k) => (o && o[k]) || "";
async function edited() { CFG.edited = true; await saveCfg(); }
function admMachines(a) {
  const m = M(UI.am) || curMachine(); UI.am = m && m.id;
  a.innerHTML = `<div class="row"><select id="amSel">${machines().map(x => `<option value="${esc(x.id)}" ${m && x.id === m.id ? "selected" : ""}>${esc(x.name)} (${esc(x.id)})</option>`).join("")}</select>
    <button class="btn ghost" id="amNew">${esc(T("Add machine"))}</button>${m ? `<button class="btn ghost" id="amDel">${esc(T("Delete machine"))}</button>` : ""}</div>
  ${m ? `<section class="card"><h3>${esc(T("Machine identification"))}</h3><div class="grid3">
    ${[["id", "Machine ID"], ["name", "Machine name"], ["type", "Type"], ["model", "Model"], ["serial", "Serial number"], ["manufacturer", "Manufacturer"], ["area", "Production area"]].map(([k, l]) => `<label>${esc(T(l))}<input data-mf="${k}" value="${esc(m[k] || "")}" ${k === "id" ? "disabled" : ""}></label>`).join("")}
  </div>
  <label>${esc(T("General safety precautions (one per line, English | Arabic)"))}<textarea data-mf="safety" rows="4">${esc(lines(m.safety))}</textarea></label>
  <h4>${esc(T("Approved lubricants"))}</h4>${(m.lubricants || []).map((l, i) => `<div class="grid3"><label>ID<input data-lub="${i}" data-k="id" value="${esc(l.id)}"></label><label>${esc(T("Name"))}<input data-lub="${i}" data-k="name" value="${esc(l.name)}"></label><label>${esc(T("Specification / reference"))}<input data-lub="${i}" data-k="spec" value="${esc((l.spec || "") + (l.ref && !(l.spec || "").includes(l.ref) ? "" : ""))}"></label></div>`).join("")}
  <button class="btn ghost sm" id="lubAdd">${esc(T("Add lubricant"))}</button></section>
  <section class="card"><h3>${esc(T("Zones"))}</h3><div class="zlist">${(m.zones || []).map((z, i) => `<div class="zrow"><b>${esc(z.id)}</b><span>${esc(L(z.name))}</span><small>${(z.points || []).length} ${esc(T("checkpoints"))}</small>
    <button class="btn ghost sm" data-ze="${i}">${esc(T("Edit"))}</button><button class="btn ghost sm" data-zu="${i}" ${i === 0 ? "disabled" : ""}>↑</button><button class="btn ghost sm" data-zd="${i}">✕</button></div>`).join("")}</div>
  <button class="btn main" id="zAdd">${esc(T("Add zone"))}</button></section>` : ""}`;
  $("#amSel", a).onchange = e => { UI.am = e.target.value; admMachines(a); };
  $("#amNew", a).onclick = async () => { const id = prompt(T("New machine ID (e.g. P4-787018)")); if (!id) return; if (M(id)) return toast("ID already exists", "bad");
    CFG.machines.push({ id: id.trim(), name: id.trim(), type: "", model: "", serial: "", manufacturer: "", area: CFG.area, manuals: [], safety: [], lubricants: [], zones: [] }); UI.am = id.trim(); await edited(); admMachines(a); };
  if (!m) return;
  const del = $("#amDel", a); if (del) del.onclick = async () => { if (!confirm(T("Delete this machine and its zones? Past reports are kept."))) return; CFG.machines = CFG.machines.filter(x => x.id !== m.id); UI.am = null; if (CFG.curMachine === m.id) CFG.curMachine = (CFG.machines[0] || {}).id; await edited(); admMachines(a); };
  $$("[data-mf]", a).forEach(i => i.onchange = async () => { const k = i.dataset.mf; m[k] = k === "safety" ? unlines(i.value) : i.value.trim(); await edited(); toast("Saved", "ok"); });
  $$("[data-lub]", a).forEach(i => i.onchange = async () => { m.lubricants[+i.dataset.lub][i.dataset.k] = i.value.trim(); await edited(); toast("Saved", "ok"); });
  $("#lubAdd", a).onclick = async () => { (m.lubricants = m.lubricants || []).push({ id: "LUB" + ((m.lubricants || []).length + 1), name: "", spec: "" }); await edited(); admMachines(a); };
  $("#zAdd", a).onclick = async () => { let n = (m.zones || []).length + 1, id; do { id = "Z" + String(n++).padStart(2, "0"); } while ((m.zones || []).some(q => q.id === id)); (m.zones = m.zones || []).push({ id, name: { en: "New zone", ar: "" }, desc: { en: "", ar: "" }, safety: [], tools: [], points: [] }); await edited(); zoneEditor(m, m.zones.length - 1, () => admMachines(a)); };
  $$("[data-ze]", a).forEach(b => b.onclick = () => zoneEditor(m, +b.dataset.ze, () => admMachines(a)));
  $$("[data-zu]", a).forEach(b => b.onclick = async () => { const i = +b.dataset.zu; [m.zones[i - 1], m.zones[i]] = [m.zones[i], m.zones[i - 1]]; await edited(); admMachines(a); });
  $$("[data-zd]", a).forEach(b => b.onclick = async () => { const i = +b.dataset.zd; if (!confirm(T("Delete zone ") + m.zones[i].id + "?")) return; m.zones.splice(i, 1); await edited(); admMachines(a); });
}
function zoneEditor(m, zi, done) {
  const z = m.zones[zi]; let placing = null;
  const draw = async () => {
    if (z.sitePhoto) await photoUrl(z.sitePhoto);
    const img = zoneImg(z);
    modal(`${m.id} · ${z.id}`, `<div class="grid2">
      <label>${esc(T("Zone ID"))}<input id="zId" value="${esc(z.id)}"></label><label>${esc(T("Picture reference"))}<input id="zRef" value="${esc(z.imageRef || "")}"></label>
      <label>${esc(T("Zone name (English)"))}<input id="zNe" value="${esc(bi(z.name, "en"))}"></label><label>${esc(T("Zone name (Arabic)"))}<input id="zNa" dir="rtl" value="${esc(bi(z.name, "ar"))}"></label>
      <label>${esc(T("Description (English)"))}<textarea id="zDe" rows="2">${esc(bi(z.desc, "en"))}</textarea></label><label>${esc(T("Description (Arabic)"))}<textarea id="zDa" dir="rtl" rows="2">${esc(bi(z.desc, "ar"))}</textarea></label>
      <label>${esc(T("Safety precautions (English | Arabic, one per line)"))}<textarea id="zS" rows="3">${esc(lines(z.safety))}</textarea></label>
      <label>${esc(T("Tools and materials (English | Arabic, one per line)"))}<textarea id="zT" rows="3">${esc(lines(z.tools))}</textarea></label></div>
      <h4>${esc(T("Zone picture and inspection markers"))}</h4>
      <div class="row"><label class="btn ghost sm">${esc(T("Upload site photo"))}<input type="file" id="zPh" accept="image/*" hidden></label>${z.sitePhoto ? `<button class="btn ghost sm" id="zPhX">${esc(T("Back to manual picture"))}</button>` : ""}
        <span class="muted sm">${placing ? esc(T("Tap the picture to place marker for ")) + esc(placing) : esc(T("Choose 'Place' on a checkpoint, then tap the picture."))}</span></div>
      <div class="zimg edit" id="zImg">${img ? `<img src="${esc(img)}">` : `<div class="noimg">${esc(T("No picture"))}</div>`}${(z.points || []).filter(p => p.marker).map(p => `<span class="mk" style="left:${p.marker.x * 100}%;top:${p.marker.y * 100}%;--cc:${CATS[p.cat].color}">${esc(p.id.split("-").pop())}</span>`).join("")}</div>
      <h4>${esc(T("Checkpoints"))}</h4>
      <div class="tw"><table class="tbl"><tbody>${(z.points || []).map((p, i) => `<tr><td><b>${esc(p.id)}</b></td><td style="color:${CATS[p.cat].color}">${esc(catName(p.cat))}</td><td>${esc(L(p.title))}${p.validated === false ? ` <span class="badge warnb">${esc(T("not validated"))}</span>` : ""}</td>
        <td class="nowrap"><button class="btn ghost sm" data-pe="${i}">${esc(T("Edit"))}</button><button class="btn ghost sm" data-pm="${i}">${esc(T("Place"))}</button><button class="btn ghost sm" data-pd="${i}">✕</button></td></tr>`).join("")}</tbody></table></div>
      <div class="row"><button class="btn ghost" id="pAdd">${esc(T("Add checkpoint"))}</button><button class="btn main" id="zSave">${esc(T("Save zone"))}</button></div>`, b => {
      const saveFields = () => {
        const nid = $("#zId", b).value.trim();
        if (nid && nid !== z.id) { if (m.zones.some(q => q.id === nid)) { $("#zId", b).value = z.id; toast("Zone ID already exists – kept the old ID", "bad"); return false; } z.id = nid; }
        z.imageRef = $("#zRef", b).value.trim(); z.name = { en: $("#zNe", b).value.trim(), ar: $("#zNa", b).value.trim() }; z.desc = { en: $("#zDe", b).value.trim(), ar: $("#zDa", b).value.trim() };
        z.safety = unlines($("#zS", b).value); z.tools = unlines($("#zT", b).value);
      };
      $("#zSave", b).onclick = async () => { if (saveFields() === false) return; await edited(); closeModal(); toast("Saved", "ok"); done(); };
      $("#zPh", b).onchange = async ev => { const f = ev.target.files[0]; if (!f) return; saveFields(); const data = await LIB.resizeImage(f, 1400, 0.78), id = uid("PH"); await LIB.put("photo", { id, data, at: new Date().toISOString() }); PHOTO_CACHE[id] = data; z.sitePhoto = id; await edited(); toast("Site photo added. Check the marker positions.", "ok"); draw(); };
      const px = $("#zPhX", b); if (px) px.onclick = async () => { saveFields(); z.sitePhoto = null; await edited(); draw(); };
      $("#zImg", b).onclick = async ev => { if (!placing) return; const im = $("#zImg img", b); if (!im) return; const r = im.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)), y = Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height));
        const p = z.points.find(q => q.id === placing); if (p) p.marker = { x: +x.toFixed(3), y: +y.toFixed(3) }; saveFields(); placing = null; await edited(); draw(); };
      $$("[data-pm]", b).forEach(x => x.onclick = () => { saveFields(); placing = z.points[+x.dataset.pm].id; draw(); });
      $$("[data-pd]", b).forEach(x => x.onclick = async () => { if (!confirm(T("Delete checkpoint?"))) return; saveFields(); z.points.splice(+x.dataset.pd, 1); await edited(); draw(); });
      $$("[data-pe]", b).forEach(x => x.onclick = () => { saveFields(); pointEditor(m, z, +x.dataset.pe, draw); });
      $("#pAdd", b).onclick = () => { saveFields(); const ids = new Set(pointsOf(m).map(q => q.id)); let n = 1, id; do { id = `${z.id}-C${String(n++).padStart(2, "0")}`; } while (ids.has(id)); pointEditor(m, z, -1, draw, { id, cat: "C", title: { en: "", ar: "" }, instruction: { en: "", ar: "" }, mandatory: true, validated: false, note: "New checkpoint – to be validated by Engineering" }); };
    }, true);
  };
  draw();
}
function pointEditor(m, z, pi, back, tmpl) {
  const orig = pi >= 0 ? z.points[pi] : null, p = JSON.parse(JSON.stringify(orig || tmpl)), f = (k, l, ta, dir) => `<label>${esc(T(l))}${ta ? `<textarea data-pf="${k}" rows="2" ${dir ? 'dir="rtl"' : ""}>` : `<input data-pf="${k}" ${dir ? 'dir="rtl"' : ""} value="`}${esc(k.includes(".") ? bi(p[k.split(".")[0]], k.split(".")[1]) : (p[k] == null ? "" : p[k]))}${ta ? "</textarea>" : `">`}</label>`;
  modal(`${T("Checkpoint")} ${p.id}`, `<div class="grid2">
    ${f("id", "Checkpoint ID")}<label>${esc(T("CILT category"))}<select data-pf="cat">${Object.keys(CATS).map(c => `<option value="${c}" ${p.cat === c ? "selected" : ""}>${esc(catName(c))}</option>`).join("")}</select></label>
    ${f("title.en", "Title (English)")}${f("title.ar", "Title (Arabic)", 0, 1)}
    ${f("instruction.en", "Instruction (English)", 1)}${f("instruction.ar", "Instruction (Arabic)", 1, 1)}
    ${f("material.en", "Material / tool (English)")}${f("material.ar", "Material / tool (Arabic)", 0, 1)}
    ${f("criteria.en", "Acceptance criteria / normal condition (English)", 1)}${f("criteria.ar", "Acceptance criteria (Arabic)", 1, 1)}
    ${f("frequency", "Frequency (as in the manual)")}${f("ref", "Technical reference (document, page)")}
    <label>${esc(T("Lubricant"))}<select data-pf="lubricantId"><option value="">—</option>${(m.lubricants || []).map(l => `<option value="${esc(l.id)}" ${p.lubricantId === l.id ? "selected" : ""}>${esc(l.name)}</option>`).join("")}</select></label>
    <label>${esc(T("Lubrication method"))}<select data-pf="method"><option value="">—</option>${["oil", "grease", "manual", "automatic"].map(x => `<option ${p.method === x ? "selected" : ""}>${x}</option>`).join("")}</select></label>
    ${f("quantity", "Quantity (from manual only)")}${f("torque", "Torque (from manual only)")}
    ${f("minutes", "Planned time (min)")}<label>${esc(T("Machine state"))}<select data-pf="machineState"><option value="">—</option><option value="stopped" ${p.machineState === "stopped" ? "selected" : ""}>${esc(T("Stopped"))}</option><option value="running" ${p.machineState === "running" ? "selected" : ""}>${esc(T("Running"))}</option></select></label>
    <label>${esc(T("Routine"))}<select data-pf="routine"><option value="">${esc(T("Automatic (from frequency)"))}</option>${ROUTINE_ORDER.map(r => `<option value="${esc(r)}" ${p.routine === r ? "selected" : ""}>${esc(T(r))}</option>`).join("")}</select></label>
    <label>${esc(T("Done by"))}<select data-pf="role"><option value="">${esc(T("Operator (AM)"))}</option><option value="maintenance" ${p.role === "maintenance" ? "selected" : ""}>${esc(T("Maintenance only"))}</option></select></label>
    ${f("inform", "Person to inform")}<label>${esc(T("Reading: unit | min | max (empty = no reading)"))}<input data-pf="readingStr" value="${esc(p.reading ? [p.reading.unit || "", p.reading.min ?? "", p.reading.max ?? ""].join(" | ") : "")}"></label>
  </div>
  <label>${esc(T("Abnormal conditions to look for (English | Arabic, one per line)"))}<textarea data-pf="abnormal" rows="3">${esc(lines(p.abnormal))}</textarea></label>
  ${f("note", "Engineering note", 1)}
  <div class="row"><label class="check"><input type="checkbox" data-pf="mandatory" ${p.mandatory !== false ? "checked" : ""}> ${esc(T("Mandatory"))}</label>
    <label class="check"><input type="checkbox" data-pf="validated" ${p.validated !== false ? "checked" : ""}> ${esc(T("Complete in manual (no gap)"))}</label>
    <label class="check"><input type="checkbox" data-pf="approveBox" ${p.approved ? "checked" : ""}> ${esc(T("Approved by Engineering"))} ${p.approved ? `<small>(${esc(p.approved.by)} ${sb(p.approved.at)})</small>` : ""}</label>
    <label class="check"><input type="checkbox" data-pf="allowTighten" ${p.allowTighten ? "checked" : ""}> ${esc(T("Operator may tighten (approved WI exists)"))}</label>
    <label class="check"><input type="checkbox" data-pf="demo" ${p.demo ? "checked" : ""}> DEMO DATA</label></div>
  <div class="row"><button class="btn ghost" id="pBack">${esc(T("Cancel"))}</button><button class="btn main" id="pSave">${esc(T("Save checkpoint"))}</button></div>`, b => {
    $("#pBack", b).onclick = back;
    $("#pSave", b).onclick = async () => {
      $$("[data-pf]", b).forEach(i => { const k = i.dataset.pf;
        if (k === "approveBox") { if (!i.checked) p.approved = null; else if (!p.approved) { const by = (prompt(T("Approved by (your name)")) || "").trim(); p.approved = by ? { by, at: new Date().toISOString() } : null; } return; }
        if (i.type === "checkbox") p[k] = i.checked;
        else if (k === "abnormal") p.abnormal = unlines(i.value);
        else if (k === "readingStr") { const [u, mn, mx] = i.value.split("|").map(x => (x || "").trim()); p.reading = i.value.trim() ? { unit: u || "", min: mn === "" || mn == null ? null : +mn, max: mx === "" || mx == null ? null : +mx } : null; }
        else if (k.includes(".")) { const [a, c] = k.split("."); p[a] = Object.assign({}, typeof p[a] === "object" && p[a] ? p[a] : {}, { [c]: i.value.trim() }); }
        else p[k] = i.value.trim() || null; });
      if (!p.id || !/^[A-Za-z0-9_.-]{1,40}$/.test(p.id)) return toast("Checkpoint ID is required (letters, digits, - _ .)", "bad");
      if (pointsOf(m).some(q => q.id === p.id && q !== orig && !(orig && q.id === orig.id && q.zoneId === z.id))) return toast("Checkpoint ID already used on this machine", "bad");
      if (!CATS[p.cat]) return toast("Choose a CILT category", "bad");
      if (!L(p.title)) return toast("Give the checkpoint a title", "bad");
      if (p.approved && !p.approved.by) p.approved = null;
      if (orig) { Object.keys(orig).forEach(k => delete orig[k]); Object.assign(orig, p); } else (z.points = z.points || []).push(p);
      await edited(); toast("Saved", "ok"); back();
    };
  }, true);
}
async function admManuals(a) {
  const files = await LIB.all("file"), m = M(UI.am) || curMachine();
  a.innerHTML = `<section class="card"><div class="row"><select id="fM">${machines().map(x => `<option value="${esc(x.id)}" ${m && x.id === m.id ? "selected" : ""}>${esc(x.name)} (${esc(x.id)})</option>`).join("")}</select></div><h3>${esc(T("Documents for"))} ${esc(m ? m.name : "")}</h3>
    <p class="muted">${esc(T("Upload the PDF manuals, drawings, lubrication diagrams, and instructions. Files stay on this device. The reference list shows the documents the checkpoint references come from."))}</p>
    <div class="grid3"><label>${esc(T("Title"))}<input id="fT"></label><label>${esc(T("Type"))}<select id="fK">${["Operator manual", "Service manual", "Drawing", "Lubrication diagram", "Photo", "Work instruction", "Other"].map(x => `<option>${esc(T(x))}</option>`).join("")}</select></label>
    <label class="btn main">${esc(T("Upload file"))}<input type="file" id="fF" accept=".pdf,image/*" hidden></label></div>
    <div class="tw"><table class="tbl"><tbody>${files.filter(f => f.machineId === (m || {}).id).map(f => `<tr><td>${esc(f.title)}</td><td>${esc(f.kind)}</td><td>${esc(f.name)} · ${Math.round(f.size / 1024)} KB</td><td class="nowrap"><button class="btn ghost sm" data-fo="${esc(f.id)}">${esc(T("Open"))}</button><button class="btn ghost sm" data-fd="${esc(f.id)}">✕</button></td></tr>`).join("") || `<tr><td class="muted">${esc(T("No files uploaded yet."))}</td></tr>`}</tbody></table></div></section>
    <section class="card"><h3>${esc(T("Reference documents (site copies)"))}</h3><ul>${((m || {}).manuals || []).map(d => `<li>${esc(d.title || d.file)} <small class="muted">${esc(d.file || "")}</small></li>`).join("") || `<li class="muted">—</li>`}</ul></section>`;
  $("#fM", a).onchange = e => { UI.am = e.target.value; admManuals(a); };
  $("#fF", a).onchange = async ev => { const f = ev.target.files[0]; ev.target.value = ""; if (!f) return; if (f.size > 60e6) return toast("File too large (max 60 MB)", "bad");
    const t = await sniffType(f); if (!t) return toast("Only PDF and image files are accepted", "bad");
    await LIB.put("file", { id: uid("DOC"), machineId: m.id, title: $("#fT", a).value.trim() || f.name, kind: $("#fK", a).value, name: f.name, type: t, size: f.size, blob: new Blob([f], { type: t }), at: new Date().toISOString() }); toast("Uploaded", "ok"); admManuals(a); };
  $$("[data-fo]", a).forEach(b => b.onclick = () => openDoc(b.dataset.fo));
  $$("[data-fd]", a).forEach(b => b.onclick = async () => { if (!confirm(T("Delete this file?"))) return; await LIB.del("file", b.dataset.fd); admManuals(a); });
}
function admPeople(a) {
  a.innerHTML = `<section class="card"><label>${esc(T("Operators (one per line)"))}<textarea id="ops" rows="6">${esc((CFG.operators || []).join("\n"))}</textarea></label>
    <label>${esc(T("Shifts (one per line)"))}<textarea id="shs" rows="3">${esc((CFG.shifts || []).join("\n"))}</textarea></label>
    <button class="btn main" id="pplSave">${esc(T("Save"))}</button></section>`;
  $("#pplSave", a).onclick = async () => { CFG.operators = $("#ops", a).value.split("\n").map(x => x.trim()).filter(Boolean); CFG.shifts = $("#shs", a).value.split("\n").map(x => x.trim()).filter(Boolean); if (!CFG.shifts.length) CFG.shifts = ["Shift A"]; await saveCfg(); toast("Saved", "ok"); };
}
function admLists(a) {
  a.innerHTML = (CFG.lists || []).map((l, i) => `<section class="card"><div class="row"><input data-ln="${i}" value="${esc(l.name)}"><button class="btn ghost sm" data-ld="${i}">✕</button></div>
    ${l.members.map((mm, j) => `<div class="grid3"><input data-mr="${i}.${j}" placeholder="${esc(T("Role"))}" value="${esc(mm.role)}"><input data-me="${i}.${j}" type="email" placeholder="name@servier.com" value="${esc(mm.email)}"><button class="btn ghost sm" data-mx="${i}.${j}">✕</button></div>`).join("")}
    <button class="btn ghost sm" data-ma="${i}">${esc(T("Add recipient"))}</button></section>`).join("") + `<button class="btn main" id="lAdd">${esc(T("Add list"))}</button>`;
  const sv = async () => { await saveCfg(); toast("Saved", "ok"); };
  $$("[data-ln]", a).forEach(x => x.onchange = () => { CFG.lists[+x.dataset.ln].name = x.value.trim(); sv(); });
  $$("[data-mr]", a).forEach(x => x.onchange = () => { const [i, j] = x.dataset.mr.split(".").map(Number); CFG.lists[i].members[j].role = x.value.trim(); sv(); });
  $$("[data-me]", a).forEach(x => x.onchange = () => { const [i, j] = x.dataset.me.split(".").map(Number); const v = x.value.trim(); if (v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return toast("Invalid email", "bad"); CFG.lists[i].members[j].email = v; sv(); });
  $$("[data-mx]", a).forEach(x => x.onclick = () => { const [i, j] = x.dataset.mx.split(".").map(Number); CFG.lists[i].members.splice(j, 1); sv(); admLists(a); });
  $$("[data-ma]", a).forEach(x => x.onclick = () => { CFG.lists[+x.dataset.ma].members.push({ role: "", email: "" }); sv(); admLists(a); });
  $$("[data-ld]", a).forEach(x => x.onclick = () => { if (!confirm(T("Delete this list?"))) return; CFG.lists.splice(+x.dataset.ld, 1); sv(); admLists(a); });
  $("#lAdd", a).onclick = () => { (CFG.lists = CFG.lists || []).push({ id: uid("L"), name: "New list", members: [] }); sv(); admLists(a); };
}
function admSettings(a) {
  a.innerHTML = `<section class="card"><div class="grid2">
    <label>${esc(T("TPM initiative name"))}<input id="sI" value="${esc(CFG.initiative || "")}"></label><label>${esc(T("Default production area"))}<input id="sA" value="${esc(CFG.area || "")}"></label>
    <label>${esc(T("Supervisor PIN"))}<input id="sPs" type="password" inputmode="numeric" autocomplete="off" value="${esc(CFG.pins.supervisor)}"></label><label>${esc(T("Engineer PIN"))}<input id="sPe" type="password" inputmode="numeric" autocomplete="off" value="${esc(CFG.pins.engineer)}"></label></div>
    <button class="btn main" id="sSave">${esc(T("Save"))}</button></section>
  <section class="card"><h3>${esc(T("Backup"))}</h3><p class="muted">${esc(T("All data lives in this browser on this device. Export a backup regularly."))}</p>
    <div class="row"><button class="btn ghost" id="bOut">${esc(T("Export backup (JSON, with photos)"))}</button><label class="btn ghost">${esc(T("Import backup"))}<input type="file" id="bIn" accept=".json,application/json" hidden></label>
    <button class="btn ghost" id="cfgOut">${esc(T("Export machine configuration only"))}</button></div></section>
  <section class="card"><h3>${esc(T("Data set"))}</h3><p class="muted">${esc(T("App data set version"))}: ${esc((window.CILT_SEED || {}).version || "")} · ${esc(T("in use"))}: ${esc(CFG.seedVersion || "")}${CFG.edited ? " (" + esc(T("edited")) + ")" : ""}</p>
    <button class="btn ghost" id="reseed">${esc(T("Reset machines to the app data set"))}</button></section>`;
  $("#sSave", a).onclick = async () => { const ps = $("#sPs", a).value.trim(), pe = $("#sPe", a).value.trim(); if (!/^\d{4,8}$/.test(ps) || !/^\d{4,8}$/.test(pe)) return toast("PINs must be 4 to 8 digits", "bad"); if (ps === pe) return toast("Use different PINs for Supervisor and Engineer", "bad");
    CFG.initiative = $("#sI", a).value.trim(); CFG.area = $("#sA", a).value.trim(); CFG.pins = { supervisor: ps, engineer: pe }; await saveCfg(); toast("Saved", "ok"); };
  $("#bOut", a).onclick = async () => {
    const files = [];
    for (const f of await LIB.all("file")) { try { files.push(Object.assign({}, f, { blob: undefined, data: await LIB.fileToDataUrl(f.blob) })); } catch (e) {} }
    const data = { app: "digital-cilt", at: new Date().toISOString(), cfg: CFG, seq: ((await LIB.get("kv", "seq")) || {}).v || {}, exec: await LIB.all("exec"), abn: await LIB.all("abn"), photo: await LIB.all("photo"), file: files };
    LIB.download(new Blob([JSON.stringify(data)], { type: "application/json" }), `CILT_backup_${today()}.json`); };
  $("#cfgOut", a).onclick = () => LIB.download(new Blob([JSON.stringify({ app: "digital-cilt-config", machines: CFG.machines }, null, 1)], { type: "application/json" }), `CILT_machines_${today()}.json`);
  $("#bIn", a).onchange = async ev => { const f = ev.target.files[0]; ev.target.value = ""; if (!f) return;
    try { const d = JSON.parse(await f.text());
      if (d.app === "digital-cilt-config" && Array.isArray(d.machines)) {
        const ok = d.machines.filter(validMachine); if (!ok.length) throw 0;
        if (!confirm(T("Replace the machine configuration with this file?") + (ok.length < d.machines.length ? " (" + (d.machines.length - ok.length) + " " + T("invalid machines skipped") + ")" : ""))) return;
        CFG.machines = ok; if (!M(CFG.curMachine)) CFG.curMachine = ok[0].id; await edited(); toast("Configuration imported", "ok"); render(); return; }
      if (d.app !== "digital-cilt" || !isObj(d.cfg)) throw 0;
      if (!confirm(T("Import this backup? Records with the same ID are kept as they are on this device."))) return;
      let n = 0, bad = 0; const have = new Set(EXECS.map(x => x.id)), haveA = new Set(ABNS.map(x => x.id));
      for (const x of Array.isArray(d.exec) ? d.exec : []) { if (!validExec(x)) { bad++; continue; } if (!have.has(x.id)) { await LIB.put("exec", x); n++; } }
      for (const x of Array.isArray(d.abn) ? d.abn : []) { if (!validAbn(x)) { bad++; continue; } if (!haveA.has(x.id)) { await LIB.put("abn", x); n++; } }
      for (const x of Array.isArray(d.photo) ? d.photo : []) if (isObj(x) && !(await LIB.get("photo", String(x.id))) && typeof x.id === "string" && typeof x.data === "string" && /^data:image\/(jpeg|png|webp|gif);/.test(x.data)) await LIB.put("photo", { id: x.id, data: x.data, at: String(x.at || "") });
      for (const x of Array.isArray(d.file) ? d.file : []) { if (!isObj(x) || typeof x.id !== "string" || typeof x.data !== "string" || await LIB.get("file", x.id)) continue;
        const blob = await (await fetch(x.data)).blob(), t = await sniffType(blob); if (!t) { bad++; continue; }
        await LIB.put("file", { id: x.id, machineId: String(x.machineId || ""), title: String(x.title || x.name || ""), kind: String(x.kind || ""), name: String(x.name || ""), type: t, size: blob.size, blob: new Blob([blob], { type: t }), at: String(x.at || "") }); }
      if (isObj(d.seq)) { const rec = (await LIB.get("kv", "seq")) || { id: "seq", v: {} }; for (const [k, v] of Object.entries(d.seq)) if (/^[A-Z]+\d{4}$/.test(k) && Number.isInteger(v)) rec.v[k] = Math.max(rec.v[k] || 0, v); await LIB.put("kv", rec); }
      if (Array.isArray(d.cfg.machines) && confirm(T("Also restore the settings from this backup (machines, operators, shifts, distribution lists, PINs)?"))) {
        const ms = d.cfg.machines.filter(validMachine); if (ms.length) CFG.machines = ms;
        if (Array.isArray(d.cfg.operators)) CFG.operators = d.cfg.operators.filter(x => typeof x === "string").slice(0, 200);
        if (Array.isArray(d.cfg.shifts) && d.cfg.shifts.length) CFG.shifts = d.cfg.shifts.filter(x => typeof x === "string");
        if (Array.isArray(d.cfg.lists)) CFG.lists = d.cfg.lists.filter(l => isObj(l) && typeof l.name === "string" && Array.isArray(l.members)).map(l => ({ id: String(l.id || uid("L")), name: l.name, members: l.members.filter(isObj).map(m => ({ role: String(m.role || ""), email: String(m.email || "") })) }));
        if (isObj(d.cfg.pins) && /^\d{4,8}$/.test(d.cfg.pins.engineer) && /^\d{4,8}$/.test(d.cfg.pins.supervisor)) CFG.pins = { engineer: d.cfg.pins.engineer, supervisor: d.cfg.pins.supervisor };
        ["initiative", "area"].forEach(k => { if (typeof d.cfg[k] === "string") CFG[k] = d.cfg[k]; });
        if (!M(CFG.curMachine)) CFG.curMachine = (CFG.machines[0] || {}).id; CFG.edited = true; await saveCfg(); }
      EXECS = (await LIB.all("exec")).filter(validExec); ABNS = (await LIB.all("abn")).filter(validAbn); toast(T("Imported records: ") + n + (bad ? " · " + T("skipped invalid: ") + bad : ""), "ok"); render();
    } catch (e) { toast("Not a valid backup file", "bad"); } };
  $("#reseed", a).onclick = async () => { if (!confirm(T("Replace all machine configuration with the app's data set?"))) return; CFG.machines = JSON.parse(JSON.stringify(window.CILT_SEED.machines)); CFG.seedVersion = window.CILT_SEED.version; CFG.edited = false; delete CFG.seedPending; await saveCfg(); toast("Done", "ok"); render(); };
}

/* ---------------- start ---------------- */
window.addEventListener("beforeunload", () => { if (RUN) LIB.put("exec", RUN); });
boot().then(warmPhotos).then(() => { if (machines().some(m => (m.zones || []).some(z => z.sitePhoto))) render(); }).catch(e => { console.error(e); document.body.insertAdjacentHTML("afterbegin", `<div class="warn bad">Storage error: ${esc(e && e.message || e)}. Private browsing may block local storage.</div>`); });
window.CILT_APP = { get cfg() { return CFG; }, get execs() { return EXECS; }, get abns() { return ABNS; } };
})();
