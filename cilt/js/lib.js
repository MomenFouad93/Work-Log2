/* Digital AM – CILT : shared helpers (storage, export, images). No external libraries. */
"use strict";
const LIB = (() => {
  /* ---------- IndexedDB (all records + photos + manuals) ---------- */
  const DBN = "cilt-db", VER = 1, STORES = ["kv", "exec", "abn", "photo", "file"];
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open(DBN, VER);
      r.onupgradeneeded = () => { const d = r.result; STORES.forEach(s => { if (!d.objectStoreNames.contains(s)) d.createObjectStore(s, { keyPath: "id" }); }); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return dbp;
  }
  async function tx(store, mode, fn) {
    const d = await db();
    return new Promise((res, rej) => {
      const t = d.transaction(store, mode), s = t.objectStore(store);
      let out; const r = fn(s); if (r) r.onsuccess = () => { out = r.result; };
      t.oncomplete = () => res(out); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
    });
  }
  const put = (store, obj) => tx(store, "readwrite", s => s.put(obj));
  const get = (store, id) => tx(store, "readonly", s => s.get(id));
  const all = (store) => tx(store, "readonly", s => s.getAll());
  const del = (store, id) => tx(store, "readwrite", s => s.delete(id));
  const clear = (store) => tx(store, "readwrite", s => s.clear());

  /* ---------- small utils ---------- */
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = n => String(n).padStart(2, "0");
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  const stamp = d => { d = d ? new Date(d) : new Date(); return isNaN(d) ? "" : d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()); };
  const uid = p => p + "-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();

  /* ---------- photos: resize to keep storage small ---------- */
  function fileToDataUrl(f) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); }); }
  async function resizeImage(file, max = 1100, q = 0.72) {
    const url = await fileToDataUrl(file);
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const k = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", q);
  }

  /* ---------- zip + xlsx (stored, no compression) ---------- */
  const CRCT = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(u) { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = CRCT[(c ^ u[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function makeZip(files, type) {
    const enc = new TextEncoder(), parts = [], cen = []; let off = 0;
    for (const f of files) {
      const nm = enc.encode(f.name), d = typeof f.data === "string" ? enc.encode(f.data) : f.data, crc = crc32(d);
      const lh = new DataView(new ArrayBuffer(30)); lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(12, 0x21, true); lh.setUint32(14, crc, true); lh.setUint32(18, d.length, true); lh.setUint32(22, d.length, true); lh.setUint16(26, nm.length, true);
      parts.push(new Uint8Array(lh.buffer), nm, d);
      const ch = new DataView(new ArrayBuffer(46)); ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(14, 0x21, true); ch.setUint32(16, crc, true); ch.setUint32(20, d.length, true); ch.setUint32(24, d.length, true); ch.setUint16(28, nm.length, true); ch.setUint32(42, off, true);
      cen.push(new Uint8Array(ch.buffer), nm); off += 30 + nm.length + d.length;
    }
    let cs = 0; for (const c of cen) cs += c.length;
    const e = new DataView(new ArrayBuffer(22)); e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, cs, true); e.setUint32(16, off, true);
    return new Blob([...parts, ...cen, new Uint8Array(e.buffer)], { type: type || "application/zip" });
  }
  const xesc = s => String(s == null ? "" : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, "").replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "$1").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const colL = i => { let s = ""; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
  /* sheets: [{name, title, head:[...], rows:[[...]], widths:[...], sev: colIndex (optional, colors High/Critical)}] */
  function xlsx(sheets) {
    const cell = (r, c, v, s) => { const ref = colL(c) + r; if (v === "" || v == null) return `<c r="${ref}" s="${s}"/>`; if (typeof v === "number" && isFinite(v)) return `<c r="${ref}" s="${s}"><v>${v}</v></c>`; return `<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${xesc(v)}</t></is></c>`; };
    const files = [];
    sheets.forEach((sh, i) => {
      const n = sh.head.length, rows = [];
      let strip = "", title = "", sub = "";
      for (let c = 0; c < n; c++) { strip += cell(1, c, "", 5); title += cell(2, c, c === 0 ? sh.title : "", 4); sub += cell(3, c, c === 0 ? (sh.sub || "") : "", 6); }
      rows.push(`<row r="1" ht="5" customHeight="1">${strip}</row>`, `<row r="2" ht="26" customHeight="1">${title}</row>`, `<row r="3" ht="18" customHeight="1">${sub}</row>`);
      rows.push(`<row r="4" ht="30" customHeight="1">${sh.head.map((h, c) => cell(4, c, h, 1)).join("")}</row>`);
      sh.rows.forEach((r, k) => {
        const rr = 5 + k, base = k % 2 ? 3 : 2;
        rows.push(`<row r="${rr}">${r.map((v, c) => { let s = base; if (sh.sev != null && c === sh.sev && /^(High|Critical)$/i.test(String(v))) s = 7; return cell(rr, c, v, s); }).join("")}</row>`);
      });
      const widths = sh.widths || sh.head.map(() => 18);
      const last = colL(n - 1) + (4 + sh.rows.length);
      files.push({ name: `xl/worksheets/sheet${i + 1}.xml`, data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView workbookViewId="0" showGridLines="0"><pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${widths.map((w, c) => `<col min="${c + 1}" max="${c + 1}" width="${w}" customWidth="1"/>`).join("")}</cols><sheetData>${rows.join("")}</sheetData>${sh.rows.length ? `<autoFilter ref="A4:${last}"/>` : ""}<pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>` });
    });
    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="5"><font><sz val="10"/><name val="Century Gothic"/></font><font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Century Gothic"/></font><font><b/><sz val="14"/><color rgb="FFFFFFFF"/><name val="Century Gothic"/></font><font><i/><sz val="9"/><color rgb="FF242269"/><name val="Century Gothic"/></font><font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Century Gothic"/></font></fonts><fills count="7"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF242269"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF55B41"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD3DEF2"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF4F5FA"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9534F"/></patternFill></fill></fills><borders count="2"><border/><border><left style="thin"><color rgb="FFD3DEF2"/></left><right style="thin"><color rgb="FFD3DEF2"/></right><top style="thin"><color rgb="FFD3DEF2"/></top><bottom style="thin"><color rgb="FFD3DEF2"/></bottom></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="8"><xf fontId="0"/><xf fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf fontId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf fontId="0" fillId="5" borderId="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf fontId="2" fillId="2" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf><xf fontId="0" fillId="3" applyFill="1"/><xf fontId="3" fillId="4" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf><xf fontId="4" fillId="6" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
    const ct = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${sheets.map((s, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;
    const sname = s => String(s).replace(/[\\\/\?\*\[\]:]/g, " ").slice(0, 31);
    const wb = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s, i) => `<sheet name="${xesc(sname(s.name))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets></workbook>`;
    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((s, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("")}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
    return makeZip([
      { name: "[Content_Types].xml", data: ct },
      { name: "_rels/.rels", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
      { name: "xl/workbook.xml", data: wb }, { name: "xl/_rels/workbook.xml.rels", data: rels }, { name: "xl/styles.xml", data: styles }, ...files
    ], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  }
  function csv(head, rows) {
    const q = v => { v = v == null ? "" : String(v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[",\n\r;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    return new Blob(["﻿" + [head, ...rows].map(r => r.map(q).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
  }
  function download(blob, name) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  }
  async function share(blob, name, title) {
    const f = new File([blob], name, { type: blob.type });
    try { if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title }); return "shared"; } } catch (e) { if (e && e.name === "AbortError") return "cancelled"; }
    download(blob, name); return "downloaded";
  }
  return { put, get, all, del, clear, esc, pad, today, stamp, uid, resizeImage, fileToDataUrl, xlsx, csv, download, share, makeZip };
})();
