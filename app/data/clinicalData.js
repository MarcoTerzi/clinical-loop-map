const MAP_WIDTH = 320;

function mirrorX(x, width) {
  return MAP_WIDTH - x - width;
}

function makeArea(view, side, spec, xOverride) {
  const [id, label, region, x, y, width, height, tags = [], kind = "rect"] = spec;
  const xPos = xOverride ?? x;

  return {
    id: `${view}-${side}-${id}`,
    view,
    side,
    code: id,
    label: side === "center" ? label : `${label} ${side.toUpperCase()}`,
    region,
    tags,
    shape: {
      kind,
      x: xPos,
      y,
      width,
      height,
      rx: Math.min(10, Math.max(4, Math.round(Math.min(width, height) / 3))),
    },
  };
}

function pair(view, spec) {
  const [, , , x, , width] = spec;
  return [
    makeArea(view, "dx", spec, x),
    makeArea(view, "sx", spec, mirrorX(x, width)),
  ];
}

function center(view, spec) {
  return makeArea(view, "center", spec);
}

const frontPairs = [
  ["temple", "Tempia", "testa", 118, 32, 18, 28, ["cefalea"], "ellipse"],
  ["orbit", "Orbita", "testa", 124, 55, 20, 16, ["dolore"], "ellipse"],
  ["cheek", "Zigomo", "testa", 121, 73, 24, 18, ["dolore"], "ellipse"],
  ["jaw_angle", "Angolo mandibolare", "testa", 124, 91, 22, 16, ["dolore"], "ellipse"],
  ["sternocleidomastoid", "Sternocleidomastoideo", "collo", 130, 111, 20, 34, ["trigger", "rom"]],
  ["supraclavicular", "Sovraclaveare", "collo", 106, 139, 44, 18, ["red flag"]],
  ["clavicle", "Clavicola", "spalla", 105, 155, 48, 16, ["trauma"]],
  ["anterior_deltoid", "Deltoide anteriore", "spalla", 76, 165, 38, 44, ["forza", "dolore"], "ellipse"],
  ["upper_pectoral", "Pettorale alto", "torace", 106, 178, 48, 40, ["dolore", "forza"]],
  ["lower_pectoral", "Pettorale basso", "torace", 107, 219, 47, 38, ["respirazione"]],
  ["lateral_ribs", "Coste laterali", "torace", 92, 244, 39, 56, ["dolore"]],
  ["external_oblique", "Obliquo esterno", "addome", 98, 302, 42, 58, ["forza"]],
  ["iliac_crest", "Cresta iliaca", "bacino", 100, 366, 49, 24, ["asimmetria"]],
  ["inguinal", "Inguinale", "bacino", 111, 393, 39, 32, ["dolore"]],
  ["biceps_proximal", "Bicipite prossimale", "braccio", 56, 218, 31, 47, ["forza"], "ellipse"],
  ["biceps_distal", "Bicipite distale", "braccio", 50, 266, 31, 47, ["forza"], "ellipse"],
  ["cubital_fossa", "Piega gomito", "gomito", 50, 314, 29, 25, ["dolore"]],
  ["forearm_flexor_proximal", "Flessori avambraccio prossimali", "avambraccio", 43, 341, 31, 52, ["forza"]],
  ["forearm_flexor_distal", "Flessori avambraccio distali", "avambraccio", 38, 394, 30, 48, ["rom"]],
  ["carpal_tunnel", "Tunnel carpale", "polso", 35, 444, 29, 22, ["neurologico"]],
  ["palm", "Palmo", "mano", 26, 468, 38, 38, ["sensibilita"]],
  ["thumb_palm", "Pollice palmare", "mano", 18, 479, 14, 30, ["presa"]],
  ["fingers_palm", "Dita palmari", "mano", 32, 508, 31, 30, ["presa"]],
  ["hip_flexor", "Flessore anca", "anca", 108, 427, 43, 41, ["rom", "forza"]],
  ["quadriceps_proximal", "Quadricipite prossimale", "coscia", 106, 471, 43, 58, ["forza"]],
  ["vastus_medialis", "Vasto mediale", "coscia", 127, 530, 26, 58, ["forza"]],
  ["vastus_lateralis", "Vasto laterale", "coscia", 101, 530, 26, 58, ["forza"]],
  ["patella", "Rotula", "ginocchio", 117, 592, 31, 31, ["dolore"], "ellipse"],
  ["medial_knee", "Ginocchio mediale", "ginocchio", 129, 624, 23, 30, ["stabilita"]],
  ["lateral_knee", "Ginocchio laterale", "ginocchio", 101, 624, 24, 30, ["stabilita"]],
  ["tibialis_anterior_proximal", "Tibiale anteriore prossimale", "gamba", 110, 657, 35, 55, ["forza"]],
  ["tibialis_anterior_distal", "Tibiale anteriore distale", "gamba", 112, 713, 31, 49, ["rom"]],
  ["medial_malleolus", "Malleolo mediale", "caviglia", 126, 763, 22, 23, ["dolore"]],
  ["lateral_ankle", "Caviglia laterale", "caviglia", 101, 763, 24, 23, ["stabilita"]],
  ["dorsum_foot", "Dorso piede", "piede", 103, 789, 48, 34, ["dolore"]],
  ["forefoot", "Avampiede", "piede", 99, 825, 54, 30, ["carico"]],
  ["hallux", "Alluce", "piede", 135, 857, 18, 20, ["carico"]],
  ["lateral_toes", "Dita laterali", "piede", 98, 857, 36, 20, ["carico"]],
];

const frontCenter = [
  ["frontal_scalp", "Scalpo frontale", "testa", 145, 17, 30, 18, ["cefalea"], "ellipse"],
  ["forehead", "Fronte", "testa", 142, 40, 36, 21, ["cefalea"], "ellipse"],
  ["nasal_bridge", "Piramide nasale", "testa", 151, 62, 18, 25, ["dolore"], "ellipse"],
  ["mouth", "Bocca", "testa", 146, 89, 28, 13, ["dolore"], "ellipse"],
  ["chin", "Mento", "testa", 146, 104, 28, 17, ["dolore"], "ellipse"],
  ["anterior_throat", "Gola anteriore", "collo", 142, 124, 36, 30, ["red flag"]],
  ["sternum", "Sterno", "torace", 147, 169, 26, 76, ["dolore"]],
  ["xiphoid", "Xifoide", "torace", 149, 247, 22, 25, ["dolore"]],
  ["epigastrium", "Epigastrio", "addome", 135, 274, 50, 40, ["viscerale"]],
  ["umbilical", "Ombelicale", "addome", 133, 317, 54, 44, ["viscerale"]],
  ["hypogastrium", "Ipogastrio", "addome", 133, 363, 54, 43, ["viscerale"]],
  ["pubic_symphysis", "Sinfisi pubica", "bacino", 142, 409, 36, 28, ["dolore"]],
];

const backPairs = [
  ["occipital_side", "Occipitale laterale", "testa", 119, 36, 22, 26, ["cefalea"], "ellipse"],
  ["upper_trapezius", "Trapezio superiore", "collo", 106, 126, 46, 36, ["trigger", "rom"]],
  ["posterior_deltoid", "Deltoide posteriore", "spalla", 76, 162, 39, 45, ["forza"], "ellipse"],
  ["scapular_spine", "Spina scapolare", "scapola", 101, 174, 51, 27, ["dolore"]],
  ["scapular_body", "Corpo scapolare", "scapola", 104, 202, 48, 53, ["trigger"]],
  ["rhomboid", "Romboidi", "dorso", 117, 257, 34, 42, ["trigger"]],
  ["posterior_ribs", "Coste posteriori", "torace", 94, 284, 43, 64, ["dolore"]],
  ["thoracolumbar_fascia", "Fascia toracolombare", "lombare", 102, 350, 43, 54, ["rom"]],
  ["quadratus_lumborum", "Quadrato dei lombi", "lombare", 110, 406, 38, 45, ["trigger", "rom"]],
  ["sacroiliac_joint", "Sacroiliaca", "bacino", 115, 454, 34, 30, ["dolore"]],
  ["gluteus_medius", "Gluteo medio", "anca", 95, 486, 54, 48, ["forza"], "ellipse"],
  ["gluteus_maximus", "Gluteo massimo", "anca", 100, 535, 49, 49, ["forza"], "ellipse"],
  ["triceps_proximal", "Tricipite prossimale", "braccio", 56, 217, 30, 47, ["forza"], "ellipse"],
  ["triceps_distal", "Tricipite distale", "braccio", 50, 265, 30, 46, ["forza"], "ellipse"],
  ["olecranon", "Olecrano", "gomito", 49, 313, 29, 24, ["dolore"]],
  ["forearm_extensor_proximal", "Estensori avambraccio prossimali", "avambraccio", 42, 340, 31, 52, ["forza"]],
  ["forearm_extensor_distal", "Estensori avambraccio distali", "avambraccio", 37, 393, 31, 49, ["rom"]],
  ["dorsal_wrist", "Polso dorsale", "polso", 35, 444, 29, 22, ["dolore"]],
  ["dorsal_hand", "Dorso mano", "mano", 26, 468, 38, 38, ["sensibilita"]],
  ["thumb_extensor", "Pollice dorsale", "mano", 18, 479, 14, 30, ["presa"]],
  ["dorsal_fingers", "Dita dorsali", "mano", 32, 508, 31, 30, ["presa"]],
  ["hamstring_proximal", "Ischiocrurali prossimali", "coscia", 105, 587, 45, 55, ["forza"]],
  ["hamstring_medial", "Ischiocrurali mediali", "coscia", 126, 644, 27, 55, ["forza"]],
  ["hamstring_lateral", "Ischiocrurali laterali", "coscia", 100, 644, 27, 55, ["forza"]],
  ["popliteal_fossa", "Cavo popliteo", "ginocchio", 114, 702, 35, 29, ["dolore"]],
  ["gastrocnemius_medial", "Gastrocnemio mediale", "gamba", 124, 733, 29, 56, ["forza"], "ellipse"],
  ["gastrocnemius_lateral", "Gastrocnemio laterale", "gamba", 99, 733, 29, 56, ["forza"], "ellipse"],
  ["achilles_tendon", "Tendine d'Achille", "caviglia", 118, 791, 29, 37, ["carico"]],
  ["calcaneus", "Calcagno", "piede", 111, 830, 40, 25, ["carico"]],
  ["plantar_foot", "Pianta piede", "piede", 102, 857, 50, 28, ["carico"]],
];

const backCenter = [
  ["posterior_scalp", "Scalpo posteriore", "testa", 143, 18, 34, 24, ["cefalea"], "ellipse"],
  ["cervical_spine", "Colonna cervicale", "colonna", 145, 93, 30, 74, ["rom", "red flag"]],
  ["thoracic_spine", "Colonna toracica", "colonna", 145, 170, 30, 165, ["rom"]],
  ["lumbar_spine", "Colonna lombare L1-L5", "colonna", 143, 338, 34, 113, ["rom", "dolore"]],
  ["sacrum", "Sacro e coccige", "bacino", 139, 456, 42, 59, ["dolore"]],
];

export const bodyAreas = [
  ...frontPairs.flatMap((spec) => pair("front", spec)),
  ...frontCenter.map((spec) => center("front", spec)),
  ...backPairs.flatMap((spec) => pair("back", spec)),
  ...backCenter.map((spec) => center("back", spec)),
];

export const bodyAreaCount = bodyAreas.length;
export const bodyRegionCount = new Set(bodyAreas.map((area) => area.region)).size;

export const patient = {
  name: "Giulia R.",
  age: 42,
  status: "in trattamento",
  tags: ["lombalgia", "caviglia sx", "PROM attivi"],
  practitioner: "Dr. Marco Bianchi",
  nextVisit: "29 giugno 2026, 09:30",
  consent: "consenso attivo",
  summary:
    "Dolore lombare ricorrente con deficit di estensione, instabilita residua di caviglia sinistra e dolore femoro-rotuleo destro in carico.",
};

export const patients = [
  { name: "Giulia R.", status: "in trattamento", risk: "alto", last: "oggi" },
  { name: "Luca P.", status: "monitoraggio", risk: "medio", last: "ieri" },
  { name: "Marta S.", status: "in trattamento", risk: "basso", last: "24 giu" },
  { name: "Enrico V.", status: "dimesso", risk: "basso", last: "18 giu" },
];

export const timeline = [
  { date: "2026-02-18", label: "18 feb" },
  { date: "2026-03-12", label: "12 mar" },
  { date: "2026-04-03", label: "3 apr" },
  { date: "2026-05-18", label: "18 mag" },
  { date: "2026-06-27", label: "oggi" },
];

export const findingFilters = [
  { id: "symptom", label: "Sintomi" },
  { id: "dysfunction", label: "Disfunzioni" },
  { id: "injury", label: "Eventi storici" },
  { id: "trigger", label: "Trigger point" },
  { id: "rom", label: "ROM" },
  { id: "strength", label: "Forza" },
];

export const findings = [
  {
    id: "f-lumbar-01",
    areaId: "back-center-lumbar_spine",
    type: "dysfunction",
    date: "2026-06-18",
    label: "Limitazione estensione L4-L5",
    severity: 0.86,
    taxonomy: "ICD-10 M54.5",
    source: "Valutazione operatore",
    note: "End-feel rigido, dolore 7/10 a fine range. Peggiora dopo seduta prolungata.",
    measures: [
      { label: "Estensione lombare", value: "-28%", trend: "-6% da marzo" },
      { label: "Dolore VAS", value: "7/10", trend: "+2" },
      { label: "Test ripetizione", value: "positivo", trend: "stabile" },
    ],
  },
  {
    id: "f-ankle-01",
    areaId: "front-sx-lateral_ankle",
    type: "dysfunction",
    date: "2026-06-11",
    label: "Instabilita in inversione",
    severity: 0.72,
    taxonomy: "ICPC-2 L77",
    source: "Assessment caviglia",
    note: "Star Excursion ridotto a sinistra, lieve apprensione in carico monopodalico.",
    measures: [
      { label: "SEBT anteriore", value: "-9 cm", trend: "+2 cm" },
      { label: "Forza eversori", value: "4-/5", trend: "migliora" },
    ],
  },
  {
    id: "f-knee-01",
    areaId: "front-dx-patella",
    type: "symptom",
    date: "2026-05-18",
    label: "Dolore femoro-rotuleo in squat",
    severity: 0.46,
    taxonomy: "ICD-10 M22.2",
    source: "Riferito dal paziente",
    note: "Dolore 4/10 oltre 70 gradi di flessione, senza versamento.",
    measures: [
      { label: "Dolore squat", value: "4/10", trend: "-1" },
      { label: "KOOS pain", value: "68/100", trend: "+6" },
    ],
  },
  {
    id: "f-scapula-01",
    areaId: "back-dx-scapular_body",
    type: "trigger",
    date: "2026-06-03",
    label: "Trigger point sottoscapolare",
    severity: 0.58,
    taxonomy: "custom: trigger point",
    source: "Palpazione",
    note: "Dolore riferito verso margine mediale scapolare, riproducibile.",
    measures: [
      { label: "Dolore palpazione", value: "6/10", trend: "nuovo" },
      { label: "Rotazione esterna", value: "-12 gradi", trend: "stabile" },
    ],
  },
  {
    id: "f-cervical-01",
    areaId: "back-center-cervical_spine",
    type: "rom",
    date: "2026-04-03",
    label: "Riduzione rotazione cervicale",
    severity: 0.38,
    taxonomy: "ICPC-2 L83",
    source: "Goniometria",
    note: "Rotazione sinistra limitata, nessun segno neurologico periferico.",
    measures: [
      { label: "Rotazione sx", value: "54 gradi", trend: "+7" },
      { label: "Rotazione dx", value: "68 gradi", trend: "stabile" },
    ],
  },
  {
    id: "f-hip-2018",
    areaId: "front-sx-inguinal",
    type: "injury",
    date: "2026-02-18",
    originalDate: "2018-09-08",
    label: "Precedente lesione adduttori",
    severity: 0.42,
    historical: true,
    taxonomy: "anamnesi storica",
    source: "Storia clinica",
    note: "Evento passato mantenuto come traccia storica con peso clinico decrescente.",
    measures: [
      { label: "Dolore attuale", value: "0/10", trend: "risolto" },
      { label: "Flessibilita adduttori", value: "simmetrica", trend: "ok" },
    ],
  },
  {
    id: "f-achilles-2024",
    areaId: "back-sx-achilles_tendon",
    type: "injury",
    date: "2026-03-12",
    originalDate: "2024-11-22",
    label: "Tendinopatia achillea pregressa",
    severity: 0.52,
    historical: true,
    taxonomy: "ICD-10 M76.6",
    source: "Documento importato",
    note: "Recidiva possibile in fase di aumento carico; monitorare stiffness mattutina.",
    measures: [
      { label: "Stiffness mattutina", value: "2/10", trend: "-2" },
      { label: "Heel raise", value: "22 rip.", trend: "+5" },
    ],
  },
  {
    id: "f-shoulder-strength",
    areaId: "front-dx-anterior_deltoid",
    type: "strength",
    date: "2026-06-27",
    label: "Deficit abduzione spalla",
    severity: 0.33,
    taxonomy: "custom: forza",
    source: "Dinamometria",
    note: "Differenza dx/sx sotto soglia critica ma ancora presente nel gesto sopra testa.",
    measures: [
      { label: "Abduzione dx", value: "18.4 kg", trend: "+1.2 kg" },
      { label: "Asimmetria", value: "11%", trend: "-4%" },
    ],
  },
];

export const loopSteps = [
  {
    label: "Motivo",
    state: "attivo",
    updated: "oggi",
    detail: "Dolore lombare dopo lavoro seduto, instabilita caviglia sx in discesa.",
  },
  {
    label: "Valutazione",
    state: "in corso",
    updated: "18 giu",
    detail: "ROM, forza e PROM completati; red flag neurologiche negative.",
  },
  {
    label: "Piano",
    state: "pronto",
    updated: "20 giu",
    detail: "4 settimane, focus estensione lombare, controllo anca e caviglia.",
  },
  {
    label: "Azione",
    state: "oggi",
    updated: "27 giu",
    detail: "Seduta manuale + progressione esercizi in app paziente.",
  },
  {
    label: "Monitoraggio",
    state: "programmato",
    updated: "ogni 10 giorni",
    detail: "PROM dolore/funzione e feedback RPE sugli esercizi.",
  },
];

export const metrics = [
  { label: "Severita media", value: "0.58", delta: "-0.07", tone: "ok" },
  { label: "Aree attive", value: "8", delta: "+1", tone: "warn" },
  { label: "Asimmetria max", value: "18%", delta: "-4%", tone: "ok" },
  { label: "Aderenza piano", value: "82%", delta: "+9%", tone: "ok" },
];

export const assessmentRows = [
  { test: "Estensione lombare", side: "centrale", value: "-28%", flag: "critico", push: "L4-L5" },
  { test: "Star Excursion Balance", side: "sx", value: "-9 cm", flag: "moderato", push: "caviglia laterale" },
  { test: "Dinamometria abduzione", side: "dx", value: "18.4 kg", flag: "lieve", push: "deltoide anteriore" },
  { test: "KOOS pain", side: "dx", value: "68/100", flag: "moderato", push: "rotula" },
];

export const planItems = [
  { when: "oggi", type: "trattamento", title: "Mobilita lombare e terapia fasciale", status: "da completare" },
  { when: "domani", type: "esercizi", title: "McGill curl-up, side plank, equilibrio caviglia", status: "in app" },
  { when: "1 lug", type: "PROM", title: "Dolore/funzione - invio automatico", status: "programmato" },
  { when: "4 lug", type: "assessment", title: "Retest SEBT e ROM lombare", status: "prenotato" },
];

export const promTrend = [
  { label: "18 feb", pain: 72, function: 44 },
  { label: "12 mar", pain: 66, function: 51 },
  { label: "3 apr", pain: 61, function: 56 },
  { label: "18 mag", pain: 54, function: 63 },
  { label: "oggi", pain: 41, function: 72 },
];

export const protocolRows = [
  { name: "Lombalgia meccanica - fase 1", days: "14 giorni", items: "9 attivita", state: "applicato" },
  { name: "Caviglia inversione - controllo", days: "21 giorni", items: "12 attivita", state: "bozza" },
  { name: "Return to daily load", days: "28 giorni", items: "16 attivita", state: "template" },
];

export const exerciseRows = [
  { name: "Side plank modificato", tags: ["core", "lombare"], rx: "3 x 20 sec", feedback: "RPE + durata" },
  { name: "Balance reach", tags: ["caviglia", "propriocezione"], rx: "4 x 6", feedback: "dolore" },
  { name: "Hip hinge con bastone", tags: ["anca", "controllo"], rx: "3 x 8", feedback: "qualita" },
];

export const aiCards = [
  {
    title: "Sintesi storico",
    body: "Trend favorevole su dolore e funzione; resta criticita lombare in estensione e controllo caviglia sx.",
    state: "da revisionare",
  },
  {
    title: "Bozza piano",
    body: "Mantenere carico basso-moderato per 7 giorni, retest SEBT e progressione solo se dolore sotto 3/10.",
    state: "modificabile",
  },
  {
    title: "Triage red flag",
    body: "Nessun pattern neurologico progressivo nei dati inseriti; rivalutare se compaiono parestesie persistenti.",
    state: "ok",
  },
];

export const networkRows = [
  { person: "Osteopata", access: "piano e note", state: "attivo" },
  { person: "Medico curante", access: "report PDF", state: "invitato" },
  { person: "Paziente", access: "consensi e app", state: "attivo" },
];
