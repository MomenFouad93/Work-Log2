# Digital Autonomous Maintenance – CILT

Shop-floor web app for the TPM Autonomous Maintenance pillar at Servier Egypt (Cairo site). Operators run Cleaning, Inspection, Lubrication and Tightening (CILT) zone by zone on the Körber BE4 blister machine (768036) and the Körber P4 cartoner (787017), raise abnormalities, and produce a report for Production, Maintenance and Engineering.

## Run it

- **Hosted:** open the GitHub Pages link on a tablet, phone or PC. After the first load it works offline (service worker).
- **Locally:** serve the folder with any static web server, for example `python -m http.server 8000`, then open `http://localhost:8000`. Opening `index.html` straight from disk also works, but the offline cache is off in that mode.
- On iPad or iPhone, use Safari → Share → Add to Home Screen. On Android or a PC, use Chrome or Edge → Install app.

## Roles

| Role | How | Can |
|---|---|---|
| Operator | default | Run CILT, add photos and comments, raise abnormalities, add notes, escalate |
| Production Supervisor | PIN (default `1111`) | Everything an operator can do, plus change abnormality status, set owner and due date, sign off reports |
| Engineer / Admin | PIN (default `0000`) | Everything above, plus the Admin area: machines, zones, checkpoints, pictures, markers, manuals, operators, distribution lists, PINs, backup |

Change both PINs in Admin → Settings on day one. The PIN is a guard on that device only. It is not a login. Real authentication needs the backend described in `ARCHITECTURE.md`.

## Operator flow

1. **Dashboard:** shows the machine, operator, shift, date, status and KPIs. Tap **Start CILT**.
2. **Setup:** enter the operator name and shift, and pick the routines that are due (Per shift / daily, product changeover, 40 operating hours, …). The manual's own interval wording stays on every checkpoint. Read the safety precautions and confirm the safe state. The app does not replace LOTOTO.
3. **Zones:** one zone at a time. Each zone shows its picture, numbered markers, safety notes and tools, then the C → I → L → T sections and a Review step.
   - Every checkpoint needs a result.
   - **Not Completed** needs a reason.
   - **Abnormality Detected** opens the abnormality form. Description and severity are required. Photos come from the camera.
4. **Confirm zone:** the app checks for missing results and moves to the next zone. Abnormalities are recorded at this point, and the operator's original text becomes read-only.
5. **Finish:** the success message appears only when every mandatory checkpoint has an acceptable result. **Submit & lock** freezes the record.
6. **Report:** PDF/Print, Excel (Summary, Checkpoints, Abnormalities), CSV, and Email (share sheet, or a downloaded file plus an email draft). The app never sends email by itself.

## Data rules

- Checkpoint content comes from the Körber documentation. Each checkpoint carries its reference (document, PDF page).
- Lubricant quantities, intervals and torque values appear only where the manual states them. Anything missing shows **Not in the manual – ask Engineering**.
- Checkpoints not validated by Engineering carry an orange badge and are counted in every report.
- Operators cannot tighten a checkpoint unless Engineering ticks **Operator may tighten (approved WI exists)**. Without that tick, the operator checks only and reports loose parts.
- Submitted executions cannot be edited. An abnormality keeps the operator's original observation. Every later change goes into its History.

## Where the data lives

Everything is stored in the browser's IndexedDB on that device: configuration, executions, abnormalities, photos and uploaded manuals. Export a backup from Admin → Settings regularly. A second device does not see the first device's records until a central backend is added (see `ARCHITECTURE.md`).

## Updating machine content

- **In the app:** Admin → Machines & zones. You can edit zones and checkpoints, upload site photos, place markers, and tick Validated.
- **In bulk:** edit `data/*.json` in the source package and rebuild `data/machines.js` (`python build.py`). Devices that have not edited their configuration pick up the new data set automatically. Devices with edits get a prompt in Admin.

## Folder structure

```
index.html            app shell and styles
js/lib.js             storage (IndexedDB), Excel/CSV writer, photo resize, share/download
js/app.js             dashboard, execution engine, abnormalities, reports, email, admin
js/i18n_ar.js         Arabic interface text
data/machines.js      machine configuration (generated from the JSON files)
img/                  zone pictures taken from the manuals
sw.js, manifest.webmanifest, icon-*.png   offline cache and install
```
