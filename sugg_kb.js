/* Suggestion box knowledge base - Servier Egypt, Cairo site
   Trilingual (ar = Egyptian Arabic, en, fr). Loaded as window.KB_SUGG */
window.KB_SUGG = {
  intro: {
    ar: "عندك فكرة تخلّي الشغل أسهل أو أأمن، أو توفّر مية أو كهربا أو فلوس؟ اكتبها أو سجّلها بصوتك. كل اقتراح بيتقرا ويترد عليه، وتقدر تبعته من غير اسمك.",
    en: "Got an idea that makes work easier or safer, or saves water, power or money? Write it or record it. Every suggestion is read and answered, and you can send it without your name.",
    fr: "Une idée pour rendre le travail plus simple ou plus sûr, ou économiser eau, énergie ou argent ? Écrivez-la ou enregistrez-la. Chaque idée est lue et reçoit une réponse, et vous pouvez rester anonyme."
  },

  categories: [
    { id: "safety",
      ar: "السلامة", en: "Safety", fr: "Sécurité",
      hint: { ar: "حوادث، مخاطر، معدات وقاية، رفع وشيل", en: "Accidents, hazards, PPE, lifting and handling", fr: "Accidents, dangers, EPI, manutention" },
      kw: {
        ar: ["سلامة", "خطر", "حادثة", "اتعور", "وقع", "زحلقة", "جوانتي", "نضارة", "كمامة", "حريق", "عزل", "ونش"],
        en: ["safety", "hazard", "accident", "injury", "slip", "fall", "ppe", "gloves", "fire", "lockout", "forklift", "risk"],
        fr: ["sécurité", "danger", "accident", "blessure", "chute", "glissade", "epi", "gants", "incendie", "consignation", "chariot", "risque"]
      } },
    { id: "quality",
      ar: "الجودة و GMP", en: "Quality & GMP", fr: "Qualité et BPF",
      hint: { ar: "رفض، انحرافات، تلوث، توثيق، نظافة خط", en: "Rejects, deviations, contamination, documentation, line clearance", fr: "Rejets, déviations, contamination, documentation, vide de ligne" },
      kw: {
        ar: ["جودة", "رفض", "انحراف", "تلوث", "توثيق", "باتش", "عينة", "تنضيف", "شكوى", "مواصفات"],
        en: ["quality", "gmp", "reject", "deviation", "contamination", "batch", "documentation", "cleaning", "complaint", "spec", "line clearance"],
        fr: ["qualité", "bpf", "rejet", "déviation", "contamination", "lot", "documentation", "nettoyage", "réclamation", "vide de ligne"]
      } },
    { id: "energy_water",
      ar: "توفير طاقة ومية وهوا", en: "Energy, water & air saving", fr: "Économie d'énergie, d'eau et d'air",
      hint: { ar: "كهربا، مية، هوا مضغوط، بخار، تكييف، نور", en: "Electricity, water, compressed air, steam, HVAC, lighting", fr: "Électricité, eau, air comprimé, vapeur, CVC, éclairage" },
      kw: {
        ar: ["كهربا", "مية", "تسريب", "هوا مضغوط", "بخار", "تكييف", "نور", "لمبات", "استهلاك", "طاقة", "شمسية", "حنفية"],
        en: ["energy", "electricity", "water", "leak", "compressed air", "steam", "hvac", "lighting", "led", "consumption", "solar", "power"],
        fr: ["énergie", "électricité", "eau", "fuite", "air comprimé", "vapeur", "climatisation", "éclairage", "led", "consommation", "solaire"]
      } },
    { id: "cost",
      ar: "تقليل التكاليف", en: "Cost saving", fr: "Réduction des coûts",
      hint: { ar: "هالك خامات، قطع غيار، شراء، مخزون", en: "Material waste, spare parts, purchasing, stock", fr: "Pertes matière, pièces de rechange, achats, stock" },
      kw: {
        ar: ["تكلفة", "فلوس", "توفير", "هالك", "خامات", "شراء", "سعر", "مخزون", "مورد", "مصاريف"],
        en: ["cost", "money", "saving", "waste", "material", "purchase", "price", "stock", "supplier", "budget"],
        fr: ["coût", "argent", "économie", "perte", "matière", "achat", "prix", "stock", "fournisseur", "budget"]
      } },
    { id: "productivity",
      ar: "تسهيل الشغل والإنتاجية", en: "Easier work & productivity", fr: "Travail simplifié et productivité",
      hint: { ar: "وقت تغيير، خطوات زيادة، انتظار، تنظيم (5S)", en: "Changeover time, extra steps, waiting, 5S", fr: "Changement de format, étapes inutiles, attente, 5S" },
      kw: {
        ar: ["أسهل", "وقت", "تغيير صنف", "انتظار", "خطوات", "تنظيم", "ترتيب", "سرعة", "إنتاجية", "مشوار", "زحمة"],
        en: ["easier", "time", "changeover", "waiting", "steps", "5s", "organize", "faster", "productivity", "oee", "walking", "layout"],
        fr: ["plus simple", "temps", "changement de format", "attente", "étapes", "5s", "rangement", "rapide", "productivité", "trs", "déplacement"]
      } },
    { id: "maintenance",
      ar: "الصيانة والاعتمادية", en: "Maintenance & reliability", fr: "Maintenance et fiabilité",
      hint: { ar: "أعطال متكررة، صيانة وقائية، قطع غيار، أدوات", en: "Repeat breakdowns, preventive maintenance, spares, tools", fr: "Pannes répétitives, maintenance préventive, pièces, outillage" },
      kw: {
        ar: ["عطل", "صيانة", "ماكينة", "وقفة", "قطعة غيار", "تشحيم", "سير", "موتور", "حساس", "متكرر", "عدة"],
        en: ["breakdown", "maintenance", "machine", "downtime", "spare", "lubrication", "belt", "motor", "sensor", "repeat", "tool", "pm"],
        fr: ["panne", "maintenance", "machine", "arrêt", "pièce", "graissage", "courroie", "moteur", "capteur", "récurrent", "outil"]
      } },
    { id: "environment",
      ar: "البيئة والمخلفات", en: "Environment & waste", fr: "Environnement et déchets",
      hint: { ar: "فرز وإعادة تدوير، كرتون، بلاستيك، صرف", en: "Sorting and recycling, cardboard, plastic, wastewater", fr: "Tri et recyclage, carton, plastique, eaux usées" },
      kw: {
        ar: ["بيئة", "زبالة", "مخلفات", "تدوير", "كرتون", "بلاستيك", "ورق", "صرف", "شجر", "تلوث"],
        en: ["environment", "waste", "recycle", "cardboard", "plastic", "paper", "wastewater", "green", "carbon", "trees"],
        fr: ["environnement", "déchets", "recyclage", "carton", "plastique", "papier", "eaux usées", "vert", "carbone"]
      } },
    { id: "people",
      ar: "الناس والرفاهية (HR)", en: "People & wellbeing (HR)", fr: "Personnes et bien-être (RH)",
      hint: { ar: "تدريب، تقدير، أتوبيسات، أكل، صحة، توازن الحياة", en: "Training, recognition, transport, canteen, health, work-life balance", fr: "Formation, reconnaissance, transport, cantine, santé, équilibre vie pro/perso" },
      kw: {
        ar: ["تدريب", "تقدير", "أتوبيس", "مواصلات", "أكل", "كانتين", "صحة", "رياضة", "مرتب", "إجازة", "تواصل", "روح الفريق"],
        en: ["training", "recognition", "bus", "transport", "canteen", "food", "health", "sport", "wellbeing", "leave", "team", "hr"],
        fr: ["formation", "reconnaissance", "bus", "transport", "cantine", "repas", "santé", "sport", "bien-être", "congé", "équipe", "rh"]
      } },
    { id: "facilities",
      ar: "مكان الشغل والمرافق", en: "Workplace & facilities", fr: "Lieu de travail et installations",
      hint: { ar: "غرف لبس، حمامات، استراحة، ركن، إضاءة، تكييف المكاتب", en: "Changing rooms, toilets, rest areas, parking, office comfort", fr: "Vestiaires, sanitaires, salle de pause, parking, confort des bureaux" },
      kw: {
        ar: ["غرفة لبس", "حمام", "استراحة", "ركنة", "جراج", "مكتب", "كراسي", "دولاب", "لوكر", "مبنى"],
        en: ["changing room", "toilet", "rest area", "parking", "office", "chairs", "locker", "building", "prayer room", "facility"],
        fr: ["vestiaire", "toilettes", "salle de pause", "parking", "bureau", "chaises", "casier", "bâtiment", "locaux"]
      } },
    { id: "digital",
      ar: "أدوات رقمية وIT", en: "Digital & IT tools", fr: "Outils numériques et IT",
      hint: { ar: "برامج، SAP، أتمتة، شاشات، ورق ممكن يتحول ديجيتال", en: "Software, SAP, automation, dashboards, paper that could go digital", fr: "Logiciels, SAP, automatisation, tableaux de bord, papier à dématérialiser" },
      kw: {
        ar: ["برنامج", "سيستم", "ساب", "كمبيوتر", "شاشة", "تطبيق", "ورق", "أتمتة", "داتا", "إكسيل", "نت"],
        en: ["software", "system", "sap", "computer", "screen", "app", "paper", "automation", "data", "excel", "dashboard", "wifi"],
        fr: ["logiciel", "système", "sap", "ordinateur", "écran", "application", "papier", "automatisation", "données", "excel", "wifi"]
      } },
    { id: "community",
      ar: "برا الشغل والمجتمع", en: "Outside work & community", fr: "Hors travail et communauté",
      hint: { ar: "مبادرات خيرية، تطوع، أنشطة عائلية، رحلات، تبرع بالدم", en: "Charity, volunteering, family activities, trips, blood donation", fr: "Solidarité, bénévolat, activités familiales, sorties, don du sang" },
      kw: {
        ar: ["خيري", "تطوع", "تبرع", "رحلة", "عيلة", "أولاد", "مجتمع", "دوري", "مسابقة", "رمضان"],
        en: ["charity", "volunteer", "donation", "trip", "family", "kids", "community", "csr", "tournament", "event"],
        fr: ["solidarité", "bénévolat", "don", "sortie", "famille", "enfants", "communauté", "rse", "tournoi", "événement"]
      } },
    { id: "other",
      ar: "حاجة تانية", en: "Other", fr: "Autre",
      hint: { ar: "أي فكرة مش داخلة في اللي فوق", en: "Any idea that does not fit above", fr: "Toute idée hors des catégories ci-dessus" },
      kw: { ar: ["تاني", "عام", "فكرة"], en: ["other", "general", "idea"], fr: ["autre", "général", "idée"] } }
  ],

  questions: [
    { id: "title", type: "text", required: true, mic: true,
      ar: "عنوان الاقتراح", en: "Suggestion title", fr: "Titre de l'idée",
      hint: { ar: "جملة قصيرة، مثلا: حساس يقفل المية لوحده", en: "One short line, e.g. Auto shut-off for hand-wash taps", fr: "Une phrase courte, ex. : arrêt automatique des robinets" } },

    { id: "cat", type: "single", required: true, mic: true, options: [],
      ar: "الاقتراح عن إيه؟", en: "What is it about?", fr: "De quoi s'agit-il ?",
      hint: { ar: "اختار أقرب نوع", en: "Pick the closest category", fr: "Choisissez la catégorie la plus proche" } },

    { id: "now", type: "text", required: false, mic: true,
      ar: "الوضع دلوقتي إيه؟ (المشكلة)", en: "What happens today? (the problem)", fr: "Situation actuelle (le problème)",
      hint: { ar: "فين، إمتى، وبيحصل كام مرة", en: "Where, when, and how often", fr: "Où, quand, à quelle fréquence" } },

    { id: "idea", type: "text", required: true, mic: true,
      ar: "اقتراحك إيه؟", en: "What do you suggest?", fr: "Que proposez-vous ?",
      hint: { ar: "اشرح الفكرة وإزاي تتنفذ", en: "Describe the idea and how to do it", fr: "Décrivez l'idée et comment la mettre en place" } },

    { id: "benefit", type: "multi", required: false, mic: true,
      ar: "هتفيد في إيه؟", en: "What will it improve?", fr: "Qu'est-ce que cela améliore ?",
      options: [
        { id: "safety", ar: "السلامة", en: "Safety", fr: "Sécurité", kw: { ar: ["أأمن", "سلامة"], en: ["safer", "safety"], fr: ["sécurité", "plus sûr"] } },
        { id: "quality", ar: "الجودة", en: "Quality", fr: "Qualité", kw: { ar: ["جودة", "رفض أقل"], en: ["quality", "fewer rejects"], fr: ["qualité", "moins de rejets"] } },
        { id: "time", ar: "توفير وقت", en: "Time", fr: "Temps", kw: { ar: ["وقت", "أسرع"], en: ["time", "faster"], fr: ["temps", "plus rapide"] } },
        { id: "cost", ar: "توفير فلوس", en: "Cost", fr: "Coûts", kw: { ar: ["فلوس", "تكلفة"], en: ["money", "cost"], fr: ["argent", "coût"] } },
        { id: "energy", ar: "كهربا وطاقة", en: "Energy", fr: "Énergie", kw: { ar: ["كهربا", "طاقة"], en: ["energy", "electricity"], fr: ["énergie", "électricité"] } },
        { id: "water", ar: "مية", en: "Water", fr: "Eau", kw: { ar: ["مية"], en: ["water"], fr: ["eau"] } },
        { id: "environment", ar: "البيئة", en: "Environment", fr: "Environnement", kw: { ar: ["بيئة", "مخلفات"], en: ["environment", "waste"], fr: ["environnement", "déchets"] } },
        { id: "people", ar: "الناس والروح المعنوية", en: "People & morale", fr: "Personnes et moral", kw: { ar: ["الناس", "مبسوطين", "راحة"], en: ["people", "morale", "comfort"], fr: ["moral", "confort"] } },
        { id: "customer", ar: "المريض والعميل", en: "Patient & customer", fr: "Patient et client", kw: { ar: ["مريض", "عميل"], en: ["patient", "customer"], fr: ["patient", "client"] } }
      ] },

    { id: "saving", type: "number", required: false, mic: true, unit: "EGP",
      quick: [5000, 20000, 50000, 100000, 250000, 500000],
      ar: "التوفير المتوقع في السنة (جنيه)", en: "Expected saving per year (EGP)", fr: "Économie estimée par an (EGP)",
      hint: { ar: "تقدير تقريبي، سيبها فاضية لو مش عارف", en: "A rough estimate; leave empty if unsure", fr: "Estimation approximative ; laissez vide si inconnu" } },

    { id: "effort", type: "single", required: false, mic: true,
      ar: "تنفيذها هيحتاج إيه؟", en: "What will it take?", fr: "Effort nécessaire ?",
      options: [
        { id: "easy", ar: "سهلة ومن غير تكلفة", en: "Easy, no cost", fr: "Facile, sans coût", kw: { ar: ["سهلة", "ببلاش", "من غير فلوس"], en: ["easy", "free", "no cost"], fr: ["facile", "gratuit", "sans coût"] } },
        { id: "small", ar: "تكلفة بسيطة", en: "Small cost", fr: "Petit coût", kw: { ar: ["بسيطة", "حاجة صغيرة"], en: ["small", "cheap"], fr: ["petit", "pas cher"] } },
        { id: "project", ar: "محتاجة ميزانية أو مشروع", en: "Needs budget or a project", fr: "Budget ou projet nécessaire", kw: { ar: ["ميزانية", "مشروع", "غالية"], en: ["budget", "project", "expensive"], fr: ["budget", "projet", "cher"] } },
        { id: "unsure", ar: "مش متأكد", en: "Not sure", fr: "Je ne sais pas", kw: { ar: ["مش عارف", "مش متأكد"], en: ["not sure", "don't know"], fr: ["sais pas", "pas sûr"] } }
      ] },

    { id: "area", type: "single", required: false, mic: true,
      ar: "فين؟", en: "Where?", fr: "Où ?",
      options: [
        { id: "acacia", ar: "أكاسيا", en: "Acacia", fr: "Acacia", kw: { ar: ["أكاسيا", "التصنيع"], en: ["acacia", "manufacturing"], fr: ["acacia", "fabrication"] } },
        { id: "palmier", ar: "بالمييه (Palmier)", en: "Palmier", fr: "Palmier", kw: { ar: ["بالمييه", "التغليف", "التعبئة"], en: ["palmier", "packaging"], fr: ["palmier", "conditionnement"] } },
        { id: "utilities", ar: "المرافق (Utilities)", en: "Utilities", fr: "Utilités", kw: { ar: ["مرافق", "غلاية", "كمبروسر", "محطة مية"], en: ["utilities", "boiler", "compressor", "chiller"], fr: ["utilités", "chaudière", "compresseur"] } },
        { id: "warehouse", ar: "المخازن", en: "Warehouse", fr: "Magasin", kw: { ar: ["مخزن", "مخازن"], en: ["warehouse", "store"], fr: ["magasin", "entrepôt"] } },
        { id: "offices", ar: "المكاتب", en: "Offices", fr: "Bureaux", kw: { ar: ["مكتب", "مكاتب"], en: ["office"], fr: ["bureau"] } },
        { id: "canteen_transport", ar: "الكانتين والأتوبيسات", en: "Canteen & transport", fr: "Cantine et transport", kw: { ar: ["كانتين", "أتوبيس", "مطعم"], en: ["canteen", "bus"], fr: ["cantine", "bus"] } },
        { id: "whole_site", ar: "الموقع كله", en: "Whole site", fr: "Tout le site", kw: { ar: ["المصنع كله", "الموقع كله"], en: ["whole site", "everywhere"], fr: ["tout le site", "partout"] } },
        { id: "outside", ar: "برا الموقع", en: "Outside the site", fr: "Hors du site", kw: { ar: ["برا", "بره المصنع"], en: ["outside"], fr: ["extérieur", "hors site"] } }
      ] },

    { id: "who_can", type: "multi", required: false, mic: true,
      ar: "مين يقدر ينفذها؟", en: "Who can make it happen?", fr: "Qui peut la réaliser ?",
      options: [
        { id: "me", ar: "أنا", en: "Me", fr: "Moi" },
        { id: "my_team", ar: "فريقي", en: "My team", fr: "Mon équipe" },
        { id: "maintenance", ar: "الصيانة", en: "Maintenance", fr: "Maintenance" },
        { id: "production", ar: "الإنتاج", en: "Production", fr: "Production" },
        { id: "engineering", ar: "الهندسة", en: "Engineering", fr: "Ingénierie" },
        { id: "hr", ar: "الموارد البشرية", en: "HR", fr: "RH" },
        { id: "ehs", ar: "السلامة والبيئة (EHS)", en: "EHS", fr: "HSE" },
        { id: "qa", ar: "ضمان الجودة", en: "QA", fr: "Assurance qualité" },
        { id: "it", ar: "IT", en: "IT", fr: "Informatique" },
        { id: "management", ar: "الإدارة", en: "Management", fr: "Direction" },
        { id: "supplier", ar: "مورد", en: "Supplier", fr: "Fournisseur" }
      ] },

    { id: "anon", type: "single", required: true, mic: false,
      ar: "اسمك يظهر؟", en: "Show your name?", fr: "Afficher votre nom ?",
      hint: {
        ar: "اختيارك بيتحترم. اسمك بيساعدنا نشكرك ونكافئك ونسألك لو محتاجين تفاصيل. لو اخترت مجهول تمامًا، الاسم مش هيتبعت خالص بس مش هنقدر نرجعلك أو نكافئك.",
        en: "Your choice is respected. Your name lets us thank you, reward you and ask for details. Fully anonymous means no name is sent at all, but we cannot reply to you or reward you.",
        fr: "Votre choix est respecté. Votre nom nous permet de vous remercier, de vous récompenser et de vous recontacter. En mode totalement anonyme, aucun nom n'est envoyé, mais nous ne pourrons ni vous répondre ni vous récompenser."
      },
      options: [
        { id: "named", ar: "يظهر اسمي", en: "Show my name", fr: "Afficher mon nom" },
        { id: "hr_only", ar: "مخفي عن الزملاء (HR بس تعرف)", en: "Hidden from colleagues (HR sees it)", fr: "Masqué aux collègues (visible RH)" },
        { id: "anonymous", ar: "مجهول تمامًا", en: "Fully anonymous", fr: "Totalement anonyme" }
      ] }
  ],

  statuses: [
    { id: "draft", ar: "مسودة", en: "Draft", fr: "Brouillon", color: "#9E9E9E" },
    { id: "submitted", ar: "اتبعت", en: "Submitted", fr: "Envoyée", color: "#323C8E" },
    { id: "under_review", ar: "تحت الدراسة", en: "Under review", fr: "En étude", color: "#9B7DCD" },
    { id: "accepted", ar: "اتقبلت", en: "Accepted", fr: "Acceptée", color: "#47BFD9" },
    { id: "in_progress", ar: "جاري التنفيذ", en: "In progress", fr: "En cours", color: "#FDC300" },
    { id: "implemented", ar: "اتنفذت", en: "Implemented", fr: "Réalisée", color: "#91C361" },
    { id: "not_accepted", ar: "مش هتتنفذ (مع السبب)", en: "Not accepted (with reason)", fr: "Non retenue (avec motif)", color: "#F55B41" },
    { id: "rewarded", ar: "اتكرّم صاحبها", en: "Recognised / rewarded", fr: "Reconnue / récompensée", color: "#242269" }
  ],

  evaluation: {
    criteria: [
      { id: "impact", ar: "الأثر (سلامة، جودة، توفير)", en: "Impact (safety, quality, savings)", fr: "Impact (sécurité, qualité, économies)", weight: 0.30 },
      { id: "cost", ar: "تكلفة التنفيذ (أقل = أعلى درجة)", en: "Cost to implement (lower = higher score)", fr: "Coût de mise en œuvre (faible = meilleure note)", weight: 0.20 },
      { id: "ease", ar: "سهولة وسرعة التنفيذ", en: "Ease and speed", fr: "Facilité et rapidité", weight: 0.20 },
      { id: "safety_gmp", ar: "أمان وتوافق مع GMP", en: "Safety and GMP fit", fr: "Sécurité et conformité BPF", weight: 0.15 },
      { id: "alignment", ar: "مناسبة لأهداف الموقع", en: "Fit with site goals", fr: "Alignement avec les objectifs du site", weight: 0.15 }
    ],
    guide: {
      ar: "اللجنة (المدير + HR + صاحب المنطقة) بتدي كل معيار من 1 لـ 5 (1 = ضعيف، 5 = ممتاز) والدرجة النهائية بالأوزان. الرد على صاحب الاقتراح خلال أسبوعين، ولو مش هتتنفذ لازم يتقال السبب. أي حاجة بتلمس ماكينة أو نظام أو عملية معتمدة (validated) لازم تعدي على Change Control مع QA قبل التنفيذ.",
      en: "A committee (manager + HR + area owner) scores each criterion 1 to 5 (1 = weak, 5 = excellent); the final score is weighted. Reply to the author within two weeks, and always give a reason if not accepted. Anything that touches validated equipment, systems or processes must go through change control with QA before implementation.",
      fr: "Un comité (manager + RH + responsable de zone) note chaque critère de 1 à 5 (1 = faible, 5 = excellent) ; la note finale est pondérée. Réponse à l'auteur sous deux semaines, avec un motif en cas de refus. Toute idée touchant un équipement, un système ou un procédé validé passe par la maîtrise des changements (change control) avec l'AQ avant mise en œuvre."
    }
  },

  tips: {
    ar: "خليك محدد: فين وإيه بالظبط.\nفكرة واحدة في كل اقتراح.\nلو عندك أرقام (وقت، لترات، فلوس) اكتبها.\nصورة أو مثال بيفرق كتير.",
    en: "Be specific: where and what exactly.\nOne idea per form.\nAdd numbers if you have them (time, litres, money).\nA photo or example helps a lot.",
    fr: "Soyez précis : où et quoi exactement.\nUne idée par fiche.\nAjoutez des chiffres si vous en avez (temps, litres, argent).\nUne photo ou un exemple aide beaucoup."
  },

  voiceHint: {
    ar: "قول مثلا: \"في أكاسيا، حنفيات غسيل الإيد بتفضل مفتوحة. اقترح نركب حساسات تقفلها لوحدها، هتوفر مية كتير والتكلفة بسيطة، والصيانة تقدر تنفذها.\"",
    en: "Say for example: \"In Acacia, the hand-wash taps stay running. I suggest sensor taps that shut off by themselves. It saves a lot of water, small cost, maintenance can do it.\"",
    fr: "Dites par exemple : « À Acacia, les robinets de lavage des mains restent ouverts. Je propose des robinets à capteur qui se ferment seuls. Grosse économie d'eau, petit coût, la maintenance peut le faire. »"
  },

  examples: [
    { title: { ar: "قفل تسريبات الهوا المضغوط", en: "Fix compressed-air leaks", fr: "Supprimer les fuites d'air comprimé" },
      cat: "energy_water",
      now: { ar: "بنسمع صفير هوا من وصلات في خطوط التغليف، والكمبروسر شغال حتى في الأجازات.", en: "We hear air hissing at fittings on packaging lines, and the compressor runs even on weekends.", fr: "On entend des fuites d'air aux raccords des lignes de conditionnement, et le compresseur tourne même le week-end." },
      idea: { ar: "جولة شهرية بجهاز كشف تسريب بالصوت وكروت حمرا على كل تسريب، ونقفل الهوا عن الخطوط الواقفة.", en: "Monthly ultrasonic leak walk with tags on each leak, and isolate air to idle lines.", fr: "Ronde mensuelle de détection par ultrasons avec étiquetage des fuites, et isolement de l'air sur les lignes à l'arrêt." },
      benefit: ["energy", "cost", "environment"], saving: 120000, effort: "small", area: "palmier", who_can: ["maintenance", "my_team"] },

    { title: { ar: "حنفيات بحساس في غرف اللبس", en: "Sensor taps in changing rooms", fr: "Robinets à capteur dans les vestiaires" },
      cat: "energy_water",
      now: { ar: "الحنفيات بتفضل مفتوحة وقت تغيير الوردية.", en: "Taps are left running during shift change.", fr: "Les robinets restent ouverts pendant les changements d'équipe." },
      idea: { ar: "تركيب حنفيات بحساس أو بزرار ضغط بيقفل لوحده.", en: "Install sensor or push-button self-closing taps.", fr: "Installer des robinets à capteur ou à bouton poussoir temporisé." },
      benefit: ["water", "cost", "environment"], saving: 30000, effort: "small", area: "acacia", who_can: ["maintenance", "engineering"] },

    { title: { ar: "عدة تغيير صنف جاهزة جنب المكبس", en: "Ready changeover kit beside the press", fr: "Kit de changement de format au pied de la presse" },
      cat: "productivity",
      now: { ar: "الفني بيروح المخزن أكتر من مرة عشان العدة والقطع وقت تغيير الصنف على FE55.", en: "Technicians walk to the store several times for tools and parts during FE55 changeover.", fr: "Les techniciens font plusieurs allers-retours au magasin pendant le changement de format de la FE55." },
      idea: { ar: "عربية عدة بشادو بورد فيها كل اللي محتاجينه لكل صنف.", en: "A shadow-board tool trolley with everything needed per product.", fr: "Un chariot avec tableau à silhouettes (shadow board) contenant tout le nécessaire par produit." },
      benefit: ["time", "quality", "people"], saving: 40000, effort: "small", area: "acacia", who_can: ["maintenance", "production"] },

    { title: { ar: "يوم عائلي وحملة تبرع بالدم", en: "Family day and blood donation drive", fr: "Journée familles et collecte de sang" },
      cat: "community",
      now: { ar: "مفيش أنشطة بتجمع الزملاء وعيلاتهم برا الشغل.", en: "There are no activities bringing colleagues and families together outside work.", fr: "Aucune activité ne réunit les collègues et leurs familles en dehors du travail." },
      idea: { ar: "يوم عائلي مرة في السنة مع حملة تبرع بالدم بالتعاون مع بنك الدم.", en: "A yearly family day with a blood donation drive run with the blood bank.", fr: "Une journée familles annuelle avec une collecte de sang organisée avec la banque du sang." },
      benefit: ["people"], saving: 0, effort: "project", area: "outside", who_can: ["hr", "management"] }
  ]
};
/* keyword additions after testing */
(function(){const K=window.KB_SUGG;if(!K)return;const q=id=>K.questions.find(x=>x.id===id);
 const pal=(q("area").options||[]).find(o=>o.id==="palmier");if(pal)pal.kw.ar.push("البلمير","بلمير","بالمير","البالمير");
 const c=K.categories.find(x=>x.id==="energy_water");if(c){c.kw.fr.push("économiser","économie d'eau","robinet");c.kw.ar.push("نوفر مية","توفير مية","نوفر كهربا","نوفر الكهربا")}
})();
