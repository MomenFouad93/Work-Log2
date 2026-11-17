"use strict";
/* ===== Language switch: Arabic (Egyptian) <-> English =====
   The app is written in Arabic. In English mode every UI string is translated at the DOM level,
   so dynamic screens (wizard, lists, toasts) are covered too. User-typed content is never translated. */
(function(){
const KEY="wl.lang";
const D={
/* header / nav / tabs */
"شغلي":"My Work Log","اقتراحاتي":"My suggestions","شغل زيادة":"Extra work","أرقام وتوفير":"Numbers and savings","عطل واتصلح":"Fault fixed","صندوق الاقتراحات":"Suggestion box","تسجيل":"Log","سجلي":"My log","تحليل":"Analysis","ملخص":"Summary","إعدادات":"Settings",
"شغلي | My Work Log":"My Work Log","أهلاً بيك":"Welcome","سجّل شغلك بصوتك. كل حاجة محفوظة على موبايلك إنت بس.":"Log your work by voice. Everything stays on your phone only.",
"اسمك":"Your name","الاسم":"Name","الوظيفة":"Role","ابدأ":"Start",
/* add tab */
"مهم: اضغط زر المشاركة في Safari ثم":"Important: tap Share in Safari, then","وافتح التطبيق من الأيقونة":"and open the app from the icon","قبل ما تسجل أي حاجة":"before you log anything",
". اللي بيتسجل في Safari بيبقى منفصل عن اللي في الأيقونة، وSafari بيمسحه لو ما فتحتش الصفحة أسبوع.":". Data logged in Safari is separate from the icon's data, and Safari erases it if you do not open the page for a week.",
"مفيش نسخة احتياطية من شغلك من فترة. روح":"No backup of your work for a while. Go to","واضغط":"and tap","ابعت ملف Excel":"Send my Excel file",
"اختار النوع الأول (اختياري)":"Pick the type first (optional)","احكي اللي عملته":"Tell what you did",
"أعد المحاولة بنفس التسجيل":"Retry with the same recording","اضغط وتكلم، أو اكتب تحت":"Tap and speak, or type below",
"اتكلم براحتك وكمّل، الميكروفون مش هيفصل. لما تضغط تاني بيرتّب الخانات لوحده. قول الإنجليزي زي ما هو.":"Speak freely and keep going, the mic will not cut off. Tap again and the fields fill automatically. Say English words as they are.",
"لغة الكلام":"Speech language","عربي (مصر)":"Arabic (Egypt)","اكتب بإيدك":"Type manually",
"مثال: امبارح صلحت عطل السخان في ماكينة M92 خط 3 وكانت واقفة ساعتين، وفرت 5000 جنيه":"Example: Yesterday I fixed the heater fault on M92 line 3, it was down 2 hours, saved 5000 EGP",
"رتّب الكلام في الخانات":"Fill the fields from my words",
"مرجع الكلام: إزاي أقول؟ (اضغط على أي جملة تتحط في الخانة)":"Speech reference: how do I say it? (tap a phrase to insert it)",
"جمل جاهزة تقلدها:":"Ready phrases to copy:","كلمات بتحدد نوع الشغل:":"Words that set the work type:","أسماء الماكينات اللي بيفهمها:":"Machine names it understands:",
"نصايح: قول رقم الماكينة أو الخط (فيته 3، M92 خط 5). قول المبلغ والساعات (وفرت 5000 جنيه، واقفة ساعتين). تقدر تقول \"امبارح\" أو التاريخ 12/11. لو الماكينة ما اتعرفتش هيقترح لك أقرب أسماء.":"Tips: say the machine number or line (Fette 3, M92 line 5). Say the amount and hours (saved 5000 EGP, down 2 hours). You can say \"yesterday\" or a date like 12/11. If the machine is not recognised it suggests the closest names.",
"راجع وسجّل":"Review and save","تسجيل يدوي":"Manual entry","التاريخ":"Date","الحالة":"Status","تم (Done)":"Done","جاري (Ongoing)":"Ongoing","مخطط (Planned)":"Planned",
"الماكينة":"Machine","نوع الشغل":"Work type","قطع الغيار (اسم / كود / كمية)":"Spare parts (name / code / qty)","العنوان":"Title","اللي اتعمل":"What was done",
"النتيجة / الأثر":"Result / impact","مثال: الخط رجع للسرعة العادية":"Example: line back to normal speed","ساعات توقف اتوفرت":"Downtime hours saved","التوفير (جنيه)":"Savings (EGP)",
"الدليل (رقم WO / رابط / وصف صورة)":"Evidence (WO no. / link / photo note)","حفظ":"Save","إلغاء":"Cancel","اختار الماكينة":"Choose machine","يمكن تقصد:":"Did you mean:",
"إنجاز":"Achievement","تغيير المنتج":"Changeover","إصلاح عطل":"Breakdown fixed","مهندس":"Engineer","فني":"Technician","مشرف":"Supervisor","المرافق":"Utilities","الموقع كله":"Site-wide","الدليل":"Evidence","صرف من المخزن":"Warehouse issue","محتاج قطع غيار":"Spare parts needed","استخدمت قطع غيار":"Spare parts used","عطل":"Breakdown",
"بسمعك... كمّل كلام براحتك، واضغط تاني لما تخلص":"Listening... keep talking, tap again when done","بسجل صوتك... اضغط تاني لما تخلص":"Recording... tap again when done","بحوّل الصوت لنص...":"Converting voice to text...","بفهم كلامك...":"Understanding your words...",
"تسجيل صوتي":"Voice recording",
/* log / summary */
"بحث: ماكينة، عنوان، كلمة...":"Search: machine, title, word...","كل الشهور":"All months","كل الأنواع":"All types","لسه مفيش شغل مسجّل هنا":"No work logged here yet",
"تحليل":"Analysis","الشهر ده":"This month","الشهر اللي فات":"Last month","السنة دي":"This year","الكل":"All","شغلانات":"Entries","زيادة عن مهامي":"Beyond my scope","توفير (جنيه)":"Savings (EGP)",
"حسب النوع":"By type","حسب الماكينة":"By machine","مفيش بيانات":"No data","تقرير للطباعة / PDF":"Printable report / PDF","رسوم بيانية وعرض تقديمي لشغلي":"Charts and presentation of my work",
"طباعة / حفظ PDF":"Print / save PDF","إغلاق":"Close","تعديل":"Edit","حذف":"Delete","مسح":"Remove",
"النوع":"Type","النتيجة":"Result","وقت توقف اتوفر":"Downtime saved","التوفير":"Savings","دليل":"Evidence","المصدر":"Source","الكلام الأصلي":"Original words",
"حلل المشكلة (A3 / 3C)":"Analyse the problem (A3 / 3C)",
/* settings */
"بياناتي":"My details","حفظ البيانات":"Save details","ملف Excel بتاعي":"My Excel file",
"بيفتح قايمة المشاركة: اختار واتساب أو تليجرام أو البريد الإلكتروني أو Files. الملف بيتعمل من اللي على موبايلك وقت الضغط.":"Opens the share sheet: choose WhatsApp, Telegram, email or Files. The file is built from what is on your phone when you tap.",
"نسخة احتياطية":"Backup","حفظ نسخة":"Save a copy","استرجاع":"Restore","استخدمها لو غيرت الموبايل أو مسحت بيانات المتصفح.":"Use it if you change phone or clear browser data.",
"ماكينة جديدة":"New machine","المبنى":"Building","أسماء بتتقال شفوي (بينهم فاصلة)":"Names said aloud (comma separated)","مثال: فيته 4, fette 4":"Example: fette 4, fette4","إضافة":"Add",
"فهم أدق لما النت يكون شغال (اختياري)":"More accurate understanding when online (optional)",
"لو فعّلته، الصوت والنص بيتبعتوا لخدمة OpenAI (خارج أنظمة Servier) وبيتحولوا لنص وخانات بدقة أعلى بكتير في الكلام المخلوط. اسأل الـIT أو مديرك قبل ما تفعّله على شغل حقيقي. المفتاح بيتحفظ على موبايلك بس، وما بيدخلش النسخة الاحتياطية ولا ملف Excel. من غير نت أو من غير تفعيل، التطبيق بيشتغل بالقواعد العادية.":"If enabled, your voice and text are sent to OpenAI (outside Servier systems) and converted to text and fields with much higher accuracy for mixed speech. Ask IT or your manager before using it on real work. The key stays on your phone only and never enters the backup or the Excel file. Offline or disabled, the app works with its normal rules.",
"فعّل وضع الإنترنت":"Enable online mode","مفتاح OpenAI API":"OpenAI API key","الخصوصية":"Privacy",
"كل اللي بتسجله محفوظ على موبايلك بس. التطبيق مالوش خادم (server) ومحدش يقدر يشوف شغلك غير لما إنت تبعت الملف بنفسك. في الوضع العادي الصوت بيتحول لنص عن طريق خدمة موبايلك (Apple أو Google)، فما تقولش أرقام تشغيلات أو أسماء منتجات أو أي معلومة سرية. ملف Excel بيحتوي كمان على نص كلامك الأصلي، فراجعه قبل ما تبعته.":"Everything you log is stored on your phone only. The app has no server and nobody can see your work unless you send the file yourself. In normal mode speech is converted by your phone's service (Apple or Google), so do not say batch numbers, product names or any confidential information. The Excel file also contains the original text of your words, so review it before sending.",
"مسح كل بياناتي من الموبايل":"Erase all my data from this phone","اللغة":"Language",
/* analysis tab */
"تحليل المشاكل: A3 و 3C":"Problem analysis: A3 and 3C",
"3C للمشاكل الصغيرة (بطاقة واحدة). A3 للمشاكل الكبيرة أو المتكررة. التطبيق بيسألك أسئلة حسب نوع العطل ويرتّب الإجابات في نفس نموذج Servier، وتقدر تصدّره Excel على القالب الأصلي.":"3C is for small problems (one card). A3 is for big or recurring problems. The app asks questions based on the fault type and arranges the answers in the same Servier sheet, and you can export it to Excel on the original template.",
"تحليل جديد":"New analysis","تحليلاتي":"My analyses","أمثلة جاهزة للتعلم":"Ready examples to learn from","افتح أي مثال تشوف المشكلة والتحليل والحل. وتقدر تنسخه وتعدّل عليه.":"Open any example to see the problem, the analysis and the solution. You can copy it and edit it.",
"لسه معملتش تحليل. اضغط على \"تحليل جديد\" أو سجّل عطل وهيعرض عليك.":"No analysis yet. Tap \"New analysis\" or log a fault and it will offer one.","الأمثلة مش متحمّلة (examples.js)":"Examples are not loaded (examples.js)",
"تحليل المشكلة":"Problem analysis","اختار نوع التحليل:":"Choose the analysis type:","(مقترح)":"(suggested)",
"3C: مشكلة صغيرة أو عطل بسيط":"3C: small problem or simple fault","بطاقة واحدة: مشكلة، سبب، احتواء، حل دائم. بياخد 5 دقايق.":"One card: concern, cause, containment, permanent fix. Takes 5 minutes.",
"A3: مشكلة كبيرة أو متكررة":"A3: big or recurring problem","تحليل كامل: 4W2H، Fishbone، 5 Whys، أفكار، خطة تنفيذ، قياس. للأعطال الطويلة أو المتكررة أو اللي تكلفتها عالية.":"Full analysis: 4W2H, fishbone, 5 Whys, ideas, action plan, measurement. For long, recurring or costly faults.",
"اه، نحلل":"Yes, analyse","مش دلوقتي":"Not now","حفظ وإغلاق":"Save and close","رجوع":"Back","التالي":"Next","خلّص وشوف النموذج":"Finish and view the sheet","انسخ وعدّل":"Copy and edit",
"· مثال":"· example","· مسودة":"· draft","النشاط، مين، البداية، الموعد، الحالة.":"activity, who, start, due date, status.","ليه حصلت المشكلة؟":"Why did the problem happen?",
/* wizard */
"أسئلة سريعة":"Quick questions","1. المشكلة (Concern)":"1. Concern","2. السبب (Cause)":"2. Cause","3A. احتواء":"3A. Containment","3B. حل دائم":"3B. Countermeasure","ملاحظات وتأكيد":"Observations and sign-off",
"البيانات الأساسية":"Basic data","وصف المشكلة 4W2H":"Problem description 4W2H","أسباب محتملة (Fishbone)":"Potential causes (Fishbone)","أفكار الحلول":"Solution ideas","خطة التنفيذ":"Action plan","التقييم والمتابعة":"Assessment and follow-up",
"المشكلة:":"Problem:","عنوان المشكلة":"Problem title","مثال: ارتفاع الرفض في فيته 3":"Example: high rejects on Fette 3","اختار":"Choose",
"جاوب بسرعة بكلامك. اللي مش عارفه سيبه فاضي، وأنا برتّب الإجابات في الخانات.":"Answer quickly in your own words. Leave blank what you do not know, the app arranges the answers into the fields.",
"اقترح مسودة كاملة بالذكاء الاصطناعي (محتاج إنترنت)":"Suggest a full draft with AI (online)","لو فعّلت وضع الإنترنت من الإعدادات هتلاقي هنا زرار يكتب مسودة كاملة من إجاباتك.":"If you enable online mode in Settings, a button here writes a full draft from your answers.",
"بكتب المسودة...":"Writing the draft...",
"إيه المفروض يكون عليه الوضع؟ (المعيار أو المتوقع)":"What should the situation be? (the standard or expectation)","مثال: الخط يشتغل 40 شريط/دقيقة من غير توقف":"Example: the line runs 40 blisters/min with no stops",
"العطل وقّف الماكينة قد إيه؟ (ساعات)":"How long did the fault stop the machine? (hours)","مثال: 3":"Example: 3","ده اتكرر قبل كده؟ كام مرة في آخر 3 شهور؟":"Has this happened before? How many times in the last 3 months?","مثال: 4 مرات":"Example: 4 times",
"إيه اللي اتغير قبل العطل؟ (قطعة، منتج، صيانة، وردية، ضبط)":"What changed before the fault? (part, product, maintenance, shift, setting)","إيه العرض أو الإنذار اللي ظهر؟ وإزاي عرفت؟":"What symptom or alarm appeared? How did you find out?",
"اتصلّح إزاي دلوقتي؟ وإيه القطعة اللي اتغيرت؟":"How was it fixed now? Which part was changed?","التكلفة التقريبية (قطع وإنتاج ضايع) بالجنيه؟":"Approximate cost (parts and lost production) in EGP?","مثال: 12000":"Example: 12000",
"الوقت المعياري لتغيير المنتج؟ (ساعات)":"Standard changeover time? (hours)","الوقت الفعلي؟ (ساعات)":"Actual time? (hours)","مثال: 5":"Example: 5","إيه اللي اتأخر؟ (أجزاء ناقصة، تنضيف، فحص جودة، ضبط)":"What caused the delay? (missing parts, cleaning, quality check, setup)",
"ده بيتكرر في كل تغيير منتج؟":"Does this happen at every changeover?","مثال: آخر 3 مرات":"Example: the last 3 times","عملتوا إيه عشان تلحقوا؟":"What did you do to catch up?","الخسارة التقريبية بالجنيه؟":"Approximate loss in EGP?","مثال: 8000":"Example: 8000",
"إيه الانحراف بالظبط؟ وكام % أو كام وحدة خارج المعيار؟":"What exactly is the deviation? How many % or units outside the standard?","المنتج ورقم التشغيلة (Batch)؟":"Product and batch?","ظهر قبل كده؟ كام مرة؟":"Has it appeared before? How many times?","إيه اللي اتغير قبل ما يظهر؟":"What changed before it appeared?",
"اتعمل إيه فوراً؟ (حجز، فحص، إعادة)":"What was done immediately? (hold, inspection, rework)","التكلفة أو الكمية المرفوضة؟":"Cost or rejected quantity?",
"إيه إجراء الأمان المفروض يتتبع؟":"Which safety procedure should be followed?","مثال: LOTO قبل أي تدخل":"Example: LOTO before any intervention","كان فيه إصابة أو قرب إصابة؟ إيه الخطر؟":"Was there an injury or near miss? What was the hazard?",
"إيه حاجز الحماية اللي فشل أو ما كانش موجود؟":"Which protective barrier failed or was missing?","شفته قبل كده؟":"Have you seen it before?","اتعمل إيه فوراً؟":"What was done immediately?",
"الاستهلاك الطبيعي؟":"Normal consumption?","مثال: 120 kWh لكل ساعة":"Example: 120 kWh per hour","الاستهلاك الفعلي، ومن إمتى؟":"Actual consumption, and since when?","فين التسريب أو الهدر؟":"Where is the leak or waste?","اتعمل إيه مؤقتاً؟":"What was done temporarily?","التكلفة التقريبية في الشهر؟":"Approximate cost per month?","مثال: 15000":"Example: 15000",
"القطعة وكودها وعددها؟":"Part, code and quantity?","المتاح في المخزن؟ ومدة التوريد؟":"Stock available? Lead time?","لو القطعة مش موجودة إيه اللي هيقف؟":"If the part is missing, what will stop?","القطعة دي خلصت قبل كده؟":"Has this part run out before?","بديل مؤقت؟":"Temporary substitute?","سعر القطعة وتكلفة التوقف؟":"Part price and downtime cost?",
"القطعة وكودها؟":"Part and code?","إيه اللي حصل في الصرف أو المخزن؟ (قطعة غلط، ناقص، تأخير)":"What happened at issue or in the store? (wrong part, shortage, delay)","ده بيتكرر؟":"Does this repeat?","إيه الأثر على الشغل؟":"What is the impact on the work?",
"المشكلة أثرت على الشغل قد إيه؟ (ساعات)":"How much did the problem affect the work? (hours)","اتكررت قبل كده؟ كام مرة؟":"Has it repeated before? How many times?","إيه اللي اتغير قبلها؟":"What changed before it?","التكلفة التقريبية بالجنيه؟":"Approximate cost in EGP?",
"إيه المشكلة أو الانحراف؟ وإيه المعيار المتوقع؟":"What is the problem or deviation? What is the expected standard?","حل مؤقت يوقف الأعراض دلوقتي. هل بيمنع المشكلة تنتشر؟":"A temporary fix that stops the symptoms now. Does it stop the problem spreading?",
"حل دائم يشيل السبب الجذري. اكتب كل إجراء ومين هيعمله وإمتى":"A permanent fix that removes the root cause. Write each action, who does it and when","فحوصات اتعملت، ملاحظات، معلومات جديدة":"Checks done, observations, new insights","الحروف الأولى":"Initials",
"Go and see: روح مكان المشكلة وشوف بنفسك. اكتب مين، إيه، فين، ليه، إمتى، إزاي، كام.":"Go and see: go to the problem location and look yourself. Write who, what, where, why, when, how, how much.","السبب الجذري وإزاي وصلنا له":"The root cause and how we reached it",
"نصيحة: اسأل \"ليه\" 3 مرات على الأقل واكتبها: Why1 → Why2 → Why3 → Root cause.":"Tip: ask \"why\" at least 3 times and write them: Why1 → Why2 → Why3 → Root cause.",
"Originator (صاحب التحليل)":"Originator (analysis owner)","Scope (المنطقة، الخط، القسم)":"Scope (area, line, department)","تاريخ الفتح":"Opening date","تاريخ الإغلاق (لو اتقفل)":"Closing date (if closed)","6D impact (اتأثر إيه؟)":"6D impact (what was affected?)",
"What happened? إيه اللي حصل":"What happened?","Who? مين اكتشفها":"Who? (who detected it)","Where? حصلت فين":"Where did it occur?","When? التاريخ":"When? Date","How do we know? إزاي عرفنا":"How do we know?","How much? (KPI، خسائر، وقت، جنيه)":"How much? (KPI, losses, time, EGP)","Redefine problem statement: المعيار، الفعلي، الفجوة بالأرقام":"Redefine problem statement: standard, actual, gap in numbers",
"اكتب كل سبب محتمل في سطر (حد أقصى 6). اضغط على اقتراح عشان يتضاف.":"Write each potential cause on its own line (max 6). Tap a suggestion to add it.","أرجح سبب أساسي (More plausible primary cause)":"Most plausible primary cause",
"جودة":"Quality","تكلفة":"Cost","تسليم":"Delivery","سلامة":"Safety","بيئة":"Environment","خامات":"Materials","طرق":"Methods","ناس":"People","ماكينات":"Machines","قياس":"Measurement",
"جودة الخامة أو المواصفات":"Material quality or specification","تشغيلة أو مورد مختلف":"Different batch or supplier","قطعة غيار مش أصلية":"Non-original spare part","تأخر توريد القطعة":"Late part delivery",
"مفيش SOP أو مش واضح":"No SOP or unclear SOP","خطوات الضبط مش متتبعة":"Setup steps not followed","تغيير منتج من غير checklist":"Changeover without a checklist","الـPM مش بيغطي النقطة دي":"PM does not cover this point",
"تدريب غير كافي":"Insufficient training","اختلاف بين الورديات":"Differences between shifts","ضغط وقت":"Time pressure","المسؤولية مش واضحة":"Responsibility not clear",
"تآكل":"Wear","نقص تزييت":"Lack of lubrication","ضبط غير صحيح":"Incorrect setting","اهتزاز أو خلوص":"Vibration or play","سخان أو حساس متدهور":"Degraded heater or sensor",
"حرارة أو رطوبة":"Heat or humidity","تراب أو تلوث":"Dust or contamination","تذبذب كهرباء":"Power fluctuation","ضغط هواء أو بخار غير ثابت":"Unstable air or steam pressure",
"معايرة منتهية":"Calibration expired","حساس مش دقيق":"Inaccurate sensor","مفيش مؤشر يكشف بدري":"No indicator to detect early","طريقة قياس مختلفة":"Different measuring method",
"ليه حصلت المشكلة؟":"Why did the problem happen?","ليه الإجابة اللي فاتت حصلت؟":"Why did the previous answer happen?","ليه؟":"Why?","ليه؟ (المفروض توصل لسبب في النظام مش في شخص)":"Why? (you should reach a system cause, not a person)",
"كل إجابة هي سبب اللي قبلها. ما توقفش عند \"الفني غلط\": اسأل ليه النظام سمح بكده.":"Each answer is the cause of the one before. Do not stop at \"the technician made a mistake\": ask why the system allowed it.","Selected Root Cause: السبب الجذري المختار":"Selected Root Cause",
"اكتب كل الأفكار من غير حكم (حد أقصى 9)، وبعدين حدد لكل فكرة الأثر (Impact) والمجهود (Effort).":"Write all ideas without judging (max 9), then rate each idea's Impact and Effort.","فكرة":"Idea","أثر":"Impact","أثر عالي":"High impact","أثر قليل":"Low impact","مجهود":"Effort","مجهود عالي":"High effort","مجهود قليل":"Low effort",
"اقترح الحل (أثر عالي ومجهود قليل)":"Suggest the solution (high impact, low effort)","وصف الحل المختار بعد المصفوفة":"Description of the solution selected after the matrix",
"النشاط":"Activity","مين":"Who","الحالة ":"Status ","خطة التنفيذ (Action Plan)":"Action Plan",": النشاط، مين، البداية، الموعد، الحالة.":": activity, who, start, due date, status.",
"Metrics: مؤشرات تقيس نجاح الحل.":"Metrics: indicators that measure the success of the solution.","المؤشر (مثال: رفض %)":"Indicator (example: rejects %)","تعليق على كفاءة الحلول":"Comment on the efficiency of the solutions",
"Follow-up: إجراءات للاستدامة، وضع ضوابط، وتعميم على ماكينات تانية.":"Follow-up: actions to sustain, set controls and roll out to other machines.","تحليل":"Analysis",
/* toasts & prompts */
"مش قادر أحفظ على الموبايل. اعمل نسخة احتياطية":"Cannot save on the phone. Make a backup","اكتب أو سجّل كلام الأول":"Type or record something first","حصلت مشكلة في الترتيب. اكتب الخانات بإيدك":"Something went wrong arranging the fields. Fill them in by hand",
"اكتب تاريخ صحيح":"Enter a valid date","اختار الماكينة":"Choose the machine","اكتب عنوان":"Enter a title","الشغلانة دي اتمسحت":"That entry was deleted","اتعدّل":"Updated","اتسجّل ✓":"Logged ✓",
"اسمح للميكروفون وفعّل Dictation من إعدادات الموبايل":"Allow the microphone and enable Dictation in the phone settings","الصوت محتاج نت. اكتب، أو جرب تاني":"Voice needs internet. Type, or try again","الميكروفون وقف لأنك سكتّ فترة":"The microphone stopped because you were silent for a while",
"ما سمعتش حاجة واضحة، جرب تاني":"I did not hear anything clear, try again","مفتاح الذكاء الاصطناعي غلط. راجع الإعدادات":"The AI key is wrong. Check Settings","التحويل عبر الإنترنت فشل. التسجيل لسه محفوظ، اضغط إعادة المحاولة":"Online conversion failed. The recording is still saved, tap retry",
"مقدرتش أشغل الميكروفون. بجرب الطريقة العادية":"Could not start the microphone. Trying the normal way","المتصفح مش بيدعم الصوت. اكتب، أو استخدم ميكروفون لوحة المفاتيح":"This browser does not support voice. Type, or use the keyboard microphone","مقدرتش أشغل الميكروفون":"Could not start the microphone",
"ملف التحليل مش متحمّل":"The analysis file is not loaded","تمسح الشغلانة دي؟":"Delete this entry?","اتمسحت":"Deleted","اتمسح":"Deleted","المفتاح شكله غلط. لازم يبدأ بـ sk-":"The key looks wrong. It must start with sk-","اتفعّل وضع الإنترنت":"Online mode enabled","اتقفل وضع الإنترنت":"Online mode disabled",
"لسه مفيش شغل تبعته":"No work to send yet","الملف ده مش نسخة احتياطية صحيحة":"This file is not a valid backup","اكتب الاسم":"Enter the name","اتحفظ":"Saved","اكتب اسم الماكينة":"Enter the machine name","اتضافت":"Added","اكتب اسمك":"Enter your name",
"هتمسح كل شغلك من الموبايل. بعت الملف قبل كده؟":"This erases all your work from the phone. Did you send the file first?","متأكد؟ مفيش رجعة.":"Sure? There is no undo.","تمسح التحليل ده؟":"Delete this analysis?",
"المسودة اتكتبت. راجع كل خطوة وصحح":"The draft is written. Review every step and correct it","الذكاء الاصطناعي مش متاح دلوقتي. كمّل بإيدك":"AI is not available now. Continue by hand","اتحفظت كمسودة":"Saved as a draft",
"تعذّر النسخ":"Could not copy","اتنسخ لتحليلاتي. عدّل عليه":"Copied to my analyses. Edit it","بجهّز ملف Excel...":"Preparing the Excel...","ملف Excel ماطلعش. ممكن تعمل طباعة PDF بدله":"The Excel failed. You can print to PDF instead",
"اتفهم بالذكاء الاصطناعي. ":"Understood by AI. ","الذكاء الاصطناعي مش متاح دلوقتي، اتفهم بالقواعد. ":"AI is not available now, understood by the rules. ","الخانات اتملت من كلامك. بص عليها وصحح اللي غلط":"The fields were filled from your words. Check them and fix anything wrong",
". ما لقيتش: ":". Not found: ","الماكينة":"Machine","نوع الشغل (اختاره)":"Work type (choose it)","، ":", ","اتضاف ":"Added "," شغلانة":" entries"," و":" and "," تحليل":" analyses"
};
/* dynamic patterns */
const P=[
 [/^النوع المختار: (.*)\. هيتطبق على اللي هتسجله$/,(m)=>"Selected type: "+m[1]+". It will apply to what you log"],
 [/^خطوة (\d+) من (\d+): (.*)$/,(m)=>"Step "+m[1]+" of "+m[2]+": "+T(m[3])],
 [/^اتضاف (\d+) شغلانة(?: و(\d+) تحليل)?$/,(m)=>"Added "+m[1]+" entries"+(m[2]?" and "+m[2]+" analyses":"")],
 [/^(\d+) شغلانة\. آخر إرسال: (.*)$/,(m)=>m[1]+(m[1]==="1"?" entry":" entries")+". Last sent: "+(m[2]==="لسه ما بعتش"?"not yet":m[2])],
 [/^تعديل (ACH-[\d-]+)$/,(m)=>"Edit "+m[1]],
 [/^(.*) ساعة$/,(m)=>m[1]+" hours"],[/^(.*) جنيه$/,(m)=>m[1]+" EGP"],[/^(.*) ج$/,(m)=>m[1]+" EGP"],
 [/^اتسجّل\. تحب نحلل "(.*)"؟ (.*)$/,(m)=>"Logged. Analyse \""+m[1]+"\"? "+(/A3/.test(m[2])?"The problem is big, A3 is recommended.":"A quick 3C is enough.")],
 [/^(.*)\. ما لقيتش: (.*)$/,(m)=>T(m[1]+".")+" Not found: "+m[2].split("، ").map(x=>T(x)).join(", ")],
 [/^(.*)(?:الخانات اتملت من كلامك\. بص عليها وصحح اللي غلط)(.*)$/,(m)=>T(m[1])+"The fields were filled from your words. Check them and fix anything wrong"+(m[2]?T(m[2]):"")],
 [/^(\d+(?:\.\d+)?) (?:ساعات?|س)$/,(m)=>m[1]+" h"],[/^([\d.,]+) (?:ساعات?|س)$/,(m)=>m[1]+" h"],[/^(.*) \(مقترح\)$/,(m)=>T(m[1])+" (suggested)"],
 [/^خطة التنفيذ \(Action Plan\): (.*)$/,(m)=>"Action Plan: "+T(m[1])],
 [/^(A3|3C) \| (.*)$/,(m)=>m[1]+" | "+T(m[2])],
 [/^([A-Za-z][A-Za-z0-9 \-\/()&]*[:?]) (.*)$/,(m)=>m[1]+" "+T(m[2])],
 [/^اتصلّح.*$/,null]
];
const isAr=s=>/[؀-ۿ]/.test(s);
function T(s){
  if(s==null||!isAr(s))return s;
  const lead=/^\s*/.exec(s)[0],trail=/\s*$/.exec(s)[0],c=s.trim();
  if(Object.prototype.hasOwnProperty.call(D,c))return lead+D[c]+trail;
  const pm=/^([+•] )(.*)$/.exec(c);if(pm&&D[pm[2]])return lead+pm[1]+D[pm[2]]+trail;
  for(const [re,fn] of P){if(!fn)continue;const m=re.exec(c);if(m)return lead+fn(m)+trail}
  return s;
}
/* ---- French: English -> French dictionary (i18n_fr.js) ---- */
const FRD=window.I18N_FR||{};
const FP=[
 [/^(.*)\. Not found: (.*)$/,m=>F(m[1])+". Introuvable : "+m[2].split(", ").map(x=>F(x)).join(", ")],
 [/^Step (\d+) of (\d+): (.*)$/,m=>"Étape "+m[1]+" sur "+m[2]+" : "+F(m[3])],
 [/^(\d+) entr(?:y|ies)\. Last sent: (.*)$/,m=>m[1]+(m[1]==="1"?" saisie":" saisies")+". Dernier envoi : "+(m[2]==="not yet"?"pas encore":m[2])],
 [/^(\d+) entries$/,m=>m[1]+" saisies"],
 [/^Added (\d+) entries(?: and (\d+) analyses)?$/,m=>m[1]+" saisies ajoutées"+(m[2]?" et "+m[2]+" analyses":"")],
 [/^Selected type: (.*)\. It will apply to what you log$/,m=>"Type choisi : "+F(m[1])+". Il s'appliquera à votre saisie"],
 [/^Edit (ACH-[\d-]+)$/,m=>"Modifier "+m[1]],
 [/^(3C|A3|Kaizen) \| (.*)$/,m=>m[1]+" | "+F(m[2])],
 [/^(3C|A3|Kaizen) · suggested: (3C|A3|Kaizen)$/,m=>m[1]+" · suggéré : "+m[2]],
 [/^(3C|A3|Kaizen)( \(suggested\))$/,m=>m[1]+" (suggéré)"],
 [/^Switch to (.*)$/,m=>"Passer en "+m[1]],
 [/^Logged\. Analyse "(.*)"\? (.*)$/,m=>"Enregistré. Analyser « "+m[1]+" » ? "+F(m[2])],
 [/^Logged\. Document "(.*)" as a Kaizen\?$/,m=>"Enregistré. Documenter « "+m[1]+" » en Kaizen ?"],
 [/^([\d.,]+) (?:h|hours)$/,m=>m[1]+" h"],
 [/^Why (\d+)\??$/,m=>"Pourquoi "+m[1]+(/\?$/.test(m[0])?" ?":"")],
 [/^(.*) \(([^()]+)\)$/,m=>{const a=F(m[1]),b=F(m[2]);return a!==m[1]||b!==m[2]?a+" ("+b+")":null}],
 [/^(.*) · (.*)$/,m=>{const a=F(m[1]),b=F(m[2]);return a!==m[1]||b!==m[2]?a+" · "+b:null}],
 [/^([^:]{2,40}): (.+)$/,m=>{const a=FRD[m[1]+":"]||FRD[m[1]],b=F(m[2]);return a?a.replace(/\s*:?\s*$/,"")+" : "+b:null}]
];
let FORCE=false;
function F(s,force){
  if(force&&!FORCE){FORCE=true;try{return F(s)}finally{FORCE=false}}
  if(s==null||(LANG!=="fr"&&!FORCE)||typeof s!=="string")return s;
  const lead=/^\s*/.exec(s)[0],trail=/\s*$/.exec(s)[0],c=s.trim();if(!c)return s;
  if(Object.prototype.hasOwnProperty.call(FRD,c))return lead+FRD[c]+trail;
  if(Object.prototype.hasOwnProperty.call(FRD,s))return FRD[s];
  const pm=/^([+•\-] |\d+\. )(.*)$/.exec(c);if(pm){const t=F(pm[2]);if(t!==pm[2])return lead+pm[1]+t+trail}
  for(const [re,fn] of FP){const m=re.exec(c);if(m){const r=fn(m);if(r!=null)return lead+r+trail}}
  return s;
}
const X=s=>LANG==="fr"?F(T(s)):T(s);
/* ---- DOM translation ---- */
let EN=false,LANG="ar";const SKIP="TEXTAREA,SCRIPT,STYLE,INPUT";
const nodeRec=new Map(),attrRec=new Map(); // node -> {orig,out}
const userSel=".ti,dd,#glossBody .gl,#list .item .ti,#anMine .ti,#anEx .ti,.chip,.noTr,#mSug button,#mList span,#anBody .idea,.a3 *,.c3 *,.shx *,#report *,option[data-user]";
function skipNode(n){const p=n.parentElement;if(!p)return true;if(p.tagName==="OPTION"&&!p.hasAttribute("value"))return true;if(p.closest(SKIP))return true;if(p.closest('.shx,#report,dd,.ti,#mSug,#mList,.noTr,#who,#sgVTitle'))return true;return false}
const NU=/^\s*[\d.,]+\s*(س|ساعة|ساعات|جنيه|ج)\s*$/;
function doText(n){
  if(!EN||n.nodeType!==3)return;
  if(skipNode(n)){if(NU.test(n.nodeValue)&&!nodeRec.has(n)){const o=X(n.nodeValue);if(o!==n.nodeValue){nodeRec.set(n,{orig:n.nodeValue,out:o});n.nodeValue=o}}return}
  const v=n.nodeValue,r=nodeRec.get(n);
  if(r&&v===r.out)return;
  if(!isAr(v)&&LANG!=="fr")return;
  const o=X(v);if(o!==v){nodeRec.set(n,{orig:v,out:o});n.nodeValue=o}
}
function doAttrs(el){
  if(!EN||el.nodeType!==1)return;
  for(const a of["placeholder","title","aria-label"]){
    if(!el.hasAttribute(a))continue;const v=el.getAttribute(a),k=el,key=a;
    let m=attrRec.get(k);const r=m&&m[key];if(r&&v===r.out)continue;if(!isAr(v)&&LANG!=="fr")continue;
    const o=X(v);if(o!==v){if(!m){m={};attrRec.set(k,m)}m[key]={orig:v,out:o};el.setAttribute(a,o)}
  }
}
function walk(root){
  if(!EN)return;
  if(root.nodeType===3){doText(root);return}
  if(root.nodeType!==1)return;
  doAttrs(root);
  const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=tw.nextNode()))doText(n);
  root.querySelectorAll&&root.querySelectorAll("[placeholder],[title],[aria-label]").forEach(doAttrs);
}
let busy=false;
const mo=new MutationObserver(list=>{
  if(!EN||busy)return;busy=true;
  try{for(const m of list){
    if(m.type==="childList")m.addedNodes.forEach(walk);
    else if(m.type==="characterData")doText(m.target);
    else if(m.type==="attributes")doAttrs(m.target);
  }}finally{busy=false}
});
function restoreAll(){
  busy=true;
  for(const [n,r] of nodeRec){if(n.nodeValue===r.out)n.nodeValue=r.orig}
  for(const [el,m] of attrRec){for(const a in m){if(el.getAttribute(a)===m[a].out)el.setAttribute(a,m[a].orig)}}
  nodeRec.clear();attrRec.clear();busy=false;
}
const NEXT={ar:"en",en:"fr",fr:"ar"},BTN={ar:"EN",en:"FR",fr:"عربي"};
function apply(){
  document.documentElement.lang=LANG;document.documentElement.dir=EN?"ltr":"rtl";
  const b=document.getElementById("langBtn");if(b)b.textContent=BTN[LANG];
  document.querySelectorAll("[data-lang-set]").forEach(x=>x.classList.toggle("on",x.dataset.langSet===LANG));
}
function rerender(){try{if(typeof renderChips==="function")renderChips();if(typeof renderAll==="function")renderAll();if(window.renderAnalyses)renderAnalyses();if(window.renderSugg)renderSugg()}catch(e){console.error(e)}}
function setLang(l){
  if(!NEXT[l])l="ar";if(l===LANG&&document.documentElement.lang===l){apply();return}
  restoreAll();LANG=l;EN=l!=="ar";
  try{localStorage.setItem(KEY,l)}catch(e){}
  apply();rerender();if(EN)walk(document.body);
}
function init(){
  let l="ar";try{l=localStorage.getItem(KEY)||"ar"}catch(e){}if(!NEXT[l])l="ar";
  mo.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:["placeholder","title","aria-label"]});
  document.querySelectorAll("[data-lang-toggle]").forEach(b=>b.onclick=()=>setLang(NEXT[LANG]));
  document.querySelectorAll("[data-lang-set]").forEach(b=>b.onclick=()=>setLang(b.dataset.langSet));
  LANG=l;EN=l!=="ar";apply();
  if(EN){rerender();walk(document.body)}
}
window.I18N={tr:s=>EN?X(s):s,isEN:()=>EN,isFR:()=>LANG==="fr",lang:()=>LANG,fr:F,frForce:s=>F(s,true),setLang,init};
init();
})();
