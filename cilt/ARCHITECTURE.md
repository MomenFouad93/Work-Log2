# Technical architecture

## Current prototype (offline, single device)

```
Browser (tablet / phone / PC)
 ├─ index.html + js/app.js      UI, workflow engine, reports, admin
 ├─ js/lib.js                   IndexedDB store, xlsx/csv writer, image resize
 ├─ data/machines.js            seed configuration (machines → zones → checkpoints)
 └─ IndexedDB "cilt-db"
     ├─ kv     cfg (machines, operators, shifts, lists, PINs), seq counters
     ├─ exec   CILT executions (snapshot of checkpoints + results)
     ├─ abn    abnormality records with append-only history
     ├─ photo  JPEG data URLs (resized to ≤1100 px)
     └─ file   uploaded manuals/drawings (Blob)
```

There are no external libraries and no network calls apart from loading the app itself. The Excel writer builds the .xlsx package directly. The PDF comes from the browser's print engine (Save as PDF), which keeps Arabic text shaping and photos correct.

## Data model

**Machine:** `{id, name, type, model, serial, manufacturer, area, manuals[], safety[], lubricants[], zones[]}`

**Zone:** `{id, name{en,ar}, desc, image, imageRef, sitePhoto, safety[], tools[], points[]}`

**Checkpoint:** `{id, cat: C|I|L|T, title, instruction, material, lubricantId, method, quantity, torque, frequency (manual wording), routine (optional override), criteria, abnormal[], reading{unit,min,max}, minutes, machineState, inform, mandatory, validated, allowTighten, ref, note, demo, marker{x,y}}`

**Execution:** `{id, machineId, machine{…}, operator, shift, date, start, end, freqs[], safetyAck, zones[], zoneInfo{}, points[] (snapshot), results{pointId:{st, note, value, photos[], abn, abnRaised, at, by}}, zoneStart{}, zoneDone{}, cur{z,c}, status: open|submitted, success, signoff[], log[]}`

The checkpoint snapshot is taken when the run starts. A later configuration change never rewrites a historical report.

**Abnormality:** `{id ABN-YYYY-NNNN, execId, machineId, zoneId, pointId, at, operator, category, tpmType, cardType, urgency, desc, severity, immediate, dept, comments, photos[], status, escalation, owner, due, action, history[]}`

## Integrity rules enforced in code

- A zone cannot be confirmed while a mandatory checkpoint has no result, a Not Completed item has no reason, or an abnormality has no description.
- The success screen appears only if every mandatory checkpoint has a result and none is Not Completed.
- Submit locks the execution. Abnormalities are committed at zone confirmation and their original fields are never edited. Status, escalation, owner and due date changes are appended to the history.
- Tightening Performed is disabled unless the checkpoint has `allowTighten` (approved WI).
- Imported backups never overwrite records that already exist with the same ID.

## Migration path

| Need | Next step |
|---|---|
| Central database, multi-user | REST API (e.g. ASP.NET or Node) on a company server, or SharePoint Lists / Dataverse. Sync the `exec` and `abn` stores. The record shapes above are the API contract. |
| Role-based authentication | Microsoft Entra ID (Azure AD) sign-in via MSAL. Map groups to Operator / Supervisor / Engineer and remove the local PINs. |
| Central report storage | Upload the generated .xlsx and PDF to SharePoint, one folder per machine. |
| Automatic email | A server-side flow (Power Automate or an SMTP relay) triggered by "execution submitted". Credentials stay on the server, never in the browser. |
| CMMS / SAP PM | Map abnormalities with dept = Maintenance/Engineering to SAP PM notifications (M1/M2), and checkpoint routines to maintenance plans. |
| Hour-based routines | Read machine operating hours (HMI/OPC UA) to decide which 40 h / 160 h / 500 h routines are due. |
| GMP | Validate against the site's CSV procedure before the records are used as GMP records (audit trail, e-signature per 21 CFR Part 11 / EU Annex 11). |
