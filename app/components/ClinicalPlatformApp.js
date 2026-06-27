"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Brain,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  FileText,
  HeartPulse,
  KeyRound,
  ListChecks,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Map,
  Mail,
  MessageSquare,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";
import BodyMap3D from "@/app/components/body-map-3d/BodyMap3D";
import {
  clinicalLoop,
  consentRows,
  mapRegions,
  patientExercises,
  patientTasks,
  patientWorkups,
  patients,
  todayActions,
} from "@/app/data/productData";
import { getSupabaseClient, supabaseConfig } from "@/app/lib/supabaseClient";

const practitionerSections = [
  { id: "today", label: "Oggi", icon: ListChecks },
  { id: "map", label: "Body map", icon: Map },
  { id: "assessment", label: "Valutazione", icon: ClipboardList },
  { id: "plan", label: "Piano", icon: CalendarDays },
  { id: "monitor", label: "Monitoraggio", icon: Activity },
];

const patientSections = [
  { id: "home", label: "Oggi", icon: ListChecks },
  { id: "program", label: "Piano", icon: CalendarDays },
  { id: "exercises", label: "Esercizi", icon: Dumbbell },
  { id: "proms", label: "Questionari", icon: FileText },
  { id: "consents", label: "Consensi", icon: LockKeyhole },
];

const filterLabels = {
  symptom: "sintomi",
  dysfunction: "disfunzioni",
  trigger: "trigger",
  rom: "ROM",
  strength: "forza",
  history: "storico",
};

const allTypes = Object.keys(filterLabels);

function getLockedRole(session) {
  const role = session?.user?.app_metadata?.clinicaos_role || session?.user?.app_metadata?.role;
  return role === "practitioner" || role === "patient" ? role : null;
}

function severityLabel(value) {
  if (value >= 0.75) return "critico";
  if (value >= 0.45) return "moderato";
  return "lieve";
}

function toneClass(value) {
  if (value === "alto" || value === "critico") return "tone-high";
  if (value === "medio" || value === "moderato") return "tone-mid";
  return "tone-low";
}

function RoleSwitch({ role, setRole, lockedRole }) {
  return (
    <div className="role-switch" aria-label="Ruolo">
      <button
        type="button"
        className={role === "practitioner" ? "active" : ""}
        disabled={Boolean(lockedRole && lockedRole !== "practitioner")}
        onClick={() => setRole("practitioner")}
      >
        <UserRound size={16} />
        professionista
      </button>
      <button
        type="button"
        className={role === "patient" ? "active" : ""}
        disabled={Boolean(lockedRole && lockedRole !== "patient")}
        onClick={() => setRole("patient")}
      >
        <HeartPulse size={16} />
        paziente
      </button>
    </div>
  );
}

function AppHeader({
  role,
  setRole,
  theme,
  setTheme,
  selectedPatient,
  patientMenuOpen,
  setPatientMenuOpen,
  onSelectPatient,
  session,
  onSignOut,
  lockedRole,
}) {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-mark">
          <HeartPulse size={21} />
        </div>
        <div>
          <span>ClinicaOS</span>
          <strong>{role === "practitioner" ? "Studio clinico" : selectedPatient.name}</strong>
        </div>
      </div>

      <RoleSwitch role={role} setRole={setRole} lockedRole={lockedRole} />

      <div className="header-actions">
        {role === "practitioner" && (
          <div className="patient-picker">
            <button
              type="button"
              className="search-pill"
              onClick={() => setPatientMenuOpen(!patientMenuOpen)}
              aria-expanded={patientMenuOpen}
            >
              <Search size={16} />
              {selectedPatient.name}
            </button>
            {patientMenuOpen && (
              <div className="patient-menu">
                {patients.map((patient) => (
                  <button
                    type="button"
                    key={patient.id}
                    onClick={() => {
                      onSelectPatient(patient.id);
                      setPatientMenuOpen(false);
                    }}
                  >
                    <span>
                      <strong>{patient.name}</strong>
                      <small>{patient.reason}</small>
                    </span>
                    <i className={toneClass(patient.risk)}>{patient.risk}</i>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="account-pill" title={session?.user?.email || "Account"}>
          <ShieldCheck size={16} />
          <span>{session?.user?.email || "utente"}</span>
        </div>
        <button
          type="button"
          className="icon-action"
          aria-label="Tema"
          title="Tema"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button type="button" className="icon-action" aria-label="Esci" title="Esci" onClick={onSignOut}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

function AuthGate({ children, theme, setTheme }) {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(supabaseConfig.isConfigured);
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setInitializing(false);
      return undefined;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) setSession(data.session || null);
      })
      .finally(() => {
        if (mounted) setInitializing(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession || null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!supabase || submitting) return;

    setSubmitting(true);
    setMessage("");

    const cleanEmail = email.trim();
    const credentials = { email: cleanEmail, password };
    const result =
      mode === "sign-up" && supabaseConfig.allowSignup
        ? await supabase.auth.signUp({
            ...credentials,
            options: {
              emailRedirectTo:
                typeof window === "undefined"
                  ? undefined
                  : `${window.location.origin}${window.location.pathname}`,
            },
          })
        : await supabase.auth.signInWithPassword(credentials);

    setSubmitting(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "sign-up" && !result.data.session) {
      setMessage("Account creato. Controlla la mail per confermare l'accesso.");
      return;
    }

    setPassword("");
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  if (!supabaseConfig.isConfigured) {
    return (
      <main className="auth-shell" data-theme={theme}>
        <button
          type="button"
          className="auth-theme"
          aria-label="Tema"
          title="Tema"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <section className="auth-panel">
          <div className="auth-brand">
            <div className="brand-mark">
              <HeartPulse size={22} />
            </div>
            <div>
              <span>ClinicaOS</span>
              <strong>Supabase non configurato</strong>
            </div>
          </div>
          <div className="auth-copy">
            <h1>Accesso bloccato finche manca Supabase.</h1>
            <p>Serve un progetto Supabase personale con URL pubblico e publishable key.</p>
          </div>
          <div className="config-list">
            <code>NEXT_PUBLIC_SUPABASE_URL</code>
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>
          </div>
        </section>
      </main>
    );
  }

  if (initializing) {
    return (
      <main className="auth-shell" data-theme={theme}>
        <section className="auth-panel loading-panel">
          <LoaderCircle size={28} />
          <strong>Controllo sessione</strong>
        </section>
      </main>
    );
  }

  if (!session) {
    const isSignUp = supabaseConfig.allowSignup && mode === "sign-up";

    return (
      <main className="auth-shell" data-theme={theme}>
        <button
          type="button"
          className="auth-theme"
          aria-label="Tema"
          title="Tema"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <section className="auth-panel">
          <div className="auth-brand">
            <div className="brand-mark">
              <HeartPulse size={22} />
            </div>
            <div>
              <span>ClinicaOS</span>
              <strong>{isSignUp ? "Crea accesso" : "Accesso riservato"}</strong>
            </div>
          </div>

          <div className="auth-copy">
            <h1>{isSignUp ? "Registra un account." : "Entra con le credenziali."}</h1>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <i>
                <Mail size={16} />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </i>
            </label>
            <label>
              <span>Password</span>
              <i>
                <KeyRound size={16} />
                <input
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </i>
            </label>
            {message && <p className="auth-message">{message}</p>}
            <button type="submit" disabled={submitting}>
              {submitting && <LoaderCircle size={16} />}
              {isSignUp ? "crea account" : "accedi"}
            </button>
          </form>

          {supabaseConfig.allowSignup && (
            <button
              type="button"
              className="auth-mode"
              onClick={() => {
                setMode(isSignUp ? "sign-in" : "sign-up");
                setMessage("");
              }}
            >
              {isSignUp ? "ho gia un account" : "crea un nuovo accesso"}
            </button>
          )}
        </section>
      </main>
    );
  }

  return children({ session, onSignOut: handleSignOut });
}

function PatientSummary({ role, selectedPatient, setActiveSection }) {
  return (
    <section className="patient-focus">
      <div>
        <span className="kicker">
          {role === "practitioner" ? "vista professionista" : "vista paziente"}
        </span>
        <h1>{selectedPatient.reason}</h1>
        <p>{selectedPatient.nextStep}</p>
      </div>
      <div className="patient-state">
        <div>
          <span>Paziente</span>
          <strong>{selectedPatient.name}</strong>
        </div>
        <div>
          <span>Stato</span>
          <strong>{selectedPatient.status}</strong>
        </div>
        <div>
          <span>Consensi</span>
          <strong>
            <ShieldCheck size={16} />
            {selectedPatient.consent}
          </strong>
        </div>
        <button
          type="button"
          onClick={() => setActiveSection(role === "practitioner" ? "map" : "program")}
        >
          {role === "practitioner" ? "apri body map" : "apri piano"}
        </button>
      </div>
    </section>
  );
}

function SectionNav({ role, activeSection, setActiveSection }) {
  const sections = role === "practitioner" ? practitionerSections : patientSections;

  return (
    <nav className="section-nav" aria-label="Sezioni app">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <button
            type="button"
            key={section.id}
            className={activeSection === section.id ? "active" : ""}
            onClick={() => setActiveSection(section.id)}
          >
            <Icon size={18} />
            <span>{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function TodayView({ setActiveSection, setSelectedDetail }) {
  return (
    <section className="view-grid today-grid">
      <div className="focus-panel main-task">
        <span className="kicker">prossima decisione</span>
        <h2>Rivaluta la zona lombare prima di cambiare il piano.</h2>
        <p>La schermata mostra solo le azioni necessarie per chiudere la seduta.</p>
        <button type="button" onClick={() => setActiveSection("map")}>
          vai alla body map
        </button>
      </div>

      <div className="action-stack">
        {todayActions.map((action) => (
          <button
            type="button"
            key={action.id}
            onClick={() => {
              setSelectedDetail(action);
              setActiveSection(action.target);
            }}
          >
            <span>
              <strong>{action.title}</strong>
              <small>{action.detail}</small>
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
      </div>

      <div className="loop-strip">
        {clinicalLoop.map((item, index) => (
          <button type="button" key={item.id} onClick={() => setActiveSection(item.id)}>
            <i>{index + 1}</i>
            <span>
              <strong>{item.label}</strong>
              <small>{item.summary}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function BodyMapView({ regions, activeTypes, setActiveTypes, selectedRegionId, setSelectedRegionId }) {
  const selectedRegion = regions.find((region) => region.id === selectedRegionId) || regions[0];
  const activeRegions = useMemo(
    () => regions.filter((region) => activeTypes.has(region.type)),
    [regions, activeTypes]
  );

  function toggleType(type) {
    setActiveTypes((current) => {
      const next = new Set(current);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next.size ? next : new Set([type]);
    });
  }

  return (
    <section className="body-map-module">
      <div className="module-header">
        <div>
          <span className="kicker">strumento professionista</span>
          <h2>Body map 3D</h2>
        </div>
        <div className="type-filters">
          {allTypes.map((type) => (
            <button
              type="button"
              key={type}
              className={activeTypes.has(type) ? "active" : ""}
              onClick={() => toggleType(type)}
            >
              {filterLabels[type]}
            </button>
          ))}
        </div>
      </div>

      <div className="atlas-layout">
        <BodyMap3D
          regions={regions}
          selectedId={selectedRegionId}
          onSelect={setSelectedRegionId}
          activeTypes={activeTypes}
        />
        <aside className="region-panel">
          <div className="region-current">
            <span>{selectedRegion.group}</span>
            <h3>{selectedRegion.label}</h3>
            <i className={toneClass(severityLabel(selectedRegion.severity))}>
              {severityLabel(selectedRegion.severity)}
            </i>
            <p>{selectedRegion.summary}</p>
            <strong>{selectedRegion.next}</strong>
          </div>

          <div className="region-list">
            {activeRegions.map((region) => {
              const level = severityLabel(region.severity);
              return (
                <button
                  type="button"
                  key={region.id}
                  className={region.id === selectedRegionId ? "active" : ""}
                  onClick={() => setSelectedRegionId(region.id)}
                >
                  <span>
                    <strong>{region.label}</strong>
                    <small>{region.side}</small>
                  </span>
                  <i className={toneClass(level)}>{level}</i>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}

function AssessmentView({ assessmentItems, selectedAssessmentId, setSelectedAssessmentId }) {
  const selected = assessmentItems.find((item) => item.id === selectedAssessmentId) || assessmentItems[0];

  return (
    <section className="simple-view two-column-view">
      <div className="focus-panel">
        <span className="kicker">valutazione</span>
        <h2>Tre misure, poi aggiorni la mappa.</h2>
        <p>{selected.detail}</p>
      </div>
      <div className="clean-list">
        {assessmentItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={item.id === selected.id ? "active" : ""}
            onClick={() => setSelectedAssessmentId(item.id)}
          >
            <span>
              <strong>{item.label}</strong>
              <small>ultimo valore</small>
            </span>
            <b>{item.value}</b>
            <i className={toneClass(item.state)}>{item.state}</i>
          </button>
        ))}
      </div>
    </section>
  );
}

function PlanView({ planItems, selectedPlanId, setSelectedPlanId }) {
  const selected = planItems.find((item) => item.id === selectedPlanId) || planItems[0];

  return (
    <section className="simple-view two-column-view">
      <div className="focus-panel">
        <span className="kicker">piano professionista</span>
        <h2>Una settimana alla volta.</h2>
        <p>{selected.title}</p>
      </div>
      <div className="clean-list">
        {planItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={item.id === selected.id ? "active" : ""}
            onClick={() => setSelectedPlanId(item.id)}
          >
            <span>
              <strong>{item.title}</strong>
              <small>{item.day}</small>
            </span>
            <i>{item.state}</i>
          </button>
        ))}
      </div>
    </section>
  );
}

function MonitorView({ promItems }) {
  return (
    <section className="simple-view">
      <div className="focus-panel">
        <span className="kicker">monitoraggio</span>
        <h2>Solo i trend che cambiano una decisione.</h2>
      </div>
      <div className="metric-row">
        {promItems.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.trend}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function PatientHome({ setActiveSection }) {
  return (
    <section className="simple-view">
      <div className="focus-panel">
        <span className="kicker">oggi per te</span>
        <h2>Completa piano e feedback prima della prossima visita.</h2>
      </div>
      <div className="clean-list">
        {patientTasks.map((task) => (
          <button type="button" key={task.id} onClick={() => setActiveSection(task.id === "prom" ? "proms" : "program")}>
            <span>
              <strong>{task.title}</strong>
              <small>{task.detail}</small>
            </span>
            <i>{task.state}</i>
          </button>
        ))}
      </div>
    </section>
  );
}

function PatientProgram({ planItems }) {
  return (
    <section className="simple-view">
      <div className="focus-panel">
        <span className="kicker">piano paziente</span>
        <h2>Il piano inviato dallo studio.</h2>
      </div>
      <div className="clean-list">
        {planItems.slice(0, 2).map((item) => (
          <button type="button" key={item.id}>
            <span>
              <strong>{item.title}</strong>
              <small>{item.day}</small>
            </span>
            <Check size={17} />
          </button>
        ))}
      </div>
    </section>
  );
}

function PatientExercises() {
  return (
    <section className="simple-view">
      <div className="focus-panel">
        <span className="kicker">esercizi</span>
        <h2>Scheda di oggi.</h2>
      </div>
      <div className="clean-list">
        {patientExercises.map((exercise) => (
          <button type="button" key={exercise.id}>
            <span>
              <strong>{exercise.title}</strong>
              <small>{exercise.dose}</small>
            </span>
            <i>{exercise.feedback}</i>
          </button>
        ))}
      </div>
    </section>
  );
}

function PatientProms({ promItems }) {
  return (
    <section className="simple-view">
      <div className="focus-panel">
        <span className="kicker">questionari</span>
        <h2>Dolore e funzione.</h2>
      </div>
      <div className="metric-row">
        {promItems.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.trend}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function PatientConsents() {
  return (
    <section className="simple-view">
      <div className="focus-panel">
        <span className="kicker">consensi</span>
        <h2>Controllo accessi ai dati.</h2>
      </div>
      <div className="clean-list">
        {consentRows.map((row) => (
          <button type="button" key={row.id} className={row.active ? "active" : ""}>
            <span>
              <strong>{row.title}</strong>
              <small>{row.detail}</small>
            </span>
            <i>{row.active ? "attivo" : "non attivo"}</i>
          </button>
        ))}
      </div>
    </section>
  );
}

function AssistantPanel({ role, draftOpen, setDraftOpen }) {
  if (role === "patient") {
    return (
      <aside className="assistant-panel">
        <div>
          <MessageSquare size={18} />
          <span>messaggi</span>
        </div>
        <p>Ultimo messaggio dello studio: conferma esercizi entro stasera.</p>
        <button type="button">apri chat</button>
      </aside>
    );
  }

  return (
    <aside className="assistant-panel">
      <div>
        <Brain size={18} />
        <span>assistente clinico</span>
      </div>
      <p>La sintesi resta una bozza: conferma prima di salvare.</p>
      <button type="button" onClick={() => setDraftOpen(!draftOpen)}>
        <Sparkles size={16} />
        {draftOpen ? "nascondi bozza" : "prepara sintesi"}
      </button>
      {draftOpen && (
        <div className="draft-box">
          <strong>Bozza seduta</strong>
          <span>L4-L5 resta prioritario; progressione solo se dolore sotto 3/10.</span>
          <button type="button">approva</button>
        </div>
      )}
    </aside>
  );
}

function ActiveView(props) {
  if (props.role === "patient") {
    if (props.activeSection === "program") return <PatientProgram planItems={props.planItems} />;
    if (props.activeSection === "exercises") return <PatientExercises />;
    if (props.activeSection === "proms") return <PatientProms promItems={props.promItems} />;
    if (props.activeSection === "consents") return <PatientConsents />;
    return <PatientHome setActiveSection={props.setActiveSection} />;
  }

  if (props.activeSection === "map") return <BodyMapView {...props} />;
  if (props.activeSection === "assessment") return <AssessmentView {...props} />;
  if (props.activeSection === "plan" || props.activeSection === "action") return <PlanView {...props} />;
  if (props.activeSection === "monitor") return <MonitorView promItems={props.promItems} />;
  return <TodayView {...props} />;
}

function AuthenticatedShell({ theme, setTheme, session, onSignOut }) {
  const [role, setRole] = useState("practitioner");
  const [activeSection, setActiveSection] = useState("today");
  const [selectedPatientId, setSelectedPatientId] = useState("giulia");
  const [patientMenuOpen, setPatientMenuOpen] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState("lumbar-l4-l5");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState("lumbar-extension");
  const [selectedPlanId, setSelectedPlanId] = useState("manual");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [draftOpen, setDraftOpen] = useState(false);
  const [activeTypes, setActiveTypes] = useState(() => new Set(allTypes));

  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) || patients[0];
  const patientRegions = mapRegions.filter((region) => selectedPatient.regionIds.includes(region.id));
  const workup = patientWorkups[selectedPatient.id] || patientWorkups.giulia;
  const lockedRole = getLockedRole(session);

  useEffect(() => {
    if (lockedRole && lockedRole !== role) {
      switchRole(lockedRole, lockedRole);
    }
  }, [lockedRole, role]);

  function selectPatient(patientId) {
    const nextPatient = patients.find((patient) => patient.id === patientId) || patients[0];
    const nextWorkup = patientWorkups[nextPatient.id] || patientWorkups.giulia;
    setSelectedPatientId(nextPatient.id);
    setSelectedRegionId(nextPatient.primaryRegionId);
    setSelectedAssessmentId(nextWorkup.assessmentItems[0].id);
    setSelectedPlanId(nextWorkup.planItems[0].id);
    setPatientMenuOpen(false);
  }

  function switchRole(nextRole, lockedRole) {
    if (lockedRole && nextRole !== lockedRole) return;
    setRole(nextRole);
    setActiveSection(nextRole === "practitioner" ? "today" : "home");
    setPatientMenuOpen(false);
  }

  return (
    <div className="app-shell" data-theme={theme} data-role={role} data-section={activeSection}>
      <AppHeader
        role={role}
        setRole={(nextRole) => switchRole(nextRole, lockedRole)}
        theme={theme}
        setTheme={setTheme}
        selectedPatient={selectedPatient}
        patientMenuOpen={patientMenuOpen}
        setPatientMenuOpen={setPatientMenuOpen}
        onSelectPatient={selectPatient}
        session={session}
        onSignOut={onSignOut}
        lockedRole={lockedRole}
      />
      <PatientSummary role={role} selectedPatient={selectedPatient} setActiveSection={setActiveSection} />
      <div className="work-area">
        <SectionNav role={role} activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="active-view">
          <ActiveView
            role={role}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            activeTypes={activeTypes}
            setActiveTypes={setActiveTypes}
            regions={patientRegions}
            selectedRegionId={selectedRegionId}
            setSelectedRegionId={setSelectedRegionId}
            assessmentItems={workup.assessmentItems}
            planItems={workup.planItems}
            promItems={workup.promItems}
            selectedAssessmentId={selectedAssessmentId}
            setSelectedAssessmentId={setSelectedAssessmentId}
            selectedPlanId={selectedPlanId}
            setSelectedPlanId={setSelectedPlanId}
            selectedDetail={selectedDetail}
            setSelectedDetail={setSelectedDetail}
          />
        </main>
        <AssistantPanel role={role} draftOpen={draftOpen} setDraftOpen={setDraftOpen} />
      </div>
    </div>
  );
}

export default function ClinicalPlatformApp() {
  const [theme, setTheme] = useState("light");

  return (
    <AuthGate theme={theme} setTheme={setTheme}>
      {({ session, onSignOut }) => (
        <AuthenticatedShell theme={theme} setTheme={setTheme} session={session} onSignOut={onSignOut} />
      )}
    </AuthGate>
  );
}
