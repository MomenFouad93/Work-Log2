/* Analysis coach knowledge base: engineering (process, packaging, utilities) + Operational Excellence. Generated 2026-11-17. */
/* KB File A - process equipment engineering knowledge (gran, blend, press, caps, coat)
 Servier Egypt Cairo site - Acacia building. Plain JS, no imports. */
(function () {
 var OW = {
 M: ["الصيانة", "Maintenance"], P: ["الإنتاج", "Production"], Q: ["الـQA", "QA"],
 E: ["الهندسة", "Engineering"], U: ["المرافق", "Utilities"], W: ["المخازن", "Warehouse"]
 };
 function m(ar, en, kind, impact, effort, o) {
 return { ar: ar, en: en, kind: kind, impact: impact, effort: effort, owner: { ar: OW[o][0], en: OW[o][1] } };
 }
 function c(ar, en, fish, tags, chk, why, cont, cms, kpi) {
 return {
 ar: ar, en: en, fish: fish, tags: tags,
 check: { ar: chk[0], en: chk[1] },
 why: why.map(function (w) { return { ar: w[0], en: w[1] }; }),
 cont: cont, cm: cms, kpi: kpi || []
 };
 }
 function s(id, ar, en, causes, tags) {
 var o = { id: id, ar: ar, en: en, causes: causes };
 if (tags) o.tags = tags;
 return o;
 }
 function p(ar, en) { return { ar: ar, en: en }; }

 var families = {
 gran: {
 ar: "تحبيب وتجفيف (HSG + FBD)", en: "Granulation (high shear + fluid bed)",
 symptoms: [
 s("a_gran_dp", "dP فلتر الـFBD عالي / الفلتر بيتسد", "FBD filter dP high / filter blockage",
 ["a_c_gr_bag_blind", "a_c_gr_shake", "a_c_material_var", "a_c_ahu_inlet"], ["contamination"]),
 s("a_gran_psd", "حجم الحبيبات (PSD) خارج المدى", "Granule size (PSD) out of range",
 ["a_c_gr_binder", "a_c_gr_mill", "a_c_gr_power", "a_c_material_var", "a_c_param_set"], ["defects"]),
 s("a_gran_endpoint", "الـend point (power/torque) مش بيتوصله أو بيتوصل بدري", "End point (power/torque) not reached or reached early",
 ["a_c_gr_power", "a_c_gr_binder", "a_c_material_var", "a_c_param_set"]),
 s("a_gran_motor", "عطل/فصل impeller أو chopper", "Impeller or chopper fault / trip",
 ["a_c_drive_trip", "a_c_gr_seal", "a_c_vfd_panel", "a_c_interlock"], ["electrical"]),
 s("a_gran_inlet", "حرارة/رطوبة هوا الـinlet مش بتوصل للـsetpoint", "Inlet air temperature/humidity not reaching setpoint",
 ["a_c_ahu_inlet", "a_c_steam_coil", "a_c_gr_fan", "a_c_sensor_pos"], ["utility_steam"]),
 s("a_gran_loss", "فقد منتج من الفلتر / بودرة في الـexhaust", "Product loss through filter / powder in exhaust",
 ["a_c_gr_bag_damage", "a_c_param_set", "a_c_gr_fan"], ["leak"]),
 s("a_gran_atex", "alarm الـATEX / explosion vent / earthing interlock", "ATEX / explosion vent / earthing interlock alarm",
 ["a_c_gr_atex", "a_c_interlock", "a_c_sensor_pos"], ["safety_guard"]),
 s("a_gran_dry", "التجفيف طويل أو الـLOD خارج المدى", "Long drying time or LOD out of limit",
 ["a_c_ahu_inlet", "a_c_steam_coil", "a_c_gr_fan", "a_c_gr_bag_blind", "a_c_gr_binder"], ["speed_loss"]),
 s("a_gran_fluid", "الـfluidization ضعيف / channeling / كتل في الـbowl", "Poor fluidization / channeling / lumps in bowl",
 ["a_c_gr_plate", "a_c_gr_fan", "a_c_gr_bag_blind", "a_c_material_var"])
 ],
 parts: [p("فلاتر الـFBD (filter bags)", "FBD filter bags"), p("cylinder/solenoid الـshaking", "Filter shaking cylinder / solenoid valve"),
 p("shaft seal الـimpeller/chopper", "Impeller/chopper shaft seal"), p("pump/nozzle الـbinder", "Binder pump tube / spray nozzle"),
 p("screen الـmill", "Mill screen"), p("الـair distributor plate / bottom screen", "Air distributor plate / bottom screen"),
 p("actuator الـdamper", "Damper actuator"), p("sensor حرارة/رطوبة", "Temperature / humidity sensor"),
 p("صمام البخار / الـtrap", "Steam control valve / trap"), p("مؤشر الـexplosion vent / كلامب الأرضي", "Explosion vent indicator / earthing clamp")]
 },
 blend: {
 ar: "خلاط Bohle (bin blender)", en: "Bohle bin blender",
 symptoms: [
 s("a_blend_lift", "عطل في رفع/تنزيل الـbin (lifting column)", "Bin lift / lowering fault (lifting column)",
 ["a_c_bl_column", "a_c_sensor_pos", "a_c_drive_trip", "a_c_interlock"], ["mechanical"]),
 s("a_blend_rot", "الدوران بيقف / الـdrive بيفصل", "Rotation stops / drive trips",
 ["a_c_drive_trip", "a_c_bl_gear", "a_c_vfd_panel", "a_c_interlock"], ["electrical"]),
 s("a_blend_pos", "interlock الـclamping/الـposition مش بيكمل", "Clamping / bin position interlock not made",
 ["a_c_bl_bin_pos", "a_c_bl_clamp", "a_c_sensor_pos"], ["sensor"]),
 s("a_blend_bu", "الـblend uniformity فاشل أو segregation", "Blend uniformity failure / segregation",
 ["a_c_bl_load", "a_c_material_var", "a_c_param_set", "a_c_sensor_pos"], ["defects"]),
 s("a_blend_valve", "butterfly valve الـbin بيسرب أو مش بيفتح", "Bin butterfly valve leaking or not opening",
 ["a_c_bl_valve", "a_c_air_low", "a_c_material_var"], ["leak"]),
 s("a_blend_noise", "صوت/vibration عالي وقت الدوران أو الرفع", "Noise / vibration during rotation or lift",
 ["a_c_bl_gear", "a_c_bl_column", "a_c_drive_trip"], ["vibration"]),
 s("a_blend_guard", "trip من باب الأمان / light curtain", "Safety door / light curtain trip",
 ["a_c_interlock", "a_c_sensor_pos"], ["safety_guard"])
 ],
 parts: [p("spindle/nut عمود الرفع", "Lifting column spindle / nut"), p("فرامل الرفع أو الدوران", "Lift or rotation brake"),
 p("gearbox الدوران", "Rotation gearbox"), p("cylinder الـclamping", "Bin clamping cylinder"),
 p("حساس proximity / limit switch", "Proximity / limit switch"), p("seal الـbutterfly valve", "Bin butterfly valve seal"),
 p("interlock switch الباب", "Door interlock switch"), p("موتور / VFD", "Motor / VFD")]
 },
 press: {
 ar: "مكبس أقراص (Fette / Sviac)", en: "Tablet press (Fette / Sviac)",
 symptoms: [
 s("a_press_weight", "وزن القرص خارج الحدود / variation عالي", "Tablet weight out of limits / high variation",
 ["a_c_pr_feeder", "a_c_material_var", "a_c_pr_punch_wear", "a_c_pr_force", "a_c_pr_segment", "a_c_pr_cam"], ["defects"]),
 s("a_press_hard", "الـhardness/thickness خارج المدى", "Hardness / thickness out of range",
 ["a_c_pr_comp", "a_c_pr_punch_wear", "a_c_material_var", "a_c_pr_force"], ["defects"]),
 s("a_press_cap", "القرص بيتقشر: capping / lamination", "Capping / lamination",
 ["a_c_pr_comp", "a_c_pr_die", "a_c_material_var", "a_c_pr_punch_wear"], ["defects"]),
 s("a_press_stick", "sticking / picking على وش الـpunch", "Sticking / picking on punch faces",
 ["a_c_pr_surface", "a_c_room_rh", "a_c_material_var", "a_c_pr_dust"], ["defects"]),
 s("a_press_tight", "punches تقيلة / alarm overload الـturret", "Tight punches / turret overload alarm",
 ["a_c_pr_punch_tight", "a_c_lub_central", "a_c_pr_die", "a_c_pr_cam"], ["mechanical"]),
 s("a_press_feeder", "مشكلة في الـforce feeder (alarm، بودرة بتطلع، مش بيملا)", "Force feeder trouble (alarm, powder spill, poor fill)",
 ["a_c_pr_feeder", "a_c_material_var", "a_c_drive_trip"], ["minor_stops"]),
 s("a_press_drive", "الـmain drive بيفصل overload", "Main drive overload trip",
 ["a_c_drive_trip", "a_c_pr_punch_tight", "a_c_vfd_panel", "a_c_lub_central"], ["electrical"]),
 s("a_press_lube", "alarm الـlubrication", "Lubrication alarm",
 ["a_c_lub_central", "a_c_lube_grade", "a_c_sensor_pos"], ["lubrication"]),
 s("a_press_chip", "الأقراص بتتكسر/بتتشرخ من الحرف (chipping)", "Tablet chipping / edge damage",
 ["a_c_pr_eject", "a_c_pr_punch_wear", "a_c_pr_comp", "a_c_material_var"], ["defects"]),
 s("a_press_reject", "rejects عالية من الـweight control", "High rejects from tablet weight control",
 ["a_c_pr_force", "a_c_reject_gate", "a_c_pr_feeder", "a_c_pr_segment", "a_c_material_var"], ["defects"])
 ],
 parts: [p("الـpunches والـdies", "Punches / dies"), p("paddles / motor الـforce feeder", "Force feeder paddles / motor"),
 p("الـcams والـpressure rollers", "Cams / pressure rollers"), p("dust cups / seals الـpunches", "Punch dust cups / seals"),
 p("pump / metering block الـlube", "Central lube pump / metering block"), p("حساس الـcompression force", "Compression force sensor (load cell)"),
 p("belt / VFD الـmain drive", "Main drive belt / VFD"), p("الـtake-off scraper والـchute", "Take-off scraper / chute"),
 p("die segment / مسامير الـdies", "Die segment (FE55) / die lock screws"), p("valve الـreject gate", "Reject gate valve")]
 },
 caps: {
 ar: "ماكينة كبسول MG2 Planeta", en: "Capsule filler MG2 Planeta",
 symptoms: [
 s("a_caps_weight", "وزن الكبسولة خارج الحدود / variation", "Capsule fill weight out of limits / variation",
 ["a_c_cp_dosing", "a_c_cp_bed", "a_c_material_var", "a_c_cp_weigh", "a_c_room_rh"], ["defects"]),
 s("a_caps_open", "الكبسولة مش بتفتح أو بتتشق", "Capsules not opening or splitting",
 ["a_c_cp_vac", "a_c_cp_shell", "a_c_cp_bush", "a_c_room_rh"], ["defects"]),
 s("a_caps_tele", "كبسول telescoped / مدغوط وقت القفل", "Telescoped / dented capsules at closing",
 ["a_c_cp_close", "a_c_cp_shell", "a_c_cp_bush"], ["defects"]),
 s("a_caps_dose", "مشكلة في الـdosing disc / tamping (بودرة بتسرب)", "Dosing disc / tamping issue (powder leakage)",
 ["a_c_cp_dosing", "a_c_material_var", "a_c_room_rh", "a_c_cp_bed"]),
 s("a_caps_vac", "alarm الـvacuum", "Vacuum fault alarm",
 ["a_c_cp_vac", "a_c_sensor_pos", "a_c_drive_trip"], ["utility_vacuum"]),
 s("a_caps_reject", "rejects عالية", "High capsule rejects",
 ["a_c_cp_weigh", "a_c_cp_vac", "a_c_cp_orient", "a_c_cp_shell", "a_c_reject_gate"], ["defects"]),
 s("a_caps_jam", "jam / overload في الـindexing", "Machine jam / indexing overload",
 ["a_c_cp_orient", "a_c_drive_trip", "a_c_lub_central", "a_c_cp_close"], ["minor_stops"])
 ],
 parts: [p("الـbushings (segments)", "Capsule bushings (segments)"), p("الـdosing disc والـbrass ring", "Dosing disc / brass ring"),
 p("الـtamping pins", "Tamping pins"), p("الـclosing pins", "Closing pins"), p("vacuum pump / فلتر / خراطيم", "Vacuum pump / filter / hoses"),
 p("صوابع الـrectifier / الـmagazine", "Rectifier fingers / magazine tubes"), p("level sensor البودرة", "Powder level sensor"),
 p("ميزان الـweight check", "Weight check balance")]
 },
 coat: {
 ar: "ماكينة تغليف (coating pan)", en: "Perforated pan coater",
 symptoms: [
 s("a_coat_gun", "الـspray gun بيسد أو بينقط", "Spray gun clogging or dripping",
 ["a_c_ct_nozzle", "a_c_ct_susp", "a_c_ct_atom", "a_c_ct_tube"], ["minor_stops"]),
 s("a_coat_pan", "الـpan مش بيلف / الـdrive بيفصل", "Pan not rotating / drive trip",
 ["a_c_drive_trip", "a_c_ct_belt", "a_c_vfd_panel", "a_c_interlock"], ["mechanical"]),
 s("a_coat_inlet", "حرارة الـinlet air مش بتوصل", "Inlet air temperature not reached",
 ["a_c_ahu_inlet", "a_c_steam_coil", "a_c_ct_damper", "a_c_sensor_pos"], ["utility_steam"]),
 s("a_coat_dp", "alarm الـexhaust dP / ضغط الـpan", "Exhaust filter dP / pan pressure alarm",
 ["a_c_ct_exh_filter", "a_c_ct_damper", "a_c_drive_trip"], ["contamination"]),
 s("a_coat_twin", "أقراص لازقة في بعض: twinning / sticking / picking", "Twinning / sticking / picking",
 ["a_c_ct_balance", "a_c_ct_gun_pos", "a_c_ct_atom", "a_c_ct_flow"], ["defects"]),
 s("a_coat_peel", "orange peel / سطح خشن / spray drying", "Orange peel / rough surface / spray drying",
 ["a_c_ct_balance", "a_c_ct_atom", "a_c_ct_susp", "a_c_ct_gun_pos"], ["defects"]),
 s("a_coat_pump", "flow الـperistaltic pump مش ثابت / واطي", "Peristaltic pump flow low or unstable",
 ["a_c_ct_tube", "a_c_ct_flow", "a_c_ct_susp"]),
 s("a_coat_color", "لون/تغطية مش متساوية أو اختلاف وزن الـcoat", "Uneven color / coverage or weight gain variation",
 ["a_c_ct_gun_pos", "a_c_ct_nozzle", "a_c_ct_balance", "a_c_ct_flow", "a_c_material_var"], ["defects"])
 ],
 parts: [p("الـnozzle والـneedle والـair cap", "Spray nozzle / needle / air cap"), p("tube الـperistaltic", "Peristaltic pump tube"),
 p("رأس الـpump والـrollers", "Pump head / rollers"), p("عداد الـflow", "Spray flowmeter"), p("cartridges فلتر الـexhaust", "Exhaust filter cartridges"),
 p("actuator الـdamper", "Damper actuator"), p("belt / gearbox الـpan", "Pan drive belt / gearbox"),
 p("probe حرارة الـinlet", "Inlet air temperature probe"), p("regulator الـatomizing air", "Atomizing air regulator"),
 p("interlock switch الباب", "Door interlock switch")]
 }
 };

 var causes = {
 /* ---------- shared ---------- */
 a_c_material_var: c("تغير في خواص الخامة/الحبيبات/الـcores (PSD، رطوبة، flow)", "Material/granule/core property shift (PSD, moisture, flow)",
 "materials", ["new_material_batch", "supplier", "defects"],
 ["قارن LOD وPSD للباتش ده بباتشات كانت كويسة، وراجع الـCoA", "Compare LOD/PSD of this batch with good batches; review CoA"],
 [["الحبيبات فيها fines زيادة أو رطوبة خارج المدى", "Granule has excess fines or moisture out of range"],
 ["خطوة التحبيب/التجفيف أو الخامة الجاية اتغيرت", "Granulation/drying step or incoming raw material varied"],
 ["مفيش check لـPSD/LOD قبل ما يتسلم للمرحلة اللي بعدها", "No PSD/LOD release check before handing to next step"],
 ["الـspec مع المورد مش بيغطي الخاصية دي", "Supplier spec does not cover this property"]],
 ["a_cm_t_ipc", "a_cm_t_segregate"], ["a_cm_mat_spec", "a_cm_upstream_ipc"], ["a_k_reject"]),

 a_c_room_rh: c("رطوبة/حرارة الأوضة عالية (HVAC)", "Room humidity/temperature too high (HVAC)",
 "nature", ["env_heat_humidity"],
 ["اقرا RH والحرارة من الـBMS للأوضة وقت المشكلة وقارنها بالـlimit", "Read room RH/temperature trend in BMS at event time vs limit"],
 [["المنتج أو الكبسول شرب رطوبة من الجو", "Product or shells absorbed moisture from room air"],
 ["الـAHU/dehumidifier مش موصل الـdew point", "AHU/dehumidifier not reaching dew point"],
 ["مفيش alarm أو hold limit للـRH عند الماكينة", "No RH alarm or hold limit at the machine"],
 ["أداء الـdehumidifier مش متقاس في الـPM", "Dehumidifier performance not checked in PM plan"]],
 ["a_cm_t_hold"], ["a_cm_hvac_alarm", "a_cm_ahu_pm"], ["a_k_rh_exc"]),

 a_c_ahu_inlet: c("وحدة هوا الـprocess مش بتوصل للحرارة/الـdew point", "Process air unit not reaching inlet temperature/dew point",
 "machines", ["utility_steam", "env_heat_humidity", "wear_age"],
 ["قارن setpoint بالـactual للـinlet temp والـdew point؛ افحص الـheater والـdehumidifier", "Compare inlet temp/dew point setpoint vs actual; inspect heater and dehumidifier"],
 [["سعة التسخين أو نزع الرطوبة أقل من المطلوب", "Heating or dehumidification capacity too low"],
 ["الـcoil متسخ أو الـwheel ضعف أو الفلاتر محملة", "Coil fouled, desiccant wheel degraded or filters loaded"],
 ["الـPM بيغير فلاتر بس من غير performance check", "PM changes filters only, no performance check"],
 ["مفيش trend لأداء الوحدة يدي إنذار بدري", "No unit performance trend to give early warning"]],
 ["a_cm_t_hold"], ["a_cm_ahu_pm", "a_cm_hvac_alarm"], ["a_k_dry_time"]),

 a_c_steam_coil: c("مشكلة في البخار: control valve أو steam trap أو ضغط", "Steam supply, control valve or trap fault on heater coil",
 "machines", ["utility_steam", "leak", "wear_age"],
 ["شوف ضغط البخار عند الماكينة وفتحة الـvalve %؛ اتأكد الـtrap مش مقفول أو بيسرب", "Check steam pressure at unit and valve % open; check trap not blocked or passing"],
 [["الـcoil مليان condensate أو الـvalve مش بيفتح للآخر", "Coil flooded with condensate or valve not fully opening"],
 ["الـtrap باظ أو الـpositioner عمل drift", "Steam trap failed or valve positioner drifted"],
 ["مفيش trap survey ولا PM/calibration للـcontrol valves", "No steam trap survey or control valve PM/calibration"]],
 ["a_cm_t_hold"], ["a_cm_steam_pm", "a_cm_ahu_pm"], ["a_k_dry_time"]),

 a_c_air_low: c("ضغط الهوا المضغوط واطي أو الهوا فيه مية/زيت", "Compressed air pressure low or wet/oily at machine",
 "machines", ["utility_air", "pneumatic"],
 ["اقرا الـmanometer عند مدخل الماكينة وهي شغالة؛ افتح drain الـFRL وشوف فيه مية؟", "Read inlet gauge under load; open FRL drain and check for water"],
 [["الضغط بيقع وقت الحمل أو في مية في الخطوط", "Pressure drops under load or water in lines"],
 ["فلتر الـFRL مسدود أو الـdryer مش شغال كويس", "FRL filter clogged or air dryer underperforming"],
 ["drain الـFRL والـdryer مش في الـPM", "FRL/dryer drains not in PM plan"],
 ["مفيش pressure switch يدي alarm عند الماكينة", "No low-pressure switch/alarm at machine inlet"]],
 ["a_cm_t_clean"], ["a_cm_air_ps", "a_cm_air_dryer"], ["a_k_minor_stops"]),

 a_c_drive_trip: c("الـmotor/VFD بيفصل overload من حمل ميكانيكي (bearing، gearbox، فرامل)", "Motor/VFD overload from mechanical drag (bearing, gearbox, brake)",
 "machines", ["mechanical", "electrical", "overheating", "wear_age"],
 ["اقرا fault code والـcurrent من الـVFD؛ بعد LOTO لف بالإيد وحس بأي تقل أو صوت", "Read VFD fault code and current; after LOTO turn by hand, feel drag or noise"],
 [["تيار الـmotor أعلى من المقنن", "Motor current above rated value"],
 ["bearing أو gearbox فيه wear أو الفرامل مش بتفك", "Bearing/gearbox wear or brake not releasing"],
 ["مفيش vibration/thermography يكشف التدهور بدري", "No vibration/thermography to detect degradation early"],
 ["الـPM بالوقت بس من غير CBM على الـdrives الحرجة", "PM is time-based only, no CBM on critical drives"]],
 ["a_cm_t_replace"], ["a_cm_vibration", "a_cm_gearbox_oil"], ["a_k_mtbf"]),

 a_c_vfd_panel: c("الـpanel سخن أو عطل في الـVFD نفسه (fan، parameters)", "Drive panel overheating or VFD fault (fan, parameters)",
 "machines", ["electrical", "overheating", "env_dust"],
 ["قيس حرارة الـpanel، شوف فلتر ومروحة الـpanel، اقرا fault history في الـVFD", "Measure panel temperature, check panel fan/filter, read VFD fault history"],
 [["الـVFD بيفصل overtemperature", "VFD trips on overtemperature"],
 ["فلتر الـpanel مسدود تراب أو المروحة واقفة", "Panel filter clogged with dust or fan failed"],
 ["تبريد الـpanels مش في الـPM ومفيش thermography", "Panel cooling not in PM; no thermography"]],
 ["a_cm_t_clean"], ["a_cm_vfd_cabinet", "a_cm_spares_spec"], ["a_k_mtbf"]),

 a_c_sensor_pos: c("Sensor (proximity/limit/switch) متحرك أو متسخ أو الـcable تعبان", "Sensor/switch misaligned, dirty or damaged cable",
 "machines", ["sensor", "alignment", "after_cleaning"],
 ["شوف LED الـsensor مع حركة الجزء؛ قيس المسافة وقارنها بالـdata sheet؛ هز الـcable", "Watch sensor LED as part moves; measure gap vs data sheet; flex cable"],
 [["الـsensor مش بيقرا بثبات", "Sensor does not detect reliably"],
 ["الـbracket اتحرك بعد التنضيف أو بودرة على وش الـsensor", "Bracket moved during cleaning or powder on sensor face"],
 ["bracket بفتحات slotted من غير علامة، ومفيش function check", "Slotted bracket with no mark; no function check in AM"],
 ["التصميم مش mistake-proof ومفيش check في الـCIL", "Design not mistake-proof and check missing from CIL"]],
 ["a_cm_t_sensor"], ["a_cm_sensor_bracket", "a_cm_sensor_pm"], ["a_k_minor_stops"]),

 a_c_interlock: c("Interlock باب الأمان: switch مش متظبط أو الـactuator مكسور", "Safety door interlock switch misaligned or actuator damaged",
 "machines", ["safety_guard", "sensor", "alignment"],
 ["افتح وقفل كل باب لوحده وشوف الـHMI بيقول أنهي switch؛ افحص الـactuator والمفصلات", "Test each door; note which switch HMI shows; inspect actuator and hinges"],
 [["الـinterlock بيفتح وقت التشغيل", "Interlock opens during run"],
 ["الباب نازل من المفصلات أو الـactuator اتعوج", "Door sagging on hinges or actuator bent"],
 ["مفيش اختبار دوري للـinterlocks وضبط الأبواب", "No periodic interlock test and door alignment check"]],
 ["a_cm_t_sensor"], ["a_cm_interlock_test", "a_cm_sensor_bracket"], ["a_k_minor_stops"]),

 a_c_lub_central: c("عطل في الـcentral lubrication (خزان فاضي، line مسدود، pump)", "Central lubrication fault (empty reservoir, blocked line, pump)",
 "machines", ["lubrication", "wear_age"],
 ["شوف مستوى الخزان، شغل cycle يدوي وتأكد الزيت/الشحم واصل لكل نقطة", "Check reservoir level, run manual cycle, confirm lube reaches each point"],
 [["نقط التزييت ناشفة", "Lube points running dry"],
 ["الـmetering block مسدود أو الخزان ماتملاش", "Metering block blocked or reservoir not refilled"],
 ["الـalarm على المستوى بس، مش على الضغط/الـflow", "Alarm on level only, not on line pressure/flow"],
 ["فحص نظام التزييت مش موجود في الـCIL/PM", "Lube system check missing from CIL/PM"]],
 ["a_cm_t_clean"], ["a_cm_lube_alarm", "a_cm_lube_pm", "a_cm_cil"], ["a_k_mtbf"]),

 a_c_lube_grade: c("زيت/شحم مش مطابق للـspec (grade أو H1 food grade)", "Wrong lubricant grade or not H1 food grade",
 "materials", ["lubrication", "non_oem_part", "supplier"],
 ["قارن اسم الزيت على البرميل/الخرطوشة بالـlube chart بتاع الـOEM", "Compare lubricant label with OEM lube chart"],
 [["الـviscosity غلط فبيسد الـvalves أو الـfilm ضعيف", "Wrong viscosity blocks metering valves or film too weak"],
 ["اتشرى بديل من غير موافقة هندسية", "Alternative bought without engineering approval"],
 ["مفيش lube master list مربوط بالمشتريات", "No lubricant master list linked to purchasing"]],
 ["a_cm_t_replace"], ["a_cm_lube_list", "a_cm_spares_spec"]),

 a_c_param_set: c("الـparameters مش مطابقة للـvalidated recipe", "Process parameters not at validated recipe values",
 "methods", ["setting_change", "procedure_gap", "plc_software"],
 ["قارن الـparameters على الـHMI بالـbatch record؛ شوف الـaudit trail مين غيّر إيه", "Compare HMI parameters with batch record; review audit trail"],
 [["parameter اتغير وقت التشغيل علشان يلحق الـIPC", "Parameter changed during run to chase IPC"],
 ["المدى المسموح مش واضح في الـBMR", "Allowed range not clear in batch record"],
 ["الـrecipe مش مقفولة بـaccess levels", "Recipe not locked with access levels"]],
 ["a_cm_t_adjust", "a_cm_t_segregate"], ["a_cm_recipe_lock", "a_cm_setup_sheet"], ["a_k_reject"]),

 a_c_reject_gate: c("الـreject gate / air blast مش شغال صح", "Reject gate or air blast not working correctly",
 "machines", ["pneumatic", "utility_air", "sensor"],
 ["اعمل challenge test: علّم reject وشوف هيروح الـreject chute؛ افحص الـvalve والضغط", "Run challenge test: force a reject, confirm it diverts; check valve and pressure"],
 [["كويس بيترفض أو reject بيعدي", "Good product rejected or rejects passing"],
 ["الـvalve بطيء أو sensor الـgate بايظ", "Valve slow or gate position sensor faulty"],
 ["مفيش test للـreject system في بداية الباتش", "No reject system challenge test at batch start"]],
 ["a_cm_t_segregate"], ["a_cm_reject_test", "a_cm_air_ps"], ["a_k_reject"]),

 /* ---------- granulation ---------- */
 a_c_gr_bag_blind: c("فلاتر الـFBD مسدودة (blinding)", "FBD filter bags blinded",
 "machines", ["contamination", "wear_age", "env_dust"],
 ["شوف الـfilter dP مع الوقت في الـbatch report؛ افحص الـbags: بودرة لازقة أو مبلولة", "Check filter dP trend in batch report; inspect bags for caked or wet powder"],
 [["الـairflow بيقل والـdP بيعلى", "Airflow drops and dP rises"],
 ["fines ورطوبة عملوا cake على القماش", "Fines and moisture cake the fabric"],
 ["الـbags بتتغير/تتغسل بالتاريخ مش بالحالة", "Bags washed/changed by calendar, not condition"],
 ["مفيش limit للـdP أو عدد باتشات لتغيير الـbags", "No dP or batch-count limit for bag change"]],
 ["a_cm_t_filter"], ["a_cm_filter_life", "a_cm_dp_alarm"], ["a_k_dp"]),

 a_c_gr_shake: c("الـfilter shaking/blow-back مش شغال (cylinder/valve)", "Filter shaking or blow-back not working (cylinder/valve)",
 "machines", ["pneumatic", "utility_air", "wear_age"],
 ["شغل shaking يدوي وشوف الحركة/النبضة؛ افحص الـsolenoid والـcylinder والضغط", "Run manual shake; watch stroke/pulse; check solenoid, cylinder, pressure"],
 [["الـcake مش بيقع من على الـbags", "Cake not released from bags"],
 ["seal الـcylinder أو الـsolenoid باظ", "Cylinder seal or solenoid valve failed"],
 ["ميكانيزم الـshaking مالوش task في الـPM", "Shaking mechanism has no PM task"]],
 ["a_cm_t_clean"], ["a_cm_shake_pm", "a_cm_air_ps"], ["a_k_dp"]),

 a_c_gr_bag_damage: c("Filter bag مقطوع أو مش متركب صح (clamp/seal)", "Filter bag torn or not fitted correctly (clamp/seal)",
 "machines", ["wear_age", "after_cleaning", "leak"],
 ["افحص الـbags على نور، شوف الـclamp والـO-ring؛ شوف بودرة في الـexhaust duct", "Inspect bags against light, check clamp/O-ring; look for powder in exhaust duct"],
 [["المنتج بيعدي للـexhaust", "Product passes to exhaust"],
 ["الـbag اتقطع من الغسيل/الـshaking أو الـclamp مش قاعد", "Bag torn by washing/shaking or clamp not seated"],
 ["مفيش integrity check للـbag قبل التركيب", "No bag integrity check before installation"],
 ["مفيش broken bag detection على الـexhaust", "No broken-bag detection on exhaust"]],
 ["a_cm_t_filter", "a_cm_t_segregate"], ["a_cm_bag_detect", "a_cm_filter_life"], ["a_k_yield"]),

 a_c_gr_binder: c("إضافة الـbinder: الـpump أو الـnozzle أو المعدل مش ثابت", "Binder addition rate, pump or nozzle not consistent",
 "machines", ["calibration", "setting_change", "wear_age"],
 ["اعمل test بالمية: قيس الكمية في الوقت مقابل الـsetpoint؛ افحص الـnozzle والـtube", "Water test: weigh delivered amount vs setpoint over time; check nozzle and tube"],
 [["over-wetting أو under-wetting للـmass", "Mass over- or under-wetted"],
 ["flow الـpump عمل drift أو الـnozzle نص مسدود", "Pump flow drifted or nozzle partly blocked"],
 ["مفيش check للـpump قبل الباتش", "No pre-batch pump flow check"]],
 ["a_cm_t_adjust"], ["a_cm_binder_cal", "a_cm_tube_pm"], ["a_k_yield"]),

 a_c_gr_power: c("قياس الـpower/torque للـimpeller (end point) مش دقيق", "Impeller power/torque end-point measurement inaccurate",
 "measurement", ["calibration", "sensor"],
 ["شغل الـbowl فاضي وقارن الـno-load power بالمرجع؛ شوف آخر calibration للـtransducer", "Run empty bowl, compare no-load power to reference; check transducer calibration date"],
 [["الـend point بيتوصل بدري أو متأخر", "End point reached early or late"],
 ["الـtransducer عمل drift أو الـno-load baseline اتغير", "Transducer drifted or no-load baseline changed"],
 ["الـtransducer مش في خطة الـcalibration", "Transducer not in calibration plan"],
 ["الـend point رقم ثابت من غير baseline correction", "End point is a fixed value without baseline correction"]],
 ["a_cm_t_ipc"], ["a_cm_power_cal", "a_cm_endpoint_std"], ["a_k_yield"]),

 a_c_gr_seal: c("shaft seal الـimpeller/chopper دايب أو الـpurge air ضعيف", "Impeller/chopper shaft seal worn or purge air low",
 "machines", ["leak", "wear_age", "utility_air", "contamination"],
 ["شوف ضغط/flow الـpurge air؛ افحص بودرة حوالين الـshaft وتحت الـbowl", "Check purge air pressure/flow; look for powder around shaft and under bowl"],
 [["بودرة دخلت الـseal فزودت الاحتكاك والحرارة", "Powder entered seal, raising friction and heat"],
 ["ضغط الـpurge air قليل والـseal دايب", "Purge air low and seal worn"],
 ["الـseal بيتغير لما يبوظ، مفيش تكرار", "Seal replaced on failure only, no frequency"],
 ["مفيش interlock على ضغط الـpurge قبل الـstart", "No purge air pressure interlock before start"]],
 ["a_cm_t_clean"], ["a_cm_purge_ps", "a_cm_seal_pm"], ["a_k_mtbf"]),

 a_c_gr_fan: c("الـexhaust fan أو الـdamper مدي airflow أقل", "Exhaust fan or damper giving low airflow",
 "machines", ["mechanical", "electrical", "vibration"],
 ["قارن airflow setpoint بالـactual؛ شوف وضع الـdamper الفعلي والـbelt/VFD بتاع الـfan", "Compare airflow setpoint vs actual; check real damper position and fan belt/VFD"],
 [["الـfluidization ضعيف والتجفيف طويل", "Weak fluidization, long drying"],
 ["actuator الـdamper لازق أو الـbelt بيفوت", "Damper actuator sticking or fan belt slipping"],
 ["مفيش calibration للـairflow sensor ولا فحص stroke", "No airflow sensor calibration or damper stroke check"]],
 ["a_cm_t_adjust"], ["a_cm_airflow_cal", "a_cm_vibration"], ["a_k_dry_time"]),

 a_c_gr_plate: c("الـair distributor plate / bottom screen مسدود", "Air distributor plate / bottom screen blocked",
 "machines", ["contamination", "after_cleaning"],
 ["افحص الـplate على نور بعد التنضيف؛ شوف ثقوب مسدودة بمنتج ناشف", "Inspect plate against light after cleaning; look for holes blocked by dried product"],
 [["الهوا مش متوزع فبيعمل channeling", "Air not distributed, causing channeling"],
 ["منتج ناشف فضل في الثقوب بعد الغسيل", "Dried product left in holes after washing"],
 ["الـcleaning procedure مالوش inspection للـplate", "Cleaning procedure has no plate inspection step"]],
 ["a_cm_t_clean"], ["a_cm_plate_clean", "a_cm_cil"], ["a_k_dry_time"]),

 a_c_gr_atex: c("جهاز حماية الانفجار (vent، suppression، earthing) عامل alarm", "Explosion protection device alarm (vent, suppression, earthing)",
 "machines", ["safety_guard", "sensor", "electrical"],
 ["شوف أنهي device عامل الـalarm؛ افحص vent indicator، الـearthing clamp، ضغط الـsuppressor", "Identify device in HMI; check vent indicator, earthing clamp, suppressor pressure"],
 [["الـinterlock فاتح فالماكينة مش بتبدأ", "Interlock open, machine will not start"],
 ["الـearthing clamp مش متركب أو cable sensor الـvent متقطع", "Earthing clamp not connected or vent sensor cable damaged"],
 ["فحص الأجهزة دي مش مجدول حسب الـOEM", "Device inspection not scheduled per OEM"],
 ["مفيش register لأجهزة الحماية من الانفجار", "No explosion-protection device register"]],
 ["a_cm_t_hold"], ["a_cm_atex_test", "a_cm_interlock_test"], ["a_k_mtbf"]),

 a_c_gr_mill: c("screen الـmill دايب أو مقاسه غلط أو السرعة مش مظبوطة", "Mill screen worn or wrong size, or wrong mill speed",
 "machines", ["wear_age", "after_changeover", "setting_change"],
 ["افحص الـscreen: المقاس مكتوب عليه؟ في قطع أو تآكل؟ قارن السرعة بالـrecipe", "Inspect screen: size marked? torn or worn? compare speed with recipe"],
 [["حجم الحبيبات خارج المدى", "Granule size out of range"],
 ["screen غلط أو تالف اتركب", "Wrong or damaged screen fitted"],
 ["الـscreens مش متعلمة ومفيش فحص قبل/بعد الاستخدام", "Screens not identified; no check before/after use"]],
 ["a_cm_t_replace", "a_cm_t_segregate"], ["a_cm_screen_std", "a_cm_recipe_lock"], ["a_k_yield"]),

 /* ---------- blender ---------- */
 a_c_bl_column: c("عمود الرفع: spindle/nut أو فرامل أو limit switch", "Lifting column spindle/nut, brake or limit switch fault",
 "machines", ["mechanical", "wear_age", "lubrication"],
 ["اسمع صوت الرفع، شوف الـlimit switches وgap الفرامل، افحص تشحيم الـspindle", "Listen during lift; check limit switches, brake gap and spindle greasing"],
 [["الرفع بيقف أو بيعمل overload", "Lift stops or overloads"],
 ["الـspindle ناشف/دايب أو الفرامل مش بتفك", "Spindle dry/worn or brake not releasing"],
 ["تشحيم الـspindle وفحص الفرامل مش في الـPM", "Spindle greasing and brake check not in PM"]],
 ["a_cm_t_hold"], ["a_cm_column_pm", "a_cm_vibration"], ["a_k_mtbf"]),

 a_c_bl_clamp: c("تثبيت الـbin (clamping) ضغطه ضعيف أو مش بيوصل للـposition", "Bin clamping pressure low or not reaching position",
 "machines", ["pneumatic", "utility_air", "sensor"],
 ["شوف ضغط الهوا عند الـclamping valve وحركة الـcylinders والـsensors بتاعتها", "Check air pressure at clamp valve, cylinder stroke and end sensors"],
 [["الـclamp مش بيقفل فالـinterlock مش بيكمل", "Clamp does not close, interlock not made"],
 ["seal الـcylinder بيسرب أو الضغط واطي", "Cylinder seal leaking or supply pressure low"],
 ["مفيش leak check للـcylinders في الـPM", "No cylinder leak check in PM"]],
 ["a_cm_t_sensor"], ["a_cm_air_ps", "a_cm_sensor_pm"], ["a_k_minor_stops"]),

 a_c_bl_bin_pos: c("الـbin مش متحط في مكانه بالظبط تحت الخلاط", "Bin not placed within position tolerance under blender",
 "methods", ["handling", "design_weakness"],
 ["قيس إزاحة الـbin عن العلامات على الأرض؛ شوف الـsensors بتشوف الـbin؟", "Measure bin offset from floor marks; check position sensors see the bin"],
 [["الـposition interlock مش بيكمل", "Position interlock not made"],
 ["الـbin بيتحط بالـpallet truck بالعين", "Bin placed by pallet truck by eye"],
 ["مفيش guides أو stops على الأرض (design)", "No floor guides or stops (design weakness)"]],
 ["a_cm_t_adjust"], ["a_cm_bin_guide", "a_cm_opl"], ["a_k_minor_stops"]),

 a_c_bl_gear: c("gearbox أو فرامل الدوران فيها wear أو الزيت قليل", "Rotation gearbox or brake worn / low oil",
 "machines", ["lubrication", "wear_age", "vibration"],
 ["شوف مستوى ولون زيت الـgearbox، اسمع صوت، قيس الحرارة والـvibration", "Check gearbox oil level/colour, listen, measure temperature and vibration"],
 [["حمل زيادة وصوت في الدوران", "Extra load and noise in rotation"],
 ["الزيت قديم/قليل والتروس أو الـbearings دايبة", "Oil old/low and gears or bearings worn"],
 ["تغيير الزيت وتحليله مش في الـPM", "Oil change/analysis not in PM"]],
 ["a_cm_t_hold"], ["a_cm_gearbox_oil", "a_cm_vibration"], ["a_k_mtbf"]),

 a_c_bl_load: c("الـblend time/rpm أو ترتيب/نسبة ملء الـbin مش حسب الـstandard", "Blend time/rpm, loading order or bin fill level not per standard",
 "methods", ["procedure_gap", "setting_change"],
 ["قارن عدد اللفات والـrpm بالـBMR؛ احسب نسبة ملء الـbin وشوف ترتيب الإضافة", "Compare rotations/rpm with BMR; calculate bin fill % and loading order"],
 [["الخلط مش متجانس", "Blend not homogeneous"],
 ["الـbin متملي زيادة أو premix اتشال", "Bin overfilled or premix step skipped"],
 ["تعليمات التحميل مالهاش حد ملء ولا ترتيب", "Loading instruction has no fill limit or order"]],
 ["a_cm_t_segregate"], ["a_cm_recipe_lock", "a_cm_load_std"], ["a_k_bu"]),

 a_c_bl_valve: c("butterfly valve الـbin: seal دايب أو actuator", "Bin butterfly valve seal worn or actuator fault",
 "machines", ["leak", "pneumatic", "wear_age"],
 ["افحص الـseal (تشققات/انتفاخ)، شغل الـactuator يدوي وشوف الفتح الكامل", "Inspect seal for cracks/swelling; operate actuator, confirm full stroke"],
 [["بودرة بتسرب أو الـvalve مش بيفتح", "Powder leaks or valve does not open"],
 ["الـseal اتعب من الغسيل والتسخين", "Seal degraded by washing and drying cycles"],
 ["تغيير الـseal مالوش تكرار", "Seal change has no defined frequency"]],
 ["a_cm_t_replace"], ["a_cm_valve_seal", "a_cm_air_ps"], ["a_k_minor_stops"]),

 /* ---------- tablet press ---------- */
 a_c_pr_feeder: c("الـforce feeder: paddles دايبة أو gap مع الـdie table غلط أو السرعة", "Force feeder paddle wear, wrong table clearance or speed",
 "machines", ["mechanical", "wear_age", "setting_change"],
 ["قيس الـgap بين الـfeeder والـdie table بالـfeeler؛ افحص الـpaddles وسرعة الـfeeder", "Measure feeder-to-table gap with feeler; check paddles and feeder speed"],
 [["ملء الـdies مش منتظم", "Die fill not uniform"],
 ["الـpaddles دايبة أو الـgap كبير", "Paddles worn or clearance too large"],
 ["الـgap مش بيتقاس في الـsetup ولا الـPM", "Clearance not measured at setup or PM"],
 ["مفيش قيمة gap مكتوبة في الـsetup sheet", "No gap value in setup sheet"]],
 ["a_cm_t_adjust", "a_cm_t_ipc"], ["a_cm_feeder_pm", "a_cm_setup_sheet"], ["a_k_rsd"]),

 a_c_pr_punch_wear: c("الـpunches دايبة أو الـworking length مختلف", "Punch tips worn or working length variation",
 "machines", ["wear_age", "mechanical"],
 ["قيس الـworking length بالـpunch gauge وافحص الـtips بعدسة؛ قارن بالـpunch log", "Measure working length with gauge, inspect tips with loupe; compare punch log"],
 [["الأطوال مختلفة أكتر من الـtolerance", "Lengths differ beyond tolerance"],
 ["الـpunches اشتغلت بعد عمرها", "Punches used beyond their life"],
 ["مفيش قياس بين الـcampaigns", "No measurement between campaigns"],
 ["مفيش tooling management standard في الـPM", "No tooling management standard in PM plan"]],
 ["a_cm_t_replace", "a_cm_t_ipc"], ["a_cm_punch_log", "a_cm_punch_store"], ["a_k_tool_life", "a_k_rsd"]),

 a_c_pr_punch_tight: c("الـpunches تقيلة في الـguides (بودرة، تزييت، dust seals)", "Tight punches in guides (powder ingress, dry guides, seals)",
 "machines", ["lubrication", "contamination", "mechanical"],
 ["بعد LOTO لف الـturret بالإيد وحرك كل punch؛ شوف بودرة على الـbarrel والـdust cups", "After LOTO turn turret by hand, move each punch; check powder on barrels/dust cups"],
 [["احتكاك عالي في الـguides", "High friction in punch guides"],
 ["بودرة دخلت الـguides", "Powder entered the guides"],
 ["الـdust cups/seals دايبة والزيت مش مناسب", "Dust cups/seals worn, wrong punch oil"],
 ["تغيير الـseals وتنضيف الـpunches مالهمش standard", "No standard for seal change and punch cleaning"]],
 ["a_cm_t_clean"], ["a_cm_dust_seal", "a_cm_punch_store", "a_cm_cil"], ["a_k_mtbf"]),

 a_c_pr_cam: c("الـcams أو الـpressure rollers فيها wear أو تنقير", "Worn or pitted cams / pressure rollers",
 "machines", ["wear_age", "mechanical", "vibration"],
 ["افحص سطح الـcam track والـrollers؛ اسمع صوت عند نقطة ثابتة في اللفة", "Inspect cam track and rollers; listen for noise at a fixed turret position"],
 [["حركة الـpunch مش منتظمة", "Punch movement irregular"],
 ["سطح الـcam اتآكل أو اتنقر", "Cam surface worn or pitted"],
 ["تزييت الـcams ضعيف ومحدش بيفحصها", "Cam lubrication marginal and not inspected"],
 ["فحص الـcams مش في الـoverhaul السنوي", "Cam inspection not in annual overhaul"]],
 ["a_cm_t_ipc"], ["a_cm_cam_pm", "a_cm_lube_pm"], ["a_k_mtbf"]),

 a_c_pr_force: c("drift في الـforce sensor أو الـweight control مش متظبط", "Compression force sensor drift or weight control mistuned",
 "measurement", ["calibration", "sensor", "plc_software"],
 ["قارن متوسط وزن الـIPC بقراءة الـforce؛ شوف آخر calibration والـcontrol parameters", "Compare IPC mean weight with force reading; check last calibration and loop settings"],
 [["الماكينة بتصحح الوزن غلط", "Machine corrects weight in wrong direction"],
 ["إشارة الـforce عملت drift أو الـgain مش مناسب للمنتج", "Force signal drifted or gain not product-specific"],
 ["الـcalibration interval طويل", "Calibration interval too long"],
 ["parameters الـcontrol مش في الـproduct recipe", "Control parameters not in product recipe"]],
 ["a_cm_t_ipc"], ["a_cm_force_cal", "a_cm_wc_tune"], ["a_k_rsd", "a_k_reject"]),

 a_c_pr_die: c("الـdies دايبة (ring) أو مش flush مع الـtable", "Worn dies (ring) or dies not seated flush with table",
 "machines", ["wear_age", "mechanical", "after_changeover"],
 ["افحص bore الـdie بعدسة وصباعك؛ مرر dial gauge على الـtable تشوف die طالع", "Check die bore with loupe/finger; run dial gauge over table for raised dies"],
 [["الـring بيعمل capping أو الـpunch بيخبط", "Die ring causes capping or punch contact"],
 ["الـdies مش بتتقاس/تتقلب، وعزم الـlock screws مش محدد", "Dies not measured/rotated; lock screw torque undefined"],
 ["مفيش standard لفحص وتركيب الـdies", "No die inspection and installation standard"]],
 ["a_cm_t_replace"], ["a_cm_punch_log", "a_cm_setup_sheet"], ["a_k_tool_life"]),

 a_c_pr_comp: c("الـpre/main compression أو السرعة مش مناسبين للمنتج", "Pre/main compression or speed not suited to product",
 "methods", ["setting_change", "speed_loss"],
 ["شوف pre/main force والسرعة على الـHMI؛ زود الـprecompression جوه المدى وراقب", "Check pre/main force and speed; raise precompression within range and observe"],
 [["هوا محبوس في القرص فبيعمل capping/hardness مش ثابت", "Entrapped air causes capping / unstable hardness"],
 ["الـdwell time قصير مع السرعة أو الـprecompression واطي", "Dwell time short at speed or precompression low"],
 ["المدى الـvalidated مش مستخدم كنقطة بداية", "Validated window not used as starting point"],
 ["الـdesign space مش متعرف في الـrecipe", "Design space not defined in recipe"]],
 ["a_cm_t_adjust", "a_cm_t_segregate"], ["a_cm_recipe_lock", "a_cm_setup_sheet"], ["a_k_reject"]),

 a_c_pr_surface: c("وش الـpunch أو الـembossing فيه خدوش أو مش متلمع", "Punch face/embossing scratched or not polished",
 "machines", ["wear_age", "contamination"],
 ["افحص وش الـpunch والـlogo بعدسة؛ شوف هل نفس الـpunches بتلزق كل مرة", "Inspect faces/embossing with loupe; check if same stations stick each time"],
 [["المنتج بيلزق في السطح الخشن", "Product adheres to rough surface"],
 ["الـpunches مش بتتلمع أو اتخزنت ناشفة واتأكسدت", "Punches not polished or stored dry and corroded"],
 ["مفيش standard تلميع وتخزين", "No polishing and storage standard"],
 ["للمنتجات اللازقة مفيش tooling coated", "No coated tooling specified for sticky products"]],
 ["a_cm_t_clean"], ["a_cm_punch_coat", "a_cm_punch_store"], ["a_k_reject"]),

 a_c_pr_eject: c("الـtake-off scraper أو ارتفاع الـejection أو الـchute مش مظبوط", "Take-off scraper, ejection height or chute misadjusted",
 "machines", ["alignment", "after_changeover"],
 ["شوف ارتفاع الـlower punch عند الـejection والـscraper gap؛ شوف القرص بيخبط فين", "Check lower punch ejection height and scraper gap; find where tablets hit"],
 [["حرف القرص بيخبط في الـscraper أو الـchute", "Tablet edge hits scraper or chute"],
 ["الـejection مش على مستوى الـtable بعد الـchangeover", "Ejection not set to table level after changeover"],
 ["مفيش قيمة أو gauge في الـsetup sheet", "No value or gauge in setup sheet"]],
 ["a_cm_t_adjust"], ["a_cm_setup_sheet", "a_cm_opl"], ["a_k_reject"]),

 a_c_pr_dust: c("شفط الـdust extraction ضعيف", "Weak dust extraction at press / deduster",
 "machines", ["env_dust", "contamination"],
 ["شوف الـdP على فلتر الـdust collector والشفط عند الـnozzles؛ شوف تراكم على الـturret", "Check collector filter dP and suction at nozzles; look for buildup on turret"],
 [["بودرة بتتراكم على الـturret والـpunches", "Powder accumulates on turret and punches"],
 ["فلتر الـcollector محمل أو hose بيسرب", "Collector filter loaded or hose leaking"],
 ["الـdP مش متراقب ومفيش تكرار تنضيف", "dP not monitored; no cleaning frequency"]],
 ["a_cm_t_clean"], ["a_cm_dust_pm", "a_cm_dp_alarm"], ["a_k_minor_stops"]),

 a_c_pr_segment: c("FE55: الـdie segment مش مقفول صح (segment lock / torque)", "FE55 die segment not locked correctly (lock / clamp torque)",
 "machines", ["mechanical", "after_changeover", "alignment"],
 ["اختبر الـsegment lock والـclamping screws بالـtorque wrench؛ قيس ارتفاع الـsegments", "Check segment lock and clamp screws with torque wrench; dial-gauge segment height"],
 [["الـsegment بيتحرك وقت التشغيل", "Segment shifts during run"],
 ["الملء والضغط بيختلفوا من segment للتاني", "Fill and compression vary by segment"],
 ["عزم الـclamping مش مكتوب في الـchangeover", "Clamp torque not defined in changeover"],
 ["مفيش checklist بقيم الـOEM للـsegments", "No segment checklist with OEM values"]],
 ["a_cm_t_adjust", "a_cm_t_ipc"], ["a_cm_segment_std", "a_cm_setup_sheet"], ["a_k_reject"]),

 /* ---------- capsule filler ---------- */
 a_c_cp_vac: c("الـvacuum ضعيف: pump أو فلتر أو hose أو seal", "Low vacuum: pump, filter, hose or seal leak",
 "machines", ["utility_vacuum", "leak", "contamination"],
 ["قيس الـvacuum على الـgauge عند الماكينة؛ افحص فلتر البودرة والخراطيم والـseals", "Read vacuum gauge at machine; inspect powder filter, hoses and seals"],
 [["الكبسول مش بيتفصل أو بيترفض", "Capsules not separated or rejected"],
 ["فلتر الـvacuum مليان بودرة أو hose مشروخ", "Vacuum filter loaded with powder or hose cracked"],
 ["تغيير الفلتر مش في الـCIL/PM", "Filter change not in CIL/PM"],
 ["مفيش alarm على الـvacuum الواطي", "No low-vacuum alarm"]],
 ["a_cm_t_filter"], ["a_cm_vac_alarm", "a_cm_vac_pm"], ["a_k_reject"]),

 a_c_cp_shell: c("الكبسول الفاضي: رطوبة أو أبعاد خارج الـspec", "Empty capsule shells out of spec (moisture, dimensions)",
 "materials", ["supplier", "storage", "new_material_batch", "env_heat_humidity"],
 ["شوف الـCoA وظروف التخزين؛ جرب lot تاني؛ افحص الكبسول هش ولا طري", "Check CoA and storage conditions; try another lot; check shells brittle or soft"],
 [["الكبسول هش أو طري فبيتشق أو مش بيفتح", "Shells brittle or soft, so they split or don't open"],
 ["اتخزن بره مدى الحرارة/الرطوبة أو اختلاف lot", "Stored outside T/RH range or lot variation"],
 ["مفيش تحكم في ظروف التخزين ولا incoming check", "No storage condition control or incoming check"]],
 ["a_cm_t_segregate"], ["a_cm_caps_storage", "a_cm_mat_spec"], ["a_k_reject"]),

 a_c_cp_bush: c("الـbushings دايبة أو upper/lower مش متسنترين", "Capsule bushings worn or upper/lower misaligned",
 "machines", ["wear_age", "alignment", "after_changeover"],
 ["اعمل alignment check بالـpin gauge بين الـupper والـlower bushings؛ افحص الحواف", "Check upper/lower bushing alignment with pin gauge; inspect edges"],
 [["الـcap والـbody مش بيتفصلوا أو بيتشقوا", "Cap/body not separated or split"],
 ["wear في الـbushings أو alignment مش متعمل بعد الـformat change", "Bushing wear or alignment not done at format change"],
 ["مفيش قياس wear ولا alignment gauge في الـPM", "No wear measurement or alignment gauge in PM"]],
 ["a_cm_t_replace"], ["a_cm_format_pm", "a_cm_setup_sheet"], ["a_k_reject"]),

 a_c_cp_dosing: c("الـdosing disc/tamping: ارتفاع غلط، disc دايب أو gap مع الـbrass ring", "Dosing disc/tamping height wrong, disc worn or ring gap",
 "machines", ["setting_change", "wear_age", "mechanical"],
 ["قيس سمك الـdisc والـgap بالـfeeler؛ قارن ارتفاع الـtamping stations بالـsetup sheet", "Measure disc thickness and gap with feeler; compare tamping heights with setup sheet"],
 [["وزن الـslug بيختلف أو بودرة بتسرب تحت الـdisc", "Slug weight varies or powder leaks under disc"],
 ["الـgap اتفتح أو ارتفاعات الـtamping مش حسب المنتج", "Gap opened or tamping heights not per product"],
 ["wear الـdisc مش بيتقاس", "Disc wear not measured"],
 ["مفيش setup sheet بقيم وgauges لكل منتج", "No product setup sheet with values and gauges"]],
 ["a_cm_t_adjust", "a_cm_t_ipc"], ["a_cm_format_pm", "a_cm_setup_sheet"], ["a_k_rsd"]),

 a_c_cp_bed: c("مستوى البودرة في الـdosing bowl مش ثابت (level sensor/auger)", "Powder bed level in dosing bowl unstable (level sensor/auger)",
 "machines", ["sensor", "calibration", "contamination"],
 ["راقب مستوى البودرة؛ نضف الـlevel sensor وشوف الـauger بيشتغل ويقف صح", "Watch bed level; clean level sensor; confirm auger starts/stops correctly"],
 [["ارتفاع الـbed بيتغير فالوزن بيتغير", "Bed height varies so weight varies"],
 ["الـsensor عليه بودرة أو الـsensitivity غلط", "Sensor coated with powder or wrong sensitivity"],
 ["تنضيف الـsensor مش في الـCIL والـsetting مش standard", "Sensor cleaning not in CIL; setting not standardised"]],
 ["a_cm_t_sensor"], ["a_cm_sensor_pm", "a_cm_cil"], ["a_k_rsd"]),

 a_c_cp_close: c("ارتفاع الـclosing pins غلط فالكبسول بيتقفل زيادة", "Closing pin height wrong causing telescoped/dented capsules",
 "machines", ["setting_change", "alignment"],
 ["قيس طول الكبسولة المقفولة وقارن بالـspec؛ شوف ارتفاع الـclosing pins", "Measure closed length vs spec; check closing pin height"],
 [["الكبسول بيتدغط أو telescoped", "Capsules dented or telescoped"],
 ["الـpins اتظبطت بالعين بعد الـformat change", "Pins set by eye after format change"],
 ["مفيش gauge وقيمة في الـsetup sheet", "No gauge or value in setup sheet"]],
 ["a_cm_t_adjust", "a_cm_t_segregate"], ["a_cm_setup_sheet", "a_cm_format_pm"], ["a_k_reject"]),

 a_c_cp_weigh: c("ميزان الـweight check أو الـweight control محتاج calibration", "Weight check balance or weight control needs calibration",
 "measurement", ["calibration", "sensor"],
 ["اوزن عينة على ميزان الـIPC وقارن بقراءة الماكينة؛ شوف تاريخ الـcalibration", "Weigh sample on IPC balance vs machine reading; check calibration date"],
 [["rejects كويسة أو تصحيح غلط", "Good capsules rejected or wrong correction"],
 ["الميزان عمل drift أو بيتأثر بالـvibration", "Balance drifted or affected by vibration"],
 ["مفيش daily check بالأوزان القياسية", "No daily check with test weights"]],
 ["a_cm_t_ipc"], ["a_cm_balance_cal", "a_cm_reject_test"], ["a_k_reject"]),

 a_c_cp_orient: c("الـcapsule feed/rectifier: fingers أو magazine دايبين/متسخين", "Capsule feed or rectifier fingers worn/dirty (orientation)",
 "machines", ["wear_age", "contamination"],
 ["افحص الـfingers والـmagazine tubes؛ شوف كبسول مقلوب أو واقف في الـfeed", "Inspect rectifier fingers and magazine tubes; look for inverted/stuck capsules"],
 [["كبسول مقلوب أو بيقف فيعمل jam/reject", "Inverted or stuck capsules cause jams/rejects"],
 ["الـfingers دايبة أو عليها بودرة", "Fingers worn or coated with powder"],
 ["تنضيف وفحص الـfeed مش في الـCIL/PM", "Feed cleaning/inspection not in CIL/PM"]],
 ["a_cm_t_clean"], ["a_cm_format_pm", "a_cm_cil"], ["a_k_minor_stops"]),

 /* ---------- coater ---------- */
 a_c_ct_nozzle: c("الـnozzle/needle: suspension ناشفة جوه أو needle/seal دايب", "Spray nozzle/needle: dried suspension or worn needle/seal",
 "machines", ["wear_age", "contamination", "after_cleaning"],
 ["فك الـgun وشوف الـair cap والـneedle؛ اعمل spray test بالمية وشوف الـpattern", "Strip gun, check air cap and needle; water spray test and check pattern"],
 [["الـgun بيسد أو بينقط بعد الوقف", "Gun clogs or drips after stop"],
 ["suspension بتنشف على الطرف أو seal الـneedle دايب", "Suspension dries on tip or needle seal worn"],
 ["تنضيف الـgun بعد الباتش مش standard", "Gun cleaning after batch not standardised"],
 ["قطع الـnozzle مالهاش تكرار تغيير", "Nozzle parts have no change frequency"]],
 ["a_cm_t_clean"], ["a_cm_gun_clean", "a_cm_nozzle_pm"], ["a_k_gun_stops"]),

 a_c_ct_atom: c("ضغط الـatomizing/pattern air واطي أو بيتذبذب", "Atomizing/pattern air pressure low or fluctuating",
 "machines", ["utility_air", "pneumatic", "calibration"],
 ["قارن ضغط الـatomizing على الـHMI بgauge عند الـgun وقت الرش؛ افحص الـregulator", "Compare HMI atomizing pressure with gauge at gun while spraying; check regulator"],
 [["نقط كبيرة فبيحصل over-wetting أو تنقيط", "Large droplets cause over-wetting or drips"],
 ["الـregulator عمل drift أو فلتر الهوا مسدود", "Regulator drifted or air filter blocked"],
 ["فحص الـregulator والفلتر مش في الـPM", "Regulator and filter check not in PM"]],
 ["a_cm_t_adjust"], ["a_cm_air_ps", "a_cm_air_dryer"], ["a_k_coat_def"]),

 a_c_ct_susp: c("الـsuspension: viscosity/solids عالية أو مش متقلبة/متصفاة", "Suspension viscosity/solids high or not stirred/sieved",
 "materials", ["new_material_batch", "procedure_gap"],
 ["قيس الـviscosity أو solids %؛ شوف الـstirrer شغال ومفيش كتل؛ افحص الـsieve", "Measure viscosity or solids %; check stirrer running, no lumps; check sieve"],
 [["كتل بتسد الـnozzle أو الرش تقيل", "Lumps block nozzle or spray too thick"],
 ["وقت التقليب مش كفاية أو lot الـpolymer مختلف", "Stirring time short or polymer lot differs"],
 ["standard التحضير مالوش viscosity check ولا mesh", "Prep standard lacks viscosity check and sieve mesh"]],
 ["a_cm_t_adjust"], ["a_cm_susp_std", "a_cm_mat_spec"], ["a_k_gun_stops"]),

 a_c_ct_tube: c("tube الـperistaltic دايب/مقاسه غلط أو الـrollers مش ضاغطة", "Peristaltic tube worn/wrong size or rollers not occluding",
 "machines", ["wear_age", "non_oem_part", "mechanical"],
 ["افحص الـtube (شروخ، تفلطح)، اتأكد من المقاس والـpart no.، قيس الـflow بالوزن والوقت", "Inspect tube for cracks/flattening, verify size/part no., measure flow by weight"],
 [["الـflow بيقل أو بيتذبذب", "Flow drops or pulsates"],
 ["الـtube اشتغل بعد عمره أو سمك الجدار غلط", "Tube used past its hours or wrong wall thickness"],
 ["الـtube بيتغير لما يبوظ والـspec مش متحكم", "Tube changed on failure; spec not controlled"]],
 ["a_cm_t_replace"], ["a_cm_tube_pm", "a_cm_spares_spec"], ["a_k_gun_stops"]),

 a_c_ct_flow: c("الـflowmeter/load cell بتاع الـspray rate محتاج calibration", "Spray-rate flowmeter or load cell out of calibration",
 "measurement", ["calibration", "sensor"],
 ["اعمل gravimetric check: وزن السائل المرشوش في دقيقة مقابل قراءة الـHMI", "Gravimetric check: weigh liquid sprayed in 1 min vs HMI reading"],
 [["الـspray rate الحقيقي غير المعروض", "Real spray rate differs from displayed"],
 ["الـflowmeter عمل drift", "Flowmeter drifted"],
 ["مش في خطة الـcalibration أو الـinterval طويل", "Not in calibration plan or interval too long"]],
 ["a_cm_t_ipc"], ["a_cm_flow_cal", "a_cm_recipe_lock"], ["a_k_coat_def"]),

 a_c_ct_exh_filter: c("فلتر الـexhaust/dust collector مسدود", "Exhaust filter / dust collector blocked",
 "machines", ["contamination", "env_dust"],
 ["شوف dP الفلتر؛ افحص الـpulse cleaning والـcartridges", "Check filter dP; inspect pulse cleaning and cartridges"],
 [["alarm dP والضغط في الـpan بيعلى", "dP alarm and pan pressure rises"],
 ["valve الـpulse jet باظ أو الـcartridges محملة", "Pulse-jet valve failed or cartridges loaded"],
 ["الـdP مش متسجل trend والتغيير بعد العطل", "dP not trended; change only after failure"]],
 ["a_cm_t_filter"], ["a_cm_dp_alarm", "a_cm_dust_pm"], ["a_k_dp"]),

 a_c_ct_damper: c("الـdamper/fan للـinlet أو الـexhaust: actuator أو VFD أو control loop", "Inlet/exhaust damper actuator, fan VFD or pressure loop fault",
 "machines", ["electrical", "pneumatic", "plc_software"],
 ["قارن أمر الـdamper بالوضع الفعلي؛ قارن الـairflow وضغط الـpan بالـsetpoints", "Compare damper command vs real position; airflow and pan pressure vs setpoints"],
 [["ضغط الـpan أو الـairflow مش ثابت", "Pan pressure or airflow unstable"],
 ["الـactuator لازق أو الـloop tuning مش مظبوط", "Actuator sticking or loop poorly tuned"],
 ["مفيش فحص للـairflow/الـloop في الـPM", "No airflow/loop check in PM"]],
 ["a_cm_t_adjust"], ["a_cm_airflow_cal", "a_cm_vibration"], ["a_k_dry_time"]),

 a_c_ct_belt: c("الـbelt/coupling بتاع الـpan drive مرخي أو مقطوع", "Pan drive belt/coupling loose or broken",
 "machines", ["mechanical", "wear_age"],
 ["بعد LOTO افحص شد الـbelt وحالة الـcoupling والـkeys", "After LOTO check belt tension, coupling and keys"],
 [["الـmotor بيلف والـpan لأ أو بيفوت", "Motor runs but pan slips or stops"],
 ["الـbelt اتمط أو الـcoupling اتآكل", "Belt stretched or coupling worn"],
 ["شد الـbelt مش بيتفحص في الـPM", "Belt tension not checked in PM"]],
 ["a_cm_t_replace"], ["a_cm_belt_pm", "a_cm_vibration"], ["a_k_mtbf"]),

 a_c_ct_balance: c("توازن الـspray rate/سرعة الـpan/حرارة الـbed مش مظبوط", "Spray rate, pan speed and bed temperature not balanced",
 "methods", ["setting_change", "procedure_gap"],
 ["قارن الـspray rate والـrpm والـexhaust/bed temp بالـbatch record؛ راقب البداية", "Compare spray rate, rpm, exhaust/bed temp with batch record; watch start-up"],
 [["over-wetting (twinning) أو spray drying (orange peel)", "Over-wetting (twinning) or spray drying (orange peel)"],
 ["الـparameters اتعدلت بره الـwindow أو الـstartup ramp مش متعرف", "Parameters adjusted outside window or no start-up ramp"],
 ["الـprocess window مش مقفول في الـrecipe", "Process window not locked in recipe"]],
 ["a_cm_t_adjust", "a_cm_t_segregate"], ["a_cm_coat_recipe", "a_cm_recipe_lock"], ["a_k_coat_def"]),

 a_c_ct_gun_pos: c("مسافة/زاوية الـguns من الـbed غلط أو مش متساوية", "Gun-to-bed distance/angle wrong or uneven between guns",
 "methods", ["alignment", "after_cleaning", "setting_change"],
 ["قيس المسافة من كل gun للـbed وزاويتها؛ شوف الـpatterns متداخلة؟", "Measure each gun distance and angle to bed; check pattern overlap"],
 [["over-wetting في مكان وspray drying في مكان", "Local over-wetting and spray drying"],
 ["الـarm اترجع بالعين بعد التنضيف", "Gun arm reset by eye after cleaning"],
 ["مفيش jig أو علامات للوضع الصح", "No jig or marks for correct position"]],
 ["a_cm_t_adjust"], ["a_cm_gun_jig", "a_cm_setup_sheet"], ["a_k_coat_def"])
 };

 var cms = {
 /* containment */
 a_cm_t_clean: m("وقف ونضف/ظبط الجزء واختبره قبل ما تكمل", "Stop, clean/reset the part and function-test before restart", "temporary", "L", "L", "M"),
 a_cm_t_ipc: m("زود تكرار الـIPC لحد ما الحل يتأكد", "Increase IPC frequency until fix is verified", "inspection", "H", "L", "P"),
 a_cm_t_replace: m("غير الجزء من الـstock وسجله في الـCMMS", "Replace part from stock and record in CMMS", "temporary", "H", "L", "M"),
 a_cm_t_segregate: m("اعزل المنتج المشكوك فيه وبلغ الـQA (deviation لو لازم)", "Segregate suspect product, inform QA (deviation if needed)", "temporary", "H", "L", "Q"),
 a_cm_t_adjust: m("رجّع الـsetting للمدى الـvalidated وسجله", "Reset setting to validated range and record it", "temporary", "H", "L", "P"),
 a_cm_t_hold: m("وقف الـprocess في وضع آمن لحد ما يرجع، من غير أي bypass", "Hold process in safe state until restored, no bypass", "temporary", "H", "L", "P"),
 a_cm_t_sensor: m("نضف/ظبط الـsensor أو الـswitch واختبر الـfunction", "Clean/realign sensor or switch and test function", "temporary", "L", "L", "M"),
 a_cm_t_filter: m("غير/نضف الفلاتر واتأكد من الـdP بعد التشغيل", "Change/clean filters and confirm dP after restart", "temporary", "H", "L", "M"),
 /* shared permanent */
 a_cm_mat_spec: m("حدّث spec الخامة مع المورد (PSD/رطوبة/flow) عن طريق الـQA", "Tighten material spec with supplier (PSD/moisture/flow) via QA", "standard", "H", "H", "Q"),
 a_cm_upstream_ipc: m("check LOD/PSD قبل تسليم الحبيبات للمرحلة اللي بعدها", "LOD/PSD release check before granule moves to next step", "standard", "H", "L", "P"),
 a_cm_hvac_alarm: m("alarm للـRH/الحرارة عند الماكينة مع hold limit (change control)", "Room RH/temperature alarm at machine with hold limit (change control)", "poka_yoke", "H", "H", "E"),
 a_cm_ahu_pm: m("PM للـAHU/dehumidifier: coil، wheel، فلاتر + performance check", "AHU/dehumidifier PM: coil, wheel, filters plus performance check", "pm", "H", "L", "U"),
 a_cm_steam_pm: m("trap survey دوري وPM/calibration للـcontrol valves", "Periodic steam trap survey and control valve PM/calibration", "pm", "H", "L", "U"),
 a_cm_air_dryer: m("PM للـdryer وdrains الـFRL ومراقبة الـdew point", "Air dryer and FRL drain PM with dew point monitoring", "pm", "H", "L", "U"),
 a_cm_air_ps: m("pressure switch عند مدخل الماكينة يدي alarm قبل ما الضغط يقع", "Inlet pressure switch giving alarm before pressure drops too low", "poka_yoke", "H", "L", "E"),
 a_cm_sensor_bracket: m("bracket ثابت ومتعلم للـsensors بدل الـslotted (change control)", "Fixed, marked sensor brackets instead of slotted (change control)", "design", "H", "L", "E"),
 a_cm_sensor_pm: m("تنضيف واختبار الـsensors في checklist الـAM/PM", "Sensor cleaning and function test in AM/PM checklist", "pm", "L", "L", "M"),
 a_cm_vibration: m("CBM: vibration وthermography على الـdrives والـgearboxes", "CBM route: vibration and thermography on drives and gearboxes", "pm", "H", "H", "M"),
 a_cm_vfd_cabinet: m("تنضيف فلاتر/مراوح الـpanels وthermography سنوي", "Panel filter/fan cleaning and yearly thermography", "pm", "H", "L", "M"),
 a_cm_interlock_test: m("اختبار دوري لكل الـsafety interlocks مع سجل", "Periodic test of all safety interlocks with record", "pm", "H", "L", "M"),
 a_cm_cil: m("standard للـCIL (تنضيف-فحص-تزييت) في الـAM", "CIL (clean-inspect-lubricate) standard for autonomous maintenance", "standard", "H", "L", "P"),
 a_cm_opl: m("OPL وتدريب على الـsetting بعد ما الـstandard يتعمل", "OPL and training on correct setting, after the standard exists", "training", "L", "L", "M"),
 a_cm_spares_spec: m("spec OEM للـcritical spares مع min stock، ومفيش بديل من غير موافقة", "OEM spec and min stock for critical spares; no substitute without approval", "standard", "H", "L", "E"),
 a_cm_recipe_lock: m("الـparameters الـvalidated مقفولة في الـrecipe بـaccess levels (change control)", "Validated parameters locked in recipe with access levels (change control)", "poka_yoke", "H", "H", "E"),
 a_cm_setup_sheet: m("setup sheet لكل منتج بقيم وgauges (gap، ارتفاع، torque)", "Product setup sheet with values and gauges (gap, height, torque)", "standard", "H", "L", "E"),
 a_cm_lube_pm: m("PM لنظام التزييت: الخزان، الـmetering blocks، الخطوط، اختبار الـalarm", "Lube system PM: reservoir, metering blocks, lines, alarm test", "pm", "H", "L", "M"),
 a_cm_lube_alarm: m("مراقبة ضغط/flow كل lube cycle مع alarm وstop (change control)", "Monitor pressure/flow per lube cycle with alarm and stop (change control)", "poka_yoke", "H", "H", "E"),
 a_cm_lube_list: m("lube chart معتمد (grade وH1) مربوط بالمشتريات", "Approved lube chart (grade, H1) linked to purchasing", "standard", "H", "L", "E"),
 a_cm_dp_alarm: m("pre-alarm على dP الفلتر قبل حد الوقف", "Filter dP pre-alarm before stop limit", "poka_yoke", "H", "L", "E"),
 a_cm_dust_pm: m("PM للـdust collector: dP، cartridges، pulse valves، hoses", "Dust collector PM: dP, cartridges, pulse valves, hoses", "pm", "H", "L", "M"),
 a_cm_reject_test: m("challenge test للـreject system في بداية كل باتش", "Reject system challenge test at start of every batch", "poka_yoke", "H", "L", "P"),
 a_cm_airflow_cal: m("calibration للـairflow sensor وفحص stroke الـdampers", "Airflow sensor calibration and damper stroke check", "pm", "H", "L", "M"),
 a_cm_tube_pm: m("تغيير الـpump tube بعدد الساعات وبالـspec الصح", "Pump tube change by running hours with correct spec", "pm", "H", "L", "M"),
 /* press */
 a_cm_punch_log: m("قياس الـpunches/dies كل campaign مع tooling life log", "Punch/die measurement every campaign with tooling life log", "pm", "H", "L", "M"),
 a_cm_punch_store: m("standard تنضيف وتلميع وتزييت وتخزين الـtooling", "Tooling cleaning, polishing, oiling and storage standard", "standard", "H", "L", "M"),
 a_cm_punch_coat: m("tooling coated للمنتجات اللازقة (change control)", "Coated tooling for sticky products (change control)", "design", "H", "H", "E"),
 a_cm_feeder_pm: m("فحص paddles وgap الـforce feeder في الـPM", "Force feeder paddle and gap check in PM", "pm", "H", "L", "M"),
 a_cm_force_cal: m("calibration الـcompression force sensors بتكرار محدد", "Compression force sensor calibration at defined interval", "pm", "H", "L", "E"),
 a_cm_wc_tune: m("parameters الـweight control لكل منتج في الـrecipe", "Weight control parameters per product in recipe", "standard", "H", "L", "E"),
 a_cm_dust_seal: m("تغيير الـdust cups/seals بتكرار محدد", "Punch dust cup/seal replacement at defined frequency", "pm", "H", "L", "M"),
 a_cm_cam_pm: m("فحص الـcams والـrollers في الـoverhaul السنوي", "Cam and roller inspection in annual overhaul", "pm", "H", "H", "M"),
 a_cm_segment_std: m("قيم torque/lock للـFE55 segments في checklist الـchangeover", "FE55 segment torque/lock values in changeover checklist", "standard", "H", "L", "E"),
 /* granulation */
 a_cm_filter_life: m("تغيير/غسيل الـfilter bags بالـdP وعدد الباتشات مش بالتاريخ", "Filter bag wash/change by dP and batch count, not calendar", "pm", "H", "L", "M"),
 a_cm_bag_detect: m("broken bag detector على الـexhaust (change control)", "Broken-bag detector on exhaust duct (change control)", "design", "H", "H", "E"),
 a_cm_shake_pm: m("PM للـshaking/blow-back: cylinder، solenoid، seals", "Shaking/blow-back PM: cylinder, solenoid, seals", "pm", "H", "L", "M"),
 a_cm_binder_cal: m("check للـbinder pump flow قبل كل باتش", "Binder pump flow check before every batch", "standard", "H", "L", "P"),
 a_cm_power_cal: m("calibration للـpower/torque transducer + no-load baseline", "Power/torque transducer calibration plus no-load baseline", "pm", "H", "L", "E"),
 a_cm_endpoint_std: m("end point لكل منتج (power + وقت + baseline) في الـrecipe", "Product end point (power + time + baseline) defined in recipe", "standard", "H", "H", "E"),
 a_cm_purge_ps: m("pressure switch للـseal purge air مع start interlock (change control)", "Seal purge air pressure switch with start interlock (change control)", "poka_yoke", "H", "L", "E"),
 a_cm_seal_pm: m("تغيير الـshaft seals بتكرار محدد", "Shaft seal replacement at defined frequency", "pm", "H", "L", "M"),
 a_cm_atex_test: m("register وفحص دوري لأجهزة الحماية من الانفجار حسب الـOEM", "Explosion-protection device register and OEM inspection schedule", "pm", "H", "L", "E"),
 a_cm_screen_std: m("screens متعلمة بالمقاس وفحص integrity قبل وبعد الاستخدام", "Screens marked by size; integrity check before and after use", "standard", "H", "L", "P"),
 a_cm_plate_clean: m("خطوة فحص الـplate بعد الغسيل في الـcleaning procedure", "Plate inspection step after washing in cleaning procedure", "standard", "H", "L", "P"),
 /* blender */
 a_cm_column_pm: m("PM لعمود الرفع: spindle، nut، فرامل، limit switches", "Lifting column PM: spindle, nut, brake, limit switches", "pm", "H", "L", "M"),
 a_cm_gearbox_oil: m("تحليل/تغيير زيت الـgearbox وفحص الفرامل", "Gearbox oil analysis/change and brake check", "pm", "H", "L", "M"),
 a_cm_bin_guide: m("guides/stops على الأرض لتمركز الـbin (change control)", "Floor guides/stops to centre the bin (change control)", "poka_yoke", "H", "L", "E"),
 a_cm_load_std: m("standard للتحميل: أقصى نسبة ملء وترتيب الإضافة", "Loading standard: maximum fill level and addition order", "standard", "H", "L", "P"),
 a_cm_valve_seal: m("تغيير seal الـbutterfly valve بتكرار محدد", "Butterfly valve seal change at defined frequency", "pm", "H", "L", "M"),
 /* capsule filler */
 a_cm_vac_pm: m("PM للـvacuum: pump، فلتر، خراطيم، seals", "Vacuum system PM: pump, filter, hoses, seals", "pm", "H", "L", "M"),
 a_cm_vac_alarm: m("vacuum switch مع alarm لما الـvacuum يقل عن الحد", "Vacuum switch with low-vacuum alarm", "poka_yoke", "H", "L", "E"),
 a_cm_caps_storage: m("تخزين الكبسول الفاضي 15-25°C و35-65%RH مع conditioning", "Empty capsule storage 15-25°C / 35-65% RH with conditioning", "standard", "H", "L", "W"),
 a_cm_format_pm: m("قياس wear أجزاء الـformat كل campaign", "Format part wear measurement every campaign", "pm", "H", "L", "M"),
 a_cm_balance_cal: m("daily check للميزان بأوزان قياسية + calibration", "Daily balance check with test weights plus calibration", "pm", "H", "L", "E"),
 /* coater */
 a_cm_gun_clean: m("standard تنضيف الـguns بعد كل باتش + طقم guns احتياطي", "Gun cleaning standard after each batch plus spare gun set", "standard", "H", "L", "P"),
 a_cm_nozzle_pm: m("تغيير nozzle/needle/seals بتكرار محدد", "Nozzle/needle/seal replacement at defined frequency", "pm", "H", "L", "M"),
 a_cm_susp_std: m("standard تحضير الـsuspension: وقت تقليب، mesh، viscosity", "Suspension prep standard: stirring time, sieve mesh, viscosity", "standard", "H", "L", "P"),
 a_cm_flow_cal: m("calibration gravimetric للـspray flowmeter", "Gravimetric calibration of spray flowmeter", "pm", "H", "L", "E"),
 a_cm_coat_recipe: m("process window للـcoating في الـrecipe (spray، rpm، temp، ramp)", "Coating process window in recipe (spray, rpm, temp, start-up ramp)", "standard", "H", "H", "E"),
 a_cm_gun_jig: m("jig أو علامات ثابتة لمسافة وزاوية الـguns", "Jig or fixed marks for gun distance and angle", "poka_yoke", "H", "L", "E"),
 a_cm_belt_pm: m("فحص شد الـbelt والـcoupling في الـPM", "Belt tension and coupling check in PM", "pm", "H", "L", "M")
 };

 var kpis = {
 a_k_reject: { ar: "نسبة الـreject", en: "Reject rate", unit: "%" },
 a_k_rsd: { ar: "الـRSD للوزن", en: "Weight RSD", unit: "%" },
 a_k_mtbf: { ar: "الـMTBF", en: "MTBF", unit: "h" },
 a_k_minor_stops: { ar: "عدد الوقفات الصغيرة في الوردية", en: "Minor stops per shift", unit: "count" },
 a_k_tool_life: { ar: "عمر طقم الـpunches", en: "Punch set life", unit: "M tablets" },
 a_k_dp: { ar: "dP الفلتر آخر التشغيلة", en: "Filter dP at end of batch", unit: "mbar" },
 a_k_dry_time: { ar: "وقت التجفيف/الـprocess للباتش", en: "Drying/process time per batch", unit: "min" },
 a_k_yield: { ar: "الـyield بتاع التشغيلة", en: "Batch yield", unit: "%" },
 a_k_coat_def: { ar: "نسبة عيوب الـcoating", en: "Coating defect rate", unit: "%" },
 a_k_gun_stops: { ar: "عدد مرات انسداد الـguns في التشغيلة", en: "Gun blockages per batch", unit: "count" },
 a_k_rh_exc: { ar: "عدد مرات الـRH بره الحد في الشهر", en: "Room RH excursions per month", unit: "count" },
 a_k_bu: { ar: "الـRSD للـblend uniformity", en: "Blend uniformity RSD", unit: "%" }
 };

 window.KB_ENG_A = { families: families, causes: causes, cms: cms, kpis: kpis };
})();

/* KB_ENG_B - Packaging (count, blister, carton) + Utilities (hvac, pw, air, boiler, elec, bms, general)
Servier Egypt Cairo site - Work Log analysis coach. Plain JS, no imports.
Compact authoring: bilingual text is written "arabic|english" and expanded by bi() below.
The resulting window.KB_ENG_B object follows CONTRACT.md exactly. */
(function () {
var causes = {}, cms = {}, kpis = {}, families = {};
function bi(s) { var i = s.indexOf("|"); if (i < 0) throw new Error("bilingual text without | : " + s); return { ar: s.slice(0, i), en: s.slice(i + 1) }; }
function ids(s, p) { return s ? s.split(" ").map(function (x) { return p + x; }) : []; }
function C(id, fish, tags, name, check, why, cont, cm, kpi) {
var o = bi(name); o.fish = fish; o.tags = tags.split(" "); o.check = bi(check);
o.why = why.map(bi); o.cont = ids(cont, "b_cm_"); o.cm = ids(cm, "b_cm_"); o.kpi = ids(kpi, "b_k_");
causes["b_c_" + id] = o;
}
var OWN = {
m: "الصيانة|Maintenance", e: "الهندسة|Engineering", p: "الإنتاج|Production", q: "الجودة QA|QA",
s: "المشتريات + QA|Purchasing + QA", u: "فريق الـUtilities|Utilities team", mp: "الصيانة + الإنتاج|Maintenance + Production",
w: "المخازن|Warehouse", it: "الهندسة + IT|Engineering + IT"
};
function M(id, kind, ie, own, txt) { var o = bi(txt); o.kind = kind; o.impact = ie[0]; o.effort = ie[1]; o.owner = bi(OWN[own]); cms["b_cm_" + id] = o; }
function K(id, unit, txt) { var o = bi(txt); o.unit = unit; kpis["b_k_" + id] = o; }
function F(id, name, parts, syms) {
var f = bi(name); f.parts = parts.map(bi);
f.symptoms = syms.map(function (s) { var o = bi(s[1]); o.id = "b_" + id + "_" + s[0]; if (s[3]) o.tags = s[3].split(" "); o.causes = ids(s[2],"b_c_"); return o; });
families[id] = f;
}

/* CAUSES */
/* --- shared packaging --- */
C("sens_dirty","measurement","sensor env_dust minor_stops",
"حساس (photocell) متسخ أو متحرك من مكانه|Photocell/sensor dirty, loose or misaligned",
"نضّف الحساس واتأكد من الـLED والـteach على منتج أو web حقيقي|Clean sensor; confirm LED and teach on real product or web",
["تراب المنتج بيتجمع على عدسة الحساس|Product dust builds up on the sensor lens",
"الحامل بيفك ويتحرك مع الـvibration|Bracket loosens and shifts with machine vibration",
"تنضيف وفحص الحساسات مش موجود في الـCIL|Sensor cleaning and check are not in the CIL standard"],
"clean","sensor cil setting","minorstops");
C("fmt_setting","methods","after_changeover setting_change setup_loss procedure_gap",
"ضبط الـformat مش مطابق للـsetting sheet بعد الـchangeover|Format settings differ from setting sheet after changeover",
"قارن الـguides والـtiming والـHMI recipe بالـsetting sheet|Compare guides, timing and HMI recipe against the setting sheet",
["الضبط اتعمل بالإحساس مش بأرقام|Adjustments were made by feel, not to values",
"الـsetting sheet ناقص قيم ومفيش علامات centerline|Setting sheet lacks values and centerline marks",
"مفيش standard للـchangeover فيه first-off verification|No changeover standard with first-off verification"],
"setback","smed recipe setting co","changeover");
C("air_low","nature","utility_air pneumatic minor_stops",
"ضغط هوا واطي أو متذبذب عند الماكينة|Low or unstable compressed air at the machine",
"اقرا المانومتر بعد الـregulator وقت الحركة وشوف فلتر الـFRL|Read gauge after regulator under load; check FRL filter",
["الضغط بيقع لما أكتر من cylinder يشتغل مع بعض|Pressure dips when several actuators cycle together",
"فلتر الـFRL مسدود أو خط التغذية صغير|FRL filter clogged or supply line undersized",
"مفيش pressure switch يوقف الماكينة ولا PM للـFRL|No low-pressure interlock and no FRL PM task"],
"fix","airsw pneu","minorstops");
C("vac_loss","machines","utility_vacuum pneumatic leak wear_age",
"فقد vacuum: cups مشروخة، فلتر مسدود أو pump ضعيفة|Vacuum loss: cracked cups, blocked filter or weak pump",
"قيس الـvacuum عند الـcup بـgauge وافحص الـcups والخراطيم والفلتر|Gauge vacuum at the cup; inspect cups, hoses and filter",
["الـcups اتشققت أو نشفت من كتر الدورات|Cups cracked or hardened with cycles",
"بتتغير لما تبوظ مش بعدد cycles|Cups replaced on failure, not by cycle count",
"مفيش PM للـcups والفلتر ولا vacuum switch بإنذار|No cup/filter PM and no vacuum switch alarm"],
"fix","vacsw cups","minorstops");
C("mat_spec","materials","new_material_batch supplier defects",
"خامة تعبئة خارج المواصفات (أبعاد، سمك، تقويس)|Packaging material out of spec (size, gauge, curl)",
"قيس عينات من الـbatch وقارنها بالمواصفة وبآخر batch كويسة|Measure samples vs spec and vs last good batch",
["الـbatch دي مختلفة في الأبعاد أو الخواص|This batch differs in dimensions or properties",
"الاستلام معتمد على الـCoA بس|Incoming release relies on CoA only",
"المواصفة مفيهاش tolerances تشغيلية والمورد مش متقيم عليها|Spec lacks machinability tolerances; supplier not rated on them"],
"matq","spec incoming","reject");
C("vision_recipe","measurement","sensor calibration setting_change defects",
"الكاميرا: recipe أو إضاءة أو حدود الفحص مش مظبوطة|Camera recipe, lighting or tolerances not right",
"شغّل challenge بعينات good/bad وراجع صور الـreject|Run good/bad challenge set; review reject images",
["الحدود اتغيرت أو الإضاءة ضعفت أو العدسة متسخة|Limits changed, light aged or lens dirty",
"الـrecipe مش مقفول بصلاحيات ومفيش master image|Recipe not access-locked; no master reference image",
"مفيش standard لإدارة recipes الكاميرا والـchallenge|No vision recipe management and challenge standard"],
"challenge 100","recipe cil vision","false_rej");
C("heater_ctrl","machines","electrical overheating wear_age",
"عطل heater أو SSR أو thermocouple أو كابل مقطوع|Heater, SSR, thermocouple or cable fault",
"قيس مقاومة الـheater والـthermocouple وافحص الـSSR والكابل عند نقطة الحركة|Measure heater/thermocouple resistance; check SSR and flexing cable",
["عنصر تسخين فصل أو الـSSR علّق|Heating element open or SSR failed",
"الكابل بيتني مع الحركة فبيتقطع والـSSR بيسخن|Cable fatigues at moving point; SSR runs hot",
"مفيش PM للكابلات والـheatsinks ولا spare حرج جاهز|No PM for cables/heatsinks and no critical spare held"],
"fix","cablechain heat spares","mttr");

/* --- blister --- */
C("bl_form_air","machines","pneumatic utility_air mechanical",
"ضغط هوا الـforming/الـplug ضعيف أو الـtool بيسرب|Forming air/plug assist low or forming tool leaking",
"اقرا ضغط الـforming وقت الدورة وافحص الـseals وفتحات الـvent في الـdie|Read forming pressure in cycle; check seals and die vent holes",
["الـseal بتاع الـforming station داب أو الـvents مسدودة|Forming seal worn or die vents blocked",
"الـtool بيتفك في التنضيف ويتركب من غير فحص|Tool removed at cleaning and refitted without check",
"مفيش checklist لتركيب وفحص الـforming tool|No forming tool assembly and inspection checklist"],
"fix","tool co","reject");
C("bl_film","materials","new_material_batch supplier",
"سمك الـfilm (PVC/PVDC/Alu-Alu) مختلف في الـbatch|Forming film gauge or laminate varies in this batch",
"قيس السمك بـmicrometer في 5 نقط بعرض الـweb وقارن بالـCoA|Micrometer gauge at 5 points across web vs CoA",
["تفاوت السمك بيدي pockets رفيعة في ناحية|Gauge variation gives thin pockets on one side",
"الاستلام على الـCoA بس|Film accepted on CoA only",
"المواصفة مفيهاش tolerance عرضي ومفيش supplier review|Spec lacks cross-web tolerance; no supplier review"],
"matq","spec incoming","reject");
C("bl_seal_param","methods","setting_change overheating defects",
"حرارة/ضغط/زمن الـsealing برا الـvalidated range|Sealing temp, pressure or dwell outside validated range",
"قارن الـsetpoint والفعلي بالـrange المعتمد واعمل leak test (blue dye)|Compare set/actual vs validated range; run blue-dye leak test",
["الـsetpoint اتغير لتعويض مشكلة تانية|Setpoint changed to compensate another problem",
"الـHMI بيقبل أي قيمة|HMI accepts any value",
"الـvalidated range مش مقفول كحدود في الـrecipe|Validated range not locked as recipe limits"],
"qa leak","recipe setting","leak");
C("bl_seal_plate","machines","wear_age mechanical alignment",
"الـsealing plate: knurling مستهلك/متسخ أو مش parallel|Sealing plate knurl worn/dirty or not parallel",
"خد pressure print بـcarbon paper وشوف توزيع الـknurling|Take a carbon pressure print; check knurl evenness",
["ضغط الـsealing مش متساوي على عرض الـweb|Seal pressure uneven across the web",
"الـplate اتآكل أو اتراكم عليه lacquer|Plate worn or lacquer built up",
"مفيش PM بفترة لتنضيف الـplate وفحص الـparallelism|No PM interval for plate cleaning and parallelism"],
"leak fix","seal firstoff","leak");
C("bl_lidding","materials","supplier new_material_batch",
"الـlidding foil: heat-seal lacquer ضعيف أو pinholes|Lidding foil heat-seal lacquer weak or pinholes",
"اعمل peel test وشوف الفويل على light box للـpinholes|Peel test and light-box check for pinholes",
["طبقة الـlacquer مش منتظمة في الـbatch دي|Lacquer coat weight uneven in this batch",
"مفيش peel/seal test في الاستلام|No incoming peel/seal test",
"مفيش quality agreement فيه حدود الـcoat weight|No quality agreement with coat weight limits"],
"matq","spec incoming","leak");
C("bl_feeder","machines","mechanical env_dust minor_stops",
"الـfeeder: brush أو channels مسدودة أو ارتفاعها غلط|Feeder brush/channels blocked or set at wrong height",
"شوف التعبئة على الـweb وارتفاع الـbrush وحالة شعرها والتراب في الـchannels|Check fill pattern, brush height/bristles, dust in channels",
["الأقراص بتقف أو بتتكسر في الـfeeder|Tablets bridge or break in the feeder",
"تراب الأقراص بيتراكم ومفيش شفط|Tablet dust accumulates; no extraction",
"ارتفاع الـbrush مش في الـsetting sheet والتنضيف مش في الـCIL|Brush height not in setting sheet; cleaning not in CIL"],
"100 clean","dust setting cil","minorstops");
C("bl_index","machines","mechanical alignment sensor",
"تزحيف الـindex/registration (servo pull أو print mark)|Index/registration drift (servo pull or print mark)",
"قيس offset الـpocket للـpunch وللـprint mark وافحص الـregistration sensor|Measure pocket-to-punch offset; check registration sensor",
["الـweb بيتسحب بطول مختلف كل دورة|Web pulled by a varying length each cycle",
"الـgripper مستهلك أو الحساس مش شايف الـmark كويس|Pull gripper worn or mark sensor misreads",
"مفيش PM للـpull unit ولا قيمة offset في الـsetting sheet|No pull unit PM and no offset value in setting sheet"],
"setback","tool setting","reject");
C("bl_punch","machines","wear_age mechanical",
"الـpunch/die مستهلك أو مكسور أو الـclearance غلط|Punch/die blunt, chipped or wrong clearance",
"شوف حواف البليستر (burr، شد) وافحص الـpunch والـclearance|Inspect blister edges for burrs; check punch and clearance",
["حافة الـpunch خلصت بعد عدد ضربات|Punch edge worn after stroke count",
"بيتسن أو يتغير بعد ما العيب يظهر بس|Sharpened only after defects appear",
"مفيش عداد ضربات ولا عمر محدد في الـPM|No stroke counter or life limit in PM"],
"fix 100","punch setting","reject");
C("bl_web","machines","mechanical alignment new_material_batch",
"شد/tracking الـweb: brake أو dancer أو splice|Web tension/tracking: reel brake, dancer or splice",
"شوف الـdancer وضغط الـbrake ومحاذاة الـreel على الـshaft وجودة الـsplice|Check dancer, brake pressure, reel alignment, splice quality",
["الشد بيتغير مع قطر الـreel|Tension varies with reel diameter",
"الـbrake مستهلك أو الـreel مش متركب في السنتر|Brake pad worn or reel not centred",
"مفيش علامة تركيب للـreel ولا PM للـbrake|No reel centring mark and no brake PM"],
"fix","reel tool","minorstops");
C("bl_cooling","nature","utility_water overheating env_heat_humidity",
"تبريد الـforming/sealing ضعيف (chiller أو flow)|Weak cooling of forming/sealing tools (chiller or flow)",
"قيس حرارة دخول وخروج مية التبريد والـflow وافحص الـstrainer|Measure cooling water in/out temp and flow; check strainer",
["الـtools سخنة فالـpockets بتنكمش أو الـseal بيلزق|Tools run hot: pockets shrink or seal sticks",
"الـstrainer مسدود أو الـchiller ضعيف في الصيف|Strainer blocked or chiller weak in summer",
"مفيش flow switch ولا PM لدايرة التبريد|No flow switch and no cooling circuit PM"],
"clean","flow cool","reject");
C("bl_coding","machines","mechanical wear_age setting_change",
"حروف الـemboss/coding ناقصة أو مكسورة أو متركبة غلط|Emboss/code type missing, broken or wrongly set",
"افحص حروف الـembossing وعمقها وقارن الكود بالـbatch record|Inspect emboss characters and depth; compare code with BMR",
["حرف اتكسر أو فك وقت التشغيل|A type character broke or loosened in run",
"التركيب يدوي ومفيش verification تاني|Type set manually with no second verification",
"مفيش كاميرا OCV ولا standard للتحقق من الكود|No OCV camera and no code verification standard"],
"100 qa","ocv co","reject");

/* --- carton --- */
C("ct_magazine","materials","storage env_heat_humidity handling",
"الكرتون مقوّس أو مضغوط (تخزين أو تحميل الـmagazine)|Cartons bowed or crushed (storage or magazine load)",
"شوف استواء الكرتون وارتفاع الـstack في الـmagazine وحالة الـpallet|Check carton flatness, magazine stack height, pallet state",
["الكرتون شرب رطوبة أو اتضغط فاتقوّس|Cartons absorbed moisture or were compressed and bowed",
"اتخزن جنب باب أو اتحط على الخط من غير conditioning|Stored near a dock door or used without conditioning",
"مفيش standard لتخزين الكرتون وحد للـstack|No carton storage/conditioning standard or stack limit"],
"matq","storage setting","minorstops");
C("ct_crease","materials","supplier new_material_batch",
"الكرتون: الـcrease ناشف أو الأبعاد/الـglue flap مختلفة|Carton crease stiff or dimensions/glue flap off spec",
"اعمل crease bend test وقيس الأبعاد بالـgauge مقارنة بـbatch كويسة|Crease bend test; gauge dimensions vs a good batch",
["الكرتونة مقاومة للفتح فالـcups بتفلت|Carton resists opening so cups lose grip",
"قوة الـcrease مش بتتقاس في الاستلام|Crease stiffness not measured at receipt",
"المواصفة والاتفاق مع المورد مفيهمش حد لقوة الفتح|Spec and supplier agreement have no opening force limit"],
"matq","spec incoming","minorstops");
C("ct_leaflet","machines","mechanical setting_change new_material_batch",
"الـleaflet folder: plates/rollers مش مظبوطة أو الورق مختلف|Leaflet folder plates/rollers mis-set or paper differs",
"حدد مكان الـjam وشوف ضبط الـfold plates ونظافة الـrollers والـgrammage|Locate jam; check fold plates, roller cleanliness, grammage",
["الورقة بتتزحلق أو بتتطبق مايلة|Leaflet slips or folds skewed",
"الـrollers عليها تراب ورق أو الضبط اتحرك|Rollers glazed with paper dust or settings drifted",
"ضبط الـfolder مش موثق وتنضيف الـrollers مش في الـCIL|Folder settings undocumented; roller cleaning not in CIL"],
"clean setback","presence setting cil","minorstops");
C("ct_transfer","machines","alignment mechanical minor_stops",
"تزامن نقل البليستر/الزجاجة للـbucket مش مظبوط|Infeed transfer to buckets out of timing",
"شغّل jog وشوف المنتج داخل الـbucket في السنتر وراجع الـtiming على الـencoder|Jog and watch product centre into bucket; check encoder timing",
["المنتج بيخبط في حافة الـbucket أو بق الكرتونة|Product hits bucket edge or carton mouth",
"الـtiming اتحرك بعد تدخل أو coupling فك|Timing shifted after intervention or loose coupling",
"مفيش timing marks ولا قيم مرجعية في الـsetting sheet|No timing marks or reference values in setting sheet"],
"setback","marks setting","minorstops");
C("ct_pusher","machines","mechanical wear_age vibration",
"الـpusher أو الـoverload clutch أو الـchain مستهلك/مرتخي|Pusher, overload clutch or chain worn/slack",
"افحص لعب الـpusher وشد الـchain وحالة الـoverload clutch|Check pusher play, chain tension, overload clutch state",
["الـpusher بيتأخر أو الـclutch بيفصل بدري|Pusher lags or clutch trips early",
"الـchain اتمطت والـbushes اتآكلت|Chain stretched and bushes worn",
"مفيش قياس مط chain ولا route تشحيم في الـPM|No chain elongation check or lube route in PM"],
"fix","mech lub","mtbf");
C("ct_hotmelt","machines","overheating mechanical defects",
"الـhot melt: nozzle مسدود أو حرارة/ضغط الغرا غلط|Hot melt nozzle clogged or glue temp/pressure wrong",
"شوف خط الغرا على كرتونة وحرارة الـtank/hose/gun وفلتر الـnozzle|Check bead on a carton, tank/hose/gun temps, nozzle filter",
["الغرا اتكرمل (char) وسد الـnozzle|Glue charred and blocked the nozzle",
"الـtank بيفضل سخن في الوقفات الطويلة|Tank kept at full heat during long stops",
"مفيش standby mode ولا PM لتغيير الفلتر والـnozzle|No standby setting or PM for filter/nozzle change"],
"clean 100","glue hotmelt","reject");
C("ct_close","machines","mechanical alignment setting_change",
"أدوات الـtuck-in/قفل الـflaps مش مظبوطة|Tuck-in or flap closing tools mis-set",
"حدد أنهي flap بيفضل مفتوح وقارن مكان الـtools بعلامات الضبط|Note which flap fails; compare tool positions with marks",
["الـflap مش بيتطبق قبل الـtuck|Flap not pre-folded before the tuck",
"مكان الـtool اتحرك بعد الـchangeover|Tool position moved after changeover",
"مفيش fixed stops أو علامات للـclosing tools|No fixed stops or marks on closing tools"],
"setback 100","smed presence setting","reject");
C("ct_printer","machines","wear_age setting_change contamination",
"الطباعة (TIJ/laser): رأس متسخ، حبر قليل أو مسافة غلط|Printer (TIJ/laser): dirty head, low ink or wrong distance",
"شوف جودة الطباعة ومستوى الحبر ومسافة الرأس للكرتونة ونظافة الـnozzle|Check print quality, ink level, head distance, nozzle",
["الكود باهت أو ناقص فالكاميرا بترفضه|Code faint or partial so the camera rejects it",
"الرأس نشف في وقفة أو الحبر خلص من غير إنذار بدري|Head dried during a stop or ink ran out without early warning",
"مفيش purge/clean routine ولا low-ink warning في الـstandard|No purge/clean routine or low-ink warning in the standard"],
"clean challenge","print setting","ser_rej");
C("ct_serial","measurement","plc_software sensor software_change",
"الـserialization: grade الكود ضعيف أو اتصال الـL3/vision|Serialization: low 2D code grade or L3/vision link fault",
"اقرا سبب الـreject في الـvision (grade، duplicate، no read) وحالة الـserver|Read vision reject reason (grade, duplicate, no-read) and server link",
["الكود اتطبع أقل من grade C أو الأرقام موصلتش من الـserver|Code below grade C or serials not received from server",
"الكاميرا/الإضاءة اتحركت أو الشبكة بتقطع|Camera/light moved or network drops",
"مفيش متابعة لـtrend الـgrade ولا buffer للـserial numbers|No grade trend monitoring and no serial number buffer"],
"challenge qa","serbuf cil vision","ser_rej");
C("ct_cw","measurement","calibration vibration env_dust",
"الـcheckweigher: calibration/tare غلط أو vibration أو تيار هوا|Checkweigher calibration/tare off, vibration or draught",
"اعمل test بالأوزان المرجعية والـtest cartons وشوف الـvibration والـhood|Run reference weights and test cartons; check vibration and hood",
["القراية بتزحف فبيرفض سليم أو يعدّي ناقص|Reading drifts: rejects good or passes underweight",
"تراب على الـload cell أو الماكينة بتهز الـbase|Dust on load cell or machine shakes the base",
"مفيش performance check يومي ولا calibration plan مناسب|No daily performance check or adequate calibration plan"],
"challenge","calib daily","false_rej");

/* --- counting line (PPS Pharmacount 120) --- */
C("cn_sens","measurement","sensor env_dust calibration",
"حساسات العد (optical channels) عليها تراب أو sensitivity غلط|Counting channel sensors dusty or sensitivity wrong",
"نضّف الـchannels والحساسات واعمل count check بـ100 قرص يدوي|Clean channels and sensors; verify with manual 100-tablet count",
["الحساس بيعد التراب أو بيشوف قرصين لازقين واحد|Sensor counts dust or sees two touching tablets as one",
"التراب بيتراكم من الـvibration ومفيش شفط|Dust accumulates from vibration; no extraction",
"مفيش count verification وتنضيف في بداية كل shift|No count verification and cleaning at each shift start"],
"100 qa","dust cil firstoff","reject");
C("cn_vib","methods","setting_change vibration new_product",
"سعة الـvibratory tray مش مناسبة للمنتج|Vibratory tray amplitude not matched to product",
"اتفرج على تدفق الأقراص: بتتراكب؟ بتنط؟ وقارن الـamplitude بالـrecipe|Watch flow for stacking or bouncing; compare amplitude with recipe",
["الأقراص بتدخل متراكبة أو بتتكسر|Tablets enter stacked or chip",
"الـamplitude اتغير يدوي لزيادة السرعة|Amplitude changed manually to gain speed",
"قيم الـtray مش مقفولة في recipe المنتج|Tray values not locked in the product recipe"],
"setback","recipe setting","reject");
C("cn_gate","machines","pneumatic wear_age utility_air",
"الـgate/flap بيقفل متأخر (valve أو cylinder)|Count gate/flap slow to close (valve or cylinder)",
"شوف زمن قفل الـgate وتسريب الـvalve وحالة seals الـcylinder|Check gate close time, valve leakage, cylinder seals",
["أقراص زيادة بتعدي قبل ما الـgate يقفل|Extra tablets pass before the gate closes",
"الـvalve/الـcylinder بطّأ من الـwear أو هوا مش نضيف|Valve/cylinder slowed by wear or dirty air",
"مفيش PM بعدد cycles للـgate valves|No cycle-based PM for gate valves"],
"fix 100","pneu airsw","reject");
C("cn_bottle","machines","mechanical alignment after_changeover",
"تغذية الزجاجات: الـguides أو الـstarwheel مش مظبوط|Bottle feed: guides or starwheel misaligned",
"حدد نقطة الوقوع وقيس فتحة الـguides وشوف قطع الـstarwheel للـformat|Find tip-over point; check guide gap and starwheel parts",
["الزجاجة بتقع أو بتتزنق عند النقل|Bottles tip or jam at transfer",
"الـguides مش في مكانها بعد الـchangeover|Guides not at position after changeover",
"مفيش fixed positions أو scales على الـguides|No fixed positions or scales on guides"],
"setback","smed setting","minorstops");
C("cn_cap","machines","wear_age mechanical calibration",
"الـcapper: الـtorque غلط (clutch مستهلك أو chuck)|Capper torque wrong: worn clutch or chuck",
"قيس removal torque لـ5 زجاجات بالـtorque tester وافحص الـchuck inserts|Measure removal torque on 5 bottles; inspect chuck inserts",
["الـtorque بيختلف بين الـheads|Torque varies between heads",
"الـmagnetic clutch ضعف أو الـinserts بقت ملساء|Magnetic clutch weakened or inserts worn smooth",
"مفيش torque check دوري ولا PM للـclutch|No periodic torque check or clutch PM"],
"100 qa","calib firstoff","reject");
C("cn_induct","machines","electrical setting_change new_material_batch",
"الـinduction seal ضعيف (power، ارتفاع الـcoil أو الـliner)|Weak induction seal: power, coil height or liner",
"اعمل peel test للـliners وقيس ارتفاع الـcoil وقارن الـpower بالسرعة|Peel test liners; check coil height and power vs speed",
["الـliner مش لازق كويس على بق الزجاجة|Liner not bonded to the bottle neck",
"ارتفاع الـcoil اتغير أو السرعة زادت من غير تعديل الـpower|Coil height changed or speed raised without power change",
"مفيش interlock للـpower مع السرعة ولا detection للـseal|No power/speed interlock and no seal detection"],
"100 qa","recipe setting","reject");
C("cn_label","machines","sensor setting_change new_material_batch",
"الـlabeler: gap sensor أو شد الـweb أو الـliner|Labeller: gap sensor, web tension or liner",
"اعمل teach للـgap sensor وشوف مكان الـlabel وشد الـweb|Teach gap sensor; check label position and web tension",
["الـlabel بيتحط مايل أو بيتنط|Labels placed skewed or skipped",
"الحساس مش متعلم على الـliner الجديد|Sensor not taught for the new liner",
"تغيير رول الـlabels مفيهوش خطوة teach في الـstandard|Label roll change standard has no teach step"],
"setback 100","co presence","reject");

/* --- HVAC --- */
C("hv_filter","machines","env_dust wear_age energy_waste",
"فلاتر الـAHU محمّلة: dP عالي والـairflow قل|AHU filters loaded: high dP, low airflow",
"اقرا dP كل stage وقارنه بالـfinal dP وقيس الـairflow/ACH|Read each stage dP vs final dP limit; check airflow/ACH",
["الهوا قل فالـdP والحرارة في الغرف اتأثروا|Airflow fell, upsetting room dP and temperature",
"الـprefilters اتغيرت متأخر بعد موسم خماسين|Prefilters changed late after a dusty season",
"التغيير بالتاريخ مش بالـdP ومفيش إنذار dP في الـBMS|Change by date not dP; no filter dP alarm in BMS"],
"fix monitor","filter bmsalarm","dp_exc");
C("hv_belt","machines","mechanical vibration wear_age",
"سير المروحة مرتخي/مستهلك أو bearing بايظ|Fan belt slack/worn or bearing failing",
"افحص شد السير ومحاذاة البكر بالـlaser وقيس vibration وحرارة الـbearing|Check belt tension, laser alignment, bearing vibration/temp",
["المروحة بتلف أبطأ والـairflow قل|Fan runs slower, airflow drops",
"السير بيزحلق من سوء محاذاة أو شد|Belt slips from misalignment or tension",
"مفيش PM للشد والمحاذاة ولا vibration route|No tension/alignment PM or vibration route"],
"fix","ecfan belt","mtbf");
C("hv_chw","nature","utility_water env_heat_humidity overheating",
"مية الـchiller سخنة أو الـflow قليل|Chilled water too warm or low flow",
"قيس حرارة supply/return للـCHW والـdP على الـcoil وحالة الـchiller|Measure CHW supply/return temp, coil dP and chiller status",
["الـcoil مش قادر يشيل الحرارة والرطوبة|Coil cannot remove heat and moisture",
"الـcondenser متسخ أو الـrefrigerant ناقص في الصيف|Condenser fouled or low refrigerant in summer",
"مفيش PM موسمي للـchiller قبل الصيف ولا trend للـapproach|No pre-summer chiller PM or approach temperature trend"],
"monitor","chiller bmsalarm","rh_exc");
C("hv_valve","machines","sensor calibration plc_software",
"valve الـCHW/HW أو الـactuator واقف أو الـPID مش مظبوط|CHW/HW valve or actuator stuck, or PID poorly tuned",
"ادي أمر يدوي للـvalve من الـBMS واتأكد إنه بيتحرك فعلًا|Command valve manually from BMS and confirm it really moves",
["الحرارة بتتذبذب أو مش بتوصل للـsetpoint|Temperature oscillates or misses setpoint",
"الـactuator ممسوك أو الـloop على قيم default|Actuator seized or loop on default tuning",
"مفيش stroke test في الـPM ولا review لأداء الـloops|No actuator stroke test in PM or loop performance review"],
"fix monitor","hvac change","rh_exc");
C("hv_door","methods","procedure_gap design_weakness",
"أبواب بتتساب مفتوحة أو interlock بايظ أو تسريب في الغرفة|Doors held open, interlock failed or room leakage",
"لف على الـinterlocks والـdoor closers والـgaskets وفتحات الكابلات وقارن بالـdP|Walk round interlocks, closers, gaskets, penetrations vs dP",
["الـdP بين الغرف بيقع وقت الحركة|Room dP drops during traffic",
"الـinterlock متعطل أو الباب مش بيقفل لوحده|Interlock disabled or door does not self-close",
"مفيش PM للأبواب ولا مؤشر dP عند الباب|No door PM and no dP indication at the door"],
"fix monitor","doors dpled","dp_exc");
C("hv_sensor","measurement","sensor calibration wear_age",
"حساس حرارة/رطوبة/dP بيقرا غلط (drift)|Temp, RH or dP sensor drift",
"قارن القراية بـreference متعاير في نفس النقطة|Compare reading with a calibrated reference at the same point",
["الـBMS شايف قيمة مش حقيقية فبيتحكم غلط|BMS sees a false value and controls wrongly",
"حساسات الرطوبة بتعمل drift مع الوقت والتراب|RH sensors drift with age and dust",
"فترة الـcalibration مش مبنية على تاريخ الـdrift|Calibration interval not based on drift history"],
"monitor","calib redund","bms_cal");
C("hv_dehum","machines","env_heat_humidity electrical wear_age",
"الـdehumidifier: الـdesiccant wheel أو heater الـreactivation|Desiccant dehumidifier: wheel or reactivation heater fault",
"شوف دوران الـwheel وحرارة الـreactivation والـRH قبل وبعد الوحدة|Check wheel rotation, reactivation temp, RH in/out",
["الرطوبة علت في الغرف اللي محتاجة RH واطي|RH rose in low-RH rooms",
"موتور/سير الـwheel وقف أو الـheater فاصل|Wheel drive/belt stopped or heater open",
"مفيش PM للـdehumidifier ولا إنذار على دوران الـwheel|No dehumidifier PM or wheel rotation alarm"],
"fix monitor","hvac bmsalarm","rh_exc");
C("hv_drain","machines","contamination leak env_heat_humidity",
"الـdrain pan أو الـtrap مسدود والمية واقفة أو بتتسحب|Drain pan or trap blocked; water standing or carried over",
"افتح الـAHU وشوف مية في الـdrain pan وهل الـtrap فيه water seal|Open AHU; check standing water and trap water seal",
["مية ورا الـcoil بتزود الرطوبة ومصدر microbial|Water behind coil adds RH and microbial risk",
"الـtrap ناشف فالمروحة بتسحب المية أو الـdrain مسدود|Trap dry so fan pulls water, or drain blocked",
"الـtrap مش متصمم للـnegative pressure ومش في الـPM|Trap not designed for negative pressure; not in PM"],
"clean","ahutrap hvac","rh_exc");
C("hv_vfd","machines","electrical utility_power overheating",
"الـVFD بتاع المروحة بيفصل (overcurrent/overtemp/undervoltage)|Fan VFD tripping (overcurrent, overtemp, undervoltage)",
"اقرا الـfault history وقارنه بوقت dips الكهربا وشوف فلتر الـpanel|Read VFD fault log vs power dips; check panel filter and fan",
["المروحة بتقف فالـdP والحرارة بيضيعوا|Fan stops; room dP and temperature are lost",
"الـVFD بيسخن أو الكهربا فيها dips|VFD overheats or supply dips",
"مفيش auto-restart ولا PM لتبريد الـpanels|No auto-restart setting and no panel cooling PM"],
"fix","autorestart panel","trips");

/* --- purified water --- */
C("pw_ro","machines","wear_age contamination",
"الـRO membranes عليها fouling أو scaling|RO membranes fouled or scaled",
"احسب الـnormalized permeate flow والـrejection وقارنهم بالـbaseline|Compare normalized permeate flow and rejection with baseline",
["الـconductivity بعد الـRO علت والـpermeate قل|Post-RO conductivity up and permeate down",
"الـCIP اتأجل أو الـpretreatment مش شغال كويس|CIP delayed or pretreatment underperforming",
"الـCIP بالتاريخ مش بالـnormalized trend|CIP triggered by date, not by normalized trend"],
"monitor","ro pretreat","pw_cond");
C("pw_soft","machines","utility_water wear_age",
"الـsoftener مش بيعمل regeneration صح (ملح أو valve)|Softener not regenerating: salt or control valve",
"قيس الـhardness بعد الـsoftener وشوف مستوى الملح وسجل الـregeneration|Test hardness after softener; check brine and regen log",
["hardness عدّت للـRO وعملت scaling|Hardness passed to the RO and scaled membranes",
"الـbrine tank فاضي أو الـvalve مش بيبدّل|Brine tank empty or valve not switching",
"مفيش hardness check يومي بحد action|No daily hardness check with action limit"],
"fix monitor","hard pretreat","pw_cond");
C("pw_carbon","machines","contamination wear_age",
"الـcarbon filter أو الـSMBS dosing: chlorine وصل للـRO|Carbon filter or SMBS dosing failed: chlorine reached RO",
"قيس free chlorine/ORP قبل الـRO واتأكد من الـbackwash والـdosing pump|Test free chlorine/ORP before RO; check backwash and dosing",
["الـchlorine أكسد الـmembrane فالـrejection وقع|Chlorine oxidised membranes, rejection fell",
"الـcarbon خلص أو الـdosing pump وقفت|Carbon exhausted or dosing pump stopped",
"مفيش ORP monitor بـinterlock ولا عمر محدد للـcarbon|No ORP interlock and no carbon replacement life"],
"monitor","orp pretreat","pw_cond");
C("pw_edi","machines","electrical wear_age",
"الـEDI: تيار قليل أو flows غلط أو scaling|EDI module: low current, wrong flows or scaling",
"اقرا فولت وتيار الـEDI والـproduct/concentrate flows وجودة الـfeed|Read EDI volts/amps, product/concentrate flows, feed quality",
["الـresistivity بعد الـEDI قلت|EDI product resistivity dropped",
"الـfeed فيه CO2/hardness أعلى أو الـDC supply فيه مشكلة|Feed CO2/hardness higher or DC supply fault",
"مفيش trend لقيم الـEDI ولا حدود تشغيل موثقة|No EDI parameter trend or documented operating limits"],
"monitor","pwlog ro","pw_cond");
C("pw_sanit","methods","contamination planning",
"الـsanitization (hot/ozone) مش بيوصل للحرارة أو الوقت|Loop sanitisation not reaching temperature or time",
"راجع chart آخر sanitization: حرارة الـreturn ووقت الـhold|Review last sanitisation chart: return temp and hold time",
["الـbiofilm بدأ يتكون فالـTAMC أو الـTOC علي|Biofilm forming; TAMC or TOC rising",
"الـheat exchanger ضعيف أو الدورة اتلغت عشان الإنتاج|Heat exchanger weak or cycle skipped for production",
"جدول الـsanitization مش محمي في الـplanning ومفيش إنذار فشل|Sanitisation not protected in planning; no failed-cycle alarm"],
"sanit qa","sancycle sanplan","pw_micro");
C("pw_deadleg","machines","design_weakness contamination",
"dead leg أو سرعة قليلة أو خرطوم عند الـpoint of use|Dead leg, low velocity or hose at point of use",
"حدد النقطة اللي فيها النتيجة وشوف طول الفرع (L/D) والسرعة والخراطيم|Locate failing point; check branch L/D, velocity, hoses",
["مية واقفة في فرع أو خرطوم فالبكتيريا بتنمو|Water stagnates in a branch or hose; bacteria grow",
"تعديل قديم ساب فرع طويل أو خرطوم بيفضل متوصل|Old modification left a long branch or hose left connected",
"التعديلات على الـloop من غير design review للـdead legs|Loop changes made without dead-leg design review"],
"sanit qa","deadleg hose","pw_micro");
C("pw_uv","machines","wear_age electrical",
"لمبة الـUV عدت عمرها أو الـsleeve متسخ|UV lamp past life or quartz sleeve fouled",
"شوف ساعات اللمبة وقراية الـintensity ونظافة الـsleeve|Check lamp hours, intensity reading, sleeve cleanliness",
["جرعة الـUV قلت فالتحكم الميكروبي ضعف|UV dose fell; weaker microbial control",
"اللمبة بتتغير لما تطفي مش بالساعات|Lamp changed on failure, not by hours",
"مفيش PM بالساعات ولا intensity alarm|No hour-based PM or intensity alarm"],
"fix monitor","uv bmsalarm","pw_micro");
C("pw_sampling","methods","procedure_gap contamination",
"طريقة الـsampling: flush مش كفاية أو الـvalve مش متعقم|Sampling method: short flush or valve not sanitised",
"راجع الـsampling SOP وافحص الـvalve وأعد الـsampling بعد flush صح|Review sampling SOP; inspect valve; resample after correct flush",
["النتيجة جاية من الـvalve مش من الـloop|Result reflects the valve, not the loop",
"مدة الـflush وتعقيم الـvalve مش محددين|Flush time and valve sanitising not defined",
"الـsampling SOP مفيهوش خطوات وصور محددة|Sampling SOP lacks defined steps and visuals"],
"sanit","sampling opl","pw_micro");
C("pw_pump","machines","mechanical leak vibration wear_age",
"طرمبة الـloop: الـmechanical seal بيسرب أو cavitation|Loop pump: mechanical seal leak or cavitation",
"شوف تسريب الـseal وصوت الـcavitation وضغط الـsuction ومستوى التنك|Check seal leak, cavitation noise, suction pressure, tank level",
["ضغط وflow الـloop والسرعة قلوا|Loop pressure, flow and velocity dropped",
"مستوى التنك واطي أو الـseal اتآكل|Low tank level or seal worn",
"مفيش low-level interlock مظبوط ولا PM للـseal والـvibration|No proper low-level interlock or seal/vibration PM"],
"isolate","level pump","mtbf");
C("pw_sensor","measurement","sensor calibration",
"حساس الـconductivity/TOC أو الـtemp compensation غلط|Conductivity/TOC sensor or temperature compensation wrong",
"قارن بـreference meter (non-compensated حسب USP) وشوف آخر calibration|Compare with reference meter (uncompensated per USP); check last cal",
["النظام بيطلع OOS مش حقيقي أو بيفوّت حقيقي|System shows false OOS or misses a real one",
"الـcell constant اتغير أو الـcompensation متفعّل غلط|Cell constant drifted or compensation wrongly enabled",
"الـcalibration plan مش بيتحقق من إعدادات الجهاز|Calibration plan does not verify instrument settings"],
"monitor","calib change","pw_cond");
C("pw_vent","machines","contamination overheating",
"فلتر الـvent بتاع التنك مبلول أو مسدود|Tank vent filter wet or blocked",
"شوف حرارة الـvent heater/jacket وحالة الفلتر وتاريخ الـintegrity test|Check vent heater, filter state and last integrity test",
["التنك بيسحب vacuum أو الهوا بيدخل من غير فلترة|Tank pulls vacuum or air bypasses filtration",
"الـcondensate بلّ الفلتر لأن الـheater مش شغال|Condensate wetted filter because heater failed",
"مفيش PM للـvent heater ولا integrity test دوري|No vent heater PM or periodic integrity test"],
"fix","ventf bmsalarm","pw_micro");

/* --- compressed air --- */
C("ar_leak","methods","leak energy_waste utility_air",
"تسريبات في الشبكة والماكينات|Leaks in the network and machines",
"اعمل جولة ultrasonic في وقت مفيش إنتاج وقيس زمن الـload للكمبروسر|Ultrasonic survey at no-production; measure compressor load time",
["الكمبروسر بيشتغل load أكتر والضغط بيقع|Compressor loads longer and pressure drops",
"تسريبات في الـfittings والخراطيم والـdrains|Leaks at fittings, hoses and drains",
"مفيش برنامج leak survey وtagging بفترة ثابتة|No periodic leak survey and tagging programme"],
"fix","airleak isolv","air_kwh");
C("ar_dryer","machines","utility_air contamination env_heat_humidity",
"الـdryer: desiccant خلص أو refrigerant/valve بايظ|Dryer fault: exhausted desiccant or refrigerant/valve issue",
"اقرا الـdew point بجهاز reference وشوف تبديل الأبراج أو حرارة الـfridge dryer|Check dew point with reference; tower switching or fridge temp",
["الـdew point علي فبقى فيه مية في الشبكة|Dew point rose; water in the network",
"الـdesiccant خلص أو الـpurge valve واقف|Desiccant exhausted or purge valve stuck",
"مفيش online dew point alarm ولا عمر محدد للـdesiccant|No online dew point alarm or desiccant life plan"],
"isolate monitor","dew dryer","dewpoint");
C("ar_filter","machines","contamination wear_age energy_waste",
"فلاتر الخط (coalescing/particulate) مسدودة|Line filters (coalescing/particulate) blocked",
"قيس الـdP على كل فلتر وشوف تاريخ تغيير العنصر|Measure dP across each filter; check element change date",
["ضغط بيضيع على الفلاتر|Pressure is lost across the filters",
"العناصر عدت عمرها|Elements past their service life",
"التغيير مش مربوط بالـdP ومفيش gauges واضحة|Change not linked to dP; no clear dP gauges"],
"fix","filter vis","air_press");
C("ar_cool","nature","overheating env_heat_humidity env_dust",
"الكمبروسر بيفصل overtemp: تهوية أو cooler متسخ|Compressor high-temp trip: ventilation or dirty cooler",
"قيس حرارة الأوضة والـdischarge وافحص الـcooler والـintake filter|Measure room and discharge temps; inspect cooler and intake filter",
["الكمبروسر بيفصل في الصيف|Compressor trips in summer",
"الـcooler مسدود تراب والتهوية مش كفاية|Cooler blocked with dust; poor room ventilation",
"مفيش PM موسمي للتنضيف والأوضة ناقصها exhaust|No seasonal cleaning PM; room lacks exhaust capacity"],
"clean portable","ventroom comp","trips");
C("ar_drain","machines","leak utility_air contamination",
"الـauto drain واقف أو بيسرب هوا|Auto drain stuck closed or blowing air",
"اضغط test على الـdrain وشوف مية في الـreceiver أو هوا طالع على طول|Press drain test; check receiver water or continuous blowing",
["مية بتعدي للشبكة أو هوا بيضيع|Water carries over or air is wasted",
"الـtimer drain اتسد بالـsludge|Timer drain clogged by sludge",
"مفيش zero-loss drains ولا check في الـPM|No zero-loss drains and no PM check"],
"fix","zld comp","air_kwh");
C("ar_control","methods","setting_change energy_waste",
"الـsetpoints والـsequencing للكمبروسرات مش مظبوطة|Compressor setpoints/sequencing not optimised",
"راجع الـsetpoints وساعات الـload/unload/idle لكل كمبروسر|Review setpoints and load/unload/idle hours per unit",
["ضغط عالي أو كمبروسرين شغالين partial load|Pressure set high or two units on part load",
"الـsetpoint اترفع عشان يغطي مشكلة ماكينة واحدة|Setpoint raised to cover one machine's problem",
"مفيش master controller ولا standard للـsetpoints|No master controller and no setpoint standard"],
"setback","master setting","air_kwh");
C("ar_pipe","machines","design_weakness",
"مواسير صغيرة/طويلة: pressure drop في آخر الخط|Undersized/long pipework: pressure drop at line end",
"قيس الضغط عند الكمبروسر وعند آخر ماكينة وقت الذروة|Measure pressure at compressor and at last machine at peak",
["آخر الخط بياخد ضغط أقل من المطلوب|Line end receives below required pressure",
"أحمال اتضافت على نفس الـheader|Loads were added on the same header",
"مفيش مراجعة capacity للشبكة مع أي ماكينة جديدة|No network capacity review when machines are added"],
"portable","ring change","air_press");

/* --- steam boiler --- */
C("bo_burner","machines","utility_steam sensor wear_age",
"الـburner: flame sensor متسخ أو igniter أو ضغط الغاز|Burner: dirty flame sensor, igniter or gas pressure",
"اقرا كود الـlockout ونضّف الـflame sensor وقيس ضغط الغاز والـignition|Read lockout code; clean flame sensor; check gas pressure, ignition",
["الغلاية بتعمل flame failure lockout|Boiler goes to flame failure lockout",
"الـsensor عليه سناج أو الـelectrode مستهلك|Sensor sooted or electrode worn",
"مفيش combustion tuning وتنضيف في الـPM|No combustion tuning and cleaning in PM"],
"fix","burner spares","trips");
C("bo_water","methods","utility_water contamination procedure_gap",
"معالجة مية الغلاية: hardness أو TDS أو blowdown مش مظبوط|Boiler water treatment: hardness, TDS or blowdown off",
"قيس hardness وTDS وpH للغلاية والـfeed وراجع سجل الـblowdown|Test hardness, TDS, pH; review blowdown log",
["scaling أو foaming والـsteam مبلول|Scaling or foaming; wet steam",
"الـsoftener/الـdosing مش شغال أو الـblowdown مش منتظم|Softener/dosing off or irregular blowdown",
"مفيش log يومي بحدود ولا automatic TDS blowdown|No daily water log with limits or automatic TDS blowdown"],
"monitor","tds wlog","steam_eff");
C("bo_level","machines","sensor contamination",
"حساسات الـlevel عليها scale أو الـfloat chamber متسخ|Level probes scaled or float chamber fouled",
"اعمل blowdown test للـlevel control واتأكد إن الـlow-water cut-off بيفصل|Run level control blowdown test; prove low-water cut-off",
["إنذار/lockout low water أو level بيتذبذب|Low water alarm/lockout or unstable level",
"scale على الـprobes من معالجة المية|Scale on probes from poor water treatment",
"مفيش test يومي للـlevel controls ولا تنضيف دوري|No daily level control test or periodic cleaning"],
"fix monitor","wlog boiler","trips");
C("bo_trap","machines","utility_steam energy_waste leak",
"steam traps بايظة (مفتوحة أو مسدودة)|Failed steam traps (blowing or blocked)",
"اعمل survey للـtraps بـultrasonic أو IR gun|Survey traps with ultrasonic detector or IR gun",
["steam بيضيع أو الـcondensate بيعمل water hammer|Steam lost or condensate causes water hammer",
"الـtraps مستهلكة أو الـstrainers مسدودة|Traps worn or strainers blocked",
"مفيش survey سنوي ولا trap register|No annual trap survey or trap register"],
"fix","trapmon trap","steam_eff");
C("bo_sv","machines","calibration wear_age safety_guard",
"صمام الأمان بيسرب أو بيفتح بدري|Safety valve passing or lifting early",
"قارن ضغط التشغيل بالـset pressure للصمام وضبط الـpressure switches|Compare operating pressure vs SV set and pressure switch settings",
["الصمام بيفتح أو بيسرب فالـsteam بيضيع|Valve lifts or weeps, losing steam",
"الـpressure switch قريب من الـset pressure أو الـseat اتأذى|Pressure switch set too close to SV or seat damaged",
"مفيش recertification للصمامات ولا جدول settings معتمد|No SV recertification plan or approved settings table"],
"monitor","boiler setting","trips");
C("bo_feed","machines","mechanical utility_water wear_age",
"طرمبة الـfeed: cavitation أو seal (مية التنك سخنة)|Feed pump cavitation or seal leak (hot feed tank)",
"شوف حرارة الـfeed tank والـNPSH وصوت الطرمبة وتسريب الـseal|Check feed tank temp/NPSH, pump noise, seal leak",
["الطرمبة مش بتغذي كفاية فالـlevel بيوطى|Pump under-feeds; level drops",
"مية الـfeed قريبة من الغليان فبيحصل cavitation|Feed water near boiling causes cavitation",
"ارتفاع التنك مش متراجع ومفيش test للـstandby pump|Tank head not reviewed; no standby pump test"],
"isolate","npsh pump","mtbf");

/* --- electrical distribution --- */
C("el_loose","machines","electrical overheating vibration",
"تيرمنال أو وصلة bus bar فاكة (hotspot)|Loose terminal or busbar joint (hotspot)",
"اعمل thermography تحت حمل وقارن الفازات|Thermographic scan under load; compare phases",
["الوصلة سخنت فالـbreaker فصل أو الكابل اتحرق|Joint overheated; breaker tripped or cable burnt",
"الـvibration والدورات الحرارية فكّت العزم|Vibration and thermal cycling loosened torque",
"مفيش thermography دوري ولا re-torque في الـPM|No periodic thermography or re-torque in PM"],
"isolate","thermo panel","trips");
C("el_overload","methods","electrical planning",
"حمل زيادة على الـfeeder بعد إضافة أحمال|Feeder overloaded after added loads",
"قيس تيار الفازات وقت الذروة وقارنه بالـbreaker والكابل|Measure phase currents at peak vs breaker and cable rating",
["الـbreaker بيفصل thermal وقت الذروة|Breaker trips on thermal at peak",
"اتضافت أحمال من غير حسابات|Loads added without calculation",
"مفيش load study ولا change control لإضافة أحمال|No load study or change control for added loads"],
"isolate","feeder change","trips");
C("el_pq","nature","utility_power electrical",
"جودة الكهربا: voltage dips من الشبكة أو harmonics|Power quality: grid voltage dips or harmonics",
"ركّب power quality analyzer أسبوع وقارن الأحداث بوقت الوقفات|Log a power quality analyser for a week; match events to stops",
["الماكينات والـVFDs بتفصل undervoltage|Machines and VFDs trip on undervoltage",
"dips من الشبكة وharmonics عالية من الأحمال|Grid dips and high harmonics from loads",
"مفيش ride-through ولا harmonic filters في التصميم|No ride-through or harmonic filtering in the design"],
"monitor","pqfilt autorestart","trips");
C("el_insul","nature","electrical env_heat_humidity leak",
"عزل ضعيف أو رطوبة: earth fault أو RCD بيفصل|Weak insulation or moisture: earth fault or RCD trip",
"قيس العزل بالـmegger بعد LOTO ودوّر على مية أو رطوبة في البوكسات|Megger the circuit under LOTO; look for water in boxes",
["تيار تسريب للأرضي فالحماية بتفصل|Leakage current to earth trips protection",
"مية دخلت boxes أو كابل اتأذى|Water entered boxes or a cable is damaged",
"الـIP rating والـglands مش متراجعين ومفيش IR test دوري|IP rating/glands not reviewed; no periodic IR test"],
"isolate","ip ir","trips");
C("el_ups","machines","electrical wear_age",
"بطاريات الـUPS ضعيفة أو الـUPS بايظ|UPS batteries weak or UPS fault",
"شوف عمر البطاريات واعمل battery test وقيس الـautonomy|Check battery age; run battery test and autonomy check",
["الأحمال الحرجة وقعت لحظة انقطاع الكهربا|Critical loads dropped at power loss",
"البطاريات عدت عمرها في أوضة سخنة|Batteries past life in a hot room",
"مفيش battery test دوري ولا تغيير بالعمر|No periodic battery test or age-based replacement"],
"portable","ups spares","trips");
C("el_panelcool","nature","overheating env_dust",
"الـpanel سخن: فلتر/مروحة التهوية أو تكييف الـpanel|Panel overheating: blocked filter/fan or failed panel AC",
"قيس الحرارة جوه الـpanel وشوف الفلتر والمروحة والتكييف|Measure inside temperature; check filter, fan and panel AC",
["الـdrives والـPLC بيفصلوا أو بيعملوا faults|Drives and PLC trip or fault",
"الفلتر مسدود أو المروحة واقفة|Filter blocked or fan stopped",
"تهوية الـpanels مش في الـPM ومفيش temp alarm|Panel ventilation not in PM; no temperature alarm"],
"clean portable","panel bmsalarm","trips");
C("el_pf","machines","electrical energy_waste",
"الـcapacitor bank بايظ: power factor واطي وغرامة|Capacitor bank fault: low power factor and penalty",
"شوف الـPF على عداد الـMDB وsteps الـcontroller والـfuses|Check PF on MDB meter, controller steps and fuses",
["الـPF نزل تحت 0.9 في الفاتورة|PF fell below 0.9 on the bill",
"capacitors منفوخة أو fuses/contactors فاصلين|Capacitors swollen or fuses/contactors failed",
"مفيش PM للـbank ولا متابعة شهرية للـPF|No capacitor bank PM or monthly PF tracking"],
"fix","cap energy","pf");
C("el_protset","methods","setting_change electrical design_weakness",
"إعدادات الحماية/الـselectivity غلط: بيفصل أكبر من اللازم|Protection settings/selectivity wrong: upstream trips",
"قارن settings الـbreakers بالـcoordination study واقرا سجل الـtrip unit|Compare breaker settings with coordination study; read trip log",
["عطل صغير فصّل breaker رئيسي|A small fault tripped a main breaker",
"الـsettings اتغيرت أو اتسابت default|Settings changed or left at default",
"مفيش coordination study محدثة ولا سجل settings|No updated coordination study or settings record"],
"isolate","study change","trips");

/* --- BMS / EMS --- */
C("bm_comm","machines","plc_software electrical",
"انقطاع اتصال الـBMS (controller أو network أو switch)|BMS comms loss: controller, network or switch",
"حدد الـcontrollers الـoffline وشوف LEDs الـswitch والـpower بتاعه|Identify offline controllers; check switch LEDs and power",
["البيانات وقفت والإنذارات مش بتوصل|Data stopped and alarms not reaching",
"الـswitch/الـcontroller من غير UPS أو كابل اتأذى|Switch/controller has no UPS or cable damaged",
"مفيش watchdog للاتصال ولا UPS للـnetwork|No comms watchdog and no network UPS"],
"monitor","watchdog ups","data_av");
C("bm_alarm","methods","procedure_gap documentation",
"حدود وdelays الإنذارات مش متراجعة (alarm flood)|Alarm limits/delays not rationalised (alarm flood)",
"اسحب عدد الإنذارات في الأسبوع وأكتر 10 متكررين وقارن الحدود بالـURS|Pull weekly alarm count and top 10; compare limits with URS",
["إنذارات كتير فالمهم بيضيع وسطها|Too many alarms hide the important ones",
"الحدود اتحطت default من غير مراجعة|Limits set as defaults without review",
"مفيش alarm management standard ولا review دوري|No alarm management standard or periodic review"],
"monitor","alarm change","alarms");
C("bm_data","methods","software_change documentation plc_software",
"بيانات ناقصة/audit trail أو تعديل من غير change control|Data gaps/audit trail or change without change control",
"راجع الـaudit trail وآخر backup والفجوات في الـtrend|Review audit trail, last backup and trend gaps",
["trend ناقص في فترة GMP|GMP trend has gaps",
"الـserver امتلا أو setting اتغير من غير record|Server storage full or setting changed unrecorded",
"مفيش backup/restore test ولا change control على الـBMS|No backup/restore test and no BMS change control"],
"qa","backup change","data_av");

/* --- general / building --- */
C("gn_interlock","machines","electrical mechanical safety_guard",
"interlock أو magnetic lock أو door closer بايظ|Door interlock, mag lock or closer faulty",
"جرّب الـinterlock يدوي وافحص الـsensor والـmag lock والـcloser|Test interlock manually; check sensor, mag lock, closer",
["البابين بيتفتحوا مع بعض أو الباب مش بيقفل|Both doors open together or door does not close",
"الـsensor اتحرك أو الـcloser ضعف|Sensor shifted or closer weakened",
"الأبواب والـinterlocks مش في الـPM plan|Doors and interlocks not in the PM plan"],
"fix monitor","doors dpled","dp_exc");
C("gn_light","machines","electrical wear_age",
"إضاءة: driver أو لمبة أو بطارية emergency light|Lighting: driver/lamp or emergency light battery",
"قيس الـlux في المكان وجرّب الـemergency lights بزرار الـtest|Measure lux; test emergency lights with test button",
["الإضاءة أقل من المطلوب في منطقة شغل أو فحص|Light below required level at a work or inspection point",
"الـdrivers والبطاريات عدت عمرها|Drivers and batteries past life",
"مفيش lux survey ولا test شهري للـemergency lights|No lux survey or monthly emergency light test"],
"fix","led light","mttr");
C("gn_water_in","nature","leak env_heat_humidity design_weakness",
"مية داخلة من السقف أو الـdrain أو تكثيف|Water ingress from roof, drain or condensation",
"تتبع مصدر المية: سقف، ماسورة، أو تكثيف على ماسورة chilled من غير عزل|Trace source: roof, pipe, or condensation on uninsulated CHW pipe",
["مية/رطوبة في منطقة GMP أو فوق panel|Water or damp in a GMP area or above a panel",
"عزل ماسورة باظ أو السقف/الـgutter مسدود|Pipe insulation failed or roof/gutter blocked",
"مفيش building inspection قبل الشتا|No pre-winter building inspection"],
"clean qa","insul building","mttr");
C("gn_surface","materials","wear_age contamination handling",
"أرضية epoxy أو حيطان أو سقف متشقق في منطقة GMP|Cracked epoxy floor, wall or ceiling in GMP area",
"صوّر وحدد مساحة التلف وسببه (عربيات، خبط، مية)|Photograph and size the damage; find cause (trolleys, impact, water)",
["السطح مبقاش قابل للتنضيف وبيجمع تراب|Surface no longer cleanable; collects dust",
"خبط عربيات وpallet trucks من غير حماية|Trolley and pallet truck impacts with no protection",
"مفيش bumpers/corner guards ولا building inspection دوري|No bumpers/corner guards or periodic building inspection"],
"qa","guard building","mttr");

/* COUNTERMEASURES */
/* containment */
M("clean","temporary","LL","mp","تنضيف الجزء/الحساس وتجربة وتأكيد قبل التشغيل|Clean the part/sensor and verify with a test before restart");
M("setback","temporary","LL","mp","رجّع الضبط لقيم الـsetting sheet/الـvalidated recipe|Restore settings to setting sheet / validated recipe values");
M("fix","temporary","LL","m","إصلاح أو تغيير الجزء التالف وعمل تجربة|Repair or replace the faulty part and run a test");
M("matq","temporary","HL","s","quarantine للـbatch، شغّل batch تانية وبلّغ المورد|Quarantine the material batch, switch batch, notify supplier");
M("challenge","inspection","HL","mp","challenge test للكاميرا/الـreject بعينات معروفة|Run reject challenge with known good/bad samples");
M("100","temporary","HL","p","فحص 100% للإنتاج المشكوك فيه وعزله|100% inspect and segregate suspect output");
M("qa","temporary","HL","q","وقف/عزل المنتج، فتح deviation وimpact assessment مع QA|Hold product, raise deviation and impact assessment with QA");
M("leak","inspection","HL","p","زوّد تكرار الـleak test لحد ما السبب يتقفل|Increase leak test frequency until cause is closed");
M("monitor","inspection","HL","u","زوّد قراءات المتابعة اليدوية مع حدود واضحة|Increase manual readings with clear alert limits");
M("sanit","temporary","HH","u","sanitization إضافية وإعادة sampling قبل الإفراج|Extra sanitisation and resampling before release");
M("isolate","temporary","HL","m","LOTO للدايرة/الوحدة الضاربة وتشغيل الـstandby|LOTO the faulty unit/circuit and run on standby");
M("portable","temporary","HH","u","وحدة مؤقتة (تبريد/كمبروسر/UPS) لحد الإصلاح|Temporary unit (cooling, compressor, UPS) until fixed");
/* design / elimination */
M("sensor","design","HL","e","حساس أنسب (background suppression) وحامل ثابت مع change control|Better-suited sensor and fixed bracket via change control");
M("smed","design","HH","e","format parts مكوّدة بـfixed stops وscales (SMED)|Coded format parts with fixed stops and scales (SMED)");
M("cablechain","design","HL","e","كابلات high-flex في cable chain للأجزاء المتحركة|High-flex cables in cable chain at moving parts");
M("dust","design","HH","e","شفط تراب عند الـfeeder/الـcounter بـchange control|Dust extraction at feeder/counter via change control");
M("ocv","design","HH","e","كاميرا OCV على الـcoding مع auto reject|OCV camera on coding with auto reject");
M("serbuf","design","HH","it","buffer للـserial numbers ومتابعة grade trend على الـline server|Serial number buffer and grade trend on the line server");
M("ecfan","design","HH","e","تحويل لـEC/plug fan direct drive بـchange control وrequalification|Convert to direct-drive EC/plug fan via change control and requal");
M("redund","design","HH","e","حساس redundant للغرف الحرجة مع إنذار فرق القراية|Redundant sensor in critical rooms with deviation alarm");
M("ahutrap","design","HL","e","تصميم الـdrain trap حسب الـnegative pressure (ارتفاع صح)|Size AHU drain trap for fan negative pressure");
M("autorestart","design","HL","e","تفعيل auto-restart/ride-through للـVFD بـchange control|Enable VFD auto-restart / ride-through via change control");
M("deadleg","design","HH","e","إزالة الـdead leg (zero dead leg valve) بـchange control وrequalification|Remove dead leg (zero dead leg valve) via change control + requal");
M("isolv","design","HL","e","valves قفل أوتوماتيك للخطوط والماكينات الواقفة|Auto shut-off valves for idle lines and machines");
M("ventroom","design","HH","e","تحسين تهوية أوضة الكمبروسرات (exhaust/duct للـcooler)|Improve compressor room ventilation (exhaust, cooler ducting)");
M("zld","design","HL","e","zero-loss drains بدل الـtimer drains|Zero-loss drains instead of timer drains");
M("master","design","HH","e","master controller للكمبروسرات بـpressure band ضيق|Compressor master controller with narrow pressure band");
M("ring","design","HH","e","ring main أو header أكبر أو receiver محلي بـchange control|Ring main, larger header or local receiver via change control");
M("tds","design","HH","e","تحكم أوتوماتيك في الـTDS blowdown|Automatic TDS blowdown control");
M("trapmon","design","HH","e","monitoring للـtraps الحرجة (wireless)|Wireless monitoring of critical steam traps");
M("npsh","design","HH","e","تحسين الـNPSH (رفع التنك/booster) بـchange control|Improve NPSH (raise tank or booster) via change control");
M("feeder","design","HH","e","فصل/تكبير الـfeeder حسب load study|Split or upsize feeder per load study");
M("pqfilt","design","HH","e","harmonic filter أو ride-through للأحمال الحرجة|Harmonic filter or ride-through for critical loads");
M("ip","design","HL","e","رفع الـIP rating والـglands في الأماكن الرطبة|Upgrade IP rating and glands in wet locations");
M("study","design","HH","e","تحديث coordination study وتطبيق الـsettings بـchange control|Update coordination study and apply settings via change control");
M("backup","design","HL","it","backup أوتوماتيك للـBMS مع restore test دوري|Automatic BMS backup with periodic restore test");
M("led","design","HL","e","تحويل لـLED fixtures مناسبة للـcleanroom|Convert to cleanroom-rated LED fixtures");
M("insul","design","HL","e","إعادة عزل مواسير الـCHW بـvapour barrier|Re-insulate CHW pipes with vapour barrier");
M("guard","design","HL","e","bumpers وcorner guards في ممرات العربيات|Bumpers and corner guards on trolley routes");
/* poka-yoke / automatic detection */
M("recipe","poka_yoke","HL","e","قفل الـvalidated settings في الـHMI recipe بحدود وصلاحيات|Lock validated settings in HMI recipe with limits and access");
M("airsw","poka_yoke","HL","e","pressure switch يوقف الماكينة لو الهوا وقع|Low-air pressure switch that stops the machine");
M("vacsw","poka_yoke","HL","e","vacuum switch بإنذار ووقف عند فقد الـvacuum|Vacuum switch with alarm and stop on vacuum loss");
M("reel","poka_yoke","HL","e","stops وعلامات سنترة على الـunwind shaft|Centring stops and marks on the unwind shaft");
M("flow","poka_yoke","HL","e","flow switch على مية التبريد بإنذار ووقف|Cooling water flow switch with alarm and stop");
M("presence","poka_yoke","HL","e","حساس presence (leaflet/منتج/flap) مع auto reject|Presence detection (leaflet, product, flap) with auto reject");
M("marks","poka_yoke","HL","m","علامات timing على الـshafts والـcouplings|Timing marks on shafts and couplings");
M("glue","poka_yoke","HH","e","glue detection sensor + standby mode للـhot melt|Glue detection sensor and hot melt standby mode");
M("bmsalarm","poka_yoke","HL","e","إنذار BMS على الـparameter بحدود alert/action|BMS alarm on the parameter with alert/action limits");
M("dpled","poka_yoke","HL","e","مؤشر dP/ضوء عند باب الغرفة|Room dP indicator or light at the door");
M("hard","poka_yoke","HH","e","online hardness monitor يوقف الـRO|Online hardness monitor with RO stop");
M("orp","poka_yoke","HH","e","ORP/chlorine monitor بـinterlock قبل الـRO|ORP/chlorine monitor with interlock before RO");
M("sancycle","poka_yoke","HL","e","إنذار فشل دورة الـsanitization (temp/time) في الـPLC|Failed sanitisation cycle alarm (temp/time) in PLC");
M("level","poka_yoke","HL","e","low-level interlock مظبوط لحماية طرمبة الـloop|Proper low-level interlock to protect loop pump");
M("dew","poka_yoke","HH","e","online dew point sensor بإنذار في الـBMS|Online dew point sensor with BMS alarm");
M("watchdog","poka_yoke","HL","it","watchdog للاتصال بإنذار SMS/email|Comms watchdog with SMS/email alarm");
/* PM */
M("cil","pm","HL","mp","إضافة تنضيف وفحص الحساس/الكاميرا للـCIL بالفترة|Add sensor/camera cleaning and check to CIL at set interval");
M("pneu","pm","HL","m","PM للـFRL والـvalves والـcylinders بعدد cycles|PM for FRL, valves and cylinders by cycle count");
M("cups","pm","HL","m","تغيير الـsuction cups والفلتر بعدد cycles|Replace suction cups and filter by cycle count");
M("heat","pm","HL","m","PM للـheaters: مقاومة، تيار وverification حرارة الـplates|Heater PM: resistance, current and plate temperature check");
M("tool","pm","HL","m","PM لـforming/pull/punch station: seals، grippers، vents|PM of forming/pull stations: seals, grippers, vents");
M("seal","pm","HL","m","تنضيف الـsealing plate وفحص الـparallelism بفترة|Sealing plate cleaning and parallelism check at interval");
M("punch","pm","HL","m","عداد ضربات وعمر للـpunch/die مع سن مخطط|Stroke counter and life limit for punch/die, planned regrind");
M("cool","pm","HL","m","PM لدايرة التبريد: strainers، flow وحرارة|Cooling circuit PM: strainers, flow and temperature");
M("mech","pm","HL","m","قياس مط الـchain والـbushes وفحص الـclutch في الـPM|Chain elongation, bushes and clutch check in PM");
M("lub","pm","LL","m","route تشحيم بنقط ومواد وفترات واضحة|Lubrication route with points, grades and intervals");
M("hotmelt","pm","HL","m","تغيير فلتر وnozzle الـhot melt وتنضيف التنك بفترة|Hot melt filter/nozzle change and tank clean at interval");
M("print","pm","HL","mp","purge/clean للرأس بفترة وlow-ink warning|Scheduled printhead purge/clean and low-ink warning");
M("calib","pm","HL","m","calibration plan حسب الأهمية والـdrift history|Calibration plan by criticality and drift history");
M("filter","pm","HL","u","تغيير الفلاتر حسب الـdP trend مش التاريخ|Replace filters on dP trend, not calendar");
M("belt","pm","HL","u","PM للسيور: شد ومحاذاة laser وvibration route|Belt PM: tension, laser alignment, vibration route");
M("chiller","pm","HL","u","PM موسمي للـchiller قبل الصيف وtrend للـapproach|Pre-summer chiller PM and approach temperature trend");
M("hvac","pm","HL","u","PM للـAHU: stroke test للـvalves/dampers والـdrain والـcoil|AHU PM: valve/damper stroke test, drain and coil");
M("doors","pm","LL","m","PM للأبواب والـinterlocks والـclosers والـgaskets|PM for doors, interlocks, closers and gaskets");
M("panel","pm","HL","m","PM للـpanels: فلاتر، مراوح، re-torque|Panel PM: filters, fans and re-torque");
M("ro","pm","HL","u","CIP للـRO حسب الـnormalized trend|RO CIP triggered by normalized performance trend");
M("pretreat","pm","HL","u","PM للـpretreatment: softener، carbon، dosing وsalt|Pretreatment PM: softener, carbon, dosing and salt");
M("pump","pm","HL","u","PM للطرمبات: seal، vibration وstandby test|Pump PM: seal, vibration and standby test");
M("uv","pm","LL","u","تغيير لمبة الـUV بالساعات وتنضيف الـsleeve|UV lamp change by hours and sleeve cleaning");
M("ventf","pm","LL","u","فحص vent heater وintegrity test للفلتر بفترة|Vent heater check and filter integrity test at interval");
M("airleak","pm","HL","u","leak survey ultrasonic كل 3 شهور مع tagging|Ultrasonic leak survey every 3 months with tagging");
M("dryer","pm","HL","u","PM للـdryer: desiccant، valves، dew point check|Dryer PM: desiccant, valves, dew point check");
M("comp","pm","HL","u","PM للكمبروسر: cooler، intake filter، drains|Compressor PM: cooler, intake filter, drains");
M("burner","pm","HL","u","combustion tuning وتنضيف الـflame sensor بفترة|Combustion tuning and flame sensor cleaning at interval");
M("boiler","pm","HL","u","PM للغلاية: level probes، safety valves، feed pump|Boiler PM: level probes, safety valves, feed pump");
M("trap","pm","HL","u","survey سنوي للـtraps مع trap register|Annual steam trap survey with trap register");
M("thermo","pm","HL","m","thermography سنوي للـpanels تحت حمل|Annual thermography of panels under load");
M("ir","pm","LL","m","IR test سنوي للموتورات والكابلات الحرجة|Annual insulation test of critical motors and cables");
M("ups","pm","HL","m","battery test دوري وتغيير البطاريات بالعمر|Periodic battery test and age-based replacement");
M("cap","pm","LL","m","PM للـcapacitor bank: capacitance، fuses، contactors|Capacitor bank PM: capacitance, fuses, contactors");
M("light","pm","LL","m","lux survey وtest شهري للـemergency lights|Lux survey and monthly emergency light test");
M("building","pm","HL","e","building inspection دوري (سقف، drains، أسطح GMP)|Periodic building inspection (roof, drains, GMP surfaces)");
/* standards */
M("setting","standard","HL","mp","setting sheet لكل format بقيم وصور وcenterlines|Setting sheet per format with values, photos and centerlines");
M("co","standard","HL","mp","changeover checklist فيها first-off verification|Changeover checklist with first-off verification");
M("spec","standard","HH","s","تحديث المواصفة بـtolerances تشغيلية وquality agreement مع المورد|Update spec with machinability tolerances and supplier QA agreement");
M("incoming","standard","HL","s","incoming test للخواص الحرجة بدل الـCoA بس|Incoming test of critical properties, not CoA only");
M("vision","standard","HL","e","standard لإدارة recipes الكاميرا وmaster images والـchallenge|Vision recipe management, master images and challenge standard");
M("spares","standard","HL","m","critical spares list بـmin/max للأجزاء دي|Critical spares list with min/max for these parts");
M("storage","standard","HL","w","standard تخزين وconditioning للكرتون (حرارة/رطوبة/stack)|Carton storage and conditioning standard (temp, RH, stack)");
M("change","standard","HL","e","أي تعديل على PLC/BMS/settings بـchange control وbackup|All PLC/BMS/setting changes via change control with backup");
M("pwlog","standard","HL","u","سجل تشغيل PW بحدود alert/action لكل parameter|PW operating log with alert/action limits per parameter");
M("sanplan","standard","HL","u","جدول sanitization محمي في الـplanning ولا يتلغيش|Sanitisation schedule protected in planning, never skipped");
M("hose","standard","LL","u","standard للخراطيم: drain وتجفيف وتخزين، ممنوع تفضل متوصلة|Hose standard: drain, dry, store; never left connected");
M("sampling","standard","HL","q","sampling SOP بزمن flush وتعقيم الـvalve وصور|Sampling SOP with flush time, valve sanitising and visuals");
M("vis","standard","LL","u","visual control: gauges بمناطق خضرا/حمرا|Visual control: gauges with green/red zones");
M("wlog","standard","LL","u","سجل يومي لمية الغلاية والـlevel test بحدود|Daily boiler water and level control test log with limits");
M("energy","standard","LL","u","مراجعة شهرية للطاقة والـPF في اجتماع الـutilities|Monthly energy and PF review in utilities meeting");
M("alarm","standard","HL","e","alarm management standard: حدود، delays، أولويات وreview|Alarm management standard: limits, delays, priorities, review");
/* inspection / training (weaker) */
M("firstoff","inspection","LL","p","first-off وفحص كل ساعة بعينات|First-off and hourly sample checks");
M("daily","inspection","LL","p","performance check يومي للـcheckweigher بكرتونة مرجعية|Daily checkweigher performance check with reference cartons");
M("opl","training","LL","q","OPL وتدريب على الطريقة المحدثة|OPL and training on the updated method");

/* ===================== KPIs ===================== */
K("minorstops","stops/shift","عدد الوقفات الصغيرة في الوردية|Minor stops per shift");
K("changeover","min","زمن الـchangeover|Changeover time");
K("reject","%","نسبة الـreject|Reject rate");
K("leak","%","نسبة فشل الـleak test|Leak test failure rate");
K("false_rej","%","نسبة الـfalse reject|False reject rate");
K("ser_rej","%","reject الـserialization/coding|Serialization/coding reject rate");
K("mttr","min","متوسط وقت الإصلاح MTTR|Mean time to repair (MTTR)");
K("mtbf","h","متوسط الوقت بين الأعطال MTBF|Mean time between failures (MTBF)");
K("dp_exc","events/month","عدد excursions الـdP في الشهر|Room dP excursions per month");
K("rh_exc","events/month","عدد excursions الحرارة/الرطوبة|Temperature/RH excursions per month");
K("bms_cal","%","نسبة الـcalibrations في ميعادها|Calibrations done on time");
K("trips","trips/month","عدد الفصلات في الشهر|Trips per month");
K("pw_cond","µS/cm","conductivity الـPW|PW conductivity");
K("pw_micro","CFU/100 mL","العد الميكروبي للـPW|PW microbial count");
K("air_kwh","kWh/Nm3","استهلاك الكهربا لكل متر هوا|Specific power of compressed air");
K("dewpoint","°C PDP","الـpressure dew point|Pressure dew point");
K("air_press","bar","الضغط عند آخر ماكينة|Pressure at the last machine");
K("steam_eff","Nm3 gas/t steam","استهلاك الغاز لكل طن steam|Gas use per ton of steam");
K("pf","-","الـpower factor|Power factor");
K("data_av","%","نسبة توفر بيانات الـBMS|BMS data availability");
K("alarms","alarms/day","عدد إنذارات الـBMS في اليوم|BMS alarms per day");

/* FAMILIES */
F("count","خط العد PPS Pharmacount|PPS Pharmacount counting line",
["حساسات العد / الـchannels|Counting sensors / channels","vibratory tray / الموتور|Vibratory tray / drive",
"valve وcylinder الـgate|Gate valve / cylinder","الـstarwheel والـguides|Starwheel / guides",
"chuck وclutch الـcapper|Capper chuck / clutch","coil الـinduction sealer|Induction sealer coil",
"حساس الـgap في الـlabeler|Labeller gap sensor","حساس/كاميرا الفحص|Inspection sensor / camera"],
[["miscount","عد غلط في الزجاجة (زيادة أو ناقص)|Wrong count per bottle (over/under)","cn_sens cn_vib cn_gate fmt_setting","sensor defects"],
["broken","أقراص مكسورة/مشروخة في الزجاجة|Broken or chipped tablets in bottle","cn_vib cn_gate fmt_setting","defects"],
["bottle","زجاجات بتقع أو بتتزنق على الـconveyor|Bottles tipping or jamming on conveyor","cn_bottle mat_spec fmt_setting sens_dirty","minor_stops"],
["torque","عزم الغطا (torque) خارج الحدود|Cap torque out of limits","cn_cap mat_spec fmt_setting","defects"],
["induct","الـinduction seal ضعيف أو مش موجود|Induction seal weak or missing","cn_induct mat_spec cn_cap","defects"],
["label","الـlabel مايل أو ناقص|Label skewed or missing","cn_label mat_spec sens_dirty","defects"],
["falserej","رفض كاميرا/حساس زيادة (false reject)|Excess camera/sensor rejects (false rejects)","vision_recipe sens_dirty cn_label","sensor"],
["stops","وقفات صغيرة كتير (هوا/حساسات)|Frequent minor stops (air/sensors)","sens_dirty air_low cn_bottle","minor_stops"]]);

F("blister","ماكينة بليستر|Blister machine",
["ألواح التسخين والـthermocouple|Heater plates / thermocouple","الـforming tool والـseals|Forming tool / seals",
"لوح الـsealing|Sealing plate","الـpunch والـdie|Punch / die","فرشة وchannels الـfeeder|Feeder brush / channels",
"حروف الـembossing/الكود|Embossing / coding types","كاميرا الفحص / الإضاءة|Inspection camera / lighting",
"فرامل الـreel والـdancer|Reel brake / dancer","gripper الشد والـservo|Pull gripper / servo"],
[["forming","pockets رفيعة أو مش متشكلة كويس|Poor forming / thin pockets","heater_ctrl bl_form_air bl_film bl_cooling fmt_setting","defects"],
["leak","فشل الـleak test أو sealing ضعيف|Failed leak test / weak seal","bl_seal_param bl_seal_plate bl_lidding bl_feeder bl_film","defects leak"],
["empty","pockets فاضية أو أقراص مكسورة|Empty pockets or broken tablets / feeding jams","bl_feeder vision_recipe sens_dirty fmt_setting","defects"],
["web","قطع أو تزحيف في الـfilm/الـfoil|Film or foil web break / tracking drift","bl_web mat_spec bl_index sens_dirty","minor_stops"],
["code","الـcode/emboss ناقص أو مش واضح|Batch code / emboss missing or unclear","bl_coding fmt_setting vision_recipe","defects"],
["punch","الـpunch مش في مكانه أو burrs على الحواف|Punch misalignment / burrs on edges","bl_index bl_punch fmt_setting bl_web","alignment"],
["falserej","الكاميرا بترفض سليم (false rejects)|Camera false rejects","vision_recipe sens_dirty bl_feeder","sensor"],
["heater","إنذار حرارة heater (forming/sealing)|Heater temperature alarm (forming/sealing)","heater_ctrl bl_cooling el_panelcool","overheating"]]);

F("carton","ماكينة كرتون (cartoner)|Cartoner",
["الـsuction cups وطرمبة الـvacuum|Suction cups / vacuum pump","rollers وplates الـleaflet folder|Leaflet folder rollers / plates",
"الـpusher والـoverload clutch|Pusher / overload clutch","مسدس وnozzle الـhot melt|Hot melt gun / nozzle",
"أدوات الـtuck-in والقفل|Tuck-in / closing tools","رأس طباعة TIJ/laser|TIJ / laser printhead",
"كاميرا الـserialization|Serialization camera","load cell الـcheckweigher|Checkweigher load cell","الـchain والـcams|Chain / cams"],
[["open","الكرتونة مش بتفتح / فشل الـpick-up|Carton not opening / pick-up failure","vac_loss ct_crease ct_magazine fmt_setting","minor_stops"],
["leaflet","jam في الـleaflet أو leaflet ناقص|Leaflet jam or missing leaflet","ct_leaflet mat_spec sens_dirty vac_loss","minor_stops"],
["insert","المنتج مش داخل الكرتونة أو اتفعص|Product not inserted / crushed at insertion","ct_transfer ct_pusher fmt_setting ct_crease","minor_stops"],
["glue","الغرا أو الـflap/الـtuck مش مقفول|Glue flap or tuck not closed","ct_hotmelt ct_close ct_crease fmt_setting","defects"],
["serial","reject في الـcoding/serialization|Coding or serialization rejects","ct_printer ct_serial vision_recipe fmt_setting","defects"],
["cw","reject من الـcheckweigher|Checkweigher rejects","ct_cw ct_leaflet ct_transfer","defects"],
["crash","وقفة overload أو خبطة ميكانيكية|Mechanical overload trip / crash","ct_pusher ct_transfer fmt_setting","mechanical"],
["stops","وقفات صغيرة كتير|Frequent minor stops","sens_dirty air_low vac_loss ct_magazine","minor_stops"]]);

F("hvac","التكييف HVAC / AHUs|HVAC / AHUs",
["فلاتر (pre/bag/HEPA)|Filters (pre, bag, HEPA)","سير ومروحة / bearings|Fan belt / bearings","VFD المروحة|Fan VFD",
"الـvalve والـactuator|Valve / actuator","actuator الـdamper|Damper actuator","حساس حرارة/رطوبة/dP|Temp / RH / dP sensor",
"الـdesiccant wheel والـheater|Desiccant wheel / heater","الـdrain trap|Drain trap"],
[["dp","الـdP بين الغرف خارج الحدود|Room dP out of limits","hv_door hv_filter hv_belt hv_sensor gn_interlock","defects"],
["temp","حرارة الغرفة عالية|Room temperature high","hv_chw hv_valve hv_filter hv_sensor","env_heat_humidity"],
["rh","رطوبة الغرفة عالية|Room RH high","hv_dehum hv_chw hv_drain hv_sensor","env_heat_humidity"],
["filter","إنذار dP عالي على الفلاتر|Filter high dP alarm","hv_filter hv_sensor","env_dust"],
["fan","المروحة بتفصل أو فيها vibration/صوت|Fan trip, vibration or noise","hv_belt hv_vfd el_pq","vibration"],
["chiller","الـchiller بيفصل أو الـCHW سخن|Chiller trip / warm chilled water","hv_chw el_pq el_panelcool","overheating"],
["water","مية في الـAHU أو تسريب من الـcoil|Water in AHU / coil leakage","hv_drain gn_water_in","leak"]]);

F("pw","المية النقية PW|Purified water",
["ممبرين الـRO|RO membranes","valve وresin الـsoftener|Softener valve / resin","فلتر الكربون وطرمبة الـSMBS|Carbon filter / SMBS pump",
"موديول الـEDI|EDI module","لمبة وsleeve الـUV|UV lamp / sleeve","seal طرمبة الـloop|Loop pump seal",
"حساس الـconductivity/TOC|Conductivity / TOC sensor","فلتر وheater الـvent|Vent filter / heater"],
[["cond","conductivity عالية (RO/EDI/loop)|High conductivity (RO, EDI or loop)","pw_ro pw_edi pw_sensor pw_soft pw_carbon","defects"],
["toc","TOC عالي|High TOC","pw_sanit pw_ro pw_sensor pw_sampling","contamination"],
["micro","نتيجة microbial عند alert/action|Microbial count at alert/action level","pw_sampling pw_deadleg pw_sanit pw_uv pw_vent","contamination"],
["flow","الـRO permeate قليل / الإنتاج ضعيف|Low RO permeate / low production","pw_ro pw_soft pw_carbon","speed_loss"],
["sanit","الـloop مش بيوصل لحرارة الـsanitization|Sanitisation temperature not reached","pw_sanit pw_pump pw_sensor","contamination"],
["pressure","ضغط/flow الـloop واطي|Loop pressure or return flow low","pw_pump pw_sensor pw_vent","mechanical"],
["uv","إنذار UV intensity|UV intensity alarm","pw_uv pw_sensor","sensor"]]);

F("air","الهوا المضغوط|Compressed air",
["فلتر السحب (intake)|Intake filter","الـelement والـinlet valve|Oil-free element / inlet valve","الـcooler|Cooler",
"desiccant وvalves الـdryer|Dryer desiccant / valves","عناصر فلاتر الخط|Line filter elements","الـauto drain|Auto drain",
"حساس الـdew point|Dew point sensor","pressure transmitter (حساس ضغط)|Pressure transmitter"],
[["pressure","ضغط الشبكة واطي|Low network pressure","ar_leak ar_filter ar_pipe ar_control ar_cool","utility_air"],
["dew","الـdew point عالي|High dew point","ar_dryer ar_drain ar_cool","contamination"],
["trip","الكمبروسر بيفصل|Compressor tripping","ar_cool el_pq ar_control","overheating"],
["energy","استهلاك كهربا عالي للكمبروسرات|High compressor energy (kWh/Nm3)","ar_leak ar_control ar_filter ar_drain","energy_waste"],
["water","مية في خط الهوا عند الماكينات|Water in air lines at machines","ar_dryer ar_drain ar_filter","contamination"],
["leak","تسريب هوا مسموع|Audible air leaks","ar_leak ar_drain","leak"]]);

F("boiler","غلاية البخار|Steam boiler",
["الـflame sensor والـigniter|Flame sensor / igniter","خط الغاز والـregulator|Gas train / regulator","حساسات الـlevel|Level probes",
"طرمبة الـfeed|Feed pump","صمام الأمان|Safety valve","الـsteam traps|Steam traps","الـsoftener وطرمبة الـdosing|Softener / dosing pump"],
[["flame","الـburner بيعمل flame failure / lockout|Flame failure / burner lockout","bo_burner el_pq","utility_steam"],
["lowwater","إنذار low water|Low water alarm / lockout","bo_level bo_feed bo_water","utility_steam"],
["pressure","ضغط الـsteam واطي أو مش ثابت|Steam pressure low or unstable","bo_burner bo_trap bo_water bo_sv","utility_steam"],
["sv","صمام أمان بيفتح أو بيسرب|Safety valve lifting or passing","bo_sv bo_burner","safety_guard"],
["hammer","water hammer أو steam مبلول|Water hammer or wet steam","bo_trap bo_water bo_level","utility_steam"],
["fuel","استهلاك غاز عالي لكل طن steam|High gas use per ton of steam","bo_trap bo_burner bo_water","energy_waste"]]);

F("elec","توزيع الكهربا|Electrical distribution",
["الـbreaker والـtrip unit|Breaker / trip unit","الـcontactor والـrelay|Contactor / relay","الكابل والـlugs|Cable / lugs",
"بطاريات الـUPS|UPS batteries","الـcapacitor bank|Capacitor bank","مروحة/فلتر/تكييف الـpanel|Panel fan / filter / AC","المحول (transformer)|Transformer"],
[["trip","breaker أو حماية بتفصل|Breaker / protection trips","el_overload el_loose el_protset el_insul","electrical"],
["hot","hotspot أو ريحة حريق في panel|Hotspot or burning smell in panel","el_loose el_overload el_panelcool","overheating"],
["dip","ماكينات كتير بتفصل مع بعض (dip)|Several machines stop together (voltage dip)","el_pq el_ups el_protset","utility_power"],
["earth","earth fault أو RCD بيفصل|Earth fault / RCD trips","el_insul gn_water_in","electrical"],
["ups","إنذار UPS أو فشل وقت الانقطاع|UPS alarm or failed on power loss","el_ups el_panelcool","utility_power"],
["pf","power factor واطي / غرامة|Low power factor / penalty","el_pf el_pq","energy_waste"]]);

F("bms","الـBMS / EMS|BMS / EMS",
["الـcontroller وموديول الـI/O|Controller / I/O module","الـnetwork switch|Network switch","حساس حرارة/رطوبة/dP|Temp / RH / dP sensor",
"عداد الطاقة|Energy meter","الـserver والـworkstation|Server / workstation","UPS للـcontrollers|Controller UPS"],
[["offline","controller أو نقطة offline|Controller or points offline","bm_comm el_ups","plc_software"],
["falsealarm","إنذار مش حقيقي أو قراية غلط|False alarm or wrong reading","hv_sensor bm_alarm bm_comm","sensor"],
["flood","إنذارات كتير (alarm flood)|Alarm flood","bm_alarm hv_sensor","documentation"],
["data","trend ناقص أو gaps في الـaudit trail|Missing trend data or audit trail gaps","bm_data bm_comm","documentation"],
["setpoint","setpoint اتغير أو رجع default|Setpoint changed or reset to default","bm_data bm_comm","software_change"],
["meter","قراية عداد EMS غلط أو ناقصة|EMS meter reading wrong or missing","bm_comm hv_sensor","energy_waste"]]);

F("general","عام / المبنى|General / building",
["الـdoor closer والـmag lock|Door closer / mag lock","حساس الـinterlock|Interlock sensor","الـLED driver واللمبة|LED driver / lamp",
"بطارية الـemergency light|Emergency light battery","عزل مواسير|Pipe insulation","الـepoxy والحوائط|Epoxy / wall panels"],
[["door","interlock أو باب مش بيقفل|Door interlock fault or door not closing","gn_interlock hv_door","safety_guard"],
["light","إضاءة ضعيفة أو لمبات بايظة|Poor lighting or failed fittings","gn_light el_insul","electrical"],
["emerg","emergency light مش شغال في الـtest|Emergency light fails test","gn_light el_ups","safety_guard"],
["water","مية داخلة أو تكثيف|Water ingress or condensation","gn_water_in hv_drain","leak"],
["surface","أرضية/حيطان متشققة في منطقة GMP|Damaged floor or walls in GMP area","gn_surface gn_water_in","contamination"],
["power","panel فرعي بيفصل في المبنى|Local building sub-panel tripping","el_overload el_loose el_insul","electrical"]]);

var ORD = ["eliminate","design","poka_yoke","pm","standard","inspection","training","temporary"];
Object.keys(causes).forEach(function (k) { var c = causes[k]; c.cm = c.cm.map(function (m, i) { return [ORD.indexOf(cms[m].kind) * 100 + i, m]; }).sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return x[1]; }); });
window.KB_ENG_B = { families: families, causes: causes, cms: cms, kpis: kpis };
})();

/* KB_OPEX - Operational Excellence knowledge base for the Work Log Analysis Coach
 Servier Egypt, Cairo site (TPM). 3C / A3 / Kaizen. Plain JS, offline. */
(function () {
 var B = function (ar, en) { return { ar: ar, en: en }; };
 var O = function (id, ar, en, tags) { var o = { id: id, ar: ar, en: en }; if (tags) o.tags = tags; return o; };
 var S = function (id, ar, en, causes, tags) { var s = { id: id, ar: ar, en: en, causes: causes }; if (tags) s.tags = tags; return s; };
 var W = function (l) { return l.map(function (p) { return B(p[0], p[1]); }); };
 var C = function (ar, en, fish, tags, chk, why, cont, cm, kpi) {
 return { ar: ar, en: en, fish: fish, tags: tags, check: B(chk[0], chk[1]), why: W(why), cont: cont, cm: cm, kpi: kpi || [] };
 };
 var OW = {
 mnt: B("الصيانة", "Maintenance"), prod: B("الإنتاج", "Production"), qa: B("الجودة QA", "QA"),
 eng: B("الهندسة", "Engineering"), wh: B("المخزن", "Warehouse"), hse: B("السلامة HSE", "HSE"),
 pln: B("التخطيط", "Planning"), opx: B("الـOpEx", "OpEx / CI"), pur: B("المشتريات", "Purchasing")
 };
 var M = function (kind, impact, effort, ow, ar, en) { return { ar: ar, en: en, kind: kind, impact: impact, effort: effort, owner: ow }; };

 /* ---------------- Kaizen losses (TPM major losses + 8 wastes, merged) ---------------- */
 var LOSSES = [
 O("l_breakdown", "أعطال (breakdown)", "Breakdown / equipment failure", ["mechanical", "electrical", "wear_age"]),
 O("l_setup", "Setup وchangeover وضبط", "Setup, changeover and adjustment", ["setup_loss", "after_changeover"]),
 O("l_cleaning", "وقت التنظيف وتغيير الـtools", "Cleaning and tool change time", ["after_cleaning", "setup_loss"]),
 O("l_minor", "وقفات صغيرة (minor stops)", "Minor stops and idling", ["minor_stops", "sensor"]),
 O("l_speed", "سرعة أقل من الـrated", "Reduced speed", ["speed_loss"]),
 O("l_startup", "رفض أول التشغيل (start-up)", "Start-up and yield loss", ["startup_loss"]),
 O("l_defects", "عيوب و rework", "Defects and rework", ["defects"]),
 O("l_waiting", "انتظار (QA، خامة، قطعة، قرار)", "Waiting (QA, material, part, decision)", ["waiting", "planning"]),
 O("l_motion", "حركة ومشي زيادة", "Motion and walking", ["motion"]),
 O("l_transport", "نقل وشيل وحط", "Transport and handling", ["handling"]),
 O("l_inventory", "مخزون زيادة أو ناقص", "Excess or wrong inventory", ["storage", "planning"]),
 O("l_overproc", "خطوات زيادة ملهاش قيمة", "Over-processing (non-value steps)", ["procedure_gap"]),
 O("l_overprod", "إنتاج زيادة أو بدري", "Overproduction", ["planning"]),
 O("l_skills", "أفكار ومهارات الناس مش مستغلة", "Unused skills and ideas", ["training_gap"]),
 O("l_energy", "هدر طاقة و utilities", "Energy and utility waste", ["energy_waste", "leak"]),
 O("l_safety", "خطر سلامة أو ergonomics", "Safety and ergonomic risk", ["safety_guard", "ergonomics"])
 ];

 /* ---------------- causes ---------------- */
 var causes = {
 /* Changeover (SMED) */
 o_c_co_internal: C("شغل external بيتعمل والماكينة واقفة", "External work done while the machine is stopped", "methods",
 ["setup_loss", "waiting", "procedure_gap", "after_changeover"],
 ["اعمل video للـchangeover وقسّم كل خطوة internal أو external بالدقيقة", "Video the changeover; time each step and mark it internal or external"],
 [["تحضير القطع والورق والخامة بيبدأ بعد وقف الماكينة", "Parts, paperwork and material prep start after the line stops"],
 ["مفيش فصل بين الخطوات internal و external", "Steps were never split into internal and external"],
 ["الـSOP مفيهوش SMED ولا target time للـchangeover", "Changeover SOP has no SMED split and no target time"]],
 ["o_cm_co_prep_tmp"], ["o_cm_smed_std", "o_cm_co_kit", "o_cm_qa_prealert"], ["o_k_co_time"]),
 o_c_co_missing: C("قطع الـformat أو الـtools مش جاهزة", "Format parts or tools missing / not prepared", "materials",
 ["planning", "storage", "setup_loss", "waiting", "motion"],
 ["سجّل كام دقيقة اتصرفت في الدور على قطع أو tools", "Record minutes spent searching for parts or tools"],
 [["الفني بيدوّر على القطع وقت الـchangeover", "Technician searches for parts during the changeover"],
 ["مفيش kit لكل منتج ولا مكان ثابت للقطع", "No kit per product and no fixed place for parts"],
 ["مفيش standard للـformat kit و shadow board", "No format-kit / shadow-board standard"]],
 ["o_cm_co_prep_tmp"], ["o_cm_co_kit", "o_cm_format_store", "o_cm_smed_std"], ["o_k_co_time"]),
 o_c_co_trial: C("الضبط بالتجربة (trial and error)", "Settings found by trial and error", "methods",
 ["setting_change", "startup_loss", "procedure_gap", "calibration"],
 ["عدّ الـtrial runs والرفض لحد أول منتج سليم", "Count trial runs and rejects until first good product"],
 [["محتاجين trial runs كتير لحد ما المنتج يطلع سليم", "Many trial runs needed before good product"],
 ["قيم الضبط لكل منتج مش متسجلة", "Setting values per product are not recorded"],
 ["مفيش setting sheet ولا علامات/stops ثابتة على الماكينة", "No setting sheet and no fixed marks or stops on the machine"]],
 ["o_cm_co_prep_tmp"], ["o_cm_set_marks", "o_cm_set_sheet", "o_cm_opl"], ["o_k_co_time", "o_k_startup_rej"]),
 o_c_co_clean: C("طريقة التنظيف بطيئة ومش standard", "Cleaning method slow / not standardised", "methods",
 ["after_cleaning", "procedure_gap", "setup_loss", "design_weakness"],
 ["قيس وقت التنظيف في كل وردية وقارن الخطوات", "Time the cleaning per shift and compare the steps"],
 [["وقت التنظيف بيختلف من وردية لوردية", "Cleaning time varies by shift"],
 ["أماكن صعبة الوصول ومفيش tools مناسبة", "Hard-to-reach areas and no suitable tools"],
 ["الـcleaning SOP من غير ترتيب ولا وقت ولا صور، والتصميم صعب التنظيف", "Cleaning SOP has no sequence, time or photos; design is hard to clean"]],
 ["o_cm_co_prep_tmp"], ["o_cm_clean_design", "o_cm_clean_std", "o_cm_opl"], ["o_k_co_time"]),
 o_c_co_lc: C("الـline clearance بيفوّت حاجات (أقراص، كراتين، labels)", "Line clearance misses items (tablets, cartons, labels)", "methods",
 ["procedure_gap", "documentation", "design_weakness", "after_changeover"],
 ["حدد الأماكن اللي بيتلاقى فيها leftovers وصوّرها", "Map and photograph where leftovers were found"],
 [["فيه material فاضل في أماكن مستخبية", "Material remains in hidden spots"],
 ["الـchecklist مش فيه كل الـtrap points", "Checklist does not list all trap points"],
 ["مفيش line clearance map بالصور، والتصميم فيه dead zones", "No photo map of trap points; design has dead zones"]],
 ["o_cm_hold", "o_cm_lc_2check"], ["o_cm_lc_design", "o_cm_lc_map", "o_cm_lc_2check"], ["o_k_dev_count"]),
 o_c_co_qa_wait: C("انتظار release من QA/IPC مش متخطط", "Waiting for QA / IPC release not planned", "methods",
 ["waiting", "planning"],
 ["سجّل وقت طلب QA ووقت وصولهم والـrelease", "Log time QA was called, arrived and released"],
 [["الخط واقف مستني QA بعد ما الـchangeover خلص", "Line waits for QA after changeover is done"],
 ["QA بيتبلغ متأخر ومعندوش ميعاد الـchangeover", "QA informed late, changeover time not shared"],
 ["مفيش pre-alert في الـstandard ولا slots في الخطة", "No pre-alert step in standard, no slots in plan"]],
 ["o_cm_co_prep_tmp"], ["o_cm_qa_prealert", "o_cm_plan_co"], ["o_k_co_time"]),

 /* GMP / Quality */
 o_c_gq_proc: C("الـSOP/WI مش واضح أو مش زي الشغل الفعلي", "SOP / WI unclear or not matching actual practice", "methods",
 ["procedure_gap", "documentation"],
 ["امشي على الـSOP خطوة خطوة في الـgemba وقارنه بالشغل", "Walk the SOP step by step at the gemba and compare with practice"],
 [["الخطوة اتعملت بشكل مختلف عن الـSOP", "Step done differently from the SOP"],
 ["صياغة الـSOP مش واضحة أو متحدثتش بعد تغيير", "SOP wording unclear or not updated after a change"],
 ["مفيش review دوري للـSOP مع الناس اللي بتشتغل", "No periodic SOP review with shop-floor users"]],
 ["o_cm_hold"], ["o_cm_sop_rev", "o_cm_change_ctrl", "o_cm_opl"], ["o_k_dev_count"]),
 o_c_gq_param: C("parameter خرج برا الـvalidated range", "Process parameter outside validated range", "machines",
 ["setting_change", "calibration", "sensor", "plc_software"],
 ["راجع الـtrend والـalarm limits في الـHMI/SCADA مقابل الـBMR", "Review trend and alarm limits in HMI/SCADA vs batch record"],
 [["الـparameter انحرف ومحدش اتنبه في وقتها", "Parameter drifted unnoticed"],
 ["الـalarm limits مش متظبطة على الـvalidated range", "Alarm limits not set to the validated range"],
 ["مفيش standard إن الـalarms تتراجع مع الـvalidation", "No standard to align alarms with validation"]],
 ["o_cm_hold"], ["o_cm_alarm_limits", "o_cm_cal_prog", "o_cm_change_ctrl"], ["o_k_dev_count"]),
 o_c_gq_doc: C("غلطة GDP: entry ناقص، تصحيح غلط، تسجيل متأخر", "GDP error: missing entry, wrong correction, late record", "methods",
 ["documentation", "procedure_gap"],
 ["راجع الـBMR/logbook وحدد نوع الغلطة وفين في النموذج", "Review BMR / logbook; classify error type and where on the form"],
 [["التسجيل بيتعمل بعد النشاط مش وقته", "Records written after the activity, not during"],
 ["النموذج مش ماشي بترتيب الشغل ومفيهوش مكان كفاية", "Form does not follow work sequence, too little space"],
 ["النموذج ماتصممش مع المستخدم ومفيش check عند الخطوة", "Form not designed with users, no check at the step"]],
 ["o_cm_hold"], ["o_cm_e_record", "o_cm_form_redesign", "o_cm_gdp_check"], ["o_k_gdp_err"]),
 o_c_gq_train: C("ثغرة في نظام التدريب (المهمة مش في الـmatrix)", "Training system gap (task not in qualification matrix)", "man",
 ["training_gap", "new_operator", "procedure_gap"],
 ["راجع الـtraining record والـqualification matrix للمهمة", "Check training records and qualification matrix for the task"],
 [["المهمة اتعملت من غير qualification موثق", "Task done without documented qualification"],
 ["الـmatrix متحدثش بعد مهمة أو SOP جديد", "Matrix not updated for a new task or SOP"],
 ["مفيش ربط بين تغيير الـSOP وخطة التدريب والـeffectiveness check", "SOP change not linked to training plan and effectiveness check"]],
 ["o_cm_hold"], ["o_cm_sop_train_link", "o_cm_skill_matrix", "o_cm_opl"], ["o_k_dev_count"]),
 o_c_gq_cal: C("Calibration overdue أو الجهاز مش في البرنامج", "Calibration overdue or instrument not in programme", "measurement",
 ["calibration", "planning", "documentation"],
 ["دوّر على الجهاز في الـcalibration master list وشوف الـdue date", "Find the instrument in the calibration master list; check due date"],
 [["الجهاز اتستخدم وهو overdue", "Instrument used while overdue"],
 ["الجهاز اتضاف بعد مشروع ومتسجلش", "Instrument added by a project and never registered"],
 ["مفيش خطوة تسجيل أجهزة جديدة في الـcommissioning/change control", "No new-instrument registration step in commissioning / change control"]],
 ["o_cm_recal_tmp", "o_cm_hold"], ["o_cm_cal_prog", "o_cm_change_ctrl"], ["o_k_cal_ontime"]),
 o_c_gq_di: C("ضعف data integrity (login مشترك، audit trail مقفول)", "Weak data integrity controls (shared login, audit trail off)", "methods",
 ["plc_software", "software_change", "documentation"],
 ["راجع الـuser accounts والـroles والـaudit trail على الـHMI/SCADA", "Review user accounts, roles and audit trail on HMI / SCADA"],
 [["فيه accounts مشتركة أو audit trail مش بيتراجع", "Shared accounts or audit trail not reviewed"],
 ["النظام اتعمله setup من غير DI review", "System configured without a DI review"],
 ["مفيش periodic review للـaccess والـaudit trail", "No periodic access and audit-trail review"]],
 ["o_cm_hold"], ["o_cm_di_access", "o_cm_di_review", "o_cm_change_ctrl"], ["o_k_dev_count"]),
 o_c_gq_cont: C("مصدر تلوث مش متحكم فيه (شحم، برادة، تراب)", "Contamination source not controlled (lube, wear debris, dust)", "machines",
 ["contamination", "lubrication", "wear_age", "leak", "env_dust"],
 ["حدد نوع الجسم الغريب وقارنه بمواد الماكينة والشحم", "Identify the foreign matter and match it to machine materials / lube"],
 [["شحم أو برادة وصلت للمنتج", "Lube or metal debris reached the product"],
 ["seal أو scraper مستهلك ومحدش لاحظ", "Worn seal or scraper not detected"],
 ["الـPM مش بيفحص الـproduct-contact seals ومفيش spec لشحم food-grade", "PM does not check product-contact seals; no food-grade lube spec"]],
 ["o_cm_hold", "o_cm_100insp"], ["o_cm_h1_lube", "o_cm_drip_shield", "o_cm_seal_pm"], ["o_k_dev_count"]),

 /* Safety */
 o_c_sf_guard: C("Guard ناقص أو interlock ممكن يتعمله bypass", "Guard missing or interlock can be bypassed", "machines",
 ["safety_guard", "design_weakness"],
 ["اختبر كل interlock وشوف لو الـguard بيترفع وهي شغالة", "Test each interlock; check if the guard opens while running"],
 [["الـguard اتشال للتنظيف أو الضبط ومرجعش", "Guard removed for cleaning or adjusting, not refitted"],
 ["الـguard صعب يتفك ويتركب والـinterlock سهل يتلغي", "Guard hard to refit; interlock easy to defeat"],
 ["مفيش interlock test في الـPM ولا design للوصول الآمن", "No interlock test in PM, no design for safe access"]],
 ["o_cm_isolate"], ["o_cm_interlock", "o_cm_guard_design", "o_cm_guard_pm"], ["o_k_nm_count"]),
 o_c_sf_loto: C("الـLOTO ناقص مصادر طاقة أو أقفال", "LOTO misses energy sources or locks", "methods",
 ["loto", "procedure_gap", "pneumatic", "electrical"],
 ["اعمل حصر لكل مصادر الطاقة: كهربا، هوا، stored energy، جاذبية", "List all energy sources: electrical, air, stored energy, gravity"],
 [["مش كل مصادر الطاقة اتعزلت", "Not all energy sources were isolated"],
 ["مفيش LOTO sheet خاص بالماكينة", "No machine-specific LOTO sheet"],
 ["نقط العزل مش متعلمة ومش قابلة للقفل", "Isolation points not labelled or lockable"]],
 ["o_cm_isolate"], ["o_cm_loto_points", "o_cm_loto_sheet", "o_cm_loto_audit"], ["o_k_nm_count"]),
 o_c_sf_ra: C("الـrisk assessment للمهمة ناقص أو قديم", "Task risk assessment missing or outdated", "methods",
 ["procedure_gap", "safety_guard"],
 ["دوّر على الـJSA/RA للمهمة وتاريخ آخر review", "Find the JSA / RA for the task and its last review date"],
 [["الخطر ماتعرفش قبل المهمة", "Hazard not identified before the task"],
 ["المهمة مش في الـRA أو الـJSA", "Task not covered by RA / JSA"],
 ["مفيش RA review بعد تغيير أو شغل غير روتيني", "No RA review after a change or non-routine work"]],
 ["o_cm_isolate"], ["o_cm_jsa", "o_cm_change_ctrl", "o_cm_nm_system"], ["o_k_nm_count"]),
 o_c_sf_shortcut: C("تصميم المهمة بيخلي الطريق الآمن أطول", "Task design makes the safe way slower (shortcut)", "machines",
 ["design_weakness", "ergonomics", "motion", "safety_guard"],
 ["اسأل الفريق: ليه الـshortcut؟ وقيس وقت الطريقة الآمنة", "Ask the team why the shortcut; time the safe method"],
 [["الطريقة الآمنة بتاخد وقت أو مجهود أكتر", "Safe method takes more time or effort"],
 ["الوصول محتاج إيد جوه أو فك guard", "Access needs reaching in or removing a guard"],
 ["التصميم ماتراجعش مع المستخدمين في الـrisk assessment", "Design never reviewed with users in the risk assessment"]],
 ["o_cm_isolate"], ["o_cm_task_redesign", "o_cm_guard_design", "o_cm_jsa"], ["o_k_nm_count"]),
 o_c_sf_chem: C("التعامل مع كيماويات من غير engineering controls", "Chemical handling without engineering controls", "materials",
 ["contamination", "leak", "procedure_gap"],
 ["راجع الـSDS والـtask: decanting مفتوح؟ تهوية؟ LEV؟", "Review SDS vs task: open decanting? ventilation? LEV?"],
 [["فيه تعرض أو انسكاب وقت النقل", "Exposure or spill during transfer"],
 ["الـtransfer مفتوح ومفيش LEV", "Open transfer, no local exhaust"],
 ["الـSDS controls ماتحولتش لـstandard للمهمة", "SDS controls never turned into a task standard"]],
 ["o_cm_spill_tmp"], ["o_cm_closed_transfer", "o_cm_jsa", "o_cm_ppe_matrix"], ["o_k_nm_count"]),
 o_c_sf_ergo: C("شيل يدوي متصممش (وزن، ارتفاع، مد إيد)", "Manual handling task not engineered (weight, height, reach)", "methods",
 ["ergonomics", "motion", "design_weakness", "handling"],
 ["قيس الوزن والارتفاع وعدد المرات في الوردية", "Measure weight, lift height and lifts per shift"],
 [["شيل تقيل أو وضع جسم غلط", "Heavy lift or awkward posture"],
 ["مفيش lifting aid أو trolley بارتفاع مناسب", "No lifting aid or trolley at the right height"],
 ["الـergonomic risk مش جزء من تصميم المهمة", "Ergonomic risk not part of task design"]],
 ["o_cm_isolate"], ["o_cm_lift_aid", "o_cm_task_redesign", "o_cm_ergo_ra"], ["o_k_ergo"]),

 /* Energy & Utilities */
 o_c_en_leak: C("التسريبات مش بتتكشف وتتصلح بشكل دوري", "Leaks not found and fixed on a routine", "machines",
 ["leak", "utility_air", "energy_waste", "wear_age"],
 ["اعمل leak survey (ultrasonic) وقت وقف الإنتاج وعلّم كل leak", "Ultrasonic leak survey at no-production; tag every leak"],
 [["تسريب من fittings و hoses و FRL drains", "Leaks at fittings, hoses and FRL drains"],
 ["التسريب بيتكشف بس لما صوته يعلى", "Leaks found only when loud"],
 ["مفيش leak route في الـPM ولا قاعدة tag-and-fix", "No leak route in PM, no tag-and-fix rule"]],
 ["o_cm_tag_tmp"], ["o_cm_leak_route", "o_cm_en_kpi"], ["o_k_air", "o_k_leaks"]),
 o_c_en_idle: C("مفيش auto-off أو idle mode والماكينة مش بتنتج", "No auto-off or idle mode when not producing", "machines",
 ["energy_waste", "design_weakness", "planning"],
 ["سجّل استهلاك الـkWh والهوا وقت الـbreaks والإجازة الأسبوعية", "Log kWh and air use during breaks and weekends"],
 [["ماكينات أو AHUs شغالة من غير إنتاج", "Machines or AHUs run with no production"],
 ["مفيش idle mode ولا schedule للإطفاء", "No idle mode and no switch-off schedule"],
 ["الإطفاء مش في end-of-shift standard ولا في التصميم", "Switch-off not in end-of-shift standard or design"]],
 ["o_cm_switchoff_tmp"], ["o_cm_auto_off", "o_cm_bms_sched", "o_cm_shutdown_std"], ["o_k_kwh"]),
 o_c_en_setpoint: C("الـsetpoints ماتراجعتش على الاحتياج الحقيقي", "Setpoints not reviewed against real need", "methods",
 ["setting_change", "energy_waste", "env_heat_humidity"],
 ["قارن الـsetpoint بالـGMP limit وبالاحتياج الفعلي", "Compare setpoint with GMP limit and actual need"],
 [["الـsetpoint أعلى أو أقل من اللازم", "Setpoint tighter than needed"],
 ["اتحط بهامش كبير من زمان ومحدش راجعه", "Set with a big margin long ago, never reviewed"],
 ["مفيش setpoint register بالتبرير والـowner", "No setpoint register with justification and owner"]],
 ["o_cm_switchoff_tmp"], ["o_cm_setpoint_reg", "o_cm_bms_sched"], ["o_k_kwh"]),
 o_c_en_press: C("ضغط الـgeneration أعلى من احتياج المستخدمين", "Generation pressure higher than users need", "machines",
 ["utility_air", "energy_waste", "setting_change", "design_weakness"],
 ["قيس الضغط عند الـcompressor وعند آخر مستخدم والـpressure drop", "Measure pressure at compressor and last user; find the drop"],
 [["الـcompressor متظبط على ضغط عالي", "Compressor set to high pressure"],
 ["بيغطي pressure drop في filters و piping قديمة أو user واحد عالي", "Covers drop in old filters / piping or one high user"],
 ["مفيش demand study ولا PM للـfilter dP", "No demand study and no filter dP PM"]],
 ["o_cm_tag_tmp"], ["o_cm_press_opt", "o_cm_air_nozzle"], ["o_k_air", "o_k_kwh"]),
 o_c_en_meter: C("مفيش sub-metering أو KPI لكل منطقة", "No sub-metering or KPI per area", "measurement",
 ["energy_waste", "sensor", "documentation"],
 ["شوف الاستهلاك متقاس فين: main meter بس ولا sub-meters", "Check where use is measured: main meter only or sub-meters"],
 [["الزيادة في الاستهلاك محدش لاحظها", "Increase in consumption went unnoticed"],
 ["الاستهلاك متقاس عند الـmain meter بس", "Consumption measured only at main meter"],
 ["مفيش sub-meters في الـEMS ولا review يومي للـKPI", "No EMS sub-meters, no daily KPI review"]],
 ["o_cm_switchoff_tmp"], ["o_cm_submeter", "o_cm_en_kpi"], ["o_k_kwh"]),

 /* Spare parts */
 o_c_sp_minmax: C("الـmin/max مش متحدد أو مش مبني على الاستهلاك والـlead time", "Min/max missing or not based on usage and lead time", "methods",
 ["planning", "documentation"],
 ["قارن الـmin/max في SAP بالاستهلاك آخر 12 شهر والـlead time", "Compare SAP min/max with 12-month usage and lead time"],
 [["الـstock وصل صفر قبل الـreorder", "Stock hit zero before reorder"],
 ["الـmin/max اتحط مرة واحدة أو مش موجود", "Min/max set once or missing"],
 ["مفيش review دوري للـmin/max من الاستهلاك والـlead time", "No periodic min/max review from usage and lead time"]],
 ["o_cm_borrow_tmp"], ["o_cm_sap_mrp", "o_cm_minmax_rev", "o_cm_crit_list"], ["o_k_stockout", "o_k_sp_wait"]),
 o_c_sp_crit: C("الـcritical spares list ناقصة أو مش موجودة", "Critical spares list missing or incomplete", "methods",
 ["planning", "documentation", "design_weakness"],
 ["شوف القطعة متصنفة critical؟ وفيه criticality analysis للماكينة؟", "Is the part classed critical? Is there an equipment criticality analysis?"],
 [["قطعة critical مش متخزنة", "Critical part not stocked"],
 ["الـcriticality ماتعملتش لكل ماكينة", "Criticality not assessed per machine"],
 ["مفيش criticality analysis (ABC) للماكينات والقطع", "No ABC criticality analysis of equipment and spares"]],
 ["o_cm_borrow_tmp"], ["o_cm_crit_list", "o_cm_minmax_rev"], ["o_k_stockout", "o_k_sp_wait"]),
 o_c_sp_lead: C("الـlead time مش داخل في التخطيط", "Lead time not included in planning", "methods",
 ["supplier", "planning"],
 ["سجّل تاريخ الـPR والـPO والوصول وقارنه بالـPM schedule", "Log PR, PO and delivery dates vs PM schedule"],
 [["الطلب اتعمل بعد العطل", "Order placed after the failure"],
 ["الاستيراد بياخد 8-16 أسبوع", "Import lead time is 8-16 weeks"],
 ["مفيش annual spares plan مربوط بالـPM والـoverhauls", "No annual spares plan linked to PM and overhauls"]],
 ["o_cm_borrow_tmp"], ["o_cm_sp_plan", "o_cm_local_alt"], ["o_k_sp_wait"]),
 o_c_sp_obs: C("الـobsolescence مش متتابع", "Obsolescence not tracked", "materials",
 ["wear_age", "supplier", "design_weakness"],
 ["اسأل الـOEM عن حالة القطعة وبديلها", "Ask the OEM for part status and successor"],
 [["الـOEM وقف القطعة", "OEM discontinued the part"],
 ["إشعارات الـobsolescence محدش بيتابعها", "Obsolescence notices not followed"],
 ["مفيش lifecycle review للماكينات والـcontrols", "No lifecycle review of equipment and controls"]],
 ["o_cm_borrow_tmp"], ["o_cm_retrofit", "o_cm_obs_review"], ["o_k_sp_wait"]),
 o_c_sp_master: C("بيانات الـmaterial master أو الـBOM غلط أو ناقصة", "Material master / BOM wrong or missing", "methods",
 ["documentation", "procedure_gap"],
 ["قارن كود SAP بالـOEM part no. والـdrawing", "Compare SAP code with OEM part no. and drawing"],
 [["القطعة اتطلبت بالوصف مش بالـpart no.", "Part ordered by description, not part no."],
 ["مفيش equipment BOM في SAP أو فيه أكواد مكررة", "No equipment BOM in SAP or duplicate codes"],
 ["مفيش owner ولا قاعدة لإنشاء الـmaster data", "No owner or rule for master-data creation"]],
 ["o_cm_quar_tmp"], ["o_cm_bom", "o_cm_address"], ["o_k_pick_acc"]),
 o_c_sp_supplier: C("جودة القطعة أو المورد مش متحكم فيها", "Part / supplier quality not controlled", "materials",
 ["supplier", "non_oem_part", "new_part"],
 ["قارن القطعة بالـOEM spec (مقاسات، material، شهادة)", "Compare the part with OEM spec (dimensions, material, certificate)"],
 [["القطعة برا الـspec أو باظت بدري", "Part out of spec or failed early"],
 ["قطعة non-OEM من غير spec أو موافقة", "Non-OEM part without spec or approval"],
 ["مفيش spec ولا incoming check ولا approved supplier list للـcritical spares", "No spec, incoming check or approved list for critical spares"]],
 ["o_cm_quar_tmp"], ["o_cm_sp_spec", "o_cm_change_ctrl", "o_cm_incoming"], ["o_k_mtbf"]),
 o_c_sp_storage: C("القطعة اتلفت أو قدمت في التخزين", "Spare damaged or aged in storage", "nature",
 ["storage", "env_heat_humidity", "wear_age", "handling"],
 ["افحص الـrubber والـbearings والـelectronics وتاريخ الاستلام", "Check elastomers, bearings, electronics and receipt date"],
 [["rubber أو bearing أو board اتلف قبل الاستخدام", "Rubber, bearing or board degraded before use"],
 ["متخزن من غير تحكم في الحرارة/الرطوبة ولا shelf life", "Stored without temp / RH control or shelf life"],
 ["مفيش storage standard و shelf life و FIFO للقطع", "No storage, shelf-life and FIFO standard for spares"]],
 ["o_cm_quar_tmp"], ["o_cm_store_cond", "o_cm_fifo"], ["o_k_mtbf"]),

 /* Warehouse */
 o_c_wh_pick: C("الصرف من غير scan أو check تاني", "Picking without scan or second check", "methods",
 ["procedure_gap", "design_weakness", "handling"],
 ["شوف القطعتين جنب بعض؟ متشابهين؟ اتصرفت إزاي؟", "Are look-alike parts stored together? How was it picked?"],
 [["قطع شبه بعض جنب بعض", "Look-alike parts stored side by side"],
 ["الصرف بالذاكرة أو بالوصف", "Picking by memory or description"],
 ["مفيش barcode scan عند الصرف (poka-yoke)", "No barcode scan at issue (no poka-yoke)"]],
 ["o_cm_quar_tmp"], ["o_cm_scan", "o_cm_bom"], ["o_k_pick_acc"]),
 o_c_wh_label: C("مفيش standard للـlabels والـlocations (5S)", "No labelling and location standard (5S)", "methods",
 ["documentation", "storage", "motion", "waiting"],
 ["عدّ الـbins اللي من غير label أو location في SAP", "Count bins without label or SAP location"],
 [["القطع في أماكن عشوائية والـlabels ممسوحة", "Parts in random places, labels faded"],
 ["الـlocation مش متسجل في SAP", "Location not recorded in SAP"],
 ["مفيش 5S standard ولا bin addressing", "No 5S standard and no bin addressing"]],
 ["o_cm_quar_tmp"], ["o_cm_address", "o_cm_label_std", "o_cm_5s_std"], ["o_k_search", "o_k_pick_acc"]),
 o_c_wh_fifo: C("الـlayout مش بيفرض FIFO/FEFO", "Layout does not force FIFO / FEFO", "methods",
 ["storage", "design_weakness", "procedure_gap"],
 ["شوف أقدم stock فين وتواريخه", "Locate the oldest stock and its dates"],
 [["الـstock الجديد بيتحط قدام القديم", "New stock placed in front of old"],
 ["الرف بيتحمل ويتصرف من نفس الناحية", "Rack loaded and picked from the same side"],
 ["مفيش FIFO lane ولا expiry label بالألوان", "No FIFO lane, no colour expiry labels"]],
 ["o_cm_quar_tmp"], ["o_cm_fifo", "o_cm_store_cond"], ["o_k_inv_acc"]),
 o_c_wh_trans: C("الحركات مش بتتسجل وقت الصرف", "Transactions not recorded at time of movement", "methods",
 ["documentation", "procedure_gap", "planning"],
 ["قارن SAP بالـphysical count وشوف الحركات برا المواعيد", "Compare SAP with physical count; check out-of-hours moves"],
 [["قطع اتصرفت بالليل من غير GI", "Parts taken at night without goods issue"],
 ["التسجيل في SAP بيتأجل أو بيتنسي", "SAP posting delayed or forgotten"],
 ["مفيش out-of-hours issue process ولا cycle count", "No out-of-hours issue process, no cycle count"]],
 ["o_cm_quar_tmp"], ["o_cm_scan", "o_cm_oh_issue", "o_cm_cycle_count"], ["o_k_inv_acc"]),

 /* default */
 o_c_df_std: C("مفيش standard أو مش visual مكان الشغل", "No standard, or not visual at point of use", "methods",
 ["procedure_gap", "documentation", "shift_change"],
 ["اسأل كل وردية بتعملها إزاي وقارن", "Ask each shift how they do it and compare"],
 [["الطريقة بتختلف من وردية لوردية", "Method differs by shift"],
 ["الـSOP طويل ومش جنب الماكينة", "SOP is long and not at the machine"],
 ["مفيش OPL أو visual standard للمهمة", "No OPL or visual standard for the task"]],
 ["o_cm_contain_tmp"], ["o_cm_visual", "o_cm_opl", "o_cm_sop_rev"], ["o_k_mtbf"]),
 o_c_df_pm: C("PM task ناقصة أو الـfrequency مش مبنية على التاريخ", "PM task missing or frequency not based on history", "methods",
 ["wear_age", "planning", "after_pm"],
 ["راجع الـbreakdowns آخر 12 شهر مقابل الـPM plan والـMTBF", "Review 12-month breakdowns vs PM plan and MTBF"],
 [["العطل بيحصل بين PM والتاني", "Failure happens between PMs"],
 ["الـfrequency من الـmanual مش من التاريخ الفعلي", "Frequency from manual, not from failure history"],
 ["مفيش loop يرجّع الـbreakdown data للـPM plan", "No loop feeding breakdown data back to the PM plan"]],
 ["o_cm_contain_tmp"], ["o_cm_pm_review", "o_cm_cil"], ["o_k_mtbf", "o_k_mttr"]),
 o_c_df_detect: C("مفيش early detection (sensor، alarm، inspection point)", "No early detection (sensor, alarm, inspection point)", "machines",
 ["sensor", "design_weakness"],
 ["حدد أول علامة للمشكلة وكان ممكن تتكشف فين", "Find the first sign of the problem and where it could be seen"],
 [["المشكلة بتبان بس لما الماكينة تقف", "Problem visible only when the machine stops"],
 ["مفيش sensor أو alarm أو نقطة فحص", "No sensor, alarm or check point"],
 ["الـdetection مش متغطي في الـFMEA أو التصميم", "Detection not covered in FMEA or design"]],
 ["o_cm_contain_tmp"], ["o_cm_sensor_add", "o_cm_cil"], ["o_k_mtbf"]),
 o_c_df_plan: C("فجوة تخطيط وتنسيق بين الأقسام", "Planning / coordination gap between departments", "methods",
 ["planning", "waiting"],
 ["سجّل وقت الانتظار ومين كان مستني مين", "Log waiting time and who waited for whom"],
 [["الصيانة والإنتاج والـQA مستنيين بعض", "Maintenance, production and QA wait for each other"],
 ["مفيش خطة مشتركة للشغل", "No shared work plan"],
 ["مفيش daily tier meeting بـowner وaction board", "No daily tier meeting with owner and action board"]],
 ["o_cm_contain_tmp"], ["o_cm_tier", "o_cm_plan_co"], ["o_k_mttr"])
 };

 /* ---------------- countermeasures ---------------- */
 var cms = {
 /* containment */
 o_cm_co_prep_tmp: M("temporary", "L", "L", OW.prod, "checklist تحضير قبل الـchangeover الجاي", "Pre-changeover prep checklist for the next changeover"),
 o_cm_hold: M("temporary", "H", "L", OW.qa, "Hold/quarantine للباتش وإبلاغ QA و deviation", "Hold / quarantine batch, notify QA, raise deviation"),
 o_cm_100insp: M("temporary", "H", "H", OW.prod, "فرز 100% للمنتج المتأثر بموافقة QA", "100% sorting of affected product under QA approval"),
 o_cm_recal_tmp: M("temporary", "H", "L", OW.mnt, "إيقاف الجهاز، calibration فورا، وتقييم النتائج السابقة", "Stop instrument, calibrate now, assess previous results"),
 o_cm_isolate: M("temporary", "H", "L", OW.hse, "وقف الماكينة، LOTO، وعزل المكان بـbarrier", "Stop machine, apply LOTO, barricade the area"),
 o_cm_spill_tmp: M("temporary", "H", "L", OW.hse, "spill kit وتنظيف وعزل المكان حسب الـSDS", "Spill kit, clean up and isolate area per SDS"),
 o_cm_tag_tmp: M("temporary", "L", "L", OW.mnt, "tag للتسريب وعزل الخط لو ممكن", "Tag the leak and isolate the line if possible"),
 o_cm_switchoff_tmp: M("temporary", "L", "L", OW.prod, "إطفاء يدوي للمعدات الـidle بقائمة", "Manual switch-off of idle equipment using a list"),
 o_cm_borrow_tmp: M("temporary", "L", "L", OW.mnt, "شراء عاجل أو استعارة بقطعة متسجلة (مش cannibalization سري)", "Urgent buy or recorded loan of part (no hidden cannibalising)"),
 o_cm_quar_tmp: M("temporary", "L", "L", OW.wh, "رجّع القطعة الغلط، quarantine، وعدّ فعلي", "Return wrong part, quarantine, physical count"),
 o_cm_contain_tmp: M("temporary", "L", "L", OW.mnt, "فحص إضافي مؤقت لحد الحل الدائم", "Temporary extra check until the permanent fix"),
 /* changeover */
 o_cm_smed_std: M("standard", "H", "L", OW.opx, "SMED standard: فصل internal/external و target time", "SMED standard: internal / external split and target time"),
 o_cm_co_kit: M("design", "H", "L", OW.mnt, "kit trolley لكل منتج بـshadow board", "Changeover kit trolley per product with shadow board"),
 o_cm_set_sheet: M("standard", "H", "L", OW.eng, "setting sheet لكل منتج بقيم مجربة", "Setting sheet per product with proven values"),
 o_cm_set_marks: M("poka_yoke", "H", "H", OW.mnt, "علامات و stops ثابتة و quick clamps بدل الضبط بالعين", "Fixed marks, stops and quick clamps instead of eye setting"),
 o_cm_format_store: M("design", "H", "L", OW.mnt, "رف ثابت محمي لقطع الـformat بـlabels", "Dedicated protected rack for format parts, labelled"),
 o_cm_clean_std: M("standard", "H", "L", OW.prod, "cleaning standard بترتيب و tools و وقت و صور", "Cleaning standard with sequence, tools, time, photos"),
 o_cm_clean_design: M("design", "H", "H", OW.eng, "quick-release covers وشيل الـdust traps", "Quick-release covers and removal of dust traps"),
 o_cm_lc_map: M("standard", "H", "L", OW.qa, "line clearance checklist بخريطة صور للـtrap points", "Line clearance checklist with photo map of trap points"),
 o_cm_lc_design: M("design", "H", "H", OW.eng, "قفل أو إلغاء الـtrap points في الماكينة", "Close or eliminate trap points on the machine"),
 o_cm_lc_2check: M("inspection", "L", "L", OW.qa, "check مستقل تاني للـline clearance", "Independent second check of line clearance"),
 o_cm_qa_prealert: M("standard", "H", "L", OW.prod, "إبلاغ QA قبل نهاية الـchangeover بـ30 دقيقة", "Pre-alert QA 30 min before changeover ends"),
 o_cm_plan_co: M("standard", "H", "L", OW.pln, "slots للـchangeover والصيانة في الخطة الأسبوعية مع QA", "Changeover and maintenance slots in weekly plan with QA"),
 /* GMP */
 o_cm_sop_rev: M("standard", "H", "L", OW.qa, "تعديل الـSOP مع المستخدمين في الـgemba", "Revise SOP with users at the gemba"),
 o_cm_opl: M("training", "L", "L", OW.mnt, "OPL (one point lesson) جنب الماكينة", "One point lesson at the machine"),
 o_cm_change_ctrl: M("standard", "H", "L", OW.qa, "أي تغيير يعدي على change control بالـimpact assessment", "All changes through change control with impact assessment"),
 o_cm_alarm_limits: M("poka_yoke", "H", "L", OW.eng, "alarm/interlock على الـvalidated limits (change control)", "Alarm / interlock at validated limits (via change control)"),
 o_cm_cal_prog: M("pm", "H", "L", OW.mnt, "كل الأجهزة في calibration plan على SAP PM بـalerts", "All instruments in SAP PM calibration plan with alerts"),
 o_cm_form_redesign: M("design", "H", "L", OW.qa, "إعادة تصميم النموذج بترتيب الشغل وحقول إلزامية", "Redesign form in work sequence with mandatory fields"),
 o_cm_e_record: M("eliminate", "H", "H", OW.eng, "تسجيل إلكتروني بحقول إلزامية بدل الورق", "Electronic record with mandatory fields instead of paper"),
 o_cm_gdp_check: M("inspection", "L", "L", OW.prod, "مراجعة GDP آخر كل وردية", "GDP check at end of each shift"),
 o_cm_skill_matrix: M("standard", "H", "L", OW.prod, "qualification matrix محدثة لكل مهمة", "Up-to-date qualification matrix per task"),
 o_cm_sop_train_link: M("standard", "H", "L", OW.qa, "تعديل SOP يطلع تدريب + effectiveness check", "SOP revision triggers training and effectiveness check"),
 o_cm_di_access: M("design", "H", "L", OW.eng, "accounts فردية و roles و audit trail شغال", "Individual accounts, roles and audit trail enabled"),
 o_cm_di_review: M("standard", "H", "L", OW.qa, "periodic review للـaudit trail والـaccess", "Periodic audit-trail and access review"),
 o_cm_h1_lube: M("eliminate", "H", "L", OW.mnt, "شحم food-grade H1 فقط في مناطق المنتج", "H1 food-grade lubricant only in product zones"),
 o_cm_seal_pm: M("pm", "H", "L", OW.mnt, "فحص وتغيير الـproduct-contact seals في الـPM", "Product-contact seal inspection and change in PM"),
 o_cm_drip_shield: M("design", "H", "L", OW.eng, "drip trays و shields فوق المنتج", "Drip trays and shields above product"),
 /* safety */
 o_cm_interlock: M("poka_yoke", "H", "L", OW.eng, "coded safety interlock و safety relay", "Coded safety interlock with safety relay"),
 o_cm_guard_design: M("design", "H", "H", OW.eng, "guard بمفصلات و access آمن للتنظيف والضبط", "Hinged guards with safe access for cleaning and setting"),
 o_cm_guard_pm: M("pm", "H", "L", OW.mnt, "اختبار الـinterlocks في الـPM", "Interlock function test in PM"),
 o_cm_loto_sheet: M("standard", "H", "L", OW.hse, "LOTO sheet لكل ماكينة بصور نقط العزل", "Machine LOTO sheet with photos of isolation points"),
 o_cm_loto_points: M("design", "H", "L", OW.mnt, "isolation valves قابلة للقفل بـdump و labels", "Lockable isolation valves with dump, labelled"),
 o_cm_loto_audit: M("inspection", "L", "L", OW.hse, "LOTO audit شهري في الشغل الفعلي", "Monthly LOTO audit on live jobs"),
 o_cm_jsa: M("standard", "H", "L", OW.hse, "JSA/RA للمهمة ومراجعة بعد أي تغيير", "Task JSA / RA, reviewed after any change"),
 o_cm_nm_system: M("standard", "H", "L", OW.hse, "تسجيل near miss سهل و review أسبوعي", "Easy near-miss reporting with weekly review"),
 o_cm_task_redesign: M("design", "H", "H", OW.eng, "إعادة تصميم المهمة عشان الطريق الآمن يبقى الأسهل", "Redesign task so the safe way is the easy way"),
 o_cm_5s_std: M("standard", "L", "L", OW.prod, "5S standard و audit دوري", "5S standard with periodic audit"),
 o_cm_ppe_matrix: M("standard", "L", "L", OW.hse, "PPE matrix مربوطة بالمهام", "PPE matrix linked to tasks"),
 o_cm_closed_transfer: M("design", "H", "H", OW.eng, "closed transfer أو LEV بدل الـdecanting المفتوح", "Closed transfer or LEV instead of open decanting"),
 o_cm_lift_aid: M("design", "H", "H", OW.eng, "lifting aid أو vacuum lifter أو trolley بارتفاع مظبوط", "Lifting aid, vacuum lifter or height-set trolley"),
 o_cm_ergo_ra: M("standard", "L", "L", OW.hse, "ergonomic risk assessment للمهام المتكررة", "Ergonomic risk assessment for repetitive tasks"),
 /* energy */
 o_cm_leak_route: M("pm", "H", "L", OW.mnt, "leak survey كل 3 شهور و tag-and-fix خلال أسبوعين", "Quarterly leak survey; tag and fix within 2 weeks"),
 o_cm_auto_off: M("design", "H", "L", OW.eng, "idle mode و solenoid يقفل الهوا عند الوقف (change control)", "Idle mode; solenoid cuts air on stop (via change control)"),
 o_cm_shutdown_std: M("standard", "L", "L", OW.prod, "shutdown checklist آخر الوردية والإجازة الأسبوعية", "End-of-shift and weekend shutdown checklist"),
 o_cm_bms_sched: M("design", "H", "L", OW.eng, "schedules و setback على الـBMS للأماكن الفاضية", "BMS schedules and setback for unoccupied areas"),
 o_cm_setpoint_reg: M("standard", "H", "L", OW.eng, "setpoint register بالـGMP limit والتبرير", "Setpoint register with GMP limit and justification"),
 o_cm_press_opt: M("design", "H", "L", OW.eng, "تقليل ضغط الـheader بعد demand study و booster محلي", "Lower header pressure after demand study; local booster"),
 o_cm_air_nozzle: M("design", "L", "L", OW.mnt, "nozzles موفرة بدل الـopen pipe blowing", "Engineered nozzles instead of open-pipe blowing"),
 o_cm_submeter: M("design", "H", "H", OW.eng, "sub-meters في الـEMS لكل منطقة و utility", "EMS sub-meters per area and utility"),
 o_cm_en_kpi: M("standard", "H", "L", OW.opx, "KPI طاقة يومي في الـtier meeting", "Daily energy KPI in the tier meeting"),
 /* spare parts */
 o_cm_minmax_rev: M("standard", "H", "L", OW.mnt, "review للـmin/max كل 6 شهور من الاستهلاك والـlead time", "Min/max review every 6 months from usage and lead time"),
 o_cm_sap_mrp: M("design", "H", "L", OW.pln, "reorder point في SAP MRP يطلع PR أوتوماتيك", "SAP MRP reorder point creates PR automatically"),
 o_cm_crit_list: M("standard", "H", "L", OW.mnt, "criticality analysis و critical spares list لكل ماكينة", "Criticality analysis and critical spares list per machine"),
 o_cm_sp_plan: M("standard", "H", "L", OW.pln, "annual spares plan من الـPM والـoverhauls", "Annual spares plan from PM and overhauls"),
 o_cm_local_alt: M("design", "H", "H", OW.eng, "مورد محلي أو بديل معتمد عن طريق change control", "Qualified local or second source via change control"),
 o_cm_obs_review: M("standard", "H", "L", OW.eng, "lifecycle review سنوي مع الـOEM و last-time buy", "Yearly lifecycle review with OEM and last-time buy"),
 o_cm_retrofit: M("eliminate", "H", "H", OW.eng, "خطة retrofit أو upgrade للـobsolete (change control)", "Retrofit / upgrade plan for obsolete items (change control)"),
 o_cm_bom: M("standard", "H", "L", OW.mnt, "equipment BOM في SAP بالـOEM part no. وصورة", "Equipment BOM in SAP with OEM part no. and photo"),
 o_cm_sp_spec: M("standard", "H", "L", OW.eng, "technical spec و approved suppliers للـcritical spares", "Technical spec and approved suppliers for critical spares"),
 o_cm_incoming: M("inspection", "L", "L", OW.wh, "incoming check للـcritical spares", "Incoming check for critical spares"),
 o_cm_store_cond: M("standard", "H", "L", OW.wh, "storage conditions و shelf life للـrubber والـelectronics", "Storage conditions and shelf life for elastomers and electronics"),
 /* warehouse */
 o_cm_scan: M("poka_yoke", "H", "H", OW.wh, "barcode scan إلزامي عند الصرف والاستلام", "Mandatory barcode scan at issue and receipt"),
 o_cm_label_std: M("standard", "L", "L", OW.wh, "labels مطبوعة بكود SAP والـlocation وصورة", "Printed bin labels with SAP code, location, photo"),
 o_cm_fifo: M("design", "H", "L", OW.wh, "FIFO lane أو flow rack و expiry labels بالألوان", "FIFO lane or flow rack with colour expiry labels"),
 o_cm_address: M("standard", "H", "L", OW.wh, "bin addressing في SAP لكل قطعة", "Bin addressing in SAP for every part"),
 o_cm_oh_issue: M("standard", "L", "L", OW.wh, "out-of-hours issue log وتسجيل تاني يوم الصبح", "Out-of-hours issue log, posted next morning"),
 o_cm_cycle_count: M("inspection", "L", "L", OW.wh, "cycle count شهري للـA items", "Monthly cycle count of A items"),
 /* general */
 o_cm_visual: M("standard", "H", "L", OW.prod, "visual standard (صور، ألوان، حدود) مكان الشغل", "Visual standard (photos, colours, limits) at point of use"),
 o_cm_pm_review: M("pm", "H", "L", OW.mnt, "تعديل الـPM task والـfrequency من الـMTBF", "Adjust PM task and frequency from MTBF data"),
 o_cm_cil: M("standard", "H", "L", OW.prod, "CIL (clean-inspect-lube) في الـAM للمشغل", "CIL (clean-inspect-lube) in autonomous maintenance"),
 o_cm_sensor_add: M("poka_yoke", "H", "H", OW.eng, "sensor أو alarm للكشف بدري (change control)", "Sensor or alarm for early detection (change control)"),
 o_cm_tier: M("standard", "H", "L", OW.opx, "daily tier meeting بـaction board و owners", "Daily tier meeting with action board and owners")
 };

 /* ---------------- KPIs ---------------- */
 var kpis = {
 o_k_co_time: { ar: "وقت الـchangeover", en: "Changeover time", unit: "min" },
 o_k_startup_rej: { ar: "رفض أول التشغيل بعد changeover", en: "Start-up rejects after changeover", unit: "units" },
 o_k_dev_count: { ar: "عدد الـdeviations", en: "Deviations per month", unit: "count/month" },
 o_k_gdp_err: { ar: "أخطاء GDP", en: "GDP errors per month", unit: "count/month" },
 o_k_cal_ontime: { ar: "Calibration في ميعادها", en: "Calibration on time", unit: "%" },
 o_k_nm_count: { ar: "near misses متسجلة", en: "Near misses reported", unit: "count/month" },
 o_k_ergo: { ar: "درجة خطر الـergonomics", en: "Ergonomic risk score", unit: "score" },
 o_k_kwh: { ar: "استهلاك الكهربا", en: "Electricity use", unit: "kWh/day" },
 o_k_air: { ar: "استهلاك الهوا وقت الوقف", en: "Air demand at no production", unit: "Nm3/min" },
 o_k_leaks: { ar: "تسريبات مفتوحة", en: "Open leaks", unit: "count" },
 o_k_stockout: { ar: "مرات الـstock-out", en: "Stock-outs", unit: "count/month" },
 o_k_sp_wait: { ar: "وقف مستني قطع غيار", en: "Downtime waiting for spares", unit: "h/month" },
 o_k_pick_acc: { ar: "دقة الصرف", en: "Picking accuracy", unit: "%" },
 o_k_inv_acc: { ar: "دقة المخزون SAP مقابل الفعلي", en: "Inventory accuracy (SAP vs physical)", unit: "%" },
 o_k_search: { ar: "وقت الدور على القطعة", en: "Time to find a part", unit: "min" },
 o_k_mtbf: { ar: "الـMTBF (الوقت بين الأعطال)", en: "MTBF", unit: "h" },
 o_k_mttr: { ar: "الـMTTR (وقت التصليح)", en: "MTTR", unit: "h" }
 };

 /* ---------------- category symptoms ---------------- */
 var catSymptoms = {
 "Changeover": [
 S("o_co_long", "الـchangeover أطول من الـtarget", "Changeover longer than target", ["o_c_co_internal", "o_c_co_missing", "o_c_co_trial", "o_c_co_qa_wait"], ["setup_loss", "after_changeover"]),
 S("o_co_missing", "قطع format أو tools ناقصة وقت الـchangeover", "Format parts or tools missing at changeover", ["o_c_co_missing", "o_c_co_internal", "o_c_co_trial"], ["setup_loss", "waiting"]),
 S("o_co_trial", "trial runs كتير لحد ما المنتج يظبط", "Many trial runs before good product", ["o_c_co_trial", "o_c_co_missing", "o_c_df_std"], ["startup_loss", "setting_change"]),
 S("o_co_clean", "التنظيف طويل أو اتعاد", "Cleaning too long or repeated", ["o_c_co_clean", "o_c_co_lc", "o_c_co_qa_wait"], ["after_cleaning", "setup_loss"]),
 S("o_co_lc", "line clearance فشل أو اتعاد", "Line clearance failed or repeated", ["o_c_co_lc", "o_c_co_clean", "o_c_gq_proc"], ["documentation"]),
 S("o_co_qa", "انتظار release من QA/IPC", "Waiting for QA / IPC release", ["o_c_co_qa_wait", "o_c_co_trial", "o_c_df_plan"], ["waiting"]),
 S("o_co_startup", "رفض أو minor stops بعد الـchangeover", "Rejects or minor stops after changeover", ["o_c_co_trial", "o_c_df_pm", "o_c_df_std"], ["startup_loss", "minor_stops"])
 ],
 "GMP / Quality": [
 S("o_gq_dev", "deviation وقت الإنتاج", "Deviation during production", ["o_c_gq_proc", "o_c_gq_param", "o_c_gq_train"], ["defects"]),
 S("o_gq_doc", "غلطة GDP في الـBMR أو الـlogbook", "GDP error in BMR or logbook", ["o_c_gq_doc", "o_c_gq_train", "o_c_gq_di"], ["documentation"]),
 S("o_gq_lc", "line clearance فاشل أو خطر mix-up", "Line clearance failure or mix-up risk", ["o_c_co_lc", "o_c_gq_proc", "o_c_gq_train"], ["after_changeover"]),
 S("o_gq_cal", "جهاز قياس overdue أو برا الـcalibration", "Instrument overdue or out of calibration", ["o_c_gq_cal", "o_c_gq_doc"], ["calibration"]),
 S("o_gq_di", "مشكلة data integrity (audit trail، وقت، access)", "Data integrity issue (audit trail, time, access)", ["o_c_gq_di", "o_c_gq_proc"], ["plc_software"]),
 S("o_gq_cont", "تلوث أو جسم غريب أو cross-contamination", "Contamination, foreign matter or cross-contamination", ["o_c_gq_cont", "o_c_co_clean", "o_c_gq_proc"], ["contamination"])
 ],
 "Safety": [
 S("o_sf_cond", "unsafe condition (guard ناقص، panel مفتوح، أرض مزحلقة)", "Unsafe condition (missing guard, open panel, slippery floor)", ["o_c_sf_guard", "o_c_sf_ra", "o_c_sf_shortcut"], ["safety_guard"]),
 S("o_sf_act", "unsafe act (bypass، من غير PPE، shortcut)", "Unsafe act (bypass, no PPE, shortcut)", ["o_c_sf_shortcut", "o_c_sf_ra", "o_c_sf_loto"], ["human_factor"]),
 S("o_sf_loto", "LOTO ماتعملش أو ناقص", "LOTO not applied or incomplete", ["o_c_sf_loto", "o_c_sf_ra", "o_c_sf_shortcut"], ["loto"]),
 S("o_sf_nm", "near miss (من غير إصابة)", "Near miss (no injury)", ["o_c_sf_ra", "o_c_sf_guard", "o_c_sf_shortcut"]),
 S("o_sf_chem", "تعرض أو انسكاب كيماويات/solvent", "Chemical or solvent exposure / spill", ["o_c_sf_chem", "o_c_sf_ra"], ["leak"]),
 S("o_sf_ergo", "إجهاد ergonomic (شيل تقيل، وضع غلط)", "Ergonomic strain (heavy lift, awkward posture)", ["o_c_sf_ergo", "o_c_sf_shortcut", "o_c_sf_ra"], ["ergonomics"]),
 S("o_sf_inj", "إصابة بسيطة أو first aid", "Minor injury or first aid", ["o_c_sf_guard", "o_c_sf_ra", "o_c_sf_ergo"])
 ],
 "Energy & Utilities": [
 S("o_en_leak", "تسريب هوا مضغوط (صوت صفير)", "Compressed air leak (hissing)", ["o_c_en_leak", "o_c_en_press"], ["leak", "utility_air"]),
 S("o_en_idle", "معدات شغالة من غير إنتاج", "Equipment running with no production", ["o_c_en_idle", "o_c_en_setpoint"], ["energy_waste"]),
 S("o_en_sp", "setpoint أعلى أو أضيق من اللازم", "Setpoint tighter or higher than needed", ["o_c_en_setpoint", "o_c_en_press"], ["setting_change"]),
 S("o_en_high", "الاستهلاك أعلى من الـbaseline", "Consumption above baseline", ["o_c_en_meter", "o_c_en_leak", "o_c_en_idle"], ["energy_waste"]),
 S("o_en_steam", "تسريب steam أو condensate أو مية", "Steam, condensate or water leak", ["o_c_en_leak", "o_c_df_pm"], ["utility_steam", "leak"]),
 S("o_en_blow", "هوا مضغوط بيستخدم في التنظيف أو التبريد", "Compressed air used for cleaning or cooling", ["o_c_en_press", "o_c_df_std"], ["utility_air"])
 ],
 "Spare Parts Needed": [
 S("o_sp_out", "القطعة مش موجودة في المخزن وقت العطل", "Part out of stock when needed", ["o_c_sp_minmax", "o_c_sp_crit", "o_c_sp_master"], ["planning"]),
 S("o_sp_lead", "lead time طويل أو تأخير استيراد", "Long lead time or import delay", ["o_c_sp_lead", "o_c_sp_crit"], ["supplier"]),
 S("o_sp_obs", "القطعة obsolete ومش بتتصنع", "Part obsolete, no longer supplied", ["o_c_sp_obs", "o_c_sp_crit"], ["wear_age"]),
 S("o_sp_wrong", "القطعة اللي وصلت مش مظبوطة أو spec غلط", "Received part does not fit or wrong spec", ["o_c_sp_master", "o_c_sp_supplier"], ["documentation"]),
 S("o_sp_early", "قطعة جديدة باظت بدري", "New spare failed early", ["o_c_sp_supplier", "o_c_sp_storage"], ["new_part"]),
 S("o_sp_nobom", "الـpart no. مش معروف أو مفيش BOM في SAP", "Part no. unknown or no BOM in SAP", ["o_c_sp_master", "o_c_sp_crit"], ["documentation"])
 ],
 "Warehouse Issue": [
 S("o_wh_wrong", "اتصرفت قطعة أو خامة غلط", "Wrong part or material issued", ["o_c_wh_pick", "o_c_sp_master", "o_c_wh_label"], ["handling"]),
 S("o_wh_label", "label أو كود ناقص أو مش مقروء", "Label or code missing / unreadable", ["o_c_wh_label", "o_c_sp_master"], ["documentation"]),
 S("o_wh_fifo", "FIFO/FEFO مش متطبق", "FIFO / FEFO not followed", ["o_c_wh_fifo", "o_c_wh_label"], ["storage"]),
 S("o_wh_cond", "ظروف تخزين برا الـlimit أو تغليف تالف", "Storage condition out of limit or damaged packing", ["o_c_sp_storage", "o_c_wh_fifo"], ["storage", "env_heat_humidity"]),
 S("o_wh_diff", "رصيد SAP مش زي الفعلي", "SAP stock differs from physical", ["o_c_wh_trans", "o_c_wh_pick"], ["documentation"]),
 S("o_wh_search", "وقت طويل في الدور على القطع", "Long time searching for parts", ["o_c_wh_label", "o_c_sp_master"], ["motion", "waiting"])
 ],
 "default": [
 S("o_df_recur", "خسائر أو وقفات صغيرة بتتكرر", "Recurring small stops or losses", ["o_c_df_pm", "o_c_df_detect", "o_c_df_std"], ["minor_stops"]),
 S("o_df_std", "كل وردية بتعمل المهمة بطريقة", "Task done differently by each shift", ["o_c_df_std", "o_c_gq_train"], ["shift_change"]),
 S("o_df_late", "المشكلة بتتكشف متأخر", "Problem detected late", ["o_c_df_detect", "o_c_df_pm"], ["sensor"]),
 S("o_df_plan", "تأخير بسبب التخطيط أو التنسيق", "Delay from planning or coordination", ["o_c_df_plan", "o_c_df_std"], ["waiting", "planning"]),
 S("o_df_design", "تصميم المعدة بيصعّب المهمة", "Equipment design makes the task hard", ["o_c_sf_shortcut", "o_c_df_detect"], ["design_weakness"])
 ]
 };

 /* ---------------- questions ---------------- */
 var NONE_STD = function (cat) { return O("none", "مفيش standard مكتوب", "No written standard", ["procedure_gap"]); };
 var questions = {
 sym: { ar: "إيه العَرَض الأساسي؟", en: "Main symptom?", hint: B("اختار أقرب واحد، وزوّد تفاصيل لو محتاج", "Pick the closest; add detail if needed"), type: "single", other: true },
 part: { ar: "إيه القطعة اللي اتغيرت؟", en: "Which part was replaced?", type: "single", other: true },
 std: {
 ar: "إيه الـstandard (المفروض يكون إيه)؟", en: "What is the standard (expected condition)?",
 hint: B("اختار المرجع واكتب الرقم المطلوب، مثلا 90 دقيقة أو 5.5 bar", "Pick the reference and type the target value, e.g. 90 min or 5.5 bar"),
 type: "single", other: true,
 options: [O("sop", "الـSOP / WI", "SOP / WI"), O("checklist", "checklist أو OPL", "Checklist or OPL"), O("oem", "spec الـOEM manual", "OEM manual spec"), NONE_STD()],
 byCat: {
 "Breakdown Fixed": [O("sop", "قيم الضبط في الـSOP/WI", "Setting values in SOP / WI", ["setting_change"]), O("pm", "الـPM checklist", "PM checklist", ["after_pm"]), O("cil", "standard الـCIL/AM", "CIL / AM standard", ["lubrication"]), O("oem", "spec الـOEM manual", "OEM manual spec"), O("bmr", "validated parameter في الـBMR", "Validated parameter in batch record", ["calibration"]), NONE_STD()],
 "Changeover": [O("co_sop", "changeover SOP بـtarget time", "Changeover SOP with target time"), O("smed", "checklist الـSMED (internal/external)", "SMED checklist (internal / external)"), O("lc", "checklist الـline clearance", "Line clearance checklist", ["documentation"]), O("kit", "قائمة format parts / kit", "Format parts list / kit"), O("none", "مفيش target time للـchangeover", "No changeover target time", ["procedure_gap", "setup_loss"])],
 "GMP / Quality": [O("sop", "الـSOP / WI", "SOP / WI", ["procedure_gap"]), O("bmr", "الـBMR / BPR", "Batch record (BMR / BPR)", ["documentation"]), O("cal", "برنامج الـcalibration", "Calibration programme", ["calibration"]), O("clean", "الـcleaning SOP / validation", "Cleaning SOP / validation", ["after_cleaning"]), O("alcoa", "قواعد data integrity (ALCOA+)", "Data integrity rules (ALCOA+)", ["documentation"]), O("env", "limits الغرفة (temp/RH/dP)", "Room limits (temp / RH / dP)", ["env_heat_humidity"]), O("none", "المتطلب مش واضح", "Requirement not clear", ["procedure_gap"])],
 "Safety": [O("ra", "الـrisk assessment / JSA", "Risk assessment / JSA"), O("loto", "إجراء الـLOTO", "LOTO procedure", ["loto"]), O("guard", "standard الـguards والـinterlocks", "Guarding / interlock standard", ["safety_guard"]), O("ppe", "الـPPE matrix", "PPE matrix"), O("sds", "الـSDS والتعامل مع الكيماويات", "SDS / chemical handling"), O("ergo", "حدود الشيل اليدوي", "Manual handling limits", ["ergonomics"]), NONE_STD()],
 "Energy & Utilities": [O("setp", "setpoint في الـBMS/EMS", "Setpoint in BMS / EMS", ["setting_change"]), O("shut", "schedule إطفاء (idle off)", "Switch-off schedule (idle off)", ["energy_waste"]), O("leak", "route فحص التسريبات", "Leak inspection route", ["leak"]), O("kpi", "target استهلاك / KPI", "Consumption target / KPI"), NONE_STD()],
 "Spare Parts Needed": [O("minmax", "min/max في SAP", "Min/max in SAP", ["planning"]), O("crit", "قائمة الـcritical spares", "Critical spares list"), O("lead", "lead time متعرف للقطعة", "Defined part lead time", ["supplier"]), O("bom", "BOM في SAP مربوط بالماكينة", "SAP BOM linked to equipment", ["documentation"]), NONE_STD()],
 "Warehouse Issue": [O("cond", "label ظروف التخزين", "Storage condition label", ["storage"]), O("fifo", "قاعدة FIFO/FEFO", "FIFO / FEFO rule", ["storage"]), O("md", "material master / كود", "Material master / code", ["documentation"]), O("pick", "procedure الصرف", "Issue / picking procedure", ["handling"]), NONE_STD()]
 }
 },
 act: { ar: "إيه اللي حصل فعلا (بالرقم)؟", en: "What actually happened (with a number)?", hint: B("مثلا: الـchangeover خد 150 دقيقة بدل 90", "e.g. changeover took 150 min instead of 90"), type: "text", other: true },
 dur: { ar: "الوقف أو التأخير كام ساعة؟", en: "Downtime or delay (hours)?", type: "number", unit: "h", quick: [0.25, 0.5, 1, 2, 4, 8, 24] },
 cost: { ar: "الخسارة أو التكلفة تقريبا؟", en: "Approximate loss or cost?", type: "number", unit: "EGP", quick: [1000, 5000, 10000, 20000, 50000, 100000] },
 co_min: { ar: "الـchangeover خد كام دقيقة فعلا؟", en: "Actual changeover time (min)?", type: "number", unit: "min", quick: [30, 60, 90, 120, 180, 240] },
 sp_days: { ar: "استنينا القطعة كام يوم؟", en: "Days waiting for the part?", type: "number", unit: "days", quick: [1, 3, 7, 14, 30, 60] },
 rep: { ar: "حصلت كام مرة آخر 3 شهور؟", en: "How often in the last 3 months?", type: "single",
 options: [O("first", "أول مرة", "First time"), O("r2_3", "2-3 مرات", "2-3 times"), O("r4plus", "4 مرات أو أكتر", "4 or more times")] },
 chg: { ar: "إيه اللي اتغير قبلها؟", en: "What changed before it started?", type: "multi", other: true,
 options: [O("after_pm", "بعد PM", "After PM", ["after_pm"]), O("after_co", "بعد changeover", "After changeover", ["after_changeover"]), O("after_cl", "بعد تنظيف", "After cleaning", ["after_cleaning"]),
 O("new_part", "قطعة جديدة اتركبت", "New part fitted", ["new_part"]), O("non_oem", "قطعة non-OEM", "Non-OEM part", ["non_oem_part", "supplier"]), O("new_prod", "منتج جديد", "New product", ["new_product"]),
 O("new_batch", "batch خامة جديد", "New material batch", ["new_material_batch"]), O("new_op", "شخص جديد على المهمة", "New person on the task", ["new_operator", "training_gap"]), O("shift", "تغيير وردية", "Shift change", ["shift_change"]),
 O("setting", "تغيير setting", "Setting changed", ["setting_change"]), O("software", "تغيير PLC/software", "PLC / software change", ["software_change", "plc_software"]), O("utility", "مشكلة utilities (هوا، كهربا، steam)", "Utility issue (air, power, steam)", ["utility_air", "utility_power", "utility_steam"]),
 O("weather", "حر أو رطوبة أو تراب", "Heat, humidity or dust", ["env_heat_humidity", "env_dust"]), O("nothing", "مفيش حاجة اتغيرت", "Nothing changed", ["no_change", "wear_age"]), O("dont_know", "مش عارف", "Not known")] },
 det: { ar: "اتكشفت إزاي؟", en: "How was it detected?", type: "single", other: true,
 options: [O("alarm", "alarm على الماكينة", "Machine alarm", ["sensor"]), O("operator", "المشغل لاحظ", "Operator noticed"), O("ipc_qc", "IPC أو QC", "IPC or QC check", ["defects"]),
 O("pm_inspection", "في الـPM أو الـCIL", "During PM or CIL", ["wear_age"]), O("audit", "audit أو walk", "Audit or walk", ["documentation", "procedure_gap"]), O("complaint", "complaint من العميل", "Customer complaint", ["defects", "design_weakness"]),
 O("meter", "عداد أو KPI (طاقة، SAP)", "Meter or KPI (energy, SAP)", ["energy_waste"]), O("stop", "الماكينة وقفت", "Machine stopped", ["design_weakness"])] },
 fix: { ar: "عملت إيه فورا (containment)؟", en: "What was done immediately (containment)?", type: "multi", other: true,
 options: [O("repair", "تصليح", "Repaired"), O("replace", "تغيير قطعة", "Part replaced"), O("adjust", "ضبط", "Adjusted"), O("clean", "تنظيف", "Cleaned"), O("temp", "حل مؤقت لحد الحل الدائم", "Temporary fix until permanent one"), O("escalate", "تصعيد", "Escalated")],
 byCat: {
 "Breakdown Fixed": [O("replace", "تغيير قطعة", "Part replaced", ["new_part"]), O("adjust", "ضبط أو alignment", "Adjusted / realigned", ["alignment", "setting_change"]), O("clean", "تنظيف", "Cleaned", ["contamination"]), O("lube", "تشحيم", "Lubricated", ["lubrication"]),
 O("reset", "reset و restart", "Reset and restart", ["plc_software"]), O("temp", "تصليح مؤقت", "Temporary repair"), O("oem", "كلمنا الـOEM", "Called OEM / supplier", ["supplier"]), O("extra_chk", "فحص إضافي لحد الحل", "Extra check added", ["sensor"])],
 "Changeover": [O("reset", "إعادة الضبط", "Settings redone", ["setting_change"]), O("fetch", "جبنا قطعة أو tool ناقص", "Fetched missing part or tool", ["planning", "motion"]), O("reclean", "تنظيف تاني", "Re-cleaned", ["after_cleaning"]), O("relc", "line clearance تاني", "Line clearance repeated", ["documentation"]),
 O("waitqa", "استنينا QA", "Waited for QA release", ["waiting"]), O("trials", "trial runs وضبط", "Trial runs and adjustment", ["startup_loss"]), O("borrow", "استلفنا قطعة من خط تاني", "Borrowed part from another line", ["planning"])],
 "GMP / Quality": [O("stop", "وقف الخط", "Line stopped"), O("hold", "hold / quarantine للباتش", "Batch on hold / quarantine"), O("qa", "إبلاغ QA", "QA notified"), O("dev", "deviation اتفتح", "Deviation raised", ["documentation"]),
 O("sort", "فرز 100%", "100% sorting", ["defects"]), O("relc", "line clearance تاني", "Line clearance repeated"), O("recal", "calibration أو check", "Recalibrated / checked", ["calibration"]), O("gdp", "تصحيح المستند حسب GDP", "Record corrected per GDP", ["documentation"])],
 "Safety": [O("barrier", "عزل المكان بـbarrier", "Area barricaded"), O("loto", "وقف الماكينة و LOTO", "Machine stopped and LOTO", ["loto"]), O("guard", "رجّعنا الـguard", "Guard restored", ["safety_guard"]), O("spill", "تنظيف انسكاب", "Spill cleaned", ["leak"]),
 O("ppe", "PPE اتوفر", "PPE provided"), O("firstaid", "إسعافات أولية", "First aid given"), O("hse", "إبلاغ HSE", "Reported to HSE")],
 "Energy & Utilities": [O("tag", "tag للتسريب", "Leak tagged", ["leak"]), O("fix_leak", "صلحنا التسريب", "Leak fixed", ["leak"]), O("off", "إطفاء المعدة", "Equipment switched off", ["energy_waste"]), O("setp", "تعديل setpoint", "Setpoint corrected", ["setting_change"]), O("util", "إبلاغ الـutilities", "Reported to utilities")],
 "Spare Parts Needed": [O("borrow", "استلاف من ماكينة تانية (متسجل)", "Recorded loan from another machine", ["planning"]), O("urgent", "PR عاجل", "Urgent PR raised", ["supplier"]), O("repair_old", "تصليح القطعة القديمة", "Old part repaired locally", ["wear_age"]),
 O("alt", "بديل (محتاج change control)", "Alternative part (needs change control)", ["non_oem_part"]), O("supplier", "تواصلنا مع المورد", "Supplier contacted", ["supplier"])],
 "Warehouse Issue": [O("return", "رجّعنا القطعة الغلط", "Wrong part returned", ["handling"]), O("sap_fix", "تصحيح الرصيد في SAP", "SAP stock corrected", ["documentation"]), O("relabel", "label جديد", "Re-labelled", ["documentation"]), O("quar", "quarantine للقطعة", "Part quarantined", ["storage"]), O("count", "جرد فعلي", "Physical count", ["documentation"])]
 } },
 known: { ar: "السبب متأكد منه؟", en: "Is the cause confirmed?", type: "single",
 options: [O("confirmed", "متأكد (اتشاف أو اتقاس)", "Confirmed (seen or measured)"), O("suspected", "شاكك", "Suspected"), O("unknown", "مش معروف", "Unknown")] },
 checked: { ar: "إيه اللي اتفحص واستبعدته؟", en: "What was already checked / ruled out?", type: "multi", other: true,
 options: [O("utilities", "الـutilities (هوا، كهربا)", "Utilities (air, power)", ["utility_air", "utility_power"]), O("sensors", "الـsensors", "Sensors", ["sensor"]), O("settings", "الضبط مقابل الـSOP", "Settings vs SOP", ["setting_change"]),
 O("wear", "تآكل القطع", "Part wear", ["wear_age", "mechanical"]), O("lube", "التشحيم", "Lubrication", ["lubrication"]), O("elec", "الكهربا و الـwiring", "Electrical / wiring", ["electrical"]),
 O("plc", "alarms و history الـPLC", "PLC alarms and history", ["plc_software"]), O("material", "الخامة / التشغيلة", "Material / batch", ["new_material_batch"]), O("records", "السجلات و الـlogbook", "Records and logbook", ["documentation"]), O("nothing", "لسه مفحصتش", "Nothing checked yet")],
 byCat: {
 "Changeover": [O("video", "video و timing للخطوات", "Video and step timing", ["setup_loss"]), O("kit", "الـkit والقطع", "Kit and parts", ["planning"]), O("settings", "قيم الضبط", "Setting values", ["setting_change"]), O("parts", "حالة قطع الـformat", "Format part condition", ["wear_age"]), O("qa_time", "وقت انتظار QA", "QA waiting time", ["waiting"]), O("nothing", "لسه", "Nothing yet")],
 "GMP / Quality": [O("sop", "الـSOP مقابل الشغل", "SOP vs practice", ["procedure_gap"]), O("trend", "trend الـparameters", "Parameter trends", ["setting_change"]), O("cal", "حالة الـcalibration", "Calibration status", ["calibration"]), O("training", "سجلات التدريب", "Training records", ["training_gap"]), O("audit", "الـaudit trail", "Audit trail", ["plc_software"]), O("env", "الـBMS (temp/RH/dP)", "BMS temp / RH / dP", ["env_heat_humidity"]), O("nothing", "لسه", "Nothing yet")],
 "Safety": [O("ra", "الـRA/JSA", "RA / JSA", ["procedure_gap"]), O("guards", "الـguards والـinterlocks", "Guards and interlocks", ["safety_guard"]), O("loto", "نقط الـLOTO", "LOTO points", ["loto"]), O("ppe", "الـPPE", "PPE"), O("elec", "الـpanel والكابلات", "Panel and cables", ["electrical"]), O("nothing", "لسه", "Nothing yet")],
 "Energy & Utilities": [O("survey", "فحص تسريبات (leak survey)", "Leak survey", ["leak"]), O("trend", "trend الاستهلاك", "Consumption trend", ["energy_waste"]), O("setp", "الـsetpoints", "Setpoints", ["setting_change"]), O("pressure", "الضغط عند المستخدم", "Pressure at user", ["utility_air"]), O("nothing", "لسه", "Nothing yet")],
 "Spare Parts Needed": [O("sap", "رصيد SAP و min/max", "SAP stock and min/max", ["planning"]), O("bom", "الـBOM والـpart no.", "BOM and part no.", ["documentation"]), O("supplier", "المورد والـlead time", "Supplier and lead time", ["supplier"]), O("store", "حالة التخزين", "Storage condition", ["storage"]), O("nothing", "لسه", "Nothing yet")],
 "Warehouse Issue": [O("sap", "حركات SAP", "SAP transactions", ["documentation"]), O("loc", "الـlocation والـlabel", "Location and label", ["storage"]), O("pick", "طريقة الصرف", "Picking method", ["handling"]), O("fifo", "التواريخ و FIFO", "Dates and FIFO", ["storage"]), O("nothing", "لسه", "Nothing yet")]
 } },
 impact6: { ar: "حسّنت إيه؟", en: "What did it affect?", type: "multi",
 options: [O("Q", "الجودة (Q)", "Quality (Q)"), O("C", "التكلفة (C)", "Cost (C)"), O("D", "التسليم/الإنتاج (D)", "Delivery / output (D)"), O("S", "السلامة (S)", "Safety (S)"), O("CSR", "البيئة والمجتمع (CSR)", "Environment / CSR"), O("E", "الناس والـengagement (E)", "People / engagement (E)")] },
 who: { ar: "مين في الفريق؟", en: "Who is in the team?", type: "multi", other: true,
 options: [O("maintenance", "الصيانة", "Maintenance"), O("production", "الإنتاج", "Production"), O("qa", "الجودة QA", "QA"), O("qc", "الرقابة QC", "QC"), O("engineering", "الهندسة", "Engineering"), O("warehouse", "المخزن", "Warehouse"), O("hse", "السلامة HSE", "HSE"), O("supplier", "المورد / الـOEM", "Supplier / OEM")] },
 gmp_imp: { ar: "فيه تأثير على المنتج؟", en: "Product impact?", hint: B("لو مش متأكد اختار مش معروف وبلّغ QA", "If unsure pick unknown and inform QA"), type: "single",
 options: [O("none", "مفيش تلامس مع المنتج", "No product contact"), O("held", "المنتج اتعمله hold", "Product on hold", ["defects"]), O("batch_risk", "تشغيلة (Batch) تحت خطر", "Batch at risk", ["defects"]), O("released", "ممكن يكون منتج released", "Released product may be affected", ["defects"]), O("unknown", "مش معروف", "Unknown")] },
 qa_note: { ar: "QA اتبلغ؟", en: "Was QA notified?", type: "single",
 options: [O("yes_dev", "أيوه و deviation اتفتح", "Yes, deviation raised"), O("yes_qa", "أيوه، مستنيين قرار QA", "Yes, awaiting QA decision"), O("no", "لأ لسه", "Not yet"), O("na", "مش محتاج (مفيش أثر GMP)", "Not needed (no GMP impact)")] },
 loto: { ar: "الـLOTO اتعمل؟", en: "Was LOTO applied?", type: "single",
 options: [O("done", "كامل لكل مصادر الطاقة", "Yes, all energy sources", ["loto"]), O("partial", "جزئي (كهربا بس مثلا)", "Partial (e.g. electrical only)", ["loto", "pneumatic"]), O("not_needed", "مش محتاج (مفيش تدخل)", "Not needed (no intervention)"), O("not_done", "لأ", "No", ["loto", "procedure_gap"])] },
 saf_rep: { ar: "اتسجل في نظام الـHSE؟", en: "Reported in the HSE system?", type: "single",
 options: [O("reported", "أيوه، near miss / incident متسجل", "Yes, near miss / incident logged"), O("not_yet", "لأ لسه", "Not yet")] },
 kz_kind: { ar: "نوع الـKaizen؟", en: "Kaizen type?", type: "single",
 options: [O("quick", "Quick Kaizen (أيام، فرد أو اتنين)", "Quick Kaizen (days, 1-2 people)"), O("event", "Kaizen event (ورشة 3-5 أيام)", "Kaizen event (3-5 day workshop)"), O("standard", "Standard Kaizen (تحسين الـstandard)", "Standard Kaizen (improve the standard)")] },
 kz_loss: { ar: "الـKaizen بيقلل أنهي هدر؟", en: "Which loss does it attack?", type: "multi", other: true, options: LOSSES },
 kz_before: { ar: "الوضع الحالي (بالأرقام)", en: "Current situation (with numbers)", hint: B("مثلا: changeover 150 دقيقة، 18 مرة في الشهر", "e.g. changeover 150 min, 18 per month"), type: "text", other: true },
 kz_metric: { ar: "أنهي KPI هيتحسن؟", en: "Which KPI improves?", type: "single", other: true,
 options: [O("co_time", "وقت الـchangeover (min)", "Changeover time (min)", ["setup_loss"]), O("oee", "الـOEE (%)", "OEE (%)"), O("downtime", "وقف (h)", "Downtime (h)", ["mechanical"]), O("mtbf", "الـMTBF (h)", "MTBF (h)", ["wear_age"]),
 O("mttr", "الـMTTR (min)", "MTTR (min)", ["planning"]), O("reject", "نسبة الرفض (%)", "Reject rate (%)", ["defects"]), O("minor", "minor stops / وردية", "Minor stops per shift", ["minor_stops"]), O("energy", "كهربا (kWh)", "Electricity (kWh)", ["energy_waste"]),
 O("air", "هوا مضغوط (Nm3/min)", "Compressed air (Nm3/min)", ["utility_air"]), O("water", "مية (m3)", "Water (m3)", ["utility_water"]), O("walk", "مشي (m/وردية)", "Walking (m/shift)", ["motion"]), O("ergo", "درجة الـergonomic risk", "Ergonomic risk score", ["ergonomics"]),
 O("search", "وقت الدور (min)", "Search time (min)", ["motion", "waiting"]), O("cycle", "الـcycle time (s)", "Cycle time (s)", ["speed_loss"])] },
 kz_bval: { ar: "القيمة قبل", en: "Value before", type: "number" },
 kz_target: { ar: "الـtarget", en: "Target value", type: "number" },
 kz_idea: { ar: "الفكرة: هتغير إيه وإزاي؟", en: "Idea: what will you change and how?", hint: B("لو التغيير في ماكينة أو process تحت GMP لازم change control", "A change to GMP equipment or process needs change control"), type: "text", other: true },
 kz_std: { ar: "هتثبت التحسين إزاي؟", en: "How will the gain be standardised?", type: "multi", other: true,
 options: [O("sop", "تعديل SOP", "SOP update", ["procedure_gap"]), O("opl", "الـOPL", "OPL"), O("pm", "الـPM checklist", "PM checklist", ["after_pm"]), O("training", "تدريب", "Training", ["training_gap"]), O("visual", "الـvisual control", "Visual control"), O("cil", "الـCIL / AM standard", "CIL / AM standard", ["lubrication"])] },
 kz_horiz: { ar: "هيتطبق على ماكينات شبهها؟", en: "Apply on similar machines?", type: "single",
 options: [O("yes", "أيوه (اكتب فين)", "Yes (write where)"), O("later", "بعدين بعد ما نتأكد", "Later, after confirming"), O("no", "لأ", "No")], other: true }
 };

 /* ---------------- triage ---------------- */
 var triage = [
 { id: "tr_kind", ar: "دي مشكلة حصلت ولا فكرة تحسين؟", en: "Is this a problem that happened or an improvement idea?", type: "single",
 options: [O("problem", "مشكلة حصلت (عطل، deviation، حادثة)", "A problem happened (failure, deviation, incident)"), O("improve", "فكرة تحسين (مفيش عطل، فيه loss)", "Improvement idea (no failure, a loss to reduce)")] },
 { id: "tr_size", ar: "حجم الأثر قد إيه؟", en: "How big is the impact?", type: "single",
 options: [O("small", "صغير (أقل من ساعة أو 5,000 جنيه)", "Small (< 1 h or < 5,000 EGP)"), O("medium", "متوسط (1-4 ساعات أو 5-20 ألف)", "Medium (1-4 h or 5-20k EGP)"), O("big", "كبير (أكتر من 4 ساعات أو 20 ألف)", "Big (> 4 h or > 20k EGP)")] },
 { id: "tr_rep", ar: "اتكررت كام مرة آخر 3 شهور؟", en: "How often in the last 3 months?", type: "single",
 options: [O("first", "أول مرة", "First time"), O("r2_3", "2-3 مرات", "2-3 times"), O("r4plus", "4 أو أكتر", "4 or more")] },
 { id: "tr_known", ar: "السبب معروف؟", en: "Is the cause known?", type: "single",
 options: [O("confirmed", "معروف ومتأكد", "Known and confirmed"), O("suspected", "شاكك", "Suspected"), O("unknown", "مش معروف", "Unknown")] },
 { id: "tr_crit", ar: "فيه أثر على السلامة أو GMP أو المنتج؟", en: "Any safety, GMP or product impact?", type: "single",
 options: [O("none", "لأ", "No"), O("gmp", "GMP / المنتج", "GMP / product"), O("safety", "سلامة (إصابة أو near miss)", "Safety (injury or near miss)")] }
 ];

 /* ---------------- tools ---------------- */
 var tools = {
 "3C": { ar: "بطاقة 3C", en: "3C card",
 when: B("مشكلة صغيرة أول مرة، السبب واضح أو بيتأكد بسرعة، أثر أقل من 4 ساعات، مفيش خطر سلامة أو GMP مفتوح.", "Small, first-time problem; cause clear or quick to confirm; under 4 h loss; no open safety or GMP risk."),
 notWhen: B("لو اتكررت 4 مرات أو أكتر، أو السبب مش معروف بعد أول فحص، أو فيه أثر على المنتج أو السلامة، أو خسارة كبيرة: استخدم A3.", "Not for 4+ repeats, cause still unknown after first checks, product or safety impact, or big loss: use A3."),
 time: B("15-30 دقيقة، ويتقفل في نفس الوردية أو الأسبوع.", "15-30 min; closed within the shift or week.") },
 "A3": { ar: "ورقة A3", en: "A3",
 when: B("مشكلة بتتكرر، أو كبيرة (أكتر من 4 ساعات أو 20 ألف جنيه)، أو سببها مش معروف، أو فيها GMP/سلامة، أو محتاجة أكتر من قسم.", "Recurring or big problem (>4 h or >20k EGP), unknown cause, GMP / safety impact, or cross-functional."),
 notWhen: B("مش لمشكلة بسيطة سببها واضح (3C)، ولا لفكرة تحسين من غير مشكلة (Kaizen).", "Not for a simple problem with a clear cause (3C) or an improvement idea with no failure (Kaizen)."),
 time: B("2-6 أسابيع، فريق 3-6 أفراد، review أسبوعي، و follow-up 4-8 أسابيع.", "2-6 weeks, team of 3-6, weekly review, 4-8 weeks follow-up.") },
 "Kaizen": { ar: "Kaizen (تحسين مستمر)", en: "Kaizen",
 when: B("مفيش عطل لكن فيه loss واضح ممكن يقل: changeover، طاقة، حركة، minor stops، ergonomics. ولازم before/after بالأرقام.", "No failure but a clear loss to cut: changeover, energy, motion, minor stops, ergonomics. Needs before / after numbers."),
 notWhen: B("مش لعطل محتاج root cause (3C/A3). تغيير في ماكينة أو process تحت GMP لازم يعدي على change control.", "Not for a failure needing root cause (3C / A3). Changes to GMP equipment or process go through change control."),
 time: B("Quick Kaizen 1-5 أيام. Kaizen event ورشة 3-5 أيام. تأكيد النتيجة بعد 4 أسابيع.", "Quick Kaizen 1-5 days. Kaizen event 3-5 day workshop. Confirm results after 4 weeks.") }
 };

 /* ---------------- flows ---------------- */
 var flows = {
 "3C": {
 "Breakdown Fixed": ["sym", "std", "chg", "fix", "part", "dur", "rep", "known"],
 "Changeover": ["sym", "std", "co_min", "fix", "dur", "rep", "known"],
 "GMP / Quality": ["sym", "std", "det", "gmp_imp", "fix", "qa_note", "rep", "known"],
 "Safety": ["sym", "std", "loto", "fix", "saf_rep", "rep", "known"],
 "Energy & Utilities": ["sym", "std", "det", "fix", "cost", "rep", "known"],
 "Spare Parts Needed": ["sym", "std", "sp_days", "fix", "dur", "rep", "known"],
 "Warehouse Issue": ["sym", "std", "det", "fix", "dur", "rep", "known"],
 "default": ["sym", "std", "act", "fix", "dur", "rep", "known"]
 },
 "A3": {
 "Breakdown Fixed": ["sym", "std", "act", "chg", "rep", "dur", "cost", "checked", "known", "impact6", "who", "kz_horiz"],
 "Changeover": ["sym", "std", "co_min", "chg", "rep", "dur", "checked", "known", "impact6", "who", "kz_horiz"],
 "GMP / Quality": ["sym", "std", "act", "det", "gmp_imp", "qa_note", "rep", "checked", "known", "impact6", "who", "kz_horiz"],
 "Safety": ["sym", "std", "act", "loto", "det", "saf_rep", "rep", "checked", "known", "who", "kz_horiz"],
 "Energy & Utilities": ["sym", "std", "act", "det", "rep", "cost", "checked", "known", "impact6", "who", "kz_horiz"],
 "Spare Parts Needed": ["sym", "std", "sp_days", "dur", "cost", "rep", "checked", "known", "impact6", "who"],
 "Warehouse Issue": ["sym", "std", "act", "det", "rep", "dur", "checked", "known", "who", "kz_horiz"],
 "default": ["sym", "std", "act", "chg", "det", "rep", "dur", "cost", "checked", "known", "who"]
 },
 "Kaizen": { "default": ["kz_kind", "kz_loss", "kz_metric", "kz_before", "kz_bval", "kz_target", "kz_idea", "impact6", "kz_std", "kz_horiz"] }
 };

 /* ---------------- coaching rules ---------------- */
 var R = function (id, sev, when, ar, en, fixAr, fixEn, action) { return { id: id, sev: sev, when: when, ar: ar, en: en, fix: B(fixAr, fixEn), action: action || null }; };
 var rules = [
 R("r_rep_3c", "high", [{ tool: "3C" }, { q: "rep", in: ["r4plus"] }],
  "اتكررت 4 مرات أو أكتر: الـ3C عالج العرض والـroot cause لسه موجود.", "Repeated 4+ times: the 3C treated the symptom; the root cause is still there.",
  "حوّلها A3: 5 Whys و fishbone وتحقق من السبب.", "Move to A3: 5 Whys, fishbone, verify the cause.", "switch_A3"),
 R("r_dur_3c", "med", [{ tool: "3C" }, { q: "dur", gte: 4 }],
  "وقف 4 ساعات أو أكتر أكبر من 3C.", "4 h or more downtime is too big for a 3C.",
  "اعمل A3 بفريق وتابع الـMTBF/MTTR.", "Open an A3 with a team; track MTBF / MTTR.", "switch_A3"),
 R("r_cost_3c", "med", [{ tool: "3C" }, { q: "cost", gte: 20000 }],
  "خسارة 20 ألف جنيه أو أكتر محتاجة تحليل أعمق.", "A loss of 20k EGP or more needs deeper analysis.",
  "حوّلها A3 واحسب الـbenefit للحل.", "Move to A3 and calculate the benefit of the fix.", "switch_A3"),
 R("r_gmp_3c", "high", [{ tool: "3C" }, { cat: "GMP / Quality" }, { q: "gmp_imp", in: ["batch_risk", "released", "unknown"] }],
  "فيه أثر محتمل على المنتج: محتاج investigation موثق مش 3C.", "Possible product impact needs a documented investigation, not a 3C.",
  "A3 مربوط بالـdeviation مع QA و product impact assessment.", "A3 linked to the deviation with QA, plus product impact assessment.", "switch_A3"),
 R("r_no_std", "med", [{ empty: "std" }],
  "من غير standard مفيش gap واضح.", "Without a standard there is no clear gap.",
  "اكتب المفروض يكون إيه بالرقم. لو مفيش، أول حل هو إنك تعمل standard.", "State the expected value. If none exists, the first fix is to write one.", null),
 R("r_no_numbers", "med", [{ noNumbers: true }],
  "مفيش أرقام: مش هنعرف حجم المشكلة ولا لو الحل نجح.", "No numbers: we cannot size the problem or prove the fix.",
  "زوّد مدة الوقف أو التكلفة أو القيمة الفعلية مقابل الـstandard.", "Add downtime, cost or the actual value vs the standard.", null),
 R("r_person", "high", [{ personCause: true }],
  "السبب على شخص. الغلط بيحصل لما النظام يسمح بيه، واللوم بيخبي المشاكل.", "The cause blames a person. Errors happen when the system allows them; blame hides problems.",
  "اسأل: ليه النظام سمح بكده؟ standard، تدريب، poka-yoke، تصميم؟", "Ask why the system allowed it: standard, training system, poka-yoke, design?", null),
 R("r_weak_cm", "high", [{ weakCm: true }],
  "كل الحلول تدريب أو فحص أو مؤقتة: أضعف حلول ومش بتمنع التكرار.", "All fixes are training, inspection or temporary: the weakest kind; repeats will come.",
  "زوّد حل أقوى: eliminate، design، poka-yoke، PM task، standard.", "Add a stronger fix: eliminate, design, poka-yoke, PM task or standard.", null),
 R("r_safety_hoc", "high", [{ cat: "Safety" }, { weakCm: true }],
  "السلامة بتمشي بالـhierarchy of controls. التدريب والـPPE آخر خط دفاع.", "Safety follows the hierarchy of controls. Training and PPE are the last line.",
  "eliminate ثم substitute ثم engineering (guard، interlock) ثم administrative ثم PPE.", "Eliminate, substitute, engineering (guard, interlock), then admin, then PPE.", null),
 R("r_loto", "high", [{ q: "loto", in: ["not_done", "partial"] }],
  "التدخل من غير LOTO كامل ممكن يعمل إصابة خطيرة.", "Work without full LOTO can cause serious injury.",
  "اعزل كل مصادر الطاقة (كهربا، هوا، stored energy) واعمل LOTO sheet للماكينة.", "Isolate all energy (electrical, air, stored) and make a machine LOTO sheet.", null),
 R("r_nearmiss", "med", [{ cat: "Safety" }, { q: "saf_rep", in: ["not_yet"] }],
  "الـnear miss اللي مش متسجل بيرجع إصابة.", "An unreported near miss comes back as an injury.",
  "سجّله في نظام الـHSE النهارده.", "Log it in the HSE system today.", null),
 R("r_gmp_qa", "high", [{ cat: "GMP / Quality" }, { q: "qa_note", in: ["no"] }],
  "أي حدث GMP لازم QA يعرفه فورا. التأخير نفسه finding.", "Any GMP event must reach QA at once; delay is itself a finding.",
  "بلّغ QA وافتح deviation حسب الـSOP قبل ما تكمل.", "Notify QA and raise a deviation per SOP before going on.", null),
 R("r_gmp_impact", "high", [{ cat: "GMP / Quality" }, { q: "gmp_imp", in: ["unknown"] }],
  "أثر المنتج مش معروف، وممكن باتشات تانية تكون اتأثرت.", "Product impact unknown; other batches may be affected.",
  "اعمل product impact assessment مع QA من آخر حالة سليمة.", "Do a product impact assessment with QA back to the last good state.", null),
 R("r_no_cont", "med", [{ noContainment: true }, { q: "known", in: ["confirmed", "suspected", "unknown"] }],
  "مفيش containment: المشكلة ممكن تكمل لحد الحل الدائم.", "No containment: the problem can continue until the permanent fix.",
  "سجّل اللي اتعمل فورا لحماية المنتج والناس والخط.", "Record the immediate action that protects product, people and line.", null),
 R("r_not_verified", "med", [{ tool: "A3" }, { noCheck: true }],
  "السبب مش متأكد. حل على سبب مش مثبت بيضيع وقت وفلوس.", "Cause not verified; fixing an unproven cause wastes time and money.",
  "اعمل الـcheck المقترح وعلّم confirmed قبل الحل.", "Run the suggested check and mark it confirmed before the fix.", null),
 R("r_no_horiz", "low", [{ q: "kz_horiz", in: ["no"] }],
  "نفس الضعف غالبا موجود على ماكينات شبهها.", "The same weakness likely exists on similar machines.",
  "راجع ماكينات نفس الـfamily وطبّق أو سجّل ليه لأ.", "Check the same machine family; apply or record why not.", null),
 R("r_no_kpi", "med", [{ tool: "A3" }, { noKpi: true }],
  "من غير KPI مش هنعرف الحل نجح.", "Without a KPI we cannot prove the fix worked.",
  "اختار KPI واحد وقيسه قبل وبعد 4-8 أسابيع.", "Pick one KPI; measure before and 4-8 weeks after.", null),
 R("r_kz_nodata", "high", [{ tool: "Kaizen" }, { empty: "kz_bval" }],
  "Kaizen من غير قيمة قبل مش هيثبت التحسين.", "A Kaizen without a before value cannot prove improvement.",
  "قيس القيمة الحالية 3-5 مرات قبل التغيير.", "Measure the current value 3-5 times before changing anything.", null),
 R("r_kz_nostd", "med", [{ tool: "Kaizen" }, { empty: "kz_std" }],
  "تحسين من غير standard بيرجع للقديم خلال أسابيع.", "A gain without a standard slides back within weeks.",
  "ثبّته بـSOP أو OPL أو PM checklist أو visual control.", "Lock it in with SOP, OPL, PM checklist or visual control.", null),
 R("r_energy_kz", "low", [{ tool: "3C" }, { cat: "Energy & Utilities" }, { q: "known", in: ["confirmed"] }],
  "هدر طاقة سببه معروف ده فرصة تحسين، والـKaizen بيثبت التوفير.", "Energy waste with a known cause is an improvement; a Kaizen proves the saving.",
  "اعمله Kaizen بقيمة قبل و target و توفير سنوي.", "Run it as a Kaizen with before value, target and yearly saving.", "switch_Kaizen")
 ];

 /* ---------------- Kaizen ---------------- */
 var kaizen = {
 guide: B(
 "الـKaizen تحسين صغير ومستمر بيقلل loss واضح، بالفريق اللي بيشتغل على الماكينة.\nاستخدمه لما مفيش عطل محتاج root cause، لكن فيه هدر: changeover، طاقة، حركة، minor stops، ergonomics.\nQuick Kaizen: أيام، فرد أو اتنين، فكرة بسيطة. Kaizen event: ورشة 3-5 أيام بفريق من كذا قسم على موضوع أكبر.\nامشي بالـPDCA: Plan (قيس before وحدد target)، Do (جرّب)، Check (قيس after)، Act (ثبّت standard وطبّق أفقيا).\nأي تغيير في ماكينة أو process تحت GMP لازم يعدي على change control.",
 "A Kaizen is a small, continuous improvement that cuts a clear loss, done by the team who runs the machine.\nUse it when there is no failure needing root cause but there is waste: changeover, energy, motion, minor stops, ergonomics.\nQuick Kaizen: days, 1-2 people, simple idea. Kaizen event: 3-5 day cross-functional workshop on a bigger topic.\nFollow PDCA: Plan (measure before, set target), Do (trial), Check (measure after), Act (standardise and deploy horizontally).\nAny change to GMP equipment or process goes through change control."),
 types: [
 { id: "quick", ar: "Quick Kaizen: فكرة بسيطة تتنفذ في أيام", en: "Quick Kaizen: simple idea done in days" },
 { id: "event", ar: "Kaizen event: ورشة 3-5 أيام بفريق", en: "Kaizen event: 3-5 day team workshop" },
 { id: "standard", ar: "Standard Kaizen: تحسين الـSOP أو الـPM أو الـCIL", en: "Standard Kaizen: improve the SOP, PM or CIL" }
 ],
 losses: LOSSES,
 examples: [
 { id: "EX-KZ-1", type: "Kaizen", example: true, title: "SMED: blister format changeover 150 to 85 min", title_ar: "SMED: تقليل changeover الـblister من 150 لـ85 دقيقة",
 machine: "CAM M92 blister (L3)", date: "2026-10-05",
 note: "Illustrative example: figures are indicative, not plant records.",
 data: { kz: {
 no: "KZ-2026-014", title: "SMED on CAM M92 (L3) format changeover", area: "Palmier - Line 3 (R123)", machine: "CAM M92 blister (L3)",
 leader: "Maintenance engineer (example)", team: "Maintenance, Production L3, QA IPC, OpEx",
 start: "2026-10-05", end: "2026-10-09", kind: "event",
 loss: ["l_setup", "l_startup", "l_waiting", "l_motion"], impact: ["D", "C", "Q"],
 before: "Format changeover average 150 min (18 per month = 45 h/month): 35 min fetching parts, tools and documents; 45 min cleaning and line clearance; 45 min settings and trial runs; 25 min waiting QA release. About 600 trial blisters rejected per changeover.",
 target: "Changeover 90 min or less; trial rejects 300 blisters or less per changeover.",
 whys: ["35 min of external work (fetching parts, tools, documents) done after the line stops", "No kit per product and no fixed place for format parts; settings found by trial", "Changeover SOP lists steps only, with no internal / external split and no target time", ""],
 root_cause: "No SMED-based changeover standard (internal / external split, format kit, setting sheet, QA pre-alert, target time).",
 improvement: "Video and time study of 3 changeovers; external steps moved before stop with a prep checklist; format kit trolley with shadow board per product; setting sheet with proven values and fixed scale marks on guides; cleaning sequence with photo map of trap points; QA pre-alert 30 min before end. SOP revised through change control.",
 after: "Changeover average 85 min over 4 weeks: prep 5 min, cleaning and line clearance 35 min, settings and trials 30 min, QA release 15 min. Trial rejects about 250 blisters per changeover. Changeover time 25.5 h/month.",
 results: [
 { kpi: "Changeover time", unit: "min", before: "150", after: "85" },
 { kpi: "Changeover hours per month (18 changeovers)", unit: "h/month", before: "45", after: "25.5" },
 { kpi: "Trial rejects per changeover", unit: "blisters", before: "600", after: "250" },
 { kpi: "Time fetching parts and tools", unit: "min", before: "35", after: "5" }
 ],
 benefit_egp: "585000", benefit_h: "234",
 intangible: "Less stress at changeover; same method on all shifts; fewer line clearance findings. EGP value uses an assumed 2,500 EGP per line hour (234 h x 2,500).",
 std: ["sop", "opl", "visual", "training"], std_note: "Changeover SOP rev. with internal / external split and 90 min target; OPL for format kit; shadow board; shift training with sign-off.",
 horizontal: "CAM M92 blister (L5) and CAM MX blister (L2) next; then CAM PMM and CAM HV cartoners.",
 prepared: "Maintenance engineer", checked: "Production supervisor L3", approved: "Maintenance manager" } } },
 { id: "EX-KZ-2", type: "Kaizen", example: true, title: "Compressed air: leaks and idle air cut-off on packaging lines", title_ar: "الهوا المضغوط: تصليح التسريبات وقفل الهوا وقت الوقف في خطوط التعبئة",
 machine: "Compressed Air", date: "2026-09-14",
 note: "Illustrative example: figures are indicative, not plant records.",
 data: { kz: {
 no: "KZ-2026-011", title: "Cut compressed air demand at no production", area: "Utilities - compressed air, Palmier lines 1-5", machine: "Compressed Air",
 leader: "Utilities engineer (example)", team: "Maintenance, Utilities, Production Palmier, Engineering",
 start: "2026-09-14", end: "2026-09-18", kind: "event",
 loss: ["l_energy"], impact: ["C", "CSR"],
 before: "With all packaging lines stopped, air demand 3.2 Nm3/min and compressor load 56%. Ultrasonic survey found 42 leaks (fittings, FRL drains, worn hoses). Lines stay pressurised when stopped.",
 target: "No-production air demand 1.5 Nm3/min or less; open leaks 5 or less.",
 whys: ["Air demand 3.2 Nm3/min with all lines stopped", "42 leaks and lines stay pressurised during stops", "Leaks found only by noise; no survey route, no tag-and-fix rule, no auto air cut-off in design", ""],
 root_cause: "No leak survey route in the PM plan and no automatic air shut-off when a line stops.",
 improvement: "Ultrasonic survey with red tags; 38 leaks fixed in the week (4 need a planned shutdown); quarterly leak route added to SAP PM; solenoid valve closes line air after 10 min stop (via change control); open-pipe blow-off replaced with engineered nozzles.",
 after: "No-production air demand 1.2 Nm3/min, compressor load 21%. Open leaks 4, scheduled for the next planned shutdown.",
 results: [
 { kpi: "Air demand at no production", unit: "Nm3/min", before: "3.2", after: "1.2" },
 { kpi: "Compressor load at no production", unit: "%", before: "56", after: "21" },
 { kpi: "Open leaks", unit: "count", before: "42", after: "4" },
 { kpi: "Electricity saved", unit: "kWh/year", before: "0", after: "115200" }
 ],
 benefit_egp: "230400", benefit_h: "0",
 intangible: "Lower compressor running hours; quieter area; leak culture. Saving: 2.0 Nm3/min x 60 = 120 Nm3/h x 0.12 kWh/Nm3 = 14.4 kWh/h x 8,000 h = 115,200 kWh x assumed 2.0 EGP/kWh.",
 std: ["pm", "opl", "visual"], std_note: "Quarterly ultrasonic leak route in SAP PM; red leak tag OPL; tag board in utilities room.",
 horizontal: "Acacia compression and coating areas; then steam traps on the boiler network.",
 prepared: "Utilities engineer", checked: "Maintenance manager", approved: "Engineering director" } } }
 ]
 };

 window.KB_OPEX = { tools: tools, triage: triage, questions: questions, flows: flows, catSymptoms: catSymptoms,
 causes: causes, cms: cms, kpis: kpis, rules: rules, kaizen: kaizen };
})();

/* review fixes applied on top of the expert files (independent OpEx review, round 1) */
(function(){
const A=window.KB_ENG_A,B=window.KB_ENG_B,O=window.KB_OPEX,b=(ar,en)=>({ar,en});
const CM=Object.assign({},A.cms,B.cms,O.cms),CA=Object.assign({},A.causes,B.causes,O.causes);
const fam=Object.assign({},A.families,B.families);
const sym=(f,id)=>(fam[f]&&fam[f].symptoms||[]).find(s=>s.id===id);
/* 1. honest strength: detect-only devices are inspection, not poka-yoke */
["a_cm_reject_test","b_cm_bmsalarm","a_cm_dp_alarm","b_cm_dpled"].forEach(id=>{if(CM[id])CM[id].kind="inspection"});
/* 2. honest effort: validated-system / design changes need change control, CSV, budget */
["b_cm_recipe","b_cm_isolv","b_cm_master","b_cm_serbuf","a_cm_lube_alarm","b_cm_ocv","a_cm_recipe_lock","b_cm_autorestart","b_cm_sensor","a_cm_sensor_bracket","b_cm_backup","b_cm_zld","b_cm_insul","b_cm_led","o_cm_di_access","o_cm_sap_mrp","o_cm_auto_off","o_cm_press_opt"].forEach(id=>{if(CM[id])CM[id].effort="H"});
for(const m of Object.values(CM)){if((m.kind==="design"||m.kind==="eliminate")&&/change control/i.test(m.en))m.effort="H"}
/* 3. safety: bypass control */
O.cms.o_cm_bypass_permit=Object.assign(b("الـbypass بتصريح بس، المفتاح مع رئيس الوردية، ومتسجل","Bypass only with permit, key held by shift leader, logged"),{kind:"standard",impact:"H",effort:"L",owner:b("السلامة HSE","HSE")});
O.cms.o_cm_interlock_sweep=Object.assign(b("اختبر كل الـinterlocks على الماكينة دي والماكينات الشبهها النهارده","Test every interlock on this machine and the same family today"),{kind:"inspection",impact:"H",effort:"L",owner:b("الصيانة","Maintenance")});
O.causes.o_c_sf_bypass=Object.assign(b("أدوات الـbypass (مفاتيح، jumpers، مغناطيس) مش متحكم فيها","Bypass means (keys, jumpers, magnets) not controlled"),{fish:"methods",tags:["safety_guard","procedure_gap","design_weakness"],
  check:b("دوّر على مغناطيس/jumper/مفتاح احتياطي جنب الماكينة، واختبر الـinterlock وهو مقفول","Look for magnets, jumpers or spare keys near the machine; test the interlock closed"),
  why:[b("الـinterlock اتلغى بمغناطيس أو jumper","Interlock defeated with a magnet or jumper"),b("أدوات الـbypass متاحة لأي حد","Bypass tools freely available"),b("مفيش تصريح bypass ولا interlock ضد العبث","No bypass permit and no tamper-proof interlock")],
  cont:["o_cm_isolate","o_cm_interlock_sweep"],cm:["o_cm_interlock","o_cm_bypass_permit"]});
(O.catSymptoms.Safety||[]).forEach(s=>{if(s.id==="o_sf_act"||s.id==="o_sf_cond")s.causes=["o_c_sf_bypass"].concat(s.causes.filter(x=>x!=="o_c_sf_bypass"))});
/* lead safety labels with Arabic */
const sfar={o_sf_cond:"حالة غير آمنة (guard ناقص، panel مفتوح، أرض مزحلقة)",o_sf_act:"تصرف غير آمن (bypass، من غير PPE، shortcut)",o_sf_nm:"كان هيحصل حادثة (near miss) من غير إصابة",o_sf_ergo:"إجهاد في الشغل (شيل تقيل، وضع غلط)",o_sf_inj:"إصابة بسيطة أو إسعاف أولي"};
(O.catSymptoms.Safety||[]).forEach(s=>{if(sfar[s.id])s.ar=sfar[s.id]});
/* ergonomic containment is not LOTO */
O.cms.o_cm_lift_stop=Object.assign(b("وقف الشيلة دي؛ شيل باتنين أو بأداة لحد الحل","Stop the lift task; use two-person lift or an aid until fixed"),{kind:"temporary",impact:"H",effort:"L",owner:b("الإنتاج","Production")});
if(CA.o_c_sf_ergo)CA.o_c_sf_ergo.cont=["o_cm_lift_stop"];
/* 4. serialization content */
B.cms.b_cm_ser_recon=Object.assign(b("reconciliation للـserials: decommission للأكواد المرفوضة في الـL3 ومراجعة QA","Reconcile serials: decommission rejected codes in L3, QA review"),{kind:"temporary",impact:"H",effort:"L",owner:b("الجودة QA","QA")});
B.cms.b_cm_print_window=Object.assign(b("print window من غير varnish في الـartwork والـspec","Varnish-free print window in artwork and material spec"),{kind:"design",impact:"H",effort:"H",owner:b("التعبئة / الـArtwork","Packaging / Artwork")});
B.cms.b_cm_l3_check=Object.assign(b("تحميل الأوردر من الـL3 أوتوماتيك وتأكيد شخص تاني عند البداية","Automatic L3 order download plus second-person check at order start"),{kind:"poka_yoke",impact:"H",effort:"H",owner:b("الأتمتة (Automation)","Automation")});
B.causes.b_c_ct_varnish=Object.assign(b("الكود بيتطبع على varnish أو برا الـprint area","Code printed on varnish or outside the print area"),{fish:"materials",tags:["new_material_batch","supplier","defects"],
  check:b("قارن مكان الطباعة بالـartwork والـspec واعمل rub test","Compare print area with artwork and spec; do a rub test"),
  why:[b("الحبر مش بيمسك على الـvarnish فالـgrade بيقع","Ink does not key on varnish, code grade drops"),b("الـartwork مفيهوش print window من غير varnish","Artwork has no varnish-free print window"),b("مكان الطباعة مش مكتوب في spec مادة التعبئة","Print area not defined in the packaging material spec")],
  cont:["b_cm_qa","b_cm_ser_recon"],cm:["b_cm_print_window"]});
B.causes.b_c_ct_masterdata=Object.assign(b("بيانات الباتش/المنتج مختلفة بين الـL3 والخط","Batch/product data mismatch between L3 server and line"),{fish:"methods",tags:["plc_software","documentation","procedure_gap"],
  check:b("قارن GTIN والباتش والـexpiry على الـHMI بأوردر الـL3","Compare GTIN, batch and expiry on HMI with the L3 order"),
  why:[b("الأوردر اتدخل بإيد على الخط","Order entered manually on the line"),b("مفيش check أوتوماتيك لتحميل الـL3","No automatic L3 download check"),b("مفيش تأكيد من شخص تاني عند بداية الأوردر","No second-person verification at order start")],
  cont:["b_cm_qa","b_cm_ser_recon"],cm:["b_cm_l3_check"]});
const ser=sym("carton","b_carton_serial");if(ser)ser.causes=ser.causes.concat(["b_c_ct_varnish","b_c_ct_masterdata"].filter(x=>!ser.causes.includes(x)));
if(CA.b_c_ct_serial&&!CA.b_c_ct_serial.cont.includes("b_cm_ser_recon"))CA.b_c_ct_serial.cont.push("b_cm_ser_recon");
/* 5. blister leak: sealing heater and the leak tester itself */
B.cms.b_cm_seal_plate_life=Object.assign(b("تغيير الـsealing plate بعدد الضربات وضبط الـparallelism بـgauge وتسجيله","Seal plate replacement by stroke count; parallelism set with gauge and recorded"),{kind:"pm",impact:"H",effort:"H",owner:b("الصيانة","Maintenance")});
B.cms.b_cm_leaktest_check=Object.assign(b("تحقق يومي لجهاز الـleak test بعينة سليمة وعينة مخرومة","Daily leak tester check with a good and a pierced reference blister"),{kind:"inspection",impact:"H",effort:"L",owner:b("الـQC","QC")});
B.causes.b_c_bl_leaktest=Object.assign(b("جهاز الـleak test: الـvacuum أو الـdwell أو seal الـchamber مش مظبوط","Leak tester vacuum, dwell or chamber seal out of spec"),{fish:"measurement",tags:["calibration","utility_vacuum","defects"],
  check:b("شغّل الجهاز بعينة سليمة وعينة مخرومة معروفة","Run the tester with a known-good and a pierced reference blister"),
  why:[b("الجهاز بيرفض عينات سليمة أو بيعدّي مخرومة","Tester rejects good or passes pierced samples"),b("الـvacuum/dwell أو seal الـchamber اتغير","Vacuum, dwell or chamber seal drifted"),b("مفيش check يومي بعينات مرجعية للجهاز","No daily reference-sample check of the tester")],
  cont:["b_cm_qa"],cm:["b_cm_leaktest_check"]});
const lk=sym("blister","b_blister_leak");if(lk){const c=lk.causes.filter(x=>x!=="b_c_heater_ctrl"&&x!=="b_c_bl_leaktest");c.splice(1,0,"b_c_heater_ctrl");c.push("b_c_bl_leaktest");lk.causes=c}
if(CA.b_c_bl_seal_plate&&!CA.b_c_bl_seal_plate.cm.includes("b_cm_seal_plate_life"))CA.b_c_bl_seal_plate.cm.unshift("b_cm_seal_plate_life");
/* second permanent actions for new causes */
A.cms.a_cm_spray_verify=Object.assign(b("قياس معدل الرش بالوزن في بداية كل باتش ومكتوب في الـbatch record","Gravimetric spray-rate check at each batch start, recorded in batch record"),{kind:"standard",impact:"H",effort:"L",owner:b("الإنتاج","Production")});
B.cms.b_cm_print_spec=Object.assign(b("مكان الطباعة والـwindow في spec المورد وفحص الاستلام","Print area and varnish-free window in supplier spec and incoming check"),{kind:"standard",impact:"H",effort:"L",owner:b("الجودة QA","QA")});
B.cms.b_cm_order_check=Object.assign(b("checklist بداية الأوردر: GTIN والباتش والـexpiry يتراجعوا مع الـL3 بشخص تاني","Order-start checklist: GTIN, batch, expiry verified against L3 by a second person"),{kind:"standard",impact:"H",effort:"L",owner:b("الإنتاج","Production")});
B.cms.b_cm_leaktest_cal=Object.assign(b("جهاز الـleak test في برنامج المعايرة (vacuum gauge وتايمر الـdwell)","Leak tester in the calibration programme (vacuum gauge, dwell timer)"),{kind:"pm",impact:"H",effort:"L",owner:b("المعايرة","Calibration")});
if(CA.a_c_ct_flow&&CA.a_c_ct_flow.cm.length<2)CA.a_c_ct_flow.cm.push("a_cm_spray_verify");
B.causes.b_c_ct_varnish.cm.push("b_cm_print_spec");B.causes.b_c_ct_masterdata.cm.push("b_cm_order_check");B.causes.b_c_bl_leaktest.cm.push("b_cm_leaktest_cal");
/* 6. why-chain order (FE55 segment) */
if(CA.a_c_pr_segment)CA.a_c_pr_segment.why=[b("الملء والضغط مختلفين من segment للتاني","Fill and compression differ between die segments"),b("الـsegment اتحرك وقت التشغيل لأنه ماتقفلش بالـtorque","A segment moved during the run; it was not locked to torque"),b("الـchangeover مفيهوش قيمة torque ولا check للقفل","Changeover has no torque value or lock check for segments"),b("مفيش standard للـFE55 segments بقيم الـOEM في الـchangeover checklist","No FE55 segment standard with OEM torque in the changeover checklist")];
/* 7. countermeasures attached to the wrong cause */
B.cms.b_cm_air_sp=Object.assign(b("standard للـsetpoints والـpressure band ومسؤول مراجعة","Compressor setpoint standard with pressure band and review owner"),{kind:"standard",impact:"H",effort:"L",owner:b("المرافق","Utilities")});
B.cms.b_cm_net_cap=Object.assign(b("مراجعة سعة الشبكة في الـchange control لأي حمل جديد","Network capacity check in change control for new loads"),{kind:"standard",impact:"H",effort:"L",owner:b("الهندسة","Engineering")});
A.cms.a_cm_damper_loop=Object.assign(b("فحص stroke الـdamper ولوب ضغط الـpan في الـPM","Damper stroke and pan pressure loop check in PM"),{kind:"pm",impact:"H",effort:"L",owner:b("الصيانة","Maintenance")});
if(CA.b_c_ar_control)CA.b_c_ar_control.cm=CA.b_c_ar_control.cm.map(x=>x==="b_cm_setting"?"b_cm_air_sp":x);
if(CA.b_c_ar_pipe)CA.b_c_ar_pipe.cm=CA.b_c_ar_pipe.cm.map(x=>x==="b_cm_change"?"b_cm_net_cap":x);
if(CA.a_c_ct_damper)CA.a_c_ct_damper.cm=CA.a_c_ct_damper.cm.map(x=>x==="a_cm_vibration"?"a_cm_damper_loop":x);
if(CA.a_c_ct_flow)CA.a_c_ct_flow.cm=[...new Set(CA.a_c_ct_flow.cm.map(x=>x==="a_cm_recipe_lock"?"a_cm_spray_verify":x))];
/* 8. questions and flows */
const Q=O.questions;
Q.std.ar="أنهي standard، وقيمته كام؟ (اختار المرجع واكتب أو قول الرقم)";Q.std.en="Which standard, and what value? (tap the reference, then type or say the value)";
Q.kz_gain={ar:"التوفير المتوقع في السنة؟",en:"Expected yearly saving?",type:"number",unit:"EGP",quick:[10000,50000,100000,250000,500000],other:false};
const km=(Q.kz_metric.options||[]).find(o=>o.id==="search");if(km)km.ar="وقت الدوَران على الحاجة (min)";
const F=O.flows;
for(const t of["3C","A3"])for(const c of Object.keys(F[t]))F[t][c]=F[t][c].filter(x=>x!=="known");
for(const t of["3C","A3"]){const g=F[t]["GMP / Quality"];for(const x of["dur","cost"])if(!g.includes(x))g.splice(Math.max(0,g.indexOf("rep")+1),0,x)}
const kf=F.Kaizen.default;if(!kf.includes("who"))kf.push("who");if(!kf.includes("kz_gain"))kf.splice(kf.indexOf("kz_target")+1,0,"kz_gain");
/* 9. rules */
const R=O.rules;
const rc=R.find(r=>r.id==="r_no_cont");if(rc)rc.when=[{noContainment:true},{notTool:"Kaizen"}];
const nn=R.find(r=>r.id==="r_no_numbers");if(nn)nn.when=[{noNumbers:true},{notCat:"Safety"}];
const ns=R.find(r=>r.id==="r_no_std");if(ns)ns.when=[{empty:"std"},{notTool:"Kaizen"}];
R.push({id:"r_safety_3c",sev:"high",when:[{tool:"3C"},{cat:"Safety"},{q:"sym",in:["o_sf_act","o_sf_loto","o_sf_inj","o_sf_cond"]}],action:"switch_A3",
  ar:"guard متلغي أو LOTO ناقص أو إصابة ده حدث خطير محتمل، والـ3C مش كفاية.",en:"A defeated guard, missing LOTO or an injury is a high-potential event; a 3C is not enough.",
  fix:b("افتح A3 مع الـHSE، واختبر كل الـinterlocks على الماكينة دي والماكينات الشبهها النهارده.","Open an A3 with HSE; test every interlock on this machine and the same family today.")});
R.push({id:"r_q_product",sev:"high",when:[{symTag:"defects"},{noProductCont:true}],
  ar:"فيه عيب جودة اتعمل. المنتج اللي اتعمل من آخر check سليم ممكن يكون متأثر.",en:"A quality defect was made. Product made since the last good check may be affected.",
  fix:b("اعزل المنتج لحد آخر IPC سليم وبلّغ الـQA قبل ما تشغّل تاني (علّم الاحتواء ده تحت).","Segregate product back to the last good IPC and inform QA before restart (tick that containment below).")});
R.push({id:"r_std_value",sev:"med",when:[{stdNoValue:true},{notCat:"Safety"},{notCat:"Warehouse Issue"}],
  ar:"الـstandard من غير رقم، فمفيش gap يتقاس.",en:"The standard has no value, so there is no measurable gap.",
  fix:b("اكتب القيمة المطلوبة في خانة التفاصيل، مثلا وزن 250 mg ±3% أو changeover 90 دقيقة.","Type the target value in the details box, e.g. weight 250 mg ±3% or changeover 90 min.")});
R.push({id:"r_no_evidence",sev:"med",when:[{noEvidence:true}],
  ar:"أكدت سبب من غير دليل. المدير مش هيعرف إن حد راح شاف.",en:"A cause is marked confirmed without evidence. A reviewer cannot tell anyone went to see.",
  fix:b("اكتب الدليل جنب السبب: اتقاس كام، اتشاف إيه، trend، أو swap test.","Add the evidence next to the cause: what was measured, seen, trended or swap-tested.")});
})();

