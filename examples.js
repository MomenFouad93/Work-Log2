window.AN_EX=[
{
"id": "EX-A3-1",
"type": "A3",
"title": "FE55 high tablet reject rate traced to turret segment lock (Daflon 500)",
"title_ar": "ارتفاع نسبة الرفض في فيت 3 FE55 بسبب قفل السيجمنت",
"machine": "Fette 3 FE55",
"category": "GMP / Quality",
"note": "Based on a real site case (cause: turret/segment lock). Figures and dates are illustrative.",
"date": "2026-10-30",
"example": true,
"status": "done",
"data": {
"a3": {
"originator": "Maintenance Engineer",
"scope": "Acacia, Compression, Fette 3 FE55 (FE55:240085); Production, Maintenance, QA",
"process": "Tablet compression (Daflon 500)",
"opened": "2026-09-07",
"closed": "2026-10-30",
"impact": [
"Q",
"C",
"D"
],
"what": "Over four consecutive Daflon 500 batches the in-process reject rate on Fette 3 FE55 (FE55:240085) rose far above normal. Rejects were tablets out of weight or thickness limits plus chipped edges, and they appeared to come from a group of stations. Punch and die inspection found nothing outside limits.",
"who": "Production Supervisor (reject counts) and Technician (line check)",
"where": "Acacia compression room, Fette 3 FE55, stations next to the turret segment lock",
"when_date": "2026-08-28",
"when_time": "Second shift (14:00-22:00); repeated on every batch since",
"how_know": "In-process weight and thickness checks and the press reject count went above the action limit. QA sorting confirmed the defect types. The station map (first action) later showed a repeating cluster, and swapping to the original dies did not change it.",
"how_much": "Reject rate 6.8% vs standard 1.5% (+5.3 points) on 4 batches of 800,000 tablets = 169,600 extra rejected tablets x EGP 1.80 = EGP 305,280. Plus 14 h of press stoppages for checks and tooling swaps x EGP 4,500/h = EGP 63,000. Total EGP 368,280.",
"redefined": "Fette 3 FE55 produces 6.8% rejects on Daflon 500 against a 1.5% standard (gap 5.3 points), concentrated on the stations next to the segment lock.",
"fishbone": {
"materials": [
"Granule flow and fines in spec (checked, excluded)",
"Same granule lots as earlier good batches"
],
"methods": [
"No torque value for segment lock screw in SOP",
"Segment lock not in PM or fitting checklist",
"Troubleshooting limited to punches and dies"
],
"man": [
"No guide for refitting the segment lock",
"Fitting by feel differs between technicians"
],
"machines": [
"Segment lock clamping face worn or uneven",
"Segment next to the lock not held level",
"Punches and dies in spec; original dies same result"
],
"nature": [
"Powder film builds up on lock clamping face"
],
"measurement": [
"No reject count by station number",
"Die-seat runout never measured"
]
},
"plausible": "The turret segment lock does not clamp its neighbouring segment consistently, so die-seat height and alignment next to the lock are off.",
"whys": [
"Rejects are 6.8% because tablets from a repeating group of stations next to the segment lock are out of weight/thickness limits or chipped.",
"Those stations are affected because their die seats sit slightly off height and alignment compared with the rest of the turret.",
"The seats are off because the segment lock does not clamp the segment evenly, so it shifts under compression force.",
"The lock clamps unevenly because the lock itself is worn at its clamping face and its screw is tightened by feel, with no torque value or condition check.",
"No torque value or condition check exists because the PM plan and fitting SOP cover only punches and dies; the turret lock was never assessed (no FMEA or OEM-spec review)."
],
"root_cause": "The FE55 PM plan and tooling-fitting SOP cover only punches and dies, so the turret segment lock has no torque value, condition check or runout limit and its wear went unnoticed.",
"ideas": [
{
"text": "Replace all punches and dies with a new set",
"impact": "L",
"effort": "H"
},
{
"text": "Add lock torque value and condition check to fitting SOP and PM",
"impact": "H",
"effort": "L"
},
{
"text": "Replace or refit the segment lock to OEM specification",
"impact": "H",
"effort": "H"
},
{
"text": "Dial-indicator runout check of die seats at each PM",
"impact": "H",
"effort": "L"
},
{
"text": "Record rejects by station number on the press sheet",
"impact": "H",
"effort": "L"
},
{
"text": "Slow the turret speed to reduce rejects",
"impact": "L",
"effort": "L"
},
{
"text": "Add 100% visual inspection after the press",
"impact": "L",
"effort": "H"
},
{
"text": "Ask Fette service for lock specification and torque",
"impact": "H",
"effort": "L"
},
{
"text": "Install station-level monitoring package on the press",
"impact": "H",
"effort": "H"
}
],
"solution": "Replace or refit the segment lock to OEM specification (sound clamping face, defined torque) and confirm it with a dial-indicator runout check of the die seats, then make the torque value, lock condition check and runout limit part of the fitting SOP and the PM plan. Station-numbered reject recording is added so that a recurrence is located in one shift instead of four batches.",
"actions": [
{
"activity": "Record rejects by station number on the 4 batches; confirm cluster next to the lock",
"who": "Production Supervisor",
"start": "2026-09-07",
"due": "2026-09-10",
"status": "Done"
},
{
"activity": "Swap to original dies and move the lock position; confirm defect follows the lock",
"who": "Maintenance Engineer",
"start": "2026-09-10",
"due": "2026-09-16",
"status": "Done"
},
{
"activity": "Get lock specification, torque value and wear limit from Fette service",
"who": "Maintenance Engineer",
"start": "2026-09-14",
"due": "2026-09-25",
"status": "Done"
},
{
"activity": "Inspect lock clamping face; replace or refit per OEM; verify die-seat runout with dial indicator",
"who": "Technician",
"start": "2026-09-28",
"due": "2026-10-09",
"status": "Done"
},
{
"activity": "Run 3 verification batches with station-level reject recording; confirm defect classes",
"who": "QA",
"start": "2026-10-10",
"due": "2026-10-28",
"status": "Done"
},
{
"activity": "Update fitting SOP and PM plan: lock torque, condition check, runout limit",
"who": "Maintenance Engineer",
"start": "2026-10-12",
"due": "2026-10-23",
"status": "Done"
},
{
"activity": "Train technicians and operators on the lock check and station reject sheet",
"who": "Maintenance Engineer",
"start": "2026-10-20",
"due": "2026-10-29",
"status": "Done"
}
],
"metrics": [
{
"name": "Reject rate, Daflon 500",
"baseline": "6.8%",
"goal": "<= 1.5%",
"current": "1.3% (3 verification batches)"
},
{
"name": "Press stoppages for reject checks",
"baseline": "3.5 h per batch",
"goal": "<= 0.5 h per batch",
"current": "0.3 h per batch"
},
{
"name": "Lock checks recorded with torque and runout",
"baseline": "0% (not in PM)",
"goal": "100%",
"current": "100% (2 of 2 fittings)"
}
],
"comments": "Rejects fell from 6.8% to 1.3% over three verification batches, inside the 1.5% goal, and press stoppages fell from 3.5 to 0.3 h per batch. The avoided loss of about EGP 362,880 (305,280 from rejects plus 12.8 h of stoppage x EGP 4,500/h) is for an equivalent four-batch period at the same batch size and unit cost, so it is an estimate. Three batches are a short sample, so the result is confirmed only after five more batches and the sister-press check.",
"followups": [
{
"activity": "Check segment lock condition and runout on Fette 2 1200i at next PM",
"who": "Technician",
"start": "2026-11-02",
"due": "2026-11-20",
"status": "In progress"
},
{
"activity": "Monitor the next 5 Daflon 500 batches; confirm reject rate stays at or below 1.5%",
"who": "Production Supervisor",
"start": "2026-11-16",
"due": "2026-12-18",
"status": "In progress"
},
{
"activity": "Roll out the station-numbered reject sheet to all presses",
"who": "Production Supervisor",
"start": "2026-11-16",
"due": "2026-12-04",
"status": "In progress"
},
{
"activity": "Review other press PM plans for components missing from the plan (turret, cams)",
"who": "Maintenance Engineer",
"start": "2026-11-16",
"due": "2026-12-18",
"status": "Planned"
}
]
}
},
"entryId": null,
"qa": {}
},
{
"id": "EX-A3-2",
"type": "A3",
"title": "Recurring stops at the sealing station on CAM M92 (L3): foil wrinkling",
"title_ar": "وقفات متكررة في بليستر CAM M92 خط 3 بسبب تجعد الفويل",
"machine": "CAM M92 blister (L3)",
"category": "Kaizen / Improvement",
"note": "Worked example. Figures and dates are illustrative; replace with site data.",
"date": "2026-10-26",
"example": true,
"status": "done",
"data": {
"a3": {
"originator": "Production Supervisor",
"scope": "Palmier, Packaging Line 3, CAM M92 blister; Production and Maintenance",
"process": "Blister forming, sealing and cutting",
"opened": "2026-08-24",
"closed": "",
"impact": [
"Q",
"C",
"D"
],
"what": "The CAM M92 blister machine on Line 3 stops repeatedly at the sealing station when the lidding foil wrinkles and the sensor trips the machine. Each stop needs the web cleared, the foil rethreaded and the first blisters discarded. Stops were logged as a generic 'minor stoppage', so no cause was recorded and the problem was treated as a foil quality issue.",
"who": "Technician (line support) and Production Supervisor",
"where": "Palmier, Line 3, CAM M92 sealing station and foil path",
"when_date": "2026-08-20",
"when_time": "All shifts; worst on the second shift",
"how_know": "HMI stop counter showed 48 minor stoppages per month (July-August average). A manual tally by the technicians in the first week attributed most of them to foil wrinkling at the sealing station; wrinkled foil was also seen on the sealed web during go-and-see.",
"how_much": "48 stops/month x 15 min average = 720 min = 12.0 h/month lost (about 3% of 400 planned hours). At a line-hour loss rate of EGP 3,800/h this is EGP 45,600/month. Plus about 0.9% of blisters scrapped for foil wrinkles.",
"redefined": "CAM M92 (L3) stops 48 times per month (minor stoppages, most attributed to foil wrinkling at the sealing station; 12.0 h/month) against a target of 12 stops (3.0 h) per month: a gap of 36 stops and 9.0 h per month.",
"fishbone": {
"materials": [
"Foil edge quality varies between rolls",
"Foil roll core tolerance"
],
"methods": [
"Foil path PM annual, no condition criteria",
"Stops logged only as 'minor stoppage'",
"Rethreading practice not standardised"
],
"man": [
"Operators adjust tension by feel",
"Foil path inspection skill limited"
],
"machines": [
"Guide roller bearing drag on foil path",
"Foil residue build-up on rollers",
"Unwinder brake setpoint drifted"
],
"nature": [
"Humidity in Palmier swings with season"
],
"measurement": [
"No tension gauge reading or record",
"No stop-cause Pareto"
]
},
"plausible": "Drag on the foil guide rollers makes foil tension fluctuate, so the foil wrinkles at the sealing station.",
"whys": [
"The line stops because foil wrinkles at the sealing station and the sensor trips the machine.",
"The foil wrinkles because foil tension and tracking fluctuate between the unwinder and the sealing station.",
"Tension fluctuates because some guide rollers drag (rough bearings, foil residue build-up), so the foil is pulled unevenly.",
"The rollers drag because they are cleaned only ad hoc and their bearings are inspected once a year, with no condition criteria.",
"This persisted because stops were logged as generic 'minor stoppage' and the OEM-copied PM plan was never challenged by data, so nobody owned the foil path."
],
"root_cause": "The foil path was on an annual PM with no condition criteria and stops were logged as generic 'minor stoppage', so roller drag and tension drift were neither prevented nor visible.",
"ideas": [
{
"text": "Add stop-reason codes and a weekly stop Pareto",
"impact": "H",
"effort": "L"
},
{
"text": "Clean foil path and replace seized guide-roller bearings",
"impact": "H",
"effort": "L"
},
{
"text": "Monthly condition-based PM of foil path with criteria",
"impact": "H",
"effort": "L"
},
{
"text": "Gauge-check and set unwinder tension to the OEM value",
"impact": "H",
"effort": "L"
},
{
"text": "Closed-loop foil tension sensor on the unwinder",
"impact": "H",
"effort": "H"
},
{
"text": "Change foil supplier to reduce wrinkling",
"impact": "L",
"effort": "H"
},
{
"text": "Reduce machine speed by 20%",
"impact": "L",
"effort": "L"
},
{
"text": "Keep a guide-roller bearing kit in the store",
"impact": "H",
"effort": "L"
}
],
"solution": "Clean the foil path and replace the seized guide-roller bearings, set the unwinder tension with a gauge to the OEM value, and move the foil path from an annual PM to a monthly condition check with accept/reject criteria. Stop-reason codes and a weekly Pareto make any recurrence visible within a week.",
"actions": [
{
"activity": "Add stop-reason codes to the line log; start weekly stop Pareto",
"who": "Technician",
"start": "2026-08-24",
"due": "2026-09-04",
"status": "Done"
},
{
"activity": "Clean foil path; replace seized guide-roller bearings (3 of 9 rollers)",
"who": "Technician",
"start": "2026-09-07",
"due": "2026-09-18",
"status": "Done"
},
{
"activity": "Measure foil tension with a gauge; set unwinder brake to OEM value",
"who": "Maintenance Engineer",
"start": "2026-09-14",
"due": "2026-09-30",
"status": "Done"
},
{
"activity": "Change foil-path PM from annual to monthly condition check with criteria",
"who": "Maintenance Engineer",
"start": "2026-10-01",
"due": "2026-10-15",
"status": "Done"
},
{
"activity": "Add foil-path wipe to operators' end-of-batch cleaning checklist",
"who": "Production Supervisor",
"start": "2026-10-05",
"due": "2026-11-20",
"status": "In progress"
},
{
"activity": "Train operators on foil threading and tracking check",
"who": "Production Supervisor",
"start": "2026-10-12",
"due": "2026-11-27",
"status": "In progress"
},
{
"activity": "Review Pareto and tension readings after 8 weeks; decide on closing the A3",
"who": "Maintenance Engineer",
"start": "2026-11-16",
"due": "2027-01-08",
"status": "Planned"
}
],
"metrics": [
{
"name": "Minor stops per month (mostly foil wrinkling)",
"baseline": "48",
"goal": "<= 12",
"current": "19 (October run-rate to date)"
},
{
"name": "Stop downtime",
"baseline": "12.0 h/month",
"goal": "<= 3.0 h/month",
"current": "4.75 h/month"
},
{
"name": "Blisters scrapped for foil wrinkles",
"baseline": "0.9%",
"goal": "<= 0.3%",
"current": "0.5%"
}
],
"comments": "Stops fell from 48 to about 19 per month (October run-rate to date) and downtime from 12.0 to about 4.75 h, an estimated saving of 7.25 h x EGP 3,800/h = EGP 27,550 per month. The goal of 12 stops and 3.0 h is not yet reached, so the A3 stays open until the operator checks and the monthly PM have run for eight weeks (to about 2027-01-08). The Pareto should show whether the remaining stops are linked to foil lots.",
"followups": [
{
"activity": "Inspect foil path and guide rollers on CAM M92 blister (L5)",
"who": "Technician",
"start": "2026-11-16",
"due": "2026-11-27",
"status": "Planned"
},
{
"activity": "Apply stop-reason codes and weekly Pareto to Korber blister (L4)",
"who": "Production Supervisor",
"start": "2026-11-16",
"due": "2026-12-11",
"status": "Planned"
},
{
"activity": "Set min/max stock for guide-roller bearings in the spares system",
"who": "Warehouse",
"start": "2026-11-16",
"due": "2026-11-20",
"status": "Planned"
},
{
"activity": "Add a foil tension check to the M92 start-up checklist",
"who": "Maintenance Engineer",
"start": "2026-11-16",
"due": "2026-12-04",
"status": "Planned"
}
]
}
},
"entryId": null,
"qa": {}
},
{
"id": "EX-A3-3",
"type": "A3",
"title": "Compressed air leakage at 28% of generation: EGP 654,720 per year in energy",
"title_ar": "تسريبات الهوا المضغوط: 28% من الإنتاج بتروح هدر",
"machine": "Compressed Air",
"category": "Energy & Utilities",
"note": "Worked example. Figures and dates are illustrative; replace with site data.",
"date": "2026-11-06",
"example": true,
"status": "done",
"data": {
"a3": {
"originator": "Maintenance Engineer",
"scope": "Utilities: compressed air generation and distribution to Acacia and Palmier; Maintenance, Production",
"process": "Compressed air generation and distribution",
"opened": "2026-08-18",
"closed": "2026-11-06",
"impact": [
"C",
"E"
],
"what": "An ultrasonic leak survey found 63 leaks in the compressed air network and machine pneumatics of Acacia and Palmier. The estimated leak flow is 310 Nm3/h, about 28% of the average generation of 1,100 Nm3/h. Leaks were mostly at push-in fittings, quick couplers, hoses and auto-drains stuck open. The site standard for leakage is 10% or less.",
"who": "Maintenance Engineer and Technician during the first leak survey",
"where": "Acacia and Palmier: machine pneumatics, hose drops and drain points",
"when_date": "2026-08-18",
"when_time": "Night survey (22:00-02:00) when background noise is low",
"how_know": "Ultrasonic detector survey with each leak tagged and sized (small, medium, large) and an estimated flow, compared with average generation from the compressor flow data.",
"how_much": "Leak flow 310 Nm3/h x 0.12 kWh/Nm3 = 37.2 kW. At 8,000 h/year and EGP 2.2/kWh this is EGP 654,720/year. The excess above the 10% limit (200 Nm3/h) is 24 kW = EGP 422,400/year.",
"redefined": "Leakage in the Acacia and Palmier compressed air network is 28% of generation (310 of 1,100 Nm3/h) against a limit of 10% (110 Nm3/h): a gap of 200 Nm3/h, or 24 kW and EGP 422,400 per year.",
"fishbone": {
"materials": [
"Aged push-in fittings and PU tubing",
"Low-grade quick couplers on machines"
],
"methods": [
"No leak survey frequency defined",
"No tag-and-repair time limit for leaks"
],
"man": [
"Hissing sounds not reported by operators"
],
"machines": [
"Auto-drains stuck open",
"Worn quick couplers and hose reels"
],
"nature": [
"Production noise masks leaks",
"Heat ages tubing and seals"
],
"measurement": [
"No flow meter per building",
"KPI tracks only compressor kWh"
]
},
"plausible": "Leaks accumulate unseen because there is no routine to find, tag and repair them and no air-flow KPI by building.",
"whys": [
"Leakage is 28% because 63 leaks exist at fittings, couplers, hoses and stuck-open drains.",
"So many leaks exist because fittings and couplers on machine pneumatics degrade, drains stick, and leaks are not repaired when they appear.",
"They are not repaired because nobody finds them: leaks are inaudible in noisy production areas and no one surveys or tags them.",
"Nobody surveys because leak management has no owner, frequency or repair time limit in the utilities PM plan.",
"It has no owner because air is measured only as compressor kWh, with no flow meter or KPI by building, so the cost of leakage is invisible to Production and Maintenance."
],
"root_cause": "There is no leak-management routine (survey frequency, tagging, repair time limit) and no site-level leakage KPI (building KPIs follow once sub-meters are installed), so leakage grows unseen.",
"ideas": [
{
"text": "Ultrasonic leak survey of Acacia and Palmier",
"impact": "H",
"effort": "L"
},
{
"text": "Tag leaks and repair within 7 days (tag-and-repair rule)",
"impact": "H",
"effort": "L"
},
{
"text": "Quarterly survey and monthly leakage % in the utilities PM plan",
"impact": "H",
"effort": "L"
},
{
"text": "Install flow sub-meters per building",
"impact": "H",
"effort": "H"
},
{
"text": "Replace timed drains with level-sensing zero-loss drains",
"impact": "H",
"effort": "H"
},
{
"text": "Lower header pressure by 0.5 bar",
"impact": "L",
"effort": "L"
},
{
"text": "Buy a new VSD compressor",
"impact": "L",
"effort": "H"
}
],
"solution": "Run a full ultrasonic survey, tag every leak and repair it under a 7-day rule, replace the stuck-open drains, then make a quarterly survey and a monthly leakage % report part of the utilities PM plan. Leakage is trended from a weekend no-production load test, and flow sub-meters per building are proposed as a follow-up investment.",
"actions": [
{
"activity": "Ultrasonic leak survey of Acacia and Palmier; tag and size every leak",
"who": "Technician",
"start": "2026-08-18",
"due": "2026-09-04",
"status": "Done"
},
{
"activity": "Repair the 20 largest leaks first (about 65% of leak flow)",
"who": "Technician",
"start": "2026-09-07",
"due": "2026-09-30",
"status": "Done"
},
{
"activity": "Repair all remaining leaks; replace 6 stuck-open auto-drains",
"who": "Technician",
"start": "2026-10-01",
"due": "2026-10-23",
"status": "Done"
},
{
"activity": "Write leak-management SOP: survey frequency, tags, 7-day rule, owner",
"who": "Maintenance Engineer",
"start": "2026-10-05",
"due": "2026-10-20",
"status": "Done"
},
{
"activity": "Add quarterly survey and monthly leakage % report to utilities PM plan",
"who": "Maintenance Engineer",
"start": "2026-10-15",
"due": "2026-10-30",
"status": "Done"
},
{
"activity": "Brief supervisors and operators on leak tags and reporting hiss",
"who": "Production Supervisor",
"start": "2026-10-20",
"due": "2026-11-04",
"status": "Done"
},
{
"activity": "Weekend no-production load test to measure leakage %",
"who": "Technician",
"start": "2026-10-31",
"due": "2026-11-02",
"status": "Done"
}
],
"metrics": [
{
"name": "Leakage (% of generation)",
"baseline": "28% (310 Nm3/h, ultrasonic survey estimate)",
"goal": "<= 10% (110 Nm3/h)",
"current": "11% (120 Nm3/h, weekend load test)"
},
{
"name": "Power lost to leaks",
"baseline": "37.2 kW",
"goal": "<= 13.2 kW",
"current": "14.4 kW"
},
{
"name": "Tagged leaks open longer than 7 days",
"baseline": "not tracked (63 untagged)",
"goal": "0",
"current": "0 (4 new leaks, within 7 days)"
}
],
"comments": "Leakage fell from 28% to 11% (310 to 120 Nm3/h), removing 22.8 kW, worth 22.8 kW x 8,000 h x EGP 2.2/kWh = EGP 401,280 per year. The 10% goal is almost met. The residual 120 Nm3/h is mainly small leaks repaired late or not yet found, plus 4 new leaks tagged at the weekend test, so the last point depends on the quarterly surveys stopping new leaks from accumulating. The baseline is a survey estimate and the after value a load test, so confirm with sub-meters before further savings claims. The A3 is closed with a residual gap of 1 point, tracked in the quarterly survey. The saving is calculated, not metered.",
"followups": [
{
"activity": "Install flow sub-meters on Acacia and Palmier branch headers",
"who": "Maintenance Engineer",
"start": "2026-11-16",
"due": "2027-01-29",
"status": "In progress"
},
{
"activity": "First quarterly ultrasonic re-survey",
"who": "Technician",
"start": "2027-01-10",
"due": "2027-01-31",
"status": "Planned"
},
{
"activity": "Add leak reporting to the daily area walk",
"who": "Production Supervisor",
"start": "2026-11-16",
"due": "2026-11-30",
"status": "In progress"
},
{
"activity": "Replace remaining timed drains with level-sensing type",
"who": "Maintenance Engineer",
"start": "2026-11-16",
"due": "2027-02-26",
"status": "Planned"
}
]
}
},
"entryId": null,
"qa": {}
},
{
"id": "EX-3C-1",
"type": "3C",
"title": "Korber cartoner (L4) format change took 5.5 h against a 2.5 h standard",
"title_ar": "تغيير فورمات كرتنة كوربر خط 4 أخد 5.5 ساعة بدل 2.5",
"machine": "Korber cartoner (L4)",
"category": "Changeover",
"note": "Worked example. Figures and dates are illustrative; replace with site data.",
"date": "2026-11-05",
"example": true,
"status": "done",
"data": {
"c3": {
"initials": "HS",
"date": "2026-11-05",
"concern": "Format change on the Korber cartoner (L4) from product A to product B cartons on 2026-10-11 took 5.5 h.\nStandard (SMED sheet): 2.5 h.\nLoss: 3.0 h of Line 4 packaging time at about EGP 3,200/h = EGP 9,600; the batch started late and overtime was needed.",
"cause": "Go and see with the Technician and Packaging Supervisor on the same day.\nCarton guides and pusher set for product B were not at the line: 70 min searching (found on the Line 5 trolley), 45 min to get a spare for one missing knob, 65 min of trial-and-error carton magazine setting (no recorded settings). Total 180 min.\nWhy: kit not staged -> no kit checklist -> production plan changed 2 h earlier and Maintenance was not told -> nothing triggers kit staging when the plan is released.\nRoot cause: change-part staging is not linked to the production schedule.",
"containment": "Line 5 parts returned to the Line 5 shelf with a tag.\nMissing knob replaced from the spares store; line clearance completed before restart.\nKits for the next two planned format changes checked on the shelf: complete.",
"countermeasure": "1) Kit checklist per format (parts, knobs, tools, settings) on each kit cart - Technician, 2026-10-23.\n2) Kit staged at the line the shift before each format change - Packaging Supervisor, from 2026-10-19.\n3) Planning notifies Maintenance at schedule release; kit staging added as a step - Production Supervisor, 2026-10-26.\n4) Carton magazine settings recorded on each kit label - Technician, 2026-11-02.",
"observations": "The format change on 2026-10-25 (kit checklist and staging only) took 2.7 h. The one on 2026-11-03 (with the settings label) took 2.6 h, close to the 2.5 h standard.\nThe settings label cut trial-and-error adjustment from 65 min to about 10 min.\nThe same staging gap is likely on other packaging lines: check at their next format change."
}
},
"entryId": null,
"qa": {}
},
{
"id": "EX-3C-2",
"type": "3C",
"title": "Bohle Bin Blender PM 2000 stops mid-cycle on a drive over-temperature alarm",
"title_ar": "خلاط بوهلر PM 2000 بيقف بإنذار سخونة في الدرايف",
"machine": "Bohle Bin Blender PM 2000",
"category": "Breakdown Fixed",
"note": "Worked example. Figures and dates are illustrative; replace with site data.",
"date": "2026-10-20",
"example": true,
"status": "done",
"data": {
"c3": {
"initials": "NK",
"date": "2026-10-20",
"concern": "On 2026-09-29 the Bohle Bin Blender PM 2000 stopped twice during a blending cycle with a drive over-temperature alarm.\nStandard: the cycle runs to the set time with no alarm.\nLoss: 1.5 h; the cycle was interrupted, QA informed, and the batch record completed per the interruption procedure.",
"cause": "Go and see by the Technician during the same shift.\nThe cabinet fan was running but air flow at the filter was very low: the filter mat was packed with powder dust and cabinet temperature reached the trip level.\nWhy: drive trips -> cabinet hot -> filter blocked -> filter never cleaned -> not on the PM list, which covers mechanical points only.\nRoot cause: cabinet filter cleaning is missing from the blender PM plan.",
"containment": "Filter mat removed and cleaned by vacuum in the technical area (not with compressed air, to keep dust out of the room), then refitted.\nCabinet cooled, alarm reset, cycle completed with QA approval.",
"countermeasure": "1) Add cabinet filter clean/replace to the monthly PM - Maintenance Engineer, 2026-10-11.\n2) Add infrared drive cabinet temperature reading to the PM sheet - Technician, 2026-10-11.\n3) Keep 2 spare filter mats with min/max in the store - Warehouse, 2026-10-15.\n4) Check cabinet filters on similar machines - Technician, 2026-10-18.",
"observations": "After cleaning, cabinet temperature was about 12 C lower at the same load, with no alarms in the next 6 cycles.\nThe filter was heavily loaded with fines; the monthly interval looks right but is to be confirmed after 3 inspections.\nTwo similar cabinets on other machines had partly blocked filters."
}
},
"entryId": null,
"qa": {}
},
{
"id": "EX-3C-3",
"type": "3C",
"title": "Wrong oil seal issued for Fette 2 1200i (10 mm width instead of 7 mm)",
"title_ar": "المخزن صرف جوان زيت غلط لماكينة فيت 2 1200i",
"machine": "Fette 2 1200i",
"category": "Warehouse Issue",
"note": "Worked example. Figures and dates are illustrative; replace with site data.",
"date": "2026-10-09",
"example": true,
"status": "done",
"data": {
"c3": {
"initials": "RT",
"date": "2026-10-09",
"concern": "On 2026-09-16 the Warehouse issued radial shaft seal 40x62x10 against a work order that needed 40x62x7 for the Fette 2 1200i drive gearbox input shaft.\nStandard: the part issued matches the material code on the work order and fits first time.\nLoss: 4.0 h of press downtime (1 h opening and test-fitting, 3 h waiting for the right seal).",
"cause": "Go and see with the Technician and the Warehouse clerk.\nThe two seals sit in neighbouring bins with near-identical labels, and the SAP short text shows only '40x62' with the width cut off. The clerk picked by description; there was no read-back of the material code at issue, so the error appeared only at fitting. The right seal came from the Palmier store.\nWhy: width missing from text -> bins adjacent -> issue checked by description.\nRoot cause: descriptions and labels do not separate the two seals and the issue step has no code check.",
"containment": "Wrong seal returned and quarantine-tagged until the bins were checked.\nCorrect seal fitted; press passed its run check before release.\nOther bins with similar seals and bearings checked for mixed stock: none found.",
"countermeasure": "1) Separate the two bins and add a photo and code label - Warehouse, 2026-09-25.\n2) Read-back of material code at issue for critical spares - Warehouse, from 2026-09-23.\n3) Width and type added to the SAP short text of the 2 seals and 6 similar items - Warehouse, 2026-09-30.\n4) Work orders show code plus dimension for seals and bearings - Maintenance Engineer, 2026-10-02.",
"observations": "No wrong issue in the 2 weeks since read-back started (14 issues checked).\nTechnicians report that the photo label saves search time.\nSimilar-description pairs probably exist for bearings and O-rings: Warehouse to run a duplicate-description check."
}
},
"entryId": null,
"qa": {}
}
];
