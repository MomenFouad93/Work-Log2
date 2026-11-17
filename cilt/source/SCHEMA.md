# Machine data schema (one JSON file per machine: data/<machineId>.json)

Rule zero: NOTHING invented. Every technical value (lubricant, quantity, interval, torque, cleaning agent, acceptance criterion)
must come from a staged Körber/Klüber document, with a `ref` = "file name, p.<page>" (page = PDF page index, 1-based, as pdftotext -f/-l uses).
If the manual does not give a value, put null and set "validated": false with "note": "Not in manual — Engineering to define".
DEMO/placeholder items must have "demo": true.

{
  "id": "BE4-768036",                 // machine id
  "name": "Körber BE4 Blister Line",
  "type": "Blister packaging machine",
  "model": "BE4",                      // from manual
  "serial": "768036",                  // order/serial number as printed in manual
  "manufacturer": "Körber Pharma ...", // as printed
  "manuals": [ {"title":"...", "file":"b_768036_001_EN User Manual.pdf", "kind":"user|service|safety|lubricant|cleaning|training"} ],
  "safety": [ {"en":"...", "ar":"...", "ref":"..."} ],   // general precautions before AM work (operation modes, guard doors, LOTO reference)
  "lubricants": [ {"id":"LUB1","name":"Klüberfood NH1 94-301","type":"grease|oil|spray","spec":"...","ref":"..."} ],
  "zones": [
    {
      "id": "Z01", "name": {"en":"...","ar":"..."},
      "desc": {"en":"...","ar":"..."},
      "image": "img/<machineId>_Z01.png",      // page render or extracted figure; may be null
      "imageRef": "file, p.N",
      "safety": [ {"en":"...","ar":"..."} ],
      "tools": [ {"en":"...","ar":"..."} ],
      "points": [
        {
          "id": "Z01-C01",
          "cat": "C|I|L|T",
          "title": {"en":"...","ar":"..."},
          "instruction": {"en":"...","ar":"..."},
          "material": {"en":"...","ar":"..."} | null,      // cleaning agent / lubricant name / tool
          "lubricantId": "LUB1" | null,
          "method": "oil|grease|manual|automatic" | null,  // L only
          "quantity": "..." | null,                        // L only, from manual only
          "torque": "..." | null,                          // T only, from manual only
          "frequency": "per shift|daily|weekly|format change|... as stated" | null,
          "criteria": {"en":"...","ar":"..."} | null,      // acceptance / normal condition
          "abnormal": [ {"en":"...","ar":"..."} ],         // I only: what to look for
          "mandatory": true,
          "ref": "file, p.N",
          "validated": true|false,  "note": "..." ,  "demo": false,
          "marker": {"x":0.42,"y":0.31} | null            // optional relative position on zone image
        }
      ]
    }
  ],
  "sources_read": ["file: pages ..."],
  "gaps": ["what Engineering must still define"]
}
