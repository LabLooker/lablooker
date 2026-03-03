/**
 * Expanded Symptoms Seeder for LabLooker
 * 
 * Adds 130+ new symptoms using patient-language from functional medicine,
 * thyroid, BHRT, PCOS, and chronic illness communities.
 * 
 * Usage: node supabase/seed-symptoms-expanded.mjs
 */

const SUPABASE_URL = 'https://cbeazeiehgiwhklxtdir.supabase.co';
const SERVICE_KEY = 'sb_secret_xT7abHdrbszgED4H4vNQ0A_OeFe-uLT';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

async function fetchAll(table, select = '*') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${select}&order=id&limit=1000`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

// Build a lookup: partial test name → test id (case-insensitive)
function buildTestLookup(tests) {
  const map = new Map();
  for (const t of tests) {
    map.set(t.test_name.toLowerCase(), t.id);
    // Also add common abbreviations
    const abbrevs = extractAbbreviations(t.test_name);
    for (const a of abbrevs) map.set(a.toLowerCase(), t.id);
  }
  return map;
}

function extractAbbreviations(name) {
  const abbrevs = [];
  // Extract content in parentheses: "TSH (Thyroid Stimulating Hormone)" → "TSH"
  const m = name.match(/^([^(]+)\s*\(/);
  if (m) abbrevs.push(m[1].trim());
  const m2 = name.match(/\(([^)]+)\)/);
  if (m2) abbrevs.push(m2[1].trim());
  return abbrevs;
}

function resolveTestIds(testNames, lookup) {
  const ids = [];
  for (const name of testNames) {
    const lower = name.toLowerCase();
    // Try exact match first
    if (lookup.has(lower)) { ids.push(lookup.get(lower)); continue; }
    // Try partial match
    let found = false;
    for (const [key, id] of lookup) {
      if (key.includes(lower) || lower.includes(key)) { ids.push(id); found = true; break; }
    }
    if (!found) {
      // Try even fuzzier - split words
      for (const [key, id] of lookup) {
        const words = lower.split(/\s+/);
        if (words.length > 1 && words.every(w => key.includes(w))) { ids.push(id); found = true; break; }
      }
    }
    if (!found) console.warn(`  ⚠ Could not find test: "${name}"`);
  }
  return [...new Set(ids)]; // deduplicate
}

// ── NEW SYMPTOMS TO ADD ──────────────────────────────────────────────
// Using patient-language from Reddit, STTM, functional medicine forums
const NEW_SYMPTOMS = [
  // THYROID / ENERGY
  { name: "Can't lose weight", keywords: ["cant lose weight", "weight loss resistance", "stuck weight", "plateau", "diet not working", "metabolism slow"], tests: ["fasting insulin", "tsh", "free t3", "cortisol", "dhea-s", "leptin", "hba1c"] },
  { name: "Always tired no matter how much I sleep", keywords: ["always tired", "tired all the time", "exhausted", "chronic fatigue", "no energy", "wiped out"], tests: ["free t3", "ferritin", "vitamin d", "vitamin b12", "cortisol", "cbc with differential", "fasting insulin", "iron"] },
  { name: "Cold hands and feet", keywords: ["cold hands", "cold feet", "freezing extremities", "poor circulation hands", "cold fingers", "cold toes"], tests: ["free t3", "reverse t3", "ferritin", "cbc with differential", "tsh"] },
  { name: "Racing thoughts", keywords: ["racing thoughts", "cant turn off brain", "mind wont stop", "overthinking", "mental chatter"], tests: ["tsh", "free t3", "cortisol", "magnesium", "ferritin"] },
  { name: "Thinning eyebrows", keywords: ["thinning eyebrows", "losing outer eyebrows", "eyebrow loss", "no eyebrows", "sparse eyebrows"], tests: ["tsh", "free t3", "anti-tpo", "zinc", "biotin"] },
  { name: "Puffy face", keywords: ["puffy face", "facial swelling", "moon face", "swollen face", "bloated face", "myxedema"], tests: ["tsh", "free t3", "albumin", "cortisol", "bmp"] },
  { name: "Hoarse voice", keywords: ["hoarse voice", "raspy voice", "voice changes", "deep voice", "scratchy throat"], tests: ["tsh", "free t3", "free t4", "anti-tpo"] },
  { name: "Slow reflexes", keywords: ["slow reflexes", "delayed reflexes", "sluggish reflexes", "slow reaction time"], tests: ["tsh", "free t3", "vitamin b12", "calcium"] },
  { name: "Sensitivity to cold", keywords: ["sensitive to cold", "always cold", "cold all the time", "freezing", "need extra blankets", "wearing layers"], tests: ["free t3", "reverse t3", "ferritin", "cbc with differential", "tsh"] },
  { name: "Heat intolerance", keywords: ["heat intolerance", "cant stand heat", "overheating easily", "always hot", "sweating in cold weather"], tests: ["tsh", "free t3", "cortisol", "tsi"] },
  
  // HORMONES / BHRT / TRT
  { name: "Night sweats", keywords: ["night sweats", "sweating at night", "waking up drenched", "soaking sheets", "hot flashes at night"], tests: ["estradiol", "fsh", "lh", "cortisol", "tsh", "testosterone"] },
  { name: "Hot flashes", keywords: ["hot flashes", "hot flushes", "sudden heat", "flushing", "power surges"], tests: ["estradiol", "fsh", "lh", "tsh", "progesterone"] },
  { name: "Vaginal dryness", keywords: ["vaginal dryness", "dryness down there", "painful intercourse", "atrophic vaginitis"], tests: ["estradiol", "fsh", "lh", "dhea-s", "testosterone"] },
  { name: "Erectile dysfunction", keywords: ["erectile dysfunction", "ED", "cant get hard", "trouble getting erect", "weak erections", "performance issues"], tests: ["testosterone", "free testosterone", "estradiol", "shbg", "prolactin", "tsh", "lipid panel", "hba1c"] },
  { name: "Low motivation", keywords: ["no motivation", "low motivation", "cant get started", "apathetic", "dont care anymore", "no drive"], tests: ["testosterone", "free testosterone", "tsh", "free t3", "cortisol", "vitamin d", "dhea-s"] },
  { name: "Irritability", keywords: ["irritable", "irritability", "snappy", "short fuse", "angry for no reason", "rage", "easily annoyed"], tests: ["testosterone", "estradiol", "progesterone", "tsh", "free t3", "cortisol", "magnesium", "ferritin"] },
  { name: "Gynecomastia / man boobs", keywords: ["gynecomastia", "man boobs", "chest fat", "breast tissue growth", "puffy nipples"], tests: ["estradiol", "testosterone", "free testosterone", "shbg", "prolactin", "liver function"] },
  { name: "Testicular atrophy", keywords: ["testicular atrophy", "shrinking testicles", "small testicles", "balls shrinking"], tests: ["testosterone", "fsh", "lh", "estradiol", "prolactin", "hcg"] },
  { name: "PMS symptoms severe", keywords: ["bad pms", "severe pms", "pmdd", "premenstrual", "pms rage", "pms depression", "pms bloating"], tests: ["estradiol", "progesterone", "tsh", "magnesium", "vitamin b6", "cortisol", "dhea-s"] },
  { name: "Perimenopause symptoms", keywords: ["perimenopause", "menopause transition", "periods changing", "irregular cycles", "skipping periods"], tests: ["fsh", "lh", "estradiol", "progesterone", "tsh", "amh", "dhea-s"] },
  
  // METABOLIC / DIABETES / INSULIN
  { name: "Sugar cravings", keywords: ["sugar cravings", "craving sweets", "carb cravings", "need sugar", "sweet tooth"], tests: ["fasting insulin", "glucose", "hba1c", "chromium", "magnesium", "cortisol"] },
  { name: "Afternoon energy crash", keywords: ["afternoon crash", "3pm slump", "energy crash", "post-lunch fatigue", "afternoon fatigue", "midday tired"], tests: ["fasting insulin", "glucose", "hba1c", "cortisol", "free t3", "ferritin"] },
  { name: "Reactive hypoglycemia", keywords: ["reactive hypoglycemia", "blood sugar crash", "shaky after eating", "dizzy after meals", "hangry"], tests: ["fasting insulin", "glucose", "hba1c", "cortisol", "c-peptide"] },
  { name: "Dark skin patches", keywords: ["dark skin patches", "acanthosis nigricans", "dark neck", "dark armpits", "skin tags"], tests: ["fasting insulin", "glucose", "hba1c", "homa-ir"] },
  { name: "Excessive thirst", keywords: ["excessive thirst", "always thirsty", "dry mouth constantly", "cant quench thirst", "polydipsia"], tests: ["glucose", "hba1c", "bmp", "calcium", "pth"] },
  { name: "Frequent urination at night", keywords: ["peeing at night", "nocturia", "waking to pee", "frequent urination night", "getting up to pee"], tests: ["glucose", "hba1c", "bmp", "calcium", "pth", "psa"] },
  
  // GUT / DIGESTIVE
  { name: "Bloating after eating", keywords: ["bloating", "bloated after eating", "food baby", "distended belly", "stomach bloat", "puffy belly"], tests: ["tsh", "fasting insulin", "anti-tissue transglutaminase", "zonulin", "fecal calprotectin", "gastrin"] },
  { name: "Acid reflux / GERD", keywords: ["acid reflux", "GERD", "heartburn", "stomach acid", "burning throat", "indigestion"], tests: ["gastrin", "tsh", "h. pylori", "bmp"] },
  { name: "Food sensitivities", keywords: ["food sensitivities", "food reactions", "food intolerance", "cant eat anything", "foods make me sick", "gluten sensitivity"], tests: ["anti-tissue transglutaminase", "deamidated gliadin", "iga", "zonulin", "tsh"] },
  { name: "SIBO symptoms", keywords: ["SIBO", "small intestinal bacterial overgrowth", "gas bloating", "belching", "distension"], tests: ["tsh", "free t3", "gastrin", "fecal calprotectin", "secretory iga"] },
  { name: "Leaky gut concerns", keywords: ["leaky gut", "intestinal permeability", "gut barrier", "gut lining damage"], tests: ["zonulin", "secretory iga", "anti-tissue transglutaminase", "crp", "vitamin d"] },
  { name: "Chronic diarrhea or loose stools", keywords: ["chronic diarrhea", "loose stools", "urgent bowel", "watery stool", "cant trust a fart"], tests: ["fecal calprotectin", "lactoferrin", "anti-tissue transglutaminase", "tsh", "cortisol", "iga"] },
  
  // AUTOIMMUNE
  { name: "Hashimoto's flare", keywords: ["hashimotos flare", "thyroid flare", "autoimmune flare", "hashi flare", "antibodies rising"], tests: ["anti-tpo", "anti-thyroglobulin", "tsh", "free t3", "free t4", "crp", "esr", "vitamin d"] },
  { name: "Lupus-like symptoms", keywords: ["lupus symptoms", "butterfly rash", "sun sensitivity", "joint swelling", "lupus flare"], tests: ["ana", "anti-dsdna", "complement c3", "complement c4", "esr", "crp", "cbc with differential", "urinalysis"] },
  { name: "Raynaud's phenomenon", keywords: ["raynauds", "white fingers", "blue fingers", "cold fingers color change", "fingers turn white"], tests: ["ana", "anti-centromere", "esr", "crp", "tsh", "cbc with differential"] },
  { name: "Dry eyes / dry mouth", keywords: ["dry eyes", "dry mouth", "sjogrens", "gritty eyes", "no tears", "no saliva"], tests: ["ana", "anti-ssa", "anti-ssb", "esr", "crp", "iga", "tsh"] },
  
  // PCOS / WOMEN'S HEALTH
  { name: "PCOS symptoms", keywords: ["pcos", "polycystic ovary", "ovarian cysts", "anovulation", "irregular cycles pcos"], tests: ["testosterone", "free testosterone", "dhea-s", "fasting insulin", "lh", "fsh", "amh", "estradiol", "hba1c", "shbg"] },
  { name: "Facial hair growth", keywords: ["facial hair", "chin hair", "hirsutism", "unwanted hair", "beard growth female", "upper lip hair"], tests: ["testosterone", "free testosterone", "dhea-s", "fasting insulin", "17-oh progesterone", "dht"] },
  { name: "Heavy periods", keywords: ["heavy periods", "flooding", "soaking through pads", "menorrhagia", "clots in period", "heavy bleeding"], tests: ["ferritin", "iron", "tsh", "progesterone", "estradiol", "cbc with differential", "platelet count"] },
  { name: "Irregular periods", keywords: ["irregular periods", "missed period", "late period", "skipping periods", "cycle all over the place"], tests: ["estradiol", "fsh", "lh", "progesterone", "tsh", "dhea-s", "amh", "prolactin"] },
  { name: "Infertility concerns", keywords: ["infertility", "cant get pregnant", "trouble conceiving", "trying to conceive", "TTC", "fertility issues"], tests: ["fsh", "lh", "amh", "estradiol", "progesterone", "tsh", "prolactin", "vitamin d", "dhea-s", "anti-tpo"] },
  { name: "Endometriosis symptoms", keywords: ["endometriosis", "endo", "painful periods", "pelvic pain", "endo flare", "pain with periods"], tests: ["estradiol", "progesterone", "ca-125", "crp", "vitamin d", "ferritin"] },
  { name: "Recurrent miscarriage", keywords: ["miscarriage", "recurrent loss", "pregnancy loss", "chemical pregnancy", "early miscarriage"], tests: ["progesterone", "tsh", "anti-tpo", "antiphospholipid panel", "anticardiolipin", "lupus anticoagulant", "vitamin d", "mthfr"] },
  
  // ADRENAL / CORTISOL
  { name: "Wired but tired", keywords: ["wired but tired", "exhausted but cant sleep", "tired and wired", "adrenal fatigue", "wired at bedtime"], tests: ["cortisol, salivary", "cortisol, am", "dhea-s", "tsh", "magnesium", "melatonin"] },
  { name: "Cortisol belly fat", keywords: ["belly fat", "cortisol belly", "stubborn belly fat", "midsection weight", "stress belly", "visceral fat"], tests: ["cortisol, am", "fasting insulin", "dhea-s", "tsh", "hba1c", "leptin"] },
  { name: "Adrenal crash", keywords: ["adrenal crash", "adrenal fatigue", "burnout", "hpa axis", "adrenal exhaustion", "total exhaustion"], tests: ["cortisol, am", "cortisol, salivary", "dhea-s", "acth", "sodium", "potassium", "aldosterone"] },
  { name: "Salt cravings", keywords: ["salt cravings", "craving salt", "need salty foods", "low sodium symptoms", "electrolyte imbalance"], tests: ["cortisol, am", "aldosterone", "renin", "sodium", "potassium", "bmp"] },
  { name: "Orthostatic hypotension", keywords: ["dizzy standing up", "lightheaded standing", "orthostatic", "blood pressure drops", "seeing stars when standing"], tests: ["cortisol, am", "aldosterone", "bmp", "cbc with differential", "tsh", "ferritin"] },
  
  // NUTRIENT DEFICIENCIES
  { name: "Numbness and tingling in hands/feet", keywords: ["numbness", "tingling", "pins and needles", "neuropathy", "tingling hands", "tingling feet"], tests: ["vitamin b12", "folate", "vitamin d", "tsh", "hba1c", "methylmalonic acid", "magnesium"] },
  { name: "Burning feet at night", keywords: ["burning feet", "feet burn at night", "hot feet", "foot pain night", "peripheral neuropathy feet"], tests: ["vitamin b12", "folate", "hba1c", "tsh", "methylmalonic acid"] },
  { name: "Restless legs", keywords: ["restless legs", "rls", "leg restlessness", "need to move legs", "restless leg syndrome", "jimmy legs"], tests: ["ferritin", "magnesium", "folate", "vitamin b12", "tsh", "iron"] },
  { name: "Muscle cramps at night", keywords: ["muscle cramps", "night cramps", "charley horse", "leg cramps", "calf cramps night"], tests: ["magnesium", "calcium", "potassium", "vitamin d", "bmp"] },
  { name: "Easy bruising", keywords: ["bruise easily", "easy bruising", "unexplained bruises", "bruises from nothing"], tests: ["cbc with differential", "platelet count", "vitamin c", "vitamin k1", "pt/inr"] },
  { name: "Bone pain / osteoporosis risk", keywords: ["bone pain", "osteoporosis", "bone loss", "weak bones", "fracture risk", "bone density"], tests: ["vitamin d", "calcium", "pth", "alp", "magnesium", "phosphorus"] },
  
  // CARDIOVASCULAR
  { name: "Heart palpitations at rest", keywords: ["heart palpitations", "skipped beats", "heart racing resting", "irregular heartbeat", "heart flutter"], tests: ["tsh", "free t3", "magnesium", "potassium", "calcium", "cbc with differential", "ferritin", "bnp"] },
  { name: "High blood pressure unexplained", keywords: ["high blood pressure", "hypertension", "blood pressure wont come down", "resistant hypertension"], tests: ["bmp", "cortisol", "aldosterone", "renin", "tsh", "cbc with differential", "hba1c", "lipid panel"] },
  { name: "Chest tightness / pressure", keywords: ["chest tightness", "chest pressure", "tight chest", "chest squeezing", "chest discomfort"], tests: ["cbc with differential", "lipid panel", "hs-crp", "homocysteine", "magnesium", "troponin i", "bnp"] },
  { name: "Poor circulation", keywords: ["poor circulation", "cold limbs", "numbness extremities", "blue fingers toes", "tingling limbs"], tests: ["cbc with differential", "ferritin", "tsh", "free t3", "hba1c", "lipid panel", "homocysteine"] },
  
  // SKIN / HAIR / NAILS
  { name: "Adult acne (hormonal)", keywords: ["adult acne", "hormonal acne", "jawline acne", "chin acne", "cystic acne", "breakouts adult"], tests: ["dhea-s", "testosterone", "free testosterone", "fasting insulin", "igf-1", "dht"] },
  { name: "Dry brittle nails", keywords: ["brittle nails", "dry nails", "breaking nails", "ridged nails", "peeling nails", "nail problems"], tests: ["tsh", "free t3", "ferritin", "zinc", "biotin", "vitamin d"] },
  { name: "Thinning hair / shedding", keywords: ["hair shedding", "thinning hair", "hair falling out", "losing handfuls of hair", "hair loss shower", "bald spots"], tests: ["ferritin", "tsh", "free t3", "dhea-s", "testosterone", "zinc", "vitamin b12", "vitamin d", "dht"] },
  { name: "Dry cracked skin", keywords: ["dry skin", "cracked skin", "scaly skin", "rough skin", "flaky skin", "crocodile skin"], tests: ["tsh", "free t3", "vitamin d", "omega-3 index", "zinc", "vitamin a"] },
  { name: "Yellowing skin", keywords: ["yellow skin", "jaundice", "yellowing eyes", "yellow tint", "sallow skin"], tests: ["bilirubin", "alt", "ast", "ggt", "cbc with differential", "hepatic function"] },
  { name: "Dark circles under eyes", keywords: ["dark circles", "under eye circles", "raccoon eyes", "bags under eyes", "tired looking eyes"], tests: ["ferritin", "iron", "cbc with differential", "tsh", "cortisol", "vitamin d", "vitamin b12"] },
  { name: "Eczema / psoriasis flares", keywords: ["eczema", "psoriasis", "skin flares", "itchy skin patches", "autoimmune skin", "dermatitis"], tests: ["vitamin d", "zinc", "omega-3 index", "ige", "tsh", "crp", "anti-tissue transglutaminase"] },
  
  // NEUROLOGICAL / COGNITIVE
  { name: "Memory problems", keywords: ["memory problems", "forgetful", "losing words", "cant remember things", "senior moments", "memory lapses"], tests: ["free t3", "vitamin d", "vitamin b12", "homocysteine", "folate", "fasting insulin", "tsh"] },
  { name: "Brain fog after eating", keywords: ["brain fog after eating", "foggy after meals", "food coma", "mental fog after food", "cognitive issues after eating"], tests: ["fasting insulin", "hba1c", "anti-tissue transglutaminase", "zonulin", "tsh", "free t3"] },
  { name: "Tinnitus / ear ringing", keywords: ["tinnitus", "ear ringing", "ringing in ears", "buzzing ears", "whooshing sound"], tests: ["tsh", "free t3", "ferritin", "magnesium", "calcium", "vitamin b12"] },
  { name: "Noise sensitivity", keywords: ["noise sensitivity", "sound sensitivity", "misophonia", "cant stand loud noises", "hyperacusis"], tests: ["magnesium", "tsh", "ferritin", "cortisol", "vitamin b12"] },
  { name: "Light sensitivity", keywords: ["light sensitivity", "photophobia", "cant stand bright lights", "eyes hurt in light", "squinting"], tests: ["magnesium", "vitamin b2", "tsh", "vitamin d", "cortisol"] },
  { name: "Vertigo / room spinning", keywords: ["vertigo", "room spinning", "world spinning", "balance issues", "vestibular"], tests: ["vitamin d", "vitamin b12", "ferritin", "tsh", "bmp", "cbc with differential"] },
  
  // MOOD / MENTAL HEALTH
  { name: "Anxiety with no obvious cause", keywords: ["anxiety no reason", "random anxiety", "generalized anxiety", "anxious all the time", "panic attacks", "nervous for no reason"], tests: ["free t3", "magnesium", "vitamin b12", "vitamin d", "cortisol", "dhea-s", "ferritin", "tsh"] },
  { name: "Depression that won't lift", keywords: ["treatment resistant depression", "depression wont go away", "chronic depression", "nothing works for depression", "persistent depression"], tests: ["vitamin d", "free t3", "vitamin b12", "folate", "ferritin", "cortisol", "dhea-s", "tsh", "testosterone"] },
  { name: "Mood swings / emotional rollercoaster", keywords: ["mood swings", "emotional rollercoaster", "up and down mood", "crying for no reason", "emotional outbursts"], tests: ["estradiol", "progesterone", "tsh", "free t3", "cortisol", "dhea-s", "vitamin d", "magnesium"] },
  { name: "Rage / anger outbursts", keywords: ["rage", "anger outbursts", "flying off handle", "seeing red", "uncontrollable anger", "roid rage"], tests: ["testosterone", "estradiol", "cortisol", "tsh", "free t3", "magnesium", "ferritin"] },
  { name: "Loss of interest in everything", keywords: ["anhedonia", "lost interest", "nothing is fun", "dont enjoy anything", "apathy", "flat affect"], tests: ["testosterone", "free testosterone", "tsh", "free t3", "vitamin d", "vitamin b12", "cortisol", "dhea-s"] },
  
  // SLEEP
  { name: "Waking up at 3-4am", keywords: ["waking at 3am", "waking at 4am", "early morning waking", "cant sleep through night", "cortisol awakening"], tests: ["cortisol, salivary", "glucose", "fasting insulin", "magnesium", "melatonin", "tsh"] },
  { name: "Unrefreshing sleep", keywords: ["unrefreshing sleep", "wake up tired", "not rested", "sleep doesnt help", "exhausted after sleeping"], tests: ["free t3", "ferritin", "cortisol", "vitamin d", "magnesium", "vitamin b12", "tsh"] },
  { name: "Insomnia - can't fall asleep", keywords: ["cant fall asleep", "insomnia", "mind racing bedtime", "takes hours to sleep", "lying awake"], tests: ["cortisol, salivary", "magnesium", "tsh", "progesterone", "melatonin", "ferritin"] },
  
  // RESPIRATORY / ENT
  { name: "Shortness of breath on exertion", keywords: ["short of breath", "winded easily", "cant breathe exercising", "exercise intolerance breathing", "gasping"], tests: ["cbc with differential", "ferritin", "bmp", "tsh", "bnp", "vitamin d"] },
  { name: "Air hunger", keywords: ["air hunger", "cant get full breath", "need to yawn", "sighing constantly", "cant catch breath", "suffocating feeling"], tests: ["ferritin", "cbc with differential", "cortisol", "tsh", "bmp", "magnesium"] },
  { name: "Chronic sinus issues", keywords: ["chronic sinusitis", "sinus infections", "stuffy nose always", "sinus pressure", "post nasal drip"], tests: ["ige", "iga", "vitamin d", "zinc", "cbc with differential", "crp"] },
  
  // MUSCULOSKELETAL
  { name: "Muscle weakness / wasting", keywords: ["muscle weakness", "losing muscle", "cant lift things", "weak arms", "weak legs", "sarcopenia"], tests: ["vitamin d", "magnesium", "tsh", "free t3", "potassium", "ck", "testosterone", "igf-1"] },
  { name: "Joint stiffness morning", keywords: ["morning stiffness", "stiff joints", "takes time to loosen up", "joints stiff in morning", "creaky joints"], tests: ["crp", "esr", "ana", "rheumatoid factor", "uric acid", "vitamin d", "anti-ccp"] },
  { name: "Body aches all over", keywords: ["body aches", "aching all over", "everything hurts", "fibromyalgia", "widespread pain", "whole body pain"], tests: ["vitamin d", "magnesium", "tsh", "crp", "esr", "cbc with differential", "ferritin", "vitamin b12"] },
  { name: "Neck and shoulder tension", keywords: ["neck tension", "shoulder tension", "tight shoulders", "neck pain chronic", "tension headache"], tests: ["magnesium", "tsh", "vitamin d", "cortisol", "calcium"] },
  { name: "Back pain chronic", keywords: ["chronic back pain", "lower back pain", "back always hurts", "spine pain"], tests: ["vitamin d", "calcium", "pth", "crp", "esr", "magnesium"] },
  
  // URINARY
  { name: "Kidney stone history", keywords: ["kidney stones", "renal calculi", "stone former", "passing stones", "kidney pain"], tests: ["calcium", "pth", "uric acid", "vitamin d", "24-hour urine kidney stone panel", "bmp", "phosphorus"] },
  { name: "Dark urine", keywords: ["dark urine", "brown urine", "cola colored urine", "dark pee", "urine color change"], tests: ["bilirubin", "alt", "ast", "urinalysis", "cbc with differential", "ck"] },
  
  // POST-COVID / CHRONIC ILLNESS
  { name: "Post-COVID fatigue / long COVID", keywords: ["long covid", "post covid", "covid fatigue", "post viral fatigue", "long hauler", "never recovered after covid"], tests: ["cbc with differential", "crp", "d-dimer", "ferritin", "vitamin d", "vitamin b12", "free t3", "tsh", "cortisol"] },
  { name: "Post-viral fatigue", keywords: ["post viral", "after being sick", "never recovered", "mono fatigue", "EBV reactivation", "chronic fatigue syndrome"], tests: ["cbc with differential", "ebv panel", "crp", "ferritin", "vitamin d", "cortisol", "tsh", "natural killer cells"] },
  { name: "Chronic fatigue syndrome", keywords: ["CFS", "ME/CFS", "myalgic encephalomyelitis", "chronic fatigue", "bedbound fatigue"], tests: ["cortisol", "dhea-s", "free t3", "ferritin", "vitamin d", "natural killer cells", "cbc with differential", "crp", "vitamin b12"] },
  { name: "Mast cell symptoms", keywords: ["mast cell", "MCAS", "histamine issues", "flushing episodes", "random allergic reactions", "mast cell activation"], tests: ["tryptase", "histamine", "crp", "ige", "cbc with differential", "vitamin d"] },
  
  // LIVER
  { name: "Elevated liver enzymes", keywords: ["high liver enzymes", "elevated alt", "elevated ast", "fatty liver", "liver problems", "NAFLD"], tests: ["alt", "ast", "ggt", "hepatic function", "hba1c", "fasting insulin", "lipid panel", "ferritin", "hepatitis b panel", "hepatitis c antibody"] },
  { name: "Fatty liver concerns", keywords: ["fatty liver", "NAFLD", "liver fat", "nonalcoholic fatty liver"], tests: ["alt", "ast", "ggt", "fasting insulin", "hba1c", "lipid panel", "ferritin", "hepatic function"] },
  
  // IMMUNE
  { name: "Getting sick constantly", keywords: ["always getting sick", "catch everything", "constant colds", "low immunity", "immune system weak"], tests: ["vitamin d", "zinc", "cbc with differential", "igg", "iga", "igm", "ferritin", "vitamin c"] },
  { name: "Swollen lymph nodes", keywords: ["swollen lymph nodes", "swollen glands", "lymph node pain", "lumps in neck", "glands swollen"], tests: ["cbc with differential", "crp", "esr", "ebv panel", "cmv", "lactate dehydrogenase"] },
  
  // SPECIFIC CONDITIONS
  { name: "Thyroid nodules / lumps", keywords: ["thyroid nodule", "thyroid lump", "lump in throat", "nodule on thyroid", "thyroid mass"], tests: ["tsh", "free t3", "free t4", "anti-tpo", "anti-thyroglobulin", "calcitonin", "thyroglobulin"] },
  { name: "Graves disease symptoms", keywords: ["graves disease", "hyperthyroid", "overactive thyroid", "bulging eyes", "graves"], tests: ["tsh", "free t3", "free t4", "tsi", "trab", "anti-tpo"] },
  { name: "Lyme disease concerns", keywords: ["lyme disease", "tick bite", "lyme symptoms", "chronic lyme", "bulls eye rash"], tests: ["lyme disease antibody", "lyme western blot", "cbc with differential", "crp", "esr", "vitamin d"] },
  
  // PAIN
  { name: "Headaches / migraines", keywords: ["headaches", "migraines", "chronic headaches", "migraine aura", "tension headaches", "head pain"], tests: ["magnesium", "tsh", "estradiol", "ferritin", "vitamin d", "homocysteine", "crp"] },
  { name: "Neuropathic pain", keywords: ["nerve pain", "neuropathy", "shooting pain", "burning pain", "electric shock pain", "pins needles pain"], tests: ["vitamin b12", "hba1c", "tsh", "methylmalonic acid", "folate", "vitamin d", "magnesium"] },
  
  // WEIGHT / BODY COMP
  { name: "Water retention / bloating", keywords: ["water retention", "retaining water", "bloated", "puffy", "swollen ankles", "fluid retention"], tests: ["albumin", "tsh", "estradiol", "progesterone", "cortisol", "bmp", "aldosterone"] },
  { name: "Unexplained weight loss", keywords: ["losing weight unintentionally", "weight dropping", "cant keep weight on", "wasting away"], tests: ["tsh", "free t3", "hba1c", "cbc with differential", "crp", "cmp", "cortisol"] },
  { name: "Belly fat that won't budge", keywords: ["stubborn belly fat", "midsection fat", "spare tire", "visceral fat", "apple shaped"], tests: ["fasting insulin", "cortisol", "dhea-s", "tsh", "hba1c", "leptin", "testosterone"] },
  
  // LONGEVITY / PREVENTIVE
  { name: "Family history of heart disease", keywords: ["heart disease family", "family history heart", "dad had heart attack", "cardiac risk", "hereditary cholesterol"], tests: ["lipid panel", "lipoprotein(a)", "apob", "hs-crp", "homocysteine", "hba1c", "fasting insulin", "small dense ldl"] },
  { name: "Family history of diabetes", keywords: ["diabetes family", "family history diabetes", "prediabetes concern", "sugar runs in family"], tests: ["fasting insulin", "glucose", "hba1c", "homa-ir", "c-peptide", "lipid panel"] },
  { name: "Premature aging concerns", keywords: ["aging fast", "premature aging", "looking old", "feeling old", "anti-aging labs"], tests: ["vitamin d", "dhea-s", "testosterone", "igf-1", "hba1c", "hs-crp", "homocysteine", "lipid panel", "fasting insulin"] },
  
  // MISC SYMPTOMS PATIENTS USE
  { name: "Excessive sweating", keywords: ["excessive sweating", "hyperhidrosis", "sweating too much", "always sweating", "drenched in sweat"], tests: ["tsh", "free t3", "cortisol", "glucose", "cbc with differential"] },
  { name: "Dry mouth", keywords: ["dry mouth", "cotton mouth", "no saliva", "xerostomia", "always need water"], tests: ["glucose", "hba1c", "ana", "anti-ssa", "anti-ssb", "tsh"] },
  { name: "Metallic taste in mouth", keywords: ["metallic taste", "taste of metal", "weird taste", "taste changes", "dysgeusia"], tests: ["zinc", "vitamin b12", "bmp", "tsh", "heavy metals panel"] },
  { name: "Loss of taste or smell", keywords: ["loss of taste", "loss of smell", "anosmia", "cant smell", "cant taste food"], tests: ["zinc", "vitamin b12", "vitamin d", "tsh", "sars-cov-2 antibody"] },
  { name: "Nausea", keywords: ["nausea", "nauseous", "feeling sick", "queasy", "want to throw up"], tests: ["bmp", "calcium", "tsh", "cortisol", "gastrin", "alt", "ast"] },
  { name: "Low-grade fever recurring", keywords: ["low grade fever", "99 degree temp", "recurring fever", "elevated temperature", "slightly feverish"], tests: ["cbc with differential", "crp", "esr", "ebv panel", "cortisol", "ana", "tsh"] },
  { name: "Feeling cold inside", keywords: ["cold inside", "internal chill", "bone cold", "cold to the core", "cant warm up"], tests: ["tsh", "free t3", "reverse t3", "ferritin", "cbc with differential", "cortisol"] },
  { name: "Swollen tongue", keywords: ["swollen tongue", "scalloped tongue", "tongue too big", "teeth marks on tongue", "macroglossia"], tests: ["tsh", "free t3", "vitamin b12", "iron", "ferritin"] },
  { name: "Difficulty swallowing", keywords: ["difficulty swallowing", "lump in throat", "dysphagia", "food gets stuck", "globus sensation"], tests: ["tsh", "free t3", "free t4", "anti-tpo", "ferritin", "iron"] },
  { name: "Carpal tunnel symptoms", keywords: ["carpal tunnel", "wrist pain", "hand numbness", "tingling hands typing", "wrist tingling"], tests: ["tsh", "free t3", "vitamin b6", "hba1c", "crp"] },
  { name: "Slow wound healing", keywords: ["wounds heal slowly", "slow healing", "cuts dont heal", "bruises last forever"], tests: ["glucose", "hba1c", "zinc", "vitamin c", "albumin", "vitamin d"] },
  { name: "Eye floaters / vision changes", keywords: ["eye floaters", "spots in vision", "blurry vision", "vision getting worse", "visual disturbances"], tests: ["hba1c", "glucose", "vitamin d", "tsh", "crp", "bmp"] },
  { name: "Recurrent UTIs", keywords: ["recurrent uti", "chronic utis", "bladder infections", "keeps getting utis", "uti wont go away"], tests: ["glucose", "hba1c", "urinalysis", "vitamin d", "estradiol"] },
  { name: "Low back pain with fatigue", keywords: ["low back pain fatigue", "back hurts and tired", "adrenal back pain", "flank pain fatigue"], tests: ["vitamin d", "calcium", "cortisol", "dhea-s", "tsh", "crp", "bmp"] },
  { name: "Snoring / sleep apnea", keywords: ["snoring", "sleep apnea", "stop breathing sleep", "cpap", "gasping at night"], tests: ["tsh", "free t3", "hba1c", "cbc with differential", "ferritin", "testosterone"] },
  { name: "Frequent yeast infections", keywords: ["yeast infections", "candida", "thrush", "recurrent yeast", "vaginal yeast"], tests: ["glucose", "hba1c", "fasting insulin", "vitamin d", "zinc", "cbc with differential"] },
  { name: "Libido changes on TRT", keywords: ["libido on trt", "sex drive trt", "trt not working", "libido dropped trt", "trt side effects"], tests: ["testosterone", "free testosterone", "estradiol, sensitive", "shbg", "prolactin", "hba1c", "lipid panel", "dht"] },
  { name: "Post-pill syndrome", keywords: ["post pill", "coming off birth control", "post pill acne", "post pill amenorrhea", "periods after pill"], tests: ["fsh", "lh", "estradiol", "progesterone", "tsh", "dhea-s", "testosterone", "prolactin"] },
  { name: "Breast tenderness", keywords: ["breast tenderness", "sore breasts", "breast pain", "mastalgia", "tender breasts"], tests: ["estradiol", "progesterone", "prolactin", "tsh", "vitamin e"] },
  { name: "Tremor / shaking hands", keywords: ["tremor", "shaking hands", "hand tremor", "shaky hands", "essential tremor"], tests: ["tsh", "free t3", "magnesium", "cortisol", "glucose", "bmp"] },
  { name: "Blood sugar roller coaster", keywords: ["blood sugar swings", "sugar highs and lows", "blood sugar roller coaster", "glycemic variability"], tests: ["fasting insulin", "glucose", "hba1c", "homa-ir", "c-peptide", "cortisol"] },
  { name: "Gout / high uric acid", keywords: ["gout", "high uric acid", "gout attack", "toe pain gout", "crystal arthritis"], tests: ["uric acid", "bmp", "crp", "esr", "cbc with differential"] },
  { name: "Iron overload concerns", keywords: ["iron overload", "hemochromatosis", "high ferritin", "too much iron", "hereditary hemochromatosis"], tests: ["ferritin", "iron", "tibc", "transferrin saturation", "alt", "ast", "hba1c", "glucose"] },
  { name: "B12 deficiency symptoms", keywords: ["b12 deficiency", "pernicious anemia", "low b12", "b12 too low", "methylcobalamin"], tests: ["vitamin b12", "methylmalonic acid", "folate", "homocysteine", "cbc with differential", "reticulocyte count"] },
  { name: "Vitamin D deficiency symptoms", keywords: ["vitamin d deficiency", "low vitamin d", "sunshine vitamin", "d deficient"], tests: ["vitamin d, 25-oh", "calcium", "pth", "magnesium", "phosphorus"] },
  { name: "High cholesterol on thyroid meds", keywords: ["cholesterol thyroid", "high cholesterol hypothyroid", "ldl wont come down", "statin thyroid"], tests: ["lipid panel", "tsh", "free t3", "apob", "lipoprotein(a)", "hs-crp", "fasting insulin"] },
  { name: "Digestive issues after gallbladder removal", keywords: ["post cholecystectomy", "no gallbladder digestion", "bile issues", "fat malabsorption", "diarrhea after gallbladder"], tests: ["hepatic function", "bile acids", "vitamin d", "vitamin a", "vitamin k1", "lipid panel"] },
  { name: "Chronic pain widespread", keywords: ["chronic pain", "fibromyalgia pain", "pain everywhere", "widespread pain syndrome"], tests: ["vitamin d", "magnesium", "crp", "esr", "tsh", "vitamin b12", "ferritin", "ana"] },
  { name: "Post-partum symptoms", keywords: ["postpartum", "post partum", "after baby symptoms", "postpartum thyroiditis", "postpartum depression"], tests: ["tsh", "free t3", "free t4", "anti-tpo", "ferritin", "iron", "vitamin d", "cbc with differential", "vitamin b12"] },
];

async function main() {
  console.log('🔬 LabLooker Expanded Symptoms Seeder\n');
  
  // Fetch existing data
  console.log('📥 Fetching existing tests...');
  const tests = await fetchAll('tests', 'id,test_name');
  console.log(`   Found ${tests.length} tests`);
  
  console.log('📥 Fetching existing symptoms...');
  const existingSymptoms = await fetchAll('symptoms', 'id,name');
  console.log(`   Found ${existingSymptoms.length} existing symptoms`);
  
  // Build lookup
  const testLookup = buildTestLookup(tests);
  const existingNames = new Set(existingSymptoms.map(s => s.name.toLowerCase()));
  
  // Filter out duplicates
  const toInsert = [];
  let skipped = 0;
  
  for (const sym of NEW_SYMPTOMS) {
    if (existingNames.has(sym.name.toLowerCase())) {
      console.log(`   ⏭ Skipping existing: "${sym.name}"`);
      skipped++;
      continue;
    }
    
    const relatedTestIds = resolveTestIds(sym.tests, testLookup);
    
    toInsert.push({
      name: sym.name,
      keywords: sym.keywords,
      related_test_ids: relatedTestIds,
    });
  }
  
  console.log(`\n📊 Summary: ${toInsert.length} new symptoms to insert, ${skipped} skipped (duplicates)`);
  
  if (toInsert.length === 0) {
    console.log('Nothing to insert!');
    return;
  }
  
  // Insert in batches of 25
  const BATCH_SIZE = 25;
  let inserted = 0;
  
  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);
    console.log(`\n📤 Inserting batch ${Math.floor(i/BATCH_SIZE) + 1} (${batch.length} symptoms)...`);
    
    const res = await fetch(`${SUPABASE_URL}/rest/v1/symptoms`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify(batch),
    });
    
    if (!res.ok) {
      const err = await res.text();
      console.error(`   ❌ Error: ${res.status} - ${err}`);
      // Try inserting one by one to find the problem
      for (const item of batch) {
        const singleRes = await fetch(`${SUPABASE_URL}/rest/v1/symptoms`, {
          method: 'POST',
          headers: { ...headers, 'Prefer': 'return=representation' },
          body: JSON.stringify([item]),
        });
        if (singleRes.ok) {
          inserted++;
          console.log(`   ✅ ${item.name}`);
        } else {
          const singleErr = await singleRes.text();
          console.error(`   ❌ Failed: "${item.name}" - ${singleErr}`);
        }
      }
    } else {
      const result = await res.json();
      inserted += result.length;
      for (const r of result) {
        console.log(`   ✅ ${r.name} (${r.related_test_ids?.length || 0} tests linked)`);
      }
    }
  }
  
  console.log(`\n🎉 Done! Inserted ${inserted} new symptoms.`);
  console.log(`   Total symptoms now: ${existingSymptoms.length + inserted}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
