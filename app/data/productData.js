export const patient = {
  name: "Giulia R.",
  age: 42,
  status: "in trattamento",
  reason: "Lombalgia ricorrente e instabilita di caviglia sinistra.",
  nextStep: "Rivaluta L4-L5 e aggiorna il piano settimanale.",
};

export const todayActions = [
  {
    id: "review-map",
    title: "Apri body map",
    detail: "Guarda le aree attive e scegli cosa rivalutare.",
    target: "map",
  },
  {
    id: "run-assessment",
    title: "Nuova valutazione",
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
  { id: "reason", label: "Motivo", status: "attivo", summary: "Dolore lombare dopo seduta prolungata." },
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
  { label: "Estensione lombare", value: "-28%", state: "critico" },
  { label: "SEBT caviglia sx", value: "-9 cm", state: "moderato" },
  { label: "Dolore squat dx", value: "4/10", state: "moderato" },
];

export const planItems = [
  { day: "oggi", title: "Mobilita lombare + terapia fasciale", state: "da fare" },
  { day: "domani", title: "Side plank, balance reach, hip hinge", state: "in app" },
  { day: "4 lug", title: "Retest ROM lombare e SEBT", state: "prenotato" },
];

export const promItems = [
  { label: "Dolore", value: "4.1/10", trend: "-1.3" },
  { label: "Funzione", value: "72/100", trend: "+9" },
  { label: "Aderenza", value: "82%", trend: "+6" },
];
