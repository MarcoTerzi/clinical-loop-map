export const patients = [
  {
    id: "giulia",
    name: "Giulia R.",
    age: 42,
    status: "in trattamento",
    risk: "alto",
    reason: "Lombalgia ricorrente e instabilita di caviglia sinistra.",
    nextStep: "Rivaluta L4-L5 e aggiorna il piano settimanale.",
    consent: "attivo",
    primaryRegionId: "lumbar-l4-l5",
    regionIds: ["lumbar-l4-l5", "ankle-left", "knee-right", "achilles-left"],
  },
  {
    id: "luca",
    name: "Luca P.",
    age: 36,
    status: "monitoraggio",
    risk: "medio",
    reason: "Dolore cervicale intermittente dopo lavoro al computer.",
    nextStep: "Controlla ROM cervicale e PROM dolore.",
    consent: "attivo",
    primaryRegionId: "cervical",
    regionIds: ["cervical", "scapula-right", "shoulder-right"],
  },
  {
    id: "marta",
    name: "Marta S.",
    age: 29,
    status: "piano attivo",
    risk: "basso",
    reason: "Rientro graduale al carico dopo dolore femoro-rotuleo.",
    nextStep: "Mantieni piano e rivaluta fra 7 giorni.",
    consent: "attivo",
    primaryRegionId: "knee-right",
    regionIds: ["knee-right", "ankle-left"],
  },
];

export const todayActions = [
  {
    id: "review-map",
    title: "Rivaluta L4-L5",
    detail: "Apri la body map e registra l’esito del retest.",
    target: "map",
  },
  {
    id: "run-assessment",
    title: "Compila 3 misure",
    detail: "ROM lombare, SEBT caviglia, dolore in squat.",
    target: "assessment",
  },
  {
    id: "update-plan",
    title: "Aggiorna piano",
    detail: "Conferma gli esercizi dei prossimi 7 giorni.",
    target: "plan",
  },
];

export const clinicalLoop = [
  { id: "today", label: "Motivo", status: "aperto", summary: "Dolore lombare dopo seduta prolungata." },
  { id: "assessment", label: "Valutazione", status: "oggi", summary: "Estensione lombare ancora critica." },
  { id: "plan", label: "Piano", status: "da aggiornare", summary: "Progressione a basso carico per 7 giorni." },
  { id: "action", label: "Azione", status: "in corso", summary: "Seduta manuale e controllo motorio." },
  { id: "monitor", label: "Monitoraggio", status: "programmato", summary: "PROM ogni 10 giorni." },
];

export const mapRegions = [
  {
    id: "lumbar-l4-l5",
    label: "Lombare L4-L5",
    group: "colonna",
    side: "centrale",
    type: "dysfunction",
    severity: 0.9,
    position: [0, -0.75, 0.1],
    scale: [0.34, 0.68, 0.22],
    summary: "Limitazione in estensione, dolore 7/10 a fine range.",
    next: "Retest estensione e dolore dopo mobilizzazione.",
  },
  {
    id: "ankle-left",
    label: "Caviglia sinistra",
    group: "arto inferiore",
    side: "sx",
    type: "dysfunction",
    severity: 0.72,
    position: [-1.15, -3.05, 0.08],
    scale: [0.28, 0.23, 0.23],
    summary: "Instabilita in inversione e SEBT ridotto.",
    next: "Riprova equilibrio monopodalico e eversori.",
  },
  {
    id: "knee-right",
    label: "Rotula destra",
    group: "arto inferiore",
    side: "dx",
    type: "symptom",
    severity: 0.48,
    position: [0.78, -2.12, 0.18],
    scale: [0.26, 0.26, 0.18],
    summary: "Dolore femoro-rotuleo in squat oltre 70 gradi.",
    next: "Controlla dolore e tracking rotuleo.",
  },
  {
    id: "scapula-right",
    label: "Scapola destra",
    group: "cingolo scapolare",
    side: "dx",
    type: "trigger",
    severity: 0.58,
    position: [0.62, 0.86, -0.18],
    scale: [0.36, 0.31, 0.17],
    summary: "Trigger point sottoscapolare, dolore riferito.",
    next: "Palpazione e rotazione esterna.",
  },
  {
    id: "cervical",
    label: "Cervicale C4-C6",
    group: "colonna",
    side: "centrale",
    type: "rom",
    severity: 0.36,
    position: [0, 1.82, 0.08],
    scale: [0.23, 0.42, 0.18],
    summary: "Rotazione sinistra ridotta, no segni neurologici.",
    next: "Rimisura rotazione e sintomi periferici.",
  },
  {
    id: "achilles-left",
    label: "Achille sinistro",
    group: "arto inferiore",
    side: "sx",
    type: "history",
    severity: 0.42,
    position: [-0.9, -3.45, -0.05],
    scale: [0.18, 0.34, 0.16],
    summary: "Tendinopatia pregressa, peso storico in calo.",
    next: "Monitora stiffness mattutina se aumenta il carico.",
  },
  {
    id: "shoulder-right",
    label: "Spalla destra",
    group: "arto superiore",
    side: "dx",
    type: "strength",
    severity: 0.32,
    position: [1.18, 1.06, 0.02],
    scale: [0.32, 0.32, 0.22],
    summary: "Deficit lieve di abduzione sopra testa.",
    next: "Dinamometria e controllo scapolare.",
  },
];

export const assessmentItems = [
  {
    id: "lumbar-extension",
    label: "Estensione lombare",
    value: "-28%",
    state: "critico",
    detail: "Dolore a fine range, peggiora dopo seduta prolungata.",
  },
  {
    id: "sebt-left",
    label: "SEBT caviglia sx",
    value: "-9 cm",
    state: "moderato",
    detail: "Riduzione anteriore e lieve apprensione in carico.",
  },
  {
    id: "squat-pain",
    label: "Dolore squat dx",
    value: "4/10",
    state: "moderato",
    detail: "Dolore oltre 70 gradi senza versamento.",
  },
];

export const planItems = [
  { id: "manual", day: "oggi", title: "Mobilita lombare + terapia fasciale", state: "da fare" },
  { id: "exercise", day: "domani", title: "Side plank, balance reach, hip hinge", state: "in app" },
  { id: "retest", day: "4 lug", title: "Retest ROM lombare e SEBT", state: "prenotato" },
];

export const promItems = [
  { label: "Dolore", value: "4.1/10", trend: "-1.3" },
  { label: "Funzione", value: "72/100", trend: "+9" },
  { label: "Aderenza", value: "82%", trend: "+6" },
];

export const patientWorkups = {
  giulia: { assessmentItems, planItems, promItems },
  luca: {
    assessmentItems: [
      {
        id: "cervical-rotation",
        label: "Rotazione cervicale sx",
        value: "54°",
        state: "moderato",
        detail: "Limitazione senza irradiazione periferica.",
      },
      {
        id: "neck-pain",
        label: "Dolore cervicale",
        value: "5/10",
        state: "moderato",
        detail: "Peggiora dopo 90 minuti al computer.",
      },
      {
        id: "shoulder-abduction",
        label: "Abduzione spalla dx",
        value: "-11%",
        state: "lieve",
        detail: "Deficit lieve sopra testa, non doloroso.",
      },
    ],
    planItems: [
      { id: "desk-reset", day: "oggi", title: "Reset cervicale + educazione posturale", state: "da fare" },
      { id: "scapular", day: "domani", title: "Controllo scapolare e rotazione toracica", state: "in app" },
      { id: "cervical-retest", day: "3 lug", title: "Retest rotazione cervicale", state: "prenotato" },
    ],
    promItems: [
      { label: "Dolore", value: "5/10", trend: "-0.5" },
      { label: "Funzione", value: "66/100", trend: "+4" },
      { label: "Aderenza", value: "76%", trend: "+8" },
    ],
  },
  marta: {
    assessmentItems: [
      {
        id: "squat-pain-marta",
        label: "Dolore squat",
        value: "2/10",
        state: "lieve",
        detail: "Dolore solo oltre 80 gradi, in miglioramento.",
      },
      {
        id: "step-down",
        label: "Step down control",
        value: "buono",
        state: "lieve",
        detail: "Controllo valgismo migliorato.",
      },
      {
        id: "load-tolerance",
        label: "Tolleranza carico",
        value: "70%",
        state: "moderato",
        detail: "Progressione consentita ma senza picchi.",
      },
    ],
    planItems: [
      { id: "knee-strength", day: "oggi", title: "Forza quadricipite + controllo ginocchio", state: "in app" },
      { id: "load-run", day: "domani", title: "Cammino veloce progressivo", state: "programmato" },
      { id: "knee-retest", day: "5 lug", title: "Retest squat e step down", state: "prenotato" },
    ],
    promItems: [
      { label: "Dolore", value: "2.2/10", trend: "-1.1" },
      { label: "Funzione", value: "81/100", trend: "+7" },
      { label: "Aderenza", value: "90%", trend: "+3" },
    ],
  },
};

export const patientTasks = [
  { id: "exercise-today", title: "Esercizi di oggi", detail: "Side plank e controllo caviglia", state: "18 min" },
  { id: "prom", title: "Questionario dolore", detail: "3 domande rapide", state: "aperto" },
  { id: "appointment", title: "Prossimo appuntamento", detail: "29 giugno, 09:30", state: "studio" },
];

export const patientExercises = [
  { id: "side-plank", title: "Side plank modificato", dose: "3 x 20 sec", feedback: "RPE" },
  { id: "balance", title: "Balance reach", dose: "4 x 6", feedback: "dolore" },
  { id: "hip-hinge", title: "Hip hinge con bastone", dose: "3 x 8", feedback: "qualita" },
];

export const consentRows = [
  { id: "practitioner", title: "Dr. Marco Bianchi", detail: "cartella clinica completa", active: true },
  { id: "assistant", title: "Segreteria studio", detail: "agenda e anagrafica", active: true },
  { id: "report", title: "Medico curante", detail: "solo report condivisi", active: false },
];
